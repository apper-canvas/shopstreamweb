/**
 * Order Service - Handles all operations related to orders
 * Uses ApperClient to interact with the order1 table
 */

// Get all orders for the current user
export const fetchUserOrders = async (userId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'order1';
    
    // Query parameters
    const params = {
      fields: [
        'Name', 'status', 'date', 'items', 'subtotal', 
        'tax', 'total', 'trackingNumber', 'estimatedDelivery',
        'shippingInfo', 'paymentInfo'
      ],
      // Filter by the user's ID to only get their orders
      where: [{
        fieldName: 'Owner',
        operator: 'ExactMatch',
        values: [userId]
      }],
      // Sort by date (newest first)
      orderBy: [{
        field: 'date',
        direction: 'DESC'
      }]
    };

    // Execute the query
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (response && response.data) {
      // Map the response data to a more convenient format for the UI
      return response.data.map(order => ({
        id: order.Id,
        orderNumber: order.Name,
        status: order.status,
        date: order.date,
        items: JSON.parse(order.items || '[]'),
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        shippingInfo: JSON.parse(order.shippingInfo || '{}'),
        paymentInfo: JSON.parse(order.paymentInfo || '{}')
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Get a single order by ID
export const fetchOrderById = async (orderId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'order1';
    
    // Get record by ID
    const response = await apperClient.getRecordById(tableName, orderId);
    
    if (response && response.data) {
      // Format the order data
      const order = response.data;
      return {
        id: order.Id,
        orderNumber: order.Name,
        status: order.status,
        date: order.date,
        items: JSON.parse(order.items || '[]'),
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        shippingInfo: JSON.parse(order.shippingInfo || '{}'),
        paymentInfo: JSON.parse(order.paymentInfo || '{}')
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'order1';
    
    // Create the new order record
    const response = await apperClient.createRecord(tableName, { records: [orderData] });
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};