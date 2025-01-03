import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ELearning from './pages/ELearning';
import CourseDetail from './pages/CourseDetail';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Hatchery from './pages/Hatchery';
import Contact from './pages/Contact';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/elearning" element={<ELearning />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/hatchery" element={<Hatchery />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}