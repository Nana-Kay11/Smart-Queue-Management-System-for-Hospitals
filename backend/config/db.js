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

// Enhanced Query Resolver for Neon Serverless
// This wrapper will automatically retry a query ONCE if the connection is terminated.
const originalQuery = pool.query.bind(pool);
pool.query = async (...args) => {
  try {
    return await originalQuery(...args);
  } catch (err) {
    if (err.message.includes('Connection terminated unexpectedly') || err.message.includes('ECONNRESET')) {
      console.log('🔄 Neon Connection Reset detected. Retrying query...');
      // Wait 100ms and retry once
      await new Promise(resolve => setTimeout(resolve, 100));
      return await originalQuery(...args);
    }
    throw err;
  }
};

module.exports = pool;
