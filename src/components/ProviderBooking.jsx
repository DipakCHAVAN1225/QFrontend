

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/useAuth';

export default function ProviderBooking({ providerId, onBack }) {
  const auth = useAuth();
  const [providerData, setProviderData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [error, setError] = useState('');
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  // Debug auth on component mount
  useEffect(() => {
    console.log(' ProviderBooking mounted. Auth state:', {
      hasToken: !!auth?.token,
      hasUser: !!auth?.user,
      token: auth?.token?.substring(0, 20) + '...',
      user: auth?.user
    });
  }, [auth]);

  // fetching provider 
  useEffect(() => {
    if (!providerId) {
      setError('Provider ID is required');
      setLoading(false);
      return;
    }
    fetchProviderData();
  }, [providerId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:3000/api/providers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch provider data');
      }
      
      const data = await response.json();
      const provider = data.providers?.find(p => p.id === providerId);
      
      if (!provider) {
        throw new Error('Provider not found');
      }
      
      const completeProvider = {
        ...provider,
        coverImage: provider.coverImage || `https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop`,
        description: provider.description || provider.bio || `Professional ${provider.service} expert with ${provider.experience} of experience.`,
        aboutMe: provider.aboutMe || provider.bio || `I am a certified ${provider.service} provider with extensive experience in residential and commercial work.`,
        responseTime: provider.responseTime || '15 mins',
        completionRate: provider.completionRate || '95%',
        policies: provider.policies || {
          cancellation: 'Free cancellation up to 2 hours before appointment',
          rescheduling: 'You can reschedule anytime',
          guarantee: '100% satisfaction guarantee'
        }
      };
      
      setProviderData(completeProvider);
    } catch (err) {
      console.error('Error fetching provider:', err);
      setError(`Failed to load provider: ${err.message}`);
      setProviderData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimes = async (date) => {
    try {
      const response = await fetch(`http://localhost:3000/api/providers/${providerId}/available-times?date=${date}`);
      
      if (response.ok) {
        const data = await response.json();
        setAvailableTimes(data.availableTimes || []);
      } else {
        setAvailableTimes(['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']);
      }
    } catch (err) {
      console.error('Error fetching available times:', err);
      setAvailableTimes(['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']);
    }
  };

  const handleBooking = async () => {
    console.log('Auth object:', auth);
    console.log('Auth token:', auth?.token);
    
    if (!auth?.token) {
      setError('Please login first');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    const price = providerData?.price ? parseFloat(providerData.price) : 500;
    const totalAmount = price * quantity;
    
    const details = {
      providerId: providerData.id,
      providerName: providerData.name,
      service: providerData.service,
      date: selectedDate,
      time: selectedTime,
      quantity: quantity,
      totalAmount: totalAmount
    };

    setBookingDetails(details);
    setShowPayment(true);
    setError('');
  };


const handlePayment = async (e) => {
  e.preventDefault();
  
  if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
    setError('Please fill in all card details');
    return;
  }

  try {
    setPaymentLoading(true);
    setError('');

    // Debug auth state
    console.log('=== AUTH DEBUG ===');
    console.log('Auth object:', auth);
    console.log('Token:', auth?.token);
    console.log('User:', auth?.user);
    console.log('isLoggedIn:', auth?.isLoggedIn?.());

    // Get token and user from auth context
    const authToken = auth?.token;
    const userId = auth?.user?.id;

    // Validate authentication
    if (!authToken) {
      console.error('  No token in auth context');
      throw new Error('Not authenticated. Please log in again.');
    }

    if (!userId) {
      console.error(' No user ID in auth context');
      throw new Error('User information missing. Please log in again.');
    }

    if (!selectedDate || !selectedTime) {
      throw new Error('Please select date and time');
    }

    // Validate provider data
    if (!providerData?.id) {
      throw new Error('Provider information missing');
    }

    // Combine date and time into ISO format for scheduledTime
    const [year, month, day] = selectedDate.split('-');
    const [timePart] = selectedTime.split(' '); // Extract time part (HH:MM)
    const [hours, minutes] = timePart.split(':');
    const scheduledDateTime = new Date(year, parseInt(month) - 1, day, hours, minutes);

    // Build booking payload - with correct field names for backend
    const bookingPayload = {
      providerId: providerData.id,
      serviceType: providerData.service || 'Service',
      scheduledTime: scheduledDateTime.toISOString(),
      location: 'Address to be confirmed', // You can add address field if needed
      description: `Booking for ${quantity} unit(s) of ${providerData.service}`,
      amount: providerData.price * quantity
    };

    console.log('=== SENDING BOOKING ===');
    console.log('Payload:', bookingPayload);
    console.log('Auth Token:', authToken.substring(0, 20) + '...');
    console.log('User ID:', userId);

    // Send booking to backend - token is in Authorization header
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingPayload)
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Backend Response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `Booking failed with status ${response.status}`);
    }

    console.log('  Booking successful!');
    setBookingId(responseData._id || responseData.bookingId || `BK${Date.now().toString().slice(-8)}`);
    
    // Clear payment form and show confirmation
    setShowPayment(false);
    setCardDetails({ number: '', expiry: '', cvv: '' });
    setShowConfirmation(true);

    // Auto redirect after 4 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      onBack?.();
    }, 4000);
  } catch (err) {
    console.error(' Payment error:', err);
    setError(err.message || 'Payment failed. Please try again.');
    setPaymentLoading(false);
  }
};


