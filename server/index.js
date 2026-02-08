const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDb, db } = require('./db');
// import services later

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    try {
        const user = db.prepare('SELECT id, username, preferences FROM users WHERE username = ? AND password = ?').get(username, password);
        if (user) {
            // Parse preferences
            user.preferences = JSON.parse(user.preferences || '{}');
            res.json(user);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Import Services
const fatSecretService = require('./services/fatsecret');
const aiService = require('./services/ai');

// API Routes

// Search local database first, fallback to FatSecret API
app.get('/api/products', async (req, res) => {
    const query = req.query.q;
    const category = req.query.category;
    const source = req.query.source || 'local'; // 'local', 'api', or 'both'

    try {
        let localResults = [];

        // Search local database
        if (source === 'local' || source === 'both') {
            let sql = `
                SELECT 
                    p.id, p.external_id, p.brand, p.name, p.image_url, 
                    p.category, p.dietary_type, p.weight_grams, p.price_local_currency,
                    n.sugar_per_100g, n.salt_per_100g, n.protein_per_100g, 
                    n.fiber_per_100g, n.has_additives,
                    s.health_score, s.price_penalty, s.smartest_value_score
                FROM products p
                LEFT JOIN nutrition_facts n ON p.id = n.product_id
                LEFT JOIN product_scores s ON p.id = s.product_id
                WHERE 1=1
            `;
            const params = [];

            if (query) {
                sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ?)`;
                params.push(`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`);
            }

            if (category) {
                if (category === 'Vegan') {
                    sql += ` AND p.dietary_type = 'Vegan'`;
                } else if (category === 'Spreads') {
                    sql += ` AND p.category = 'Nut Butter'`;
                } else if (category === 'Milk Alternatives') {
                    sql += ` AND p.category = 'Plant-Based Milk'`;
                } else {
                    sql += ` AND p.category = ?`;
                    params.push(category);
                }
            }

            // Price Filter
            const minPrice = parseFloat(req.query.minPrice) || 0;
            const maxPrice = parseFloat(req.query.maxPrice) || 100;
            sql += ` AND p.price_local_currency BETWEEN ? AND ?`;
            params.push(minPrice, maxPrice);

            sql += ` ORDER BY s.health_score DESC, s.smartest_value_score DESC LIMIT 50`;

            localResults = db.prepare(sql).all(...params);

            // Format for frontend consistency
            localResults = localResults.map(p => ({
                food_id: p.id,
                food_name: `${p.brand} ${p.name}`,
                brand_name: p.brand,
                product_image: p.image_url,
                food_description: `${p.weight_grams}g | £${(p.price_local_currency || 0).toFixed(2)} | ${p.dietary_type}`,
                category: p.category,
                nutrition: {
                    sugar: p.sugar_per_100g,
                    salt: p.salt_per_100g,
                    protein: p.protein_per_100g,
                    fiber: p.fiber_per_100g,
                    has_additives: p.has_additives
                },
                scores: {
                    health_score: p.health_score,
                    value_score: p.smartest_value_score
                },
                source: 'local'
            }));
        }

        // Optionally also search FatSecret API (Only if explicitly requested or no local results & query exists)
        let apiResults = [];
        if ((source === 'api' || (source === 'both' && localResults.length === 0)) && query) {
            // API integration placeholder
        }

        res.json([...localResults, ...apiResults]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Smart Swap Endpoint
// Suggests a product in the same category with a higher health score
app.get('/api/products/:id/swap', (req, res) => {
    const { id } = req.params;
    try {
        const product = db.prepare(`
            SELECT p.category, s.health_score 
            FROM products p
            JOIN product_scores s ON p.id = s.product_id
            WHERE p.id = ?
        `).get(id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        const betterProduct = db.prepare(`
            SELECT 
                p.id, p.brand, p.name, p.image_url, s.health_score
            FROM products p
            JOIN product_scores s ON p.id = s.product_id
            WHERE p.category = ? 
            AND s.health_score > ?
            ORDER BY s.health_score DESC
            LIMIT 1
        `).get(product.category, product.health_score);

        res.json(betterProduct || null); // Return null if no better option
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Swap search failed' });
    }
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
    const { category } = req.params;
    try {
        const products = db.prepare(`
            SELECT 
                p.id, p.external_id, p.brand, p.name, p.image_url, 
                p.category, p.dietary_type, p.weight_grams, p.price_local_currency,
                s.health_score, s.smartest_value_score
            FROM products p
            LEFT JOIN product_scores s ON p.id = s.product_id
            WHERE p.category = ?
            ORDER BY s.smartest_value_score DESC
        `).all(category);

        res.json(products.map(p => ({
            food_id: p.id,
            food_name: `${p.brand} ${p.name}`,
            brand_name: p.brand,
            product_image: p.image_url,
            food_description: `${p.weight_grams}g | £${p.price_local_currency.toFixed(2)}`,
            category: p.category,
            scores: {
                health_score: p.health_score,
                value_score: p.smartest_value_score
            }
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch category products' });
    }
});

// Get available categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare(`
            SELECT category, COUNT(*) as count 
            FROM products 
            GROUP BY category 
            ORDER BY count DESC
        `).all();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.post('/api/analyze', async (req, res) => {
    const { product, userProfile } = req.body; // Expect product object and userProfile
    if (!product) return res.status(400).json({ error: 'Product required' });

    try {
        const analysis = await aiService.analyzeProduct(product, userProfile);
        res.json(analysis);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

app.post('/api/chat', async (req, res) => {
    const { query } = req.body;
    // For prototype, chat acts as a search wrapper + AI advice
    // Search local DB first, then API fallback

    try {
        // First search local database
        const localProducts = db.prepare(`
            SELECT 
                p.id, p.brand, p.name, p.image_url, p.category, 
                p.weight_grams, p.price_local_currency,
                s.health_score, s.smartest_value_score
            FROM products p
            LEFT JOIN product_scores s ON p.id = s.product_id
            WHERE LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ? OR LOWER(p.category) LIKE ?
            ORDER BY s.smartest_value_score DESC
            LIMIT 5
        `).all(`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`);

        let products = localProducts.map(p => ({
            food_id: p.id,
            food_name: `${p.brand} ${p.name}`,
            brand_name: p.brand,
            product_image: p.image_url,
            food_description: `${p.weight_grams}g | £${p.price_local_currency.toFixed(2)}`,
            category: p.category,
            scores: {
                health_score: p.health_score,
                value_score: p.smartest_value_score
            },
            source: 'local'
        }));

        // If no local results, try FatSecret API
        if (products.length === 0) {
            // API fallback placeholder
        }

        const message = await aiService.generateSearchInsight(query, products);

        res.json({
            message,
            products: products.slice(0, 5) // Limit to top 5
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat processing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
