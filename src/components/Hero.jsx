

import { IconPhone } from '../App'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function Hero(){
  return (
    <section className="max-w-screen-2xl mx-auto px-6 py-8 md:py-12 min-h-screen md:min-h-[90vh] flex items-center md:pt-6">
      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-blue-600">Trusted by 50k+ households</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Home services made <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">simple</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Get verified professionals for cleaning, AC repair, plumbing, electrical work and more. Transparent pricing, quick booking, and professional service guaranteed.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <a href="#services">  Browse Services</a>
            </button>
            <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-900 hover:text-blue-600 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300">
              <div className="flex items-center gap-2">
                <IconPhone className="w-5 h-6" />
                Call Support
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <p className="text-sm text-gray-600 mt-1">Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">2-4hr</div>
              <p className="text-sm text-gray-600 mt-1">Service Time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <p className="text-sm text-gray-600 mt-1">Verified</p>
            </div>
          </div>
        </div>

        {/* Right Side - Image Card */}
        <div className="hidden md:block">
          <div className="relative group">
            {/* Floating Background Element */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
              {/* Image */}
              <div className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                <img 
                  src="/Static/Ac_Installation_1.jpg" 
                  alt="AC Installation Service" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Card Info - Bottom */}
              <div className="p-6 space-y-3">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Trending
                </div>

                {/* Service Info */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">AC Installation</h3>
                  <p className="text-gray-600 text-sm">Professional installation with warranty</p>
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Starting at</p>
                    <p className="text-2xl font-bold text-gray-900">₹1,299</p>
                  </div>
                  {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors duration-300">
                    Book Now
                  </button> */}
                  <button>
                  <Link to="/Providers" className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg shadow-indigo-500/30 transition duration-300 font-semibold text-sm">
                                <Calendar size={18} />
                                Book Now
                  </Link>
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Card - Top Right */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 max-w-xs hidden lg:block group-hover:shadow-2xl transition-shadow duration-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Verified Expert</p>
                  <p className="text-xs text-gray-600">8+ years experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}