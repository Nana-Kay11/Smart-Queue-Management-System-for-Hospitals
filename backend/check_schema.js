require('dotenv').config();
const pool = require('./config/db');

async function checkSchema() {
  try {
    console.log('--- Checking Users Table ---');
    const usersRes = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'");
    console.log(JSON.stringify(usersRes.rows, null, 2));

    console.log('--- Checking OTP Verifications Table ---');
    const otpRes = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'otp_verifications'");
    console.log(JSON.stringify(otpRes.rows, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Schema check failed:', err);
    process.exit(1);
  }
}

checkSchema();
