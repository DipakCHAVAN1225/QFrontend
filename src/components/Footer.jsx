

import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 text-gray-800 relative border-t border-slate-200">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mx-6 my-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-600">Get updates on new services and exclusive offers</p>
          </div>
          <div className="flex-1 md:flex-none md:w-80">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-slate-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                required
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105 shadow-md"
              >
                {subscribed ? '✓ Sent!' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">Q</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">QuickTask</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Reliable home services at the tap of a button. Connect with verified professionals instantly.
            </p>
            <div className="flex gap-3 mt-6">
              <button className="p-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition transform hover:scale-110">
                <Facebook size={18} />
              </button>
              <button className="p-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition transform hover:scale-110">
                <Twitter size={18} />
              </button>
              <button className="p-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition transform hover:scale-110">
                <Linkedin size={18} />
              </button>
              <button className="p-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition transform hover:scale-110">
                <Instagram size={18} />
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
              Company
              <div className="h-0.5 flex-1 bg-blue-600"></div>
            </h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <button className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2 group font-medium">
                    <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
              Support
              <div className="h-0.5 flex-1 bg-blue-600"></div>
            </h4>
            <ul className="space-y-3">
              {['Help Center', 'Safety', 'Cancellation', 'Contact Us'].map((item) => (
                <li key={item}>
                  <button className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2 group font-medium">
                    <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
              Legal
              <div className="h-0.5 flex-1 bg-blue-600"></div>
            </h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <button className="text-gray-600 hover:text-blue-600 transition flex items-center gap-2 group font-medium">
                    <span className="opacity-0 group-hover:opacity-100 transition">→</span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg text-gray-900 mb-6 flex items-center gap-2">
              Reach Out
              <div className="h-0.5 flex-1 bg-blue-600"></div>
            </h4>
            <div className="space-y-4">
              <button className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition group w-full">
                <Mail size={18} className="mt-1 group-hover:text-blue-600 transition flex-shrink-0" />
                <span className="text-sm">support@quicktask.com</span>
              </button>
              <button className="flex items-start gap-3 text-gray-600 hover:text-blue-600 transition group w-full">
                <Phone size={18} className="mt-1 group-hover:text-blue-600 transition flex-shrink-0" />
                <span className="text-sm">+91 8890 000 000</span>
              </button>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-blue-600" />
                <span className="text-sm">Pune, Maharashtra<br />India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-600 text-sm">
            © {currentYear} <span className="font-semibold text-gray-900">QuickTask</span> — All rights reserved
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-blue-600 text-sm transition font-medium">Privacy</button>
            <span className="text-gray-300">•</span>
            <button className="text-gray-600 hover:text-blue-600 text-sm transition font-medium">Terms</button>
            <span className="text-gray-300">•</span>
            <button className="text-gray-600 hover:text-blue-600 text-sm transition font-medium">Cookies</button>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="p-2 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition transform hover:scale-110 shadow-md"
            title="Back to top"
          >
            <ArrowRight size={18} className={`transition-transform ${isHovered ? '-rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </footer>
  );
}