// src/database/db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || './data/nonveg404.db';
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

// Performance pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDB() {
  db.exec(`
    -- =============================================
    -- NON VEG 404 - Database Schema
    -- =============================================

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      restaurant_name TEXT NOT NULL DEFAULT 'NON VEG 404',
      tagline TEXT DEFAULT '// GOOD FOOD. NO BUGS. //',
      phone TEXT DEFAULT '+1 (555) 404-MEAT',
      email TEXT DEFAULT 'terminal@nonveg404.dev',
      address TEXT DEFAULT '404 Kernel Way, Silicon Grill District',
      opening_hours TEXT DEFAULT 'Mon - Sun: 11:00 AM - 02:00 AM',
      late_night_shift TEXT DEFAULT '10:00 PM - 02:00 AM Daily',
      is_kitchen_open INTEGER DEFAULT 1,
      surge_active INTEGER DEFAULT 0,
      min_order_amount REAL DEFAULT 20,
      free_delivery_threshold REAL DEFAULT 45,
      delivery_fee REAL DEFAULT 4.99,
      delivery_radius_km REAL DEFAULT 15,
      tax_rate REAL DEFAULT 0.05,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT '🍽️',
      description TEXT DEFAULT '',
      item_count INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      original_price REAL,
      image TEXT DEFAULT '',
      category TEXT NOT NULL,
      spice_level TEXT DEFAULT 'Medium',
      availability INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 0,
      prep_time TEXT DEFAULT '20 min',
      calories INTEGER,
      tech_tag TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS addons (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT DEFAULT 'General',
      in_stock INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS food_item_addons (
      food_item_id TEXT NOT NULL,
      addon_id TEXT NOT NULL,
      PRIMARY KEY (food_item_id, addon_id),
      FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
      FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'kitchen',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT,
      role TEXT DEFAULT 'Full-Stack Developer',
      loyalty_tier TEXT DEFAULT 'Script Kiddie',
      loyalty_points INTEGER DEFAULT 0,
      delivery_address TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_order_at TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_id TEXT,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      delivery_type TEXT DEFAULT 'delivery',
      payment_method TEXT DEFAULT 'COD',
      payment_status TEXT DEFAULT 'PENDING',
      order_notes TEXT,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      delivery_fee REAL NOT NULL DEFAULT 0,
      discount REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'INITIALIZED',
      estimated_delivery_time TEXT DEFAULT '30-40 mins',
      coupon_code TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      food_item_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_item_addons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_item_id INTEGER NOT NULL,
      addon_name TEXT NOT NULL,
      addon_price REAL NOT NULL,
      FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS order_status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      label TEXT NOT NULL,
      code_log TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      guests INTEGER NOT NULL DEFAULT 2,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      table_zone TEXT DEFAULT 'Core #01',
      special_requests TEXT,
      status TEXT DEFAULT 'PENDING',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT DEFAULT 'percentage',
      value REAL NOT NULL,
      min_order REAL DEFAULT 0,
      description TEXT DEFAULT '',
      usage_count INTEGER DEFAULT 0,
      usage_limit INTEGER,
      active INTEGER DEFAULT 1,
      expiry_date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      order_id TEXT,
      author TEXT NOT NULL,
      role TEXT DEFAULT 'Developer',
      rating INTEGER NOT NULL DEFAULT 5,
      comment TEXT NOT NULL,
      dish_ordered TEXT DEFAULT '',
      commit_hash TEXT,
      featured INTEGER DEFAULT 0,
      approved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    );
  `);

  console.log('[DB] ✓ Schema initialized');
}

module.exports = { db, initDB };
