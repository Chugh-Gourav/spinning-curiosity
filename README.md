# VOTTAM 🥗
**(Value-Optimized Transparent Trading AI Manager)**

<<<<<<< HEAD
> **An intelligent shopping companion that democratizes access to healthy, sustainable, and affordable organic products from small businesses.**

VOTTAM is an AI-powered product discovery platform designed to solve the "Health vs. Price" dilemma and dramatically reduce consumer cognitive load. It combines nutritional science scoring with price-performance metrics ("Smart Value") and Generative AI to help users make better food choices instantly. 

This repository serves as a functional prototype and a Product Management portfolio piece, demonstrating the entire lifecycle from problem identification to technical execution.
=======
> **The intelligent shopping companion that democratizes access to healthy, sustainable, and affordable food.**

VOTTAM is a prototype AI agent designed to solve the "Health vs. Price" dilemma. It combines nutritional science (Yuka-style scoring) with price-performance metrics ("Smart Value") and Generative AI to help users make better food choices instantly.
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)

---

## 🎯 The Problem
<<<<<<< HEAD
- **Cognitive Overload**: Modern supermarkets bombard consumers with choices. Identifying healthy, affordable, *and* ethically sourced products requires exhausting mental effort.
- **Deceptive Marketing**: Nutritional labels are complex and often obscured by marketing jargon (e.g., "Low Fat" masking high sugar).
- **Price Sensitivity**: Organic and independent brands are often perceived as prohibitively expensive.

## 💡 The Solution
1. **Instant Clarity**: Traffic-light health scores (0-100) based on European Nutri-Score principles for immediate understanding.
2. **Algorithmic Curation**: Search results are strictly capped at the top 6 products to eliminate choice paralysis.
3. **Smart Swaps**: One-click "Find Better" pipeline that suggests healthier *and* cheaper alternatives.
4. **AI Personalization**: Deeply contextual Gemini AI nudges based on specific user health goals (e.g., "This milk is great for your Keto diet because it has zero sugar").
=======
- **Confusion**: Nutritional labels are hard to read. Is "low fat" actually healthy?
- **Price Sensitivity**: Healthy food is perceived as expensive. 
- **Decision Fatigue**: Too many options, too little time.

## 💡 The Solution
1. **Instant Clarity**: Traffic-light health scores (0-100) for immediate understanding.
2. **Smart Swaps**: One-click suggestions for healthier *and* cheaper alternatives.
3. **AI Personalization**: Context-aware nudges based on user goals (e.g., "High sugar is risky for your Keto diet").
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)

---

## 🌐 Live Demo & User Guide

