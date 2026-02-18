
import React, { useState, useEffect } from 'react';
import { Bell, DollarSign, Calendar, Clock, CheckCircle, XCircle, Menu, X, TrendingUp, Star, Award, Users, Loader, User, Settings, LogOut, Upload, AlertCircle, Save } from 'lucide-react';
const API= import.meta.env.VITE_API_URL;

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    pendingRequests: 0
  });

  const [profileFormData, setProfileFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    bio: '',
    businessName: '',
    serviceType: '',
    yearsOfExperience: '',
    pricePerHour: '',
    maxPrice: '',
  });

  // Function to calculate stats from bookings
  const calculateStats = (fetchedRequests, fetchedbookings) => {
    const completedbookings = fetchedbookings.filter(b => b.status === 'completed');
    const totalEarnings = completedbookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthbookings = completedbookings.filter(b => new Date(b.completedAt || b.createdAt) >= firstDay);
    const monthEarnings = monthbookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const ratedbookings = completedbookings.filter(b => b.rating);
    const averageRating = ratedbookings.length > 0
      ? (ratedbookings.reduce((sum, b) => sum + b.rating, 0) / ratedbookings.length).toFixed(1)
      : 0;

    return {
      totalEarnings,
      monthEarnings,
      completedJobs: completedbookings.length,
      averageRating: parseFloat(averageRating) || 0,
      pendingRequests: fetchedRequests.length
    };
  };

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const [reqRes, bookRes] = await Promise.all([
        fetch(`${API}/bookings/provider/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/bookings/provider/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const reqData = await reqRes.json();
      const bookData = await bookRes.json();
      
      const fetchedRequests = reqData.requests || [];
      const fetchedbookings = bookData.bookings || [];
      
      setRequests(fetchedRequests);
      setbookings(fetchedbookings);

      // Calculate and update stats
      const updatedStats = calculateStats(fetchedRequests, fetchedbookings);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileFormData({
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || '',
          zipcode: data.user.zipcode || '',
          bio: data.user.bio || '',
          businessName: data.user.businessName || '',
          serviceType: data.user.serviceType || '',
          yearsOfExperience: data.user.yearsOfExperience || '',
          pricePerHour: data.user.pricePerHour || '',
          maxPrice: data.user.maxPrice || '',
        });
        if (data.user.dp) {
          setImagePreview(data.user.dp);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProviderData();
    fetchUserProfile();
    const interval = setInterval(fetchProviderData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatedStats = calculateStats(requests, bookings);
    setStats(updatedStats);
  }, [bookings, requests]);

  const handleAccept = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/bookings/${bookingId}/accept`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        alert('Request accepted!');
        fetchProviderData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error accepting request');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/bookings/${bookingId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        alert('Request rejected');
        fetchProviderData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error rejecting request');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/bookings/${bookingId}/complete`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        alert('Booking completed! Earnings updated.');
        fetchProviderData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error completing booking');
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
        alert('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(file);
        if (profileErrors.profileImage) {
          setProfileErrors(prev => ({ ...prev, profileImage: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileFormData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!profileFormData.address?.trim()) newErrors.address = 'Address is required';
    if (!profileFormData.city?.trim()) newErrors.city = 'City is required';
    if (!profileFormData.state?.trim()) newErrors.state = 'State is required';
    if (!profileFormData.zipcode?.trim()) newErrors.zipcode = 'Zipcode is required';
    if (!profileFormData.bio?.trim()) newErrors.bio = 'Bio is required';
    if (profileFormData.bio?.trim().length < 10) newErrors.bio = 'Bio must be at least 10 characters';
    if (!profileFormData.businessName?.trim()) newErrors.businessName = 'Business name is required';
    if (!profileFormData.serviceType?.trim()) newErrors.serviceType = 'Service type is required';
    if (!profileFormData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    if (!profileFormData.pricePerHour) newErrors.pricePerHour = 'Price per hour is required';
    if (!profileFormData.maxPrice) newErrors.maxPrice = 'Max price is required';
    if (!profileImage && !imagePreview) newErrors.profileImage = 'Profile picture is required';

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    setProfileLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Authentication token not found');
        setProfileLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(profileFormData).forEach(key => {
        formDataToSend.append(key, profileFormData[key]);
      });

      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      const response = await fetch(`${API}/user/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSuccessMsg('Profile updated successfully!');
        setIsEditingProfile(false);
        setProfileImage(null);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Failed to update profile');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMsg('Error saving profile');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const displayImage = imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

  if (!user || user.role !== 'provider') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Provider access only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-900 text-white transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static shadow-2xl`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ServicePro</h1>
              <p className="text-xs text-indigo-200">Provider Dashboard</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1">
            {[
              { id: 'overview', icon: '📊', label: 'Overview' },
              { id: 'requests', icon: '📋', label: 'Requests', badge: requests.length },
              { id: 'bookings', icon: '📅', label: 'Bookings' },
              { id: 'earnings', icon: '💰', label: 'Earnings' },
              { id: 'profile', icon: '👤', label: 'My Profile' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                  activeTab === item.id 
                    ? 'bg-white text-indigo-700 shadow-lg font-semibold' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeTab === 'overview' && '📊 Dashboard Overview'}
                  {activeTab === 'requests' && '📋 Service Requests'}
                  {activeTab === 'bookings' && '📅 Your Bookings'}
                  {activeTab === 'earnings' && '💰 Earnings'}
                  {activeTab === 'profile' && '👤 My Profile'}
                </h2>
                <p className="text-sm text-gray-500">Manage your services efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="text-gray-600" size={24} />
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {requests.length}
                  </span>
                )}
              </button>
              <img src={displayImage} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-600 object-cover cursor-pointer" onClick={() => setActiveTab('profile')} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {loading && activeTab !== 'profile' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                      <p className="text-sm opacity-90">Total Earnings</p>
                      <p className="text-4xl font-bold mt-2">₹{stats.totalEarnings}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                      <Calendar size={32} className="mb-4 opacity-80" />
                      <p className="text-sm opacity-90">This Month</p>
                      <p className="text-4xl font-bold mt-2">₹{stats.monthEarnings}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                      <CheckCircle size={32} className="mb-4 opacity-80" />
                      <p className="text-sm opacity-90">Completed Jobs</p>
                      <p className="text-4xl font-bold mt-2">{stats.completedJobs}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                      <Star size={32} className="mb-4 opacity-80" />
                      <p className="text-sm opacity-90">Avg Rating</p>
                      <p className="text-4xl font-bold mt-2">⭐ {stats.averageRating}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
                      <p className="text-gray-600 font-medium">Pending Requests</p>
                      <p className="text-5xl font-bold text-blue-600 mt-2">{stats.pendingRequests}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
                      <p className="text-gray-600 font-medium">Confirmed Bookings</p>
                      <p className="text-5xl font-bold text-green-600 mt-2">{bookings.filter(b => b.status === 'accepted').length}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
                      <p className="text-gray-600 font-medium">Total Bookings</p>
                      <p className="text-5xl font-bold text-orange-600 mt-2">{bookings.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Service Requests</h3>
                      <p className="text-gray-600 mt-1">Review and respond to booking requests</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                      {requests.length} Pending
                    </div>
                  </div>

                  {requests.length > 0 ? (
                    <div className="space-y-4">
                      {requests.map(req => (
                        <div key={req._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6">
                          <div className="flex gap-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.userId}`} className="w-16 h-16 rounded-full border-2 border-indigo-200" alt="User" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-xl font-bold">{req.serviceType}</h4>
                                  <p className="text-gray-600">By: <span className="font-semibold text-indigo-600">{req.userName}</span></p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Pending</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Clock size={18} />
                                  <span>{new Date(req.scheduledTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <span className="font-bold text-green-600">₹{req.amount}</span>
                                </div>
                              </div>

                              {req.description && (
                                <p className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700">{req.description}</p>
                              )}

                              <div className="flex gap-3">
                                <button onClick={() => handleAccept(req._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                  <CheckCircle size={20} /> Accept
                                </button>
                                <button onClick={() => handleReject(req._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                  <XCircle size={20} /> Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md p-16 text-center">
                      <Bell size={48} className="text-gray-400 mx-auto mb-4" />
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">No Pending Requests</h4>
                      <p className="text-gray-500">You are all caught up!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Your Bookings</h3>
                    <p className="text-gray-600 mt-1">Manage your confirmed appointments</p>
                  </div>

                  {bookings.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                          <tr>
                            <th className="px-6 py-4 text-left font-bold">Service</th>
                            <th className="px-6 py-4 text-left font-bold">Customer</th>
                            <th className="px-6 py-4 text-left font-bold">Date</th>
                            <th className="px-6 py-4 text-left font-bold">Amount</th>
                            <th className="px-6 py-4 text-left font-bold">Status</th>
                            <th className="px-6 py-4 text-left font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {bookings.map(booking => (
                            <tr key={booking._id} className="hover:bg-indigo-50">
                              <td className="px-6 py-4 font-bold">{booking.serviceType}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.userId}`} className="w-8 h-8 rounded-full" alt="User" />
                                  <span>{booking.userName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">{new Date(booking.scheduledTime).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-bold text-green-600">₹{booking.amount}</td>
                              <td className="px-6 py-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                  booking.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {booking.status === 'accepted' && (
                                  <button onClick={() => handleCompleteBooking(booking._id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle size={16} /> Complete
                                  </button>
                                )}
                                {booking.status === 'completed' && (
                                  <span className="text-green-600 font-semibold flex items-center gap-2">
                                    <CheckCircle size={16} /> Finished
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md p-16 text-center">
                      <Calendar size={64} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No bookings yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Earnings Tab */}
              {activeTab === 'earnings' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Earnings Dashboard</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                      <h4 className="text-2xl font-bold mb-6">Earnings Summary</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between py-4 border-b border-white/20">
                          <span>Total Earnings</span>
                          <span className="font-bold text-3xl">₹{stats.totalEarnings}</span>
                        </div>
                        <div className="flex justify-between py-4 border-b border-white/20">
                          <span>This Month</span>
                          <span className="font-bold text-3xl">₹{stats.monthEarnings}</span>
                        </div>
                        <div className="flex justify-between py-4">
                          <span>Completed Jobs</span>
                          <span className="font-bold text-3xl">{stats.completedJobs}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                      <h4 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h4>
                      <div className="space-y-4">
                        <div className="p-5 border-2 border-indigo-200 rounded-xl flex justify-between items-center">
                          <div>
                            <p className="font-bold text-lg">Bank Account</p>
                            <p className="text-sm text-gray-600">•••• •••• •••• 5678</p>
                          </div>
                          <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold">Active</span>
                        </div>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold">
                          💸 Withdraw Earnings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* My Profile Tab */}
              {activeTab === 'profile' && (
                <div className="max-w-4xl">
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

                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    {!isEditingProfile ? (
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-bold text-gray-900">Your Profile</h3>
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                          >
                            <User size={18} />
                            Edit Profile
                          </button>
                        </div>

                        <div className="flex gap-8 mb-8">
                          <img
                            src={displayImage}
                            alt={user?.name}
                            className="w-40 h-40 rounded-full border-4 border-indigo-600 object-cover shadow-lg"
                          />
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                            <p className="text-gray-600 text-lg mb-4">{user?.businessName}</p>
                            <div className="flex items-center gap-2 mb-4">
                              {user?.rating && (
                                <>
                                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                  <span className="text-lg font-semibold">{user.rating} ({user.totalReviews} reviews)</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.phone || '-'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900 capitalize">{user?.serviceType || '-'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.yearsOfExperience || '-'} years</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">₹{user?.pricePerHour || '-'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">₹{user?.maxPrice || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{user?.address || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900 min-h-24">{user?.bio || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h3>

                        {/* Profile Picture */}
                        <div className="mb-8">
                          <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                          <div className="flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                              {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <Upload size={48} className="text-gray-400" />
                              )}
                            </div>
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 font-medium flex items-center gap-2">
                              <Upload size={18} />
                              Choose Photo
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            </label>
                            {profileErrors.profileImage && (
                              <p className="text-red-500 text-sm mt-2">{profileErrors.profileImage}</p>
                            )}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={profileFormData.phone}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="+91 XXXXXXXXXX"
                            />
                            {profileErrors.phone && <p className="text-red-500 text-sm mt-1">{profileErrors.phone}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={profileFormData.city}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="Mumbai"
                            />
                            {profileErrors.city && <p className="text-red-500 text-sm mt-1">{profileErrors.city}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <input
                              type="text"
                              name="state"
                              value={profileFormData.state}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="Maharashtra"
                            />
                            {profileErrors.state && <p className="text-red-500 text-sm mt-1">{profileErrors.state}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode *</label>
                            <input
                              type="text"
                              name="zipcode"
                              value={profileFormData.zipcode}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.zipcode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="400001"
                            />
                            {profileErrors.zipcode && <p className="text-red-500 text-sm mt-1">{profileErrors.zipcode}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                            <input
                              type="text"
                              name="businessName"
                              value={profileFormData.businessName}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="Your Business Name"
                            />
                            {profileErrors.businessName && <p className="text-red-500 text-sm mt-1">{profileErrors.businessName}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                            <input
                              type="text"
                              name="serviceType"
                              value={profileFormData.serviceType}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.serviceType ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="Plumbing"
                            />
                            {profileErrors.serviceType && <p className="text-red-500 text-sm mt-1">{profileErrors.serviceType}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                            <input
                              type="number"
                              name="yearsOfExperience"
                              value={profileFormData.yearsOfExperience}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.yearsOfExperience ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="5"
                            />
                            {profileErrors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{profileErrors.yearsOfExperience}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Hour *</label>
                            <input
                              type="number"
                              name="pricePerHour"
                              value={profileFormData.pricePerHour}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.pricePerHour ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="500"
                            />
                            {profileErrors.pricePerHour && <p className="text-red-500 text-sm mt-1">{profileErrors.pricePerHour}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price *</label>
                            <input
                              type="number"
                              name="maxPrice"
                              value={profileFormData.maxPrice}
                              onChange={handleProfileInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.maxPrice ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                              placeholder="1500"
                            />
                            {profileErrors.maxPrice && <p className="text-red-500 text-sm mt-1">{profileErrors.maxPrice}</p>}
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                          <textarea
                            name="address"
                            value={profileFormData.address}
                            onChange={handleProfileInputChange}
                            rows="3"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            placeholder="Complete address"
                          />
                          {profileErrors.address && <p className="text-red-500 text-sm mt-1">{profileErrors.address}</p>}
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Minimum 10 characters) *</label>
                          <textarea
                            name="bio"
                            value={profileFormData.bio}
                            onChange={handleProfileInputChange}
                            rows="4"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${profileErrors.bio ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                            placeholder="Tell us about yourself and your services"
                          />
                          {profileErrors.bio && <p className="text-red-500 text-sm mt-1">{profileErrors.bio}</p>}
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={handleSaveProfile}
                            disabled={profileLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-60"
                          >
                            <Save size={20} />
                            {profileLoading ? 'Saving...' : 'Save Profile'}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingProfile(false);
                              setProfileErrors({});
                            }}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}