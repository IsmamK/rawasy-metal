"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/../auth/token/login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.detail || "Login failed");

      localStorage.setItem("authToken", data.auth_token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/20 dark:bg-black/30 backdrop-blur-2xl border border-white/20">
        <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Sign in to continue your journey
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white/80"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 block w-full rounded-xl border-0 bg-white/20 text-white placeholder-white/70 backdrop-blur-md shadow-inner focus:ring-2 focus:ring-pink-400 focus:outline-none p-3"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-xl border-0 bg-white/20 text-white placeholder-white/70 backdrop-blur-md shadow-inner focus:ring-2 focus:ring-pink-400 focus:outline-none p-3"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-white/80">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-pink-300 hover:text-white font-medium transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
