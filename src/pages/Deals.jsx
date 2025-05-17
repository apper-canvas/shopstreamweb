import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Deals() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample deals data
  const deals = [
    { 
      id: 1, 
      name: 'Premium Headphones', 
      originalPrice: 299.99,
      discountedPrice: 199.99,
      image: 'https://burst.shopifycdn.com/photos/headphones-on-black-background.jpg',
      discountPercentage: 33,
      category: 'electronics',
      expiresIn: '2 days'
    },
    { 
      id: 2, 
      name: 'Designer Watch', 
      originalPrice: 249.99,
      discountedPrice: 179.99,
      image: 'https://burst.shopifycdn.com/photos/mens-watch.jpg',
      discountPercentage: 28,
      category: 'fashion',
      expiresIn: '5 days'
    },
    { 
      id: 3, 
      name: 'Kitchen Mixer', 
      originalPrice: 399.99,
      discountedPrice: 279.99,
      image: 'https://burst.shopifycdn.com/photos/kitchen-mixer.jpg',
      discountPercentage: 30,
      category: 'home',
      expiresIn: '7 days'
    },
    { 
      id: 4, 
      name: 'Sneakers', 
      originalPrice: 129.99,
      discountedPrice: 79.99,
      image: 'https://burst.shopifycdn.com/photos/blue-shoes.jpg',
      discountPercentage: 38,
      category: 'fashion',
      expiresIn: '3 days'
    },
    { 
      id: 5, 
      name: 'Fitness Tracker', 
      originalPrice: 149.99,
      discountedPrice: 99.99,
      image: 'https://burst.shopifycdn.com/photos/woman-checks-fitness-tracker.jpg',
      discountPercentage: 33,
      category: 'electronics',
      expiresIn: '4 days'
    },
    { 
      id: 6, 
      name: 'Coffee Machine', 
      originalPrice: 199.99,
      discountedPrice: 129.99,
      image: 'https://burst.shopifycdn.com/photos/coffee-maker-with-phone-app.jpg',
      discountPercentage: 35,
      category: 'home',
      expiresIn: '6 days'
    }
  ];
  
  const filteredDeals = activeTab === 'all' ? deals : deals.filter(deal => deal.category === activeTab);

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-surface-800 dark:text-white">Hot Deals & Offers</h1>
        
        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {['all', 'electronics', 'fashion', 'home'].map((tab) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface-200 text-surface-700 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Deals grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow-soft transition-all hover:shadow-md dark:bg-surface-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {/* Discount badge */}
              <div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">
                {deal.discountPercentage}% OFF
              </div>
              
              <Link to={`/product/${deal.id}`}>
                <div className="aspect-square w-full overflow-hidden">
                  <img src={deal.image} alt={deal.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold text-surface-800 dark:text-white">{deal.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary">${deal.discountedPrice.toFixed(2)}</span>
                    <span className="text-sm text-surface-500 line-through dark:text-surface-400">${deal.originalPrice.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">Expires in: {deal.expiresIn}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}