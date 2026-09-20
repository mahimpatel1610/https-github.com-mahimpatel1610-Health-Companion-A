import React from 'react';
import {
  Home,
  Activity,
  FileText,
  Calendar,
  UserRound,
  Bot,
  FolderHeart,
  Pill,
  Clock,
  BarChart3,
  AlertOctagon,
  PhoneCall,
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  Stethoscope,
  LogIn,
  LogOut,
  KeyRound,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  HeartPulse
} from 'lucide-react';
import { PatientProfile, AuthUser } from '../../types';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  patient: PatientProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isEmergency?: boolean;
  doctorOnly?: boolean;
  patientOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'doctor-portal', label: 'Doctor Clinical Queue', icon: Stethoscope, badge: 'Physician', doctorOnly: true },
  { id: 'my-health', label: 'My Health', icon: Activity, patientOnly: true },
  { id: 'appointments', label: 'Appointments & Visits', icon: Calendar, badge: '2 Active' },
  { id: 'medical-reports', label: 'Medical Reports', icon: FileText, badge: 'AI Lab' },
  { id: 'doctors', label: 'Doctors Directory', icon: UserRound },
  { id: 'ai-assistant', label: 'AI Health Assistant', icon: Bot, badge: 'Voice' },
  { id: 'patient-data', label: 'Patient Data', icon: FolderHeart },
  { id: 'previous-records', label: 'Previous Records', icon: FileText },
  { id: 'medication-info', label: 'Medication Information', icon: Pill },
  { id: 'health-timeline', label: 'Health Timeline', icon: Clock },
  { id: 'health-insights', label: 'Health Insights', icon: BarChart3 },
  { id: 'emergency', label: 'Emergency Help', icon: AlertOctagon, isEmergency: true },
  { id: 'contact', label: 'Contact Clinic', icon: PhoneCall },
  { id: 'login', label: 'Login / Register', icon: LogIn },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  patient,
  theme,
  onToggleTheme,
  isMobileOpen,
  onCloseMobile,
  currentUser,
  onLogout,
  isCollapsed = false,
  onToggleCollapse
}) => {
  // Navigation for desktop: does NOT close the sidebar so the user always has navigation available
  const handleDesktopNavClick = (sectionId: string) => {
    onNavigate(sectionId);
  };

  // Navigation for mobile drawer: navigates and smoothly dismisses overlay
  const handleMobileNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    onCloseMobile();
  };

  const isDoctor = currentUser?.role === 'doctor';

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.doctorOnly && !isDoctor) return false;
    if (item.patientOnly && isDoctor) return false;
    return true;
  });

  // Reusable Nav Content List
  const renderNavButtons = (onItemClick: (id: string) => void, compact: boolean) => (
    <div className="space-y-1">
      {/* Current Active User / Physician Banner */}
      {currentUser && !compact && (
        <div className="mb-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shrink-0 font-bold ${
                currentUser.role === 'doctor' ? 'bg-indigo-600' : 'bg-teal-600'
              }`}
            >
              {currentUser.role === 'doctor' ? (
                <Stethoscope className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {currentUser.role === 'doctor' ? (currentUser.specialty || 'Physician') : 'Active Patient'}
              </div>
            </div>
          </div>
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
              currentUser.role === 'doctor'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
            }`}
          >
            {currentUser.role}
          </span>
        </div>
      )}

      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;

        return (
          <button
            key={item.id}
            id={`sidebar-nav-${item.id}`}
            onClick={() => onItemClick(item.id)}
            title={compact ? item.label : undefined}
            className={`w-full flex items-center ${
              compact ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            } rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? item.isEmergency
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : item.id === 'doctor-portal'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-teal-600 text-white shadow-xs font-bold'
                : item.isEmergency
                ? 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                : item.id === 'doctor-portal'
                ? 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`flex items-center ${compact ? 'justify-center' : 'gap-3'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : item.isEmergency
                    ? 'text-red-600 dark:text-red-400'
                    : item.id === 'doctor-portal'
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              {!compact && <span className="truncate">{item.label}</span>}
            </div>

            {!compact && item.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.id === 'doctor-portal'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : item.isEmergency
                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                    : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP PERMANENT SIDEBAR: Sits in document flow, NEVER overlaps main  */}
      {/* ========================================================================= */}
      <aside
        id="app-desktop-sidebar"
        className={`hidden lg:flex flex-col shrink-0 sticky top-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs max-h-[calc(100vh-6rem)] transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Desktop Sidebar Header with Optional Collapse Toggle */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                HC
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
                Navigation
              </span>
            </div>
          ) : (
            <div className="mx-auto text-teal-600">
              <HeartPulse className="w-5 h-5" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-3">
          {renderNavButtons(handleDesktopNavClick, isCollapsed)}
        </div>

        {/* Desktop Footer Card */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 space-y-2">
          {!isCollapsed && (
            <div
              id="sidebar-desktop-user-card"
              onClick={() => handleDesktopNavClick(currentUser?.role === 'doctor' ? 'doctor-portal' : 'patient-data')}
              className="cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-teal-400 dark:hover:border-teal-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 text-white ${
                    currentUser?.role === 'doctor' ? 'bg-indigo-600' : 'bg-teal-600'
                  }`}
                >
                  {currentUser?.role === 'doctor' ? (
                    <Stethoscope className="w-4 h-4" />
                  ) : (
                    patient.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser?.name || patient.fullName}
                    </p>
                    <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.role === 'doctor'
                      ? (currentUser.specialty || 'General Physician')
                      : `${patient.bloodGroup} • ${patient.age} yrs`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center gap-1.5">
            <button
              id="sidebar-desktop-theme-toggle-btn"
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className={`flex-1 py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors ${
                isCollapsed ? 'px-1' : ''
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  {!isCollapsed && <span>Dark</span>}
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  {!isCollapsed && <span>Light</span>}
                </>
              )}
            </button>

            <button
              id="sidebar-desktop-switch-btn"
              onClick={() => handleDesktopNavClick('login')}
              title="Login / Switch Account"
              aria-label="Login or Switch Account"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            </button>

            <button
              id="sidebar-desktop-settings-btn"
              onClick={() => handleDesktopNavClick('settings')}
              title="Settings"
              aria-label="Settings"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER: For small screens (< lg), slides cleanly over screen     */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            id="sidebar-mobile-backdrop"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
          />

          {/* Drawer Sheet */}
          <div
            id="app-mobile-drawer"
            className="relative z-50 w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Mobile Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Health Companion
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Navigation Menu</p>
                </div>
              </div>

              <button
                id="sidebar-mobile-close-btn"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-3">
              {renderNavButtons(handleMobileNavClick, false)}
            </div>

            {/* Mobile Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 space-y-2.5">
              <div className="flex items-center gap-2">
                <button
                  id="sidebar-mobile-theme-btn"
                  onClick={onToggleTheme}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Light Theme</span>
                    </>
                  )}
                </button>

                <button
                  id="sidebar-mobile-login-btn"
                  onClick={() => handleMobileNavClick('login')}
                  title="Login / Switch Account"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </button>
              </div>

              {currentUser && (
                <button
                  id="sidebar-mobile-logout-btn"
                  onClick={() => {
                    onLogout?.();
                    onCloseMobile();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out ({currentUser.name})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
