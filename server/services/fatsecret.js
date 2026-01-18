const FatSecret = require('../lib/FatSecretClient');
const { db } = require('../db');

// Mock Data
const MOCK_PRODUCTS = [
    {
        product_id: '1001',
        product_name: 'Organic Peanut Butter',
        brand_name: 'Whole Earth',
        product_description: 'Crunchy organic peanut butter.',
        product_image: 'https://placehold.co/200x200?text=Peanut+Butter',
        servings: {
            serving: [{
                metric_serving_amount: "100.000",
                metric_serving_unit: "g",
                sugar: "3.5",
                fiber: "6.0",
                protein: "25.0",
                salt: "0.01",
                calories: "580"
            }]
        }
    },
    {
        product_id: '1002',
        product_name: 'Vegan Protein Powder',
        brand_name: 'Vega One',
        product_description: 'Chocolate flavor plant-based protein.',
        product_image: 'https://placehold.co/200x200?text=Protein',
        servings: {
            serving: [{
                metric_serving_amount: "100.000",
                metric_serving_unit: "g",
                sugar: "1.0",
                fiber: "5.0",
                protein: "70.0",
                salt: "1.2",
                calories: "380"
            }]
        }
    }
];

class FatSecretService {
    constructor() {
        this.apiKey = process.env.FATSECRET_CLIENT_ID;
        this.apiSecret = process.env.FATSECRET_CLIENT_SECRET;

        if (this.apiKey && this.apiSecret) {
            this.client = new FatSecret(this.apiKey, this.apiSecret);
            console.log('FatSecret API initialized');
        } else {
            console.log('FatSecret API keys missing. Using MOCK data.');
            this.client = null;
        }
    }

    async searchProducts(query) {
        if (this.client) {
            try {
                // Implement real API call
                const results = await this.client.method('foods.search', { search_expression: query, format: 'json' });

                let foods = [];
                if (results && results.foods && results.foods.food) {
                    foods = Array.isArray(results.foods.food) ? results.foods.food : [results.foods.food];
                }

                // POST-PROCESSING: Inject better images for demo purposes
                return foods.map(f => {
                    // For "Peanut Butter" query specifically - Force Injection
                    if (query.toLowerCase().includes('peanut butter')) {
                        // Image of a person holding a jar of peanut butter spread
                        f.product_image = 'https://images.pexels.com/photos/5966431/pexels-photo-5966431.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }
                    return f;
                });
            } catch (error) {
                console.error('FatSecret API Error:', error);
                return [];
            }
        } else {
            // Return mock matches
            return MOCK_PRODUCTS.filter(p =>
                p.product_name.toLowerCase().includes(query.toLowerCase()) ||
                p.brand_name.toLowerCase().includes(query.toLowerCase())
            ).map(p => ({
                food_id: p.product_id,
                food_name: p.product_name,
                brand_name: p.brand_name,
                food_description: p.product_description
            }));
        }
    }

    async getProductDetails(foodId) {
        if (this.client) {
            // Real API
            return await this.client.method('food.get.v2', { food_id: foodId, format: 'json' });
        } else {
            return MOCK_PRODUCTS.find(p => p.product_id === foodId);
        }
    }
}

module.exports = new FatSecretService();
