import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Storefront from './pages/Storefront';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import ArtworkDetails from './pages/ArtworkDetails';
import Wishlist from './pages/Wishlist';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Storefront />} />
        <Route path="/artwork/:id" element={<ArtworkDetails />} />
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/my-orders" element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        } />
        <Route path="/wishlist" element={
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AnimatePresence>
  );
}

import { CartProvider } from './contexts/CartContext';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <CartDrawer />
            <div className="min-h-screen flex flex-col font-sans relative">
              <Navbar />
              <main className="flex-grow z-10 pt-20">
                <AnimatedRoutes />
              </main>
              <footer className="bg-primary-900 text-white/80 py-8 text-center">
                <p className="text-sm">© {new Date().getFullYear()} Rangitva. All rights reserved.</p>
                <p className="text-xs mt-2 text-white/50">Handmade Art • Graphic Design • Animation • Craft</p>
              </footer>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
