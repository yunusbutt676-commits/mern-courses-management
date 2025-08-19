import React, { useState } from "react";
import API from "./api";

export default function Login({ setRole }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "", role: "user" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    setError("");
    setSuccess("");

    if (isRegister) {
      // ✅ Force new users to be "user" (student)
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user", // always user
      };

      await API.post("/api/auth/register", registerData);
      setSuccess("✅ Registration successful! Please login now.");
      setIsRegister(false);

      // Reset form
      setFormData({ name: "", email: "", password: "", role: "user" });
    } else {
      // ✅ Login user
      const res = await API.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save token & role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setRole(res.data.role);

      // ✅ Redirect based on role
      if (res.data.role === "admin") {
        window.location.href = "/dashboard";
      } else if (res.data.role === "teacher") {
        window.location.href = "/teacher"; // optional teacher route
      } else {
        window.location.href = "/viewcourses"; // default for student/user
      }
    }
  } catch (err) {
    setError(err.response?.data?.message || "❌ Something went wrong!");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center mb-3">{success}</p>}

        <div className="space-y-4">
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
}
