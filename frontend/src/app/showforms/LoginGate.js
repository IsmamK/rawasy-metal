"use client";

import { useState } from "react";
import { FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import PageBackdrop from "@/components/PageBackdrop";

/**
 * Gates the dashboard behind a login form. The actual session lives in an
 * httpOnly cookie the browser manages on its own (see AuthContext) — a page
 * reload survives without logging in again, but this component still can't
 * read the cookie itself, so it briefly re-checks with the backend on mount
 * before deciding whether to show the login form.
 */
export default function LoginGate({ children }) {
  const { isAuthenticated, isCheckingSession, isLoggingIn, login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    }
  };

  if (isCheckingSession) {
    return (
      <section className="min-h-screen pt-24 pb-16 bg-lightBg relative flex items-center justify-center">
        <PageBackdrop />
        <div className="relative z-10 inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8f744e]" />
      </section>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <section className="min-h-screen pt-24 pb-16 bg-lightBg relative flex items-center justify-center px-4">
      <PageBackdrop />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-xl border border-[#e6e0d8]"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f0eb] text-[#8f744e]">
            <FiLock className="h-5 w-5" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#8f744e]">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-[#8f744e]/70">
            Sign in to view form submissions.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="block text-xs font-semibold text-[#8f744e] mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full mb-4 px-4 py-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-[#8f744e]"
        />

        <label className="block text-xs font-semibold text-[#8f744e] mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full mb-6 px-4 py-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-[#8f744e]"
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8f744e] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#7c6544] disabled:opacity-60"
        >
          <FiLogIn />
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}
