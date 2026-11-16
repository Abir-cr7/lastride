import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * ========================================================
 * LOGIN MODAL
 * Prominent User Login & Admin Login toggle buttons
 * ========================================================
 */
export const LoginModal = () => {
  const {
    isLoginOpen,
    closeLoginModal,
    openSignupModal,
    openOtpModal,
    login,
    initialRole,
  } = useAuth();

  const [activeRole, setActiveRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoginOpen) {
      setActiveRole(initialRole || 'user');
      setError(null);
    }
  }, [isLoginOpen, initialRole]);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password, activeRole);
      setEmail('');
      setPassword('');
      closeLoginModal();
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      // If unverified, guide user to OTP verification
      if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('otp')) {
        setTimeout(() => {
          closeLoginModal();
          openOtpModal(email);
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setActiveRole('admin');
    setEmail('admin@riderrescue.com');
    setPassword('admin123');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0D111A]/95 border border-white/10 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Top Amber Ambient Light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 blur-3xl rounded-full pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide uppercase">
              Welcome Back
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage emergency alerts, fuel dispatch & telemetry
            </p>
          </div>

          {/* ========================================================
              PROMINENT USER LOGIN VS ADMIN LOGIN TOGGLE BUTTONS
             ======================================================== */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setActiveRole('user')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeRole === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Rider Login</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('admin')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRole === 'admin' ? 'admin@riderrescue.com' : 'rider@example.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                activeRole === 'admin'
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In as {activeRole === 'admin' ? 'Admin' : 'Rider'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Admin Credential Shortcut */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Seed Admin (admin@riderrescue.com)
            </button>
            <span className="text-[10px] text-slate-500 font-mono">admin123</span>
          </div>

          {/* Switch to Signup */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={openSignupModal}
              className="text-amber-400 hover:underline font-semibold"
            >
              Register here
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * ========================================================
 * SIGN UP MODAL
 * Name, Email, Phone, Password, Role (User/Admin)
 * -> Dispatches registration & auto-opens 6-Digit OTP Modal
 * ========================================================
 */
export const SignUpModal = () => {
  const { isSignupOpen, closeSignupModal, openLoginModal, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isSignupOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      // AuthContext.register automatically triggers openOtpModal(email, name)
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSignupModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0D111A]/95 border border-white/10 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-1/4 w-44 h-24 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={closeSignupModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white tracking-wide uppercase">
              Create Your Account
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Get 24/7 rescue assistance, verified fuel dispatch, and road alert telemetry
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahat Ahmed"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@mail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+8801700000000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 font-mono">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'user' }))}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                    formData.role === 'user'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Rider (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'admin' }))}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 border ${
                    formData.role === 'admin'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account & Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="mt-4 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => openLoginModal('user')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Log in instead
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * ========================================================
 * 6-DIGIT OTP VERIFICATION MODAL
 * - 6 auto-focusing digit boxes
 * - Clipboard paste support
 * - Live 05:00 countdown timer
 * - "Resend Code" button
 * - "Change Email" button
 * ========================================================
 */
export const OtpModal = () => {
  const { isOtpOpen, closeOtpModal, otpEmail, otpUserName, initialOtp, openSignupModal, verifyOtp, resendOtp } = useAuth();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // References to the 6 input elements
  const inputRefs = useRef([]);

  // Auto fill helper
  const handleAutofill = (code) => {
    if (!code) return;
    const splitDigits = code.toString().split('').slice(0, 6);
    const newDigits = ['', '', '', '', '', ''];
    splitDigits.forEach((d, i) => {
      newDigits[i] = d;
    });
    setDigits(newDigits);
    inputRefs.current[5]?.focus();
    if (splitDigits.length === 6) {
      handleVerify(code);
    }
  };

  // Reset digits & timer when modal opens
  useEffect(() => {
    if (isOtpOpen) {
      setDigits(['', '', '', '', '', '']);
      setTimeLeft(300);
      setError(null);
      setSuccessMsg(null);
      // Auto focus first digit input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
    }
  }, [isOtpOpen]);

  // Live 05:00 Countdown Timer
  useEffect(() => {
    if (!isOtpOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOtpOpen, timeLeft]);

  if (!isOtpOpen) return null;

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  /**
   * Auto-focus next box on input, handle backspace jump to previous box
   */
  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const char = cleaned.slice(-1); // Take latest entered character

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // On backspace in empty box, move to previous box
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Arrow Left
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Arrow Right
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Clipboard Paste Support:
   * Pasting e.g. "482910" splits and populates all 6 boxes
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numericChars = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (numericChars.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      numericChars.forEach((ch, idx) => {
        newDigits[idx] = ch;
      });
      setDigits(newDigits);

      // Focus last populated box
      const targetFocusIdx = Math.min(numericChars.length, 5);
      inputRefs.current[targetFocusIdx]?.focus();

      // If full 6 digits pasted, trigger verify
      if (numericChars.length === 6) {
        handleVerify(newDigits.join(''));
      }
    }
  };

  const handleVerify = async (codeToVerify) => {
    const fullOtp = codeToVerify || digits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await verifyOtp(otpEmail, fullOtp);
      // Trigger festive confetti celebration on success!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#06B6D4', '#22C55E', '#FFFFFF'],
      });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await resendOtp(otpEmail);
      setTimeLeft(300); // Reset timer to 5 minutes
      setSuccessMsg('A new 6-digit OTP has been sent. Check your inbox and terminal log.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOtpModal}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-3xl bg-[#0D111A]/95 border border-white/10 p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-center"
        >
          {/* Cyan Glow Header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={closeOtpModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-black text-white tracking-wide uppercase">
            Verify 6-Digit OTP
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            We dispatched a 6-digit security code for{' '}
            <span className="text-amber-400 font-mono font-semibold">{otpEmail}</span>
          </p>

          {/* Live 05:00 Countdown Timer Badge */}
          <div className="my-5 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="text-slate-300">Valid For:</span>
              <span
                className={`font-bold ${
                  timeLeft <= 60 ? 'text-crimson-400 animate-pulse' : 'text-amber-400'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick OTP Helper Banner (Auto-fill support) */}
          {initialOtp && (
            <div className="my-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-left shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                    Generated OTP Code
                  </span>
                  <span className="text-base font-black font-mono text-amber-400 tracking-widest">
                    {initialOtp}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAutofill(initialOtp)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-mono uppercase transition-all shadow-[0_0_10px_rgba(245,158,11,0.4)]"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* ========================================================
              6 AUTO-FOCUSING DIGIT BOXES WITH PASTE SUPPORT
             ======================================================== */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-6" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono rounded-2xl bg-white/5 border text-white transition-all duration-200 focus:outline-none ${
                  digit
                    ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-500/5'
                    : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              />
            ))}
          </div>

          {/* Submit Verification Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || digits.some((d) => !d)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Confirm & Verify Account</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Bottom Actions: Resend Code & Change Email */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            {/* Change Email */}
            <button
              onClick={() => {
                closeOtpModal();
                openSignupModal();
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change Email</span>
            </button>

            {/* Resend Code */}
            <button
              onClick={handleResend}
              disabled={resending || timeLeft > 270}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${
                timeLeft > 270
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : 'Resend Code'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
