const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendOTP } = require('../utils/emailService');

const router = express.Router();

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route: /api/auth/register
// Register user and send OTP
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(`📝 Registration attempt: ${email} (${name})`);
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // 1. Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      console.log(`⚠️ Email already registered: ${email}`);
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Save User to DB (is_verified = false by default)
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role || 'patient']
    );
    const user = newUser.rows[0];

    // 4. Generate OTP & Hash it
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, salt);
    console.log(`🔑 Verification OTP for ${email}: ${otp} (Valid for 10 mins)`);

    // 5. Save OTP to DB (Expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query(
      'INSERT INTO otp_verifications (user_id, otp_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, otpHash, expiresAt]
    );

    // 6. Send OTP via Email
    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.log('⚠️ Email skipped: using terminal OTP for local testing.');
    }

    res.status(201).json({ message: 'User registered! Please check the server terminal for your OTP.', userId: user.id });
  } catch (error) {
    console.error('❌ Registration system error:', error);
    res.status(500).json({ error: 'Critical server error during registration. Check terminal logs.' });
  }
});

// Route: /api/auth/verify-otp
// Verify the OTP and issue JWT
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ error: 'UserId and OTP are required' });
  }

  try {
    // 1. Get OTP record for user
    const otpRecord = await pool.query(
      'SELECT * FROM otp_verifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (otpRecord.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const verification = otpRecord.rows[0];

    // 2. Check if expired
    if (new Date() > new Date(verification.expires_at)) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // 3. Compare hashed OTP
    const isMatch = await bcrypt.compare(otp, verification.otp_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // 4. Update user to verified
    await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [userId]);

    // 5. Delete OTP record (cleanup)
    await pool.query('DELETE FROM otp_verifications WHERE user_id = $1', [userId]);

    // 6. Get User Data for Token
    const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // 7. Issue JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-for-dev',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Email verified successfully', token, user });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});

// Route: /api/auth/login
// Standard user login using email/password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // 2. Check if verified
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in', userId: user.id });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 4. Issue JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-for-dev',
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
