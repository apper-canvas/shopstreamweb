import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const User = getIcon('User');
const Settings = getIcon('Settings');
const MapPin = getIcon('MapPin');
const CreditCard = getIcon('CreditCard');
const Package = getIcon('Package');
const LogOut = getIcon('LogOut');

export default function UserDropdown() {
  const menuItems = [
    { icon: User, text: "Dashboard", link: "/dashboard" },
    { icon: Settings, text: "Account Settings", link: "/dashboard/account" },
    { icon: MapPin, text: "Saved Addresses", link: "/dashboard/addresses" },
    { icon: CreditCard, text: "Payment Methods", link: "/dashboard/payments" },
    { icon: Package, text: "Order History", link: "/dashboard/orders" }
  ];

  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-surface-800 dark:ring-surface-700">
      <div className="border-b border-surface-200 px-4 py-3 dark:border-surface-700">
        <p className="text-sm font-medium text-surface-900 dark:text-white">Welcome!</p>
        <p className="truncate text-xs text-surface-500 dark:text-surface-400">user@example.com</p>
      </div>
      
      <div className="py-1">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.link} className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
            <item.icon className="mr-3 h-4 w-4" />
            {item.text}
          </Link>
        ))}
        <button className="flex w-full items-center px-4 py-2 text-sm text-secondary hover:bg-surface-100 dark:hover:bg-surface-700">
          <LogOut className="mr-3 h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}