/**
 * Newsletter Service - Handles operations related to newsletter subscriptions
 * Uses ApperClient to interact with the newsletter_subscription table
 */

// Create a new newsletter subscription
export const subscribeToNewsletter = async (email) => {
  try {
    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email address');
    }
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'newsletter_subscription';
    
    // Check if email already exists
    const checkParams = {
      fields: ['email'],
      where: [{
        fieldName: 'email',
        operator: 'ExactMatch',
        values: [email]
      }]
    };
    
    const existingRecords = await apperClient.fetchRecords(tableName, checkParams);
    
    // If email already exists, return success but do not create duplicate
    if (existingRecords && existingRecords.data && existingRecords.data.length > 0) {
      return { success: true, message: 'Email already subscribed' };
    }
    
    // Create new subscription
    const subscriptionData = {
      Name: `Subscription for ${email}`,
      email: email,
      subscribeDate: new Date().toISOString()
    };
    
    // Create the subscription record
    const response = await apperClient.createRecord(tableName, { records: [subscriptionData] });
    
    return { 
      success: response && response.success, 
      data: response.results?.[0]?.data 
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};