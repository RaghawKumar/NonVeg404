// src/routes/admin/categories.js - Admin Category Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/categories
router.get('/', (req, res) => {
  const categories = db.prepare(`
    SELECT c.*, 
      (SELECT COUNT(*) FROM food_items WHERE category = c.slug OR category = c.name) as actual_count
    FROM categories c
    ORDER BY c.created_at ASC
  `).all();

  const formatted = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    itemCount: c.actual_count || c.item_count,
    active: Boolean(c.active),
  }));

  res.json({
    success: true,
    categories: formatted,
  });
});

// POST /api/admin/categories
router.post('/', (req, res) => {
  const { name, icon, description, slug } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const id = 'cat-' + Math.random().toString(36).substring(2, 8);

  try {
    db.prepare(`
      INSERT INTO categories (id, name, slug, icon, description, item_count, active)
      VALUES (?, ?, ?, ?, ?, 0, 1)
    `).run(id, name, generatedSlug, icon || '🍽️', description || '');

    res.status(201).json({
      success: true,
      message: `Category "${name}" created`,
      category: { id, name, slug: generatedSlug, icon: icon || '🍽️', description: description || '', itemCount: 0, active: true },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create category: ' + err.message });
  }
});

// PUT /api/admin/categories/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, icon, description, active } = req.body;

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  db.prepare(`
    UPDATE categories SET
      name = COALESCE(?, name),
      icon = COALESCE(?, icon),
      description = COALESCE(?, description),
      active = COALESCE(?, active)
    WHERE id = ?
  `).run(
    name,
    icon,
    description,
    active !== undefined ? (active ? 1 : 0) : null,
    id
  );

  res.json({
    success: true,
    message: 'Category updated successfully',
  });
});

// DELETE /api/admin/categories/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.json({
    success: true,
    message: 'Category deleted',
  });
});

module.exports = router;
