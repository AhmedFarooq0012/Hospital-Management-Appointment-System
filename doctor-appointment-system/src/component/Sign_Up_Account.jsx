import React, { useState } from "react";
import Verify_Otp from "./Verify_Otp";

export default function Sign_Up_Account() {
  const [isLoginView, setIsLoginView] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "", // Only single password field remains
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLoginView) {
      // ==========================================
      // 🔐 LOGIN API CALL
      // ==========================================
      try {
        console.log("Triggering Login API...");
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();

        alert("Login Successful!");
      } catch (err) {
        console.error("Login Error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // ==========================================
      // 📝 SIGNUP API CALL
      // ==========================================
      try {
        console.log("Triggering Registration API...");
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setRegisteredEmail(formData.email);
        setShowOtpScreen(true);
      } catch (err) {
        console.error("Registration Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (showOtpScreen) {
    return (
      <Verify_Otp
        email={registeredEmail}
        onBackToSignup={() => setShowOtpScreen(false)}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-(--color-medical-light) px-4 py-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-block bg-(--color-medical-primary) text-white font-bold px-3 py-1.5 rounded-xl text-base mb-3 tracking-wider">
            SHIFA CARE HMS
          </div>
          <h2 className="text-2xl font-extrabold text-(--color-medical-dark) tracking-tight">
            {isLoginView ? "Welcome Back!" : "Create Patient Account"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Muhammad Ali"
                className="w-full bg-(--color-medical-light) border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) text-slate-800 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ali@example.com"
              className="w-full bg-(--color-medical-light) border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) text-slate-800 transition"
            />
          </div>

          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="03001234567"
                pattern="[0-9]{11}"
                title="Please enter a valid 11-digit mobile number"
                className="w-full bg-(--color-medical-light) border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) text-slate-800 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full bg-(--color-medical-light) border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) text-slate-800 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-btn-unselected-bg) hover:bg-(--color-btn-selected-bg) text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-md cursor-pointer uppercase tracking-wider mt-4 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLoginView
                ? "Secure Login"
                : "Register Portal ID"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-widest">
            OR
          </span>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-(--color-medical-teal) font-bold hover:underline cursor-pointer text-sm"
          >
            {isLoginView
              ? "New to Shifa Care? Create Account here"
              : "Already have a Portal account? Login to Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
