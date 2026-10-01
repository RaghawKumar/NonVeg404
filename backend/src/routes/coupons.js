// src/routes/coupons.js - Coupon Validation
const router = require('express').Router();
const { db } = require('../database/db');

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  const { code, orderTotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }

  const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').get(code.toUpperCase());

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
    return res.status(400).json({ success: false, message: 'This coupon has expired' });
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }

  if (orderTotal && coupon.min_order > orderTotal) {
    return res.status(400).json({
      success: false,
      message: `Minimum order of ₹${coupon.min_order.toFixed(2)} required for this coupon`,
    });
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (orderTotal || 0) * (coupon.value / 100);
  } else {
    discount = coupon.value;
  }

  res.json({
    success: true,
    message: `// COUPON AUTHORIZED // ${coupon.description}`,
    coupon: {
      code: coupon.code,
      discountType: coupon.discount_type,
      value: coupon.value,
      minOrder: coupon.min_order,
      description: coupon.description,
      discount: Math.round(discount * 100) / 100,
    },
  });
});

// GET /api/coupons - Get all active coupons (for display on /offers page)
router.get('/', (req, res) => {
  const coupons = db.prepare(`
    SELECT code, discount_type, value, min_order, description 
    FROM coupons WHERE active = 1
    ORDER BY value DESC
  `).all();

  res.json({ success: true, data: coupons.map((c) => ({
    code: c.code,
    discountType: c.discount_type,
    value: c.value,
    minOrder: c.min_order,
    description: c.description,
  })) });
});

module.exports = router;
