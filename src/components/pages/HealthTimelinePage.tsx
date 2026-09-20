import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Clock,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MedicalReport, Appointment, PreviousHealthRecord } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface HealthTimelinePageProps {
  reports: MedicalReport[];
  appointments: Appointment[];
  previousRecords: PreviousHealthRecord[];
  onNavigate: (section: string) => void;
}

export const HealthTimelinePage: React.FC<HealthTimelinePageProps> = ({
  reports,
  appointments,
  previousRecords,
  onNavigate
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Report' | 'Appointment' | 'Archive'>('All');

  // Unified timeline items
  const timelineItems = [
    ...appointments.map((a) => ({
      id: a.id,
      date: a.date,
      title: `Upcoming Consultation: ${a.doctorName}`,
      subtitle: `${a.specialty} • ${a.hospital} (${a.type})`,
      category: 'Appointment',
      badge: a.status,
      icon: Calendar,
      isFuture: true
    })),
    ...reports.map((r) => ({
      id: r.id,
      date: r.date,
      title: r.title,
      subtitle: `${r.hospital} • ${r.findings.length} parameters analyzed`,
      category: 'Report',
      badge: r.findings.some((f) => f.status === 'outside_range') ? 'Flagged Value' : 'Within Range',
      icon: FileText,
      isFuture: false
    })),
    ...previousRecords.map((p) => ({
      id: p.id,
      date: p.date,
      title: p.title,
      subtitle: `${p.hospital} • ${p.doctor}`,
      category: 'Archive',
      badge: p.category,
      icon: Clock,
      isFuture: false
    }))
  ];

  const filtered = timelineItems.filter(
    (item) => filterType === 'All' || item.category === filterType
  );

  return (
    <div id="health-timeline-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Longitudinal Health Journey
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Health Timeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          A unified chronological record of all laboratory diagnostics, clinical appointments, prescriptions, and historical procedures.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {(['All', 'Report', 'Appointment', 'Archive'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              filterType === type
                ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {type === 'All' ? 'All Timeline Events' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-teal-200 dark:border-teal-900/70 space-y-6 ml-3 sm:ml-4 py-2">
        {filtered.map((item, idx) => {
          const Icon = item.icon;

          return (
            <div key={idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.isFuture
                    ? 'bg-indigo-600 border-indigo-300 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-teal-600 text-teal-600 dark:text-teal-400'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-teal-400 dark:hover:border-teal-600 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    {item.date}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md self-start sm:self-auto border ${
                      item.badge === 'Flagged Value'
                        ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        : item.isFuture
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
