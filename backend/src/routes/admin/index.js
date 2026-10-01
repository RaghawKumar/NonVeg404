// src/routes/admin/index.js - Admin Routes Aggregator
const router = require('express').Router();
const { authenticateAdmin, requireManager } = require('../../middleware/auth');

router.use('/auth', require('./auth'));

// All routes below require admin authentication
router.use(authenticateAdmin);

router.use('/orders', require('./orders'));
router.use('/menu', require('./menu'));
router.use('/categories', require('./categories'));
router.use('/addons', require('./addons'));
router.use('/customers', require('./customers'));
router.use('/reservations', require('./reservations'));
router.use('/coupons', require('./coupons'));
router.use('/reviews', require('./reviews'));
router.use('/settings', require('./settings'));
router.use('/dashboard', require('./dashboard'));

module.exports = router;
