import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Scanner } from './pages/Scanner';
import { ProductSearch } from './components/ProductSearch';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router basename="/spinning-curiosity">
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/scan" element={user ? <Scanner /> : <Navigate to="/login" />} />
        <Route
          path="/home"
          element={user ? <ProductSearch /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
