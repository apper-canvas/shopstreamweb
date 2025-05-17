import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

const ArrowLeftIcon = getIcon('ArrowLeft');
const ArrowRightIcon = getIcon('ArrowRight');
const CheckIcon = getIcon('Check');
const CreditCardIcon = getIcon('CreditCard');
const TruckIcon = getIcon('Truck');
const ShoppingBagIcon = getIcon('ShoppingBag');

// Step definitions for checkout process
const steps = [
  { id: 'shipping', title: 'Shipping', icon: TruckIcon },
  { id: 'payment', title: 'Payment', icon: CreditCardIcon },
  { id: 'review', title: 'Review', icon: ShoppingBagIcon }
];

export default function Checkout() {
  const { 
    cartItems, 
    getCartSubtotal, 
    getCartTax, 
    getCartTotal,
    placeOrder
  } = useCart();
  
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  // State
  const [currentStep, setCurrentStep] = useState('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get user email from Redux state if available
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: user?.emailAddress || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  
  // Form validation
  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});
  
  // If cart is empty redirect to cart page
  // Also redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue with checkout.");
      navigate('/login?redirect=/checkout');
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Validate shipping form
  const validateShippingForm = () => {
    const errors = {};
    
    if (!shippingInfo.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!shippingInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!shippingInfo.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!shippingInfo.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!shippingInfo.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!shippingInfo.zipCode.trim()) {
      errors.zipCode = 'ZIP Code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingInfo.zipCode)) {
      errors.zipCode = 'ZIP Code is invalid';
    }
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate payment form
  const validatePaymentForm = () => {
    const errors = {};
    
    if (!paymentInfo.cardName.trim()) {
      errors.cardName = 'Name on card is required';
    }
    
    if (!paymentInfo.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentInfo.expiryMonth.trim()) {
      errors.expiryMonth = 'Month is required';
    } else if (!/^(0[1-9]|1[0-2])$/.test(paymentInfo.expiryMonth)) {
      errors.expiryMonth = 'Invalid month';
    }
    
    if (!paymentInfo.expiryYear.trim()) {
      errors.expiryYear = 'Year is required';
    } else if (!/^\d{4}$/.test(paymentInfo.expiryYear) || 
               parseInt(paymentInfo.expiryYear) < new Date().getFullYear()) {
      errors.expiryYear = 'Invalid year';
    }
    
    if (!paymentInfo.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 'shipping') {
      if (validateShippingForm()) {
        setCurrentStep('payment');
      } else {
        toast.error('Please fill in all required fields correctly');
      }
    } else if (currentStep === 'payment') {
      if (validatePaymentForm()) {
        setCurrentStep('review');
      } else {
        toast.error('Please fill in all payment details correctly');
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };
  
  // Handle input change for shipping form
  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };
  
  // Handle input change for payment form
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the order using the context method
      const { success, orderId, error } = placeOrder(shippingInfo, paymentInfo);
      
      if (success) {
        toast.success("Order placed successfully!");
        // Navigate to confirmation page
        navigate(`/order-confirmation/${orderId}`);
      } else {
        toast.error(error || "Failed to process your order. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };
  
  // Calculate order totals
  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();
  const shippingCost = 0; // Free shipping in this example
  
  // Render shipping form
  const renderShippingForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={shippingInfo.fullName}
          onChange={handleShippingInputChange}
          className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
            shippingErrors.fullName ? 'border-secondary' : ''
          }`}
        />
        {shippingErrors.fullName && (
          <p className="mt-1 text-sm text-secondary">{shippingErrors.fullName}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={shippingInfo.email}
          onChange={handleShippingInputChange}
          className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
            shippingErrors.email ? 'border-secondary' : ''
          }`}
        />
        {shippingErrors.email && (
          <p className="mt-1 text-sm text-secondary">{shippingErrors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Street Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={shippingInfo.address}
          onChange={handleShippingInputChange}
          className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
            shippingErrors.address ? 'border-secondary' : ''
          }`}
        />
        {shippingErrors.address && (
          <p className="mt-1 text-sm text-secondary">{shippingErrors.address}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={shippingInfo.city}
            onChange={handleShippingInputChange}
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              shippingErrors.city ? 'border-secondary' : ''
            }`}
          />
          {shippingErrors.city && (
            <p className="mt-1 text-sm text-secondary">{shippingErrors.city}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={shippingInfo.state}
            onChange={handleShippingInputChange}
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              shippingErrors.state ? 'border-secondary' : ''
            }`}
          />
          {shippingErrors.state && (
            <p className="mt-1 text-sm text-secondary">{shippingErrors.state}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={shippingInfo.zipCode}
            onChange={handleShippingInputChange}
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              shippingErrors.zipCode ? 'border-secondary' : ''
            }`}
          />
          {shippingErrors.zipCode && (
            <p className="mt-1 text-sm text-secondary">{shippingErrors.zipCode}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Country *
        </label>
        <select
          id="country"
          name="country"
          value={shippingInfo.country}
          onChange={handleShippingInputChange}
          className="mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm"
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
        </select>
      </div>
    </div>
  );
  
  // Render payment form
  const renderPaymentForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Name on Card *
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          value={paymentInfo.cardName}
          onChange={handlePaymentInputChange}
          className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
            paymentErrors.cardName ? 'border-secondary' : ''
          }`}
        />
        {paymentErrors.cardName && (
          <p className="mt-1 text-sm text-secondary">{paymentErrors.cardName}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          Card Number *
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handlePaymentInputChange}
          placeholder="XXXX XXXX XXXX XXXX"
          className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
            paymentErrors.cardNumber ? 'border-secondary' : ''
          }`}
        />
        {paymentErrors.cardNumber && (
          <p className="mt-1 text-sm text-secondary">{paymentErrors.cardNumber}</p>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="expiryMonth" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Month *
          </label>
          <input
            type="text"
            id="expiryMonth"
            name="expiryMonth"
            value={paymentInfo.expiryMonth}
            onChange={handlePaymentInputChange}
            placeholder="MM"
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              paymentErrors.expiryMonth ? 'border-secondary' : ''
            }`}
          />
          {paymentErrors.expiryMonth && (
            <p className="mt-1 text-sm text-secondary">{paymentErrors.expiryMonth}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="expiryYear" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Year *
          </label>
          <input
            type="text"
            id="expiryYear"
            name="expiryYear"
            value={paymentInfo.expiryYear}
            onChange={handlePaymentInputChange}
            placeholder="YYYY"
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              paymentErrors.expiryYear ? 'border-secondary' : ''
            }`}
          />
          {paymentErrors.expiryYear && (
            <p className="mt-1 text-sm text-secondary">{paymentErrors.expiryYear}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
            CVV *
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={paymentInfo.cvv}
            onChange={handlePaymentInputChange}
            placeholder="123"
            className={`mt-1 block w-full rounded-md border-surface-300 shadow-sm focus:border-primary focus:ring-primary dark:border-surface-600 dark:bg-surface-800 dark:text-white sm:text-sm ${
              paymentErrors.cvv ? 'border-secondary' : ''
            }`}
          />
          {paymentErrors.cvv && (
            <p className="mt-1 text-sm text-secondary">{paymentErrors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
  
  // Render order review
  const renderOrderReview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-surface-800 dark:text-white">Items ({cartItems.length})</h3>
        <div className="mt-4 divide-y divide-surface-200 dark:divide-surface-700">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size || 'default'}`} className="flex py-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-surface-800 dark:text-white">
                  <h4>{item.name}</h4>
                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                {item.size && (
                  <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">Size: {item.size}</p>
                )}
                <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-surface-200 dark:border-surface-700">
        <h3 className="mt-4 text-lg font-medium text-surface-800 dark:text-white">Shipping Address</h3>
        <div className="mt-2 text-surface-600 dark:text-surface-400">
          <p>{shippingInfo.fullName}</p>
          <p>{shippingInfo.address}</p>
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
          <p>{shippingInfo.country}</p>
          <p>{shippingInfo.email}</p>
        </div>
      </div>
      
      <div className="border-t border-surface-200 dark:border-surface-700">
        <h3 className="mt-4 text-lg font-medium text-surface-800 dark:text-white">Payment Method</h3>
        <div className="mt-2 flex items-center text-surface-600 dark:text-surface-400">
          <CreditCardIcon size={20} className="mr-2" />
          <p>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
        </div>
      </div>
    </div>
  );
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return renderShippingForm();
      case 'payment':
        return renderPaymentForm();
      case 'review':
        return renderOrderReview();
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-surface-50 px-4 py-12 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <Link to="/cart" className="mb-8 inline-flex items-center gap-2 text-surface-600 hover:text-primary dark:text-surface-400">
          <ArrowLeftIcon size={20} />
          Back to Cart
        </Link>
        
        <h1 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Checkout</h1>
        
        {/* Checkout steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  steps.findIndex(s => s.id === currentStep) >= index
                    ? 'bg-primary text-white'
                    : 'bg-surface-200 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
                }`}>
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <CheckIcon size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-surface-800 dark:text-white">{step.title}</p>
                
                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute left-0 top-5 h-0.5 w-full -z-10">
                    <div className={`h-0.5 ${
                      steps.findIndex(s => s.id === currentStep) > index
                        ? 'bg-primary'
                        : 'bg-surface-200 dark:bg-surface-700'
                    }`} style={{ width: '90%', marginLeft: '5%' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800">
              <h2 className="mb-6 text-xl font-semibold text-surface-800 dark:text-white">
                {steps.find(step => step.id === currentStep)?.title}
              </h2>
              
              {renderStepContent()}
              
              <div className="mt-8 flex justify-between">
                {currentStep !== 'shipping' && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
                  >
                    <ArrowLeftIcon size={16} className="mr-2" />
                    Back
                  </button>
                )}
                
                {currentStep !== 'review' ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                  >
                    Next
                    <ArrowRightIcon size={16} className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className={`ml-auto inline-flex items-center rounded-lg px-6 py-2 text-sm font-medium text-white ${
                      isProcessing
                        ? 'cursor-not-allowed bg-surface-400 dark:bg-surface-600'
                        : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                    {!isProcessing && <CheckIcon size={16} className="ml-2" />}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div>
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
                <div className="flex justify-between text-surface-600 dark:text-surface-400">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-surface-200 pt-2 dark:border-surface-700">
                  <div className="flex justify-between font-semibold text-surface-800 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-700">
                  <h3 className="text-sm font-medium text-surface-800 dark:text-white">Order Details</h3>
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                  <Link to="/cart" className="mt-2 block text-sm text-primary hover:text-primary-dark">
                    Edit Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}