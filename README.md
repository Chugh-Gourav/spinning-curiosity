# VOTTAM 🥗

**VOTTAM** is an intelligent product discovery platform designed to help users find healthier, sustainable, and value-driven food alternatives. Inspired by apps like Yuka, it combines nutritional scoring with price-performance metrics ("Smart Value") and Generation AI insights to guide better purchasing decisions.

## 🚀 Features

- **Nutritional Scoring**: Instant traffic-light health scores (Green/Excellent to Red/Poor).
- **Smart Swaps**: Automatically suggests healthier alternatives when viewing lower-rated products.
- **Price Transparency**: Includes price-per-unit and "Protein per £" metrics to highlight true value.
- **Gen AI Search ✨**: Toggle-able AI assistant that provides contextual insights ("Why is this better?") rather than just a list of links.
- **Barcode Scanner 📷**: Integrated camera support to scan product barcodes for instant analysis.
- **Dietary Filters**: One-tap filtering for Vegan, Gluten-Free, and other dietary needs.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (lightweight, zero-config)
- **AI Integration**: Custom implementation ready for LLM integration (Google Gemini/OpenAI).
- **Deployment**: GitHub Pages (Frontend) + Node Server (Backend)

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm

### Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Chugh-Gourav/spinning-curiosity.git vottam
    cd vottam
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Database Setup**
    The SQLite database is pre-configured. To seed it with initial data:
    ```bash
    cd server
    node seed.js
    ```

## 🏃‍♂️ Running the App

### 1. Start the Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

### 2. Start the Frontend
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

## 🌐 Deployment

The frontend is deployed to GitHub Pages via GitHub Actions.

- **Live Demo**: [https://Chugh-Gourav.github.io/VOTTAM/](https://Chugh-Gourav.github.io/VOTTAM/)

*Note: The demo requires the backend server to be running locally or deployed to a public cloud service to fetch live data.*

## 🤝 Contributing

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
