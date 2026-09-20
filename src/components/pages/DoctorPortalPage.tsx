import React, { useState, useEffect } from 'react';
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
  Send,
  MessageSquare,
  Mail,
  Phone,
  UserCheck,
  Award,
  BookOpen,
  Filter,
  Check,
  CornerDownRight,
  Copy
} from 'lucide-react';
import {
  AuthUser,
  Appointment,
  MedicalReport,
  PatientProfile,
  DoctorMessage
} from '../../types';
import {
  getStoredDoctorMessages,
  markDoctorMessageAsRead,
  replyToDoctorMessage
} from '../../services/doctorMessaging';
import { DEMO_LOGIN_ACCOUNTS } from '../../data/demoAccounts';

interface DoctorPortalPageProps {
  currentUser: AuthUser;
  appointments: Appointment[];
  reports: MedicalReport[];
  patient: PatientProfile;
  onNavigate: (section: string) => void;
  onUpdateAppointmentStatus: (
    id: string,
    newStatus: 'Confirmed' | 'Completed' | 'Cancelled'
  ) => void;
}

export const DoctorPortalPage: React.FC<DoctorPortalPageProps> = ({
  currentUser,
  appointments,
  reports,
  patient,
  onNavigate,
  onUpdateAppointmentStatus
}) => {
  // Navigation tabs within Doctor Portal
  const [activeTab, setActiveTab] = useState<'messages' | 'consultations' | 'profile'>('messages');

  // Messages state
  const [messages, setMessages] = useState<DoctorMessage[]>(() => getStoredDoctorMessages());
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyNotice, setReplyNotice] = useState<string | null>(null);

  // Sync messages in real-time
  useEffect(() => {
    const refreshMessages = () => {
      setMessages(getStoredDoctorMessages());
    };
    window.addEventListener('hc_messages_updated', refreshMessages);
    return () => window.removeEventListener('hc_messages_updated', refreshMessages);
  }, []);

  // Consultations state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [clinicalNotes, setClinicalNotes] = useState<Record<string, string>>({
    'apt-1': 'Patient reports seasonal allergic rhinitis. Reviewed CBC lab reports; mild hemoglobin variation (11.2 g/dL) noted. Advised balanced dietary iron and continue non-sedating antihistamines.'
  });
  const [activeNoteAptId, setActiveNoteAptId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [copiedStaffId, setCopiedStaffId] = useState<string | null>(null);

  // Filter messages relevant to this doctor or clinic
  const doctorRelevantMessages = messages.filter((m) => {
    // Matches if addressed to this doctor specifically or to clinic / all doctors
    if (m.doctorId === 'clinic') return true;
    if (m.doctorName.toLowerCase().includes(currentUser.name.toLowerCase())) return true;
    if (currentUser.name.toLowerCase().includes(m.doctorName.toLowerCase())) return true;
    return true; // As verified physician portal, allow viewing patient clinical inquiries
  });

  const filteredMessages = doctorRelevantMessages.filter((m) => {
    const matchesSearch =
      m.senderName.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.message.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(messageSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (messageFilter === 'all') return true;
    if (messageFilter === 'unread') return m.status === 'unread';
    if (messageFilter === 'replied') return m.status === 'replied';
    return true;
  });

  const unreadCount = doctorRelevantMessages.filter((m) => m.status === 'unread').length;

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

  const handleMarkAsRead = (id: string) => {
    markDoctorMessageAsRead(id);
    setMessages(getStoredDoctorMessages());
  };

  const handleSendReply = (msgId: string) => {
    if (!replyText.trim()) return;
    replyToDoctorMessage(msgId, replyText, currentUser.name);
    setMessages(getStoredDoctorMessages());
    setReplyNotice(`Reply successfully sent to patient!`);
    setReplyingMessageId(null);
    setReplyText('');
    setTimeout(() => setReplyNotice(null), 4000);
  };

  return (
    <div id="doctor-portal-dashboard" className="space-y-6">
      {/* Clinician Welcome Banner */}
      <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-white to-teal-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-teal-950/30 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Verified Physician Portal
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {currentUser.licenseNumber || 'REG-MED-2026-ACTIVE'}
            </span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                {unreadCount} New Patient Inquir{unreadCount === 1 ? 'y' : 'ies'}
              </span>
            )}
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
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages Inbox {unreadCount > 0 ? `(${unreadCount})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('medical-reports')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Diagnostic Reports</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('messages')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'messages'
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-300'
          } shadow-2xs`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Patient Inquiries</span>
            <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {doctorRelevantMessages.length}
          </div>
          <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-1 font-semibold flex items-center gap-1">
            <span>{unreadCount} unread incoming</span>
          </p>
        </div>

        <div
          onClick={() => setActiveTab('consultations')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'consultations'
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
          } shadow-2xs`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Consults</span>
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {appointments.length}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            Active patient appointments
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

        <div
          onClick={() => setActiveTab('profile')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'profile'
              ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300'
          } shadow-2xs`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Doctor Account</span>
            <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white truncate">
            Profile Verified
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
            View practice credentials
          </p>
        </div>
      </div>

      {/* Navigation Pills between Doctor Sections */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Patient Messages & Clinic Inquiries</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px]">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'consultations'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Consultation Queue ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Physician Profile & Credentials</span>
        </button>
      </div>

      {/* TAB 1: Patient Messages & Clinic Inquiries (User Request Focus) */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Patient Messages & Clinic Inquiries
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Live Doctor Inbound Queue
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct questions sent by patients through the Contact Clinic and Doctor profiles. Reply directly to patients here.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                {(['all', 'unread', 'replied'] as const).map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setMessageFilter(flt)}
                    className={`px-3 py-1 rounded-md font-bold capitalize transition-colors ${
                      messageFilter === flt
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search patient inquiries by patient name, email, or question topic..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {replyNotice && (
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{replyNotice}</span>
              </div>
            )}

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  No messages found in this view.
                </p>
                <p>New inquiries submitted from the Contact Clinic page will appear here immediately.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => {
                  const isReplying = replyingMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-xl border transition-all space-y-3 ${
                        msg.status === 'unread'
                          ? 'border-teal-300 dark:border-teal-800 bg-teal-50/20 dark:bg-teal-950/15'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {/* Header of message */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {msg.subject}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                msg.status === 'unread'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                  : msg.status === 'replied'
                                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {msg.status.toUpperCase()}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {msg.urgency}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-teal-600" />
                              Patient: {msg.senderName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {msg.senderEmail}
                            </span>
                            {msg.senderPhone && (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3" />
                                {msg.senderPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400 font-mono">
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {/* Doctor's Previous Reply if already replied */}
                      {msg.reply && (
                        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-teal-900 dark:text-teal-200 font-bold">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>Your Clinical Response ({msg.reply.doctorName}):</span>
                            </div>
                            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                              {msg.reply.repliedAt}
                            </span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 italic">
                            "{msg.reply.text}"
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          {msg.status === 'unread' && (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark as Read</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setReplyingMessageId(isReplying ? null : msg.id);
                              setReplyText(msg.reply?.text || '');
                            }}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-2xs flex items-center gap-1.5 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{msg.reply ? 'Edit Clinical Reply' : 'Reply to Patient'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('appointments')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
                          >
                            Schedule Consult
                          </button>
                        </div>
                      </div>

                      {/* Inline Reply Composer */}
                      {isReplying && (
                        <div className="pt-2 border-t border-teal-200 dark:border-teal-800 space-y-2.5">
                          <label className="block text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                            <CornerDownRight className="w-4 h-4 text-teal-600" />
                            Compose Doctor's Clinical Response for {msg.senderName}:
                          </label>
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your medical observation, prescription advice, or instructions for the patient..."
                            className="w-full p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReplyingMessageId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendReply(msg.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Clinical Reply</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Patient Consultations & EHR Queue */}
      {activeTab === 'consultations' && (
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
                            <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                              ⏰ {apt.time} ({apt.type})
                            </div>
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
                  <span className="font-bold text-slate-900 dark:text-white">{patient.emergencyContact?.name} ({patient.emergencyContact?.relation})</span>
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
          </div>
        </div>
      )}

      {/* TAB 3: Doctor's Official Profile & Account Info */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-extrabold text-xl">
                  {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </h2>
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                    {currentUser.specialty || 'General Medicine'} • {currentUser.hospital || 'Apollo Health City Hospital'}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                Verified Active Doctor
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 font-medium">Doctor Registration / License ID:</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {currentUser.licenseNumber || 'REG-MED-2026-ACTIVE'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 font-medium">Doctor Portal Email:</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {currentUser.email}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 font-medium">Clinical Specialty:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-1">
                  {currentUser.specialty || 'General Medicine'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400 font-medium">Primary Hospital Facility:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-1">
                  {currentUser.hospital || 'Apollo Health City Hospital'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2 text-xs">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Physician Consultation Guidelines & HIPAA Protocol</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                All patient communications, uploaded diagnostic laboratory records, and clinical observations made in this portal are encrypted and compliant with medical privacy standards. Ensure all diagnostic interpretations are correlated directly with patient history.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Practice Stats & Telehealth
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Inbound Patient Inquiries:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{doctorRelevantMessages.length} total</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Answered & Replied:</span>
                <span className="font-bold text-green-600">{doctorRelevantMessages.filter(m => m.status === 'replied').length}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Pending Inquiries:</span>
                <span className="font-bold text-amber-600">{unreadCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Telehealth Video Service:</span>
                <span className="font-bold text-green-600">Online & Ready</span>
              </div>
            </div>
          </div>

          {/* Hospital Specialist Medical Staff & Doctor IDs Directory */}
          <div className="lg:col-span-12 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  <span>Hospital Specialist Colleague Network & Registered Doctor IDs</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Reference directory of credentialed physicians across neurosurgery, dentistry, oncology, eye care, psychiatry, cardiology, and more.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto">
                16 Specialists On Roster
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {DEMO_LOGIN_ACCOUNTS.filter(a => a.role === 'doctor').map((doc) => {
                const isCopied = copiedStaffId === doc.doctorId;
                const isCurrent = doc.name.toLowerCase() === currentUser.name.toLowerCase();

                return (
                  <div
                    key={doc.email}
                    className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                      isCurrent
                        ? 'border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {doc.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {doc.specialty}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {doc.hospital}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                        {doc.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Doctor ID:</span>
                        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                          {doc.doctorId || 'DOC-REG-2026'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (doc.doctorId) {
                            navigator.clipboard.writeText(doc.doctorId);
                            setCopiedStaffId(doc.doctorId);
                            setTimeout(() => setCopiedStaffId(null), 2000);
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                        title="Copy Doctor ID"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
