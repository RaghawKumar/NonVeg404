// src/routes/admin/orders.js - Admin Order Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/orders
router.get('/', (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  if (status && status !== 'ALL') {
    conditions.push('status = ?');
    params.push(status.toUpperCase());
  }

  if (search) {
    conditions.push('(id LIKE ? OR customer_name LIKE ? OR phone LIKE ? OR email LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const orders = db.prepare(query).all(...params);

  // Attach items to each order
  const ordersWithItems = orders.map((o) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
    const itemsWithAddons = items.map((item) => {
      const addons = db.prepare('SELECT * FROM order_item_addons WHERE order_item_id = ?').all(item.id);
      return {
        ...item,
        addons: addons.map((a) => a.addon_name),
      };
    });
    return {
      id: o.id,
      customerName: o.customer_name,
      customerId: o.customer_id,
      phone: o.phone,
      email: o.email,
      address: o.address,
      deliveryType: o.delivery_type,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderNotes: o.order_notes,
      subtotal: o.subtotal,
      tax: o.tax,
      deliveryFee: o.delivery_fee,
      discount: o.discount,
      total: o.total,
      status: o.status,
      estimatedDeliveryTime: o.estimated_delivery_time,
      couponCode: o.coupon_code,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: itemsWithAddons,
    };
  });

  const totalCount = db.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt;

  res.json({
    success: true,
    orders: ordersWithItems,
    total: totalCount,
  });
});

// GET /api/admin/orders/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const itemsWithAddons = items.map((item) => {
    const addons = db.prepare('SELECT * FROM order_item_addons WHERE order_item_id = ?').all(item.id);
    return {
      ...item,
      addons: addons.map((a) => a.addon_name),
    };
  });

  const timeline = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC').all(order.id);

  res.json({
    success: true,
    order: {
      id: order.id,
      customerName: order.customer_name,
      customerId: order.customer_id,
      phone: order.phone,
      email: order.email,
      address: order.address,
      deliveryType: order.delivery_type,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderNotes: order.order_notes,
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.delivery_fee,
      discount: order.discount,
      total: order.total,
      status: order.status,
      estimatedDeliveryTime: order.estimated_delivery_time,
      couponCode: order.coupon_code,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: itemsWithAddons,
      timeline,
    },
  });
});

// PATCH /api/admin/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const upperStatus = status.toUpperCase();
  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(upperStatus, id);

  const statusLabels = {
    INITIALIZED: 'Order Initialized',
    RECEIVED: 'Order Received & Acknowledged',
    CONFIRMED: 'Order Confirmed by Sudo Kitchen',
    PREPARING: 'Compiling Flavors (Cooking)',
    COMPILING: 'Compiling Flavors (Cooking)',
    PACKING: 'Staging & Quality Inspection',
    STAGING: 'Staging & Quality Inspection',
    OUT_FOR_DELIVERY: 'Dispatched / In Route',
    DEPLOYED: 'Dispatched / In Route',
    DELIVERED: 'Successfully Deployed (Delivered)',
    CANCELLED: 'SIGKILL / Order Aborted',
  };

  const label = statusLabels[upperStatus] || upperStatus;
  const codeLog = note || `[KERNEL_UPDATE] Status changed to ${upperStatus} by ${req.admin ? req.admin.name : 'Admin'}`;

  db.prepare(`
    INSERT INTO order_status_history (order_id, status, label, code_log)
    VALUES (?, ?, ?, ?)
  `).run(id, upperStatus, label, codeLog);

  res.json({
    success: true,
    message: `Order ${id} status updated to ${upperStatus}`,
    status: upperStatus,
  });
});

// PATCH /api/admin/orders/:id/payment
router.patch('/:id/payment', (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!paymentStatus) {
    return res.status(400).json({ success: false, message: 'paymentStatus is required' });
  }

  const result = db.prepare("UPDATE orders SET payment_status = ?, updated_at = datetime('now') WHERE id = ?").run(paymentStatus.toUpperCase(), id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({
    success: true,
    message: `Order payment status set to ${paymentStatus.toUpperCase()}`,
  });
});

module.exports = router;
