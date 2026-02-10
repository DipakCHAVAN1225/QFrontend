
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  parseJwt } from "./useAuth";
import { AuthContext } from "./AuthContext.jsx";


export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [authReady] = useState(true);
  const navigate = useNavigate();

  const payload = token ? parseJwt(token) : null;
  const role = (user && user.role) || (payload && payload.role) || null;
  const isAuthenticated = !!token;

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "token") setToken(e.newValue);
      if (e.key === "user") setUser(e.newValue ? JSON.parse(e.newValue) : null);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function login({ token: newToken, user: newUser, remember }) {
    if (!newToken) return;
    localStorage.setItem("token", newToken);
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
    if (remember) localStorage.setItem("remember", "1");
    setToken(newToken);
    setUser(newUser || null);
  }

  function logout(redirectTo = "/login") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("remember");
    setToken(null);
    setUser(null);
    navigate(redirectTo, { replace: true });
  }

  const value = { token, user, role, isAuthenticated, authReady, login, logout, payload };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
