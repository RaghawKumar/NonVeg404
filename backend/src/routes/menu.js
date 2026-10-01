// src/routes/menu.js - Public Menu Routes
const router = require('express').Router();
const { db } = require('../database/db');

// GET /api/menu - Get all food items (with optional category/search filter)
router.get('/', (req, res) => {
  const { category, search, featured, spice } = req.query;
  let query = 'SELECT * FROM food_items WHERE availability = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ? OR tech_tag LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (featured === 'true') {
    query += ' AND is_featured = 1';
  }
  if (spice) {
    query += ' AND spice_level = ?';
    params.push(spice);
  }
  query += ' ORDER BY is_featured DESC, rating DESC';

  const items = db.prepare(query).all(...params);

  // Attach addons to each item
  const result = items.map((item) => {
    const addons = db.prepare(`
      SELECT a.id, a.name, a.price FROM addons a
      JOIN food_item_addons fia ON a.id = fia.addon_id
      WHERE fia.food_item_id = ? AND a.in_stock = 1
    `).all(item.id);

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price,
      image: item.image,
      category: item.category,
      spiceLevel: item.spice_level,
      availability: item.availability === 1,
      isFeatured: item.is_featured === 1,
      rating: item.rating,
      reviewsCount: item.reviews_count,
      prepTime: item.prep_time,
      calories: item.calories,
      techTag: item.tech_tag,
      addOns: addons,
    };
  });

  res.json({ success: true, data: result, total: result.length });
});

// GET /api/menu/:id - Get single food item
router.get('/:id', (req, res) => {
  const item = db.prepare('SELECT * FROM food_items WHERE id = ?').get(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const addons = db.prepare(`
    SELECT a.id, a.name, a.price FROM addons a
    JOIN food_item_addons fia ON a.id = fia.addon_id
    WHERE fia.food_item_id = ? AND a.in_stock = 1
  `).all(item.id);

  res.json({
    success: true,
    data: {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price,
      image: item.image,
      category: item.category,
      spiceLevel: item.spice_level,
      availability: item.availability === 1,
      isFeatured: item.is_featured === 1,
      rating: item.rating,
      reviewsCount: item.reviews_count,
      prepTime: item.prep_time,
      calories: item.calories,
      techTag: item.tech_tag,
      addOns: addons,
    },
  });
});

// GET /api/menu/categories/all - Get all categories
router.get('/categories/all', (req, res) => {
  const cats = db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY name').all();
  res.json({ success: true, data: cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    itemCount: c.item_count,
    active: c.active === 1,
  })) });
});

module.exports = router;
