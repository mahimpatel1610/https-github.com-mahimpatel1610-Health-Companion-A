import React from 'react';
import {
  Heart,
  Activity,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Shield,
  Pill,
  Thermometer,
  Wind
} from 'lucide-react';
import { PatientProfile, MedicalHistory, Appointment, MedicalReport } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface MyHealthPageProps {
  patient: PatientProfile;
  medicalHistory: MedicalHistory;
  appointments: Appointment[];
  reports: MedicalReport[];
  onNavigate: (section: string) => void;
}

export const MyHealthPage: React.FC<MyHealthPageProps> = ({
  patient,
  medicalHistory,
  appointments,
  reports,
  onNavigate
}) => {
  const nextAppointment = appointments.find((a) => a.status === 'Confirmed') || appointments[0];
  const latestReport = reports[0];

  return (
    <div id="my-health-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Health Status Summary
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Health
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Comprehensive snapshot of your current vital metrics, active medications, verified allergies, and care plan.
          </p>
        </div>

        <button
          onClick={() => onNavigate('patient-data')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>View Detailed Medical Record</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Vital Metrics Grid (Grounded demo parameters) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Blood Pressure</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">118/78</p>
          <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-1">
            Standard Resting (mmHg)
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Heart Rate</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">72</p>
          <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-1">
            bpm (Resting)
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Oxygen Saturation</span>
            <Wind className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">98%</p>
          <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-1">
            SpO2 (Room Air)
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Body Mass Index</span>
            <Thermometer className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">22.4</p>
          <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-1">
            Healthy Weight Range
          </p>
        </div>
      </div>

      {/* Two Column Layout: Medications & Allergies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Medications */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Active Medications
              </h2>
            </div>
            <button
              onClick={() => onNavigate('medication-info')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Medication Guide
            </button>
          </div>

          <div className="space-y-3">
            {medicalHistory.currentMedications.map((med, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{med.name}</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{med.dosage}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{med.frequency}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">Purpose: {med.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Known Allergies & Safety Warnings */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Critical Safety & Allergies
            </h2>
          </div>

          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-2 text-xs">
            <p className="font-bold text-red-900 dark:text-red-300">Documented Drug & Environmental Allergies:</p>
            <ul className="space-y-1 text-red-800 dark:text-red-200">
              {medicalHistory.allergies.map((allg, idx) => (
                <li key={idx} className="flex items-center gap-2 font-semibold">
                  <span>⛔</span>
                  <span>{allg}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-red-700 dark:text-red-400 pt-1">
              Always disclose these allergies to attending nurses, pharmacists, and physicians prior to any medication intake.
            </p>
          </div>

          {/* Quick Doctor Link */}
          {nextAppointment && (
            <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/30 dark:bg-teal-950/20 space-y-1.5 text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-300">Upcoming Care Consultation:</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">
                {nextAppointment.doctorName} ({nextAppointment.specialty})
              </p>
              <p className="text-slate-500">{nextAppointment.date} at {nextAppointment.time} • {nextAppointment.hospital}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
