import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Mail,
  Video,
  Send,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  User,
  MessageSquare,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Wifi,
  Laptop
} from 'lucide-react';
import { Doctor, PatientProfile, AuthUser, DoctorMessage } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';
import {
  getStoredDoctorMessages,
  sendDoctorMessage,
  syncDoctorMessagesFromServer
} from '../../services/doctorMessaging';

interface ContactPageProps {
  doctors: Doctor[];
  patient?: PatientProfile;
  currentUser?: AuthUser | null;
  preselectedDoctorId?: string;
  onStartConsultation: (doctor?: Doctor) => void;
  onNavigate?: (section: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  doctors,
  patient,
  currentUser,
  preselectedDoctorId,
  onStartConsultation,
  onNavigate
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctorId || 'clinic'
  );

  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
    }
  }, [preselectedDoctorId]);

  const activeDoc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  const [senderName, setSenderName] = useState(
    currentUser?.name || patient?.fullName || ''
  );
  const [senderEmail, setSenderEmail] = useState(
    currentUser?.email || patient?.email || ''
  );
  const [senderPhone, setSenderPhone] = useState(patient?.phone || '');
  const [subject, setSubject] = useState('Laboratory Report Simplification Question');
  const [urgency, setUrgency] = useState<'routine' | 'urgent' | 'question'>('question');
  const [messageText, setMessageText] = useState('');
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [messageViewScope, setMessageViewScope] = useState<'all' | 'my'>('all');

  // Messages list state (synced with doctorMessaging service)
  const [messages, setMessages] = useState<DoctorMessage[]>(() => getStoredDoctorMessages());

  useEffect(() => {
    const refresh = () => setMessages(getStoredDoctorMessages());
    window.addEventListener('hc_messages_updated', refresh);
    // Background sync on mount
    syncDoctorMessagesFromServer().then((latest) => setMessages(latest));

    // Continuous poll for real-time cross-device messaging
    const timer = setInterval(() => {
      syncDoctorMessagesFromServer().then((latest) => setMessages(latest));
    }, 3000);

    return () => {
      window.removeEventListener('hc_messages_updated', refresh);
      clearInterval(timer);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const latest = await syncDoctorMessagesFromServer();
      setMessages(latest);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Update sender info if patient or currentUser changes
  useEffect(() => {
    if (!senderName) setSenderName(currentUser?.name || patient?.fullName || '');
    if (!senderEmail) setSenderEmail(currentUser?.email || patient?.email || '');
  }, [currentUser, patient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const recipientDoctor = doctors.find((d) => d.id === selectedDoctorId);
    const doctorName = recipientDoctor
      ? recipientDoctor.name
      : 'Clinic Care Coordinator & Attending Doctors';
    const hospital = recipientDoctor?.hospital || 'Apollo Health City Hospital';

    sendDoctorMessage({
      senderName: senderName || 'Patient',
      senderEmail: senderEmail || 'patient@healthcompanion.ai',
      senderPhone,
      doctorId: selectedDoctorId,
      doctorName,
      hospital,
      subject,
      urgency,
      message: messageText
    });

    setSentNotice(
      `Message successfully delivered to ${doctorName}! It is now synchronized and visible in their clinical portal across all devices.`
    );
    setMessageText('');
    setMessages(getStoredDoctorMessages());

    setTimeout(() => {
      setSentNotice(null);
    }, 6000);
  };

  // Filter messages sent by or relevant to this patient
  const userMessages = messages.filter((m) => {
    if (messageViewScope === 'all') return true;
    if (senderEmail && m.senderEmail.toLowerCase() === senderEmail.toLowerCase()) {
      return true;
    }
    if (senderName && m.senderName.toLowerCase() === senderName.toLowerCase()) {
      return true;
    }
    return false;
  });

  return (
    <div id="contact-section" className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Direct Doctor & Clinic Messaging
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Real-time Physician Inbox
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Doctors & Clinic
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Send direct messages, report queries, and prescription questions directly to your attending doctor's profile and clinic account.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Featured Attending Specialist Contact Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-300 font-extrabold text-base">
              {activeDoc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeDoc.name}
                </h2>
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                {activeDoc.specialty} • {activeDoc.hospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Doctor Accepting Messages
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">Clinic Contact Line:</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {activeDoc.phone}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">Doctor Portal Email:</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              {activeDoc.email}
            </p>
          </div>
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-slate-400 font-medium">Consulting Hours:</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              Mon – Fri: 09:00 AM – 04:00 PM
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('message-composer-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Write Message to Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => onStartConsultation(activeDoc)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 shadow-xs flex items-center gap-2 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span>Book Appointment with {activeDoc.name}</span>
          </button>
        </div>
      </div>

      {/* Main Send Message Form */}
      <div
        id="message-composer-form"
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-600" />
              Send Patient Inquiry to Doctor or Clinic
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your message is routed directly to the recipient doctor's clinical dashboard and account.
            </p>
          </div>
        </div>

        {sentNotice && (
          <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold">{sentNotice}</p>
              <p className="text-[11px] font-normal text-green-700 dark:text-green-300 mt-0.5">
                The doctor will receive notification in their physician portal queue.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Recipient Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Recipient Doctor / Clinic:
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
            >
              <option value="clinic">
                🏥 Clinic Care Team & All Attending Physicians
              </option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  👨‍⚕️ {doc.name} — {doc.specialty} ({doc.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@healthcompanion.ai"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Subject & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="question">Report Clarification</option>
                <option value="routine">Routine Question</option>
                <option value="urgent">Urgent Clinical Query</option>
              </select>
            </div>
          </div>

          {/* Message Text */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Your Message or Question for the Doctor:
              </label>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400">Quick template:</span>
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      'Hello Doctor, I uploaded my medical report. Please review it.'
                    )
                  }
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                >
                  "Hello Doctor, I uploaded my medical report. Please review it."
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Describe your question regarding your recent laboratory results, symptoms, or medication instructions..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Transmitted directly into doctor's verified portal queue</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to Doctor</span>
            </button>
          </div>
        </form>
      </div>

      {/* Patient Message History & Doctor Responses */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Clinic & Doctor Message History
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
                <Laptop className="w-3 h-3 text-emerald-500" />
                Cross-Device Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Messages and doctor replies synchronize automatically in real time across all connected laptops and devices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setMessageViewScope('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  messageViewScope === 'all'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Messages ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setMessageViewScope('my')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  messageViewScope === 'my'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                My Inquiries
              </button>
            </div>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              title="Synchronize latest messages from server"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {userMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold">No messages sent yet.</p>
            <p>Use the form above to send an inquiry directly to your doctor.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {msg.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          msg.status === 'replied'
                            ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                            : msg.status === 'read'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {msg.status === 'replied'
                          ? '✓ Doctor Replied'
                          : msg.status === 'read'
                          ? 'Seen by Doctor'
                          : 'Delivered to Doctor'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      To: <strong>{msg.doctorName}</strong> ({msg.hospital})
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] uppercase mb-1">
                    Your Sent Message:
                  </p>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>

                {/* Doctor's Verified Reply */}
                {msg.reply && (
                  <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-teal-900 dark:text-teal-200 font-bold">
                        <Stethoscope className="w-4 h-4 text-teal-600" />
                        <span>Doctor's Clinical Reply ({msg.reply.doctorName}):</span>
                      </div>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                        {msg.reply.repliedAt}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap italic">
                      "{msg.reply.text}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
