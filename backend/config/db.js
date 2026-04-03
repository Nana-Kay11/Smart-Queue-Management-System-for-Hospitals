const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Robust settings for serverless (Neon)
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Added to prevent the server from crashing on connection drops
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
