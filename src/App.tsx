import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingElements from './components/FloatingElements';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeManager from './components/ThemeManager';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const BestSellersPage = lazy(() => import('./pages/BestSellersPage'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const Configurator = lazy(() => import('./pages/Configurator'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

// Centralized Loader Component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
    <span className="text-primary font-bold animate-pulse">TECHMAROC</span>
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/best-sellers" element={<BestSellersPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/stores" element={<StoresPage />} />
                <Route path="/configurator" element={<Configurator />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />

                {/* Protected: Authenticated users only */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />

                {/* Protected: Admin only */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}
