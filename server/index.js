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

// Get all users (for demo user switcher)
app.get('/api/users', (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, username, preferences FROM users
        `).all();

        res.json(users.map(u => ({
            id: u.id,
            username: u.username,
            preferences: JSON.parse(u.preferences || '{}')
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
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
    const limit = parseInt(req.query.limit) || 50;  // Allow custom limit

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
                // SCALABLE SEARCH: Match across Name, Brand, Category, Dietary Type
                sql += ` AND (
                    LOWER(p.name) LIKE ? 
                    OR LOWER(p.brand) LIKE ? 
                    OR LOWER(p.category) LIKE ? 
                    OR LOWER(p.dietary_type) LIKE ?
                )`;
                const term = `%${query.toLowerCase()}%`;
                params.push(term, term, term, term);
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

            sql += ` ORDER BY s.health_score DESC, s.smartest_value_score DESC LIMIT ?`;
            params.push(limit);

            localResults = db.prepare(sql).all(...params);

            // Format for frontend consistency
            localResults = localResults.map(p => ({
                food_id: p.id,
                food_name: `${p.brand} ${p.name}`,
                brand_name: p.brand,
                product_image: p.image_url,
                food_description: `${p.weight_grams}g | £${(p.price_local_currency || 0).toFixed(2)} | ${p.dietary_type}`,
                category: p.category,
                price_local_currency: p.price_local_currency || 0,
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

        // Add "Best in Category" flag for UI
        if (localResults.length > 0) {
            // Group by category to find top scores
            const categoryTops = {};
            localResults.forEach(p => {
                if (!categoryTops[p.category] || p.scores.health_score > categoryTops[p.category]) {
                    categoryTops[p.category] = p.scores.health_score;
                }
            });

            localResults = localResults.map(p => ({
                ...p,
                is_best_in_category: p.scores.health_score === categoryTops[p.category]
            }));
        }

        // Optionally also search FatSecret API (Only if explicitly requested or no local results & query exists)
        let apiResults = [];
        if ((source === 'api' || (source === 'both' && localResults.length === 0)) && query) {
            // API integration placeholder
        }

        const combinedResults = [...localResults, ...apiResults];

        // Ensure products are sorted by health score before sending
        const scoredProducts = combinedResults.sort((a, b) => b.scores.health_score - a.scores.health_score);

        // Strict Product Limit (Phase 5 Requirement)
        const LIMITED_PRODUCTS = scoredProducts.slice(0, 6);

        // Step 4: Add Contextual Recommendations via Gemini
        const isAiMode = req.query.aiMode === 'true';
        const userId = req.query.userId;
        let userProfile = null;
        let aiMessage = null;

        if (userId) {
            const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
            if (userRow) {
                userProfile = JSON.parse(userRow.preferences || '{}');
            }
        }

        if (isAiMode && userProfile) {
            try {
                // Determine health goals/diet context
                const context = {
                    userDiet: userProfile.diet || 'standard',
                    healthGoals: userProfile.health || 'general wellness',
                    recentlyViewed: 'nothing yet'
                };

                // Request personalized insight from Gemini
                aiMessage = await aiService.generatePersonalizedInsight(query || category || 'Discover', LIMITED_PRODUCTS, context);

                return res.json({
                    products: LIMITED_PRODUCTS,
                    ai_suggestion: aiMessage
                });

            } catch (err) {
                console.error("Failed to generate AI insight:", err);
            }
        }

        return res.json({ products: LIMITED_PRODUCTS });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// ============================================================================
// NEW: Search Suggestions (Guided Discovery for "No Results")
// ============================================================================
app.get('/api/products/suggestions', (req, res) => {
    try {
        const categories = db.prepare(`SELECT category, COUNT(*) as count FROM products GROUP BY category`).all();
        const popularBrands = db.prepare(`SELECT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY count DESC LIMIT 5`).all();

        res.json({
            categories: categories.map(c => c.category),
            brands: popularBrands.map(b => b.brand),
            popularTerms: ['Vegan', 'High Protein', 'Gluten Free', 'Organic'] // Static for now
        });
    } catch (err) {
        res.status(500).json({ error: 'Suggestions failed' });
    }
});

// ============================================================================
// NEW: Personalized Score Breakdown ("Reasons Why" + Nudges)
// ============================================================================
app.get('/api/products/:id/score-breakdown', (req, res) => {
    const { id } = req.params;
    const userId = req.query.userId; // Get user context for personalization

    try {
        // 1. Fetch Product Data
        const product = db.prepare(`
            SELECT p.*, n.*, s.health_score 
            FROM products p
            JOIN nutrition_facts n ON p.id = n.product_id
            JOIN product_scores s ON p.id = s.product_id
            WHERE p.id = ?
        `).get(id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        // 2. Fetch User Context (if logged in)
        let userContext = { diet: 'Standard', health: 'General Wellness' };
        if (userId) {
            const user = db.prepare('SELECT preferences FROM users WHERE id = ?').get(userId);
            if (user) userContext = JSON.parse(user.preferences || '{}');
        }

        // 3. Generate Nudges based on Rules + User Context
        const breakdown = [];

        // --- Helper to add metric ---
        const addMetric = (key, val, unit, icon, rules) => {
            let rating = 'good';
            let nudge = 'Standard levels';

            // Eval rules
            for (const rule of rules) {
                if (rule.condition(val)) {
                    rating = rule.rating;
                    nudge = typeof rule.nudge === 'function' ? rule.nudge(userContext) : rule.nudge;
                    break;
                }
            }
            breakdown.push({ metric: key, value: val, unit, icon, rating, nudge });
        };

        // --- Rules Definition ---

        // PROTEIN
        addMetric('protein', product.protein_per_100g, 'g', '💪', [
            {
                condition: v => v > 15, rating: 'excellent',
                nudge: ctx => ctx.health === 'High Protein' || ctx.health === 'Weight Loss'
                    ? "✨ Excellent Source — Perfect for your muscle & satiety goals!"
                    : "High Protein — Keeps you fuller for longer and supports muscle repair."
            },
            {
                condition: v => v > 5, rating: 'good',
                nudge: "Good Source — decent protein contribution."
            },
            {
                condition: () => true, rating: 'poor',
                nudge: "Low Protein — Consider pairing with protein-rich foods."
            }
        ]);

        // SUGAR
        addMetric('sugar', product.sugar_per_100g, 'g', '🍬', [
            {
                condition: v => v <= 5, rating: 'excellent',
                nudge: ctx => ctx.health === 'Diabetic' || ctx.health === 'Weight Loss'
                    ? "✨ Low Sugar — Excellent choice for blood sugar management."
                    : "Low Sugar — Helps maintain steady energy levels."
            },
            {
                condition: v => v <= 15, rating: 'good',
                nudge: "Moderate Sugar — Enjoy in moderation."
            },
            {
                condition: () => true, rating: 'poor',
                nudge: ctx => ctx.health === 'Diabetic'
                    ? "⚠️ High Sugar — May spike blood sugar. Proceed with caution."
                    : "High Sugar — May cause energy crashes."
            }
        ]);

        // FIBER
        addMetric('fiber', product.fiber_per_100g, 'g', '🌾', [
            {
                condition: v => v > 6, rating: 'excellent',
                nudge: "High Fiber — Excellent for digestion and gut health."
            },
            {
                condition: v => v > 3, rating: 'good',
                nudge: "Good Fiber — Helps you feel satisfied."
            },
            {
                condition: () => true, rating: 'poor',
                nudge: "Low Fiber — Less filling."
            }
        ]);

        // SALT
        addMetric('salt', product.salt_per_100g, 'g', '🧂', [
            { condition: v => v < 0.3, rating: 'excellent', nudge: "Low Salt — Great for heart health." },
            { condition: v => v < 1.5, rating: 'good', nudge: "Moderate Salt." },
            { condition: () => true, rating: 'poor', nudge: "High Salt — Watch your daily intake." }
        ]);

        // ADDITIVES
        breakdown.push({
            metric: 'additives',
            value: product.has_additives ? 'Yes' : 'No',
            icon: '🧪',
            rating: product.has_additives ? 'poor' : 'excellent',
            nudge: product.has_additives
                ? "Contains Additives — Processed ingredients present."
                : "Clean Label — No artificial additives found."
        });

        // 4. Calculate Category Rank
        const rankData = db.prepare(`
            SELECT COUNT(*) + 1 as rank, (SELECT COUNT(*) FROM products WHERE category = ?) as total
            FROM products p 
            JOIN product_scores s ON p.id = s.product_id
            WHERE p.category = ? AND s.health_score > ?
        `).get(product.category, product.category, product.health_score);

        res.json({
            health_score: product.health_score,
            user_context: userContext,
            breakdown,
            category_rank: {
                rank: rankData.rank,
                total: rankData.total,
                category: product.category
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Score breakdown failed' });
    }
});

// Smart Swap Endpoint (Enhanced with Comparison Logic)
app.get('/api/products/:id/swap', (req, res) => {
    const { id } = req.params;
    try {
        const original = db.prepare(`
            SELECT p.*, s.health_score, n.*
            FROM products p
            JOIN product_scores s ON p.id = s.product_id
            JOIN nutrition_facts n ON p.id = n.product_id
            WHERE p.id = ?
        `).get(id);

        if (!original) return res.status(404).json({ error: 'Product not found' });

        // 1. Try to find better option from SAME BRAND first (Brand Loyalty)
        let betterProduct = db.prepare(`
            SELECT p.*, s.health_score, n.*
            FROM products p
            JOIN product_scores s ON p.id = s.product_id
            JOIN nutrition_facts n ON p.id = n.product_id
            WHERE p.category = ? 
            AND p.brand = ? 
            AND s.health_score > ?
            ORDER BY s.health_score DESC
            LIMIT 1
        `).get(original.category, original.brand, original.health_score);

        let swapReason = "Same brand, healthier recipe.";

        // 2. If no same-brand option, find BEST in category (Cross-Brand)
        if (!betterProduct) {
            betterProduct = db.prepare(`
                SELECT p.*, s.health_score, n.*
                FROM products p
                JOIN product_scores s ON p.id = s.product_id
                JOIN nutrition_facts n ON p.id = n.product_id
                WHERE p.category = ? 
                AND s.health_score > ? + 10  -- Must be significantly better (+10 pts) to switch brands
                ORDER BY s.health_score DESC
                LIMIT 1
            `).get(original.category, original.health_score);

            swapReason = `Significantly healthier (+${betterProduct ? betterProduct.health_score - original.health_score : 0} pts) option.`;
        }

        if (!betterProduct) return res.json(null); // No better option found

        // 3. Construct Comparison Reasons (Why is it better?)
        const reasons = [];
        if (betterProduct.sugar_per_100g < original.sugar_per_100g) reasons.push(`Less Sugar (${betterProduct.sugar_per_100g}g vs ${original.sugar_per_100g}g)`);
        if (betterProduct.protein_per_100g > original.protein_per_100g) reasons.push(`More Protein (${betterProduct.protein_per_100g}g vs ${original.protein_per_100g}g)`);
        if (!betterProduct.has_additives && original.has_additives) reasons.push("No Additives (Clean Label)");
        if (betterProduct.price_local_currency < original.price_local_currency) reasons.push("Cheaper Price");

        res.json({
            original: {
                id: original.id,
                name: original.name,
                brand: original.brand,
                image: original.image_url,
                score: original.health_score
            },
            better: {
                id: betterProduct.id,
                name: betterProduct.name,
                brand: betterProduct.brand,
                image: betterProduct.image_url,
                score: betterProduct.health_score
            },
            swap_type: original.brand === betterProduct.brand ? 'same_brand' : 'cross_brand',
            reason_main: swapReason,
            reasons_list: reasons
        });

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
            WHERE (
                LOWER(p.name) LIKE ? 
                OR LOWER(p.brand) LIKE ? 
                OR LOWER(p.category) LIKE ? 
                OR LOWER(p.dietary_type) LIKE ?
            )
            ORDER BY s.smartest_value_score DESC
            LIMIT 5
        `).all(`%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`, `%${query.toLowerCase()}%`);

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

// ==========================================
// PHASE 3: AI Agent Personalization Endpoints
// ==========================================

// Log scan history - track what users view/scan
app.post('/api/scan-history', (req, res) => {
    const { userId, productId, productName, action } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO scan_history (user_id, product_id, product_name, action)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(userId, productId || null, productName, action || 'viewed');
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to log scan:', err);
        res.status(500).json({ error: 'Failed to log scan' });
    }
});

