// src/routes/orders.js - Customer Order Routes
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/db');
const { optionalCustomer, authenticateCustomer } = require('../middleware/auth');

const ORDER_STATUS_LABELS = {
  INITIALIZED: '< ORDER INITIALIZED />',
  ACCEPTED: '< ORDER ACCEPTED />',
  PREPARING: '< KITCHEN PREPARING BUILD />',
  READY: '< BUILD READY />',
  OUT_FOR_DELIVERY: '< DEPLOYING TO ADDRESS />',
  DELIVERED: '< BUILD SUCCESSFUL />',
};

const ORDER_CODE_LOGS = {
  INITIALIZED: '// Order payload compiled and encrypted. Payment verified. Pipeline queued.',
  ACCEPTED: '// Kitchen received order. Assigning chef thread. Ingredients allocated.',
  PREPARING: '// Active compilation: high-temperature clay tandoor threads running.',
  READY: '// Order packaged. Quality check: 200 OK. Awaiting dispatch.',
  OUT_FOR_DELIVERY: '// Rider process spawned. GPS location streaming. ETA: 20-30 mins.',
  DELIVERED: '// Delivery confirmed. Hunger status: 404 NOT FOUND. Order closed.',
};

// POST /api/orders - Place a new order
router.post('/', optionalCustomer, (req, res) => {
  const {
    customerName, phone, email, address, deliveryType, paymentMethod,
    paymentStatus, orderNotes, items, subtotal, tax, deliveryFee, discount, total,
    estimatedDeliveryTime, couponCode,
  } = req.body;

  if (!customerName || !phone || !email || !address || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required order fields' });
  }

  // Generate order ID in NV404 format
  const orderId = 'NV404-' + Math.floor(1000 + Math.random() * 9000);
  const customerId = req.customer ? req.customer.id : null;

  // Increment coupon usage if provided
  if (couponCode) {
    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1').get(couponCode);
    if (coupon) {
      db.prepare('UPDATE coupons SET usage_count = usage_count + 1 WHERE code = ?').run(couponCode);
    }
  }

  // Insert order
  db.prepare(`
    INSERT INTO orders (id, customer_name, customer_id, phone, email, address, delivery_type, 
      payment_method, payment_status, order_notes, subtotal, tax, delivery_fee, discount, 
      total, estimated_delivery_time, coupon_code, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'INITIALIZED')
  `).run(
    orderId, customerName, customerId, phone, email, address, deliveryType || 'delivery',
    paymentMethod || 'COD', paymentStatus || 'PENDING', orderNotes || null,
    subtotal, tax, deliveryFee, discount || 0, total,
    estimatedDeliveryTime || '30-40 mins', couponCode || null
  );

  // Insert order items
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, food_item_id, name, price, quantity)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertAddon = db.prepare(`
    INSERT INTO order_item_addons (order_item_id, addon_name, addon_price)
    VALUES (?, ?, ?)
  `);

  for (const item of items) {
    const foodItemId = item.foodItem ? item.foodItem.id : item.foodItemId;
    const itemName = item.foodItem ? item.foodItem.name : item.name;
    const itemPrice = item.foodItem ? item.foodItem.price : item.price;

    const result = insertItem.run(orderId, foodItemId, itemName, itemPrice, item.quantity);
    const orderItemId = result.lastInsertRowid;

    // Insert addons for this order item
    const addons = item.selectedAddOns || item.addOns || [];
    for (const addon of addons) {
      insertAddon.run(orderItemId, addon.name, addon.price);
    }
  }

  // Insert initial status history
  db.prepare(`
    INSERT INTO order_status_history (order_id, status, label, code_log)
    VALUES (?, 'INITIALIZED', ?, ?)
  `).run(orderId, ORDER_STATUS_LABELS.INITIALIZED, ORDER_CODE_LOGS.INITIALIZED);

  // Add loyalty points to authenticated customer
  if (req.customer) {
    const points = Math.floor(total * 2);
    db.prepare('UPDATE customers SET loyalty_points = loyalty_points + ?, last_order_at = datetime("now") WHERE id = ?')
      .run(points, req.customer.id);

    // Update loyalty tier
    const updated = db.prepare('SELECT loyalty_points FROM customers WHERE id = ?').get(req.customer.id);
    let newTier = 'Script Kiddie';
    if (updated.loyalty_points >= 500) newTier = 'Kernel VIP';
    else if (updated.loyalty_points >= 200) newTier = 'Sudo Dev';
    db.prepare('UPDATE customers SET loyalty_tier = ? WHERE id = ?').run(newTier, req.customer.id);
  }

  res.status(201).json({
    success: true,
    message: '// ORDER DEPLOYED TO KITCHEN PIPELINE //',
    order: { id: orderId, status: 'INITIALIZED', customerName, total, estimatedDeliveryTime: estimatedDeliveryTime || '30-40 mins' },
  });
});

// GET /api/orders/:id - Get order details + status history
router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  const itemsWithAddons = orderItems.map((item) => {
    const addons = db.prepare('SELECT * FROM order_item_addons WHERE order_item_id = ?').all(item.id);
    return { ...item, addOns: addons };
  });

  const statusHistory = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC').all(order.id);

  const formattedOrder = {
    id: order.id,
    customerName: order.customer_name,
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
    createdAt: order.created_at,
    items: itemsWithAddons,
    statusHistory: statusHistory.map((s) => ({
      status: s.status,
      label: s.label,
      codeLog: s.code_log,
      timestamp: s.created_at,
    })),
    timeline: statusHistory,
  };

  res.json({
    success: true,
    data: formattedOrder,
    order: formattedOrder,
    timeline: statusHistory,
  });
});

// GET /api/orders/customer/my-orders - Get current customer's orders
router.get('/customer/my-orders', authenticateCustomer, (req, res) => {
  const orders = db.prepare(`
    SELECT id, status, total, created_at, delivery_type, payment_method, estimated_delivery_time
    FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 20
  `).all(req.customer.id);

  res.json({ success: true, data: orders });
});

module.exports = router;
