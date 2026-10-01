// src/routes/admin/menu.js - Admin Menu Items Management
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../database/db');

// GET /api/admin/menu
router.get('/', (req, res) => {
  const { category, search } = req.query;

  let query = 'SELECT * FROM food_items';
  const params = [];
  const conditions = [];

  if (category && category !== 'ALL') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ? OR tech_tag LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const items = db.prepare(query).all(...params);

  // Attach addon IDs to each item
  const itemsWithAddons = items.map((item) => {
    const addons = db.prepare(`
      SELECT a.* FROM addons a
      JOIN food_item_addons fia ON a.id = fia.addon_id
      WHERE fia.food_item_id = ?
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
      availability: Boolean(item.availability),
      isFeatured: Boolean(item.is_featured),
      rating: item.rating,
      reviewsCount: item.reviews_count,
      prepTime: item.prep_time,
      calories: item.calories,
      techTag: item.tech_tag,
      addons: addons.map((a) => a.id),
      addonDetails: addons,
    };
  });

  res.json({
    success: true,
    items: itemsWithAddons,
    count: itemsWithAddons.length,
  });
});

function sanitizeImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (trimmed.includes('google.com/imgres')) {
    try {
      const parsed = new URL(trimmed);
      const real = parsed.searchParams.get('imgurl');
      if (real) return decodeURIComponent(real);
    } catch {}
  }
  return trimmed;
}

// POST /api/admin/menu - Create new food item
router.post('/', (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    image,
    category,
    spiceLevel = 'Medium',
    availability = true,
    isFeatured = false,
    prepTime = '20 min',
    calories,
    techTag,
    addons = [],
  } = req.body;

  const cleanImage = sanitizeImageUrl(image);

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
  }

  const id = 'nv-' + (name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)) + '-' + Math.random().toString(36).substring(2, 6);

  db.prepare(`
    INSERT INTO food_items (id, name, description, price, original_price, image, category, 
      spice_level, availability, is_featured, prep_time, calories, tech_tag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    name,
    description || '',
    parseFloat(price),
    originalPrice ? parseFloat(originalPrice) : null,
    cleanImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    category,
    spiceLevel,
    availability ? 1 : 0,
    isFeatured ? 1 : 0,
    prepTime,
    calories ? parseInt(calories) : null,
    techTag || null
  );

  // Link addons
  if (Array.isArray(addons) && addons.length > 0) {
    const insertAddonLink = db.prepare('INSERT OR IGNORE INTO food_item_addons (food_item_id, addon_id) VALUES (?, ?)');
    for (const addonId of addons) {
      insertAddonLink.run(id, addonId);
    }
  }

  // Update category item_count
  db.prepare('UPDATE categories SET item_count = item_count + 1 WHERE slug = ? OR name = ?').run(category, category);

  res.status(201).json({
    success: true,
    message: `Dish "${name}" compiled and deployed successfully`,
    id,
  });
});

// PUT /api/admin/menu/:id - Update food item
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    originalPrice,
    image,
    category,
    spiceLevel,
    availability,
    isFeatured,
    prepTime,
    calories,
    techTag,
    addons,
  } = req.body;

  const existing = db.prepare('SELECT * FROM food_items WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const cleanImage = image ? sanitizeImageUrl(image) : null;

  db.prepare(`
    UPDATE food_items SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      original_price = ?,
      image = COALESCE(?, image),
      category = COALESCE(?, category),
      spice_level = COALESCE(?, spice_level),
      availability = COALESCE(?, availability),
      is_featured = COALESCE(?, is_featured),
      prep_time = COALESCE(?, prep_time),
      calories = ?,
      tech_tag = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name,
    description,
    price !== undefined ? parseFloat(price) : null,
    originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : existing.original_price,
    cleanImage,
    category,
    spiceLevel,
    availability !== undefined ? (availability ? 1 : 0) : null,
    isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
    prepTime,
    calories !== undefined ? (calories ? parseInt(calories) : null) : existing.calories,
    techTag !== undefined ? techTag : existing.tech_tag,
    id
  );

  // Update addons if provided
  if (Array.isArray(addons)) {
    db.prepare('DELETE FROM food_item_addons WHERE food_item_id = ?').run(id);
    const insertAddonLink = db.prepare('INSERT OR IGNORE INTO food_item_addons (food_item_id, addon_id) VALUES (?, ?)');
    for (const addonId of addons) {
      insertAddonLink.run(id, addonId);
    }
  }

  res.json({
    success: true,
    message: `Menu item ${id} updated successfully`,
  });
});

// PATCH /api/admin/menu/:id/availability
router.patch('/:id/availability', (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  const result = db.prepare("UPDATE food_items SET availability = ?, updated_at = datetime('now') WHERE id = ?").run(availability ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  res.json({
    success: true,
    message: `Item availability set to ${availability ? 'Available' : 'Sold Out'}`,
  });
});

// DELETE /api/admin/menu/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const item = db.prepare('SELECT category FROM food_items WHERE id = ?').get(id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  db.prepare('DELETE FROM food_item_addons WHERE food_item_id = ?').run(id);
  db.prepare('DELETE FROM food_items WHERE id = ?').run(id);

  // Decrement category count
  db.prepare('UPDATE categories SET item_count = MAX(0, item_count - 1) WHERE slug = ? OR name = ?').run(item.category, item.category);

  res.json({
    success: true,
    message: `Item ${id} removed from menu`,
  });
});

module.exports = router;
