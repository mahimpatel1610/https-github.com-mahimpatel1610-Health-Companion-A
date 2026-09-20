import React from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  HeartPulse,
  AlertTriangle,
  Bot,
  LogIn,
  LogOut,
  Stethoscope,
  User,
  KeyRound,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

import { PatientProfile, AuthUser } from '../../types';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onNavigate: (section: string) => void;
  currentSection: string;
  patient?: PatientProfile;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onToggleDesktopSidebar?: () => void;
  isDesktopSidebarCollapsed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  isMobileMenuOpen = false,
  onToggleMobileMenu = () => {},
  onNavigate,
  currentSection,
  patient,
  currentUser,
  onLogout,
  onToggleDesktopSidebar,
  isDesktopSidebarCollapsed = false
}) => {
  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Menu Toggles & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="text-xs font-bold sm:inline hidden">Menu</span>
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          {onToggleDesktopSidebar && (
            <button
              id="desktop-sidebar-toggle-btn"
              onClick={onToggleDesktopSidebar}
              title={isDesktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isDesktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isDesktopSidebarCollapsed ? (
                <PanelLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Main Logo & Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-xs">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Health Companion
                </span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Understand your health. Connect with care.
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* AI Assistant Quick Pill */}
          <button
            id="nav-quick-ai-btn"
            onClick={() => onNavigate('ai-assistant')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-teal-300 dark:border-teal-700/70 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
          >
            <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>AI Health Assistant</span>
          </button>

          {/* Emergency Direct Button */}
          <button
            id="nav-emergency-btn"
            onClick={() => onNavigate('emergency')}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="hidden sm:inline">Emergency</span>
            <span className="font-mono bg-red-200/80 dark:bg-red-900/80 px-1 py-0.2 rounded text-[10px]">112</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-navbar-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Light</span>
              </>
            )}
          </button>

          {/* User Auth Profile or Login Shortcut */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                id="nav-user-profile-btn"
                onClick={() => onNavigate(currentUser.role === 'doctor' ? 'doctor-portal' : 'patient-data')}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                    currentUser.role === 'doctor' ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}
                >
                  {currentUser.role === 'doctor' ? (
                    <Stethoscope className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-[11px] leading-tight text-slate-900 dark:text-white truncate max-w-[110px]">
                    {currentUser.name}
                  </div>
                  <div
                    className={`text-[9px] uppercase font-extrabold ${
                      currentUser.role === 'doctor'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-teal-600 dark:text-teal-400'
                    }`}
                  >
                    {currentUser.role}
                  </div>
                </div>
              </button>

              <button
                id="nav-switch-accounts-btn"
                onClick={() => onNavigate('login')}
                title="Switch patient or doctor account"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              <button
                id="nav-logout-btn"
                onClick={onLogout}
                title="Sign out of healthcare portal"
                aria-label="Sign out"
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden xs:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
