
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Star, MessageCircle, RotateCcw, AlertCircle, Loader } from 'lucide-react';

export default function MyBookings() {
  const [filter, setFilter] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBookings();
    const interval = setInterval(fetchUserBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        setLoading(false);
        return;
      }

      // Try the new bookings endpoint first
      let response = await fetch('http://localhost:3000/api/bookings/user', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // If that fails, try fetching from payments endpoint (where bookings are stored)
      if (response.status === 404) {
        console.log('📦 Bookings endpoint not found, fetching from payments...');
        response = await fetch('http://localhost:3000/api/payment/bookings', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.status === 401) {
        setError(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        console.log('  Failed to fetch, status:', response.status);
        setError(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('  Bookings data:', data);
      
      // Handle different response formats
      const bookingsArray = data.bookings || data.data || [];
      setBookings(bookingsArray);
      setError(null);
    } catch (err) {
      console.error('  Error:', err);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => (b.bookingStatus || b.status) === filter);

  const getStatusColor = (status) => {
    const bookingStatus = status || 'pending';
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'accepted': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'rejected': 'bg-gray-100 text-gray-800'
    };
    return colors[bookingStatus] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const bookingStatus = status || 'pending';
    const labels = {
      'pending': 'Pending',
      'accepted': 'Confirmed',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'rejected': 'Rejected'
    };
    return labels[bookingStatus] || bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        fetchUserBookings();
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error cancelling booking');
    }
  };

  const handleSubmitRating = async (bookingId, rating, review) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/rate`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review })
      });

      if (response.ok) {
        fetchUserBookings();
        alert('Rating submitted successfully!');
      } else {
        alert('Failed to submit rating');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error submitting rating');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">View and manage your service bookings</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">
                {bookings.length === 0 ? 'No bookings yet' : `No ${filter} bookings`}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {bookings.length === 0 ? 'Book a service to get started' : 'Try a different filter'}
              </p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div
                key={booking._id || booking.bookingId}
                className="bg-white rounded-lg border border-slate-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div
                  onClick={() => setExpandedBooking(expandedBooking === (booking._id || booking.bookingId) ? null : (booking._id || booking.bookingId))}
                  className="p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-800">
                          {(booking.service || booking.serviceType || 'S')?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {booking.service || booking.serviceType || 'Service'}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {booking.providerName || 'Service Provider'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={18} />
                          <span>{booking.date || new Date(booking.scheduledTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={18} />
                          <span>{booking.time || new Date(booking.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                          <MapPin size={18} />
                          <span>{booking.location || 'Location TBD'}</span>
                        </div>
                      </div>

                      {booking.paymentStatus && (
                        <div className="mt-3 flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Payment:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              booking.paymentStatus === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.paymentStatus?.charAt(0).toUpperCase() + booking.paymentStatus?.slice(1)}
                            </span>
                          </div>
                          {booking.cardLast4 && (
                            <span className="text-slate-600">•••• {booking.cardLast4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.bookingStatus || booking.status)}`}>
                        {getStatusLabel(booking.bookingStatus || booking.status)}
                      </div>
                      <div className="text-2xl font-bold text-slate-900">₹{booking.totalAmount || booking.amount}</div>
                    </div>
                  </div>
                </div>

                {expandedBooking === (booking._id || booking.bookingId) && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
                    {booking.bookingStatus === 'completed' && !booking.rating && (
                      <RatingForm 
                        bookingId={booking._id || booking.bookingId}
                        onSubmit={handleSubmitRating}
                      />
                    )}

                    {booking.rating && (
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <h4 className="font-semibold text-slate-900 mb-2">Your Rating</h4>
                        <div className="flex items-center gap-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < Math.floor(booking.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                            />
                          ))}
                          <span className="text-slate-700 font-medium ml-2">{booking.rating}/5</span>
                        </div>
                        {booking.review && <p className="text-slate-600 italic">"{booking.review}"</p>}
                      </div>
                    )}

                    {booking.description && (
                      <div className="bg-white rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700">
                          <strong>Description:</strong> {booking.description}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition text-slate-700 font-medium">
                        <MessageCircle size={18} />
                        Contact Provider
                      </button>
                      {(booking.bookingStatus === 'pending' || booking.status === 'pending' || booking.bookingStatus === 'confirmed' || booking.status === 'confirmed') && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id || booking.bookingId)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          <RotateCcw size={18} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-white rounded-lg p-6 border border-slate-200 text-center hover:shadow-md transition">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {bookings.filter(b => (b.bookingStatus || b.status) === 'completed').length}
              </div>
              <p className="text-slate-600 font-medium">Completed</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 text-center hover:shadow-md transition">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {bookings.filter(b => (b.bookingStatus || b.status) === 'confirmed' || (b.bookingStatus || b.status) === 'pending').length}
              </div>
              <p className="text-slate-600 font-medium">Pending</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 text-center hover:shadow-md transition">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {bookings.filter(b => b.rating).length}
              </div>
              <p className="text-slate-600 font-medium">Rated</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingForm({ bookingId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(bookingId, rating, review);
    setRating(0);
    setReview('');
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <h4 className="font-semibold text-slate-900 mb-3">Rate this service</h4>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={
                (hoveredRating || rating) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300'
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your feedback (optional)"
        className="w-full p-2 border border-slate-200 rounded-lg mb-3 text-sm focus:outline-none focus:border-blue-400"
        rows="3"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Submit Rating
      </button>
    </div>
  );
}