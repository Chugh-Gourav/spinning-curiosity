/**
 * VOTTAM Database Seed Script
 * Seeds 39 products across 3 categories: Nut Butter, Plant-Based Milk, Protein Powder
 * Run: node seed.js
 */

const { db, initDb } = require('./db');

// Initialize database schema first
initDb();

// ============================================================================
// PRODUCT DATA - Real UK brands with realistic nutrition data
// ============================================================================

const products = [
    // ========== NUT BUTTER (15 products) ==========
    {
        external_id: 'nb001',
        brand: 'Pip & Nut',
        name: 'Crunchy Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 300,
        price_local_currency: 3.50,
        nutrition: { sugar: 4.6, salt: 0.44, protein: 29.6, fiber: 5.4, additives: false },
        scores: { health: 85, price_penalty: 0.1, value: 82 }
    },
    {
        external_id: 'nb002',
        brand: 'Whole Earth',
        name: 'Organic Smooth Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1586377434098-dfd0c0a8e8e6?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 340,
        price_local_currency: 3.80,
        nutrition: { sugar: 3.5, salt: 0.01, protein: 25.0, fiber: 6.0, additives: false },
        scores: { health: 90, price_penalty: 0.15, value: 85 }
    },
    {
        external_id: 'nb003',
        brand: 'Meridian',
        name: 'Crunchy Almond Butter',
        image_url: 'https://images.unsplash.com/photo-1612830384187-94ec0b18b3cb?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 280,
        price_local_currency: 5.50,
        nutrition: { sugar: 4.2, salt: 0.01, protein: 21.1, fiber: 7.4, additives: false },
        scores: { health: 88, price_penalty: 0.25, value: 75 }
    },
    {
        external_id: 'nb004',
        brand: 'Sun-Pat',
        name: 'Smooth Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegetarian',
        weight_grams: 400,
        price_local_currency: 2.80,
        nutrition: { sugar: 6.7, salt: 0.88, protein: 22.6, fiber: 5.3, additives: true },
        scores: { health: 65, price_penalty: 0.05, value: 70 }
    },
    {
        external_id: 'nb005',
        brand: 'Manilife',
        name: 'Deep Roast Crunchy Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 295,
        price_local_currency: 4.99,
        nutrition: { sugar: 4.0, salt: 0.02, protein: 30.2, fiber: 8.1, additives: false },
        scores: { health: 92, price_penalty: 0.2, value: 80 }
    },
    {
        external_id: 'nb006',
        brand: 'Biona',
        name: 'Organic Cashew Butter',
        image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 170,
        price_local_currency: 6.20,
        nutrition: { sugar: 5.0, salt: 0.01, protein: 18.2, fiber: 3.2, additives: false },
        scores: { health: 82, price_penalty: 0.35, value: 65 }
    },
    {
        external_id: 'nb007',
        brand: 'Bulk',
        name: 'Natural Peanut Butter 1kg',
        image_url: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 7.99,
        nutrition: { sugar: 4.3, salt: 0.01, protein: 28.0, fiber: 6.5, additives: false },
        scores: { health: 88, price_penalty: 0.0, value: 95 }
    },
    {
        external_id: 'nb008',
        brand: 'Skippy',
        name: 'Super Chunk Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegetarian',
        weight_grams: 340,
        price_local_currency: 3.25,
        nutrition: { sugar: 7.5, salt: 1.12, protein: 22.0, fiber: 4.8, additives: true },
        scores: { health: 58, price_penalty: 0.08, value: 62 }
    },
    {
        external_id: 'nb009',
        brand: 'Myprotein',
        name: 'All-Natural Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1612830384187-94ec0b18b3cb?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 8.49,
        nutrition: { sugar: 5.2, salt: 0.01, protein: 29.5, fiber: 7.0, additives: false },
        scores: { health: 86, price_penalty: 0.0, value: 92 }
    },
    {
        external_id: 'nb010',
        brand: 'Nutty Bruce',
        name: 'Activated Almond Butter',
        image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 250,
        price_local_currency: 7.50,
        nutrition: { sugar: 2.8, salt: 0.01, protein: 19.5, fiber: 9.2, additives: false },
        scores: { health: 94, price_penalty: 0.3, value: 72 }
    },
    {
        external_id: 'nb011',
        brand: 'Tesco',
        name: 'Smooth Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 340,
        price_local_currency: 1.85,
        nutrition: { sugar: 5.8, salt: 0.65, protein: 24.0, fiber: 5.0, additives: true },
        scores: { health: 68, price_penalty: 0.0, value: 78 }
    },
    {
        external_id: 'nb012',
        brand: 'Sainsbury\'s',
        name: 'Crunchy Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 340,
        price_local_currency: 1.90,
        nutrition: { sugar: 5.5, salt: 0.60, protein: 24.5, fiber: 5.2, additives: true },
        scores: { health: 70, price_penalty: 0.0, value: 80 }
    },
    {
        external_id: 'nb013',
        brand: 'Aldi Bramwells',
        name: 'Crunchy Peanut Butter',
        image_url: 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 340,
        price_local_currency: 1.49,
        nutrition: { sugar: 5.9, salt: 0.70, protein: 23.5, fiber: 4.8, additives: true },
        scores: { health: 66, price_penalty: 0.0, value: 82 }
    },
    {
        external_id: 'nb014',
        brand: 'Carley\'s',
        name: 'Organic Raw Almond Butter',
        image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 250,
        price_local_currency: 8.99,
        nutrition: { sugar: 3.0, salt: 0.01, protein: 20.5, fiber: 8.5, additives: false },
        scores: { health: 93, price_penalty: 0.35, value: 68 }
    },
    {
        external_id: 'nb015',
        brand: 'Yumello',
        name: 'Smooth Hazelnut Butter',
        image_url: 'https://images.unsplash.com/photo-1612830384187-94ec0b18b3cb?w=400',
        category: 'Nut Butter',
        dietary_type: 'Vegan',
        weight_grams: 170,
        price_local_currency: 5.99,
        nutrition: { sugar: 3.5, salt: 0.01, protein: 15.0, fiber: 6.8, additives: false },
        scores: { health: 84, price_penalty: 0.32, value: 66 }
    },

    // ========== PLANT-BASED MILK (12 products) ==========
    {
        external_id: 'pm001',
        brand: 'Oatly',
        name: 'Barista Edition Oat Milk',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.00,
        nutrition: { sugar: 3.0, salt: 0.10, protein: 1.0, fiber: 0.8, additives: false },
        scores: { health: 78, price_penalty: 0.15, value: 75 }
    },
    {
        external_id: 'pm002',
        brand: 'Alpro',
        name: 'Unsweetened Almond Milk',
        image_url: 'https://images.unsplash.com/photo-1556881261-e41e8e5f5de7?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 1.80,
        nutrition: { sugar: 0.0, salt: 0.13, protein: 0.5, fiber: 0.4, additives: false },
        scores: { health: 85, price_penalty: 0.1, value: 82 }
    },
    {
        external_id: 'pm003',
        brand: 'Minor Figures',
        name: 'Organic Oat Milk',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.50,
        nutrition: { sugar: 3.2, salt: 0.05, protein: 0.8, fiber: 0.5, additives: false },
        scores: { health: 80, price_penalty: 0.2, value: 72 }
    },
    {
        external_id: 'pm004',
        brand: 'Alpro',
        name: 'Soya Original',
        image_url: 'https://images.unsplash.com/photo-1556881261-e41e8e5f5de7?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 1.65,
        nutrition: { sugar: 2.5, salt: 0.06, protein: 3.0, fiber: 0.5, additives: false },
        scores: { health: 88, price_penalty: 0.05, value: 88 }
    },
    {
        external_id: 'pm005',
        brand: 'Rude Health',
        name: 'Organic Coconut Milk',
        image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.75,
        nutrition: { sugar: 2.8, salt: 0.03, protein: 0.2, fiber: 0.0, additives: false },
        scores: { health: 72, price_penalty: 0.22, value: 68 }
    },
    {
        external_id: 'pm006',
        brand: 'Califia Farms',
        name: 'Oat Barista Blend',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 750,
        price_local_currency: 2.80,
        nutrition: { sugar: 4.0, salt: 0.08, protein: 0.5, fiber: 0.4, additives: false },
        scores: { health: 74, price_penalty: 0.28, value: 65 }
    },
    {
        external_id: 'pm007',
        brand: 'Plenish',
        name: 'Organic Unsweetened Almond',
        image_url: 'https://images.unsplash.com/photo-1556881261-e41e8e5f5de7?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.99,
        nutrition: { sugar: 0.1, salt: 0.10, protein: 1.2, fiber: 0.5, additives: false },
        scores: { health: 90, price_penalty: 0.25, value: 75 }
    },
    {
        external_id: 'pm008',
        brand: 'Tesco',
        name: 'Unsweetened Soya Milk',
        image_url: 'https://images.unsplash.com/photo-1556881261-e41e8e5f5de7?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 0.95,
        nutrition: { sugar: 0.2, salt: 0.08, protein: 3.3, fiber: 0.6, additives: true },
        scores: { health: 82, price_penalty: 0.0, value: 92 }
    },
    {
        external_id: 'pm009',
        brand: 'Koko',
        name: 'Coconut Milk Original',
        image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 1.85,
        nutrition: { sugar: 2.0, salt: 0.12, protein: 0.2, fiber: 0.0, additives: true },
        scores: { health: 70, price_penalty: 0.1, value: 72 }
    },
    {
        external_id: 'pm010',
        brand: 'Oatly',
        name: 'Organic Oat Drink',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.25,
        nutrition: { sugar: 4.1, salt: 0.10, protein: 1.0, fiber: 1.5, additives: false },
        scores: { health: 76, price_penalty: 0.18, value: 74 }
    },
    {
        external_id: 'pm011',
        brand: 'Provamel',
        name: 'Organic Soya Unsweetened',
        image_url: 'https://images.unsplash.com/photo-1556881261-e41e8e5f5de7?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.10,
        nutrition: { sugar: 0.0, salt: 0.04, protein: 3.6, fiber: 0.6, additives: false },
        scores: { health: 92, price_penalty: 0.15, value: 85 }
    },
    {
        external_id: 'pm012',
        brand: 'Sproud',
        name: 'Pea Milk Barista',
        image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        category: 'Plant-Based Milk',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 2.40,
        nutrition: { sugar: 2.5, salt: 0.15, protein: 3.0, fiber: 0.3, additives: false },
        scores: { health: 84, price_penalty: 0.18, value: 78 }
    },

    // ========== PROTEIN POWDER (12 products) ==========
    {
        external_id: 'pp001',
        brand: 'Vega',
        name: 'Protein & Greens Chocolate',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 614,
        price_local_currency: 34.99,
        nutrition: { sugar: 1.0, salt: 0.45, protein: 70.0, fiber: 3.5, additives: false },
        scores: { health: 88, price_penalty: 0.3, value: 72 }
    },
    {
        external_id: 'pp002',
        brand: 'Myprotein',
        name: 'Vegan Protein Blend Chocolate',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 24.99,
        nutrition: { sugar: 0.5, salt: 1.0, protein: 72.0, fiber: 2.0, additives: false },
        scores: { health: 85, price_penalty: 0.1, value: 88 }
    },
    {
        external_id: 'pp003',
        brand: 'Bulk',
        name: 'Vegan Protein Powder Strawberry',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 21.99,
        nutrition: { sugar: 1.2, salt: 0.8, protein: 75.0, fiber: 1.5, additives: false },
        scores: { health: 87, price_penalty: 0.05, value: 92 }
    },
    {
        external_id: 'pp004',
        brand: 'Garden of Life',
        name: 'Raw Organic Protein Vanilla',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 620,
        price_local_currency: 42.99,
        nutrition: { sugar: 0.0, salt: 0.35, protein: 66.0, fiber: 5.0, additives: false },
        scores: { health: 94, price_penalty: 0.4, value: 68 }
    },
    {
        external_id: 'pp005',
        brand: 'Nutricis',
        name: 'Pea Protein Isolate',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 1000,
        price_local_currency: 18.99,
        nutrition: { sugar: 0.0, salt: 1.5, protein: 80.0, fiber: 0.5, additives: false },
        scores: { health: 82, price_penalty: 0.0, value: 95 }
    },
    {
        external_id: 'pp006',
        brand: 'PhD',
        name: 'Smart Protein Plant Chocolate',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 500,
        price_local_currency: 22.50,
        nutrition: { sugar: 1.5, salt: 0.55, protein: 68.0, fiber: 4.0, additives: true },
        scores: { health: 78, price_penalty: 0.2, value: 74 }
    },
    {
        external_id: 'pp007',
        brand: 'Sunwarrior',
        name: 'Warrior Blend Mocha',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 750,
        price_local_currency: 38.99,
        nutrition: { sugar: 1.0, salt: 0.40, protein: 71.0, fiber: 3.0, additives: false },
        scores: { health: 90, price_penalty: 0.35, value: 70 }
    },
    {
        external_id: 'pp008',
        brand: 'Pulsin',
        name: 'Pea Protein Natural',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 250,
        price_local_currency: 9.99,
        nutrition: { sugar: 0.0, salt: 1.2, protein: 78.0, fiber: 0.5, additives: false },
        scores: { health: 84, price_penalty: 0.15, value: 80 }
    },
    {
        external_id: 'pp009',
        brand: 'Huel',
        name: 'Complete Protein Chocolate',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 780,
        price_local_currency: 30.00,
        nutrition: { sugar: 0.5, salt: 0.50, protein: 75.0, fiber: 2.5, additives: false },
        scores: { health: 89, price_penalty: 0.22, value: 78 }
    },
    {
        external_id: 'pp010',
        brand: 'Orgain',
        name: 'Organic Protein Vanilla',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 920,
        price_local_currency: 32.50,
        nutrition: { sugar: 0.0, salt: 0.38, protein: 64.0, fiber: 7.0, additives: false },
        scores: { health: 91, price_penalty: 0.25, value: 76 }
    },
    {
        external_id: 'pp011',
        brand: 'Naturya',
        name: 'Hemp Protein Powder',
        image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 300,
        price_local_currency: 12.99,
        nutrition: { sugar: 2.5, salt: 0.05, protein: 50.0, fiber: 18.0, additives: false },
        scores: { health: 86, price_penalty: 0.18, value: 79 }
    },
    {
        external_id: 'pp012',
        brand: 'THE PROTEIN WORKS',
        name: 'Vegan Wondershake Chocolate',
        image_url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        category: 'Protein Powder',
        dietary_type: 'Vegan',
        weight_grams: 750,
        price_local_currency: 26.99,
        nutrition: { sugar: 2.0, salt: 0.65, protein: 70.0, fiber: 3.2, additives: true },
        scores: { health: 80, price_penalty: 0.15, value: 77 }
    }
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

function clearExistingData() {
    console.log('Clearing existing product data...');
    db.exec(`
        DELETE FROM product_scores;
        DELETE FROM nutrition_facts;
        DELETE FROM products;
    `);
}

function seedProducts() {
    console.log('Seeding products...');

    const insertProduct = db.prepare(`
        INSERT INTO products (external_id, brand, name, image_url, category, dietary_type, weight_grams, price_local_currency)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertNutrition = db.prepare(`
        INSERT INTO nutrition_facts (product_id, sugar_per_100g, salt_per_100g, protein_per_100g, fiber_per_100g, has_additives)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertScores = db.prepare(`
        INSERT INTO product_scores (product_id, health_score, price_penalty, smartest_value_score)
        VALUES (?, ?, ?, ?)
    `);

    const insertAll = db.transaction((products) => {
        for (const p of products) {
            const result = insertProduct.run(
                p.external_id, p.brand, p.name, p.image_url,
                p.category, p.dietary_type, p.weight_grams, p.price_local_currency
            );

            const productId = result.lastInsertRowid;

            insertNutrition.run(
                productId,
                p.nutrition.sugar, p.nutrition.salt, p.nutrition.protein,
                p.nutrition.fiber, p.nutrition.additives ? 1 : 0
            );

            insertScores.run(
                productId,
                p.scores.health, p.scores.price_penalty, p.scores.value
            );
        }
    });

    insertAll(products);
}

function verifySeed() {
    console.log('\n=== Verification ===');
    const counts = db.prepare(`
        SELECT category, COUNT(*) as count FROM products GROUP BY category
    `).all();

    console.log('Products per category:');
    counts.forEach(row => console.log(`  ${row.category}: ${row.count}`));

    const total = db.prepare('SELECT COUNT(*) as count FROM products').get();
    console.log(`\nTotal products: ${total.count}`);

    const nutritionCount = db.prepare('SELECT COUNT(*) as count FROM nutrition_facts').get();
    console.log(`Nutrition facts entries: ${nutritionCount.count}`);

    const scoresCount = db.prepare('SELECT COUNT(*) as count FROM product_scores').get();
    console.log(`Product scores entries: ${scoresCount.count}`);
}

// ============================================================================
// RUN SEEDING
// ============================================================================

console.log('🌱 Starting VOTTAM Database Seed...\n');
clearExistingData();
seedProducts();
verifySeed();
console.log('\n✅ Seeding complete!');
