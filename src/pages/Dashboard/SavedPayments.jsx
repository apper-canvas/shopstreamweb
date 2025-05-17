import { useState, useEffect } from 'react';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const PlusCircle = getIcon('PlusCircle');
const Edit = getIcon('Edit');
const Trash2 = getIcon('Trash2');
const CheckCircle = getIcon('CheckCircle');
const X = getIcon('X');
const CreditCard = getIcon('CreditCard');
const Wallet = getIcon('Wallet');
const AlertCircle = getIcon('AlertCircle');

// Import auth context
import { useAuth } from '../../contexts/AuthContext';

export default function SavedPayments() {
  const { currentUser, updatePaymentMethod, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  
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
  const [formErrors, setFormErrors] = useState({});
  
  // Load payment methods from user context
  useEffect(() => {
    if (currentUser && currentUser.paymentMethods) {
      setPaymentMethods(currentUser.paymentMethods);
    }
  }, [currentUser]);
  
  const resetForm = () => {
    setFormData({
      name: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false
    });
    setFormErrors({});
  };
  
  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Detect card type from number
  const detectCardType = (number) => {
    const re = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/
    };
    
    const cleanNumber = number.replace(/\s+/g, '');
    
    if (re.visa.test(cleanNumber)) return 'Visa';
    if (re.mastercard.test(cleanNumber)) return 'Mastercard';
    if (re.amex.test(cleanNumber)) return 'Amex';
    if (re.discover.test(cleanNumber)) return 'Discover';
    if (re.diners.test(cleanNumber)) return 'Diners';
    
    // For partial numbers, do prefix detection
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'Amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return 'Diners';
    
    return 'Unknown';
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for card number formatting
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // Clear error if field is valid
      if (formErrors.cardNumber && formattedValue.replace(/\s+/g, '').length >= 13) {
        setFormErrors(prev => ({ ...prev, cardNumber: '' }));
      }
      
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error if field has a value
    if (formErrors[name] && value) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const cardNumber = formData.cardNumber.replace(/\s+/g, '');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
    
    if (!formData.name.trim()) {
      errors.name = 'Card nickname is required';
    }
    
    if (!editingId) { // Only validate card number for new cards
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        errors.cardNumber = 'Card number must be between 13-19 digits';
      } else if (detectCardType(cardNumber) === 'Unknown') {
        errors.cardNumber = 'Invalid card number';
      }
      
      if (!formData.cvv) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        errors.cvv = 'CVV must be 3-4 digits';
      }
    }
    
    if (!formData.expiryMonth) {
      errors.expiryMonth = 'Month is required';
    }
    
    if (!formData.expiryYear) {
      errors.expiryYear = 'Year is required';
    } else {
      const expiryYear = parseInt(formData.expiryYear);
      const expiryMonth = parseInt(formData.expiryMonth);
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        errors.expiryYear = 'Card has expired';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleEdit = (method) => {
    setFormData({
      name: method.name,
      cardNumber: method.type + ' •••• ' + method.last4,
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
      const success = deletePaymentMethod(id);
      if (success) {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
      }
    }
  };
  
  const handleSetDefault = (id) => {
    const success = setDefaultPaymentMethod(id);
    if (success) {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      );
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Process the form
    if (editingId) {
      // Update existing payment method
      const updatedMethod = {
        id: editingId,
        name: formData.name,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault
      };
      
      const success = updatePaymentMethod(updatedMethod);
      
      if (success) {
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
      }
    } else {
      // Add new payment method
      const cardNumber = formData.cardNumber.replace(/\s+/g, '');
      const cardType = detectCardType(cardNumber);
      const last4 = cardNumber.slice(-4);
      
      const newMethod = { 
        id: Date.now().toString(),
        name: formData.name,
        type: cardType,
        last4: last4,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        isDefault: formData.isDefault 
      };
      
      const success = addPaymentMethod(newMethod);
      
      if (success) {
        if (newMethod.isDefault) {
          setPaymentMethods(prev => 
            [...prev.map(method => ({ ...method, isDefault: false })), newMethod]
          );
        } else {
          setPaymentMethods(prev => [...prev, newMethod]);
        }
      }
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
            {formErrors.name && (
              <div className="md:col-span-2 text-red-500 text-xs flex items-center mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> {formErrors.name}
              </div>
            )}
            
            <div className="md:col-span-2">
              <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Card Number {!editingId && <span className="text-red-500">*</span>}</label>
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
            {formErrors.cardNumber && (
              <div className="md:col-span-2 text-red-500 text-xs flex items-center mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> {formErrors.cardNumber}
              </div>
            )}
            
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
            {formErrors.expiryMonth && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> {formErrors.expiryMonth}
              </div>
            )}
            
            <div className="relative">
              <label htmlFor="expiryYear" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Expiry Year</label>
              <select id="expiryYear" name="expiryYear" value={formData.expiryYear} onChange={handleChange} className="input-field" required>
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {formErrors.expiryYear && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> {formErrors.expiryYear}
              </div>
            )}
            
            {!editingId && (
              <div>
                <label htmlFor="cvv" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">CVV</label>
                <input id="cvv" name="cvv" type="password" maxLength="4" value={formData.cvv} onChange={handleChange} placeholder="•••" className="input-field" required />
                {formErrors.cvv && (
                  <div className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" /> {formErrors.cvv}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center md:col-span-2">
              <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault} onChange={handleChange} className="h-4 w-4 rounded border-surface-300 bg-white text-primary focus:ring-2 focus:ring-primary dark:border-surface-600 dark:bg-surface-700" />
              <label htmlFor="isDefault" className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">Set as default payment method</label>
            </div>
            
            {!editingId && (
              <div className="md:col-span-2 mt-2 p-3 bg-surface-100 rounded-lg text-xs text-surface-600 dark:bg-surface-700/50 dark:text-surface-400">
                <p className="flex items-center"><AlertCircle className="h-3.5 w-3.5 mr-1.5 text-primary" /> For security, we only store the last 4 digits of your card number.</p>
                <p className="mt-1">Test card numbers: 4111 1111 1111 1111 (Visa), 5555 5555 5555 4444 (Mastercard)</p>
              </div>
            )}
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
                  <div className={`rounded-full p-3 
                    ${method.type === 'Visa' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                      method.type === 'Mastercard' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                      method.type === 'Amex' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                      method.type === 'Discover' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-primary/10 text-primary dark:bg-primary/20'}`}
                  >
                    <CreditCard className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-surface-800 dark:text-white">
                        {method.name}
                      </h3>
                      {method.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/30">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 text-surface-600 dark:text-surface-400">
                      <p className="flex items-center text-sm">
                        <span className={`font-medium mr-2 ${
                          method.type === 'Visa' ? 'text-blue-600 dark:text-blue-400' : 
                          method.type === 'Mastercard' ? 'text-orange-600 dark:text-orange-400' : 
                          method.type === 'Amex' ? 'text-indigo-600 dark:text-indigo-400' :
                          method.type === 'Discover' ? 'text-green-600 dark:text-green-400' :
                          ''
                        }`}>
                          {method.type}
                        </span>
                        <span className="tracking-wider">
                          •••• •••• •••• {method.last4}
                        </span>
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