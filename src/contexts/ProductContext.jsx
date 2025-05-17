import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Sample initial product data
const initialProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 40 hours of battery life',
    price: 199.99,
    inventory: 45,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'],
    featured: true,
    rating: 4.8,
    reviews: 124,
    sku: 'WH-NC1000',
    createdAt: '2023-08-12T15:30:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Water-resistant smartwatch with heart rate monitoring and sleep tracking',
    price: 249.99,
    inventory: 28,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80'],
    featured: false,
    rating: 4.5,
    reviews: 89,
    sku: 'SW-HR200',
    createdAt: '2023-07-25T10:15:00Z',
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity and built-in grinder',
    price: 129.99,
    inventory: 15,
    category: 'Home & Kitchen',
    images: ['https://images.unsplash.com/photo-1544098281-33b3f957a128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
    featured: true,
    rating: 4.2,
    reviews: 67,
    sku: 'CM-PRO12',
    createdAt: '2023-08-05T09:20:00Z',
  },
  {
    id: '4',
    name: 'Ergonomic Desk Chair',
    description: 'Adjustable office chair with lumbar support and breathable mesh back',
    price: 199.99,
    inventory: 8,
    category: 'Furniture',
    images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'],
    featured: false,
    rating: 4.6,
    reviews: 42,
    sku: 'DC-ERG100',
    createdAt: '2023-06-18T14:45:00Z',
  },
  {
    id: '5',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof Bluetooth speaker with 24-hour battery life and deep bass',
    price: 79.99,
    inventory: 32,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1826&q=80'],
    featured: true,
    rating: 4.4,
    reviews: 105,
    sku: 'BS-PORT500',
    createdAt: '2023-07-30T11:10:00Z',
  }
];

// Create product context
const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    // Check local storage for saved products
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save products to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Get all products
  const getAllProducts = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      return products;
    }, 500);
  };

  // Get product by ID
  const getProductById = (id) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const product = products.find(p => p.id === id);
        setLoading(false);
        
        if (product) {
          resolve(product);
        } else {
          setError('Product not found');
          reject('Product not found');
        }
      }, 500);
    });
  };

  // Add new product
  const addProduct = (productData) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const newProduct = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          rating: 0,
          reviews: 0
        };
        
        setProducts(prev => [...prev, newProduct]);
        setLoading(false);
        toast.success('Product added successfully');
        resolve(newProduct);
      }, 800);
    });
  };

  // Update existing product
  const updateProduct = (id, productData) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        setProducts(prev => {
          const index = prev.findIndex(p => p.id === id);
          if (index !== -1) {
            const updatedProducts = [...prev];
            updatedProducts[index] = { ...prev[index], ...productData };
            setLoading(false);
            toast.success('Product updated successfully');
            resolve(updatedProducts[index]);
            return updatedProducts;
          } else {
            setError('Product not found');
            reject('Product not found');
            setLoading(false);
            return prev;
          }
        });
      }, 800);
    });
  };

  // Delete product
  const deleteProduct = (id) => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        setLoading(false);
        toast.success('Product deleted successfully');
        resolve(true);
      }, 600);
    });
  };

  const value = {
    products,
    loading,
    error,
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};