const { GoogleGenAI } = require('@google/genai');

class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (this.apiKey) {
            this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
            console.log('Google GenAI initialized');
        } else {
            console.log('Google GenAI key missing. Using MOCK AI.');
        }
    }

    async analyzeProduct(product, userProfile = {}) {
        if (this.genAI) {
            const prompt = `
        Analyze this product for a shopping assistant called VOTTAM.

        User Profile: ${JSON.stringify(userProfile)}
        Product: ${JSON.stringify(product)}
        
        Calculate a "Smartest Value" score (0-100) based on nutritional density vs cost.
        Adjust the score +10/-10 based on the User Profile (e.g. if Diabetic and product is high sugar, lower score significantly).

        Provide a verdict: "Excellent", "Good", or "Poor".
        List key Positives and Negatives.
        
        Return JSON format:
        {
          "score": 85,
          "verdict": "Excellent",
          "positives": ["High Protein", "Low Sugar"],
          "negatives": ["Pricey"],
          "analysis": "Brief text explanation mentioning user constraints if applicable..."
        }
      `;
            try {
                const result = await this.genAI.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });

                const response = result.response;
                const text = response.text();
                // Naive JSON extraction
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) return JSON.parse(jsonMatch[0]);
                return { error: "Failed to parse AI response" };
            } catch (e) {
                console.error("AI Error:", e);
                return this.getMockAnalysis(product);
            }
        } else {
            return this.getMockAnalysis(product);
        }
    }

    getMockAnalysis(product) {
        const isHealthy = (product.servings?.serving?.[0]?.sugar || 0) < 5;
        return {
            score: isHealthy ? 88 : 45,
            verdict: isHealthy ? 'Excellent' : 'Poor',
            positives: isHealthy ? ['Low Sugar', 'Good Protein'] : ['Budget Friendly'],
            negatives: isHealthy ? ['Expensive'] : ['High Sugar'],
            analysis: 'This is a mock AI analysis based on simple heuristics.'
        };
    }

    async generateSearchInsight(query, products) {
        if (!products.length) return "I couldn't find any products matching that description.";

        if (this.genAI) {
            const prompt = `
                User searched for: "${query}"
                Found products: ${JSON.stringify(products.slice(0, 3).map(p => ({ name: p.food_name, score: p.scores.health_score })))}
                
                Write a 1-sentence helpful shopping insight for the user. Mention the best option.
            `;
            try {
                const result = await this.genAI.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                });
                return result.response.text();
            } catch (e) {
                console.error(e);
            }
        }

        // Mock fallback
        const best = products.reduce((prev, current) => (prev.scores.health_score > current.scores.health_score) ? prev : current);
        return `I found ${products.length} options. The best choice is ${best.food_name} with a health score of ${best.scores.health_score}.`;
    }
}

module.exports = new AIService();
