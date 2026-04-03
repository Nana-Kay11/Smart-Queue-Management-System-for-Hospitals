const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Aggressive settings for Neon Serverless
  max: 6, // Keep pool small for reliability
  idleTimeoutMillis: 10000, // Drop idle connections quickly (10s)
  connectionTimeoutMillis: 10000,
});

// Critical pool error handler
pool.on('error', (err) => {
  console.error('🌊 Pool Error (Catch-All):', err.message);
});

// Shield individual clients
pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.error('🛡️ Client Error (Catch-All):', err.message);
  });
});

module.exports = pool;
