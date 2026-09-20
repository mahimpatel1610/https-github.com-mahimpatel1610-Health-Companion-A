import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  Video,
  Send,
  Building2,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Doctor } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface ContactPageProps {
  doctors: Doctor[];
  onStartConsultation: (doctor: Doctor) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  doctors,
  onStartConsultation
}) => {
  const primaryDoc = doctors[0];
  const [formSent, setFormSent] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [subject, setSubject] = useState('Laboratory Report Simplification Question');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setMessageText('');
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <div id="contact-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Direct Healthcare Outreach
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Demo Contact Channel
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Doctors & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Reach out to attending medical professionals, coordinate appointments, or contact technical patient platform support.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Primary Doctor Consultation Contact Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-300 font-extrabold text-base">
              AS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {primaryDoc.name}
                </h2>
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                {primaryDoc.specialty} • {primaryDoc.hospital}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Demo Contact
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">Phone (Demo):</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              +91 98110 54321
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">Email (Demo):</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              ananya.sharma@apollo-health.demo
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">OPD Consulting Hours:</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              Mon – Fri: 09:00 AM – 01:00 PM
            </p>
          </div>
        </div>

        {/* 3 Quick Doctor Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => alert('Simulated Call: Dialing +91 98110 54321 (Demo Phone)')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Clinic (Demo)</span>
          </button>

          <button
            onClick={() => alert('Simulated Email: Composing email to ananya.sharma@apollo-health.demo')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Send Email (Demo)</span>
          </button>

          <button
            onClick={() => onStartConsultation(primaryDoc)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 shadow-xs flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Start Online Teleconsult</span>
          </button>
        </div>
      </div>

      {/* Support Message Form */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Send Patient Query or Support Message
        </h2>

        {formSent && (
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your message has been dispatched to the attending coordinator.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Message
            </label>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Describe your question regarding your report, prescription guidance, or doctor schedule..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};
