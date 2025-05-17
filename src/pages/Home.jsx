import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import CartPreview from '../components/CartPreview';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const userMenuRef = useRef(null);
  const { currentUser } = useAuth();
  const { getCartItemCount } = useCart();

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prev => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      {/* Cart Preview Component */}
      <CartPreview />

      <main>
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-br from-primary/90 to-primary-dark py-12 text-white md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <motion.h1 
                  className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  Shop The Future, <br className="hidden md:block" />
                  <span className="text-accent">Delivered Today</span>
                </motion.h1>
                <motion.p 
                  className="mb-6 text-lg text-blue-100 md:pr-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  Discover the latest trends and products with our curated collection. 
                  Quality items, competitive prices, and fast shipping.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Link to="/shop" className="btn-primary">Shop Now</Link>
                  <Link to="/deals" className="btn border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary">View Deals</Link>
                </motion.div>
              </div>
              <motion.div 
                className="relative md:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img 
                  src="https://burst.shopifycdn.com/photos/creative-desk-scene.jpg" 
                  alt="Featured Products" 
                  className="mx-auto rounded-xl shadow-xl md:max-w-md"
                />
                <div className="absolute -bottom-4 -right-2 rounded-lg bg-white p-3 shadow-lg dark:bg-surface-800 md:-right-4">
                  <p className="text-sm font-semibold text-primary">Limited Time Offer</p>
                  <p className="text-xs text-surface-600 dark:text-surface-400">Up to 40% off select items</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute bottom-0 left-0 h-20 w-full overflow-hidden">
            <svg className="absolute bottom-0 h-full w-full fill-surface-50 dark:fill-surface-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Category Tiles */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold text-surface-800 dark:text-white md:text-3xl">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {[
              { name: "Electronics", image: "https://burst.shopifycdn.com/photos/smartphone-beside-monstera-plant.jpg" },
              { name: "Fashion", image: "https://burst.shopifycdn.com/photos/dress-shoes-and-necklace.jpg" },
              { name: "Home & Garden", image: "https://burst.shopifycdn.com/photos/organized-tools-in-workspace.jpg" },
              { name: "Beauty", image: "https://burst.shopifycdn.com/photos/makeup-flatlay.jpg" },
              { name: "Sports", image: "https://burst.shopifycdn.com/photos/woman-tying-her-shoe.jpg" },
              { name: "Toys", image: "https://burst.shopifycdn.com/photos/kids-toys-on-wooden-shelf.jpg" }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                className="group relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Main Feature Component */}
        <section id="feature" className="bg-surface-100 py-12 dark:bg-surface-800 md:py-16">
          <div className="container mx-auto px-4">
            <MainFeature />
          </div>
        </section>
        
        {/* Features Summary */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                icon: "Truck", 
                title: "Fast Shipping", 
                description: "Free delivery on orders over $50. Standard shipping arrives in 3-5 business days." 
              },
              { 
                icon: "Shield", 
                title: "Secure Payments", 
                description: "Multiple payment options with industry-leading encryption for your security." 
              },
              { 
                icon: "RotateCcw", 
                title: "Easy Returns", 
                description: "Hassle-free 30-day return policy. Not satisfied? Get a full refund." 
              }
            ].map((feature, index) => {
              const FeatureIcon = getIcon(feature.icon);
              
              return (
                <motion.div 
                  key={feature.title}
                  className="flex flex-col items-center rounded-xl p-6 text-center transition-all hover:bg-white hover:shadow-soft dark:hover:bg-surface-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.4 }}
                >
                  <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary dark:bg-primary/20">
                    <FeatureIcon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-surface-800 dark:text-white">{feature.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-800 py-12 text-surface-300 dark:bg-surface-900">
        {/* Get ShoppingCartIcon for the footer */}
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <ShoppingCartIcon className="h-6 w-6" />
                <span>ShopStream</span>
              </div>
              <p className="mb-4 text-surface-400">
                Your premier destination for online shopping with the best deals and quality products.
              </p>
              <div className="flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "YouTube"].map(social => {
                  const SocialIcon = getIcon(social);
                  
                  return (
                    <a key={social} href="#" className="text-surface-400 hover:text-white">
                      <SocialIcon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {[
              {
                title: "Shop",
                links: ["All Products", "New Arrivals", "Best Sellers", "Deals & Promotions", "Gift Cards"]
              },
              {
                title: "Customer Service",
                links: ["Contact Us", "FAQs", "Shipping Policy", "Returns & Exchanges", "Track Order"]
              },
              {
                title: "About",
                links: ["Our Story", "Blog", "Careers", "Press", "Sustainability"]
              }
            ].map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-lg font-semibold text-white">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-surface-400 hover:text-white">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 border-t border-surface-700 pt-6 text-center text-sm text-surface-500">
            <p>© {new Date().getFullYear()} ShopStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}