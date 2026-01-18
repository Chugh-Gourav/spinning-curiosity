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
app.get('/api/products', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Query required' });

    try {
        const results = await fatSecretService.searchProducts(query);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
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
    // 1. Determine intent (Search vs General) - simplifying to Search for now

    try {
        // Simple flow: Search products, then summarize with AI (optional)
        const products = await fatSecretService.searchProducts(query);

        let message = `Found ${products.length} products for "${query}".`;
        if (products.length > 0) {
            message += " Click to analyze value.";
        } else {
            message = "No products found. Try a different term.";
        }

        res.json({
            message,
            products: products.slice(0, 4) // Limit to top 4 for better UI fit
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Chat processing failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
