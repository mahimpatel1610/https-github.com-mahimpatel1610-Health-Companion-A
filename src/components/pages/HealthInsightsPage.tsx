import React from 'react';
import {
  BarChart3,
  FileText,
  AlertTriangle,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { MedicalReport, Appointment } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface HealthInsightsPageProps {
  reports: MedicalReport[];
  appointments: Appointment[];
  onNavigate: (section: string) => void;
}

export const HealthInsightsPage: React.FC<HealthInsightsPageProps> = ({
  reports,
  appointments,
  onNavigate
}) => {
  const totalReports = reports.length;
  const totalFindings = reports.reduce((acc, r) => acc + r.findings.length, 0);
  const flaggedFindings = reports.reduce(
    (acc, r) => acc + r.findings.filter((f) => f.status === 'outside_range').length,
    0
  );
  const withinRangeFindings = totalFindings - flaggedFindings;
  const activeAppointments = appointments.filter((a) => a.status === 'Confirmed').length;

  // Department frequency
  const deptCount: Record<string, number> = {};
  reports.forEach((r) => {
    const dept = r.suggestedDepartment.department.split('&')[0].trim();
    deptCount[dept] = (deptCount[dept] || 0) + 1;
  });

  return (
    <div id="health-insights-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Document-Grounded Analytics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Health Insights & Document Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Objective metrics derived exclusively from verified findings in your uploaded laboratory reports and clinical consultations.
        </p>
      </div>

      {/* Mandatory Safety Notice regarding grounded data */}
      <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Strict Grounding Guarantee: </strong>
          Health Companion AI does not display speculative “overall health scores” or fabricated fitness percentages. All analytics below reflect actual documented counts from your authorized medical records.
        </div>
      </div>

      {/* 4 Quantitative Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Uploaded Reports</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalReports}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Processed & simplified
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Parameters Tested</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalFindings}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Checked deterministically
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Values Outside Range</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{flaggedFindings}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Follow-up suggested
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Scheduled Consultations</span>
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{activeAppointments}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Confirmed doctor visits
          </p>
        </div>
      </div>

      {/* Visual Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Finding Distribution */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Laboratory Value Distribution
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-green-700 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Within Stated Range
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {withinRangeFindings} ({Math.round((withinRangeFindings / (totalFindings || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${(withinRangeFindings / (totalFindings || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Outside Stated Range
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {flaggedFindings} ({Math.round((flaggedFindings / (totalFindings || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${(flaggedFindings / (totalFindings || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Based strictly on the numeric range printed on each respective laboratory report slip.
          </p>
        </div>

        {/* Suggested Department Distribution */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Suggested Department Linkages
          </h2>

          <div className="space-y-2 text-xs">
            {Object.entries(deptCount).map(([dept, count]) => (
              <div
                key={dept}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{dept}</span>
                </div>
                <span className="font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {count} {count === 1 ? 'Report' : 'Reports'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
