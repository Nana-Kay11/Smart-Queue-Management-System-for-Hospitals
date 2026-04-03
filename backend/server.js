require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const queueRoutes = require('./routes/queue');

app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);

// Test connection (using query instead of connect to avoid leaking clients)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Connected to Neon PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error', err.stack));

// Global process safety net
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🧨 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Queue Management System API is running!' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} (Available on all network interfaces)`);
});
