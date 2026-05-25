import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ProductDetail from './pages/ProductDetail';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Articles from './pages/Articles';
import Products from './pages/Products';
import FloatingWidgets from './components/FloatingWidgets';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cua-hang" element={<Products />} />
            {/* Fallback wildcard to redirect users back to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
          <FloatingWidgets />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
