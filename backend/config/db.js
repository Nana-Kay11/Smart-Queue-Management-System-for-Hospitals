const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Aggressive settings for Neon Serverless
  max: 6, // Keep pool small for reliability
  idleTimeoutMillis: 10000, // Drop idle connections quickly (10s)
  connectionTimeoutMillis: 20000, // 20s timeout for cold boots
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
    const isNetworkError = 
      err.message.includes('terminated unexpectedly') || 
      err.message.includes('ECONNRESET') ||
      err.message.includes('connection timeout') ||
      err.message.includes('ETIMEDOUT');

    if (isNetworkError) {
      console.log(`🔄 Neon Connection Issue (${err.message.split(':')[0]}). Retrying query...`);
      // Wait 500ms and retry once
      await new Promise(resolve => setTimeout(resolve, 500));
      return await originalQuery(...args);
    }
    throw err;
  }
};

module.exports = pool;
