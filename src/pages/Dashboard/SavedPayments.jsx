import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const PlusCircle = getIcon('PlusCircle');
const Edit = getIcon('Edit');
const Trash2 = getIcon('Trash2');
const CheckCircle = getIcon('CheckCircle');
const X = getIcon('X');
const CreditCard = getIcon('CreditCard');
const Wallet = getIcon('Wallet');

export default function SavedPayments() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: 'Personal Card',
      type: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: 2,
      name: 'Business Card',
      type: 'Mastercard',
      last4: '8888',
      expiryMonth: '06',
      expiryYear: '2024',
      isDefault: false
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
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
  
  const handleEdit = (method) => {
    setFormData({
      name: method.name,
      cardNumber: '************' + method.last4,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvv: '',
      isDefault: method.isDefault
    });
    setEditingId(method.id);
    setShowAddForm(true);
  };
  
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      toast.success('Payment method deleted successfully');
    }
  };
  
  const handleSetDefault = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success('Default payment method updated');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate card type detection (would normally be done via a library)
    const cardNumber = formData.cardNumber.replace(/\s+/g, '');
    let cardType = 'Unknown';
    if (cardNumber.startsWith('4')) {
      cardType = 'Visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
      cardType = 'Mastercard';
    } else if (/^3[47]/.test(cardNumber)) {
      cardType = 'Amex';
    }
    
    const last4 = cardNumber.slice(-4);
    
    if (editingId) {
      // Update existing payment method
      setPaymentMethods(prev => 
        prev.map(method => {
          if (method.id === editingId) {
            return { 
              ...method, 
              name: formData.name,
              expiryMonth: formData.expiryMonth,
              expiryYear: formData.expiryYear,
              isDefault: formData.isDefault
            };
          }
          return formData.isDefault ? { ...method, isDefault: false } : method;
        })
      );
      toast.success('Payment method updated successfully');
    } else {
      // Add new payment method
      const newId = Math.max(0, ...paymentMethods.map(m => m.id)) + 1;
      const newMethod = { 
        id: newId,
        name: formData.name,
        type: cardType,
        last4: last4,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault 
      };
      
      if (newMethod.isDefault) {
        setPaymentMethods(prev => 
          [...prev.map(method => ({ ...method, isDefault: false })), newMethod]
        );
      } else {
        setPaymentMethods(prev => [...prev, newMethod]);
      }
      toast.success('Payment method added successfully');
    }
    
    setShowAddForm(false);
    setEditingId(null);
    resetForm();
  };

  // Get current year for expiry year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-800 dark:text-white">Payment Methods</h1>
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
              Add Payment Method
            </>
          )}
        </button>
      </div>

      {/* Payment method form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
          <h2 className="mb-4 text-lg font-semibold text-surface-800 dark:text-white">
            {editingId ? 'Edit Payment Method' : 'Add New Payment Method'}
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Card Nickname</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Personal Card, Work Card, etc." className="input-field" required />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Card Number</label>
              <input 
                id="cardNumber" 
                name="cardNumber" 
                type="text" 
                value={formData.cardNumber} 
                onChange={handleChange} 
                placeholder="•••• •••• •••• ••••"
                className="input-field" 
                disabled={!!editingId}
                required={!editingId}
              />
            </div>
            
            <div>
              <label htmlFor="expiryMonth" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Expiry Month</label>
              <select id="expiryMonth" name="expiryMonth" value={formData.expiryMonth} onChange={handleChange} className="input-field" required>
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0');
                  return <option key={month} value={month}>{month}</option>;
                })}
              </select>
            </div>
            
            <div>
              <label htmlFor="expiryYear" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Expiry Year</label>
              <select id="expiryYear" name="expiryYear" value={formData.expiryYear} onChange={handleChange} className="input-field" required>
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            {!editingId && (
              <div>
                <label htmlFor="cvv" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">CVV</label>
                <input id="cvv" name="cvv" type="password" maxLength="4" value={formData.cvv} onChange={handleChange} placeholder="•••" className="input-field" required />
              </div>
            )}
            
            <div className="flex items-center md:col-span-2">
              <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded border-surface-300 bg-white text-primary focus:ring-2 focus:ring-primary dark:border-surface-600 dark:bg-surface-700" />
              <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">Set as default payment method</label>
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
              {editingId ? 'Update Payment Method' : 'Save Payment Method'}
            </button>
          </div>
        </form>
      )}

      {/* Payment methods list */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-soft dark:bg-surface-800">
            <p className="text-surface-600 dark:text-surface-400">You don't have any saved payment methods yet.</p>
          </div>
        ) : (
          paymentMethods.map(method => (
            <div key={method.id} className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary dark:bg-primary/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-surface-800 dark:text-white">
                        {method.name}
                      </h3>
                      {method.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 text-surface-600 dark:text-surface-400">
                      <p className="flex items-center">
                        <span className="font-medium">{method.type}</span>
                        <span className="mx-2">•••• •••• •••• {method.last4}</span>
                      </p>
                      <p className="text-sm">Expires {method.expiryMonth}/{method.expiryYear}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {!method.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(method.id)} 
                      className="flex items-center rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Set as Default
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleEdit(method)} 
                    className="flex items-center rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                  >
                    <Edit className="mr-1.5 h-4 w-4" />
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(method.id)} 
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
      
      <div className="rounded-xl bg-surface-100 p-4 dark:bg-surface-800/50">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary dark:bg-primary/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="text-surface-600 dark:text-surface-400">
            <p className="text-sm font-medium">Your payment information is securely stored</p>
            <p className="text-xs">We use industry-standard encryption to protect your sensitive data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}