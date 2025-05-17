import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

const TrashIcon = getIcon('Trash2');
const ArrowLeftIcon = getIcon('ArrowLeft');
const ShoppingCartIcon = getIcon('ShoppingCart');
const PlusIcon = getIcon('Plus');
const MinusIcon = getIcon('Minus');

export default function Cart() {
  const { 
    cartItems, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    checkout
  } = useCart();
  
  const navigate = useNavigate();
  const [processingCheckout, setProcessingCheckout] = useState(false);
  
  // Handle the checkout process
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    const success = checkout();
    if (success) {
      navigate('/checkout');
    }
  };
  
  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();

  return (
    <motion.div 
      className="min-h-screen bg-surface-50 px-4 py-12 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-surface-600 hover:text-primary dark:text-surface-400">
          <ArrowLeftIcon size={20} />
          Back to Shopping
        </Link>
        
        <h1 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-soft dark:bg-surface-800">
            <ShoppingCartIcon size={64} className="mb-4 text-surface-400" />
            <h2 className="mb-2 text-xl font-semibold text-surface-800 dark:text-white">Your cart is empty</h2>
            <p className="mb-6 text-surface-600 dark:text-surface-400">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/shop" className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Cart items */}
            <div className="flex-1">
              <div className="rounded-lg bg-white shadow-soft dark:bg-surface-800">
                {/* Cart header */}
                <div className="border-b border-surface-200 p-4 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-surface-800 dark:text-white">
                      Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </h2>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your cart?")) {
                          clearCart();
                        }
                      }}
                      className="text-sm text-secondary hover:text-secondary-dark"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                
                {/* Cart items */}
                <div className="divide-y divide-surface-200 dark:divide-surface-700">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size || 'default'}`} className="flex p-4">
                      {/* Product image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      
                      {/* Product details */}
                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-surface-800 dark:text-white">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        {item.size && (
                          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">Size: {item.size}</p>
                        )}
                        
                        <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">${item.price.toFixed(2)} each</p>
                        
                        {/* Quantity controls and remove button */}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-surface-200 dark:border-surface-700">
                            <button 
                              onClick={() => updateCartItemQuantity(item.id, item.size, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                            >
                              <MinusIcon size={16} />
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center text-surface-800 dark:text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartItemQuantity(item.id, item.size, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
                            >
                              <PlusIcon size={16} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-sm text-secondary hover:text-secondary-dark"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="w-full lg:w-80">
              <div className="rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800">
                <h2 className="mb-4 text-lg font-semibold text-surface-800 dark:text-white">Order Summary</h2>
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-surface-600 dark:text-surface-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-600 dark:text-surface-400">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-surface-200 pt-2 dark:border-surface-700">
                    <div className="flex justify-between font-semibold text-surface-800 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={processingCheckout || cartItems.length === 0}
                  className={`w-full rounded-lg py-3 text-center font-medium text-white ${
                    processingCheckout || cartItems.length === 0
                      ? 'cursor-not-allowed bg-surface-400 dark:bg-surface-600'
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <div className="mt-4 text-center text-sm text-surface-600 dark:text-surface-400">
                  <p>or</p>
                  <Link to="/shop" className="mt-2 text-primary hover:text-primary-dark">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}