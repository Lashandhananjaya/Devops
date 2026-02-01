import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/api";
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [location.state]);

  // Load saved email if "Remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateField = (name, value) => {
    const errors = {};
    if (name === "email" || !name) {
      const emailValue = name === "email" ? value : formData.email;
      if (!emailValue) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errors.email = "Please enter a valid email address";
      }
    }
    if (name === "password" || !name) {
      const passwordValue = name === "password" ? value : formData.password;
      if (!passwordValue) {
        errors.password = "Password is required";
      } else if (passwordValue.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      const errors = validateField(name, value);
      setValidationErrors(prev => ({ ...prev, ...errors }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validateField(name, formData[name]);
    setValidationErrors(prev => ({ ...prev, ...errors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const errors = validateField("", "");
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Animated Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
              <LogIn size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to access your bookings and account</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-3 animate-slide-down">
              <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:border-gray-600/75 transition-all duration-300">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <Mail size={16} className="text-purple-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.email && validationErrors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  />
                  {touched.email && !validationErrors.email && formData.email && (
                    <CheckCircle className="absolute right-3 top-3 text-green-400" size={20} />
                  )}
                </div>
                {touched.email && validationErrors.email && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <Lock size={16} className="text-purple-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.password && validationErrors.password
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.password && validationErrors.password && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-gray-600 cursor-pointer accent-purple-500" 
                  />
                  Remember me
                </label>
                <a href="#" className="text-purple-400 hover:text-purple-300 transition font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <span className="text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-700 hover:border-gray-500 transition duration-300 group">
                <span className="text-xl">🔵</span>
                <span className="text-sm font-medium group-hover:text-white">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-700 hover:border-gray-500 transition duration-300 group">
                <span className="text-xl">📘</span>
                <span className="text-sm font-medium group-hover:text-white">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-gray-400 text-sm mt-6 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition hover:underline">
                Sign Up Now
              </Link>
            </p>
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg text-center">
            <p className="text-blue-300 text-xs flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-xs border-t border-gray-700/50 relative z-10">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved. | <a href="#" className="text-gray-400 hover:text-gray-300">Privacy Policy</a>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
