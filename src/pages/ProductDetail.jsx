import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';
import { fetchProductById } from '../services/productService';

const ShoppingCartIcon = getIcon('ShoppingCart');
const HeartIcon = getIcon('Heart');
const ArrowLeftIcon = getIcon('ArrowLeft');
const StarIcon = getIcon('Star');
const ChevronLeftIcon = getIcon('ChevronLeft');
const ChevronRightIcon = getIcon('ChevronRight');

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Reset image index when loading a new product
        setActiveImageIndex(0);
        
        const productData = await fetchProductById(id);
        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (addToCart(product, quantity)) {
      toast.success("Added to cart successfully!");
    }
  };

  const handleAddToWishlist = () => {
    toast.info("Added to wishlist");
  };
  
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent">
        </div>
        <p className="ml-3 text-lg text-surface-600 dark:text-surface-400">Loading product...</p>
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
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-surface-600 hover:text-primary dark:text-surface-400">
          <ArrowLeftIcon size={20} />
          Back to Shop
        </Link>

        <div className="mb-16 overflow-hidden rounded-2xl bg-white shadow-md dark:bg-surface-800">
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="flex flex-col">
              {/* Main product image */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-100 dark:bg-surface-700">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[activeImageIndex]} 
                    alt={`${product.name} - Image ${activeImageIndex + 1}`} 
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/111827/FFFFFF?text=No+Image';
                    }}
                  />
                ) : (
                  <img 
                    src="https://placehold.co/600x400/111827/FFFFFF?text=No+Image" 
                    alt={product.name} 
                    className="h-full w-full object-contain"
                  />
                )}
                
                {/* Image navigation controls */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-surface-800 shadow-md hover:bg-white dark:bg-surface-800/80 dark:text-white dark:hover:bg-surface-700"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon size={20} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-surface-800 shadow-md hover:bg-white dark:bg-surface-800/80 dark:text-white dark:hover:bg-surface-700"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {product.images && product.images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${activeImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/100x100/111827/FFFFFF?text=Error';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <h1 className="mb-2 text-3xl font-bold text-surface-800 dark:text-white">{product.name}</h1>
              
              <div className="mb-4 flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-surface-600 dark:text-surface-400">{product.rating} ({product.reviews || 0} reviews)</span>
              </div>
              
              <p className="mb-6 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-surface-800 dark:text-white">Description</h3>
                <p className="text-surface-600 dark:text-surface-400">{product.description}</p>
              </div>
              
              {product.inventory !== undefined && (
                <div className="mb-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    product.inventory > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    product.inventory > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {product.inventory > 10 ? 'In Stock' : 
                     product.inventory > 0 ? `Only ${product.inventory} left` : 
                     'Out of Stock'}
                  </span>
                </div>
              )}
              
              {product.sku && (
                <div className="mb-4 text-sm text-surface-500 dark:text-surface-400">
                  SKU: {product.sku}
                </div>
              )}
              
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