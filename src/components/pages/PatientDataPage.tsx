import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  Edit3,
  CheckCircle2,
  Shield,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { PatientProfile, MedicalHistory, LifestyleInfo } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface PatientDataPageProps {
  patient: PatientProfile;
  medicalHistory: MedicalHistory;
  lifestyle: LifestyleInfo;
  onUpdatePatient: (updated: PatientProfile) => void;
  onUpdateHistory: (updated: MedicalHistory) => void;
  onUpdateLifestyle: (updated: LifestyleInfo) => void;
}

export const PatientDataPage: React.FC<PatientDataPageProps> = ({
  patient,
  medicalHistory,
  lifestyle,
  onUpdatePatient
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState<PatientProfile>(patient);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient(formData);
    setIsEditingProfile(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div id="patient-data-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Personal Health Record (PHR)
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Demo Patient File
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Patient Health Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Organized clinical history, verified allergies, active medications, and baseline lifestyle parameters.
          </p>
        </div>

        <button
          id="edit-patient-profile-btn"
          onClick={() => {
            setFormData(patient);
            setIsEditingProfile(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Information</span>
        </button>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Saved Toast */}
      {showSavedToast && (
        <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Patient information saved successfully.</span>
        </div>
      )}

      {/* SECTION 1: Patient Information */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <User className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Patient Demographics & Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Full Name</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.fullName}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Date of Birth / Age</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.dob} ({patient.age} years)</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Gender & Blood Group</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.gender} • {patient.bloodGroup}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Phone Number</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" /> {patient.phone}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Email Address</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" /> {patient.email}
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Emergency Contact</span>
            <p className="text-sm font-bold text-red-700 dark:text-red-400 mt-0.5">
              {patient.emergencyContact.name} ({patient.emergencyContact.relation})
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{patient.emergencyContact.phone}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Medical History */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Heart className="w-5 h-5 text-red-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Medical History & Current Medications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Active Conditions */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Previous & Chronic Conditions
            </h3>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
              {medicalHistory.conditions.map((cond, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Allergies (Red Badge) */}
          <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-2">
            <h3 className="font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Documented Allergies
            </h3>
            <ul className="space-y-1 text-red-800 dark:text-red-300 font-semibold">
              {medicalHistory.allergies.map((allg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{allg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Medications */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2 md:col-span-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Current Medications & Prescriptions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {medicalHistory.currentMedications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{med.name}</span>
                    <span className="font-mono text-teal-700 dark:text-teal-300 font-bold">{med.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{med.frequency}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-0.5">Purpose: {med.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Procedures & Hospital Visits */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Past Procedures</h3>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              {medicalHistory.procedures.map((proc, idx) => (
                <li key={idx}>
                  <strong>{proc.name}</strong> ({proc.year}) — {proc.hospital}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Hospital Visits</h3>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              {medicalHistory.hospitalVisits.map((vis, idx) => (
                <li key={idx}>
                  <strong>{vis.reason}</strong> on {vis.date} ({vis.hospital})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3: Lifestyle & Wellness */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Activity className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Lifestyle & Behavioral Factors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Physical Activity</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{lifestyle.activity}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Sleep Pattern</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{lifestyle.sleep}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Dietary Pattern</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{lifestyle.diet}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Tobacco / Smoking</span>
            <p className="font-bold text-slate-900 dark:text-white mt-1">{lifestyle.smokingStatus}</p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Alcohol Consumption</span>
            <p className="font-bold text-slate-900 dark:text-white mt-1">{lifestyle.alcoholStatus}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Patient Profile
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-teal-600 text-white border border-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
