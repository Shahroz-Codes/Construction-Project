import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ import context

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { register } = useAuth(); // ✅ use register from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        { withCredentials: true }
      );

      // ✅ call AuthContext instead of localStorage directly
      register({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
      });

      setSuccess(res.data.message || "Registration successful ✅");
      setError(""); 

      // redirect after short delay (optional)
      setTimeout(() => {
        if (res.data.role === "admin") navigate("/admin");
        else if (res.data.role === "wholesaler") navigate("/wholesaler");
        else if (res.data.role === "retailer") navigate("/retailer");
        else navigate("/customer");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-stone-700 mb-2 text-center">
          Create your account
        </h2>
        <p className="text-sm text-stone-400 mb-6 text-center">
          Join us and choose your role
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-2 rounded">{error}</p>
        )}

        {success && (
          <p className="bg-green-100 text-green-600 p-2 mb-2 rounded">{success}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mb-3 px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-stone-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <option value="customer">Customer</option>
          <option value="retailer">Retailer</option>
          <option value="wholesaler">Wholesaler</option>
        </select>

        <button
          type="submit"
          className="w-full bg-stone-700 hover:bg-stone-800 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Register
        </button>

        <div className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
