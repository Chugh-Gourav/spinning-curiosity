import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Scanner } from './pages/Scanner';
import { ProductSearch } from './components/ProductSearch';

function App() {
  return (
    <Router basename="/spinning-curiosity">
      <Routes>
        <Route path="/scan" element={<Scanner />} />
        <Route path="/home" element={<ProductSearch />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
