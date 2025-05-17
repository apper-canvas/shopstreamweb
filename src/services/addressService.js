/**
 * Address Service - Handles operations related to user addresses
 * Uses ApperClient to interact with the address table
 */

// Fetch all addresses for a specific user
export const fetchUserAddresses = async (userId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'address';
    
    // Query parameters to fetch addresses for a specific user
    const params = {
      fields: [
        'Name', 'type', 'street', 'city', 'state', 
        'zipCode', 'country', 'isDefault', 'userId'
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
      return response.data.map(addr => ({
        id: addr.Id,
        name: addr.Name,
        type: addr.type,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        isDefault: addr.isDefault,
        userId: addr.userId
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

// Create a new address
export const createAddress = async (addressData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'address';
    
    // Only include updateable fields
    const { id, ...updateableFields } = addressData;
    
    // Create the address record
    const response = await apperClient.createRecord(tableName, { records: [updateableFields] });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create address');
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

// Update an existing address
export const updateAddress = async (addressId, addressData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'address';
    
    // Only include updateable fields
    const { id, ...updateableFields } = addressData;
    
    // Update the address record
    const response = await apperClient.updateRecord(tableName, { 
      records: [{
        Id: addressId,
        ...updateableFields
      }]
    });
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update address');
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};