import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import About from './pages/About';
import OrderTracking from './pages/OrderTracking';
import OrderDetails from './pages/OrderDetails';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import AccountSettings from './pages/Dashboard/AccountSettings';
import SavedAddresses from './pages/Dashboard/SavedAddresses';
import SavedPayments from './pages/Dashboard/SavedPayments';
import OrderHistory from './pages/Dashboard/OrderHistory';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Get icon components
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');

// Protected route component to handle authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Main layout component with sticky header and footer
const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <header className="header-sticky bg-white shadow-md dark:bg-surface-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-xl font-bold text-primary">ShopStream</a>
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-primary">Home</a></li>
                  <li><a href="/shop" className="hover:text-primary">Shop</a></li>
                  <li><a href="/categories" className="hover:text-primary">Categories</a></li>
                  <li><a href="/deals" className="hover:text-primary">Deals</a></li>
                  <li><a href="/about" className="hover:text-primary">About</a></li>
                  <li><a href="/track-order" className="hover:text-primary">Track Order</a></li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="hover:text-primary">Cart</a>
              <a href="/login" className="hover:text-primary">Login</a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">{children}</main>
      
      {/* Sticky Footer */}
      <footer className="footer-sticky bg-surface-800 py-6 text-white dark:bg-surface-900">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} ShopStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <>
      {/* Theme toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed right-4 top-4 z-50 rounded-full bg-surface-200 p-2 text-surface-800 shadow-md transition-all hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-100 dark:hover:bg-surface-600"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      {/* Application routes */}
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Shop, Categories, Deals, and About routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/about" element={<About />} />
          
          {/* Cart route */}
          <Route path="/cart" element={<Cart />} />

          {/* Checkout routes */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

          {/* Order tracking routes */}
          <Route path="/track-order" element={<OrderTracking />} />
          
          {/* Product detail route */}
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="addresses" element={<SavedAddresses />} />
            <Route path="payments" element={<SavedPayments />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>

    </>
  );
}

// Wrap the App component with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
}

export default AppWithAuth;