import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const User = getIcon('User');
const Settings = getIcon('Settings');
const MapPin = getIcon('MapPin');
const CreditCard = getIcon('CreditCard');
const Package = getIcon('Package');
const Home = getIcon('Home');
const ChevronLeft = getIcon('ChevronLeft');
const ChevronRight = getIcon('ChevronRight');
const Menu = getIcon('Menu');

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: User, name: 'Dashboard', path: '/dashboard' },
    { icon: Settings, name: 'Account Settings', path: '/dashboard/account' },
    { icon: MapPin, name: 'Saved Addresses', path: '/dashboard/addresses' },
    { icon: CreditCard, name: 'Payment Methods', path: '/dashboard/payments' },
    { icon: Package, name: 'Order History', path: '/dashboard/orders' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Dashboard header */}
      <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-700 dark:bg-surface-800/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-surface-800 dark:text-white">My Account</h1>
          </div>
          
          <NavLink to="/" className="flex items-center gap-1 text-primary">
            <Home className="h-4 w-4" />
            <span className="text-sm">Back to Shop</span>
          </NavLink>
        </div>
      </header>

      <div className="container mx-auto flex flex-col px-4 md:flex-row md:gap-8">
        {/* Sidebar for desktop */}
        <aside className={`sticky top-20 hidden h-[calc(100vh-5rem)] md:block ${sidebarOpen ? 'md:w-64' : 'md:w-20'}`}>
          <div className="h-full rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mb-6 ml-auto block rounded-full p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) => 
                    `flex items-center rounded-lg px-3 py-2.5 text-sm ${isActive 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700'}`
                  }
                >
                  <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && <span>{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="h-full w-64 bg-white p-4 shadow-xl dark:bg-surface-800"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
            >
              <div className="flex items-center justify-between border-b border-surface-200 pb-4 dark:border-surface-700">
                <h2 className="text-lg font-semibold text-surface-800 dark:text-white">Navigation</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="rounded-full p-1.5 text-surface-500 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center rounded-lg px-3 py-2.5 text-sm ${isActive 
                        ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700'}`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}

        {/* Main content */}
        <main className="my-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}