import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';
import { useSelector } from 'react-redux';

// Import icons
const ShoppingCartIcon = getIcon('ShoppingCart');
const XIcon = getIcon('X');
const ChevronRightIcon = getIcon('ChevronRight');

export default function CartPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const cartRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.user);
  
  // Total items in cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate cart total
  const total = getCartTotal();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  return (
    <div className="relative" ref={cartRef}>
      {/* Cart icon and count */}
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-1 focus:outline-none"
        aria-label="View cart"
      >
        <div className="relative">
          <ShoppingCartIcon size={24} />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </div>
      </button>
      
      {/* Dropdown cart preview */}
      {isOpen && (
        <div className="absolute right-0 top-10 z-10 w-80 rounded-lg bg-white shadow-lg dark:bg-surface-800">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-surface-800 dark:text-white">Your Cart ({itemCount})</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-700"
              >
                <XIcon size={16} />
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="py-6 text-center text-surface-600 dark:text-surface-400">
                <ShoppingCartIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="max-h-60 divide-y divide-surface-100 overflow-y-auto dark:divide-surface-700">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.size || 'default'}-${index}`} className="flex py-2">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-surface-800 dark:text-white">{item.name}</h4>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {item.size && `Size: ${item.size} | `}Qty: {item.quantity}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-semibold text-surface-800 dark:text-white">${item.price.toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Cart actions */}
                <div className="mt-4 border-t border-surface-100 pt-4 dark:border-surface-700">
                  <div className="mb-4 flex justify-between">
                    <span className="font-medium text-surface-800 dark:text-white">Total</span>
                    <span className="font-semibold text-primary">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/cart" 
                      onClick={() => setIsOpen(false)}
                      className="w-full rounded-lg bg-primary px-4 py-2 text-center font-medium text-white hover:bg-primary-dark"
                    >
                      View Cart
                    </Link>
                    <Link 
                      to={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"} 
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center rounded-lg border border-primary bg-white px-4 py-2 font-medium text-primary hover:bg-surface-50 dark:bg-surface-800 dark:hover:bg-surface-700"
                    >
                      Checkout <ChevronRightIcon size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}