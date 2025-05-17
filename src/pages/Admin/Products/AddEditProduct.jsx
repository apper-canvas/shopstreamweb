import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProducts } from '../../../contexts/ProductContext';
import { getIcon } from '../../../utils/iconUtils';
import { toast } from 'react-toastify';

// Get icons
const ArrowLeft = getIcon('ArrowLeft');
const ImageIcon = getIcon('Image');
const Save = getIcon('Save');
const X = getIcon('X');

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, getProductById, updateProduct } = useProducts();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: '',
    sku: '',
    featured: false,
    images: [''],
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(['']);

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const productData = await getProductById(id);
          
          // Format product data for form
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price?.toString() || '',
            inventory: productData.inventory?.toString() || '',
            category: productData.category || '',
            sku: productData.sku || '',
            featured: productData.featured || false,
            images: productData.images || [''],
          });
          
          setImagePreview(productData.images || ['']);
          setLoading(false);
        } catch (error) {
          toast.error('Failed to load product data');
          navigate('/admin/products');
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode, getProductById, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image URL changes
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
    
    // Try to preview the image
    validateImageUrl(value, index);
  };

  // Add a new image field
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
    setImagePreview(prev => [...prev, '']);
  };

  // Remove an image field
  const removeImageField = (index) => {
    if (formData.images.length <= 1) return;
    
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
    
    const newPreviews = [...imagePreview];
    newPreviews.splice(index, 1);
    setImagePreview(newPreviews);
  };

  // Validate image URL by trying to load it
  const validateImageUrl = (url, index) => {
    if (!url) {
      const newPreviews = [...imagePreview];
      newPreviews[index] = '';
      setImagePreview(newPreviews);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const newPreviews = [...imagePreview];
      newPreviews[index] = url;
      setImagePreview(newPreviews);
      
      // Clear any image error
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    };
    img.onerror = () => {
      const newPreviews = [...imagePreview];
      newPreviews[index] = '';
      setImagePreview(newPreviews);
    };
    img.src = url;
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    // Numeric validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.inventory) {
      newErrors.inventory = 'Inventory is required';
    } else if (isNaN(formData.inventory) || parseInt(formData.inventory) < 0) {
      newErrors.inventory = 'Inventory must be a non-negative number';
    }
    
    // At least one valid image
    if (!formData.images.some(img => img.trim())) {
      newErrors.images = 'At least one image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // Format data for submission
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      inventory: parseInt(formData.inventory),
      images: formData.images.filter(img => img.trim()) // Remove empty image URLs
    };
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        await updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update product' : 'Failed to add product');
      setLoading(false);
    }
  };
  
  // Common styles
  const labelStyle = "block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300";
  const inputStyle = "w-full px-3 py-2 border rounded-lg bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
  const errorStyle = "text-sm text-red-500 mt-1";
  
  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-surface-600 dark:text-surface-400">Loading product data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to="/admin/products" 
            className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>
      
      <div className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information Section */}
            <div className="md:col-span-2">
              <h2 className="mb-4 text-xl font-semibold text-surface-800 dark:text-white">Basic Information</h2>
            </div>
            
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className={labelStyle}>Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${inputStyle} ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && <p className={errorStyle}>{errors.name}</p>}
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className={labelStyle}>Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`${inputStyle} ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your product"
              ></textarea>
              {errors.description && <p className={errorStyle}>{errors.description}</p>}
            </div>
            
            {/* SKU */}
            <div>
              <label htmlFor="sku" className={labelStyle}>SKU *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`${inputStyle} ${errors.sku ? 'border-red-500' : ''}`}
                placeholder="Example: PRD-12345"
              />
              {errors.sku && <p className={errorStyle}>{errors.sku}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className={labelStyle}>Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputStyle} ${errors.category ? 'border-red-500' : ''}`}
                placeholder="Example: Electronics, Clothing, etc."
              />
              {errors.category && <p className={errorStyle}>{errors.category}</p>}
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className={labelStyle}>Price ($) *</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`${inputStyle} ${errors.price ? 'border-red-500' : ''}`}
                placeholder="99.99"
              />
              {errors.price && <p className={errorStyle}>{errors.price}</p>}
            </div>
            
            {/* Inventory */}
            <div>
              <label htmlFor="inventory" className={labelStyle}>Inventory *</label>
              <input
                type="text"
                id="inventory"
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                className={`${inputStyle} ${errors.inventory ? 'border-red-500' : ''}`}
                placeholder="10"
              />
              {errors.inventory && <p className={errorStyle}>{errors.inventory}</p>}
            </div>
            
            {/* Featured Product */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary dark:border-surface-600"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                  Feature this product on the homepage
                </label>
              </div>
            </div>
            
            {/* Images Section */}
            <div className="md:col-span-2 mt-6">
              <h2 className="mb-4 text-xl font-semibold text-surface-800 dark:text-white">Product Images</h2>
              <p className="mb-4 text-sm text-surface-600 dark:text-surface-400">Add image URLs. At least one image is required.</p>
              
              {errors.images && <p className={errorStyle}>{errors.images}</p>}
              
              {formData.images.map((url, index) => (
                <div key={index} className="mb-4 flex flex-col items-start gap-2 md:flex-row md:items-center">
                  <div className="relative w-full md:w-3/4">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      disabled={formData.images.length <= 1}
                      className="rounded border border-red-300 bg-white p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:bg-surface-700 dark:hover:bg-red-900/30"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800">
                      {imagePreview[index] ? (
                        <img src={imagePreview[index]} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-surface-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="mt-2 rounded-lg border border-dashed border-surface-300 bg-white px-4 py-2 text-sm text-surface-600 hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700"
              >
                Add Another Image
              </button>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/admin/products"
              className="rounded-lg bg-surface-200 px-5 py-2 text-sm font-medium text-surface-800 hover:bg-surface-300 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Update Product' : 'Save Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}