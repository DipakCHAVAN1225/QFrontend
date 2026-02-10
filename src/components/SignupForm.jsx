

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { User, Settings, Calendar, Menu, Eye, EyeOff } from 'lucide-react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    serviceType: ''
  });
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      if (role === 'provider') {
        userData.businessName = formData.businessName;
        userData.serviceType = formData.serviceType;
      }

      const result = await signup(userData, role);

      if (result.success) {
        if (role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 shadow-xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quick<span className="text-gray-900">Task</span>
          </Link>

          <nav className="hidden lg:flex gap-10 ml-8 text-sm font-medium">
            <a href="#services" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">Services</a>
            <a href="#providers" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">Provider</a>
            <a href="#how" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">How it works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition font-semibold"
            >
              <User size={18} />
              Login
            </Link>

            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Signup Content */}
      <div className="pt-24 px-6 pb-12 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
            <p className="text-center text-gray-600 mb-8">Join QuickTask today</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sign Up As</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`px-4 py-3 rounded-lg font-semibold transition ${
                      role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <User size={18} className="mx-auto mb-1" />
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('provider')}
                    className={`px-4 py-3 rounded-lg font-semibold transition ${
                      role === 'provider'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Settings size={18} className="mx-auto mb-1" />
                    Provider
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Business Name (Provider only) */}
              {role === 'provider' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                    required={role === 'provider'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              )}

              {/* Service Type (Provider only) */}
              {role === 'provider' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Service Type</label>
                  <input
                    type="text"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    placeholder="e.g., Cleaning, Plumbing"
                    required={role === 'provider'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              )}

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                  role === 'provider'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Login
              </Link>
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">For Customers</h3>
              <p className="text-sm text-gray-600">Book services, track bookings, and manage your account.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">For Providers</h3>
              <p className="text-sm text-gray-600">Manage bookings, track earnings, and grow your business.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}