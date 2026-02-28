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

---

## 🚀 Key Features Roadmap

### Phase 1: MVP (Completed) ✅
- [x] **Core Scoring Engine**: Nutritional analysis (Sugar, Salt, Protein, Fiber, Additives).
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

---

## 🏃‍♂️ Local Development

```bash
# 1. Clone & Setup
git clone https://github.com/Chugh-Gourav/spinning-curiosity.git
cd spinning-curiosity/VOTTAM-V3-Organic

# 2. Run Backend (Port 3000)
# Ensure you have a .env file with GEMINI_API_KEY
cd server && npm install && npm start

# 3. Run Frontend (Port 5173 / 3000 mapping)
cd ../client && npm install && npm run dev
```

---

## 📄 License
MIT License - Open Source for Educational Use.
