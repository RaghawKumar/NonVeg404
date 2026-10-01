// src/index.js - NON VEG 404 Express Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { initDB } = require('./database/db');
const { seed } = require('./database/seed');

// Initialize database schema and seed initial data
initDB();
seed();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Utility Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Allow CORS for Next.js website (3000) and admin portal (3001) or any origin in dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route & Health Check
app.get('/', (req, res) => {
  res.json({
    brand: 'NON VEG 404',
    tagline: '// GOOD FOOD. NO BUGS. //',
    status: '200 OK',
    message: 'Backend API Kernel active and compiling orders.',
    endpoints: {
      health: '/api/health',
      menu: '/api/menu',
      orders: '/api/orders',
      reservations: '/api/reservations',
      coupons: '/api/coupons',
      reviews: '/api/reviews',
      settings: '/api/settings',
      auth: '/api/auth',
      admin: '/api/admin',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    kernel: 'Linux 4.0.4-nv-food',
    bugs: 0,
    hunger: '404 NOT FOUND',
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admin', require('./routes/admin/index'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: '404_NOT_FOUND',
    message: `Endpoint ${req.method} ${req.path} does not exist in kernel.`,
    suggestion: 'Check /api/menu or /api/orders',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[KERNEL PANIC]', err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected compilation error occurred.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   🍗  NON VEG 404 — BACKEND API SERVER                            ║
║   // GOOD FOOD. NO BUGS. //                                        ║
║                                                                    ║
║   ➜ Local URL:      http://localhost:${PORT}                          ║
║   ➜ API Health:     http://localhost:${PORT}/api/health               ║
║   ➜ Admin Root:     http://localhost:${PORT}/api/admin                ║
║   ➜ Database:       SQLite (WAL Mode Enabled)                      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
  `);
});