const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateString = (day) => {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  const monthName = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const calendarDays = generateCalendarDays();

  // LOADING STATE
  if (loading && !providerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (!providerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold mb-4">{error || 'Failed to load provider'}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // PAYMENT MODAL
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <button
            onClick={() => setShowPayment(false)}
            className="mb-6 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
          <p className="text-gray-600 mb-6">Complete your booking by adding payment information</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Provider</span>
                <span className="font-semibold text-gray-900">{bookingDetails?.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-semibold text-gray-900">{new Date(bookingDetails?.date).toLocaleDateString()} {bookingDetails?.time}</span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">₹{bookingDetails?.totalAmount}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => {
                  let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
                  let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                  setCardDetails({ ...cardDetails, number: formatted });
                }}
                maxLength="19"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setCardDetails({ ...cardDetails, expiry: value });
                  }}
                  maxLength="5"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength="4"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={paymentLoading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition mt-6 ${
                paymentLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {paymentLoading ? 'Processing...' : `Pay ₹${bookingDetails?.totalAmount}`}
            </button>

            <p className="text-xs text-gray-600 text-center mt-4">
              💳 Dummy payment for demo purposes only
            </p>
          </form>
        </div>
      </div>
    );
  }

  // CONFIRMATION SCREEN
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-scale-in { animation: scaleIn 0.4s ease-out; }
          .animate-slide-down { animation: slideDown 0.5s ease-out; }
        `}</style>
        
        <div className="w-full max-w-md space-y-4 animate-scale-in">
          <div className="text-center mb-6">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-25 animate-pulse"></div>
              <div className="relative bg-green-500 rounded-full p-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-green-100 mt-1">Your appointment is secured</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <img
                  src={providerData.dp}
                  alt={providerData.name}
                  className="w-16 h-16 rounded-full border-4 border-green-100"
                />
                <div>
                  <p className="text-sm text-gray-600">Service Provider</p>
                  <h3 className="text-xl font-bold text-gray-900">{providerData.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm capitalize">{providerData.service}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">📅 Date & Time</p>
                  <p className="font-bold text-gray-900">{new Date(bookingDetails?.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-semibold text-blue-600">{bookingDetails?.time}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">📍 Location</p>
                  <p className="font-semibold text-gray-900">{providerData.location}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Number of Services</span>
                    <span className="font-semibold text-gray-900">{bookingDetails?.quantity}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per service</span>
                    <span className="font-semibold text-gray-900">₹{providerData.price}</span>
                  </div>
                  <div className="border-t border-green-200 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="text-2xl font-bold text-green-600">₹{bookingDetails?.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Booking Reference</p>
                <p className="font-bold text-gray-900 text-sm">#{bookingId}</p>
              </div>

              <div className="space-y-2 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📞</span>
                  <span className="text-sm text-gray-700"><strong>Provider will contact you</strong> to confirm details</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  <span className="text-sm text-gray-700"><strong>Confirmation email sent</strong> to your registered email</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                Redirecting to home in 4 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN BOOKING PAGE
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Book Service</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Provider Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
                <img src={providerData.coverImage} alt={providerData.name} className="w-full h-full object-cover opacity-70" />
              </div>

              <div className="p-8 -mt-16 relative">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={providerData.dp}
                    alt={providerData.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex-shrink-0"
                  />
                  
                  <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-gray-900">{providerData.name}</h2>
                    <p className="text-lg text-blue-600 font-semibold mt-1 capitalize">{providerData.service}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.floor(providerData.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"} />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900">{providerData.rating}</span>
                        <span className="text-gray-600">({providerData.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-bold text-gray-900">{providerData.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Response Time</p>
                        <p className="font-bold text-gray-900">{providerData.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="font-bold text-gray-900">{providerData.completionRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">About</h3>
              <p className="text-gray-700 leading-relaxed">{providerData.description}</p>
              <p className="text-gray-600 italic">{providerData.aboutMe}</p>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Services Offered</h3>
              <div className="grid grid-cols-2 gap-3">
                {providerData.services?.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-lg">✓</span>
                    <span className="text-gray-900 font-medium capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Contact & Location</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="text-gray-700">{providerData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-blue-600" />
                  <button className="text-blue-600 font-semibold hover:underline">Call Provider</button>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-blue-600" />
                  <button className="text-blue-600 font-semibold hover:underline">Send Message</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 space-y-6">
              
              {/* Price Section */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-2">Price per service</p>
                <p className="text-3xl font-bold text-gray-900">₹{providerData.price}</p>
                <p className="text-xs text-gray-500 mt-1">up to ₹{providerData.maxPrice}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-3 relative">
                <label className="block font-semibold text-gray-900">Select Date</label>
                
                <div className="relative">
                  <button
                    onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-left font-medium text-gray-900 hover:border-blue-300 transition flex items-center justify-between bg-white"
                  >
                    <span>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Choose a date'}</span>
                    <ChevronRight size={20} className={`transition ${showCalendarDropdown ? 'rotate-90' : ''}`} />
                  </button>

                  {showCalendarDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg z-50 w-full">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={handlePrevMonth}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <h4 className="text-sm font-semibold text-gray-900">{monthName}</h4>
                        <button
                          onClick={handleNextMonth}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                          <div key={`day-${idx}`} className="text-center text-xs font-bold text-gray-600 py-1">
                            {day.substring(0, 1)}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                          const disabled = isDateDisabled(day);
                          const dateStr = day ? getDateString(day) : '';
                          const isSelected = dateStr === selectedDate;

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!disabled) {
                                  setSelectedDate(dateStr);
                                  setShowCalendarDropdown(false);
                                }
                              }}
                              disabled={disabled}
                              className={`w-full py-1 rounded text-xs font-medium transition ${
                                !day
                                  ? 'invisible'
                                  : disabled
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-blue-100'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-3">
                  <label className="block font-semibold text-gray-900">Select Time</label>
                  {availableTimes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-3 rounded-lg font-medium transition text-sm ${
                            selectedTime === time
                              ? 'bg-blue-600 text-white'
                              : 'border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No available times for this date</p>
                  )}
                </div>
              )}

              {/* Quantity Selection */}
              {selectedTime && (
                <div className="space-y-3">
                  <label className="block font-semibold text-gray-900">Number of Services</label>
                  <div className="flex items-center gap-4 border-2 border-gray-300 rounded-lg p-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-xl text-gray-600 hover:text-gray-900 font-bold"
                    >
                      −
                    </button>
                    <span className="flex-grow text-center font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-xl text-gray-600 hover:text-gray-900 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {selectedTime && (
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{providerData.price * quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-gray-900">₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₹{providerData.price * quantity}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                  selectedDate && selectedTime
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Proceed to Payment
              </button>

              {/* Policies */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-xs text-gray-700">
                <p><strong>✓ {providerData.policies?.cancellation}</strong></p>
                <p><strong>✓ {providerData.policies?.rescheduling}</strong></p>
                <p><strong>✓ {providerData.policies?.guarantee}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

