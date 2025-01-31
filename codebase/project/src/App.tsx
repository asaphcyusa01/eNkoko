import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ELearning from './pages/ELearning';
import CourseDetail from './pages/CourseDetail';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Hatchery from './pages/Hatchery';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminCourses from './pages/Admin/Courses';
import AdminOrders from './pages/Admin/Orders';
import AdminProducts from './pages/Admin/Products';
import AdminBreeds from './pages/Admin/Breeds';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/elearning" element={<ELearning />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/hatchery" element={<Hatchery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/breeds" element={<AdminRoute><AdminBreeds /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}