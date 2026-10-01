// src/routes/auth.js - Customer Auth Routes
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/db');
const { authenticateCustomer } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, phone, password, role, address } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
  }

  const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const passwordHash = password ? bcrypt.hashSync(password, 10) : null;
  const id = uuidv4();
  const addressStr = address
    ? JSON.stringify({ street: address.street || '', city: address.city || 'Tech City', zipCode: address.zipCode || '94016', notes: address.notes || '' })
    : null;

  db.prepare(`
    INSERT INTO customers (id, name, email, phone, password_hash, role, loyalty_tier, loyalty_points, delivery_address)
    VALUES (?, ?, ?, ?, ?, ?, 'Script Kiddie', 50, ?)
  `).run(id, name, email, phone, passwordHash, role || 'Developer', addressStr);

  const customer = db.prepare('SELECT id, name, email, phone, role, loyalty_tier, loyalty_points, delivery_address FROM customers WHERE id = ?').get(id);

  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.status(201).json({
    success: true,
    message: '// ACCOUNT COMPILED SUCCESSFULLY // +50 Dev Points Credited',
    token,
    customer: {
      ...customer,
      address: customer.delivery_address ? JSON.parse(customer.delivery_address) : null,
    },
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email);
  if (!customer) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (customer.password_hash && password) {
    const valid = bcrypt.compareSync(password, customer.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }

  const token = jwt.sign({ id: customer.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.json({
    success: true,
    message: 'Authentication successful. Welcome back!',
    token,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      loyaltyTier: customer.loyalty_tier,
      points: customer.loyalty_points,
      address: customer.delivery_address ? JSON.parse(customer.delivery_address) : null,
    },
  });
});

// GET /api/auth/me
router.get('/me', authenticateCustomer, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id);
  res.json({
    success: true,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      loyaltyTier: customer.loyalty_tier,
      points: customer.loyalty_points,
      address: customer.delivery_address ? JSON.parse(customer.delivery_address) : null,
    },
  });
});

// PUT /api/auth/me - Update profile
router.put('/me', authenticateCustomer, (req, res) => {
  const { name, phone, role, address } = req.body;
  const addressStr = address ? JSON.stringify(address) : undefined;

  db.prepare(`
    UPDATE customers SET 
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      role = COALESCE(?, role),
      delivery_address = COALESCE(?, delivery_address)
    WHERE id = ?
  `).run(name || null, phone || null, role || null, addressStr || null, req.customer.id);

  const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id);
  res.json({
    success: true,
    customer: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      loyaltyTier: updated.loyalty_tier,
      points: updated.loyalty_points,
      address: updated.delivery_address ? JSON.parse(updated.delivery_address) : null,
    },
  });
});

module.exports = router;
