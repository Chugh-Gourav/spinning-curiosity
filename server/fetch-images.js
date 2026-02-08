const { db, initDb } = require('./db');
const axios = require('axios'); // Use axios for CommonJS compatibility

// Rate limiting: OpenFoodFacts is free but polite. 
const DELAY_MS = 1500; // 1.5 seconds between requests

async function searchOpenFoodFacts(query) {
    const searchTerms = encodeURIComponent(query);
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerms}&search_simple=1&action=process&json=1&page_size=1`;

    // Add User-Agent as requested by OpenFoodFacts API policy
    const headers = {
        'User-Agent': 'VottamPrototype - NodeScript - version 1.0'
    };

    try {
        const response = await axios.get(url, { headers });
        const data = response.data;

        if (data.products && data.products.length > 0) {
            const product = data.products[0];

            // Extract Image
            const imageUrl = product.image_url || product.image_front_url || product.image_small_url || null;

            // Extract Nutrition (per 100g/ml)
            // Note: OpenFoodFacts keys can be irregular, but standard ones are usually present
            const nutrition = {
                sugar: product.nutriments?.sugars_100g || 0,
                salt: product.nutriments?.salt_100g || 0,
                protein: product.nutriments?.proteins_100g || 0,
                fiber: product.nutriments?.fiber_100g || 0,
                additives: (product.additives_tags && product.additives_tags.length > 0) ? 1 : 0
            };

            return { imageUrl, nutrition };
        }
        return null;
    } catch (error) {
        console.error(`  Fetch error: ${error.message}`);
        return null;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateProductsData() {
    initDb();

    // Get all products
    const products = db.prepare('SELECT id, brand, name, category FROM products ORDER BY id').all();
    console.log(`\n🔍 Fetching data for ${products.length} products via OpenFoodFacts...\n`);

    const updateImageStmt = db.prepare('UPDATE products SET image_url = ? WHERE id = ?');
    const updateNutritionStmt = db.prepare(`
        UPDATE nutrition_facts 
        SET sugar_per_100g = ?, 
            salt_per_100g = ?, 
            protein_per_100g = ?, 
            fiber_per_100g = ?, 
            has_additives = ?
        WHERE product_id = ?
    `);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Refine query for better results (e.g. Include brand and name)
        const searchQuery = `${product.brand} ${product.name}`;

        console.log(`[${i + 1}/${products.length}] Searching: ${searchQuery}`);

        const result = await searchOpenFoodFacts(searchQuery);

        if (result && result.imageUrl) {
            // Update Image
            updateImageStmt.run(result.imageUrl, product.id);

            // Update Nutrition
            updateNutritionStmt.run(
                result.nutrition.sugar,
                result.nutrition.salt,
                result.nutrition.protein,
                result.nutrition.fiber,
                result.nutrition.additives,
                product.id
            );

            console.log(`  ✅ Found: ${result.imageUrl.substring(0, 50)}...`);
            console.log(`     Nutrition: Sugar:${result.nutrition.sugar}g, Protein:${result.nutrition.protein}g`);
            success++;
        } else {
            console.log(`  ❌ No data found (keeping existing/placeholder)`);
            failed++;
        }

        // Rate limiting - wait between requests
        if (i < products.length - 1) {
            await sleep(DELAY_MS);
        }
    }

    console.log(`\n========================================`);
    console.log(`✅ Successfully updated: ${success} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`========================================\n`);
}

// Run the script
updateProductsData().then(() => {
    console.log('Done!');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
