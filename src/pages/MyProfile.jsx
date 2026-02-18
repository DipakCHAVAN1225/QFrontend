

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, LogOut, AlertCircle, CheckCircle, Loader } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    bio: '',
  });

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get token from localStorage (set by AuthContext during login)
      const authToken = localStorage.getItem('token');
      
      console.log('🔍 Profile Component - Fetching user data');
      console.log('  Token from localStorage:', authToken ? '  Found' : '  Not found');
      
      if (!authToken) {
        setErrorMsg('No authentication token found. Please login first.');
        setPageLoading(false);
        console.error('  No token available');
        return;
      }

      console.log('📡 Making API request to /api/user/profile');
      const response = await fetch(`${API}/user/profile`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 API Response Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('  Profile data received:', data);
        setUser(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          zipcode: data.user.zipcode || '',
          bio: data.user.bio || ''
        });
        if (data.user.dp) {
          setImagePreview(data.user.dp);
        }
      } else {
        const errorData = await response.json();
        console.error('  API Error:', errorData);
        setErrorMsg(errorData.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('  Error fetching user data:', error);
      setErrorMsg('Error loading profile: ' + error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.zipcode?.trim()) newErrors.zipcode = 'Zipcode is required';
    else if (!/^[0-9]{5,}$/.test(formData.zipcode.replace(/\s/g, ''))) newErrors.zipcode = 'Invalid zipcode format';
    
    if (!formData.bio?.trim()) newErrors.bio = 'Bio is required';
    else if (formData.bio.trim().length < 10) newErrors.bio = 'Bio must be at least 10 characters';

    if (!profileImage && !imagePreview) newErrors.profileImage = 'Profile picture is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(file);
        if (errors.profileImage) {
          setErrors(prev => ({
            ...prev,
            profileImage: ''
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const authToken = localStorage.getItem('token');
      
      if (!authToken) {
        setErrorMsg('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      console.log('  Uploading profile with image...');
      const response = await fetch(`${API}/user/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formDataToSend
      });

      console.log('📥 Update response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('  Profile updated:', data);
        setUser(data.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        setProfileImage(null);
        setErrorMsg('');
      } else {
        const errorData = await response.json();
        console.error('  Update error:', errorData);
        setErrorMsg(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('  Error saving profile:', error);
      setErrorMsg('Error saving profile: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 3000);
    }
  };

  const handleLogout = () => {
    console.log('🚪 User clicked logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const displayImage = imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{errorMsg || 'Unable to Load Profile'}</h2>
          <p className="text-gray-600 mb-6">Please try logging in again</p>
          <a href="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-block">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to- bg-green-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle size={20} />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="text-green-600 hover:text-green-800">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle size={20} />
              {errorMsg}
            </span>
            <button onClick={() => setErrorMsg('')} className="text-red-600 hover:text-red-800">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Header Background */}
              <div className="relative bg-gradient-to-br bg-green-600 h-32"></div>
              
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex flex-col items-center -mt-16 mb-4">
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={user?.name || 'User'}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    
                    {/* Upload Button - Only show when editing */}
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer transition shadow-lg">
                        <Upload size={18} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}

                    {/* Image Upload Indicator */}
                    {profileImage && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20">
                        <span className="text-white text-xs font-bold bg-green-500 px-2 py-1 rounded">New</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 border-t pt-6">
                  
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <Mail className="text-indigo-600 flex-shrink-0 mt-1" size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{user?.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="text-indigo-600 flex-shrink-0 mt-1" size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{user?.phone || 'Not added'}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="text-indigo-600 flex-shrink-0 mt-1" size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{user?.address || 'Not added'}</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start gap-3 pt-2 border-t">
                    <Calendar className="text-indigo-600 flex-shrink-0 mt-1" size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'December 2024'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (isEditing) {
                      setImagePreview(user?.dp || null);
                      setProfileImage(null);
                      setErrors({});
                    }
                  }}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <Edit2 size={18} />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {!isEditing ? (
                
                /* View Mode */
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.name}</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.email}</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.phone || '-'}</p>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.city || '-'}</p>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.state || '-'}</p>
                    </div>

                    {/* Zipcode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode</label>
                      <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.zipcode || '-'}</p>
                    </div>

                  </div>

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg">{user?.address || '-'}</p>
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <p className="text-gray-900 font-medium p-3 bg-gray-50 rounded-lg min-h-24">{user?.bio || '-'}</p>
                  </div>
                </div>

              ) : (
                
                /* Edit Mode */
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Name from your account</p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email from your account</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="+91 XXXXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                          errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                          errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Maharashtra"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.state}
                        </p>
                      )}
                    </div>

                    {/* Zipcode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode *</label>
                      <input
                        type="text"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                          errors.zipcode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                      />
                      {errors.zipcode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.zipcode}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Address */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio * <span className="text-xs text-gray-500">(Minimum 10 characters)</span></label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.bio}
                      </p>
                    )}
                  </div>

                  {/* Profile Picture Upload Info */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture *</label>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Upload size={32} className="text-gray-400" />
                        )}
                      </div>
                      <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition font-medium flex items-center gap-2">
                        <Upload size={18} />
                        Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {errors.profileImage && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {errors.profileImage}
                        </p>
                      )}
                      {profileImage && (
                        <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                          <CheckCircle size={14} />
                          New image selected
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(user?.dp || null);
                        setProfileImage(null);
                        setErrors({});
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}



