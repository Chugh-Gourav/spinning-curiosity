# VOTTAM 🥗
**(Value-Optimized Transparent Trading AI Manager)**

> **The intelligent shopping companion that democratizes access to healthy, sustainable, and affordable food.**

VOTTAM is a prototype AI agent designed to solve the "Health vs. Price" dilemma. It combines nutritional science (Yuka-style scoring) with price-performance metrics ("Smart Value") and Generative AI to help users make better food choices instantly.

---

## 🎯 The Problem
- **Confusion**: Nutritional labels are hard to read. Is "low fat" actually healthy?
- **Price Sensitivity**: Healthy food is perceived as expensive. 
- **Decision Fatigue**: Too many options, too little time.

## 💡 The Solution
1. **Instant Clarity**: Traffic-light health scores (0-100) for immediate understanding.
2. **Smart Swaps**: One-click suggestions for healthier *and* cheaper alternatives.
3. **AI Personalization**: Context-aware nudges based on user goals (e.g., "High sugar is risky for your Keto diet").

---

## 🌐 Live Demo & User Guide

| Component | URL |
|-----------|-----|
| **Frontend** | [https://Chugh-Gourav.github.io/spinning-curiosity/](https://Chugh-Gourav.github.io/spinning-curiosity/) |
| **Backend API** | [https://vottam-api-595396735241.us-central1.run.app](https://vottam-api-595396735241.us-central1.run.app/health) |

### 👤 User Personas (Test Credentials)
Use the dropdown in the top-right to switch between these personas and see how the AI adapts:

| Persona | Goal | AI Behavior |
|---------|------|-------------|
| **Emma** | Keto/Weight Loss | Warns about hidden sugars; praises high fiber. |
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

---

## 🚀 Key Features Roadmap

### Phase 1: MVP (Completed) ✅
- [x] **Core Scoring Engine**: Nutritional analysis (Sugar, Salt, Protein, Fiber, Additives).
- [x] **Smart Value Metric**: "Protein per £" calculation.
- [x] **Basic Search**: Keyword match for brands and categories.

### Phase 2: AI & Personalization (Completed) ✅
- [x] **Generative Search**: "Find me a high-protein vegan snack" (Natural Language).
- [x] **Context-Aware Nudges**: "This is good, but high in sugar for your Diabetes goal."
- [x] **Smart Swaps**: Algorithmic recommendation of better products.

### Phase 3: Future Horizon (Planned) 🔮
- [ ] **OCR Scanning**: Extract nutrition facts from photos of unknown products.
- [ ] **Community Validation**: User upvotes on "tasty" healthy swaps.
- [ ] **Grocery Integration**: "Add to Basket" for Tesco/Sainsbury's APIs.

---

## 📊 Data & Metrics (Prototype Scale)

| Metric | Current Status |
|--------|----------------|
| **Products** | 39 (Curated high-quality dataset) |
| **Categories** | Nut Butter, Plant-Based Milk, Protein Powder |
| **Users** | 4 Demo Profiles |
| **Latency** | <500ms (P95) |

---

## 🏃‍♂️ Local Development

```bash
# 1. Clone & Setup
git clone https://github.com/Chugh-Gourav/spinning-curiosity.git
cd spinning-curiosity

# 2. Run Backend (Port 3000)
cd server && npm install && npm start

# 3. Run Frontend (Port 5173)
cd client && npm install && npm run dev
```

---

## 📄 License
MIT License - Open Source for Educational Use.
