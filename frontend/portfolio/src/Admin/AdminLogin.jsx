// ADMIN LOGIN COMPONENT

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      alert("Admin Login Successful");
      navigate("/");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-cyan-400/10 shadow-xl rounded-2xl p-6 sm:p-8 space-y-5"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-cyan-400">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-gray-700 focus:border-cyan-400 outline-none transition text-sm sm:text-base"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-gray-700 focus:border-cyan-400 outline-none transition text-sm sm:text-base"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-medium py-2.5 rounded-lg shadow-md hover:shadow-cyan-400/20 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

