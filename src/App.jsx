

// frontend/src/App.jsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {AuthProvider} from "./auth/AuthProvider";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
// import Categories from "./components/Categories";
import ServicesGrid from "./components/ServicesGrid";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import ProviderListing from "./components/ProviderListing";
import ProviderBooking from "./components/ProviderBooking";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProviderDashboard from "./pages/ProviderDashboard";
import UserDashboard from "./pages/UserDash";
import Mybookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";

// SVG Icons
export const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="icon">
    <path d="M12 20v-2a4 4 0 0 0-3-3.87" />
    <circle cx="10" cy="6" r="4" />
  </svg>
);

export const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

export const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" stroke="none">
    <path d="M12 17.3l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.76L5.82 21z" />
  </svg>
);

export const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.18l-1.27 1.27a16 16 0 0 0 7.27 7.27l1.27-1.27a2 2 0 0 1 2.18-.45c.74.35 1.53.6 2.34.72A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Home Page Component
function HomePage({ selectedProvider, onSelectProvider, onBackFromBooking }) {
  // If a provider is selected, show the booking page
  if (selectedProvider) {
    return (
      <ProviderBooking
        providerId={selectedProvider.id}
        onBack={onBackFromBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="pt-20">
        <Hero />
        <ImageSlider />
        {/* <Categories /> */}
        <ServicesGrid />
        <ProviderListing 
          onSelectProvider={onSelectProvider}
        />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

// App Routes Component
function AppRoutes() {
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
  };

  const handleBackFromBooking = () => {
    setSelectedProvider(null);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <HomePage 
            selectedProvider={selectedProvider}
            onSelectProvider={handleSelectProvider}
            onBackFromBooking={handleBackFromBooking}
          />
        } 
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Providers Listing and Booking Route */}
      <Route
        path="/providers"
        element={
          selectedProvider ? (
            <ProviderBooking
              providerId={selectedProvider.id}
              onBack={handleBackFromBooking}
            />
          ) : (
            <ProviderListing onSelectProvider={handleSelectProvider} />
          )
        }
      />
      
      {/* Other Public Routes */}
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/HowItWorks" element={<HowItWorks />} />
      <Route path="/services" element={<ServicesGrid />} />

      {/* Protected User Routes */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/userdashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute requiredRole="user">
            <Mybookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-profile"
        element={
          <ProtectedRoute requiredRole="user">
            <MyProfile />
          </ProtectedRoute>
        }
      />

      {/* Protected Provider Routes */}
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute requiredRole="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/providerdashboard"
        element={
          <ProtectedRoute requiredRole="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      {/*   Navbar is INSIDE AuthProvider so it can use useAuth() */}
      <Navbar />
      <main className="min-h-screen bg-[#EDEDED] text-gray-800">
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}