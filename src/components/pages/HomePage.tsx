import React from 'react';
import {
  FileText,
  Calendar,
  AlertTriangle,
  Bot,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { PatientProfile, MedicalReport, Appointment } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface HomePageProps {
  patient: PatientProfile;
  reports: MedicalReport[];
  appointments: Appointment[];
  onNavigate: (section: string) => void;
  onOpenUpload: () => void;
  onDownloadPatientSummary: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  patient,
  reports,
  appointments,
  onNavigate,
  onOpenUpload,
  onDownloadPatientSummary
}) => {
  const latestReport = reports[0];
  const nextAppointment = appointments.find((a) => a.status === 'Confirmed') || appointments[0];
  const flaggedFindingsCount = latestReport
    ? latestReport.findings.filter((f) => f.status === 'outside_range').length
    : 0;

  return (
    <div id="home-dashboard" className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Personal Health Dashboard
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              • Demo Patient Profile
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good Morning, {patient.fullName}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Here is your health dashboard. All documents and values are simplified in plain language with verified medical bounds.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="home-login-portal-btn"
            onClick={() => onNavigate('login')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs flex items-center gap-2 transition-all"
          >
            <span>Switch Role / Login</span>
          </button>

          <button
            id="home-upload-report-btn"
            onClick={onOpenUpload}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Report</span>
          </button>

          <button
            id="home-download-summary-btn"
            onClick={onDownloadPatientSummary}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <MedicalDisclaimerBanner />

      {/* 6 Key Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Latest Report */}
        <div
          id="card-latest-report"
          onClick={() => onNavigate('medical-reports')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-600 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {latestReport ? latestReport.date : '19 Sep 2026'}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Latest Report</p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
            {latestReport ? latestReport.title : 'Lab Report — 19 Sep 2026'}
          </h2>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {flaggedFindingsCount > 0 ? (
                <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {flaggedFindingsCount} value outside range
                </span>
              ) : (
                <span className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All values within range
                </span>
              )}
            </span>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Next Appointment */}
        <div
          id="card-upcoming-appointment"
          onClick={() => onNavigate('appointments')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-600 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {nextAppointment ? nextAppointment.type : 'In-person'}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Next Appointment</p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
            {nextAppointment ? nextAppointment.doctorName : 'Dr. Ananya Sharma'}
          </h2>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {nextAppointment ? `${nextAppointment.date} • ${nextAppointment.time}` : '24 Sep 2026'}
            </span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Medical Reports Count */}
        <div
          id="card-reports-count"
          onClick={() => onNavigate('medical-reports')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-600 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Archived
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Archived Documents</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {reports.length} Medical Reports
          </h2>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Analyzed & Simplified</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: AI Health Assistant */}
        <div
          id="card-ai-assistant"
          onClick={() => onNavigate('ai-assistant')}
          className="cursor-pointer p-5 rounded-2xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/50 dark:bg-teal-950/20 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Voice & Text
            </span>
          </div>
          <p className="text-xs font-medium text-teal-800 dark:text-teal-300">Ask AI Health Assistant</p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
            Understand Your Reports
          </h2>
          <div className="mt-3 pt-3 border-t border-teal-100 dark:border-teal-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">“What is hemoglobin?”</span>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 5: Doctor Consultation */}
        <div
          id="card-doctor-consultation"
          onClick={() => onNavigate('doctors')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-600 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              9 Specialties
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Doctor Consultation</p>
          <h2 className="text-base font-bold text-slate-900 dark:text-white truncate mt-0.5">
            Find Specialists
          </h2>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Online & In-person</span>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 6: Emergency Help */}
        <div
          id="card-emergency-help"
          onClick={() => onNavigate('emergency')}
          className="cursor-pointer p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 hover:border-red-400 dark:hover:border-red-600 transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800">
              DIAL 112
            </span>
          </div>
          <p className="text-xs font-medium text-red-700 dark:text-red-300">Immediate Medical Help</p>
          <h2 className="text-base font-bold text-red-950 dark:text-red-100 truncate mt-0.5">
            Emergency Contacts
          </h2>
          <div className="mt-3 pt-3 border-t border-red-100 dark:border-red-900/40 flex items-center justify-between text-xs">
            <span className="text-red-700 dark:text-red-300">Ambulance & Hospitals</span>
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Latest Report Findings Section */}
      {latestReport && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Latest Verified Laboratory Findings
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                  {latestReport.date}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated deterministically against explicit reference ranges stated in your document.
              </p>
            </div>

            <button
              onClick={() => onNavigate('medical-reports')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <span>View Full Report & Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Findings Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">Test Parameter</th>
                  <th className="py-3 px-4">Measured Value</th>
                  <th className="py-3 px-4">Stated Reference Range</th>
                  <th className="py-3 px-4">Verified Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {latestReport.findings.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold">{f.testName}</td>
                    <td className="py-3 px-4 font-bold font-mono">
                      {f.measuredValue} <span className="text-slate-500 font-normal">{f.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {f.referenceRange}
                    </td>
                    <td className="py-3 px-4">
                      {f.status === 'within_range' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                          <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                          Within stated range
                        </span>
                      ) : f.status === 'outside_range' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                          <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400" />
                          Outside stated range
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Follow-up appropriate
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plain Language Summary excerpt */}
          <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <p className="font-bold text-teal-800 dark:text-teal-300 mb-1">
              Plain-Language Summary:
            </p>
            <p className="line-clamp-2">{latestReport.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};
