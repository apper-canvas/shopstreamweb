import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import AccountSettings from './pages/Dashboard/AccountSettings';
import SavedAddresses from './pages/Dashboard/SavedAddresses';
import SavedPayments from './pages/Dashboard/SavedPayments';
import OrderHistory from './pages/Dashboard/OrderHistory';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
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
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Shop, Categories, Deals, and About routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/about" element={<About />} />
        
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast notification container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </>
  );
}

// Wrap the App component with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;