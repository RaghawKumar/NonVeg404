// src/routes/admin/addons.js - Admin Food Addons Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/addons
router.get('/', (req, res) => {
  const addons = db.prepare('SELECT * FROM addons ORDER BY category, name').all();
  const formatted = addons.map((a) => ({
    id: a.id,
    name: a.name,
    price: a.price,
    category: a.category,
    inStock: Boolean(a.in_stock),
  }));

  res.json({
    success: true,
    addons: formatted,
  });
});

// POST /api/admin/addons
router.post('/', (req, res) => {
  const { name, price, category = 'General', inStock = true } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }

  const id = 'addon-' + Math.random().toString(36).substring(2, 8);

  db.prepare(`
    INSERT INTO addons (id, name, price, category, in_stock)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, parseFloat(price), category, inStock ? 1 : 0);

  res.status(201).json({
    success: true,
    message: `Addon "${name}" created`,
    addon: { id, name, price: parseFloat(price), category, inStock: Boolean(inStock) },
  });
});

// PUT /api/admin/addons/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, inStock } = req.body;

  const existing = db.prepare('SELECT * FROM addons WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Addon not found' });
  }

  db.prepare(`
    UPDATE addons SET
      name = COALESCE(?, name),
      price = COALESCE(?, price),
      category = COALESCE(?, category),
      in_stock = COALESCE(?, in_stock)
    WHERE id = ?
  `).run(
    name,
    price !== undefined ? parseFloat(price) : null,
    category,
    inStock !== undefined ? (inStock ? 1 : 0) : null,
    id
  );

  res.json({
    success: true,
    message: 'Addon updated successfully',
  });
});

// PATCH /api/admin/addons/:id/stock
router.patch('/:id/stock', (req, res) => {
  const { id } = req.params;
  const { inStock } = req.body;

  const result = db.prepare('UPDATE addons SET in_stock = ? WHERE id = ?').run(inStock ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Addon not found' });
  }

  res.json({
    success: true,
    message: `Stock status updated to ${inStock ? 'In Stock' : 'Out of Stock'}`,
  });
});

// DELETE /api/admin/addons/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM food_item_addons WHERE addon_id = ?').run(id);
  const result = db.prepare('DELETE FROM addons WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Addon not found' });
  }

  res.json({
    success: true,
    message: 'Addon deleted successfully',
  });
});

module.exports = router;
