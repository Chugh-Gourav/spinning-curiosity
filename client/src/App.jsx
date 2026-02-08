/**
 * VOTTAM - AI-Powered Shopping Agent
 * 
 * Main App Component
 * Sets up React Router for client-side navigation.
 * 
 * Routes:
 * - /home (default) - ProductSearch page with AI recommendations
 * - /scan - Camera scanner for product barcodes
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Scanner } from './pages/Scanner';
import { ProductSearch } from './components/ProductSearch';

function App() {
  return (
    // basename is required for GitHub Pages subdirectory deployment
    <Router basename="/spinning-curiosity">
      <Routes>
        {/* Camera scanner page */}
        <Route path="/scan" element={<Scanner />} />

        {/* Main search page with AI personalization */}
        <Route path="/home" element={<ProductSearch />} />

        {/* Default redirect to home */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
