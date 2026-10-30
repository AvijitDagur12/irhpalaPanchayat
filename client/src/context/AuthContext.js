import React, { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("admin");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [controlOfficer, setControlOfficer] = useState(() => {
    try {
      const stored = localStorage.getItem("control_officer");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Citizen Login
  const loginCitizen = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/login", { email, password });
      const { user: userData, token } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      if (token) localStorage.setItem("citizen_token", token);
      localStorage.setItem("isLoggedIn", "true");

      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Citizen Registration
  const registerCitizen = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post("/api/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Citizen Logout
  const logoutCitizen = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("citizen_token");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  // Update citizen profile in state and localStorage
  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Admin / Official Login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { email, password });
      const { admin: adminData, token } = res.data;

      localStorage.setItem("admin", JSON.stringify(adminData));
      if (token) localStorage.setItem("admin_token", token);
      localStorage.setItem("session_active", "true");

      setAdmin(adminData);
      return { success: true, admin: adminData };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("session_active");
    setAdmin(null);
  };

  /* ============================================================
     CONTROL OFFICER — separate session (control_token / control_officer)
     ============================================================ */
  const loginControlOfficer = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/control/login", { email, password });
      const { officer, token } = res.data || {};

      if (!token || !officer) {
        return { success: false, error: "Unexpected response from server." };
      }

      localStorage.setItem("control_token", token);
      localStorage.setItem("control_officer", JSON.stringify(officer));

      setControlOfficer(officer);
      return { success: true, officer };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logoutControlOfficer = () => {
    localStorage.removeItem("control_token");
    localStorage.removeItem("control_officer");
    setControlOfficer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        controlOfficer,
        loading,
        loginCitizen,
        registerCitizen,
        logoutCitizen,
        updateCurrentUser,
        loginAdmin,
        logoutAdmin,
        loginControlOfficer,
        logoutControlOfficer,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
        isControlOfficerAuthenticated: !!controlOfficer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;