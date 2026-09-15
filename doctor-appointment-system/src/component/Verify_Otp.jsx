import React, { useState, useRef } from "react";

export default function Verify_Otp({ email, onBackToSignup }) {
  // 6 boxes k liye single array string handler
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto Focus Next Item Box logic
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace dabane par pichle box me focus bejhne ki logic
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      alert("Please fill all 6 numbers completely.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        `Sending 6-Digit OTP code: ${finalOtp} for handling verification of: ${email}`,
      );
      // const res = await fetch("/api/auth/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, otp: finalOtp })
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("OTP Verified Successfully! Account Activated.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-(--color-medical-light) px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center">
        <div className="inline-block bg-(--color-medical-teal) text-white font-bold p-3 rounded-full text-2xl mb-4">
          🔑
        </div>

        <h2 className="text-2xl font-extrabold text-(--color-medical-dark) tracking-tight">
          Verify Security Code
        </h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          We have dispatched a 6-digit access code sequence token configuration
          to <br />
          <span className="font-bold text-slate-800">
            {email || "your email log"}
          </span>
        </p>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          {/* Grid setup for 6 sequential block elements */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 bg-(--color-medical-light) border border-slate-300 rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-(--color-medical-primary) text-slate-800 transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-btn-unselected-bg) hover:bg-(--color-btn-selected-bg) text-white font-semibold py-3.5 rounded-xl text-sm transition shadow-md disabled:opacity-50 cursor-pointer uppercase tracking-wider"
          >
            {loading ? "Verifying Token..." : "Verify Code & Activate"}
          </button>
        </form>

        <div className="mt-6 text-sm">
          <button
            type="button"
            onClick={onBackToSignup}
            className="text-slate-500 hover:text-(--color-medical-dark) transition underline"
          >
            ← Change Email / Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
