import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext'; 
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Support from './pages/Support';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider> 
  );
}

export default App;