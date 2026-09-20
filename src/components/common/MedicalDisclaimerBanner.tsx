import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface MedicalDisclaimerBannerProps {
  compact?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<MedicalDisclaimerBannerProps> = ({ compact }) => {
  return (
    <div
      id="medical-safety-banner"
      role="alert"
      className={`border border-amber-300 dark:border-amber-700/60 bg-amber-50/80 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 rounded-xl ${
        compact ? 'p-3 text-xs' : 'p-4 text-sm'
      } flex items-start gap-3 shadow-xs`}
    >
      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-900 dark:text-amber-200">
          Educational Healthcare Information Platform
        </p>
        <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
          Health Companion AI provides educational information only. It does not diagnose conditions, prescribe medications, or replace professional medical advice. Always consult a qualified healthcare provider for personal clinical decisions.
        </p>
      </div>
    </div>
  );
};
