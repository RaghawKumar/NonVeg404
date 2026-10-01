// src/routes/admin/settings.js - Admin Restaurant Settings
const router = require('express').Router();
const { db } = require('../../database/db');
const { requireManager } = require('../../middleware/auth');

// GET /api/admin/settings
router.get('/', (req, res) => {
  const row = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (!row) {
    return res.status(404).json({ success: false, message: 'Settings not found' });
  }

  res.json({
    success: true,
    settings: {
      restaurantName: row.restaurant_name,
      tagline: row.tagline,
      phone: row.phone,
      email: row.email,
      address: row.address,
      openingHours: row.opening_hours,
      lateNightShift: row.late_night_shift,
      isKitchenOpen: Boolean(row.is_kitchen_open),
      surgeActive: Boolean(row.surge_active),
      minOrderAmount: row.min_order_amount,
      freeDeliveryThreshold: row.free_delivery_threshold,
      deliveryFee: row.delivery_fee,
      deliveryRadiusKm: row.delivery_radius_km,
      taxRate: row.tax_rate,
      updatedAt: row.updated_at,
    },
  });
});

// PUT /api/admin/settings
router.put('/', requireManager, (req, res) => {
  const {
    restaurantName,
    tagline,
    phone,
    email,
    address,
    openingHours,
    lateNightShift,
    isKitchenOpen,
    surgeActive,
    minOrderAmount,
    freeDeliveryThreshold,
    deliveryFee,
    deliveryRadiusKm,
    taxRate,
  } = req.body;

  db.prepare(`
    UPDATE settings SET
      restaurant_name = COALESCE(?, restaurant_name),
      tagline = COALESCE(?, tagline),
      phone = COALESCE(?, phone),
      email = COALESCE(?, email),
      address = COALESCE(?, address),
      opening_hours = COALESCE(?, opening_hours),
      late_night_shift = COALESCE(?, late_night_shift),
      is_kitchen_open = COALESCE(?, is_kitchen_open),
      surge_active = COALESCE(?, surge_active),
      min_order_amount = COALESCE(?, min_order_amount),
      free_delivery_threshold = COALESCE(?, free_delivery_threshold),
      delivery_fee = COALESCE(?, delivery_fee),
      delivery_radius_km = COALESCE(?, delivery_radius_km),
      tax_rate = COALESCE(?, tax_rate),
      updated_at = datetime('now')
    WHERE id = 1
  `).run(
    restaurantName,
    tagline,
    phone,
    email,
    address,
    openingHours,
    lateNightShift,
    isKitchenOpen !== undefined ? (isKitchenOpen ? 1 : 0) : null,
    surgeActive !== undefined ? (surgeActive ? 1 : 0) : null,
    minOrderAmount !== undefined ? parseFloat(minOrderAmount) : null,
    freeDeliveryThreshold !== undefined ? parseFloat(freeDeliveryThreshold) : null,
    deliveryFee !== undefined ? parseFloat(deliveryFee) : null,
    deliveryRadiusKm !== undefined ? parseFloat(deliveryRadiusKm) : null,
    taxRate !== undefined ? parseFloat(taxRate) : null
  );

  res.json({
    success: true,
    message: 'System settings synced and saved',
  });
});

module.exports = router;
