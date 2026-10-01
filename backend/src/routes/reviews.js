// src/routes/reviews.js - Reviews Routes
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database/db');
const { optionalCustomer } = require('../middleware/auth');

// GET /api/reviews - Get approved featured reviews for website
router.get('/', (req, res) => {
  const reviews = db.prepare(`
    SELECT * FROM reviews WHERE approved = 1 ORDER BY featured DESC, created_at DESC LIMIT 10
  `).all();

  res.json({
    success: true,
    data: reviews.map((r) => ({
      id: r.id,
      author: r.author,
      role: r.role,
      rating: r.rating,
      comment: r.comment,
      dishOrdered: r.dish_ordered,
      commitHash: r.commit_hash,
      featured: r.featured === 1,
      date: r.created_at,
    })),
  });
});

// POST /api/reviews - Submit a review
router.post('/', optionalCustomer, (req, res) => {
  const { author, role, rating, comment, dishOrdered, orderId } = req.body;

  if (!comment || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Valid comment and rating (1-5) are required' });
  }

  const id = uuidv4();
  const commitHash = 'commit ' + Math.random().toString(16).substring(2, 9) + ': add review';
  const customerId = req.customer ? req.customer.id : null;
  const reviewAuthor = author || (req.customer ? req.customer.name : 'Anonymous Diner');
  const reviewRole = role || (req.customer ? req.customer.role : 'Developer');

  db.prepare(`
    INSERT INTO reviews (id, customer_id, order_id, author, role, rating, comment, dish_ordered, commit_hash, featured, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
  `).run(id, customerId, orderId || null, reviewAuthor, reviewRole, rating, comment, dishOrdered || '', commitHash);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully. It will appear after moderation.',
    reviewId: id,
  });
});

module.exports = router;
