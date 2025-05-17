import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Categories() {
  // Sample categories
  const categories = [
    { 
      id: 1, 
      name: "Electronics", 
      image: "https://burst.shopifycdn.com/photos/smartphone-beside-monstera-plant.jpg",
      productCount: 156,
      description: "Latest gadgets and tech accessories"
    },
    { 
      id: 2, 
      name: "Fashion", 
      image: "https://burst.shopifycdn.com/photos/dress-shoes-and-necklace.jpg",
      productCount: 284,
      description: "Trending apparel and accessories"
    },
    { 
      id: 3, 
      name: "Home & Garden", 
      image: "https://burst.shopifycdn.com/photos/organized-tools-in-workspace.jpg",
      productCount: 192,
      description: "Furniture, decor, and gardening essentials"
    },
    { 
      id: 4, 
      name: "Beauty", 
      image: "https://burst.shopifycdn.com/photos/makeup-flatlay.jpg",
      productCount: 120,
      description: "Skincare, makeup, and beauty tools"
    },
    { 
      id: 5, 
      name: "Sports", 
      image: "https://burst.shopifycdn.com/photos/woman-tying-her-shoe.jpg",
      productCount: 94,
      description: "Athletic gear and fitness equipment"
    },
    { 
      id: 6, 
      name: "Toys", 
      image: "https://burst.shopifycdn.com/photos/kids-toys-on-wooden-shelf.jpg",
      productCount: 88,
      description: "Educational and fun toys for all ages"
    },
    { 
      id: 7, 
      name: "Books", 
      image: "https://burst.shopifycdn.com/photos/close-up-of-books-and-mug.jpg",
      productCount: 176,
      description: "Bestsellers, new releases, and classics"
    },
    { 
      id: 8, 
      name: "Automotive", 
      image: "https://burst.shopifycdn.com/photos/hands-free-phone-mount-for-car.jpg",
      productCount: 62,
      description: "Car accessories and maintenance products"
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-surface-800 dark:text-white">Categories</h1>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group overflow-hidden rounded-lg bg-white shadow-soft transition-all hover:shadow-md dark:bg-surface-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={`/shop?category=${category.id}`}>
                <div className="aspect-video w-full overflow-hidden">
                  <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-white">{category.name}</h3>
                  <p className="mb-2 text-sm text-surface-600 dark:text-surface-400">{category.description}</p>
                  <p className="text-xs font-medium text-primary">{category.productCount} Products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}