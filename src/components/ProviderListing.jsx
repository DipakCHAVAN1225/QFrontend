
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, ChevronRight, Search, Filter } from 'lucide-react';
const API= import.meta.env.VITE_API_URL;

export default function ProviderListing({ onSelectProvider, onBack }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API}/providers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      
      const data = await response.json();
      
      if (data.success && data.providers) {
        setProviders(data.providers);
      } else {
        setProviders([]);
        setError('No providers found');
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError(err.message || 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterService === 'all' || provider.service === filterService;
    return matchesSearch && matchesFilter;
  });

  const uniqueServices = ['all', ...new Set(providers.map(p => p.service))];
  const isProvider = userRole === 'provider';

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ← Back
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Service Providers</h1>
            <p className="text-sm text-gray-600">{filteredProviders.length} providers available</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isProvider && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-900">You are a Service Provider</p>
              <p className="text-blue-700 text-sm">Service providers cannot book other providers. Please login as a customer to book services.</p>
            </div>
          </div>
        )}

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search providers by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {uniqueServices.map(service => (
                <option key={service} value={service}>
                  {service === 'all' ? 'All Services' : service}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && providers.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchProviders}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <div
                key={provider.id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden ${
                  !isProvider ? 'hover:shadow-lg transition cursor-pointer' : 'opacity-75'
                }`}
                onClick={() => !isProvider && onSelectProvider(provider)}
              >
                

                <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 flex justify-center items-center">
                  <img
                    src={
                      provider.dp
                        ? `{provider.dp}`
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name}`
                    }
                    alt={provider.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name}`;
                    }}
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm">{provider.service}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {provider.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-600">({provider.reviews} reviews)</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                      <span className="truncate">{provider.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase size={16} className="text-blue-600 flex-shrink-0" />
                      <span>{provider.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">₹{provider.price}</span>
                      <span className="text-xs text-gray-600">/ service</span>
                    </div>
                  </div>

                  {provider.services && provider.services.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {provider.services.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{provider.services.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isProvider) {
                        onSelectProvider(provider);
                      }
                    }}
                    disabled={isProvider}
                    className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                      isProvider
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isProvider ? 'Providers Cannot Book' : 'Book Now'}
                    {!isProvider && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {providers.length === 0 ? 'No providers available' : 'No providers match your search'}
            </p>
            {providers.length === 0 && (
              <button
                onClick={fetchProviders}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Refresh
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}