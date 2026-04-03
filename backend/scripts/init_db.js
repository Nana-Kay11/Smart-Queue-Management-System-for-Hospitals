require('dotenv').config({ path: __dirname + '/../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    console.log('⏳ Starting table creation...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'patient', -- 'patient', 'staff', 'admin'
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // 2. OTP Verifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_verifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ OTP Verifications table created/verified');

    // 3. Service Points Table (e.g., OPD, Pharmacy, Lab)
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_points (
        id SERIAL PRIMARY KEY,
        department_name VARCHAR(100) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Service Points table created/verified');

    // 4. Tickets (Queue) Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_point_id INTEGER REFERENCES service_points(id) ON DELETE CASCADE,
        ticket_number VARCHAR(20) NOT NULL,
        priority VARCHAR(20) DEFAULT 'normal', -- 'normal', 'urgent'
        status VARCHAR(20) DEFAULT 'waiting', -- 'waiting', 'served', 'no-show'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tickets table created/verified');

    // Seed basic Service Points if they don't exist
    const seedPoints = await client.query('SELECT COUNT(*) FROM service_points');
    if (parseInt(seedPoints.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO service_points (department_name) VALUES 
        ('OPD Consultation'), 
        ('Pharmacy'), 
        ('Laboratory')
      `);
      console.log('🌱 Seeded default Service Points');
    }

    console.log('🎉 Database initialization completed successfully!');
  } catch (err) {
    console.error('❌ Error during database initialization:', err);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();
