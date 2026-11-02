import { useState } from "react";
import { AuthContext } from "./authContext.js";
import { apiRequest } from "../api.js";

const STORAGE_KEY = "campuscart_user";

function loadStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed.token === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  const saveUser = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // storage unavailable: the user stays logged in until the page closes
    }
  };

  const login = async (email, password) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveUser(data);
  };

  const register = async (name, email, password) => {
    await apiRequest("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    // the register route returns no token, so log in right after
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing to clean up
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}