

import { useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Settings, Calendar, History, ChevronDown, User, Menu, X } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { IconPhone } from '../App'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user from your auth hook
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  // If still loading, show a minimal navbar
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 shadow-xl z-50 border-b border-gray-100 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quick<span className="text-gray-900">Task</span>
          </Link>
        </div>
      </header>
    );
  }

  // If user is logged in as a provider
  if (user && user.role === 'provider') {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 shadow-xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quick<span className="text-gray-900">Task</span>
          </Link>

          {/* Provider Navigation */}
          <nav className="hidden lg:flex gap-10 text-sm font-medium">
            <Link to="/providerdashboard" className="text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>
          </nav>

          {/* Provider Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-full transition duration-200"
            >
              <img
                src={user.dp || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id || 'default'}`}
                alt={user.businessName || user.name}
                className="w-10 h-10 rounded-full border-2 border-indigo-600 shadow-sm"
              />
              <span className="hidden sm:inline text-sm font-semibold text-gray-900">
                {user.businessName || user.name}
              </span>
              <ChevronDown 
                size={16} 
                className={`transition duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="text-sm font-bold text-gray-900">
                    {user.businessName || user.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  {user.serviceType && <p className="text-xs text-indigo-600 mt-2 font-medium">Service: {user.serviceType}</p>}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // If user is logged in as a customer
  if (user && user.role === 'user') {

    return (
      <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 shadow-xl z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo + Navigation */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Quick<span className="text-gray-900">Task</span>
            </Link>

            <nav className="hidden lg:flex gap-10 ml-8 text-sm font-medium">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
              <a href="/services" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">Services</a>
              <Link to="/providers" className="text-gray-700 hover:text-indigo-600 transition">Find Provider</Link>
              <a href="/HowItWorks" className="text-gray-700 hover:text-indigo-600 transition cursor-pointer">How it works</a>
                <Link to="/userdashboard" className="text-gray-700 hover:text-indigo-600 transition">user Dashboard</Link>
            </nav>
          </div>

          {/* Customer Actions */}
          <div className="flex items-center gap-4">
            {/* bookings */}
            <Link
              to="/my-bookings"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              <History size={18} />
              My bookings
            </Link>

            {/* Book Now Button */}
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg shadow-indigo-500/30 transition duration-300 font-semibold text-sm"
            >
              <Calendar size={18} />
              Book Now
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-full transition duration-200"
              >
                <img
                  src={user.dp || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id || 'default'}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-indigo-600 shadow-sm"
                />
                <span className="hidden sm:inline text-sm font-semibold text-gray-900">
                  {user.name}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3">
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                    >
                      <History size={16} className="text-indigo-600" />
                      My bookings
                    </Link>
                    <Link
                      to="/my-profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition"
                    >
                      <Settings size={16} className="text-indigo-600" />
                      Profile Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default navbar (not logged in) - shows your login/signup page
  return (
    <header className="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-95 shadow-xl z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo + Navigation */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quick<span className="text-gray-900">Task</span>
          </Link>

          <nav className="hidden lg:flex gap-10 ml-8 text-sm font-medium">
  <NavLink
    to="/Services"
    className="text-gray-700 hover:text-indigo-600 transition cursor-pointer"
  >
    Services
  </NavLink>

  <NavLink
    to="/providers"
    className="text-gray-700 hover:text-indigo-600 transition cursor-pointer"
  >
    Provider
  </NavLink>

  <NavLink
    to="/HowItWorks"
    className="text-gray-700 hover:text-indigo-600 transition cursor-pointer"
  >
    How it works
  </NavLink>

  <NavLink
    to="/testimonials"
    className="text-gray-700 hover:text-indigo-600 transition cursor-pointer"
  >
    Testimonials
  </NavLink>
</nav>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {/* Login Button */}
          <Link
            to="/login"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition font-semibold"
          >
            <User size={18} />
            Login
          </Link>

          {/* Book Now Button */}
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg shadow-indigo-500/30 transition duration-300 font-semibold text-sm"
          >
            <Calendar size={18} />
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}