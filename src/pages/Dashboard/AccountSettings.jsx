import { useState } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';
import { FormSection, FormInput, FormDivider } from '../../components/FormComponents';

// Import icons
const User = getIcon('User');
const Mail = getIcon('Mail');
const Phone = getIcon('Phone');
const Lock = getIcon('Lock');
const EyeIcon = getIcon('Eye');
const EyeOff = getIcon('EyeOff');
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
  const { currentUser, setCurrentUser } = useAuth();
  
  // Profile information state
  const [profileInfo, setProfileInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileInfo.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!profileInfo.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileInfo.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (profileInfo.phoneNumber && !/^\+?[0-9\s\-()]+$/.test(profileInfo.phoneNumber)) {
      newErrors.phoneNumber = "Phone number is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsSubmittingProfile(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile in context
      setCurrentUser(prev => ({
        ...prev,
        name: profileInfo.name,
        email: profileInfo.email,
        phoneNumber: profileInfo.phoneNumber
      }));
      
      toast.success("Profile information updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile information");
    } finally {
      setIsSubmittingProfile(false);
    }
  };
  
  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    // Check if current password is correct (for demo, assume it's "password")
    if (passwordData.currentPassword !== "password") {
      setErrors(prev => ({ ...prev, currentPassword: "Current password is incorrect" }));
      return;
    }
    
    setIsSubmittingPassword(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password changed successfully!");
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsSubmittingPassword(false);
    }
  };


// Get icons
      <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-white">Account Settings</h1>

      <div className="space-y-8">
        <div className="card">
          <form onSubmit={handleProfileSubmit}>
            <FormSection
              title="Personal Information"
              description="Update your personal details"
            >
              <FormInput
                id="name"
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={profileInfo.name}
                onChange={handleProfileChange}
                error={errors.name}
                required
                icon={User}
              />
              
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={profileInfo.email}
                onChange={handleProfileChange}
                error={errors.email}
                required
                icon={Mail}
              />
              
              <FormInput
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={profileInfo.phoneNumber}
                onChange={handleProfileChange}
                error={errors.phoneNumber}
                icon={Phone}
              />
            </FormSection>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmittingProfile}
              >
                {isSubmittingProfile ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <form onSubmit={handlePasswordSubmit}>
            <FormSection
              title="Change Password"
              description="Ensure your account is using a secure password"
            >
              <div className="relative">
                <FormInput
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  error={errors.currentPassword}
                  required
                  icon={Lock}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-surface-500"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="relative">
                <FormInput
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  label="New Password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={errors.newPassword}
                  required
                  icon={Lock}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-surface-500"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="relative">
                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={errors.confirmPassword}
                  required
                  icon={Lock}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-surface-500"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </FormSection>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : "Change Password"}
              </button>
            </div>
          </form>
        </div>
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