import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { fetchProducts } from '../services/productService';

const FilterIcon = getIcon('Filter');
const SearchIcon = getIcon('Search');
const GridIcon = getIcon('Grid');
const ListIcon = getIcon('List');

export default function Shop() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const categoryParam = searchParams.get('category');
  const [categoryName, setCategoryName] = useState('');
  
  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts({}, 1, 20);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Category mapping from numeric ID to category name
  const categoryMapping = {
    "1": "Electronics",
    "2": "Fashion",
    "3": "Home & Garden",
    "4": "Beauty",
    "5": "Sports",
    "6": "Toys" 
  };

  // Get category name by ID
  const getCategoryNameById = (categoryId) => {
    return categoryMapping[categoryId] || null;
  };

  // Map Home's categories to product categories
  const mapToProductCategory = (categoryName) => {
    const categories = {
      "Electronics": "Electronics",
      "Fashion": "Fashion",
      "Home & Garden": "Home",
      "Beauty": "Beauty",
      "Sports": "Sports",
      "Toys": "Toys"
    };
    return categories[categoryName] || categoryName;
  };

  // Filter products based on category from URL parameter

  useEffect(() => {
    if (categoryParam) { 
      let mappedCategory = null;

      // Check if categoryParam is a numeric ID (from Home.jsx)
      if (!isNaN(categoryParam)) {
        // Get the category name from the ID
        mappedCategory = getCategoryNameById(categoryParam);
        
        if (mappedCategory) {
          // Map the category name to match product categories
          const productCategory = mapToProductCategory(mappedCategory);
          setFilteredProducts(products.filter(product => product.category === productCategory));
          setCategoryName(mappedCategory);
        }
      } else {
        // Direct category name (from direct URL or Categories.jsx)
        setFilteredProducts(products.filter(product => product.category === categoryParam));
        setCategoryName(mappedCategory);
      }
    } else {
      setFilteredProducts(products);
    }
  }, [categoryParam, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-surface-800 dark:text-white">{categoryName || (categoryParam ? `Category ${categoryParam}` : 'Shop')}</h1>
        
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="ml-3 text-lg text-surface-600 dark:text-surface-400">Loading products...</p>
          </div>
        ) : (
          <>
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-surface-800 dark:text-white">{categoryName || (categoryParam ? `Category ${categoryParam}` : 'Shop')}</h1>
        
        {/* Search and filter controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex w-full flex-1 md:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-l-lg border border-surface-300 bg-surface-100 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-500 hover:text-primary dark:text-surface-400">
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
            <button type="button" onClick={toggleFilter} className="inline-flex h-10 items-center rounded-r-lg bg-primary px-4 text-white hover:bg-primary-dark">
              <FilterIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </form>
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`rounded p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300'}`}>
              <GridIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`rounded p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300'}`}>
              <ListIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Products grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group overflow-hidden rounded-lg bg-white shadow-soft transition-all hover:shadow-md dark:bg-surface-800">
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-square w-full overflow-hidden">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x400/111827/FFFFFF?text=No+Image'} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400/111827/FFFFFF?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-surface-500 dark:text-surface-400">{product.category}</p>
                    <h3 className="text-lg font-semibold text-surface-800 dark:text-white">{product.name}</h3>
                    <p className="mt-2 text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </>
              ) : (
                <div className="flex h-40">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/200x200/111827/FFFFFF?text=No+Image'} 
                    alt={product.name} 
                    className="h-full w-40 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200/111827/FFFFFF?text=No+Image';
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <p className="text-sm text-surface-500 dark:text-surface-400">{product.category}</p>
                      <h3 className="text-lg font-semibold text-surface-800 dark:text-white">{product.name}</h3>
                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-surface-600 dark:text-surface-400">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
         
        {filteredProducts.length === 0 && !loading && (
          <div className="mt-8 text-center">
            <p className="text-lg text-surface-600 dark:text-surface-400">
              No products found. Try adjusting your search criteria.
            </p>
          </div>
        )}
        </>
        )}
      </main>
    </div>
  );
}