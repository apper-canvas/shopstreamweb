import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useCart } from '../contexts/CartContext';

// Get icon components
const ShoppingCartIcon = getIcon('ShoppingCart');
const StarIcon = getIcon('Star');
const FilterIcon = getIcon('SlidersHorizontal');
const SortIcon = getIcon('ArrowUpDown');
const ChevronDownIcon = getIcon('ChevronDown');
const XCircleIcon = getIcon('XCircle');
const HeartIcon = getIcon('Heart');
const StarFilledIcon = getIcon('Star');
const StarHalfIcon = getIcon('StarHalf');

// Initial product data
const initialProducts = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    salePrice: 249.99,
    image: "https://burst.shopifycdn.com/photos/premium-audio-setup.jpg",
    brand: "SoundMax",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    categories: ["Electronics", "Audio"],
    isFeatured: true,
    color: "Black",
    sizes: null
  },
  {
    id: 2,
    name: "Ultra HD Smart TV - 55 inch",
    price: 799.99,
    salePrice: null,
    image: "https://burst.shopifycdn.com/photos/living-room-tv-setup.jpg",
    brand: "TechVision",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    categories: ["Electronics", "TVs"],
    isFeatured: false,
    color: "Black",
    sizes: null
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 199.99,
    salePrice: 159.99,
    image: "https://burst.shopifycdn.com/photos/eames-style-dining-chair.jpg", 
    brand: "ComfortPlus",
    rating: 4.5,
    reviews: 56,
    inStock: true,
    categories: ["Furniture", "Office"],
    isFeatured: false,
    color: "Gray",
    sizes: null
  },
  {
    id: 4,
    name: "Premium Designer Sneakers",
    price: 129.99,
    salePrice: null,
    image: "https://burst.shopifycdn.com/photos/high-top-white-sneakers.jpg",
    brand: "UrbanKicks",
    rating: 4.2,
    reviews: 78,
    inStock: true,
    categories: ["Fashion", "Footwear"],
    isFeatured: true,
    color: "White",
    sizes: ["7", "8", "9", "10", "11"]
  },
  {
    id: 5,
    name: "Professional Digital Camera",
    price: 1299.99,
    salePrice: 1099.99,
    image: "https://burst.shopifycdn.com/photos/camera-flash-in-field.jpg",
    brand: "CapturePro",
    rating: 4.9,
    reviews: 43,
    inStock: true,
    categories: ["Electronics", "Photography"],
    isFeatured: true,
    color: "Black",
    sizes: null
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    price: 89.99,
    salePrice: null,
    image: "https://burst.shopifycdn.com/photos/leather-bag-on-table.jpg",
    brand: "LuxeStyle",
    rating: 4.7,
    reviews: 32,
    inStock: false,
    categories: ["Fashion", "Accessories"],
    isFeatured: false,
    color: "Brown",
    sizes: ["S", "M"]
  },
  {
    id: 7,
    name: "Stainless Steel Cooking Set",
    price: 249.99,
    salePrice: 199.99,
    image: "https://burst.shopifycdn.com/photos/pots-and-pans.jpg",
    brand: "ChefElite",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    categories: ["Home", "Kitchen"],
    isFeatured: false,
    color: "Silver",
    sizes: null
  },
  {
    id: 8,
    name: "Fitness Smartwatch",
    price: 179.99,
    salePrice: 149.99,
    image: "https://burst.shopifycdn.com/photos/fitness-watch.jpg",
    brand: "ActiveLife",
    rating: 4.6,
    reviews: 91,
    inStock: true,
    categories: ["Electronics", "Wearables"],
    isFeatured: true,
    color: "Black",
    sizes: null
  }
];

// Filter options
const filterOptions = {
  categories: ["All Categories", "Electronics", "Fashion", "Furniture", "Home"],
  brands: ["All Brands", "SoundMax", "TechVision", "ComfortPlus", "UrbanKicks", "CapturePro", "LuxeStyle", "ChefElite", "ActiveLife"],
  priceRanges: [
    { label: "All Prices", min: 0, max: 9999 },
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 - $250", min: 100, max: 250 },
    { label: "$250 - $500", min: 250, max: 500 },
    { label: "$500+", min: 500, max: 9999 }
  ]
};

