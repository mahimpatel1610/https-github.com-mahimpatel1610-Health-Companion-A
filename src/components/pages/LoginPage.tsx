import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Stethoscope,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  HeartPulse,
  Sparkles,
  Building2,
  FileCheck2,
  Copy,
  Info
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';
import { DEMO_LOGIN_ACCOUNTS, DemoAccount } from '../../data/demoAccounts';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (section: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Selected Role: 'patient' or 'doctor'
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  // Form Fields
  const [email, setEmail] = useState('rahul.sharma@healthcompanion.ai');
  const [password, setPassword] = useState('Patient@123');
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('General Medicine & Diagnostics');
  const [hospital, setHospital] = useState('Apollo Health City');
  const [licenseNumber, setLicenseNumber] = useState('KA-MED-2024-9912');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Quick Auto-Fill Demo Account Handler
  const handleSelectDemoAccount = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    setAuthMode('login');
    setStatusMessage({
      type: 'success',
      text: `Demo credentials loaded for ${acc.name} (${acc.role.toUpperCase()}). Click "Sign In with Credentials" to proceed.`
    });
  };

  const handleCopyCredentials = (acc: DemoAccount) => {
    navigator.clipboard.writeText(`Email: ${acc.email}\nPassword: ${acc.password}`);
    setCopiedAccount(acc.email);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  // Google Sign-In Simulation
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const googleUser: AuthUser = {
        id: `google-${Date.now()}`,
        name: selectedRole === 'doctor' ? 'Dr. Google Clinician' : 'Google Patient User',
        email: selectedRole === 'doctor' ? 'doctor.verified@gmail.com' : 'patient.care@gmail.com',
        role: selectedRole,
        provider: 'google',
        specialty: selectedRole === 'doctor' ? 'Preventive Medicine & Telehealth' : undefined,
        hospital: selectedRole === 'doctor' ? 'Google Health Cloud Partner Clinic' : undefined,
        licenseNumber: selectedRole === 'doctor' ? 'GGL-CLINIC-9021' : undefined
      };
      onLoginSuccess(googleUser);
    }, 700);
  };

  // Standard Form Submit (Login or Register)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email || !password) {
      setStatusMessage({ type: 'error', text: 'Please enter both your registered email address and password.' });
      return;
    }

    if (password.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters in length.' });
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your full legal or clinical name.' });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'login') {
        // Check if matches known demo or accept credentials
        const matchedDemo = DEMO_LOGIN_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.role === selectedRole
        );

        const authenticatedUser: AuthUser = {
          id: matchedDemo ? `auth-${matchedDemo.role}-${matchedDemo.name.replace(/\s+/g, '-').toLowerCase()}` : `user-${Date.now()}`,
          name: matchedDemo ? matchedDemo.name : (selectedRole === 'doctor' ? `Dr. ${email.split('@')[0]}` : email.split('@')[0]),
          email: email.trim(),
          role: selectedRole,
          specialty: selectedRole === 'doctor' ? (matchedDemo?.specialty || specialty) : undefined,
          hospital: selectedRole === 'doctor' ? (matchedDemo?.hospital || hospital) : undefined,
          licenseNumber: selectedRole === 'doctor' ? 'MED-LIC-2026-VERIFIED' : undefined,
          phone: phone,
          provider: 'email'
        };

        onLoginSuccess(authenticatedUser);
      } else {
        // Register Mode
        const newUser: AuthUser = {
          id: `new-${selectedRole}-${Date.now()}`,
          name: fullName.trim(),
          email: email.trim(),
          role: selectedRole,
          phone: phone,
          specialty: selectedRole === 'doctor' ? specialty : undefined,
          hospital: selectedRole === 'doctor' ? hospital : undefined,
          licenseNumber: selectedRole === 'doctor' ? licenseNumber : undefined,
          provider: 'email'
        };

        onLoginSuccess(newUser);
      }
    }, 600);
  };

  return (
    <div id="authentication-portal" className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              HIPAA & EHR Compliant Security
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Dual-Role Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Healthcare Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Sign in as an empowered patient to inspect diagnostics or as a verified doctor to manage consultations and reviews.
          </p>
        </div>

        {/* Auth Mode Toggle Pill */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            id="tab-toggle-login"
            onClick={() => {
              setAuthMode('login');
              setStatusMessage(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-toggle-register"
            onClick={() => {
              setAuthMode('register');
              setStatusMessage(null);
              if (!fullName) {
                setFullName(selectedRole === 'doctor' ? 'Dr. Sarah Jenkins' : 'Aarav Mehta');
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Demo Credentials Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Box (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          {/* Step 1: Select User Role (Patient vs Doctor) */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              1. Select Your Healthcare Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Patient Card */}
              <button
                type="button"
                id="role-select-patient-btn"
                onClick={() => {
                  setSelectedRole('patient');
                  if (authMode === 'login' && email.includes('dr.')) {
                    setEmail('rahul.sharma@healthcompanion.ai');
                    setPassword('Patient@123');
                  }
                }}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  selectedRole === 'patient'
                    ? 'border-teal-600 dark:border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === 'patient'
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Patient Portal
                    </span>
                    {selectedRole === 'patient' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    View reports, AI simplification, vitals & history
                  </p>
                </div>
              </button>

              {/* Doctor Card */}
              <button
                type="button"
                id="role-select-doctor-btn"
                onClick={() => {
                  setSelectedRole('doctor');
                  if (authMode === 'login' && !email.includes('dr.')) {
                    setEmail('dr.ananya@apollo-health.ai');
                    setPassword('Doctor@123');
                  }
                }}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === 'doctor'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Doctor Portal
                    </span>
                    {selectedRole === 'doctor' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage appointments, reviews & clinical cases
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Social Sign-In Button: Google OAuth Simulation */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Fast Single Sign-On
            </label>
            <button
              type="button"
              id="google-continue-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
            >
              {/* SVG Google Official Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Or with verified email
            </span>
          </div>

          {/* Feedback banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950/60 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* If Register: Full Name */}
            {authMode === 'register' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name {selectedRole === 'doctor' ? '(with prefix e.g. Dr.)' : ''}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'doctor' ? 'Dr. Ananya Sharma' : 'Rahul Sharma'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registered Healthcare Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@healthcompanion.ai"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Doctor-Only Registration Fields */}
            {authMode === 'register' && selectedRole === 'doctor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specialty & Focus
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology & Vascular"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hospital / Clinical Affiliation
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Medical Council License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. KA-2015-88421"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password Field with toggle visibility */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage({
                        type: 'success',
                        text: `Password reset simulation: Use demo password '${selectedRole === 'doctor' ? 'Doctor@123' : 'Patient@123'}' to sign in instantly.`
                      });
                    }}
                    className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security passphrase"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-ehr-consent"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
              <label htmlFor="agree-ehr-consent" className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                I understand that Health Companion AI simplifies medical documentation for educational transparency and does not replace emergency clinical triage or medical diagnosis.
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedTerms}
              id="auth-submit-btn"
              className={`w-full py-3 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-xs transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-indigo-600 hover:bg-indigo-700 border border-indigo-700'
                  : 'bg-teal-600 hover:bg-teal-700 border border-teal-700'
              } ${isLoading || !agreedTerms ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99]'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Healthcare Session...</span>
                </>
              ) : authMode === 'login' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as {selectedRole === 'doctor' ? 'Physician' : 'Patient'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Create {selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Account</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info Box: Ready-to-Use Login Data (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Demo Login Credentials Box */}
          <div className="p-6 rounded-2xl border-2 border-teal-500/50 dark:border-teal-600/60 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-teal-200/80 dark:border-teal-800/80">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Provided Demo Login Data
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white uppercase tracking-wider">
                Click to Auto-fill
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Select any verified account profile below to instantly populate email & password for patient or clinician workflows:
            </p>

            {/* List of 4 Pre-configured Demo Accounts */}
            <div className="space-y-3">
              {DEMO_LOGIN_ACCOUNTS.map((acc, index) => {
                const isCurrent = email === acc.email && selectedRole === acc.role;

                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-white dark:bg-slate-900 border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {acc.name}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${
                              acc.role === 'doctor'
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                            }`}
                          >
                            {acc.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {acc.description}
                        </p>
                      </div>

                      {/* Role Icon */}
                      {acc.role === 'doctor' ? (
                        <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" />
                      ) : (
                        <User className="w-4 h-4 text-teal-600 shrink-0" />
                      )}
                    </div>

                    {/* Credential rows with one-click fill */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg text-[11px] font-mono space-y-1 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-bold truncate max-w-[210px]">{acc.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-400">Password:</span>
                        <span className="font-bold text-teal-700 dark:text-teal-300">{acc.password}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(acc)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedAccount === acc.email ? 'Copied!' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectDemoAccount(acc)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-colors"
                      >
                        Auto-fill & Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Safeguard Callout */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Multi-Role Access Control</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              When logged in as a <strong>Doctor</strong>, you gain access to the clinical review workspace, patient appointment management, and diagnostic overview. Logging in as a <strong>Patient</strong> shows your personal lab trends and AI simplifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
