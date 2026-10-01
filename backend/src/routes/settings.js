// src/routes/settings.js - Public Restaurant Settings
const router = require('express').Router();
const { db } = require('../database/db');

// GET /api/settings - Get public restaurant settings (fees, hours, kitchen status)
router.get('/', (req, res) => {
  const s = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (!s) {
    return res.status(500).json({ success: false, message: 'Settings not initialized' });
  }

  res.json({
    success: true,
    data: {
      restaurantName: s.restaurant_name,
      tagline: s.tagline,
      phone: s.phone,
      email: s.email,
      address: s.address,
      openingHours: s.opening_hours,
      lateNightShift: s.late_night_shift,
      isKitchenOpen: s.is_kitchen_open === 1,
      surgeActive: s.surge_active === 1,
      minOrderAmount: s.min_order_amount,
      freeDeliveryThreshold: s.free_delivery_threshold,
      deliveryFee: s.surge_active ? s.delivery_fee * 1.5 : s.delivery_fee,
      deliveryRadiusKm: s.delivery_radius_km,
      taxRate: s.tax_rate,
    },
  });
});

// GET /api/health - System health ping
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: '200 OK',
    message: '// NON VEG 404 BACKEND API // Kernel running. Zero bugs.',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
