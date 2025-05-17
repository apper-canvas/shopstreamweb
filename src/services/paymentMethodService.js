/**
 * Payment Method Service - Handles operations related to payment methods
 * Uses ApperClient to interact with the payment_method table
 */

// Fetch all payment methods for a specific user
export const fetchUserPaymentMethods = async (userId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'payment_method';
    
    // Query parameters to fetch payment methods for a specific user
    const params = {
      fields: [
        'Name', 'type', 'last4', 'expiryMonth', 
        'expiryYear', 'isDefault', 'userId'
      ],
      where: [{
        fieldName: 'userId',
        operator: 'ExactMatch',
        values: [userId]
      }]
    };

    // Execute the query
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (response && response.data) {
      // Map the response data to a more convenient format for the UI
      return response.data.map(pm => ({
        id: pm.Id,
        name: pm.Name,
        type: pm.type,
        last4: pm.last4,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear,
        isDefault: pm.isDefault,
        userId: pm.userId
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user payment methods:', error);
    throw error;
  }
};

// Create a new payment method
export const createPaymentMethod = async (paymentData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'payment_method';
    
    // Only include updateable fields
    const { id, ...updateableFields } = paymentData;
    
    // Create the payment method record
    const response = await apperClient.createRecord(tableName, { records: [updateableFields] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create payment method');
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

// Update an existing payment method
export const updatePaymentMethod = async (paymentMethodId, paymentData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'payment_method';
    
    // Only include updateable fields
    const { id, ...updateableFields } = paymentData;
    
    // Update the payment method record
    const response = await apperClient.updateRecord(tableName, { 
      records: [{
        Id: paymentMethodId,
        ...updateableFields
      }]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update payment method');
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'payment_method';
    
    // Delete the payment method record
    const response = await apperClient.deleteRecord(tableName, {
      RecordIds: [paymentMethodId]
    });
    
    return response && response.success;
    
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};