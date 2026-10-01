// src/routes/admin/reservations.js - Admin Reservations Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/reservations
router.get('/', (req, res) => {
  const { status, date } = req.query;

  let query = 'SELECT * FROM reservations';
  const params = [];
  const conditions = [];

  if (status && status !== 'ALL') {
    conditions.push('status = ?');
    params.push(status.toUpperCase());
  }

  if (date) {
    conditions.push('date = ?');
    params.push(date);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY date DESC, time ASC';

  const list = db.prepare(query).all(...params);

  const formatted = list.map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone,
    guests: r.guests,
    date: r.date,
    time: r.time,
    tableZone: r.table_zone,
    specialRequests: r.special_requests,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  res.json({
    success: true,
    reservations: formatted,
    count: formatted.length,
  });
});

// PATCH /api/admin/reservations/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const result = db.prepare("UPDATE reservations SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status.toUpperCase(), id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  res.json({
    success: true,
    message: `Reservation status changed to ${status.toUpperCase()}`,
  });
});

// DELETE /api/admin/reservations/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM reservations WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Reservation not found' });
  }

  res.json({
    success: true,
    message: 'Reservation deleted',
  });
});

module.exports = router;
