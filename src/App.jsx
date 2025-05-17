import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import AccountSettings from './pages/Dashboard/AccountSettings';
import SavedAddresses from './pages/Dashboard/SavedAddresses';
import SavedPayments from './pages/Dashboard/SavedPayments';
import OrderHistory from './pages/Dashboard/OrderHistory';
import UserDropdown from './components/UserDropdown';

// Get icon components
const MoonIcon = getIcon('Moon');
const SunIcon = getIcon('Sun');

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
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="addresses" element={<SavedAddresses />} />
          <Route path="payments" element={<SavedPayments />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
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

export default App;