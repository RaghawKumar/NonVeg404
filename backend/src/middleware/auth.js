// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { db } = require('../database/db');

// Middleware for customer JWT authentication
function authenticateCustomer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = db.prepare('SELECT id, name, email, phone, role, loyalty_tier, loyalty_points, delivery_address FROM customers WHERE id = ?').get(decoded.id);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Customer not found' });
    }
    req.customer = {
      ...customer,
      address: customer.delivery_address ? JSON.parse(customer.delivery_address) : null,
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
}

// Optional customer authentication — continues even without token
function optionalCustomer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const customer = db.prepare('SELECT id, name, email, phone, role, loyalty_tier, loyalty_points, delivery_address FROM customers WHERE id = ?').get(decoded.id);
      req.customer = customer
        ? {
          ...customer,
          address: customer.delivery_address ? JSON.parse(customer.delivery_address) : null,
        }
        : null;
    } catch {
      req.customer = null;
    }
  } else {
    req.customer = null;
  }
  next();
}

// Middleware for admin JWT authentication
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin access requires authorization' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    const admin = db.prepare('SELECT id, name, email, role FROM admin_users WHERE id = ? AND active = 1').get(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found or deactivated' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Admin token invalid or expired' });
  }
}

// Require manager-level admin access
function requireManager(req, res, next) {
  if (!req.admin || req.admin.role !== 'manager') {
    return res.status(403).json({ success: false, message: 'Forbidden: Manager-level access required' });
  }
  next();
}

module.exports = { authenticateCustomer, optionalCustomer, authenticateAdmin, requireManager };
