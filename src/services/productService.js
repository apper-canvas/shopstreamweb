/**
 * Product Service - Handles all operations related to products
 * Uses ApperClient to interact with the product1 table
 */

// Get all products with optional filtering and pagination
export const fetchProducts = async (filters = {}, page = 1, limit = 20) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'product1';
    
    // Build the query parameters
    const params = {
      fields: [
        'Name', 'description', 'price', 'inventory', 'category',
        'sku', 'featured', 'images', 'rating', 'reviews', 'Tags'
      ],
      pagingInfo: {
        offset: (page - 1) * limit,
        limit: limit
      }
    };

    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      const whereConditions = [];

      // Category filter
      if (filters.category) {
        whereConditions.push({
          fieldName: 'category',
          operator: 'ExactMatch',
          values: [filters.category]
        });
      }

      // Featured filter
      if (filters.featured !== undefined) {
        whereConditions.push({
          fieldName: 'featured',
          operator: 'ExactMatch',
          values: [filters.featured]
        });
      }

      // Search term for name or description
      if (filters.searchTerm) {
        params.whereGroups = [{
          operator: 'OR',
          subGroups: [
            {
              conditions: [{
                fieldName: 'Name',
                operator: 'Contains',
                values: [filters.searchTerm]
              }],
              operator: ''
            },
            {
              conditions: [{
                fieldName: 'description',
                operator: 'Contains',
                values: [filters.searchTerm]
              }],
              operator: ''
            }
          ]
        }];
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }
    }

    // Execute the query
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (response && response.data) {
      // Map the response data to a more convenient format for the UI
      return response.data.map(item => ({
        id: item.Id,
        name: item.Name,
        description: item.description,
        price: item.price,
        inventory: item.inventory,
        category: item.category,
        sku: item.sku,
        featured: item.featured,
        images: parseProductImages(item.images),
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        tags: item.Tags || []
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get a single product by ID
export const fetchProductById = async (productId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'product1';
    
    // Get record by ID
    const response = await apperClient.getRecordById(tableName, productId);
    
    if (response && response.data) {
      // Format the product data for the UI
      const product = response.data;
      return {
        id: product.Id,
        name: product.Name,
        description: product.description,
        price: product.price,
        inventory: product.inventory,
        category: product.category,
        sku: product.sku,
        featured: product.featured,
        images: parseProductImages(product.images),
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        tags: product.Tags || []
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Helper function to parse product images string into array of URLs
 * @param {string} imagesString - Comma-separated image URLs or JSON string
 * @returns {Array} - Array of image URLs
 */
const parseProductImages = (imagesString) => {
  if (!imagesString) return [];
  
  try {
    return imagesString.split(',').map(url => url.trim()).filter(url => url);
  } catch (error) {
    return [];
  }
};