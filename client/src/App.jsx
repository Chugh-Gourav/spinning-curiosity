/**
 * VOTTAM - AI-Powered Shopping Agent
 * 
 * Main App Component
 * Uses HashRouter for GitHub Pages compatibility (static hosting).
 * 
 * Routes:
 * - #/home (default) - ProductSearch page with AI recommendations
 * - #/scan - Camera scanner for product barcodes
 */
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Scanner } from './pages/Scanner';
import { ProductSearch } from './components/ProductSearch';

function App() {
  return (
    // HashRouter uses URL hash (#) - works with static hosting like GitHub Pages
    <Router>
      <Routes>
        {/* Camera scanner page */}
        <Route path="/scan" element={<Scanner />} />

        {/* Main search page with AI personalization */}
        <Route path="/home" element={<ProductSearch />} />

        {/* Default redirect to home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
