import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Initial dummy user data
const DUMMY_USER = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 (555) 123-4567",
  addresses: [
    {
      id: "addr-1",
      type: "Home",
      street: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zipCode: "90210",
      country: "United States",
      isDefault: true
    }
  ],
  paymentMethods: [
    {
      id: "pay-1",
      name: "Personal Card",
      type: "Visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true
    },
    {
      id: "pay-2",
      name: "Business Card",
      type: "Mastercard",
      last4: "8888",
      expiryMonth: "06",
      expiryYear: "2024",
      isDefault: true
    }
  ],
  ]
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  const login = async (email, password, remember = false) => {
    try {
      // Simulating API request
      setLoading(true);
      
      // Simple validation (in a real app, this would be handled by the backend)
      if (email !== DUMMY_USER.email || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      // Login successful
      setCurrentUser(DUMMY_USER);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, isAdmin = false) => {
    try {
      // Simulating API request
      setLoading(true);
      
      // Simple validation
      if (email === DUMMY_USER.email) {
        throw new Error('Email already in use');
      }
      
      // Create a new user
      const newUser = {
        ...DUMMY_USER,
        name,
        email,
        isAdmin
      };
      
      setCurrentUser(newUser);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Payment Methods Management
  const addPaymentMethod = (newMethod) => {
    try {
      // Make sure user is logged in
      if (!currentUser) {
        throw new Error('You must be logged in to add a payment method');
      }
      
      // Make sure payment method has all required fields
      if (!newMethod.name || !newMethod.type || !newMethod.last4 || 
          !newMethod.expiryMonth || !newMethod.expiryYear) {
        throw new Error('Invalid payment method data');
      }
      
      // Create a copy of the user's payment methods or initialize if none exist
      const updatedPaymentMethods = [...(currentUser.paymentMethods || [])];
      
      // If this is set as default, update all others
      if (newMethod.isDefault) {
        updatedPaymentMethods.forEach(method => method.isDefault = false);
      }
      
      // Add the new method
      updatedPaymentMethods.push(newMethod);
      
      // Update user object
      setCurrentUser({
        ...currentUser,
        paymentMethods: updatedPaymentMethods
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const updatePaymentMethod = (updatedMethod) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update a payment method');
      }
      
      const updatedPaymentMethods = currentUser.paymentMethods.map(method => {
        if (method.id === updatedMethod.id) {
          // Keep existing fields that weren't updated
          return { ...method, ...updatedMethod };
        }
        
        // If updated method is set as default, make other methods not default
        if (updatedMethod.isDefault) {
          return { ...method, isDefault: false };
        }
        
        return method;
      });
      
      setCurrentUser({
        ...currentUser,
        paymentMethods: updatedPaymentMethods
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const deletePaymentMethod = (id) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete a payment method');
      }
      
      // Check if trying to delete default method when it's the only one
      const isDefault = currentUser.paymentMethods.find(m => m.id === id)?.isDefault;
      const remainingMethods = currentUser.paymentMethods.filter(m => m.id !== id);
      
      if (isDefault && remainingMethods.length > 0) {
        // If deleting default, make the first remaining method the default
        remainingMethods[0].isDefault = true;
      }
      
      setCurrentUser({
        ...currentUser,
        paymentMethods: remainingMethods
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const setDefaultPaymentMethod = (id) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update a payment method');
      }
      
      const updatedPaymentMethods = currentUser.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }));
      
      setCurrentUser({
        ...currentUser,
        paymentMethods: updatedPaymentMethods
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };

  // Address Management
  const addAddress = (newAddress) => {
    try {
      // Make sure user is logged in
      if (!currentUser) {
        throw new Error('You must be logged in to add an address');
      }
      
      // Make sure address has all required fields
      if (!newAddress.street || !newAddress.city || !newAddress.state || 
          !newAddress.zipCode || !newAddress.country) {
        throw new Error('Invalid address data');
      }
      
      // Create a copy of the user's addresses or initialize if none exist
      const updatedAddresses = [...(currentUser.addresses || [])];
      
      // If this is set as default, update all others
      if (newAddress.isDefault) {
        updatedAddresses.forEach(address => address.isDefault = false);
      }
      
      // Create a new address with ID
      const addressWithId = {
        ...newAddress,
        id: `addr-${Date.now()}`
      };
      
      // Add the new address
      updatedAddresses.push(addressWithId);
      
      // Update user object
      setCurrentUser({
        ...currentUser,
        addresses: updatedAddresses
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const updateAddress = (updatedAddress) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to update an address');
      }
      
      const updatedAddresses = currentUser.addresses.map(address => {
        if (address.id === updatedAddress.id) {
          return { ...updatedAddress };
        }
        
        // If updated address is set as default, make other addresses not default
        if (updatedAddress.isDefault) {
          return { ...address, isDefault: false };
        }
        
        return address;
      });
      
      setCurrentUser({
        ...currentUser,
        addresses: updatedAddresses
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const deleteAddress = (id) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to delete an address');
      }
      
      const updatedAddresses = currentUser.addresses.filter(address => address.id !== id);
      
      setCurrentUser({
        ...currentUser,
        addresses: updatedAddresses
      });
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const value = { 
    currentUser, 
    loading, 
    login, 
    register, 
    logout, 
    setCurrentUser,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;