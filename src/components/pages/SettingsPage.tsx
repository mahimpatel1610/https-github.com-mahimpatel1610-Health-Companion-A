import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { PatientProfile, MedicalReport, Appointment } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  patient: PatientProfile;
  reports: MedicalReport[];
  appointments: Appointment[];
  onResetDemoData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  theme,
  onToggleTheme,
  patient,
  reports,
  appointments,
  onResetDemoData
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reportReadyAlerts, setReportReadyAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportJson = () => {
    const data = {
      patient,
      reports,
      appointments,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_Companion_AI_Export_${patient.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully as JSON.');
  };

  return (
    <div id="settings-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Personalize appearance, accessibility features, notification preferences, and manage your health records data.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {toastMessage && (
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance & Accessibility */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Accessibility
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Theme Mode</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <button
                id="settings-theme-toggle"
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                )}
              </button>
            </div>

            {/* Font Scaling */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Font Scaling</span>
                <span className="text-slate-500 dark:text-slate-400">Adjust clinical readability</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setFontSize('normal');
                    document.documentElement.classList.remove('text-lg');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    fontSize === 'normal'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => {
                    setFontSize('large');
                    document.documentElement.classList.add('text-lg');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    fontSize === 'large'
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Large (A+)
                </button>
              </div>
            </div>

            {/* Reduce Motion */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Reduce Motion</span>
                <span className="text-slate-500 dark:text-slate-400">Minimize animations and transitions</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Data Management */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Management & Privacy
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Appointment reminders */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Appointment Alerts</span>
                <span className="text-slate-500 dark:text-slate-400">SMS & push reminders for consultations</span>
              </div>
              <input
                type="checkbox"
                checked={appointmentReminders}
                onChange={(e) => setAppointmentReminders(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
              />
            </div>

            {/* Export JSON */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Export Records (JSON)</span>
                <span className="text-slate-500 dark:text-slate-400">Download complete patient profile & reports</span>
              </div>
              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>

            {/* Reset to Demo State */}
            <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-red-900 dark:text-red-300 block">Reset Demo State</span>
                <span className="text-red-700/80 dark:text-red-400">Restore factory sample reports & appointments</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset to initial hackathon demo state?')) {
                    onResetDemoData();
                    showToast('Demo dataset refreshed.');
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
