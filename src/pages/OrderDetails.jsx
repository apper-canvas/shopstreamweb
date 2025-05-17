import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// Icons
const ArrowLeftIcon = getIcon('ArrowLeft');
const CheckCircleIcon = getIcon('CheckCircle');
const TruckIcon = getIcon('Truck');
const PackageIcon = getIcon('Package');
const CreditCardIcon = getIcon('CreditCard');
const CalendarIcon = getIcon('Calendar');
const MapPinIcon = getIcon('MapPin');

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getOrderStatus } = useCart();
  const { currentUser } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!orderId) {
      navigate('/dashboard/orders');
      return;
    }
    
    const fetchOrder = async () => {
      setLoading(true);
      
      // Get order and update status
      const foundOrder = getOrderById(orderId);
      
      if (foundOrder) {
        // Update status based on date
        getOrderStatus(orderId);
        
        // Refetch updated order
        const updatedOrder = getOrderById(orderId);
        setOrder(updatedOrder);
        
        // Verify user email matches order email for security
        if (currentUser && 
            currentUser.email.toLowerCase() !== updatedOrder.shippingInfo.email.toLowerCase()) {
          toast.error("You don't have permission to view this order");
          navigate('/dashboard/orders');
        }
      } else {
        toast.error('Order not found');
        navigate('/dashboard/orders');
      }
      
      setLoading(false);
    };
    
    fetchOrder();
  }, [orderId, navigate, getOrderById, getOrderStatus, currentUser]);
  
  // Helper function to format date
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
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/dashboard/orders" className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-dark">
          Back to Orders
        </Link>
      </div>
    );
  }
  
  const statusDetails = getStatusDetails(order.status);
  const StatusIcon = statusDetails.icon;

  return (
    <motion.div
      className="min-h-screen bg-surface-50 p-4 dark:bg-surface-900 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Link to="/dashboard/orders" className="flex items-center text-sm text-surface-600 hover:text-primary dark:text-surface-400">
            <ArrowLeftIcon size={16} className="mr-1" />
            Back to Orders
          </Link>
        </div>
        
        {/* Order header */}
        <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Order {order.id}</h1>
            <div className="mt-1 flex items-center text-sm text-surface-500 dark:text-surface-400">
              <CalendarIcon size={16} className="mr-1" />
              Placed on {formatDate(order.date)}
            </div>
          </div>
          <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusDetails.bg} ${statusDetails.color} sm:mt-0`}>
            <StatusIcon size={16} className="mr-1" />
            {statusDetails.label}
          </div>
        </div>
        
        {/* Order content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Order items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800">
              <h2 className="mb-4 text-lg font-medium text-surface-800 dark:text-white">
                Items ({order.items.reduce((total, item) => total + item.quantity, 0)})
              </h2>
              
              <div className="divide-y divide-surface-200 dark:divide-surface-700">
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex py-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-surface-200 dark:border-surface-700">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-surface-800 dark:text-white">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-surface-500 dark:text-surface-400">
                        {item.size && <span className="mr-3">Size: {item.size}</span>}
                        <span>Quantity: {item.quantity}</span>
                      </div>
                      <div className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order total */}
              <div className="mt-6 border-t border-surface-200 pt-4 dark:border-surface-700">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                  <span className="font-medium text-surface-800 dark:text-white">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">Tax</span>
                  <span className="font-medium text-surface-800 dark:text-white">${order.tax.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-surface-200 pt-2 dark:border-surface-700">
                  <span className="text-base font-medium text-surface-800 dark:text-white">Total</span>
                  <span className="text-base font-medium text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order info sidebar */}
          <div>
            <div className="space-y-6">
              {/* Status information */}
              <div className={`rounded-lg ${statusDetails.bg} p-4`}>
                <div className="flex items-start">
                  <StatusIcon size={20} className={`mr-2 mt-0.5 ${statusDetails.color}`} />
                  <div>
                    <h3 className={`font-medium ${statusDetails.color}`}>{statusDetails.label}</h3>
                    <p className="text-surface-700 dark:text-surface-300">{statusDetails.message}</p>
                    
                    {order.status === 'shipped' && order.trackingNumber && (
                      <div className="mt-2">
                        <p className="text-sm text-surface-700 dark:text-surface-300">
                          Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                        </p>
                        {order.estimatedDelivery && (
                          <p className="mt-1 text-sm text-surface-700 dark:text-surface-300">
                            Expected delivery: <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Shipping information */}
              <div className="rounded-lg bg-white p-4 shadow-soft dark:bg-surface-800">
                <div className="flex items-center">
                  <MapPinIcon size={20} className="mr-2 text-surface-500 dark:text-surface-400" />
                  <h3 className="font-medium text-surface-800 dark:text-white">Shipping Address</h3>
                </div>
                <div className="mt-3 text-sm text-surface-600 dark:text-surface-400">
                  <p className="font-medium text-surface-800 dark:text-white">{order.shippingInfo.fullName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                  <p>{order.shippingInfo.country}</p>
                  <p className="mt-2">{order.shippingInfo.email}</p>
                </div>
              </div>
              
              {/* Payment information */}
              <div className="rounded-lg bg-white p-4 shadow-soft dark:bg-surface-800">
                <div className="flex items-center">
                  <CreditCardIcon size={20} className="mr-2 text-surface-500 dark:text-surface-400" />
                  <h3 className="font-medium text-surface-800 dark:text-white">Payment Information</h3>
                </div>
                <div className="mt-3 text-sm text-surface-600 dark:text-surface-400">
                  <p>{order.paymentInfo.cardName}</p>
                  <p>Card ending in {order.paymentInfo.cardNumber.slice(-4)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}