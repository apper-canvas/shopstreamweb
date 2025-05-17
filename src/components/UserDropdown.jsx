import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getIcon } from '../utils/iconUtils';

const User = getIcon('User');
const Settings = getIcon('Settings');
const MapPin = getIcon('MapPin');
const CreditCard = getIcon('CreditCard');
const Package = getIcon('Package');
const LogOut = getIcon('LogOut');

export default function UserDropdown() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Menu items with dashboard links
  const menuItems = [
    { icon: User, text: "Dashboard", link: "/dashboard" },
    { icon: Settings, text: "Account Settings", link: "/dashboard/account" },
    { icon: MapPin, text: "Saved Addresses", link: "/dashboard/addresses" },
    { icon: CreditCard, text: "Payment Methods", link: "/dashboard/payments" },
    { icon: Package, text: "Order History", link: "/dashboard/orders" }
  ];

  // Handle user logout
  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/login');
      });
  };

  return (
    <ul role="menu" className="absolute right-0 top-full z-50 mt-1 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-surface-800 dark:ring-surface-700">
      <li className="border-b border-surface-200 px-4 py-3 dark:border-surface-700">
        <p className="text-sm font-medium text-surface-900 dark:text-white">
          {currentUser ? `Hello, ${currentUser.name.split(' ')[0]}!` : 'Welcome!'}
        </p>
        <p className="truncate text-xs text-surface-500 dark:text-surface-400" title={currentUser?.email || 'user@example.com'}>
          {currentUser?.email || 'user@example.com'}
        </p>
      </li>
      
      <div className="py-1">
        {/* Menu items */}
        {menuItems.map((item, index) => (
          <li key={index} role="menuitem">
            <Link 
              to={item.link} 
              className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700"
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.text}
            </Link>
          </li>
        ))}
        <li role="menuitem">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }} 
            className="flex w-full items-center px-4 py-2 text-sm text-secondary hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Sign Out"
          >
            <LogOut className="mr-3 h-4 w-4" /> {currentUser ? "Sign Out" : "Sign In"}
          </a>
        </li>
      </div>
    </ul>
  );
}