import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

const ShoppingCartIcon = getIcon('ShoppingCart');
const XIcon = getIcon('X');

export default function CartPreview() {
  const { cartItems, getCartItemCount, getCartSubtotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartPreviewRef = useRef(null);
  
  const itemCount = getCartItemCount();
  const subtotal = getCartSubtotal();
  
  // Close the preview when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartPreviewRef.current && !cartPreviewRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={cartPreviewRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center text-surface-600 hover:text-primary dark:text-surface-400"
      >
        <ShoppingCartIcon size={24} />
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg dark:bg-surface-800"
          >
            <div className="mb-3 flex items-center justify-between border-b border-surface-200 pb-2 dark:border-surface-700">
              <h3 className="font-medium text-surface-800 dark:text-white">Cart ({itemCount})</h3>
              <button onClick={() => setIsOpen(false)} className="text-surface-500 hover:text-surface-700 dark:text-surface-400">
                <XIcon size={18} />
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="py-2 text-center text-sm text-surface-600 dark:text-surface-400">Your cart is empty</p>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.size || 'default'}`} className="flex items-center gap-3 py-2">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-surface-800 dark:text-white">{item.name}</p>
                        <p className="text-xs text-surface-600 dark:text-surface-400">
                          {item.quantity} × ${item.price.toFixed(2)}
                          {item.size && <span className="ml-1">({item.size})</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 border-t border-surface-200 pt-2 dark:border-surface-700">
                  <div className="mb-3 flex justify-between">
                    <span className="font-medium text-surface-800 dark:text-white">Subtotal:</span>
                    <span className="font-medium text-surface-800 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <Link 
                    to="/cart" 
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-lg bg-primary py-2 text-center font-medium text-white hover:bg-primary-dark"
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}