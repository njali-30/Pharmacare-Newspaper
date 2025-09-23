import React, { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";
import "./Admin.css";

/**
 * Admin wrapper that persists login state in localStorage.
 * Key used: "pharmacare_isAdmin" (string "true" / "false")
 */

const STORAGE_KEY = "pharmacare_isAdmin";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // replace with your real auth check later
    if (email === "admin@example.com" && password === "password") {
      // save to localStorage so session persists across reloads
      localStorage.setItem(STORAGE_KEY, "true");
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  // initialize from localStorage on mount
  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "true") setIsAdmin(true);
  }, []);

  // logout handler that clears localStorage and local state
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  };

  return (
    <div className="App">
      {!isAdmin ? (
        <AdminLogin onLogin={() => setIsAdmin(true)} />
      ) : (
        <AdminPanel onLogout={handleLogout} />
      )}
    </div>
  );
}
