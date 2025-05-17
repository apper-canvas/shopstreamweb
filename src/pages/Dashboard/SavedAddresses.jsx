import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const PlusCircle = getIcon('PlusCircle');
const Edit = getIcon('Edit');
const Trash2 = getIcon('Trash2');
const CheckCircle = getIcon('CheckCircle');
const X = getIcon('X');

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
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