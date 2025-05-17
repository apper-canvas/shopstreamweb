import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link, Outlet, useSearchParams } from 'react-router-dom';
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
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingInfo from './pages/ShippingInfo';
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
import Callback from './pages/Auth/Callback';
import ErrorPage from './pages/Auth/ErrorPage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import UserDropdown from './components/UserDropdown';

export const AuthContext = createContext(null);
// Admin imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductList from './pages/Admin/Products/ProductList';
// Import toast for notifications
import { ToastContainer, toast } from 'react-toastify';
import AddEditProduct from './pages/Admin/Products/AddEditProduct';
import 'react-toastify/dist/ReactToastify.css';

// Get icon components
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');
const FacebookIcon = getIcon('Facebook');
const TwitterIcon = getIcon('Twitter');
const InstagramIcon = getIcon('Instagram');

// Protected route component to handle authentication
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  
  if (user === undefined) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Admin route component to handle authentication for admin users
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  
  if (user === undefined) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // Check if user is logged in and has admin role
  if (!isAuthenticated || !user.isAdmin) {
    // Redirect to dashboard if user is logged in but not admin, or login if not logged in
    const redirectPath = currentUser ? '/dashboard' : '/login';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  return children;
};

// Main layout component with sticky header and footer
const MainLayout = () => {
  const [email, setEmail] = useState('');
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    toast.success("You've been subscribed to our newsletter!");
    setEmail('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sticky Header */}
      <header className="header-sticky bg-white shadow-md dark:bg-surface-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold text-primary">ShopStream</Link>
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
                  <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
                  <li><Link to="/deals" className="hover:text-primary">Deals</Link></li>
                  <li><Link to="/about" className="hover:text-primary">About</Link></li>
                  <li><Link to="/track-order" className="hover:text-primary">Track Order</Link></li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="hover:text-primary">Cart</Link>
              {isAuthenticated ? (
                <UserDropdown user={user} />
              ) : <Link to="/login" className="hover:text-primary">Login</Link>}            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">{children || <Outlet />}</main>
      
      {/* Sticky Footer */}
      <footer className="bg-surface-800 text-white dark:bg-surface-900">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="mb-4 text-lg font-bold">ShopStream</h3>
              <p className="mb-4 text-sm text-gray-300">
                Your premier destination for modern shopping experiences with quality products
                and exceptional service.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={20} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-gray-300 hover:text-white"
                  aria-label="Twitter"
                >
                  <TwitterIcon size={20} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-gray-300 hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              </div>
            </div>
            
            {/* Shop Links */}
            <div className="col-span-1">
              <h3 className="mb-4 text-lg font-bold">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="text-gray-300 hover:text-white">All Products</Link></li>
                <li><Link to="/categories" className="text-gray-300 hover:text-white">Categories</Link></li>
                <li><Link to="/deals" className="text-gray-300 hover:text-white">Deals & Offers</Link></li>
                <li><Link to="/track-order" className="text-gray-300 hover:text-white">Order Tracking</Link></li>
              </ul>
            </div>
            
            {/* Customer Support */}
            <div className="col-span-1">
              <h3 className="mb-4 text-lg font-bold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                <li><Link to="/shipping-info" className="text-gray-300 hover:text-white">Shipping Information</Link></li>
                <li><Link to="/return-policy" className="text-gray-300 hover:text-white">Returns & Refunds</Link></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div className="col-span-1">
              <h3 className="mb-4 text-lg font-bold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
              <p className="mb-4 text-sm text-gray-300">
                Subscribe to our newsletter for the latest products and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-primary" 
                />
                <button type="submit" className="rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-300">© {new Date().getFullYear()} ShopStream. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);

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

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        navigate('/error?message=' + encodeURIComponent(error.message || 'Authentication failed'));
      }
    });
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex h-screen items-center justify-center">Initializing application...</div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <button
        onClick={toggleDarkMode}
        className="fixed right-4 top-4 z-50 rounded-full bg-surface-200 p-2 text-surface-800 shadow-md transition-all hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-100 dark:hover:bg-surface-600"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="deals" element={<Deals />} />
          <Route path="about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="track-order" element={<OrderTracking />} />
          <Route path="product/:id" element={<ProductDetail />} />
          
          {/* Footer pages */}
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="careers" element={<Careers />} />
          <Route path="return-policy" element={<ReturnPolicy />} />
          <Route path="shipping-info" element={<ShippingInfo />} />
        </Route>

        {/* Auth routes without MainLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="addresses" element={<SavedAddresses />} />
          <Route path="payments" element={<SavedPayments />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

    </AuthContext.Provider>
  );
}


// Wrap the App component with AuthProvider
function AppWithAuth() {
  return (
    <App />
  );
}

export default AppWithAuth;