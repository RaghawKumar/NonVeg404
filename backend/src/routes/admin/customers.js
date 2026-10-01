// src/routes/admin/customers.js - Admin Customers Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/customers
router.get('/', (req, res) => {
  const { search } = req.query;

  let query = `
    SELECT 
      c.*,
      COUNT(o.id) as total_orders,
      COALESCE(SUM(o.total), 0) as total_spent,
      MAX(o.created_at) as recent_order_date
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
  `;
  const params = [];

  if (search) {
    query += ' WHERE (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' GROUP BY c.id ORDER BY total_spent DESC';

  const customers = db.prepare(query).all(...params);

  const formatted = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    role: c.role,
    loyaltyTier: c.loyalty_tier,
    loyaltyPoints: c.loyalty_points,
    totalOrders: c.total_orders,
    totalSpent: Math.round(c.total_spent * 100) / 100,
    deliveryAddress: c.delivery_address,
    createdAt: c.created_at,
    lastOrderAt: c.recent_order_date || c.last_order_at,
  }));

  res.json({
    success: true,
    customers: formatted,
    total: formatted.length,
  });
});

// GET /api/admin/customers/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(id);

  res.json({
    success: true,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      loyaltyTier: customer.loyalty_tier,
      loyaltyPoints: customer.loyalty_points,
      deliveryAddress: customer.delivery_address,
      createdAt: customer.created_at,
      orders,
    },
  });
});

// PUT /api/admin/customers/:id - Update customer tier or points
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { loyaltyTier, loyaltyPoints, role } = req.body;

  const result = db.prepare(`
    UPDATE customers SET
      loyalty_tier = COALESCE(?, loyalty_tier),
      loyalty_points = COALESCE(?, loyalty_points),
      role = COALESCE(?, role)
    WHERE id = ?
  `).run(loyaltyTier, loyaltyPoints !== undefined ? parseInt(loyaltyPoints) : null, role, id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  res.json({
    success: true,
    message: 'Customer profile updated',
  });
});

module.exports = router;
