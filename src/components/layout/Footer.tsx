import React from 'react';
import { HeartPulse, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      id="app-footer"
      className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-10 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                Health Companion AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understand your health. Connect with care. • Educational healthcare information platform.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <nav aria-label="Footer links" className="flex flex-wrap items-center gap-5 text-xs font-semibold">
            <button
              onClick={() => onNavigate('settings')}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="text-red-600 dark:text-red-400 font-bold hover:underline"
            >
              Emergency
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Help & FAQ
            </button>
          </nav>
        </div>

        {/* Mandatory Safety Notice */}
        <div
          id="footer-safety-disclaimer"
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3"
        >
          <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-300">Mandatory Medical Notice: </strong>
            Health Companion AI is an educational information system and does not provide medical diagnosis or replace professional medical advice. If you are experiencing a medical emergency, please call your local emergency services (112 in India, 911 in the US) or visit the nearest healthcare facility.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p>© 2026 Health Companion AI. Built for educational patient health empowerment.</p>
          <p>Deterministic Medical Tools v2.4 • All demo data clearly identified</p>
        </div>
      </div>
    </footer>
  );
};
