import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';

const User = getIcon('User');
const Mail = getIcon('Mail');
const Lock = getIcon('Lock');
const EyeIcon = getIcon('Eye');
const EyeOff = getIcon('EyeOff');
const ArrowRight = getIcon('ArrowRight');
const CheckCircle = getIcon('CheckCircle');
const XCircle = getIcon('XCircle');

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Full name is required";
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Password must contain an uppercase letter";
    else if (!/[a-z]/.test(password)) newErrors.password = "Password must contain a lowercase letter";
    else if (!/[0-9]/.test(password)) newErrors.password = "Password must contain a number";
    else if (!/[^A-Za-z0-9]/.test(password)) newErrors.password = "Password must contain a special character";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (!acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-100 px-4 py-12 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign up to get started with ShopStream</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-surface-900 dark:text-white">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-surface-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  className={`input-field pl-10 ${errors.name ? 'border-secondary' : ''}`}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-secondary">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-surface-900 dark:text-white">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-surface-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'border-secondary' : ''}`}
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-secondary">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-surface-900 dark:text-white">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-surface-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-secondary' : ''}`}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-secondary">{errors.password}</p>}
              
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {req.met ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4 text-surface-400" />
                    )}
                    <span className={req.met ? 'text-green-500' : 'text-surface-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-surface-900 dark:text-white">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-surface-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-secondary' : ''}`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-secondary">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-surface-700 dark:text-surface-300">
                  I accept the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </label>
                {errors.acceptTerms && <p className="mt-1 text-sm text-secondary">{errors.acceptTerms}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}