import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const Save = getIcon('Save');
const Eye = getIcon('Eye');
const EyeOff = getIcon('EyeOff');

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile information updated successfully!');
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    
    toast.success('Password updated successfully!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-surface-800 dark:text-white">Account Settings</h1>
      
      <section className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
        <h2 className="mb-4 text-xl font-semibold text-surface-800 dark:text-white">Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">First Name</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Last Name</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" required />
            </div>
            
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Phone Number</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="input-field" />
            </div>
          </div>
          
          <button type="submit" className="btn-primary flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </form>
      </section>
      
      <section className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
        <h2 className="mb-4 text-xl font-semibold text-surface-800 dark:text-white">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Current Password</label>
              <div className="relative">
                <input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type={showPassword.current ? "text" : "password"} 
                  value={formData.currentPassword} 
                  onChange={handleChange} 
                  className="input-field pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">New Password</label>
              <div className="relative">
                <input 
                  id="newPassword" 
                  name="newPassword" 
                  type={showPassword.new ? "text" : "password"} 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  className="input-field pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Confirm New Password</label>
              <div className="relative">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPassword.confirm ? "text" : "password"} 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  className="input-field pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn-primary flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Update Password
          </button>
        </form>
      </section>
    </div>
  );
}