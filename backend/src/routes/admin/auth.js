// src/routes/admin/auth.js - Admin Portal Auth Routes
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../../database/db');
const { authenticateAdmin } = require('../../middleware/auth');

// POST /api/admin/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const admin = db.prepare('SELECT * FROM admin_users WHERE email = ? AND active = 1').get(email);
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  // Update last login
  db.prepare("UPDATE admin_users SET last_login = datetime('now') WHERE id = ?").run(admin.id);

  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_ADMIN_SECRET,
    { expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d' }
  );

  res.json({
    success: true,
    message: `Access Granted. Welcome, ${admin.name}. // KERNEL MODE ACTIVE //`,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// GET /api/admin/auth/me
router.get('/me', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

module.exports = router;
