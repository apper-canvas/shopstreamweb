import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Add an item to the cart
  const addToCart = (product, quantity = 1, size = null) => {
    // Check if product has sizes and requires selection
    if (product.sizes && product.sizes.length > 0 && !size) {
      toast.warning("Please select a size first");
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
    
    toast.success(`Added ${product.name} to cart`);
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
    toast.info("Item removed from cart");
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
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
      toast.warning("Your cart is empty");
      return false;
    }
    
    toast.success("Proceeding to checkout!");
    return true;
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
    checkout
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
export default CartContext;