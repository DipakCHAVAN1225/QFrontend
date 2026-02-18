
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Calendar, Users, LogOut, Menu, X, Settings } from 'lucide-react';


export default function UserDash() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        // Fetch current user data from backend
      

const API= import.meta.env.VITE_API_URL;
const response = await fetch(`${API}/auth/me`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('  User data fetched:', data);
        
        // Use backend data or fallback to auth context
        setUserData(data.user || user);
      } catch (err) {
        console.error('  Error fetching user data:', err);
        setError(err.message);
        // Fallback to auth context user data
        setUserData(user);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Display name for welcome message
  const displayName = userData.name || 'User';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen pt-28 bg-gray-50">
      {/* Header */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">  {error}</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}! 👋</h1>
          <p className="text-gray-600 mt-2">Manage your bookings and find the services you need</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My bookings Card */}
          <Link
            to="/my-bookings"
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-8 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Calendar size={24} className="text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-indigo-600">View All →</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My bookings</h2>
            <p className="text-gray-600">Track your upcoming appointments and service requests</p>
          </Link>

          {/* Browse Services Card */}
          <Link
            to="/services"
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-8 border border-gray-100 hover:border-cyan-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Users size={24} className="text-cyan-600" />
              </div>
              <span className="text-sm font-semibold text-cyan-600">Explore →</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Services</h2>
            <p className="text-gray-600">Browse and book from our pool of verified providers</p>
          </Link>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Information</h2>
              <p className="text-gray-600">Keep your account details up to date</p>
            </div>
            <Link
              to="/my-profile"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Settings size={18} />
              Edit Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
              <p className="text-lg text-gray-900 font-medium mt-1">{userData.name || 'Not set'}</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <p className="text-lg text-gray-900 font-medium mt-1">{userData.email || 'Not set'}</p>
            </div>

            {/* Account Type */}
            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Type</label>
              <div className="mt-1">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold capitalize">
                  {userData.role === 'provider' ? 'Service Provider' : 'Service Seeker'}
                </span>
              </div>
            </div>
          </div>

          {/* Phone & Address (if available) */}
          {(userData.phone || userData.address) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-6 border-t border-gray-100">
              {userData.phone && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                  <p className="text-lg text-gray-900 font-medium mt-1">{userData.phone}</p>
                </div>
              )}
              {userData.address && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                  <p className="text-lg text-gray-900 font-medium mt-1">{userData.address}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-700 mb-4">Check out our guide on how to use QuickTask</p>
            <Link to="/HowItWorks" className="text-blue-600 font-semibold hover:underline">
              Learn More →
            </Link>
          </div>

          <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-2">Account Settings</h3>
            <p className="text-sm text-gray-700 mb-4">Update your profile and preferences</p>
            <Link to="/my-profile" className="text-indigo-600 font-semibold hover:underline">
              Go to Settings →
            </Link>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Sign Out</h3>
          <p className="text-sm text-gray-700 mb-4">End your current session</p>
          <button 
            onClick={onLogout}
            className="text-red-600 font-semibold hover:underline flex items-center gap-2"
          >
            <LogOut size={18} />
            Log Out →
          </button>
        </div>
      </main>
    </div>
  );
}
