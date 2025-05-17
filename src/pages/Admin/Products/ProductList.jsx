import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../../../utils/iconUtils';
import { useProducts } from '../../../contexts/ProductContext';
import { toast } from 'react-toastify';

// Get icons
const Search = getIcon('Search');
const Plus = getIcon('Plus');
const Edit = getIcon('Edit');
const Trash = getIcon('Trash2');
const Eye = getIcon('Eye');
const ChevronUp = getIcon('ChevronUp');
const ChevronDown = getIcon('ChevronDown');
const Filter = getIcon('Filter');

export default function ProductList() {
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayProducts, setDisplayProducts] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Extract unique categories for filter dropdown
  const categories = products ? [...new Set(products.map(p => p.category))].sort() : [];

  // Filter and sort products
  useEffect(() => {
    if (!products) return;
    
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      // Handle string vs number comparisons
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setDisplayProducts(filtered);
  }, [products, searchTerm, sortField, sortDirection, categoryFilter]);

  // Handle column sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle delete confirmation
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      // Call the delete product method from context
      const result = await deleteProduct(productToDelete.id);
      
      if (result) {
        toast.success(`Product "${productToDelete.name}" has been deleted successfully`);
      } else {
        toast.error("Failed to delete product. Please try again.");
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Product Management</h1>
        <Link to="/admin/products/new" className="flex items-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary-dark shadow-md transition-all">
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-surface-400" />
          </div> 
          <input
            type="text"
            className="w-full rounded-lg border border-surface-200 bg-white py-2 pl-10 pr-4 text-surface-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-5 w-5 text-surface-400" />
            </div>
            <select
              className="rounded-lg border border-surface-200 bg-white py-2 pl-10 pr-8 text-surface-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead className="bg-surface-50 dark:bg-surface-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                <button className="flex items-center" onClick={() => handleSort('name')}>
                  Product
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                <button className="flex items-center" onClick={() => handleSort('category')}>
                  Category
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                <button className="flex items-center" onClick={() => handleSort('price')}>
                  Price
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400">
                <button className="flex items-center" onClick={() => handleSort('inventory')}>
                  Inventory
                  {sortField === 'inventory' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500 dark:text-surface-400 w-48">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-700 dark:bg-surface-800">
            {displayProducts.map((product) => (
              <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    {product.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="mr-3 h-10 w-10 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-surface-800 dark:text-white">{product.name}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">SKU: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-surface-800 dark:text-white">
                  {product.category}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-surface-800 dark:text-white">
                  ${product.price.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.inventory > 20 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : product.inventory > 5 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {product.inventory} in stock
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link 
                      to={`/product/${product.id}`} 
                      className="rounded p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-white"
                      title="View Product"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link 
                      to={`/admin/products/edit/${product.id}`} 
                      className="flex items-center rounded px-3 py-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4 mr-1" /> <span>Edit</span>
                    </Link>
                    <button 
                      onClick={() => confirmDelete(product)} 
                      className="flex items-center rounded px-3 py-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                      title="Delete Product"
                    >
                      <Trash className="h-4 w-4 mr-1" /> <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No products found */}
      {displayProducts.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center dark:bg-surface-800">
          <p className="text-surface-500 dark:text-surface-400">No products found matching your criteria.</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-surface-800">
            <h3 className="text-lg font-medium text-surface-800 dark:text-white">Confirm Delete</h3>
            <p className="mt-2 text-surface-600 dark:text-surface-300">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded bg-surface-200 px-4 py-2 text-surface-800 hover:bg-surface-300 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}