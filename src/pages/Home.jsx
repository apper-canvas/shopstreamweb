import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { fetchProducts } from '../services/productService';
import { toast } from 'react-toastify';

// Icons
const ArrowRightIcon = getIcon('ArrowRight');
const StarIcon = getIcon('Star');

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featured = await fetchProducts({ featured: true }, 1, 4);
        setFeaturedProducts(featured);
        
        // Fetch newest products
        const newest = await fetchProducts({}, 1, 8);
        setNewArrivals(newest);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(newest.map(product => product.category))];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (error) {
        console.error('Error loading home page data:', error);
        toast.error('Failed to load products. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        size={16}
        className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      />
    ));
  };

  // Product card component
  const ProductCard = ({ product }) => (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-surface-800">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.inventory < 10 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              Only {product.inventory} left
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 text-xs font-medium uppercase text-surface-500 dark:text-surface-400">
            {product.category}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-surface-800 dark:text-white">{product.name}</h3>
          <div className="mb-2 flex items-center">
            {renderStars(product.rating)}
            <span className="ml-1 text-xs text-surface-600 dark:text-surface-400">
              ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            <button className="rounded-full bg-surface-100 p-2 text-surface-800 transition-colors hover:bg-primary hover:text-white dark:bg-surface-700 dark:text-surface-200">
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-surface-600 dark:text-surface-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 dark:bg-surface-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-4xl font-bold leading-tight md:text-5xl"
            >
              Shop the Latest Products at Amazing Prices
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 text-lg"
            >
              Discover our curated collection of premium products. Free shipping on orders over $50.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0"
            >
              <Link to="/shop" className="rounded-lg bg-white px-8 py-3 font-medium text-primary shadow-lg hover:bg-surface-100">
                Shop Now
              </Link>
              <Link to="/deals" className="rounded-lg border border-white px-8 py-3 font-medium text-white hover:bg-white/10">
                View Deals
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-800 dark:text-white">Featured Products</h2>
            <Link to="/shop" className="flex items-center text-primary hover:text-primary-dark">
              View All <ArrowRightIcon size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}