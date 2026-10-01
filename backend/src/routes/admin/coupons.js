// src/routes/admin/coupons.js - Admin Coupons / Promo Management
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../database/db');

// GET /api/admin/coupons
router.get('/', (req, res) => {
  const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
  const formatted = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discount_type,
    value: c.value,
    minOrder: c.min_order,
    description: c.description,
    usageCount: c.usage_count,
    usageLimit: c.usage_limit,
    active: Boolean(c.active),
    expiryDate: c.expiry_date,
    createdAt: c.created_at,
  }));

  res.json({
    success: true,
    coupons: formatted,
  });
});

// POST /api/admin/coupons
router.post('/', (req, res) => {
  const { code, discountType = 'percentage', value, minOrder = 0, description, usageLimit, expiryDate } = req.body;

  if (!code || value === undefined) {
    return res.status(400).json({ success: false, message: 'Code and discount value are required' });
  }

  const id = uuidv4();
  const normalizedCode = code.toUpperCase().trim();

  try {
    db.prepare(`
      INSERT INTO coupons (id, code, discount_type, value, min_order, description, usage_limit, expiry_date, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      id,
      normalizedCode,
      discountType,
      parseFloat(value),
      parseFloat(minOrder || 0),
      description || '',
      usageLimit ? parseInt(usageLimit) : null,
      expiryDate || null
    );

    res.status(201).json({
      success: true,
      message: `Coupon "${normalizedCode}" created successfully`,
      id,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create coupon: ' + err.message });
  }
});

// PUT /api/admin/coupons/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { code, discountType, value, minOrder, description, usageLimit, expiryDate, active } = req.body;

  const existing = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  db.prepare(`
    UPDATE coupons SET
      code = COALESCE(?, code),
      discount_type = COALESCE(?, discount_type),
      value = COALESCE(?, value),
      min_order = COALESCE(?, min_order),
      description = COALESCE(?, description),
      usage_limit = ?,
      expiry_date = ?,
      active = COALESCE(?, active)
    WHERE id = ?
  `).run(
    code ? code.toUpperCase().trim() : null,
    discountType,
    value !== undefined ? parseFloat(value) : null,
    minOrder !== undefined ? parseFloat(minOrder) : null,
    description,
    usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : existing.usage_limit,
    expiryDate !== undefined ? expiryDate : existing.expiry_date,
    active !== undefined ? (active ? 1 : 0) : null,
    id
  );

  res.json({
    success: true,
    message: 'Coupon updated successfully',
  });
});

// PATCH /api/admin/coupons/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  const result = db.prepare('UPDATE coupons SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.json({
    success: true,
    message: `Coupon ${active ? 'Activated' : 'Disabled'}`,
  });
});

// DELETE /api/admin/coupons/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM coupons WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.json({
    success: true,
    message: 'Coupon deleted',
  });
});

module.exports = router;
