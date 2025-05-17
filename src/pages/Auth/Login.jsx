import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';

const User = getIcon('User');
const Lock = getIcon('Lock');
const EyeIcon = getIcon('Eye');
const EyeOff = getIcon('EyeOff');
const ArrowRight = getIcon('ArrowRight');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password, remember);
      if (success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-100 px-4 py-12 dark:bg-surface-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to your account to continue</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-surface-900 dark:text-white">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-surface-500" />
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
                  placeholder="Enter your password"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-surface-700 dark:text-surface-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
                Forgot password?
              </a>
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
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}