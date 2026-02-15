# VOTTAM 🥗

**VOTTAM** (Value-Optimized Transparent Trading AI Manager) is an intelligent product discovery platform designed to help users find healthier, sustainable, and value-driven food alternatives. Inspired by apps like Yuka, it combines nutritional scoring with price-performance metrics ("Smart Value") and Generative AI insights.

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | [https://Chugh-Gourav.github.io/spinning-curiosity/](https://Chugh-Gourav.github.io/spinning-curiosity/) |
| **Backend API** | [https://vottam-api-595396735241.us-central1.run.app](https://vottam-api-595396735241.us-central1.run.app/health) |

### 👤 Test Users (for Personalization)
Select these users from the dropdown to test different AI personas:
- **Emma** (Keto/Weight Loss): See low-sugar nudges.
- **David** (Heart Health): See low-salt warnings.
- **Sophia** (Clean Eater): See additive-free preferences.
- **Gourav** (General): Standard healthy eating.

---

## 🏗️ Architecture Overview

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
│  │  └────────────────────────────┬─────────────────────────────────┘   │    │
│  │                               │                                      │    │
│  │  ┌────────────────────────────▼─────────────────────────────────┐   │    │
│  │  │                    SQLite Database (vottam.db)               │   │    │
│  │  │  ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │   │    │
│  │  │  │ products │ │nutrition_fact│ │product_scores│ │  users  │ │   │    │
│  │  │  │  (39)    │ │     (39)     │ │    (39)      │ │   (4)   │ │   │    │
│  │  │  └──────────┘ └──────────────┘ └──────────────┘ └─────────┘ │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User opens app** → Browser loads React SPA from GitHub Pages
2. **App loads** → Frontend calls `/api/users` to get user list
3. **User searches** → Frontend calls `/api/products?q=oatly&category=...`
4. **AI Search** → Frontend calls `/api/chat/personalized` with user context
5. **Smart Swap** → Frontend calls `/api/products/:id/swap` for alternatives

---

## 🗄️ Database Schema

```sql
-- Products table (39 items)
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    brand TEXT NOT NULL,           -- e.g., "Oatly", "Alpro"
    name TEXT NOT NULL,            -- e.g., "Organic Oat Drink"
    image_url TEXT,                -- OpenFoodFacts image URL
    category TEXT,                 -- "Nut Butter", "Plant-Based Milk", "Protein Powder"
    dietary_type TEXT,             -- "Vegan", "Vegetarian"
    weight_grams REAL,             -- e.g., 1000
    price_local_currency REAL      -- e.g., 2.50
);

-- Nutrition facts (Yuka-style scoring)
CREATE TABLE nutrition_facts (
    product_id INTEGER,
    sugar_per_100g REAL,           -- Lower is better
    salt_per_100g REAL,            -- Lower is better
    protein_per_100g REAL,         -- Higher is better
    fiber_per_100g REAL,           -- Higher is better
    has_additives BOOLEAN          -- False is better
);

-- Calculated health scores
CREATE TABLE product_scores (
    product_id INTEGER,
    health_score INTEGER,          -- 0-100 (Yuka-style)
    smartest_value_score REAL      -- Price-performance ratio
);

-- Users with dietary preferences
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    preferences TEXT               -- JSON: {"diet": "Vegan", "health": "Diabetic"}
);

-- Scan history for personalization
CREATE TABLE scan_history (
    user_id INTEGER,
    product_id INTEGER,
    action TEXT,                   -- "viewed", "scanned", "swapped"
    scanned_at DATETIME
);
```

---

## 🔌 API Reference

### Base URL
```
https://vottam-api-595396735241.us-central1.run.app
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/products?q=&category=&maxPrice=` | Search products |
| `GET` | `/api/products/:id/swap` | Get healthier alternative |
| `GET` | `/api/categories` | List all categories |
| `GET` | `/api/users` | Get all demo users |
| `POST` | `/api/login` | Authenticate user |
| `POST` | `/api/chat` | AI-powered search |
| `POST` | `/api/chat/personalized` | Personalized AI search |
| `POST` | `/api/scan-history` | Log user scans |
| `GET` | `/api/user/:id/history` | Get scan history |
| `GET` | `/api/user/:id/recommendations` | AI recommendations |

### Example API Calls

```bash
# Get all products
curl "https://vottam-api-595396735241.us-central1.run.app/api/products?source=local"

# Search for Oatly products
curl "https://vottam-api-595396735241.us-central1.run.app/api/products?q=oatly&source=local"

# Get categories
curl "https://vottam-api-595396735241.us-central1.run.app/api/categories"

# Get all users
curl "https://vottam-api-595396735241.us-central1.run.app/api/users"
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + Vite | Fast SPA with modern React |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Routing** | React Router (HashRouter) | Client-side routing for GitHub Pages |
| **Backend** | Node.js + Express | REST API server |
| **Database** | SQLite (better-sqlite3) | Lightweight, serverless database |
| **AI** | Google Gemini API | Personalized search insights |
| **Frontend Hosting** | GitHub Pages | Free static hosting |
| **Backend Hosting** | Google Cloud Run | Serverless container hosting |

---

## 🚀 Features

### Core Features
- **Nutritional Scoring**: Traffic-light health scores (Green/Excellent to Red/Poor)
- **Smart Swaps**: Automatic healthier alternative suggestions
- **Price Transparency**: "Protein per £" smart value metrics
- **Gen AI Search ✨**: Toggle AI for contextual insights
- **Barcode Scanner 📷**: Camera-based product scanning

### AI Personalization (Phase 3)
- **User Preferences**: Diet type + health goals stored per user
- **Scan History**: Track what users view/scan
- **Personalized Recommendations**: AI uses history + preferences

---

## 📦 Data Summary

| Category | Count | Examples |
|----------|-------|----------|
| Nut Butter | 15 | Pip & Nut, Whole Earth, Meridian |
| Plant-Based Milk | 12 | Oatly, Alpro, Plenish |
| Protein Powder | 12 | Vega, Myprotein, Bulk |
| **Total Products** | **39** | |
| **Demo Users** | **4** | gourav, sarah, mike, demo |

---

## 📂 Project Structure

```
VOTTAM/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductSearch.jsx   # Main search UI
│   │   ├── pages/
│   │   │   └── Scanner.jsx         # Barcode scanner
│   │   ├── App.jsx                 # Router configuration
│   │   └── main.jsx                # Entry point
│   ├── dist/                       # Built files (deployed to gh-pages)
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── db.js                      # Database setup + schema
│   ├── index.js                   # Express routes
│   ├── vottam.db                  # SQLite database file
│   └── services/
│       ├── ai.js                  # Gemini AI integration
│       └── fatsecret.js           # External API (optional)
│
└── README.md
```

---

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js v18+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/Chugh-Gourav/spinning-curiosity.git
cd spinning-curiosity

# Install & run backend
cd server
npm install
npm start  # Runs on http://localhost:3000

# Install & run frontend (new terminal)
cd client
npm install
npm run dev  # Runs on http://localhost:5173
```

### Deployment

```bash
# Deploy frontend to GitHub Pages
cd client
npm run deploy  # Builds + pushes to gh-pages branch

# Backend is already on Cloud Run
# Re-deploy via: gcloud run deploy (requires Dockerfile)
```

# 2. Run Backend (Port 3000)
cd server && npm install && npm start

# 3. Run Frontend (Port 5173)
cd client && npm install && npm run dev
```

---

## 📄 License
MIT License - Open Source for Educational Use.
```
