// src/routes/reservations.js - Customer Reservation Routes
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/db');

// POST /api/reservations - Create a new reservation
router.post('/', (req, res) => {
  const { customerName, email, phone, guests, date, time, tableZone, specialRequests } = req.body;

  if (!customerName || !email || !phone || !guests || !date || !time) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
  }

  const id = uuidv4();
  db.prepare(`
    INSERT INTO reservations (id, customer_name, email, phone, guests, date, time, table_zone, special_requests, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
  `).run(id, customerName, email, phone, guests, date, time, tableZone || 'Core #01', specialRequests || null);

  res.status(201).json({
    success: true,
    message: '// RESERVATION THREAD INITIALIZED // Our team will confirm within 30 minutes.',
    reservation: { id, customerName, date, time, tableZone, status: 'PENDING' },
  });
});

// GET /api/reservations/:id - Get a reservation status
router.get('/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
  if (!r) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }
  res.json({ success: true, data: r });
});

module.exports = router;
