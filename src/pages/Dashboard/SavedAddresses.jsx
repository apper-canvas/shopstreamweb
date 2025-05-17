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
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
  const { currentUser, setCurrentUser } = useAuth();
  const [addresses, setAddresses] = useState(currentUser?.addresses || []);
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
      isDefault: addresses.length === 0 // Make default if it's the first address
    });
    setEditingAddressId(null);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let updatedAddresses;
      
      if (editingAddressId) {
        // Update existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
        );
        toast.success("Address updated successfully!");
      } else {
        // Add new address
        const newAddress = {
          ...addressForm,
          id: `addr-${Date.now()}`
        };
        
        updatedAddresses = [...addresses, newAddress];
        toast.success("Address added successfully!");
      }
      
      // If the current address is set as default, update other addresses
      if (addressForm.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === (editingAddressId || `addr-${Date.now()}`)
        }));
      }
      
      setAddresses(updatedAddresses);
      
      // Update user context
      setCurrentUser(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
      
      // Close the form
      setShowAddressForm(false);
      setEditingAddressId(null);
    } catch (error) {
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // If we're deleting the default address, make the first remaining address the default
      if (addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      setAddresses(updatedAddresses);
      
      // Update user context
      setCurrentUser(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
      
      toast.success("Address deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };


// Get icons
      <div className="mb-6 flex items-center justify-between">
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
      id: 1,
      
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
                disabled={addresses.length === 0} // Force default if it's the first address
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
      
      {addresses.length === 0 ? (
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
          {addresses.map((address) => (
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
      name: 'Home',
      recipient: 'John Doe',
      streetAddress: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      name: 'Office',
      recipient: 'John Doe',
      streetAddress: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      phone: '(555) 987-6543',
      isDefault: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    recipient: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      recipient: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      isDefault: false
    });
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowAddForm(true);
  };
  
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(address => address.id !== id));
      toast.success('Address deleted successfully');
    }
  };
  
  const handleSetDefault = (id) => {
    setAddresses(prev => 
      prev.map(address => ({
        ...address,
        isDefault: address.id === id
      }))
    );
    toast.success('Default address updated');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing address
      setAddresses(prev => 
        prev.map(address => {
          if (address.id === editingId) {
            return { ...formData, id: editingId };
          }
          return formData.isDefault ? { ...address, isDefault: false } : address;
        })
      );
      toast.success('Address updated successfully');
    } else {
      // Add new address
      const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;
      const newAddress = { ...formData, id: newId };
      
      if (newAddress.isDefault) {
        setAddresses(prev => 
          [...prev.map(address => ({ ...address, isDefault: false })), newAddress]
        );
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      toast.success('Address added successfully');
    }
    
    setShowAddForm(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-800 dark:text-white">Saved Addresses</h1>
        <button 
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowAddForm(!showAddForm);
          }} 
          className={`btn ${showAddForm ? 'bg-surface-200 text-surface-800 hover:bg-surface-300 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600' : 'btn-primary'}`}
        >
          {showAddForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Address
            </>
          )}
        </button>
      </div>

      {/* Address form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
          <h2 className="mb-4 text-lg font-semibold text-surface-800 dark:text-white">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Address Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Home, Office, etc." className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="recipient" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Full Name</label>
              <input id="recipient" name="recipient" type="text" value={formData.recipient} onChange={handleChange} className="input-field" required />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="streetAddress" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Street Address</label>
              <input id="streetAddress" name="streetAddress" type="text" value={formData.streetAddress} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">City</label>
              <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">State/Province</label>
              <input id="state" name="state" type="text" value={formData.state} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">ZIP / Postal Code</label>
              <input id="zipCode" name="zipCode" type="text" value={formData.zipCode} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="country" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Country</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} className="input-field" required>
                <option value="">Select a country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                {/* Add more countries as needed */}
              </select>
            </div>
            
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Phone Number</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="input-field" required />
            </div>
            
            <div className="flex items-center md:col-span-2">
              <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded border-surface-300 bg-white text-primary focus:ring-2 focus:ring-primary dark:border-surface-600 dark:bg-surface-700" />
              <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">Set as default address</label>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => {
                setShowAddForm(false);
                resetForm();
                setEditingId(null);
              }} 
              className="btn bg-surface-200 text-surface-800 hover:bg-surface-300 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address list */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-soft dark:bg-surface-800">
            <p className="text-surface-600 dark:text-surface-400">You don't have any saved addresses yet.</p>
          </div>
        ) : (
          addresses.map(address => (
            <div key={address.id} className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-surface-800 dark:text-white">
                      {address.name}
                    </h3>
                    {address.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1 text-surface-600 dark:text-surface-400">
                    <p>{address.recipient}</p>
                    <p>{address.streetAddress}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <p className="text-sm">{address.phone}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address.id)} 
                      className="flex items-center rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Set as Default
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleEdit(address)} 
                    className="flex items-center rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                  >
                    <Edit className="mr-1.5 h-4 w-4" />
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(address.id)} 
                    className="flex items-center rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}