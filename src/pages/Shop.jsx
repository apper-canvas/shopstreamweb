import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const FilterIcon = getIcon('Filter');
const SearchIcon = getIcon('Search');
const GridIcon = getIcon('Grid');
const ListIcon = getIcon('List');

export default function Shop() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Sample product data
  const products = [
    { 
      id: 1, 
      name: 'Wireless Earbuds', 
      price: 79.99, 
      image: 'https://burst.shopifycdn.com/photos/wireless-earbuds-in-charger.jpg',
      category: 'Electronics'
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 149.99, 
      image: 'https://burst.shopifycdn.com/photos/wrist-watch.jpg',
      category: 'Electronics'
    },
    { 
      id: 3, 
      name: 'Leather Backpack', 
      price: 89.99, 
      image: 'https://burst.shopifycdn.com/photos/leather-bag-gray.jpg',
      category: 'Fashion'
    },
    { 
      id: 4, 
      name: 'Desk Lamp', 
      price: 49.99, 
      image: 'https://burst.shopifycdn.com/photos/modern-lamp.jpg',
      category: 'Home'
    },
    { 
      id: 5, 
      name: 'Coffee Maker', 
      price: 119.99, 
      image: 'https://burst.shopifycdn.com/photos/a-cup-of-coffee-on-wood.jpg',
      category: 'Home'
    },
    { 
      id: 6, 
      name: 'Running Shoes', 
      price: 129.99, 
      image: 'https://burst.shopifycdn.com/photos/running-shoes.jpg',
      category: 'Sports'
    },
    { 
      id: 7, 
      name: 'Bluetooth Speaker', 
      price: 89.99, 
      image: 'https://burst.shopifycdn.com/photos/bluetooth-speaker.jpg',
      category: 'Electronics'
    },
    { 
      id: 8, 
      name: 'Yoga Mat', 
      price: 42.99, 
      image: 'https://burst.shopifycdn.com/photos/work-at-home-yoga.jpg',
      category: 'Sports'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-surface-800 dark:text-white">Shop</h1>
        
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
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group overflow-hidden rounded-lg bg-white shadow-soft transition-all hover:shadow-md dark:bg-surface-800">
              <div className={`${viewMode === 'grid' ? 'aspect-square w-full' : 'flex h-40'}`}>
                <img src={product.image} alt={product.name} className={`h-full w-full object-cover transition-transform duration-300 ${viewMode === 'grid' ? 'group-hover:scale-105' : 'w-40'}`} />
                <div className={`flex flex-col justify-between p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{product.category}</p>
                    <h3 className="text-lg font-semibold text-surface-800 dark:text-white">{product.name}</h3>
                  </div>
                  <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}