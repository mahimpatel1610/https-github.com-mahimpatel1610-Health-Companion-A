import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  BadgeCheck,
  Building2,
  LogIn,
  UserPlus,
  KeyRound,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Search,
  Filter,
  Phone
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types';
import { DEMO_LOGIN_ACCOUNTS, DemoAccount } from '../../data/demoAccounts';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (section: string) => void;
}

interface StoredAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  doctorId?: string;
  specialty?: string;
  hospital?: string;
}

interface SavedLoginInfo {
  role: UserRole;
  email?: string;
  name?: string;
  doctorIdOrEmail?: string;
  password?: string;
  savedAt: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  // Main Section: 'login' (Sign In) vs 'register' (Create Account)
  const [activeSection, setActiveSection] = useState<'login' | 'register'>('login');

  // Role: 'patient' or 'doctor'
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  // Form Fields - All start empty for manual typing as requested
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [doctorIdOrEmail, setDoctorIdOrEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  // Status & UI State
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Option: Save Login Information
  const [saveLoginInfo, setSaveLoginInfo] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem('hc_save_login_preference');
      return pref !== 'false';
    } catch {
      return true;
    }
  });
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false);
  const [savedAccountLabel, setSavedAccountLabel] = useState('');

  // Doctor directory & quick credentials state
  const [copiedTextKey, setCopiedTextKey] = useState<string | null>(null);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [isDoctorDirectoryOpen, setIsDoctorDirectoryOpen] = useState(true);

  // Retrieve stored user accounts from localStorage
  const getStoredRegistry = (): StoredAccount[] => {
    try {
      const stored = localStorage.getItem('hc_user_registry');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save registered account to localStorage
  const saveAccountToRegistry = (account: StoredAccount) => {
    try {
      const registry = getStoredRegistry();
      // Update if existing or add new
      const filtered = registry.filter(
        (a) =>
          !(
            a.email.toLowerCase() === account.email.toLowerCase() &&
            a.role === account.role
          )
      );
      filtered.push(account);
      localStorage.setItem('hc_user_registry', JSON.stringify(filtered));
    } catch {
      // ignore storage error
    }
  };

  // Load saved login credentials for a specific role
  const loadSavedCredentials = (role: UserRole) => {
    try {
      const raw = localStorage.getItem(`hc_saved_login_${role}`);
      if (raw) {
        const data: SavedLoginInfo = JSON.parse(raw);
        if (role === 'patient') {
          if (data.email) setEmail(data.email);
          if (data.name) setName(data.name);
          if (data.password) setPassword(data.password);
          setSavedAccountLabel(data.name ? `${data.name} (${data.email})` : data.email || 'Patient');
        } else {
          if (data.doctorIdOrEmail) setDoctorIdOrEmail(data.doctorIdOrEmail);
          if (data.password) setPassword(data.password);
          setSavedAccountLabel(data.name ? `${data.name} (${data.doctorIdOrEmail})` : data.doctorIdOrEmail || 'Doctor');
        }
        setHasSavedCredentials(true);
        return;
      }
    } catch {
      // ignore storage errors
    }
    setHasSavedCredentials(false);
    setSavedAccountLabel('');
  };

  // Clear saved credentials from browser localStorage
  const handleClearSavedLogin = () => {
    try {
      localStorage.removeItem(`hc_saved_login_${selectedRole}`);
      setHasSavedCredentials(false);
      setSavedAccountLabel('');
      if (selectedRole === 'patient') {
        setEmail('');
        setName('');
        setPassword('');
      } else {
        setDoctorIdOrEmail('');
        setPassword('');
      }
      setStatusMessage({
        type: 'success',
        text: `Saved credentials for ${selectedRole === 'doctor' ? 'doctor' : 'patient'} have been cleared from this browser.`
      });
    } catch {
      // ignore
    }
  };

  // Load saved credentials on mount and whenever role/section switches
  useEffect(() => {
    if (activeSection === 'login') {
      loadSavedCredentials(selectedRole);
    }
  }, [selectedRole, activeSection]);

  // Reset or reload fields when switching section or role
  const handleSectionSwitch = (section: 'login' | 'register') => {
    setActiveSection(section);
    setStatusMessage(null);
    if (section === 'login') {
      loadSavedCredentials(selectedRole);
    } else {
      setPassword('');
      setVerifyPassword('');
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setStatusMessage(null);
    if (activeSection === 'login') {
      loadSavedCredentials(role);
    } else {
      setPassword('');
      setVerifyPassword('');
    }
  };

  // Google OAuth Simulation
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const isDoc = selectedRole === 'doctor';
      const googleUser: AuthUser = {
        id: `google-${selectedRole}-${Date.now()}`,
        name: isDoc ? 'Dr. Sarah Jenkins' : 'Rahul Sharma',
        email: isDoc ? 'dr.sarah.jenkins@gmail.com' : 'rahul.sharma@gmail.com',
        role: selectedRole,
        provider: 'google',
        doctorId: isDoc ? 'DOC-GGL-8821' : undefined,
        licenseNumber: isDoc ? 'KA-2018-99210' : undefined,
        specialty: isDoc ? 'General Medicine & Diagnostics' : undefined,
        hospital: isDoc ? 'Apollo Health City' : undefined
      };

      onLoginSuccess(googleUser);
    }, 600);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // =========================================================================
    // CASE 1: PATIENT REGISTRATION
    // Fields: email, name, password, verify password
    // =========================================================================
    if (activeSection === 'register' && selectedRole === 'patient') {
      if (!name.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your patient full name.' });
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
        return;
      }
      if (!password) {
        setStatusMessage({ type: 'error', text: 'Please create a password.' });
        return;
      }
      if (password.length < 6) {
        setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
      }
      if (password !== verifyPassword) {
        setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify password.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newPatient: StoredAccount = {
          role: 'patient',
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password
        };
        saveAccountToRegistry(newPatient);

        // Save login information if opted in
        if (saveLoginInfo) {
          const savedData: SavedLoginInfo = {
            role: 'patient',
            email: newPatient.email,
            name: newPatient.name,
            password: newPatient.password,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem('hc_saved_login_patient', JSON.stringify(savedData));
          localStorage.setItem('hc_save_login_preference', 'true');
        }

        const authUser: AuthUser = {
          id: `patient-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'patient',
          provider: 'email'
        };

        onLoginSuccess(authUser);
      }, 500);
      return;
    }

    // =========================================================================
    // CASE 2: PATIENT LOGIN
    // Fields: email, name, password
    // =========================================================================
    if (activeSection === 'login' && selectedRole === 'patient') {
      if (!email.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your registered email.' });
        return;
      }
      if (!name.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your patient name.' });
        return;
      }
      if (!password) {
        setStatusMessage({ type: 'error', text: 'Please enter your password.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const registry = getStoredRegistry();
        const found = registry.find(
          (u) =>
            u.role === 'patient' &&
            u.email.toLowerCase() === email.trim().toLowerCase()
        );

        // Also check demo accounts if matches
        const demoFound = DEMO_LOGIN_ACCOUNTS.find(
          (d) =>
            d.role === 'patient' &&
            d.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (found && found.password !== password) {
          setStatusMessage({ type: 'error', text: 'Incorrect password. Please verify and try again.' });
          return;
        }

        // Save or clear login information based on user option
        if (saveLoginInfo) {
          const savedData: SavedLoginInfo = {
            role: 'patient',
            email: email.trim().toLowerCase(),
            name: name.trim(),
            password: password,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem('hc_saved_login_patient', JSON.stringify(savedData));
          localStorage.setItem('hc_save_login_preference', 'true');
        } else {
          localStorage.removeItem('hc_saved_login_patient');
          localStorage.setItem('hc_save_login_preference', 'false');
        }

        const authUser: AuthUser = {
          id: found ? `patient-${found.email}` : `patient-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'patient',
          provider: 'email'
        };

        onLoginSuccess(authUser);
      }, 500);
      return;
    }

    // =========================================================================
    // CASE 3: DOCTOR REGISTRATION
    // Fields: email, name, doctor id no, password, verify password
    // =========================================================================
    if (activeSection === 'register' && selectedRole === 'doctor') {
      if (!name.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter doctor full name (e.g. Dr. Ananya Sharma).' });
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setStatusMessage({ type: 'error', text: 'Please enter an official medical email.' });
        return;
      }
      if (!doctorId.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your Doctor ID No. / Medical Registration No.' });
        return;
      }
      if (!password) {
        setStatusMessage({ type: 'error', text: 'Please create a password.' });
        return;
      }
      if (password.length < 6) {
        setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
      }
      if (password !== verifyPassword) {
        setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify password.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newDoctor: StoredAccount = {
          role: 'doctor',
          name: name.trim().startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
          email: email.trim().toLowerCase(),
          password: password,
          doctorId: doctorId.trim(),
          specialty: 'General Medicine & Clinical Diagnostics',
          hospital: 'Apollo Health City'
        };
        saveAccountToRegistry(newDoctor);

        // Save login info if opted in
        if (saveLoginInfo) {
          const savedData: SavedLoginInfo = {
            role: 'doctor',
            doctorIdOrEmail: doctorId.trim(),
            password: password,
            name: newDoctor.name,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem('hc_saved_login_doctor', JSON.stringify(savedData));
          localStorage.setItem('hc_save_login_preference', 'true');
        }

        const authUser: AuthUser = {
          id: `doc-${Date.now()}`,
          name: newDoctor.name,
          email: newDoctor.email,
          role: 'doctor',
          doctorId: doctorId.trim(),
          licenseNumber: doctorId.trim(),
          specialty: newDoctor.specialty,
          hospital: newDoctor.hospital,
          provider: 'email'
        };

        onLoginSuccess(authUser);
      }, 500);
      return;
    }

    // =========================================================================
    // CASE 4: DOCTOR LOGIN
    // Fields: doctor id or email, password
    // =========================================================================
    if (activeSection === 'login' && selectedRole === 'doctor') {
      if (!doctorIdOrEmail.trim()) {
        setStatusMessage({ type: 'error', text: 'Please enter your Doctor ID No. or registered Email.' });
        return;
      }
      if (!password) {
        setStatusMessage({ type: 'error', text: 'Please enter your password.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const query = doctorIdOrEmail.trim().toLowerCase();
        const registry = getStoredRegistry();
        const found = registry.find(
          (u) =>
            u.role === 'doctor' &&
            (u.email.toLowerCase() === query || (u.doctorId && u.doctorId.toLowerCase() === query))
        );

        // Check demo accounts as fallback
        const demoFound = DEMO_LOGIN_ACCOUNTS.find(
          (d) =>
            d.role === 'doctor' &&
            (d.email.toLowerCase() === query || (d.doctorId && d.doctorId.toLowerCase() === query))
        );

        if (found && found.password !== password) {
          setStatusMessage({ type: 'error', text: 'Incorrect password for this physician account.' });
          return;
        }

        if (!found && demoFound && demoFound.password !== password) {
          setStatusMessage({ type: 'error', text: 'Incorrect password for this physician account.' });
          return;
        }

        const resolvedName = found?.name || demoFound?.name || (query.includes('@') ? `Dr. ${query.split('@')[0]}` : `Dr. Physician (${query})`);

        // Save or clear login information based on user option
        if (saveLoginInfo) {
          const savedData: SavedLoginInfo = {
            role: 'doctor',
            doctorIdOrEmail: doctorIdOrEmail.trim(),
            password: password,
            name: resolvedName,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem('hc_saved_login_doctor', JSON.stringify(savedData));
          localStorage.setItem('hc_save_login_preference', 'true');
        } else {
          localStorage.removeItem('hc_saved_login_doctor');
          localStorage.setItem('hc_save_login_preference', 'false');
        }

        const authUser: AuthUser = {
          id: found ? `doc-${found.email}` : demoFound ? `doc-${demoFound.email}` : `doc-${Date.now()}`,
          name: resolvedName,
          email: found?.email || demoFound?.email || (query.includes('@') ? query : `${query}@hospital.org`),
          role: 'doctor',
          doctorId: found?.doctorId || demoFound?.doctorId || query,
          licenseNumber: found?.doctorId || demoFound?.doctorId || 'KA-2010-44910',
          specialty: found?.specialty || demoFound?.specialty || 'General Medicine & Hematology',
          hospital: found?.hospital || demoFound?.hospital || 'Apollo Health City, Bengaluru',
          provider: 'email'
        };

        onLoginSuccess(authUser);
      }, 500);
    }
  };

  return (
    <div id="authentication-portal" className="max-w-xl mx-auto space-y-6 py-4">
      {/* 1. Portal Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Secure Healthcare Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {activeSection === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {activeSection === 'login'
            ? 'Enter your credentials manually below to access your healthcare portal.'
            : 'Fill in your registration details manually to create your secure medical profile.'}
        </p>
      </div>

      {/* 2. Main Authentication Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
        {/* Section Tabs: Login vs Register */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            id="tab-login-section"
            onClick={() => handleSectionSwitch('login')}
            className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSection === 'login'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In (Login)</span>
          </button>

          <button
            type="button"
            id="tab-register-section"
            onClick={() => handleSectionSwitch('register')}
            className={`py-2.5 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeSection === 'register'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account (Register)</span>
          </button>
        </div>

        {/* Role Selector: Patient vs Doctor */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Select Healthcare Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="role-btn-patient"
              onClick={() => handleRoleSwitch('patient')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                selectedRole === 'patient'
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/40 ring-2 ring-teal-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                  selectedRole === 'patient'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Patient</span>
                  {selectedRole === 'patient' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Personal records & AI
                </p>
              </div>
            </button>

            <button
              type="button"
              id="role-btn-doctor"
              onClick={() => handleRoleSwitch('doctor')}
              className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                selectedRole === 'doctor'
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                  selectedRole === 'doctor'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Doctor</span>
                  {selectedRole === 'doctor' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Clinical queue & cases
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Social Google Authentication */}
        <div>
          <button
            type="button"
            id="google-sso-btn"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-3 transition-colors shadow-2xs"
          >
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

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Or type manually
          </span>
        </div>

        {/* Feedback Alert Message */}
        {statusMessage && (
          <div
            id="auth-status-alert"
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
              statusMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                : 'bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 3. Manual Input Form - Exact Fields requested */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Quick Demo Autofill Helper */}
          {activeSection === 'login' && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                1-Click test account:
              </span>
              {selectedRole === 'doctor' ? (
                <button
                  type="button"
                  id="quick-fill-dr-ananya-btn"
                  onClick={() => {
                    setDoctorIdOrEmail('dr.ananya@apollo-health.ai');
                    setPassword('Doctor@123');
                    setStatusMessage({
                      type: 'success',
                      text: 'Filled Dr. Ananya Sharma credentials (dr.ananya@apollo-health.ai).'
                    });
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dr. Ananya Sharma</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="quick-fill-rahul-sharma-btn"
                  onClick={() => {
                    setEmail('rahul.sharma@healthcompanion.ai');
                    setName('Rahul Sharma');
                    setPassword('Patient@123');
                    setStatusMessage({
                      type: 'success',
                      text: 'Filled Rahul Sharma credentials (rahul.sharma@healthcompanion.ai).'
                    });
                  }}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                  <span>Rahul Sharma (Patient)</span>
                </button>
              )}
            </div>
          )}
          {/* ========================================================================= */}
          {/* SECTION A: PATIENT REGISTRATION                                           */}
          {/* Requested fields: email, name, password, verify password                  */}
          {/* ========================================================================= */}
          {activeSection === 'register' && selectedRole === 'patient' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Patient Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="patient-register-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="patient-register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="patient-register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password (min 6 characters)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Verify Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showVerifyPassword ? 'text' : 'password'}
                    id="patient-register-verify-password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    placeholder="Re-enter password to verify"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* SECTION B: PATIENT LOGIN                                                  */}
          {/* Requested fields: email, name, password                                   */}
          {/* ========================================================================= */}
          {activeSection === 'login' && selectedRole === 'patient' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="patient-login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. patient@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Patient Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="patient-login-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="patient-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* SECTION C: DOCTOR REGISTRATION                                            */}
          {/* Requested fields: email, name, doctor id no, password, verify password    */}
          {/* ========================================================================= */}
          {activeSection === 'register' && selectedRole === 'doctor' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Doctor Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="doctor-register-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Medical Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="doctor-register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dr.ananya@apollo-health.ai"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Doctor ID No. / Medical Registration No.
                </label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="doctor-register-doctor-id"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    placeholder="e.g. DOC-KA-44910"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="doctor-register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password (min 6 characters)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Verify Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showVerifyPassword ? 'text' : 'password'}
                    id="doctor-register-verify-password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    placeholder="Re-enter password to verify"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showVerifyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* SECTION D: DOCTOR LOGIN                                                   */}
          {/* Requested fields: doctor id or email , and then password                  */}
          {/* ========================================================================= */}
          {activeSection === 'login' && selectedRole === 'doctor' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Doctor ID No. or Email Address
                </label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="doctor-login-id-or-email"
                    value={doctorIdOrEmail}
                    onChange={(e) => setDoctorIdOrEmail(e.target.value)}
                    placeholder="Enter Doctor ID No. or Registered Email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="doctor-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Option: Save Login Information */}
          <div className="pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/40 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="save-login-information-checkbox"
                    checked={saveLoginInfo}
                    onChange={(e) => setSaveLoginInfo(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 transition-colors"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      Save login information
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-normal">
                      {activeSection === 'login'
                        ? 'Remember my credentials on this device for fast 1-click access'
                        : 'Automatically save your credentials on this device after account creation'}
                    </span>
                  </div>
                </label>

                {activeSection === 'login' && hasSavedCredentials && (
                  <button
                    type="button"
                    id="clear-saved-login-info-btn"
                    onClick={handleClearSavedLogin}
                    className="px-2 py-1 rounded-lg text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-800 flex items-center gap-1 transition-colors shrink-0"
                    title="Remove saved credentials from this browser"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear saved</span>
                  </button>
                )}
              </div>

              {activeSection === 'login' && hasSavedCredentials && (
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/70 dark:border-slate-700/70 text-teal-700 dark:text-teal-300">
                  <span className="flex items-center gap-1.5 font-medium truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    Saved credentials loaded: <strong>{savedAccountLabel}</strong>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 font-mono font-bold shrink-0">
                    Auto-filled
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="auth-submit-btn"
            className={`w-full py-3 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-xs transition-all ${
              selectedRole === 'doctor'
                ? 'bg-indigo-600 hover:bg-indigo-700 border border-indigo-700'
                : 'bg-teal-600 hover:bg-teal-700 border border-teal-700'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99]'}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : activeSection === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Switch Section Link */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          {activeSection === 'login' ? (
            <p>
              Don't have a {selectedRole} account?{' '}
              <button
                type="button"
                id="switch-to-register-link"
                onClick={() => handleSectionSwitch('register')}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Register here</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          ) : (
            <p>
              Already registered as a {selectedRole}?{' '}
              <button
                type="button"
                id="switch-to-login-link"
                onClick={() => handleSectionSwitch('login')}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Sign in here</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          )}
        </div>
      </div>

      {/* 3. Specialist Doctor Login IDs & Credentials Directory */}
      <div id="doctor-credentials-directory" className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border-b border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Specialist Doctor Login IDs & Credentials
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  16 Verified Doctors
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use any doctor's ID or official email with their password to log in to the Doctor Portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDoctorDirectoryOpen(!isDoctorDirectoryOpen)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 self-start sm:self-center transition-colors"
          >
            {isDoctorDirectoryOpen ? 'Hide Doctor Directory' : 'Show All Doctor IDs'}
          </button>
        </div>

        {isDoctorDirectoryOpen && (
          <div className="p-5 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  placeholder="Search doctor by name, specialty, ID (e.g. neuro, dentist, eye)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={selectedSpecialtyFilter}
                onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Specialties ({DEMO_LOGIN_ACCOUNTS.filter(a => a.role === 'doctor').length})</option>
                <option value="Neurosurgery">Neurosurgery & Spine</option>
                <option value="Dentist">Dentistry & Maxillofacial</option>
                <option value="Eye">Ophthalmology (Eye)</option>
                <option value="Psychiatry">Psychiatry (Mental Health)</option>
                <option value="Oncology">Oncology (Cancer)</option>
                <option value="ENT">ENT (Ear, Nose & Throat)</option>
                <option value="Pulmonology">Pulmonology (Lungs)</option>
                <option value="Nephrology">Nephrology (Kidney)</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedic">Orthopedics</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Gynecology">Gynecology</option>
              </select>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[520px] overflow-y-auto pr-1">
              {DEMO_LOGIN_ACCOUNTS.filter((acc) => acc.role === 'doctor')
                .filter((doc) => {
                  const matchesSearch =
                    doc.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                    (doc.specialty && doc.specialty.toLowerCase().includes(doctorSearchTerm.toLowerCase())) ||
                    (doc.doctorId && doc.doctorId.toLowerCase().includes(doctorSearchTerm.toLowerCase())) ||
                    doc.email.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
                    (doc.hospital && doc.hospital.toLowerCase().includes(doctorSearchTerm.toLowerCase()));

                  const matchesFilter =
                    selectedSpecialtyFilter === 'All' ||
                    (doc.specialty && doc.specialty.toLowerCase().includes(selectedSpecialtyFilter.toLowerCase())) ||
                    doc.badge.toLowerCase().includes(selectedSpecialtyFilter.toLowerCase());

                  return matchesSearch && matchesFilter;
                })
                .map((doc) => {
                  const isIdCopied = copiedTextKey === `id-${doc.doctorId}`;
                  const isEmailCopied = copiedTextKey === `email-${doc.email}`;
                  const isPassCopied = copiedTextKey === `pass-${doc.email}`;

                  const handleCopy = (text: string, key: string) => {
                    navigator.clipboard.writeText(text);
                    setCopiedTextKey(key);
                    setTimeout(() => setCopiedTextKey(null), 2000);
                  };

                  return (
                    <div
                      key={doc.email}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                              {doc.name}
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {doc.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                            {doc.specialty}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {doc.hospital}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole('doctor');
                            setActiveSection('login');
                            setDoctorIdOrEmail(doc.doctorId || doc.email);
                            setPassword(doc.password);
                            setStatusMessage({
                              type: 'success',
                              text: `Auto-filled login for ${doc.name} (${doc.badge}). Click "Sign In as Doctor" button above to proceed.`
                            });
                            document.getElementById('authentication-portal')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shrink-0 shadow-xs flex items-center gap-1 transition-all active:scale-95"
                          title="Auto-fill login credentials above"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Use ID</span>
                        </button>
                      </div>

                      {/* Credentials Table */}
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-[11px]">
                        {/* Doctor ID */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Doctor ID:</span>
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 truncate">
                              {doc.doctorId || 'DOC-REG-2026'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(doc.doctorId || '', `id-${doc.doctorId}`)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                              title="Copy Doctor ID"
                            >
                              {isIdCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Email:</span>
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-mono text-slate-700 dark:text-slate-300 truncate text-[10px]">
                              {doc.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(doc.email, `email-${doc.email}`)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                              title="Copy Email"
                            >
                              {isEmailCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">Password:</span>
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {doc.password}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(doc.password, `pass-${doc.email}`)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0"
                              title="Copy Password"
                            >
                              {isPassCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