// Get user's scan history
app.get('/api/user/:userId/history', (req, res) => {
    const { userId } = req.params;

    try {
        const history = db.prepare(`
            SELECT sh.*, p.brand, p.category, ps.health_score
            FROM scan_history sh
            LEFT JOIN products p ON sh.product_id = p.id
            LEFT JOIN product_scores ps ON sh.product_id = ps.product_id
            WHERE sh.user_id = ?
            ORDER BY sh.scanned_at DESC
            LIMIT 20
        `).all(userId);

        res.json(history);
    } catch (err) {
        console.error('Failed to get history:', err);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

// Personalized AI Chat - uses user preferences + scan history
app.post('/api/chat/personalized', async (req, res) => {
    const { query, userId } = req.body;

    try {
        // Get user preferences
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        const preferences = user ? JSON.parse(user.preferences || '{}') : {};

        // Get recent scan history
        const history = db.prepare(`
            SELECT product_name, action, scanned_at 
            FROM scan_history 
            WHERE user_id = ? 
            ORDER BY scanned_at DESC 
            LIMIT 5
        `).all(userId);

        // Search products
        const productsRaw = db.prepare(`
            SELECT 
                p.id, p.brand, p.name, p.image_url, p.category, 
                p.weight_grams, p.price_local_currency, p.dietary_type,
                ps.health_score, ps.smartest_value_score,
                n.sugar_per_100g, n.salt_per_100g, n.protein_per_100g, 
                n.fiber_per_100g, n.has_additives
            FROM products p
            LEFT JOIN product_scores ps ON p.id = ps.product_id
            LEFT JOIN nutrition_facts n ON p.id = n.product_id
            WHERE (
                LOWER(p.name) LIKE ? 
                OR LOWER(p.brand) LIKE ? 
                OR LOWER(p.category) LIKE ? 
                OR LOWER(p.dietary_type) LIKE ?
            )
            ORDER BY ps.health_score DESC
            LIMIT 10
        `).all(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);

        const products = productsRaw.map(p => ({
            food_id: p.id,
            food_name: `${p.brand} ${p.name}`,
            brand_name: p.brand,
            product_image: p.image_url,
            food_description: `${p.weight_grams}g | £${(p.price_local_currency || 0).toFixed(2)} | ${p.dietary_type}`,
            category: p.category,
            price_local_currency: p.price_local_currency || 0,
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

        // Build personalized context for AI
        const context = {
            userDiet: preferences.diet || 'none specified',
            healthGoals: preferences.health || 'general wellness',
            recentlyViewed: history.map(h => h.product_name).filter(Boolean).join(', ') || 'nothing yet',
            query: query
        };

        // Generate personalized AI response
        const message = await aiService.generatePersonalizedInsight(query, products, context);

        res.json({
            message,
            products: products.slice(0, 5),
            personalization: {
                diet: context.userDiet,
                healthGoals: context.healthGoals,
                historySize: history.length
            }
        });

    } catch (err) {
        console.error('Personalized chat error:', err);
        res.status(500).json({ error: 'Personalized chat failed' });
    }
});

// Get personalized recommendations based on history
app.get('/api/user/:userId/recommendations', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        const preferences = user ? JSON.parse(user.preferences || '{}') : {};

        // Get categories user has shown interest in
        const frequentCategories = db.prepare(`
            SELECT p.category, COUNT(*) as count
            FROM scan_history sh
            JOIN products p ON sh.product_id = p.id
            WHERE sh.user_id = ?
            GROUP BY p.category
            ORDER BY count DESC
            LIMIT 3
        `).all(userId);

        // Get top products in those categories (or all if no history)
        let recommendations;
        if (frequentCategories.length > 0) {
            const categories = frequentCategories.map(c => c.category);
            recommendations = db.prepare(`
                SELECT 
                    p.id, p.brand, p.name, p.image_url, p.category,
                    p.price_local_currency, ps.health_score
                FROM products p
                LEFT JOIN product_scores ps ON p.id = ps.product_id
                WHERE p.category IN (${categories.map(() => '?').join(',')})
                ${preferences.diet === 'Vegan' ? "AND p.dietary_type = 'Vegan'" : ''}
                ORDER BY ps.health_score DESC
                LIMIT 6
            `).all(...categories);
        } else {
            recommendations = db.prepare(`
                SELECT 
                    p.id, p.brand, p.name, p.image_url, p.category,
                    p.price_local_currency, ps.health_score
                FROM products p
                LEFT JOIN product_scores ps ON p.id = ps.product_id
                ${preferences.diet === 'Vegan' ? "WHERE p.dietary_type = 'Vegan'" : ''}
                ORDER BY ps.health_score DESC
                LIMIT 6
            `).all();
        }

        res.json({
            recommendations,
            basedOn: frequentCategories.map(c => c.category),
            userPreferences: preferences
        });

    } catch (err) {
        console.error('Recommendations error:', err);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