export default function MainFeature() {
  const { addToCart, cartItems, getCartItemCount } = useCart();
  
  // State for filter controls
  const [filters, setFilters] = useState({
    category: "All Categories",
    brand: "All Brands",
    priceRange: filterOptions.priceRanges[0],
    showInStock: false,
    showSale: false
  });
  
  // State for showing filters on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // State to track screen width
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  // State for sort option
  const [sortOption, setSortOption] = useState("featured");
  
  // State for filtered and sorted products
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);
  
  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // State for selected product size (when applicable)
  const [selectedSizes, setSelectedSizes] = useState({});
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  
  // Handle size selection for a product
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };
  
  
  // Apply filters and sorting to products
  useEffect(() => {
    let result = [...initialProducts];
    
    // Apply category filter
    if (filters.category !== "All Categories") {
      result = result.filter(product => 
        product.categories.includes(filters.category)
      );
    }
    
    // Apply brand filter
    if (filters.brand !== "All Brands") {
      result = result.filter(product => 
        product.brand === filters.brand
      );
    }
    
    // Apply price range filter
    result = result.filter(product => {
      const price = product.salePrice || product.price;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    
    // Apply in-stock filter
    if (filters.showInStock) {
      result = result.filter(product => product.inStock);
    }
    
    // Apply sale filter
    if (filters.showSale) {
      result = result.filter(product => product.salePrice !== null);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "featured":
        result.sort((a, b) => (a.isFeatured ? -1 : 1) - (b.isFeatured ? -1 : 1));
        break;
      case "priceAsc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "priceDesc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "nameAsc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setDisplayedProducts(result);
  }, [filters, sortOption]);
  
  // Render star rating component
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarFilledIcon key={`full-${i}`} className="h-4 w-4 fill-current text-amber-400" />
        ))}
        
        {hasHalfStar && (
          <StarHalfIcon key="half" className="h-4 w-4 fill-current text-amber-400" />
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-4 w-4 text-amber-400" />
        ))}
        
        <span className="ml-1 text-xs text-surface-600 dark:text-surface-400">
          ({rating})
        </span>
      </div>
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "All Categories",
      brand: "All Brands",
      priceRange: filterOptions.priceRanges[0],
      showInStock: false,
      showSale: false
    });
    setSortOption("featured");
  };
  
  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-surface-800 dark:text-white md:text-3xl">Featured Products</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Discover our selection of top products
          </p>
        </div>
        
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {/* Mobile filter button */}
          <button 
            className="flex items-center gap-2 rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 shadow-sm hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600 md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>
          
          {/* Sort dropdown */}
          <div className="relative z-20 w-full md:w-auto">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-surface-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-surface-700 shadow-sm hover:bg-surface-50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500">
              <SortIcon className="h-4 w-4" />
            </div>
          </div>
          
          {/* Items in cart badge */}
          <div className="ml-auto rounded-lg bg-primary px-3 py-1 text-sm font-medium text-white md:ml-0">
            <span className="flex items-center gap-1">
              <ShoppingCartIcon className="h-4 w-4" />
              {getCartItemCount()} items
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Filters - desktop (always visible) and mobile (conditional) */}
        <AnimatePresence>
          {(showFilters || isDesktop) && (
            <motion.aside 
              className={`mb-6 w-full rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800 lg:mb-0 lg:w-64 lg:flex-shrink-0 ${!showFilters && 'hidden lg:block'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-white">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light"
                >
                  Clear All
                </button>
                
                {/* Close filters button (mobile only) */}
                <button 
                  className="rounded-full text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Category filter */}
              <div className="mb-5">
                <h4 className="mb-2 font-medium text-surface-800 dark:text-white">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300"
                >
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Brand filter */}
              <div className="mb-5">
                <h4 className="mb-2 font-medium text-surface-800 dark:text-white">Brand</h4>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300"
                >
                  {filterOptions.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              {/* Price range filter */}
              <div className="mb-5">
                <h4 className="mb-2 font-medium text-surface-800 dark:text-white">Price Range</h4>
                <select
                  value={filters.priceRange.label}
                  onChange={(e) => {
                    const selectedRange = filterOptions.priceRanges.find(
                      range => range.label === e.target.value
                    );
                    handleFilterChange('priceRange', selectedRange);
                  }}
                  className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300"
                >
                  {filterOptions.priceRanges.map(range => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Toggle filters */}
              <div className="space-y-3">
                {/* In stock toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.showInStock}
                    onChange={(e) => handleFilterChange('showInStock', e.target.checked)}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary dark:border-surface-600"
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                    In Stock Only
                  </label>
                </div>
                
                {/* Sale items toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onSale"
                    checked={filters.showSale}
                    onChange={(e) => handleFilterChange('showSale', e.target.checked)}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary dark:border-surface-600"
                  />
                  <label htmlFor="onSale" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                    On Sale
                  </label>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Product grid */}
        <div className="flex-1">
          {displayedProducts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl bg-white p-8 text-center dark:bg-surface-800">
              <p className="mb-4 text-lg font-medium text-surface-800 dark:text-white">No products match your filters</p>
              <button 
                onClick={clearFilters}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedProducts.map(product => (
                <motion.div 
                  key={product.id}
                  className="product-card flex flex-col overflow-hidden bg-white dark:bg-surface-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    {/* Product image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    
                    {/* Wishlist button */}
                    <button 
                      className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-surface-600 transition-colors hover:text-secondary dark:bg-surface-800 dark:text-surface-400"
                      onClick={() => toast.info("Added to wishlist")}
                    >
                      <HeartIcon className="h-4 w-4" />
                    </button>
                    
                    {/* Sale badge */}
                    {product.salePrice && (
                      <span className="absolute left-0 top-3 bg-secondary px-2 py-1 text-xs font-medium text-white">
                        SALE
                      </span>
                    )}
                    
                    {/* Stock badge */}
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-900/60">
                        <span className="rounded bg-surface-800/90 px-3 py-1 text-sm font-medium text-white">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col p-4">
                    {/* Product details */}
                    <div className="mb-1 text-xs text-surface-500 dark:text-surface-400">{product.brand}</div>
                    <h3 className="mb-1 text-sm font-medium text-surface-800 dark:text-white">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="mb-2">
                      {renderRating(product.rating)}
                    </div>
                    
                    {/* Size selector if applicable */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-3">
                        <div className="mb-1.5 text-xs text-surface-500 dark:text-surface-400">Size:</div>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map(size => (
                            <button
                              key={`${product.id}-${size}`}
                              className={`min-w-[32px] rounded-md px-2 py-1 text-xs ${
                                selectedSizes[product.id] === size
                                  ? 'bg-primary text-white'
                                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
                              }`}
                              onClick={() => handleSizeSelect(product.id, size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Price display */}
                    <div className="mt-auto flex items-baseline gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-semibold text-secondary dark:text-secondary-light">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          <span className="text-sm line-through text-surface-500 dark:text-surface-400">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-surface-800 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Add to cart button */}
                    <button
                      className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium ${
                        product.inStock
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'cursor-not-allowed bg-surface-300 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                      }`}
                      onClick={() => product.inStock && addToCart(product, 1, selectedSizes[product.id])}
                      disabled={!product.inStock}
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}