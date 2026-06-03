import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { queueToast } from "../utils/toast";

const AuthContext = createContext(null);

// Tiny JWT payload decoder (no verification — server does that)
const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role,
          status: payload.status,
          name: payload.name,
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Regular email/password login — returns user object on success, throws on failure
  const login = async (email, password, role) => {
    const { data } = await api.post("/auth/login", { email, password, role });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Regular signup — returns success data
  const signup = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);
    return data;
  };

  const logout = () => {
    queueToast({ title: "Signed out successfully.", color: "primary" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
