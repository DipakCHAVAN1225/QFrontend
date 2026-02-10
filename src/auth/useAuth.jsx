import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

//  OPTIONAL: JWT decode helper
export function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    return JSON.parse(atob(base64Url));
  } catch {
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

