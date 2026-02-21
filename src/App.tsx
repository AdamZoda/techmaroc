import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingElements from './components/FloatingElements';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BestSellersPage from './pages/BestSellersPage';
import PromotionsPage from './pages/PromotionsPage';
import PartnersPage from './pages/PartnersPage';
import StoresPage from './pages/StoresPage';
import Configurator from './pages/Configurator';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import ThemeManager from './components/ThemeManager';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ThemeManager />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <FloatingElements />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
    </UserProvider>
  );
}
