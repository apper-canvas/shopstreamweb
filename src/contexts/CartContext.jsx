import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [lastOrderId, setLastOrderId] = useState(null); 

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setLoading(false);
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, loading]);

  // Add an item to the cart
  const addToCart = (product, quantity = 1, size = null) => {
    // Check if product has sizes and requires selection
    if (product.sizes && product.sizes.length > 0 && !size) {
      return false;
    }
    
    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === product.id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if the item is already in the cart
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image,
        size,
        quantity
      }]);
    }
    
    return true;
  };

  // Update an item's quantity in the cart
  const updateCartItemQuantity = (id, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
  };

  // Remove an item from the cart
  const removeFromCart = (id, size = null) => {
    const updatedCart = cartItems.filter(item => 
      !(item.id === id && item.size === size)
    );
    
    setCartItems(updatedCart);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get subtotal price of all items in cart
  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  };

  // Calculate tax (for example, 8%)
  const getCartTax = () => {
    return getCartSubtotal() * 0.08;
  };

  // Calculate total price including tax
  const getCartTotal = () => {
    return getCartSubtotal() + getCartTax();
  };

  // Handle checkout process
  const checkout = () => {
    // In a real app, this would handle payment processing or redirect to checkout
    if (cartItems.length === 0) {
      return false;
    }

    // Checkout functionality without toast notification
    return true;
  };
  
  // Get order by ID
  const getOrderById = (orderId) => {
    // First try to get from orders array
    const order = orders.find(order => order.id === orderId);
    if (order) return order;
    
    // If not found, try to get from localStorage directly
    const storedOrder = localStorage.getItem(`order_${orderId}`);
    if (storedOrder) {
      return JSON.parse(storedOrder);
    }
    
    return null;
  };
  
  // Get all orders for the current user
  const getUserOrders = (email) => {
    if (!email) return [];
    
    return orders.filter(order => 
      order.shippingInfo.email.toLowerCase() === email.toLowerCase()
    );
  };
  
  // Track order status
  const getOrderStatus = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return null;
    
    // If order has status already, return it
    if (order.status) return order.status;
    
    // Determine status based on order date for demo purposes
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    
    let status = 'processing';
    let trackingNumber = null;
    let estimatedDelivery = null;
    
    if (daysSinceOrder >= 1) {
      status = 'shipped';
      trackingNumber = `TRK-${orderId.substring(4, 10)}`;
      
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      estimatedDelivery = deliveryDate.toISOString();
    }
    
    if (daysSinceOrder >= 5) {
      status = 'delivered';
    }
    
    // Update order with status info
    const updatedOrder = {
      ...order,
      status,
      trackingNumber,
      estimatedDelivery
    };
    
    // Save updated order
    localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));
    
    // Update orders array
    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
    
    return status;
  };

  // Place order function
  const placeOrder = (shippingInfo, paymentInfo) => {
    if (cartItems.length === 0) {
      // Cart is empty, cannot place order
      return { success: false };
    }

    try {
      // In a real app, this would send the order to a backend service
      // For now, we'll just generate a random order ID and clear the cart
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Create order object
      const order = {
        id: orderId,
        items: [...cartItems],
        shippingInfo,
        paymentInfo,
        subtotal: getCartSubtotal(),
        tax: getCartTax(),
        total: getCartTotal(),
        date: new Date().toISOString(),
        status: 'processing'
      };
      
      // Store order data in localStorage for demo purposes
      localStorage.setItem(`order_${orderId}`, JSON.stringify(order));
      
      // Add to orders array
      setOrders(prevOrders => [
        ...prevOrders,
        order
      ]);
      
      // Clear cart after successful order
      clearCart();
      setLastOrderId(orderId);
      return { success: true, orderId };
    } catch (error) {
      return { success: false, error };
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    checkout,
    placeOrder,
    lastOrderId,
    getOrderById,
    getUserOrders,
    getOrderStatus
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
export default CartContext;