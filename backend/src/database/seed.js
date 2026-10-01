// src/database/seed.js
// Seeds initial data into the database from the original mock data
const { db } = require('./db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

function seed() {
  const existing = db.prepare('SELECT COUNT(*) as cnt FROM food_items').get();
  if (existing.cnt > 0) {
    console.log('[SEED] Database already seeded, skipping.');
    return;
  }

  console.log('[SEED] Seeding database...');

  // ─── Settings ────────────────────────────────────────────────────────────
  db.prepare(`
    INSERT OR REPLACE INTO settings (id, restaurant_name, tagline, phone, email, address, 
      opening_hours, late_night_shift, is_kitchen_open, surge_active, min_order_amount,
      free_delivery_threshold, delivery_fee, delivery_radius_km, tax_rate)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, 1, 0, 20, 45, 4.99, 15, 0.05)
  `).run(
    'NON VEG 404',
    '// GOOD FOOD. NO BUGS. //',
    '+1 (555) 404-MEAT',
    'terminal@nonveg404.dev',
    '404 Kernel Way, Silicon Grill District, Tech City, CA 94016',
    'Mon - Sun: 11:00 AM - 02:00 AM',
    '10:00 PM - 02:00 AM Daily'
  );

  // ─── Categories ──────────────────────────────────────────────────────────
  const categories = [
    { id: 'cat-1', name: 'Biryani', slug: 'biryani', icon: '🍚', description: 'Royal dum cooked basmati & saffron', itemCount: 3 },
    { id: 'cat-2', name: 'Chicken', slug: 'chicken', icon: '🍗', description: 'Charcoal tandoor & Nashville fry', itemCount: 3 },
    { id: 'cat-3', name: 'Mutton', slug: 'mutton', icon: '🥩', description: 'Slow-simmered Kashmiri curries', itemCount: 2 },
    { id: 'cat-4', name: 'Kebabs & Tandoor', slug: 'kebabs-tandoor', icon: '🍢', description: 'Charcoal skewers & melt-in-mouth boti', itemCount: 2 },
    { id: 'cat-5', name: 'Starters', slug: 'starters', icon: '🔥', description: 'Peri-peri wings & crispy crunch', itemCount: 2 },
    { id: 'cat-6', name: 'Burgers', slug: 'burgers', icon: '🍔', description: 'Double smashed Angus beef & brioche', itemCount: 2 },
    { id: 'cat-7', name: 'Rolls & Wraps', slug: 'rolls-wraps', icon: '🌯', description: 'Flaky paratha rolls with spicy chutney', itemCount: 2 },
    { id: 'cat-8', name: 'Main Course', slug: 'main-course', icon: '🥘', description: 'Velvety butter chicken & tikka masala', itemCount: 2 },
    { id: 'cat-9', name: 'Beverages', slug: 'beverages', icon: '🥤', description: 'Single-origin cold brews & mango lassi', itemCount: 2 },
    { id: 'cat-10', name: 'Desserts', slug: 'desserts', icon: '🍫', description: 'Molten chocolate brownies & shahi tukda', itemCount: 2 },
  ];

  const insertCat = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, slug, icon, description, item_count, active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);
  for (const c of categories) {
    insertCat.run(c.id, c.name, c.slug, c.icon, c.description, c.itemCount);
  }

  // ─── Addons ───────────────────────────────────────────────────────────────
  const addons = [
    { id: 'addon-1', name: 'Extra Mirchi Ka Salan (Gravy)', price: 2.50, category: 'Biryani' },
    { id: 'addon-2', name: 'Chilled Mint Boondi Raita', price: 1.99, category: 'Biryani' },
    { id: 'addon-3', name: 'Double Boiled Spiced Eggs', price: 2.00, category: 'Biryani' },
    { id: 'addon-4', name: 'Garlic Butter Naan (2 pcs)', price: 4.99, category: 'Main Course' },
    { id: 'addon-5', name: 'Cheese Stuffed Naan', price: 4.50, category: 'Main Course' },
    { id: 'addon-6', name: 'Spicy Coriander Mint Dip', price: 1.50, category: 'Grills' },
    { id: 'addon-7', name: 'Truffle Parmesan Fries', price: 4.99, category: 'Burgers' },
    { id: 'addon-8', name: 'Extra Angus Patty', price: 4.50, category: 'Burgers' },
    { id: 'addon-9', name: 'Vanilla Bean Gelato Scoop', price: 2.50, category: 'Desserts' },
  ];

  const insertAddon = db.prepare(`
    INSERT OR IGNORE INTO addons (id, name, price, category, in_stock)
    VALUES (?, ?, ?, ?, 1)
  `);
  for (const a of addons) {
    insertAddon.run(a.id, a.name, a.price, a.category);
  }

  // ─── Food Items ───────────────────────────────────────────────────────────
  const items = [
    { id: 'biryani-1', name: 'Kernel Hyderabadi Dum Biryani', description: 'Slow-cooked marinated chicken leg quarters layered with fragrant aged basmati rice, saffron, caramelised onions, and hand-ground royal spices.', price: 18.99, originalPrice: 22.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', category: 'Biryani', spiceLevel: 'Hot', availability: 1, isFeatured: 1, rating: 4.9, reviewsCount: 342, prepTime: '25-30 min', calories: 780, techTag: 'LTS Release 2026' },
    { id: 'biryani-2', name: 'Mutton Kacchi Dum [v4.0.4]', description: 'Raw marinated bone-in mutton layered under dum steam with golden fried onions, kewra water, and rose-petal ghee.', price: 22.99, originalPrice: 27.99, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', category: 'Biryani', spiceLevel: 'Hot', availability: 1, isFeatured: 1, rating: 4.8, reviewsCount: 280, prepTime: '35 min', calories: 860, techTag: 'v4.0.4 Stable' },
    { id: 'biryani-3', name: 'Prawn Coastal Dum Biryani', description: 'Jumbo tiger prawns in coconut milk, mustard seeds, and curry leaf masala layered over short-grain basmati.', price: 24.99, image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80', category: 'Biryani', spiceLevel: 'Medium', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 195, prepTime: '30 min', calories: 720, techTag: 'Coastal Runtime' },
    { id: 'chicken-1', name: 'Full Stack Tandoori Chicken', description: 'Whole chicken marinated 24 hours in Greek yogurt, Kashmiri red chilies, fenugreek, and roasted in a traditional 450°C clay tandoor oven.', price: 21.99, originalPrice: 25.00, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80', category: 'Chicken', spiceLevel: 'Hot', availability: 1, isFeatured: 1, rating: 4.9, reviewsCount: 412, prepTime: '25 min', calories: 840, techTag: 'Full CI/CD Grill' },
    { id: 'chicken-2', name: 'Butter Chicken [API v3]', description: 'Tender chicken makhani in a rich tomato-based cream sauce with Kasuri methi, cardamom ghee, and silky butter glaze.', price: 17.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', category: 'Chicken', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 378, prepTime: '20 min', calories: 680, techTag: 'Stable API v3' },
    { id: 'chicken-3', name: 'Nashville Hot Fried Chicken', description: 'Double-battered spicy fried chicken thighs soaked in cayenne-lard baste, coleslaw, and pickled cucumber on brioche.', price: 15.99, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', category: 'Chicken', spiceLevel: 'Code Red', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 297, prepTime: '15 min', calories: 920, techTag: 'Hotfix Build' },
    { id: 'mutton-1', name: 'Mutton Rogan Josh [Legacy Release]', description: 'Slow-simmered Kashmiri lamb shanks in an aromatic red gravy flavored with alkanet root, fennel seeds, dry ginger, and saffron ghee.', price: 24.99, originalPrice: 28.00, image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80', category: 'Mutton', spiceLevel: 'Medium', availability: 1, isFeatured: 1, rating: 5.0, reviewsCount: 310, prepTime: '30 min', calories: 920, techTag: 'Rock Solid Flavor' },
    { id: 'mutton-2', name: 'Mutton Seekh Kebab [v2.0]', description: 'Minced mutton hand-rolled onto iron skewers with ginger, garlic, charred onion paste, and smoked over hickory coal.', price: 19.99, image: 'https://images.unsplash.com/photo-1544025162-d76594f0b6a7?auto=format&fit=crop&w=800&q=80', category: 'Mutton', spiceLevel: 'Hot', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 235, prepTime: '20 min', calories: 680, techTag: 'Thread-Safe Grill' },
    { id: 'kebab-1', name: 'Galouti Kebab [Deprecated: Too Good]', description: 'Ultra-soft minced mutton patties with 160 spices, green papaya tenderizer, and a melt-in-mouth texture.', price: 17.99, image: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80', category: 'Kebabs & Tandoor', spiceLevel: 'Medium', availability: 1, isFeatured: 1, rating: 4.9, reviewsCount: 267, prepTime: '20 min', calories: 580, techTag: 'Deprecated: Too Good' },
    { id: 'kebab-2', name: 'Chicken Boti Kebab [Runtime Flavor]', description: 'Juicy boneless chicken thigh cubes marinated in mustard oil, paprika, mace, and star anise then char-grilled on open coal.', price: 16.99, image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80', category: 'Kebabs & Tandoor', spiceLevel: 'Hot', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 218, prepTime: '15 min', calories: 620, techTag: 'Zero Cold Chain' },
    { id: 'starter-1', name: 'Peri-Peri Chicken Wings [404 Edition]', description: '12 wings double-fried and glazed in smokey peri-peri sauce with fresh lime zest and coriander oil.', price: 14.99, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80', category: 'Starters', spiceLevel: 'Code Red', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 342, prepTime: '15 min', calories: 760, techTag: 'Exception: Too Spicy' },
    { id: 'starter-2', name: 'Crispy Chilli Chicken [Beta]', description: 'Indo-Chinese style crispy chicken strips tossed in black bean garlic sauce, bell peppers, and spring onion.', price: 13.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', category: 'Starters', spiceLevel: 'Hot', availability: 1, isFeatured: 0, rating: 4.6, reviewsCount: 289, prepTime: '12 min', calories: 640, techTag: 'Beta Flavor' },
    { id: 'burger-1', name: 'Root Access Double Bacon Burger', description: 'Dual smashed Angus beef patties, crisp smoked bacon strips, double aged cheddar, caramelized IPA onions, and secret 404 chipotle sauce on a brioche bun.', price: 16.99, originalPrice: 19.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', category: 'Burgers', spiceLevel: 'Medium', availability: 1, isFeatured: 1, rating: 4.9, reviewsCount: 462, prepTime: '15 min', calories: 1020, techTag: 'Root Access Granted' },
    { id: 'burger-2', name: 'Chicken Tikka Burger [Open Source]', description: 'Juicy tikka marinated thigh fillet in a crispy panko crust, spiced mayo, shredded red cabbage, and raita drizzle.', price: 14.99, image: 'https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?auto=format&fit=crop&w=800&q=80', category: 'Burgers', spiceLevel: 'Medium', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 312, prepTime: '15 min', calories: 780, techTag: 'Open Source' },
    { id: 'roll-1', name: 'Kathi Roll [Commit #ff5500]', description: 'Flaky layered paratha stuffed with masala-marinated chicken strips, coriander chutney, and lime-pickled onions.', price: 11.99, image: 'https://images.unsplash.com/photo-1630409351217-bc5e96cc42f8?auto=format&fit=crop&w=800&q=80', category: 'Rolls & Wraps', spiceLevel: 'Hot', availability: 1, isFeatured: 0, rating: 4.6, reviewsCount: 198, prepTime: '12 min', calories: 520, techTag: 'Commit #ff5500' },
    { id: 'roll-2', name: 'Egg Masala Wrap [Shell Script]', description: 'Three-egg masala omelette, caramelized onions, green chilli paste, and sriracha rolled in a whole-wheat roti.', price: 10.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', category: 'Rolls & Wraps', spiceLevel: 'Medium', availability: 1, isFeatured: 0, rating: 4.5, reviewsCount: 176, prepTime: '10 min', calories: 480, techTag: 'Shell Wrapper' },
    { id: 'main-1', name: 'Chicken Tikka Masala [Core Module]', description: 'Charcoal-smoked tikka cubes simmered in velvety tomato-cashew gravy with whole spices and handcrafted butter glaze.', price: 18.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', category: 'Main Course', spiceLevel: 'Medium', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 421, prepTime: '20 min', calories: 720, techTag: 'Core Module' },
    { id: 'main-2', name: 'Dal Gosht [Kernel Thread]', description: 'Slow-cooked lamb with yellow lentils, dried plums, whole Kashmiri chilies, and a final ghee tempering of cumin and asafoetida.', price: 19.99, image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80', category: 'Main Course', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 215, prepTime: '25 min', calories: 680, techTag: 'Kernel Thread' },
    { id: 'bev-1', name: 'Mango Lassi [v1.0 Classic]', description: 'Blended Alphonso mango pulp with chilled yogurt, saffron, and cardamom dust. Ultra-smooth and cooling.', price: 5.99, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80', category: 'Beverages', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 356, prepTime: '3 min', calories: 280, techTag: 'Classic Build' },
    { id: 'bev-2', name: 'Cold Brew Espresso [Debug Mode]', description: 'Single-origin Ethiopian cold brew concentrate steeped 18 hours, served over nitrogen ice with a hint of cardamom.', price: 6.99, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', category: 'Beverages', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.7, reviewsCount: 234, prepTime: '2 min', calories: 45, techTag: 'Debug Mode On' },
    { id: 'dessert-1', name: 'Molten Choco Brownie [404 Bug]', description: 'Warm dark chocolate lava brownie with a gooey center, vanilla bean gelato, salted caramel drizzle, and gold leaf.', price: 8.99, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', category: 'Desserts', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.9, reviewsCount: 289, prepTime: '10 min', calories: 560, techTag: '404 Bug: Too Sweet' },
    { id: 'dessert-2', name: 'Shahi Tukda [Legacy Dessert]', description: 'Crispy fried bread soaked in condensed milk rabri, topped with pistachios, edible rose petals, and silver warq.', price: 7.99, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80', category: 'Desserts', spiceLevel: 'Mild', availability: 1, isFeatured: 0, rating: 4.8, reviewsCount: 198, prepTime: '8 min', calories: 480, techTag: 'Legacy Sweet' },
  ];

  const insertItem = db.prepare(`
    INSERT OR IGNORE INTO food_items 
      (id, name, description, price, original_price, image, category, spice_level, availability, is_featured, rating, reviews_count, prep_time, calories, tech_tag)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const item of items) {
    insertItem.run(item.id, item.name, item.description, item.price, item.originalPrice || null, item.image, item.category, item.spiceLevel, item.availability, item.isFeatured, item.rating, item.reviewsCount, item.prepTime, item.calories || null, item.techTag || null);
  }

  // ─── Coupons ──────────────────────────────────────────────────────────────
  const coupons = [
    { id: uuidv4(), code: 'SUDO_50', discountType: 'percentage', value: 20, minOrder: 40, description: 'Elevate your permissions: 20% OFF on orders above ₹40', usageLimit: 500 },
    { id: uuidv4(), code: 'DEV_NIGHT_40', discountType: 'fixed', value: 15, minOrder: 50, description: 'Late Night Debugging Fuel: Flat ₹15 OFF on orders above ₹50', usageLimit: 200 },
    { id: uuidv4(), code: 'MERGE_CONFLICT', discountType: 'percentage', value: 15, minOrder: 30, description: 'Resolve your hunger conflicts: 15% OFF your entire feast', usageLimit: 300 },
    { id: uuidv4(), code: 'FREE_DEPLOY', discountType: 'fixed', value: 4.99, minOrder: 25, description: 'Zero Shipping Overhead: Free delivery pass on orders above ₹25', usageLimit: 1000 },
  ];

  const insertCoupon = db.prepare(`
    INSERT OR IGNORE INTO coupons (id, code, discount_type, value, min_order, description, usage_limit, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `);
  for (const c of coupons) {
    insertCoupon.run(c.id, c.code, c.discountType, c.value, c.minOrder, c.description, c.usageLimit);
  }

  // ─── Admin Users ──────────────────────────────────────────────────────────
  const adminPasswordHash = bcrypt.hashSync('sudo_root_404', 10);
  const kitchenPasswordHash = bcrypt.hashSync('cook_line_404', 10);

  db.prepare(`
    INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuidv4(), 'Admin Chef (Root)', 'admin@nonveg404.dev', adminPasswordHash, 'manager');

  db.prepare(`
    INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuidv4(), 'Kitchen Lead', 'kitchen@nonveg404.dev', kitchenPasswordHash, 'kitchen');

  // ─── Demo Reviews ─────────────────────────────────────────────────────────
  const reviews = [
    { id: uuidv4(), author: 'Alex Chen', role: 'Staff SRE @ Kubernetes Cloud', rating: 5, comment: 'The Hyderabadi Dum Biryani had 99.999% uptime of pure flavor. Perfectly spiced!', dishOrdered: 'Kernel Hyderabadi Dum Biryani', commitHash: 'commit 8f9b23a: merge feat(flavor) into main', featured: 1 },
    { id: uuidv4(), author: 'Linus Torvalds', role: 'Creator of Linux & Git', rating: 5, comment: 'Unlike some codebases, this Rogan Josh has zero memory leaks. Absolutely flawless.', dishOrdered: 'Mutton Rogan Josh [Legacy Release]', commitHash: 'commit a4f7c23: push origin --force (it\'s that good)', featured: 1 },
    { id: uuidv4(), author: 'Ada Lovelace', role: 'Pioneer of Computing', rating: 5, comment: 'My algorithm for predicting great food has never failed. Root Access Burger was divine.', dishOrdered: 'Root Access Double Bacon Burger', commitHash: 'commit f2c9a7b: add feat(taste) - initial commit', featured: 1 },
  ];

  const insertReview = db.prepare(`
    INSERT OR IGNORE INTO reviews (id, author, role, rating, comment, dish_ordered, commit_hash, featured, approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  for (const r of reviews) {
    insertReview.run(r.id, r.author, r.role, r.rating, r.comment, r.dishOrdered, r.commitHash, r.featured);
  }

  console.log('[SEED] ✓ Database seeded successfully');
}

module.exports = { seed };
