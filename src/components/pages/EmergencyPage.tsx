import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Building2,
  BellRing,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface EmergencyPageProps {
  patient: PatientProfile;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ patient }) => {
  const [dispatchedAlert, setDispatchedAlert] = useState(false);
  const [dialModalNumber, setDialModalNumber] = useState<string | null>(null);

  const handleNotifyContact = () => {
    setDispatchedAlert(true);
    setTimeout(() => setDispatchedAlert(false), 5000);
  };

  return (
    <div id="emergency-section" className="space-y-6">
      {/* High-Visibility Emergency Header Card */}
      <div className="p-6 rounded-2xl border-2 border-red-500 dark:border-red-600 bg-red-600 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/20">
              Immediate Critical Care Assistance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Emergency Healthcare Services
            </h1>
          </div>
        </div>

        <p className="text-sm text-red-50 leading-relaxed font-medium">
          If you are experiencing severe chest pain, shortness of breath, loss of consciousness, uncontrolled bleeding, or any life-threatening symptoms, please contact emergency dispatch immediately or proceed to the nearest emergency department.
        </p>

        {/* Big Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="emergency-call-112-btn"
            onClick={() => setDialModalNumber('112')}
            className="px-6 py-3 rounded-xl font-extrabold text-sm bg-white text-red-700 hover:bg-red-50 shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-red-600" />
            <span>Call 112 (National Emergency)</span>
          </button>

          <button
            id="emergency-call-911-btn"
            onClick={() => setDialModalNumber('911')}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-red-700/80 hover:bg-red-800 text-white border border-red-400/50 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>US / Canada: 911</span>
          </button>

          <button
            id="emergency-notify-contact-btn"
            onClick={handleNotifyContact}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-red-800/80 hover:bg-red-900 text-white border border-red-400/50 flex items-center gap-2"
          >
            <BellRing className="w-4 h-4 text-amber-300" />
            <span>Alert Emergency Contact</span>
          </button>
        </div>
      </div>

      {/* Dispatched Notification Banner */}
      {dispatchedAlert && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <strong>Emergency Alert Sent: </strong>
            Notification with your location and baseline blood group ({patient.bloodGroup}) dispatched to {patient.emergencyContact.name} ({patient.emergencyContact.phone}).
          </div>
        </div>
      )}

      {/* Two Columns: Nearby Hospitals and Designated Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Designated Emergency Contact */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <PhoneCall className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Primary Emergency Contact
            </h2>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {patient.emergencyContact.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold border border-red-200 dark:border-red-800">
                {patient.emergencyContact.relation}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-mono font-bold text-sm">
              {patient.emergencyContact.phone}
            </p>
            <p className="text-slate-500 pt-1">
              Authorized to receive urgent medical updates and grant immediate surrogate consent.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setDialModalNumber(patient.emergencyContact.phone)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>Call {patient.emergencyContact.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nearest Medical Trauma Centers (Simulated locator) */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Nearby 24x7 Emergency Departments
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                name: 'Apollo Hospital — 24/7 Emergency Wing',
                distance: '1.8 km (6 mins)',
                address: 'Sarita Vihar, Mathura Road',
                phone: '+91 11 2692 5858'
              },
              {
                name: 'Max Super Speciality Hospital Trauma Center',
                distance: '3.2 km (11 mins)',
                address: 'Press Enclave Road, Saket',
                phone: '+91 11 2651 5050'
              },
              {
                name: 'All India Institute of Medical Sciences (AIIMS)',
                distance: '5.4 km (15 mins)',
                address: 'Sri Aurobindo Marg, Ansari Nagar',
                phone: '+91 11 2658 8500'
              }
            ].map((hosp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{hosp.name}</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400 shrink-0">
                    {hosp.distance}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{hosp.address}</span>
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{hosp.phone}</span>
                  <button
                    onClick={() => setDialModalNumber(hosp.phone)}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Call Wing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Dial Confirmation Modal */}
      {dialModalNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-600">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Initiate Emergency Call
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You are about to dial:
              </p>
              <p className="text-xl font-mono font-extrabold text-red-600 mt-1">
                {dialModalNumber}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2 text-xs">
              <button
                onClick={() => setDialModalNumber(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <a
                href={`tel:${dialModalNumber}`}
                onClick={() => setDialModalNumber(null)}
                className="px-5 py-2 rounded-xl font-bold bg-red-600 text-white shadow-xs"
              >
                Confirm Call
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
