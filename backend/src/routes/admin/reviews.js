// src/routes/admin/reviews.js - Admin Customer Reviews Management
const router = require('express').Router();
const { db } = require('../../database/db');

// GET /api/admin/reviews
router.get('/', (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
  const formatted = reviews.map((r) => ({
    id: r.id,
    author: r.author,
    role: r.role,
    rating: r.rating,
    comment: r.comment,
    dishOrdered: r.dish_ordered,
    commitHash: r.commit_hash,
    featured: Boolean(r.featured),
    approved: Boolean(r.approved),
    createdAt: r.created_at,
  }));

  res.json({
    success: true,
    reviews: formatted,
    count: formatted.length,
  });
});

// PATCH /api/admin/reviews/:id/approve
router.patch('/:id/approve', (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  const result = db.prepare('UPDATE reviews SET approved = ? WHERE id = ?').run(approved ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  res.json({
    success: true,
    message: `Review ${approved ? 'Approved' : 'Unapproved'}`,
  });
});

// PATCH /api/admin/reviews/:id/feature
router.patch('/:id/feature', (req, res) => {
  const { id } = req.params;
  const { featured } = req.body;

  const result = db.prepare('UPDATE reviews SET featured = ? WHERE id = ?').run(featured ? 1 : 0, id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  res.json({
    success: true,
    message: `Review ${featured ? 'Featured on homepage' : 'Unfeatured'}`,
  });
});

// DELETE /api/admin/reviews/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  res.json({
    success: true,
    message: 'Review deleted',
  });
});

module.exports = router;
