
// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../auth/api";
import { useAuth } from "../auth/useAuth";
const API = import.meta.env.VITE_API_URL;
export default function Signup() {
  const [tab, setTab] = useState("user"); // "user" or "provider"

  // user fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // provider fields
  const [provBusiness, setProvBusiness] = useState("");
  const [provServiceType, setProvServiceType] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPassword, setProvPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

  async function handleUserRegister(e) {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");
    const err = {};
    
    if (!userName.trim()) err.userName = "Name required";
    if (!userEmail.trim()) err.userEmail = "Email required";
    else if (!validateEmail(userEmail)) err.userEmail = "Invalid email";
    if (!userPassword || userPassword.length < 6) err.userPassword = "Password min 6 chars";
    
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      console.log("  User registration with:", { name: userName, email: userEmail, role: "user" });
      
      const data = await apiFetch(`${API}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          role: "user",
          name: userName,
          email: userEmail,
          password: userPassword
        })
      });

      console.log("  Registration response:", data);

      //   FIXED: Check the response has token and user
      if (data?.token && data?.user) {
        console.log("  Calling login with:", { token: data.token, user: data.user });
        
        login({
          token: data.token,
          user: data.user
        });
        
        setSuccessMsg("Account created successfully. Redirecting...");
        // Redirect to user dashboard
        setTimeout(() => navigate("/userdashboard"), 900);
      } else {
        setApiError("Registration failed - invalid response from server");
        setLoading(false);
      }
    } catch (err) {
      console.error("  Registration error:", err);
      setApiError(err.message || "Registration failed");
      setLoading(false);
    }
  }

  async function handleProviderRegister(e) {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");
    const err = {};
    
    if (!provBusiness.trim()) err.provBusiness = "Business name required";
    if (!provServiceType) err.provServiceType = "Choose a service";
    if (!provEmail.trim()) err.provEmail = "Email required";
    else if (!validateEmail(provEmail)) err.provEmail = "Invalid email";
    if (!provPassword || provPassword.length < 6) err.provPassword = "Password min 6 chars";
    
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      console.log("  Provider registration with:", { businessName: provBusiness, serviceType: provServiceType, email: provEmail, role: "provider" });
      
      const data = await apiFetch(`${API}/auth/register`, {
        method: "POST",
        body:{
          role: "provider",
          name: provBusiness,
          businessName: provBusiness,
          serviceType: provServiceType,
          email: provEmail,
          password: provPassword
        }
      });

      console.log("  Registration response:", data);

      //   FIXED: Check the response has token and user
      if (data?.token && data?.user) {
        console.log("  Calling login with:", { token: data.token, user: data.user });
        
        login({
          token: data.token,
          user: data.user
        });
        
        setSuccessMsg("Provider account created. Redirecting to dashboard...");
        // Redirect to provider dashboard
        setTimeout(() => navigate("/providerdashboard"), 900);
      } else {
        setApiError("Registration failed - invalid response from server");
        setLoading(false);
      }
    } catch (err) {
      console.error("  Registration error:", err);
      setApiError(err.message || "Registration failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-pink-300 via-white to-violet-500 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Brand / Illustration */}
        <div className="hidden lg:flex flex-col justify-center gap-6 p-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
          <div className="transform -translate-y-2">
            <h1 className="text-3xl font-extrabold">Quick<span className="text-yellow-300">Task</span></h1>
            <p className="mt-2 text-indigo-100/90 max-w-sm">
              Join QuickTask — find local jobs or grow your service business. Create an account and start today.
            </p>
          </div>
          <div className="mt-4">
            <div className="w-44 h-44 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-24 h-24 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
              </svg>
            </div>
          </div>

          <p className="text-sm text-indigo-100/80 max-w-xs">
            Already have an account? Use Sign In to access your dashboard.
          </p>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-10">
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Create account</h2>
              <p className="text-sm text-gray-500 mt-1">Register as a User or Service Provider</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => { 
                  setTab("user"); 
                  setErrors({}); 
                  setApiError(""); 
                  setSuccessMsg(""); 
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "user" 
                    ? "bg-blue-600 text-white shadow" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-pressed={tab === "user"}
              >
                User
              </button>

              <button
                onClick={() => { 
                  setTab("provider"); 
                  setErrors({}); 
                  setApiError(""); 
                  setSuccessMsg(""); 
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "provider" 
                    ? "bg-blue-600 text-white shadow" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-pressed={tab === "provider"}
              >
                Provider
              </button>
            </div>

            {/* Error Message */}
            {apiError && (
              <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
                  {apiError}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div role="status" className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
                  {successMsg}
              </div>
            )}

            {/* User Registration Form */}
            {tab === "user" ? (
              <form onSubmit={handleUserRegister} className="space-y-4" aria-label="User register">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {errors.userName && <p className="text-xs text-red-600 mt-1">  {errors.userName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.userEmail && <p className="text-xs text-red-600 mt-1">  {errors.userEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  {errors.userPassword && <p className="text-xs text-red-600 mt-1">  {errors.userPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⏳</span> Creating...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
            ) : (
              /* Provider Registration Form */
              <form onSubmit={handleProviderRegister} className="space-y-4" aria-label="Provider register">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Business / Provider Name</label>
                  <input
                    type="text"
                    value={provBusiness}
                    onChange={(e) => setProvBusiness(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Joe's Plumbing"
                    autoComplete="organization"
                  />
                  {errors.provBusiness && <p className="text-xs text-red-600 mt-1">  {errors.provBusiness}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Service Type</label>
                  <select
                    value={provServiceType}
                    onChange={(e) => setProvServiceType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrician">Electrician</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.provServiceType && <p className="text-xs text-red-600 mt-1">  {errors.provServiceType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="provider@example.com"
                    autoComplete="email"
                  />
                  {errors.provEmail && <p className="text-xs text-red-600 mt-1">  {errors.provEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="password"
                    value={provPassword}
                    onChange={(e) => setProvPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                  {errors.provPassword && <p className="text-xs text-red-600 mt-1">  {errors.provPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⏳</span> Creating...
                    </span>
                  ) : (
                    "Create provider account"
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { 
          animation: fadeIn 0.28s ease-out both; 
        }
        @keyframes fadeIn { 
          from { 
            opacity: 0; 
            transform: translateY(6px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }
      `}</style>
    </div>
  );
}