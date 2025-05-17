import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

const CheckCircleIcon = getIcon('CheckCircle');
const ArrowRightIcon = getIcon('ArrowRight');
const HomeIcon = getIcon('Home');
const ShoppingBagIcon = getIcon('ShoppingBag');

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Attempt to retrieve order details from localStorage
    const storedOrder = localStorage.getItem(`order_${orderId}`);
    
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    } else {
      // If no order found, redirect to home
      navigate('/');
    }
    
    setLoading(false);
    
    // Clear the cart since order is complete
    clearCart();
  }, [orderId, navigate, clearCart]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <p className="text-lg text-surface-800 dark:text-white">Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4 py-12 dark:bg-surface-900">
        <h1 className="mb-4 text-2xl font-bold text-surface-800 dark:text-white">Order Not Found</h1>
        <p className="mb-8 text-surface-600 dark:text-surface-400">We couldn't find the order you're looking for.</p>
        <Link to="/" className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark">
          Return to Home
        </Link>
      </div>
    );
  }
  
  // Format date
  const orderDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      className="min-h-screen bg-surface-50 px-4 py-12 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 text-center shadow-soft dark:bg-surface-800">
          <CheckCircleIcon size={64} className="mx-auto mb-6 text-green-500" />
          
          <h1 className="mb-2 text-3xl font-bold text-surface-800 dark:text-white">Thank You for Your Order!</h1>
          <p className="mb-6 text-lg text-surface-600 dark:text-surface-400">Your order has been received and is being processed.</p>
          
          <div className="mb-8 rounded-lg bg-surface-50 p-6 text-left dark:bg-surface-700">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Order Number</p>
                <p className="text-lg font-bold text-surface-800 dark:text-white">{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Date</p>
                <p className="text-lg font-bold text-surface-800 dark:text-white">{orderDate}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Shipping Address</p>
              <p className="text-surface-800 dark:text-white">{order.shippingInfo.fullName}</p>
              <p className="text-surface-800 dark:text-white">{order.shippingInfo.address}</p>
              <p className="text-surface-800 dark:text-white">
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
            </div>
            
            <div className="border-t border-surface-200 pt-4 dark:border-surface-600">
              <p className="flex items-center justify-between text-lg font-bold">
                <span className="text-surface-800 dark:text-white">Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-primary bg-white px-6 py-3 font-medium text-primary hover:bg-surface-50 dark:bg-surface-800 dark:hover:bg-surface-700">
              <HomeIcon size={20} className="mr-2" />
              Return to Home
            </Link>
            <Link to="/shop" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark">
              <ShoppingBagIcon size={20} className="mr-2" />
              Continue Shopping
              <ArrowRightIcon size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}