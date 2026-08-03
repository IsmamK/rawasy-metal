"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Dashboard login state.
 *
 * The actual auth artifact is an httpOnly cookie set by the backend
 * (contact/views.py: cookie_login) — never localStorage/sessionStorage, and
 * not even readable here. JavaScript can't touch it, so an XSS payload can't
 * exfiltrate it, and the browser attaches it automatically on every request
 * (`credentials: "include"`) without this context ever holding the token
 * value itself.
 *
 * Because the cookie is invisible to JS, a page reload can't tell from the
 * cookie alone whether it's still valid — so on mount this pings
 * `/contact/auth/me/`, which succeeds only if the browser's cookie is still
 * accepted server-side, and uses that to rehydrate `isAuthenticated`. That's
 * what makes the login survive a refresh without ever exposing the token to
 * the page.
 */
const AuthContext = createContext(null);

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // True only until the initial /me check resolves, so LoginGate can show a
  // brief "checking session" state instead of flashing the login form for a
  // user who is actually still logged in.
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${getApiUrl()}/contact/auth/me/`, { credentials: "include" })
      .then((response) => {
        if (active) setIsAuthenticated(response.ok);
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${getApiUrl()}/contact/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.detail || "Invalid username or password.");
      }

      setIsAuthenticated(true);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${getApiUrl()}/contact/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoggingIn,
      isCheckingSession,
      login,
      logout,
    }),
    [isAuthenticated, isLoggingIn, isCheckingSession, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
