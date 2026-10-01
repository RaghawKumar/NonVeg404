// src/routes/admin/dashboard.js - Admin Metrics and Live Sudo Analytics
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/dashboard
router.get('/', (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE payment_status = 'PAID' OR status = 'DELIVERED'").get().rev;
    const pendingOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('INITIALIZED', 'RECEIVED', 'CONFIRMED')").get().cnt;
    const cookingOrders = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('PREPARING', 'COMPILING', 'PACKING', 'STAGING')").get().cnt;
    const outForDelivery = db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('OUT_FOR_DELIVERY', 'DEPLOYED')").get().cnt;

    const totalCustomers = db.prepare('SELECT COUNT(*) as cnt FROM customers').get().cnt;
    const outOfStockItems = db.prepare('SELECT COUNT(*) as cnt FROM food_items WHERE availability = 0').get().cnt;
    const reservationsToday = db.prepare("SELECT COUNT(*) as cnt FROM reservations WHERE date >= date('now')").get().cnt;

    // Recent 8 orders
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 8').all();
    const formattedRecentOrders = recentOrders.map((o) => {
      const items = db.prepare('SELECT name, quantity, price FROM order_items WHERE order_id = ?').all(o.id);
      return {
        id: o.id,
        customerName: o.customer_name,
        phone: o.phone,
        total: o.total,
        status: o.status,
        paymentStatus: o.payment_status,
        deliveryType: o.delivery_type,
        createdAt: o.created_at,
        itemsCount: items.reduce((acc, it) => acc + it.quantity, 0),
        itemsSummary: items.map((it) => `${it.quantity}x ${it.name}`).join(', '),
      };
    });

    // Top selling items
    const topDishes = db.prepare(`
      SELECT 
        oi.food_item_id,
        oi.name,
        SUM(oi.quantity) as order_count,
        SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      GROUP BY oi.name
      ORDER BY order_count DESC
      LIMIT 5
    `).all();

    // Kitchen health
    const settings = db.prepare('SELECT is_kitchen_open, surge_active FROM settings WHERE id = 1').get() || {};

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        cookingOrders,
        outForDelivery,
        totalCustomers,
        outOfStockItems,
        reservationsToday,
        isKitchenOpen: Boolean(settings.is_kitchen_open),
        surgeActive: Boolean(settings.surge_active),
      },
      recentOrders: formattedRecentOrders,
      topDishes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
