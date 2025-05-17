import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

// Icons
const SearchIcon = getIcon('Search');
const ArrowRightIcon = getIcon('ArrowRight');
const CheckCircleIcon = getIcon('CheckCircle');
const TruckIcon = getIcon('Truck');
const PackageIcon = getIcon('Package');
const ArrowLeftIcon = getIcon('ArrowLeft');
const HomeIcon = getIcon('Home');

export default function OrderTracking() {
  const navigate = useNavigate();
  const { getOrderById, getOrderStatus } = useCart();
  
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Track an order
  const handleTrackOrder = (e) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!orderId.trim()) {
      setError('Please enter an order number');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter the email address associated with the order');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Get order from context
    const foundOrder = getOrderById(orderId);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (!foundOrder) {
        setError('Order not found. Please check your order number and email.');
        return;
      }
      
      // Verify email matches
      if (foundOrder.shippingInfo.email.toLowerCase() !== email.toLowerCase()) {
        setError('The email address does not match the order. Please check your information.');
        return;
      }
      
      // Get updated status
      getOrderStatus(orderId);
      
      // Set order and clear form
      setOrder(foundOrder);
      toast.success('Order found!');
      
    }, 1000); // Simulate API delay
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status details
  const getStatusDetails = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircleIcon,
          label: 'Delivered',
          color: 'text-green-500',
          bg: 'bg-green-100 dark:bg-green-900/30',
          message: 'Your order has been delivered!'
        };
      case 'shipped':
        return {
          icon: TruckIcon,
          label: 'Shipped',
          color: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          message: 'Your order is on the way!'
        };
      case 'processing':
      default:
        return {
          icon: PackageIcon,
          label: 'Processing',
          color: 'text-yellow-500',
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          message: 'Your order is being processed.'
        };
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-surface-50 px-4 py-12 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center">
          <Link to="/" className="mr-4 flex items-center text-surface-600 hover:text-primary dark:text-surface-400">
            <ArrowLeftIcon size={18} className="mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-surface-800 dark:text-white">Track Your Order</h1>
        </div>
        
        <div className="rounded-lg bg-white shadow-soft dark:bg-surface-800">
          {/* Order Lookup Form */}
          {!order && (
            <div className="p-6">
              <p className="mb-6 text-surface-600 dark:text-surface-300">
                Enter your order number and email address to track your order status.
              </p>
              
              <form onSubmit={handleTrackOrder} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-secondary-light p-3 text-secondary">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., ORD-1234567890"
                    className="mt-1 block w-full rounded-md border border-surface-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="mt-1 block w-full rounded-md border border-surface-300 px-4 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-white ${
                      isLoading ? 'bg-surface-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {isLoading ? 'Searching...' : (
                      <>
                        <SearchIcon size={18} className="mr-2" />
                        Track Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Order Details */}
          {order && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-surface-800 dark:text-white">
                    Order {order.id}
                  </h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <button 
                  onClick={() => setOrder(null)}
                  className="rounded border border-surface-300 px-3 py-1 text-sm text-surface-600 hover:bg-surface-100 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-700"
                >
                  Look up another order
                </button>
              </div>
              
              {/* Order Status */}
              {order.status && (
                <div className="mb-6">
                  {(() => {
                    const status = getStatusDetails(order.status);
                    const StatusIcon = status.icon;
                    
                    return (
                      <div className={`rounded-lg ${status.bg} p-4`}>
                        <div className="flex items-center">
                          <StatusIcon size={24} className={`mr-2 ${status.color}`} />
                          <div>
                            <h3 className={`font-medium ${status.color}`}>{status.label}</h3>
                            <p className="text-surface-700 dark:text-surface-300">{status.message}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {/* Tracking Information */}
              {order.status === 'shipped' && order.trackingNumber && (
                <div className="mb-6 rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                  <h3 className="mb-2 font-medium text-surface-800 dark:text-white">Shipping Information</h3>
                  <p className="text-surface-600 dark:text-surface-400">
                    Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-surface-600 dark:text-surface-400">
                      Estimated Delivery: <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                    </p>
                  )}
                </div>
              )}
              
              {/* Order Summary */}
              <div className="mb-6 rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                <h3 className="mb-3 font-medium text-surface-800 dark:text-white">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Items ({order.items.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span className="font-medium text-surface-800 dark:text-white">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Tax</span>
                    <span className="font-medium text-surface-800 dark:text-white">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-200 pt-2 dark:border-surface-700">
                    <span className="font-medium text-surface-800 dark:text-white">Total</span>
                    <span className="font-medium text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="inline-flex items-center rounded-md border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600">
                  <HomeIcon size={18} className="mr-2" />
                  Return to Home
                </Link>
                <Link to="/shop" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
                  Continue Shopping
                  <ArrowRightIcon size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}