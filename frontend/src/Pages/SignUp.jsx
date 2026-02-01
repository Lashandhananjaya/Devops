import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, AlertCircle, Check, X } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const [validationErrors, setValidationErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const errors = {};
    
    if (name === "name" || !name) {
      const nameValue = name === "name" ? value : formData.name;
      if (!nameValue) {
        errors.name = "Full name is required";
      } else if (nameValue.length < 2) {
        errors.name = "Name must be at least 2 characters long";
      } else if (nameValue.length > 50) {
        errors.name = "Name must not exceed 50 characters";
      }
    }

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

    if (name === "confirmPassword" || !name) {
      const confirmValue = name === "confirmPassword" ? value : confirmPassword;
      if (!confirmValue) {
        errors.confirmPassword = "Please confirm your password";
      } else if (confirmValue !== formData.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (touched[name]) {
        const errors = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, ...errors }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (touched[name]) {
        const errors = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, ...errors }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errors = validateField(name, name === "confirmPassword" ? confirmPassword : formData[name]);
    setValidationErrors(prev => ({ ...prev, ...errors }));
  };

  const passwordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: "", color: "", requirements: [] };
    let strength = 0;
    const requirements = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[\W_]/.test(pwd),
    };

    if (requirements.length) strength++;
    if (requirements.lowercase) strength++;
    if (requirements.uppercase) strength++;
    if (requirements.number) strength++;
    if (requirements.special) strength++;

    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-emerald-500"];

    return {
      level: strength,
      text: levels[strength] || "Very Weak",
      color: colors[strength] || "bg-red-500",
      requirements
    };
  };

  const pwdStrength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    const errors = validateField("", "");
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/login", { state: { successMessage: "Registration successful! Please log in with your credentials." } });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Animated Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full">
              <UserPlus size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Create Account</h1>
            <p className="text-gray-400">Join our community and book amazing hotels</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl hover:border-gray-600/75 transition-all duration-300">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <User size={16} className="text-purple-400" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.name && validationErrors.name
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  />
                  {touched.name && !validationErrors.name && formData.name && (
                    <CheckCircle className="absolute right-3 top-3 text-green-400" size={20} />
                  )}
                </div>
                {touched.name && validationErrors.name && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.name}
                  </p>
                )}
              </div>

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
                    placeholder="Create a strong password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        pwdStrength.level <= 1 ? 'text-red-400' : 
                        pwdStrength.level === 2 ? 'text-orange-400' :
                        pwdStrength.level === 3 ? 'text-yellow-400' :
                        pwdStrength.level === 4 ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {pwdStrength.text}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pwdStrength.color} transition-all duration-300`}
                        style={{ width: `${(pwdStrength.level / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-2 text-xs">
                        {pwdStrength.requirements.length ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-gray-500" />}
                        <span className={pwdStrength.requirements.length ? 'text-green-400' : 'text-gray-500'}>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {pwdStrength.requirements.lowercase ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-gray-500" />}
                        <span className={pwdStrength.requirements.lowercase ? 'text-green-400' : 'text-gray-500'}>Lowercase</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {pwdStrength.requirements.uppercase ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-gray-500" />}
                        <span className={pwdStrength.requirements.uppercase ? 'text-green-400' : 'text-gray-500'}>Uppercase</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {pwdStrength.requirements.number ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-gray-500" />}
                        <span className={pwdStrength.requirements.number ? 'text-green-400' : 'text-gray-500'}>Number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                  <Lock size={16} className="text-purple-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-4 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition ${
                      touched.confirmPassword && validationErrors.confirmPassword
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : confirmPassword && confirmPassword === formData.password
                        ? 'border-green-500 focus:ring-2 focus:ring-green-500/20'
                        : 'border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {confirmPassword && confirmPassword === formData.password && (
                    <CheckCircle className="absolute right-12 top-3 text-green-400" size={20} />
                  )}
                </div>
                {touched.confirmPassword && validationErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer hover:text-gray-300 mt-2">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-700 border-gray-600 cursor-pointer accent-purple-500 mt-0.5" 
                />
                <span>I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a></span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl duration-300"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              <span className="text-gray-500 text-sm">or register with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Social Signup */}
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

            {/* Login Link */}
            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="text-center">
              <div className="text-2xl mb-1">🏨</div>
              <p className="text-xs text-gray-400">Exclusive Deals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⭐</div>
              <p className="text-xs text-gray-400">Rewards Points</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs text-gray-400">Secure Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-xs border-t border-gray-700/50 relative z-10">
        © {new Date().getFullYear()} Royal Stay Hotels. All rights reserved.
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
