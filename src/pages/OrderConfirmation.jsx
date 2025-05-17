import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';
import { fetchOrderById } from '../services/orderService';

const CheckCircleIcon = getIcon('CheckCircle');
const ArrowRightIcon = getIcon('ArrowRight');
const HomeIcon = getIcon('Home');
const ShoppingBagIcon = getIcon('ShoppingBag');
const TruckIcon = getIcon('Truck');

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const cartCleared = useRef(false);
  
  useEffect(() => {
    // Define an async function to fetch order data
    const getOrderData = async () => {
      try {
        // First try to get order from API
        const fetchedOrder = await fetchOrderById(orderId);
        
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          // Only clear the cart once when we successfully find an order
          if (!cartCleared.current) {
            clearCart();
            cartCleared.current = true;
          }
        } else {
          // Fall back to localStorage if API fails
          const storedOrder = localStorage.getItem(`order_${orderId}`);
          if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
            // Only clear the cart once when we successfully find an order
            if (!cartCleared.current) {
              clearCart();
              cartCleared.current = true;
            }
          } else {
            // If no order found, redirect to home
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    getOrderData();
  }, [orderId, navigate]); // Removed clearCart from dependencies
  
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
  // Add null check to avoid errors when formatting date
  const formatDate = (dateString) => {
    if (!dateString) return 'Processing';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Processing';
    }
  };
  
  const orderDate = formatDate(order.date);
  
  // Enhanced safe JSON parsing with type checking
  const safeParseJSON = (jsonString, defaultValue = {}) => {
    try {
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      } else if (jsonString && typeof jsonString === 'object') {
        return jsonString;
      } else {
        return defaultValue;
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  };
  // Ensure shipping info exists and has expected structure
  const shippingInfo = safeParseJSON(order.shippingInfo, {
    fullName: 'N/A',
    address: 'N/A',
    city: 'N/A',
    state: 'N/A',
    zipCode: 'N/A'
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
            {/* Order status */}
            <div className="mb-6 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900/30">
              <div className="flex items-center">
                <ShoppingBagIcon size={24} className="mr-2 text-yellow-500" />
                <div>
                  <h3 className="font-medium text-yellow-700 dark:text-yellow-400">Processing</h3>
                  <p className="text-surface-700 dark:text-surface-300">
                    Your order is being prepared. You will receive an email notification when it ships.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Track order button */}
            <div className="mb-4 flex justify-center">
              <Link to={`/track-order?orderId=${order.id}`} className="inline-flex items-center rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-primary-dark">
                <TruckIcon size={20} className="mr-2" />
                Track Your Order
              </Link>
            </div>
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
              <p className="text-surface-800 dark:text-white">{shippingInfo.fullName}</p>
              <p className="text-surface-800 dark:text-white">{shippingInfo.address}</p>
              <p className="text-surface-800 dark:text-white">
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
              </p>
            </div>
            
            <div className="border-t border-surface-200 pt-4 dark:border-surface-600">
              <p className="flex items-center justify-between text-lg font-bold">
                <span className="text-surface-800 dark:text-white">Total</span>
                <span className="text-primary">${(order.total || 0).toFixed(2)}</span>
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