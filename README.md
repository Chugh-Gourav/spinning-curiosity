# VOTTAM 🥗
**(Value-Optimized Transparent Trading AI Manager)**

> **An intelligent shopping companion that democratizes access to healthy, sustainable, and affordable organic products from small businesses.**

VOTTAM is an AI-powered product discovery platform designed to solve the "Health vs. Price" dilemma and dramatically reduce consumer cognitive load. It combines nutritional science scoring with price-performance metrics ("Smart Value") and Generative AI to help users make better food choices instantly. 

This repository serves as a functional prototype and a Product Management portfolio piece, demonstrating the entire lifecycle from problem identification to technical execution.

---

## 🎯 The Problem
- **Cognitive Overload**: Modern supermarkets bombard consumers with choices. Identifying healthy, affordable, *and* ethically sourced products requires exhausting mental effort.
- **Deceptive Marketing**: Nutritional labels are complex and often obscured by marketing jargon (e.g., "Low Fat" masking high sugar).
- **Price Sensitivity**: Organic and independent brands are often perceived as prohibitively expensive.

## 💡 The Solution
1. **Instant Clarity**: Traffic-light health scores (0-100) based on European Nutri-Score principles for immediate understanding.
2. **Algorithmic Curation**: Search results are strictly capped at the top 6 products to eliminate choice paralysis.
3. **Smart Swaps**: One-click "Find Better" pipeline that suggests healthier *and* cheaper alternatives.
4. **AI Personalization**: Deeply contextual Gemini AI nudges based on specific user health goals (e.g., "This milk is great for your Keto diet because it has zero sugar").

---

## 🌐 Live Demo & User Guide

| Component | URL |
|-----------|-----|
| **Frontend UI** | [https://Chugh-Gourav.github.io/spinning-curiosity/](https://Chugh-Gourav.github.io/spinning-curiosity/) |
| **Backend API** | [https://vottam-api-595396735241.us-central1.run.app/health](https://vottam-api-595396735241.us-central1.run.app/health) |

### 👤 User Personas (Test Credentials)
Use the dropdown in the top-right to switch between these personas and see how the AI adapts its concise, HTML-rendered bullet point summaries:

| Persona | Goal | AI Behavior |
|---------|------|-------------|
| **Emma** | Keto/Weight Loss | Warns about hidden sugars; praises high fiber options. |
| **David** | Heart Health | Flags high salt content; recommends heart-healthy fats. |
| **Sophia** | Clean Eater | Highlights additives and ultra-processed ingredients. |
| **Gourav** | General Wellness | Balanced advice on nutrition vs. price. |

---

## 🏗️ Technical Architecture

A modern, serverless, and AI-native stack designed for scale and agility.

```mermaid
graph TD
    subgraph Frontend [User's Browser (React SPA)]
        UI[ProductSearch Component]
        Scan[Scanner Component]
        Router[HashRouter]
        UI <--> Router
        Scan <--> Router
    end

    subgraph Cloud [Google Cloud Run]
        API[Express REST API]
        AI[Gemini 1.5 Flash Service]
        Score[Scoring Engine]
        DB[(SQLite Database)]
        
        API -->|Prompts + Context| AI
        AI -.->|JSON/HTML Analysis| API
        API --> Score
        Score --> DB
    end

    subgraph DataSources [External Data]
        OpenFood[OpenFoodFacts DB]
    end

    Frontend --"HTTPS (fetch)"--> API
    DB -.->|"Pre-populated (~400 products)"| OpenFood
    
    classDef frontend fill:#e8f4f8,stroke:#03a9f4,stroke-width:2px;
    classDef backend fill:#fce4ec,stroke:#e91e63,stroke-width:2px;
    classDef external fill:#e8f5e9,stroke:#4caf50,stroke-width:2px;
    
    class Frontend frontend;
    class Cloud backend;
    class DataSources external;
```

### 🛠️ Tech Stack Strategy
*   **Frontend (Vite + React + Tailwind CSS)**: Chosen for lightning-fast HMR during prototyping and highly customizable, utility-first styling to achieve a premium consumer UX quickly.
*   **Backend (Node.js + Express + SQLite)**: A lightweight, easily deployable monolith that handles complex scoring logic and database queries efficiently without over-engineering infrastructure.
*   **AI (Google Gemini 1.5 Flash)**: Selected for its blazing speed and large context window, enabling real-time, personalized nutritional breakdowns without latency degrading the user experience.
*   **Hosting (GitHub Pages + Cloud Run)**: GitHub Pages for zero-cost, CDN-backed static hosting. Cloud Run for scalable, serverless backend compute that only bills when active.

---

## 🚀 Feature Roadmap (What's Next?)
1.  **Phase 4: Barcode Scanning (WIP)**: Implementing `quagga.js` for real-world application. Scan a product in-store, get a score instantly.
2.  **Phase 5: Retailer Integration**: Connecting to Tesco/Asda APIs to check real-time stock and dynamic pricing.
3.  **Phase 6: Community Trust System**: Verified user reviews specifically targeting taste and texture of healthy alternatives.

## 📊 Data & Metrics (Prototype)
*   ~400 Real Products from Open Food Facts API
*   Categorized into: Biscuits, Spreads, Milk, Snacks
*   10+ Real AI nudges generated per session
*   < 500ms Average search latency

---

## 💻 Local Development Setup

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chugh-Gourav/spinning-curiosity.git
   cd spinning-curiosity
   ```

2. **Backend Setup (Terminal 1):**
   ```bash
   cd server
   npm install
   # Create a .env file and add your GEMINI_API_KEY
   echo "GEMINI_API_KEY=your_key_here" > .env
   npm run dev
   ```

3. **Frontend Setup (Terminal 2):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Go to `http://localhost:5173` in your browser.
