import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';

const ShoppingCartIcon = getIcon('ShoppingCart');
const HeartIcon = getIcon('Heart');
const ArrowLeftIcon = getIcon('ArrowLeft');
const StarIcon = getIcon('Star');

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  { id: '1', name: 'Wireless Headphones', price: 129.99, rating: 4.5, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Headphones', description: 'Premium wireless headphones with noise cancellation and 20-hour battery life.', category: 'Electronics' },
  { id: '2', name: 'Running Shoes', price: 89.99, rating: 4.2, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Shoes', description: 'Lightweight running shoes with responsive cushioning and breathable mesh.', category: 'Sports' },
  { id: '3', name: 'Smart Watch', price: 199.99, rating: 4.7, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Watch', description: 'Feature-packed smartwatch with heart rate monitoring, GPS, and 5-day battery life.', category: 'Electronics' },
  { id: '4', name: 'Coffee Maker', price: 79.99, rating: 4.0, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Coffee+Maker', description: 'Programmable coffee maker with thermal carafe to keep your coffee hot for hours.', category: 'Kitchen' },
  { id: '5', name: 'Backpack', price: 49.99, rating: 4.3, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Backpack', description: 'Durable backpack with multiple compartments and padded laptop sleeve.', category: 'Fashion' },
  { id: '6', name: 'Yoga Mat', price: 29.99, rating: 4.1, image: 'https://placehold.co/600x400/111827/FFFFFF?text=Yoga+Mat', description: 'Non-slip yoga mat made from eco-friendly materials.', category: 'Sports' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Find related products in the same category
        const related = mockProducts
          .filter(p => p.category === foundProduct.category && p.id !== id)
          .slice(0, 3);
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to your cart!`);
  };

  const handleAddToWishlist = () => {
    toast.info(`${product.name} added to your wishlist!`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Product Not Found</h2>
        <Link to="/shop" className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary-dark">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-surface-50 px-4 py-12 dark:bg-surface-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-surface-600 hover:text-primary dark:text-surface-400">
          <ArrowLeftIcon size={20} />
          Back to Shop
        </Link>

        <div className="mb-16 overflow-hidden rounded-2xl bg-white shadow-md dark:bg-surface-800">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            
            <div className="flex flex-col">
              <h1 className="mb-2 text-3xl font-bold text-surface-800 dark:text-white">{product.name}</h1>
              
              <div className="mb-4 flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={20} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-surface-600 dark:text-surface-400">{product.rating} ({Math.floor(Math.random() * 500) + 50} reviews)</span>
              </div>
              
              <p className="mb-6 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              
              <p className="mb-8 text-surface-600 dark:text-surface-400">{product.description}</p>
              
              <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Quantity</label>
                <div className="flex h-10 w-32 items-center justify-between rounded-lg border border-surface-200 dark:border-surface-700">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="flex h-full w-10 items-center justify-center text-surface-600 hover:text-primary dark:text-surface-400"
                  >-</button>
                  <span className="text-surface-800 dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="flex h-full w-10 items-center justify-center text-surface-600 hover:text-primary dark:text-surface-400"
                  >+</button>
                </div>
              </div>
              
              <div className="mt-auto flex flex-wrap gap-4">
                <button onClick={handleAddToCart} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark">
                  <ShoppingCartIcon size={20} /> Add to Cart
                </button>
                <button onClick={handleAddToWishlist} className="flex items-center justify-center gap-2 rounded-lg border border-surface-200 px-6 py-3 font-medium text-surface-700 hover:bg-surface-100 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800">
                  <HeartIcon size={20} /> Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}