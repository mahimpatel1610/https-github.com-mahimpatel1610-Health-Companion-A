import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Building2,
  Download,
  Eye,
  Search,
  Filter,
  X
} from 'lucide-react';
import { PreviousHealthRecord, PatientProfile } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface PreviousRecordsPageProps {
  records: PreviousHealthRecord[];
  patient: PatientProfile;
}

export const PreviousRecordsPage: React.FC<PreviousRecordsPageProps> = ({
  records,
  patient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PreviousHealthRecord | null>(null);

  const filtered = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="previous-records-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Historical Archive
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Demo Medical Archive
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Previous Health Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Chronological historical archive of lab consultations, physical examinations, immunizations, and prior prescriptions.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search previous records by doctor, facility, or test type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            id={`prev-record-${rec.id}`}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {rec.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                      {rec.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {rec.date}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{rec.hospital}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Physician: {rec.doctor}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-200 pt-1 line-clamp-2">
                  {rec.summary}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400">{rec.fileName}</span>
              <button
                onClick={() => setSelectedRecord(rec)}
                className="px-3 py-1.5 rounded-xl font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedRecord.title}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Date:</strong> {selectedRecord.date}</p>
              <p><strong>Category:</strong> {selectedRecord.category}</p>
              <p><strong>Facility:</strong> {selectedRecord.hospital}</p>
              <p><strong>Attending Doctor:</strong> {selectedRecord.doctor}</p>
              <p><strong>Document ID:</strong> {selectedRecord.fileName}</p>

              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Record Summary:</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedRecord.summary}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading archived record: ${selectedRecord.fileName}`);
                }}
                className="px-4 py-2 rounded-xl font-bold bg-teal-600 text-white border border-teal-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Archive PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
