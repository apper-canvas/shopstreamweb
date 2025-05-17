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

export default function AccountSettings() {
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

  return (
    <div>
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
    </div>
  );
  );
}