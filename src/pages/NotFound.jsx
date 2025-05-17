import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const AlertCircleIcon = getIcon('AlertCircle');

export default function NotFound() {
  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 rounded-full bg-surface-100 p-6 dark:bg-surface-800">
        <AlertCircleIcon className="h-16 w-16 text-secondary" />
      </div>
      
      <h1 className="mb-2 text-5xl font-bold text-surface-800 dark:text-white">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-surface-700 dark:text-surface-300">Page Not Found</h2>
      
      <p className="mb-8 max-w-md text-surface-600 dark:text-surface-400">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <Link 
        to="/" 
        className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary-dark"
      >
        <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
    </motion.div>
  );
}