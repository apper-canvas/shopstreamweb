import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';
import { AuthContext } from '../App';

const UserIcon = getIcon('User');
const LogOutIcon = getIcon('LogOut');
const SettingsIcon = getIcon('Settings');
const ShoppingBagIcon = getIcon('ShoppingBag');
const ChevronDownIcon = getIcon('ChevronDown');

const UserDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-surface-800 hover:text-primary dark:text-white"
      >
        <span>{user?.firstName || user?.email}</span>
        <ChevronDownIcon size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-surface-800 dark:ring-surface-700">
          <div className="border-b border-surface-100 px-4 py-2 dark:border-surface-700">
            <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
            <p className="truncate text-xs text-surface-500 dark:text-surface-400">{user?.email}</p>
          </div>
          <Link to="/dashboard" className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
            <UserIcon size={16} className="mr-2" />
            Dashboard
          </Link>
          <Link to="/dashboard/account" className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
            <SettingsIcon size={16} className="mr-2" />
            Account Settings
          </Link>
          <Link to="/dashboard/orders" className="flex w-full items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700">
            <ShoppingBagIcon size={16} className="mr-2" />
            My Orders
          </Link>
          <button onClick={logout} className="flex w-full items-center px-4 py-2 text-sm text-secondary hover:bg-surface-100 dark:text-secondary-light dark:hover:bg-surface-700">
            <LogOutIcon size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;