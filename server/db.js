const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'vottam.db');
const db = new Database(dbPath, { verbose: console.log });

function initDb() {
    const schema = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        external_id TEXT UNIQUE,
        brand TEXT NOT NULL,
        name TEXT NOT NULL,
        image_url TEXT,
        category TEXT CHECK(category IN ('Nut Butter', 'Protein Powder', 'Plant-Based Meat', 'Legume', 'Protein Bar', 'Plant-Based Milk', 'Yogurt')),
        dietary_type TEXT CHECK(dietary_type IN ('Vegan', 'Vegetarian')),
        weight_grams REAL,
        price_local_currency REAL
    );

    CREATE TABLE IF NOT EXISTS nutrition_facts (
        product_id INTEGER,
        sugar_per_100g REAL,
        salt_per_100g REAL,
        protein_per_100g REAL,
        fiber_per_100g REAL,
        has_additives BOOLEAN,
        FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS product_scores (
        product_id INTEGER,
        health_score INTEGER,
        price_penalty REAL,
        smartest_value_score REAL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        preferences TEXT
    );

    CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT,
        action TEXT CHECK(action IN ('viewed', 'scanned', 'swapped', 'purchased')),
        scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `;

    db.exec(schema);

    // Seed Demo Users with different preferences
    const demoUsers = [
        { username: 'gourav', password: 'demo123', preferences: { diet: 'Vegan', health: 'Diabetic' } },
        { username: 'sarah', password: 'demo123', preferences: { diet: 'Keto', health: 'Weight Loss' } },
        { username: 'mike', password: 'demo123', preferences: { diet: 'Vegetarian', health: 'High Protein' } }
    ];

    for (const user of demoUsers) {
        const exists = db.prepare('SELECT * FROM users WHERE username = ?').get(user.username);
        if (!exists) {
            db.prepare('INSERT INTO users (username, password, preferences) VALUES (?, ?, ?)').run(
                user.username,
                user.password,
                JSON.stringify(user.preferences)
            );
        }
    }

    console.log('Database initialized successfully');
}

module.exports = { db, initDb };
