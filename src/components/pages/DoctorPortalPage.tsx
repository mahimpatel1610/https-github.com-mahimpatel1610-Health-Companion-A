import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  ShieldCheck,
  Video,
  Hospital,
  Activity,
  Plus,
  Send
} from 'lucide-react';
import { AuthUser, Appointment, MedicalReport, PatientProfile } from '../../types';

interface DoctorPortalPageProps {
  currentUser: AuthUser;
  appointments: Appointment[];
  reports: MedicalReport[];
  patient: PatientProfile;
  onNavigate: (section: string) => void;
  onUpdateAppointmentStatus: (id: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => void;
}

export const DoctorPortalPage: React.FC<DoctorPortalPageProps> = ({
  currentUser,
  appointments,
  reports,
  patient,
  onNavigate,
  onUpdateAppointmentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [clinicalNotes, setClinicalNotes] = useState<Record<string, string>>({
    'apt-1': 'Patient reports seasonal allergic rhinitis. Reviewed CBC lab reports; mild hemoglobin variation (11.2 g/dL) noted. Advised balanced dietary iron and continue non-sedating antihistamines.'
  });
  const [activeNoteAptId, setActiveNoteAptId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Filter doctor appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    return apt.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleOpenNoteModal = (apt: Appointment) => {
    setActiveNoteAptId(apt.id);
    setTempNoteText(clinicalNotes[apt.id] || '');
  };

  const handleSaveNote = () => {
    if (!activeNoteAptId) return;
    setClinicalNotes((prev) => ({ ...prev, [activeNoteAptId]: tempNoteText }));
    setSavedSuccess(activeNoteAptId);
    setActiveNoteAptId(null);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  return (
    <div id="doctor-portal-dashboard" className="space-y-6">
      {/* Clinician Welcome Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-white to-teal-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-teal-950/20 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Verified Physician Portal
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {currentUser.licenseNumber || 'REG-MED-2026-ACTIVE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {currentUser.specialty || 'General Medicine'} • {currentUser.hospital || 'Apollo Health City Hospital'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('appointments')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 transition-colors"
          >
            All Appointments
          </button>
          <button
            onClick={() => onNavigate('medical-reports')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Review Diagnostic Reports</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Consults</span>
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {appointments.length}
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
            2 confirmed for today & this week
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Patient</span>
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white truncate">
            {patient.fullName}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {patient.age} yrs • Blood Group {patient.bloodGroup}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Reports</span>
            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {reports.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            With verified reference checks
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Telehealth Status</span>
            <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-extrabold text-green-600 dark:text-green-400">
            Active
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Ready for encrypted video calls
          </p>
        </div>
      </div>

      {/* Main Grid: Consultations & Quick Patient Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Consultation Manager (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Patient Consultation Queue
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update consultation status, prescribe clinical observations, and enter physician notes.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                {(['all', 'confirmed', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-md font-bold capitalize transition-colors ${
                      selectedFilter === filter
                        ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient consultations by doctor, reason, or location..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Clinical consult notes successfully saved to EHR record.</span>
              </div>
            )}

            {/* Consultation Cards */}
            <div className="space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No appointments match the current filter.
                </div>
              ) : (
                filteredAppointments.map((apt) => {
                  const hasNote = !!clinicalNotes[apt.id];

                  return (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/40 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {apt.reason}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                                apt.status === 'Confirmed'
                                  ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                                  : apt.status === 'Completed'
                                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Patient: <strong>{patient.fullName}</strong> • Attending: {apt.doctorName} ({apt.specialty})
                          </p>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 sm:text-right font-medium">
                          <div>📅 {apt.date}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-bold">⏰ {apt.time} ({apt.type})</div>
                        </div>
                      </div>

                      {/* Doctor Clinical Notes Preview */}
                      {hasNote && (
                        <div className="p-2.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200 font-bold">
                            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Physician Clinical Impression:</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 italic">
                            "{clinicalNotes[apt.id]}"
                          </p>
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenNoteModal(apt)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{hasNote ? 'Edit Clinical Note' : 'Add Clinical Note'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {apt.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Consult Completed</span>
                            </button>
                          )}
                          {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Cancelled')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-800"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Patient Medical Dossier (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Assigned Patient Overview
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.fullName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Age & Gender:</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.age} yrs • {patient.gender}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{patient.bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Known Allergies:</span>
                <span className="font-bold text-red-600 dark:text-red-400">Penicillin, Dust mites</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('patient-data')}
                className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Medical Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Diagnostics Review Box */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Latest Laboratory Panel
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hemoglobin (11.2 g/dL) is flagged for follow-up review. Fasting blood glucose (92 mg/dL) and total cholesterol (185 mg/dL) are optimal.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('medical-reports')}
              className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
            >
              Examine Full Lab Report
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Note Modal Dialog */}
      {activeNoteAptId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Add Physician Clinical Impression
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoteAptId(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter your clinical assessment, dietary counseling, or follow-up instructions for the patient:
            </p>

            <textarea
              rows={4}
              value={tempNoteText}
              onChange={(e) => setTempNoteText(e.target.value)}
              placeholder="e.g. Discussed lab findings. Advised repeat CBC in 3 months and iron-rich nutrition..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveNoteAptId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save to EHR Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
