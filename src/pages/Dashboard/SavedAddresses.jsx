import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';
import { FormInput } from '../../components/FormComponents';

// Import icons
const MapPin = getIcon('MapPin');
const Home = getIcon('Home');
const Building = getIcon('Building');
const PlusCircle = getIcon('PlusCircle');
const Edit = getIcon('Edit');
const Trash = getIcon('Trash');
const X = getIcon('X');
const CheckCircle = getIcon('CheckCircle');

export default function SavedAddresses() {
  const { currentUser, updateAddress, addAddress, deleteAddress } = useAuth();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle address form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Open the form to add a new address
  const handleAddAddress = () => {
    setAddressForm({
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
    setShowAddressForm(true);
    setErrors({});
  };
  
  // Open the form to edit an existing address
  const handleEditAddress = (address) => {
    setAddressForm({ ...address });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setErrors({});
  };
  
  // Validate the address form
  const validateAddressForm = () => {
    const newErrors = {};
    
    if (!addressForm.street.trim()) {
      newErrors.street = "Street address is required";
    }
    
    if (!addressForm.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!addressForm.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!addressForm.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    }
    
    if (!addressForm.country.trim()) {
      newErrors.country = "Country is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle address form submission
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    
    if (!validateAddressForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (editingAddressId) {
        // Update existing address  
        await updateAddress({ ...addressForm, id: editingAddressId });
      } else {
        // Add new address
        await addAddress(addressForm);
      }
      
      // Close the form
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({ type: 'Home', street: '', city: '', state: '', zipCode: '', country: 'United States', isDefault: false });
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    setShowDeleteConfirm(null);
    
    try {
      await deleteAddress(addressId);
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Saved Addresses</h1>
          <p className="mt-1 text-surface-600 dark:text-surface-400">
            Manage your delivery addresses
          </p>
        </div>
        
        <button
          onClick={handleAddAddress}
          className="btn-primary"
          disabled={showAddressForm}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Address
        </button>
      </div>
      
      {showAddressForm && (
        <div className="mb-6 rounded-xl border border-surface-200 bg-white p-6 shadow-soft dark:border-surface-700 dark:bg-surface-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={() => setShowAddressForm(false)}
              className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmitAddress} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex space-x-4">
                <label className="flex cursor-pointer items-center space-x-2 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
                  <input
                    type="radio"
                    name="type"
                    value="Home"
                    checked={addressForm.type === 'Home'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <Home className="h-5 w-5 text-surface-600" />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Home</span>
                </label>
                
                <label className="flex cursor-pointer items-center space-x-2 rounded-lg border border-surface-200 p-3 dark:border-surface-700">
                  <input
                    type="radio"
                    name="type"
                    value="Work"
                    checked={addressForm.type === 'Work'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <Building className="h-5 w-5 text-surface-600" />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Work</span>
                </label>
              </div>
            </div>
            
            <FormInput
              id="street"
              name="street"
              label="Street Address"
              placeholder="Enter street address"
              value={addressForm.street}
              onChange={handleInputChange}
              error={errors.street}
              required
              icon={MapPin}
            />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                id="city"
                name="city"
                label="City"
                placeholder="Enter city"
                value={addressForm.city}
                onChange={handleInputChange}
                error={errors.city}
                required
              />
              
              <FormInput
                id="state"
                name="state"
                label="State / Province"
                placeholder="Enter state"
                value={addressForm.state}
                onChange={handleInputChange}
                error={errors.state}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                id="zipCode"
                name="zipCode"
                label="Zip / Postal Code"
                placeholder="Enter zip code"
                value={addressForm.zipCode}
                onChange={handleInputChange}
                error={errors.zipCode}
                required
              />
              
              <FormInput
                id="country"
                name="country"
                label="Country"
                placeholder="Enter country"
                value={addressForm.country}
                onChange={handleInputChange}
                error={errors.country}
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isDefault"
                name="isDefault"
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                disabled={currentUser?.addresses?.length === 0} // Force default if it's the first address
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                Set as default address
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="btn border-2 border-surface-300 bg-white text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  editingAddressId ? 'Update Address' : 'Save Address'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!currentUser?.addresses?.length ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <MapPin className="mb-4 h-16 w-16 text-surface-400" />
          <h3 className="mb-2 text-xl font-medium text-surface-900 dark:text-white">No Addresses Saved</h3>
          <p className="mb-6 text-center text-surface-600 dark:text-surface-400">
            You haven't saved any addresses yet. Add an address to have it automatically filled during checkout.
          </p>
          <button onClick={handleAddAddress} className="btn-primary">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentUser.addresses.map((address) => (
            <div key={address.id} className="card">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {address.type === 'Home' ? (
                    <Home className="h-5 w-5 text-primary" />
                  ) : (
                    <Building className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white">
                    {address.type}
                  </h3>
                  {address.isDefault && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-700"
                    aria-label="Edit address"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(address.id)}
                    className="rounded-full p-1 text-surface-500 hover:bg-surface-100 hover:text-secondary dark:hover:bg-surface-700"
                    aria-label="Delete address"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-surface-700 dark:text-surface-300">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
              
              {showDeleteConfirm === address.id && (
                <div className="mt-4 rounded border border-surface-200 bg-surface-50 p-3 dark:border-surface-700 dark:bg-surface-800/50">
                  <p className="mb-2 text-sm text-surface-800 dark:text-surface-200">
                    Are you sure you want to delete this address?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="rounded px-3 py-1 text-xs font-medium text-surface-600 hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="rounded bg-secondary px-3 py-1 text-xs font-medium text-white hover:bg-secondary-dark"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}