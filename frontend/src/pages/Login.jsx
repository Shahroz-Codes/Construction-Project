import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, ...user } = res.data;

      login({ token, ...user });

      // Redirect by role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "wholesaler") navigate("/wholesaler");
      else if (user.role === "retailer") navigate("/retailer");
      else navigate("/customer");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-700 mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            Sign in to continue to your dashboard
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="you@example.com"
                aria-label="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-amber-600 hover:underline">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}