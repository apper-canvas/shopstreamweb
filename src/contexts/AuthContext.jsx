import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

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
      type: "Credit Card",
      cardNumber: "**** **** **** 4242",
      expiryDate: "12/25",
      isDefault: true
    }
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
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
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
        email
      };
      
      setCurrentUser(newUser);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info('You have been logged out');
  };

  const value = { currentUser, loading, login, register, logout, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;