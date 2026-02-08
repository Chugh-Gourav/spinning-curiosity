const { db, initDb } = require('./db');

// Realistic UK prices (approximate)
const priceMap = {
    'Pip & Nut': 3.00,
    'Whole Earth': 3.00,
    'Meridian': 2.80,
    'Sun-Pat': 2.50,
    'Manilife': 3.99,
    'Biona': 3.50,
    'Bulk': 8.99,
    'Skippy': 2.70,
    'Myprotein': 6.99,
    'Nutty Bruce': 4.50,
    'Tesco': 1.60,
    'Sainsbury\'s': 1.60,
    'Aldi Bramwells': 1.25,
    'Carley\'s': 4.99,
    'Yumello': 3.50,
    'Oatly': 2.00,
    'Alpro': 1.80,
    'Minor Figures': 1.90,
    'Rude Health': 2.20,
    'Califia Farms': 2.50,
    'Plenish': 2.00,
    'Koko': 1.70,
    'Provamel': 2.10,
    'Sproud': 1.90,
    'Vega': 29.99,
    'Garden of Life': 32.00,
    'Nutricis': 18.00,
    'PhD': 22.00,
    'Sunwarrior': 28.00,
    'Pulsin': 12.00,
    'Huel': 45.00,
    'Orgain': 26.00,
    'Naturya': 14.00,
    'THE PROTEIN WORKS': 24.00
};

function calculateHealthScore(nutrition, product) {
    let score = 0;

    // Base checks
    if (!nutrition) return 50; // Default if missing data

    // 1. Nutrition (Base 60)
    let nutritionPoints = 60;

    // Sugar Penalty
    if (nutrition.sugar_per_100g > 15) nutritionPoints -= 20;
    else if (nutrition.sugar_per_100g > 5) nutritionPoints -= 10;

    // Salt Penalty
    if (nutrition.salt_per_100g > 1.5) nutritionPoints -= 15;
    else if (nutrition.salt_per_100g > 0.8) nutritionPoints -= 8;

    // Protein Bonus
    if (nutrition.protein_per_100g > 20) nutritionPoints += 5;

    // Fiber Bonus
    if (nutrition.fiber_per_100g > 5) nutritionPoints += 5;

    // Clamp Nutrition
    nutritionPoints = Math.max(0, Math.min(60, nutritionPoints));
    score += nutritionPoints;

    // 2. Additives (Max 30)
    // If NO additives tag, assume clean (+30)
    // If has additives tag = 1, assume processed (+0)
    if (!nutrition.has_additives) {
        score += 30;
    }

    // 3. Organic (Max 10)
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    if (name.includes('organic') || brand.includes('organic')) {
        score += 10;
    }

    return Math.max(0, Math.min(100, score));
}

function updateData() {
    initDb();

    // Get all products joined with current nutrition
    const stmt = db.prepare(`
        SELECT p.id, p.brand, p.name, 
               n.sugar_per_100g, n.salt_per_100g, n.protein_per_100g, n.fiber_per_100g, n.has_additives 
        FROM products p 
        LEFT JOIN nutrition_facts n ON p.id = n.product_id
    `);

    const products = stmt.all();

    const updatePrice = db.prepare('UPDATE products SET price_local_currency = ? WHERE id = ?');
    const updateScore = db.prepare('UPDATE product_scores SET health_score = ? WHERE product_id = ?');

    const transaction = db.transaction((items) => {
        for (const item of items) {
            // Price Logic
            let price = 5.99; // Fallback
            for (const [key, val] of Object.entries(priceMap)) {
                if (item.brand.includes(key)) {
                    price = val;
                    break;
                }
            }
            updatePrice.run(price, item.id);

            // Health Score Logic
            const score = calculateHealthScore(item, item);
            updateScore.run(score, item.id);

            console.log(`Updated ${item.brand}: £${price}, Score: ${score}`);
        }
    });

    transaction(products);
    console.log(`✅ Updated ${products.length} products.`);
}

updateData();
