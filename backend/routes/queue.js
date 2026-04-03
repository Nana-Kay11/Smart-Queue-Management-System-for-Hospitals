const express = require('express');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const defaultSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const decoded = jwt.verify(token.replace('Bearer ', ''), defaultSecret);
    req.user = decoded; // { id, role }
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Route: POST /api/queue/join
// Patient joins a queue
router.post('/join', authenticate, async (req, res) => {
  try {
    const { service_point_id, priority = 'normal' } = req.body;
    const userId = req.user.id;

    if (!service_point_id) {
      return res.status(400).json({ error: 'Service Point ID is required' });
    }

    // Check if user already has a waiting ticket anywhere
    const existing = await pool.query(
      "SELECT * FROM tickets WHERE user_id = $1 AND status = 'waiting'",
      [userId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You are already in a queue.', ticket: existing.rows[0] });
    }

    // Get prefix for ticket
    const spResult = await pool.query('SELECT department_name FROM service_points WHERE id = $1', [service_point_id]);
    if (spResult.rows.length === 0) return res.status(404).json({ error: 'Service point not found' });
    const deptPrefix = spResult.rows[0].department_name.substring(0, 3).toUpperCase();

    // Determine Ticket Number
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM tickets WHERE service_point_id = $1 AND created_at::date = CURRENT_DATE",
      [service_point_id]
    );
    const seq = parseInt(countResult.rows[0].count) + 1;
    const ticketNumber = `${deptPrefix}-${String(seq).padStart(3, '0')}`;

    // Create Ticket
    const newTicket = await pool.query(
      "INSERT INTO tickets (user_id, service_point_id, ticket_number, priority) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, service_point_id, ticketNumber, priority]
    );

    res.status(201).json({ message: 'Successfully joined queue', ticket: newTicket.rows[0] });
  } catch (error) {
    console.error('Join queue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: GET /api/queue/status
// Patient checks their position
router.get('/status', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's active ticket
    const ticketResult = await pool.query(
      "SELECT t.*, s.department_name FROM tickets t JOIN service_points s ON t.service_point_id = s.id WHERE t.user_id = $1 AND t.status = 'waiting' ORDER BY t.created_at DESC LIMIT 1",
      [userId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(200).json({ activeTicket: null });
    }

    const ticket = ticketResult.rows[0];

    // Calculate people ahead
    const aheadResult = await pool.query(
      "SELECT COUNT(*) FROM tickets WHERE service_point_id = $1 AND status = 'waiting' AND created_at < $2",
      [ticket.service_point_id, ticket.created_at]
    );
    const peopleAhead = parseInt(aheadResult.rows[0].count);
    const estimatedWaitMins = peopleAhead * 5; // Suppose 5 minutes per patient

    res.status(200).json({
      activeTicket: ticket,
      peopleAhead,
      estimatedWaitMins
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: POST /api/queue/call-next
// Staff calls the next patient
router.post('/call-next', authenticate, async (req, res) => {
  try {
    // Basic Role Check
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Requires staff privileges' });
    }

    const { service_point_id } = req.body;
    if (!service_point_id) return res.status(400).json({ error: 'Service Point ID is required' });

    // Fetch oldest waiting ticket (ignoring priority logic for simplicity, could do ORDER BY priority DESC, created_at ASC)
    const nextResult = await pool.query(
      "SELECT id FROM tickets WHERE service_point_id = $1 AND status = 'waiting' ORDER BY created_at ASC LIMIT 1",
      [service_point_id]
    );

    if (nextResult.rows.length === 0) {
      return res.status(200).json({ message: 'Queue is empty' });
    }

    const ticketId = nextResult.rows[0].id;

    // Update status to served
    const updated = await pool.query(
      "UPDATE tickets SET status = 'served' WHERE id = $1 RETURNING *",
      [ticketId]
    );

    res.status(200).json({ message: 'Patient called', ticket: updated.rows[0] });
  } catch (error) {
    console.error('Call next error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: GET /api/queue/service-points
// Fetch all active service points
router.get('/service-points', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM service_points WHERE is_active = TRUE ORDER BY department_name ASC');
    res.status(200).json({ servicePoints: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching service points' });
  }
});

module.exports = router;
