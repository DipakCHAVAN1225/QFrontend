

// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../auth/api";
import { useAuth } from "../auth/useAuth";
// import { useAuth } from '../auth/useAuth';  // Correct path
const API = import.meta.env.VITE_API_URL; // Base URL for API requests

export default function Login() {
  const [tab, setTab] = useState("user"); // "user" or "provider"

  // user fields
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRemember, setUserRemember] = useState(false);

  // provider fields
  const [provBusiness, setProvBusiness] = useState("");
  const [provServiceType, setProvServiceType] = useState("");
  const [provEmail, setProvEmail] = useState("");
  const [provPassword, setProvPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const auth = useAuth();

  const validateEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

  async function handleUserSubmit(e) {
    e.preventDefault();
    setApiError("");
    const err = {};
    if (!userEmail.trim()) err.userEmail = "Email required";
    else if (!validateEmail(userEmail)) err.userEmail = "Invalid email";
    if (!userPassword) err.userPassword = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const data = await apiFetch(`${API}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          role: "user",
          email: userEmail,
          password: userPassword
        })
      });

      auth.login({ token: data.token, user: data.user, remember: userRemember });
      navigate("/userdashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSubmit(e) {
    e.preventDefault();
    setApiError("");
    const err = {};
    if (!provBusiness.trim()) err.provBusiness = "Business name required";
    if (!provServiceType) err.provServiceType = "Choose a service";
    if (!provEmail.trim()) err.provEmail = "Email required";
    else if (!validateEmail(provEmail)) err.provEmail = "Invalid email";
    if (!provPassword) err.provPassword = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      const data = await apiFetch(`${API}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          role: "provider",
          businessName: provBusiness,
          serviceType: provServiceType,
          email: provEmail,
          password: provPassword
        })
      });

      auth.login({ token: data.token, user: data.user, remember: true });
      navigate("/providerdashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Brand / Illustration */}
        <div className="hidden lg:flex flex-col justify-center gap-6 p-10 bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
          <div className="transform -translate-y-2">
            <h1 className="text-3xl font-extrabold">Quick<span className="text-yellow-300">Task</span></h1>
            <p className="mt-2 text-indigo-100/90 max-w-sm">
              Fast, reliable local services — find trusted service providers or accept bookings for your business.
            </p>
          </div>

          <div className="mt-4">
            {/* simple decorative graphic */}
            <div className="w-44 h-44 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-24 h-24 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </div>
          </div>

          <p className="text-sm text-indigo-100/80 max-w-xs">
            New here? Use the Register link to create a user or provider account.
          </p>
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-10">
          <div className="max-w-md mx-auto animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
              <p className="text-sm text-gray-500 mt-1">Sign in as a User or Service Provider</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => { setTab("user"); setErrors({}); setApiError(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "user" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-pressed={tab === "user"}
              >
                User
              </button>

              <button
                onClick={() => { setTab("provider"); setErrors({}); setApiError(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "provider" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-pressed={tab === "provider"}
              >
                Provider
              </button>
            </div>

            {apiError && (
              <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
                {apiError}
              </div>
            )}

            {tab === "user" ? (
              <form onSubmit={handleUserSubmit} className="space-y-4" aria-label="User login">
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.userEmail && <p className="text-xs text-red-600 mt-1">{errors.userEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  {errors.userPassword && <p className="text-xs text-red-600 mt-1">{errors.userPassword}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={userRemember}
                      onChange={(e) => setUserRemember(e.target.checked)}
                      className="mr-2"
                    />
                    Remember me
                  </label>
                  <a className="text-sm text-blue-600 hover:underline" href="#forgot">Forgot?</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleProviderSubmit} className="space-y-4" aria-label="Provider login">
                <div>
                  <label className="block text-sm text-gray-600">Business / Provider Name</label>
                  <input
                    type="text"
                    value={provBusiness}
                    onChange={(e) => setProvBusiness(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Joe's Plumbing"
                    autoComplete="organization"
                  />
                  {errors.provBusiness && <p className="text-xs text-red-600 mt-1">{errors.provBusiness}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Service Type</label>
                  <select
                    value={provServiceType}
                    onChange={(e) => setProvServiceType(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select a service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrician">Electrician</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.provServiceType && <p className="text-xs text-red-600 mt-1">{errors.provServiceType}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={provEmail}
                    onChange={(e) => setProvEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="provider@example.com"
                    autoComplete="email"
                  />
                  {errors.provEmail && <p className="text-xs text-red-600 mt-1">{errors.provEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    value={provPassword}
                    onChange={(e) => setProvPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="At least 6 characters"
                    autoComplete="current-password"
                  />
                  {errors.provPassword && <p className="text-xs text-red-600 mt-1">{errors.provPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In as Provider"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <a className="text-blue-600 hover:underline" href="/register">Register</a>
            </div>
          </div>
        </div>
      </div>
      {/* small fade-in animation (tailwind arbitrary class) */}
      <style>{`
        .animate-fadeIn { animation: fadeIn .28s ease-out both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
