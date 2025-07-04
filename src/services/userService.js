/**
 * User Service - Handles operations related to users
 * Uses ApperClient to interact with the User4 table
 */

// Get user by ID
export const fetchUserById = async (userId) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'User4';
    
    // Get record by ID
    const response = await apperClient.getRecordById(tableName, userId);
    
    if (response && response.data) {
      // Format the user data
      const user = response.data;
      return {
        id: user.Id,
        name: user.Name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'User4';
    
    // Map client-side field names to the exact field names in the Apper table
    // This is crucial for the API to recognize the fields
    const updateableFields = {
      Name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber
    };
    
    // Remove any undefined fields
    Object.keys(updateableFields).forEach(key =>
      (updateableFields[key] === undefined || updateableFields[key] === null) && delete updateableFields[key]
    );
    
    // Update the user record with the proper format
    const response = await apperClient.updateRecord(tableName, {
      records: [{
        Id: userId,
        ...updateableFields
      }]
    });
    
    if (response && response.success && response.results && response.results.some(result => result.success)) {
      const successResult = response.results.find(result => result.success);
      return successResult.data;
    }
    throw new Error('Failed to update user profile');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};