| Component | URL |
|-----------|-----|
<<<<<<< HEAD
| **Frontend UI** | [https://Chugh-Gourav.github.io/spinning-curiosity/](https://Chugh-Gourav.github.io/spinning-curiosity/) |
| **Backend API** | [https://vottam-api-595396735241.us-central1.run.app/health](https://vottam-api-595396735241.us-central1.run.app/health) |

### 👤 User Personas (Test Credentials)
Use the dropdown in the top-right to switch between these personas and see how the AI adapts its concise, HTML-rendered bullet point summaries:

| Persona | Goal | AI Behavior |
|---------|------|-------------|
| **Emma** | Keto/Weight Loss | Warns about hidden sugars; praises high fiber options. |
=======
| **Frontend** | [https://Chugh-Gourav.github.io/spinning-curiosity/](https://Chugh-Gourav.github.io/spinning-curiosity/) |
| **Backend API** | [https://vottam-api-595396735241.us-central1.run.app](https://vottam-api-595396735241.us-central1.run.app/health) |

### 👤 User Personas (Test Credentials)
Use the dropdown in the top-right to switch between these personas and see how the AI adapts:

| Persona | Goal | AI Behavior |
|---------|------|-------------|
| **Emma** | Keto/Weight Loss | Warns about hidden sugars; praises high fiber. |
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)
| **David** | Heart Health | Flags high salt content; recommends heart-healthy fats. |
| **Sophia** | Clean Eater | Highlights additives and ultra-processed ingredients. |
| **Gourav** | General Wellness | Balanced advice on nutrition vs. price. |

---

## 🏗️ Technical Architecture

A modern, serverless, and AI-native stack designed for scale and agility.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    React SPA (Single Page App)                       │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │    │
│  │  │ ProductSearch│  │   Scanner    │  │    HashRouter (#/home)  │   │    │
│  │  │  Component   │  │  Component   │  │    (#/scan)             │   │    │
│  │  └──────┬───────┘  └──────┬───────┘  └─────────────────────────┘   │    │
│  └─────────┼─────────────────┼──────────────────────────────────────────┘    │
│            │                 │                                               │
│            └────────┬────────┘                                               │
│                     │ API Calls (fetch)                                      │
<<<<<<< HEAD
└─────────────────────┼───────────────────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD RUN (Containerized)                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   Node.js + Express Server                           │    │
│  │  ┌──────────────────────────────────────────────────────────────┐   │    │
│  │  │                      REST API Layer                           │   │    │
│  │  │  /api/products  /api/users  /api/chat  /api/scan-history     │   │    │
│  │  └────────┬───────────────────┬─────────────────────────────────┘   │    │
│  │           │                   │                                      │    │
│  │  ┌────────▼───────────────────▼─────────┐   ┌─────────────────────┐  │    │
│  │  │      SQLite Database (vottam.db)     │   │  StartUp AI Service │  │    │
│  │  │                                      │   │    (Gemini 1.5)     │  │    │
│  │  │ Products | Users | History | Scores  │◄──┤                     │  │    │
│  │  └──────────────────────────────────────┘   └──────────▲──────────┘  │    │
│  └───────────┬────────────────────────────────────────────┼─────────────┘    │
│              │                                            │                  │
└──────────────┼────────────────────────────────────────────┼──────────────────┘
               │                                            │
               ▼                                            ▼
      [File System]                              [Google Gemini API]
```

### 🛠️ Tech Stack Strategy
- **Frontend**: **React 19 + Vite + Tailwind CSS** (Responsive, component-driven, flex/grid layouts).
- **Backend**: **Node.js + Express** (Lightweight, event-driven REST API).
- **Database**: **SQLite** (Pre-populated with ~400 real products from Open Food Facts for sub-100ms querying without external API latency).
- **AI Integration**: **Google Gemini 1.5 API** (Strictly utilized for semantic interpretation and personalized summarization, *not* data hallucination).
- **Hosting**: **Google Cloud Run** (Serverless backend) + **GitHub Pages** (Static frontend edge delivery).
=======
36: └─────────────────────┼───────────────────────────────────────────────────────┘
37:                       │ HTTPS
38:                       ▼
39: ┌─────────────────────────────────────────────────────────────────────────────┐
40: │                    GOOGLE CLOUD RUN (Containerized)                          │
41: │  ┌─────────────────────────────────────────────────────────────────────┐    │
42: │  │                   Node.js + Express Server                           │    │
43: │  │  ┌──────────────────────────────────────────────────────────────┐   │    │
44: │  │  │                      REST API Layer                           │   │    │
45: │  │  │  /api/products  /api/users  /api/chat  /api/scan-history     │   │    │
46: │  │  └────────┬───────────────────┬─────────────────────────────────┘   │    │
47: │  │           │                   │                                      │    │
48: │  │  ┌────────▼───────────────────▼─────────┐   ┌─────────────────────┐  │    │
49: │  │  │      SQLite Database (vottam.db)     │   │  StartUp AI Service │  │    │
50: │  │  │                                      │   │    (Gemini 1.5)     │  │    │
51: │  │  │ Products | Users | History | Scores  │◄──┤                     │  │    │
52: │  │  └──────────────────────────────────────┘   └──────────▲──────────┘  │    │
53: │  └───────────┬────────────────────────────────────────────┼─────────────┘    │
54: │              │                                            │                  │
55: └──────────────┼────────────────────────────────────────────┼──────────────────┘
56:                │                                            │
57:                ▼                                            ▼
58:       [File System]                              [Google Gemini API]
```

### 🛠️ Tech Stack Strategy
- **Frontend**: **React 19 + Vite** (Fast, responsive, component-driven).
- **Backend**: **Node.js + Express** (Lightweight, event-driven, extensive ecosystem).
- **Database**: **SQLite** (Zero-latency access for prototyping; path to Cloud SQL for scale).
- **AI Integration**: **Google Gemini API** (Context-window efficient for personalized nutrition analysis).
- **Hosting**: **Google Cloud Run** (Serverless, pay-per-use) + **GitHub Pages** (Static edge delivery).
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)

---

## 🚀 Key Features Roadmap

### Phase 1: MVP (Completed) ✅
- [x] **Core Scoring Engine**: Nutritional analysis (Sugar, Salt, Protein, Fiber, Additives).
<<<<<<< HEAD
- [x] **Smart Value Metric**: Health-to-Price ratio penalty system.
- [x] **Real Data Ingestion**: Transitioned from AI-mocked data to a robust local SQLite implementation containing ~400 real products from `world.openfoodfacts.org`.

### Phase 2: AI & Personalization (Completed) ✅
- [x] **Generative Search via Gemini**: Cross-referencing user diet/health goals against the top 6 product search results.
- [x] **Context-Aware Nudges**: Auto-generated HTML bullet points analyzing product fit (e.g., "This is good, but high in sugar for your Diabetes goal").
- [x] **Smart Swaps UI**: Non-intrusive side-panel sliding UI to algorthmically recommend better, cheaper products in the same category.

### Phase 3: Monetization & B2B Expansion (Planned) 🔮
- [x] **Subscription Tier**: Implemented UI logic for a £4.99/mo premium model featuring unlimited scanning.
- [ ] **OCR & Barcode Scanning**: Full implementation of live camera feed parsing to extract nutrition facts from physical products.
- [ ] **Retailer API Pipelines**: Direct inventory hooks into organic grocers for live pricing updates.

---

## 📊 Data & Metrics

| Metric | Current Status |
|--------|----------------|
| **Products** | 424 (Real Open Food Facts Organic Data) |
| **Categories** | Biscuits, Spreads, Milk, Snacks |
| **Users** | 6 Curated Demo Personas |
| **Search Latency** | <50ms (SQLite Local) |
=======
- [x] **Smart Value Metric**: "Protein per £" calculation.
- [x] **Basic Search**: Keyword match for brands and categories.

### Phase 2: AI & Personalization (Completed) ✅
- [x] **Generative Search**: "Find me a high-protein vegan snack" (Natural Language).
- [x] **Context-Aware Nudges**: "This is good, but high in sugar for your Diabetes goal."
- [x] **Smart Swaps**: Algorithmic recommendation of better products.

### Phase 3: Future Horizon (Planned) 🔮
- [ ] **OCR & Barcode Scanning**: Extract nutrition facts from photos or barcodes of unknown products.
- [ ] **Community Trust**: User upvotes and summarized comments on "tasty" healthy swaps.
- [ ] **Retail Partnerships**: "Add to Basket" integration for Tesco/Sainsbury's (B2B Opportunity).

---

## 📊 Data & Metrics (Prototype Scale)

| Metric | Current Status |
|--------|----------------|
| **Products** | 39 (Curated high-quality dataset) |
| **Categories** | Nut Butter, Plant-Based Milk, Protein Powder |
| **Users** | 6 Demo Profiles |
| **Latency** | <500ms (P95) |
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)

---

## 🏃‍♂️ Local Development

```bash
# 1. Clone & Setup
git clone https://github.com/Chugh-Gourav/spinning-curiosity.git
<<<<<<< HEAD
cd spinning-curiosity/VOTTAM-V3-Organic

# 2. Run Backend (Port 3000)
# Ensure you have a .env file with GEMINI_API_KEY
cd server && npm install && npm start

# 3. Run Frontend (Port 5173 / 3000 mapping)
cd ../client && npm install && npm run dev
=======
cd spinning-curiosity

# 2. Run Backend (Port 3000)
cd server && npm install && npm start

# 3. Run Frontend (Port 5173)
cd client && npm install && npm run dev
>>>>>>> 515703d (Initialize VOTTAM Pivot V3 Repository)
```

---

## 📄 License
MIT License - Open Source for Educational Use.
