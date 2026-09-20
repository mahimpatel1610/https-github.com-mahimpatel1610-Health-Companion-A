import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Video,
  User,
  Plus,
  CheckCircle2,
  X,
  RotateCcw,
  CalendarCheck2,
  FileText,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Phone,
  Printer,
  Download,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Appointment, Doctor, PatientProfile } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface AppointmentsPageProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patient?: PatientProfile;
  onAddAppointment: (apt: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  initialSelectedDepartment?: string;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  appointments,
  doctors,
  patient,
  onAddAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
  initialSelectedDepartment
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'book' | 'history'>(
    initialSelectedDepartment ? 'book' : 'upcoming'
  );

  // Modals & Active Views
  const [activeCallApt, setActiveCallApt] = useState<Appointment | null>(null);
  const [viewPassApt, setViewPassApt] = useState<Appointment | null>(null);

  // Booking Form State
  const [selectedDept, setSelectedDept] = useState(
    initialSelectedDepartment || 'General Medicine & Hematology'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-28');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [consultType, setConsultType] = useState<'In-person' | 'Online'>('Online');
  const [reason, setReason] = useState('Review recent hemoglobin and complete blood count diagnostic report');
  const [bookingSuccessApt, setBookingSuccessApt] = useState<Appointment | null>(null);

  // Reschedule State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-09-30');
  const [rescheduleTime, setRescheduleTime] = useState('02:00 PM');

  // Filter doctors by selected department or default
  const filteredDoctors = doctors.filter(
    (d) =>
      !selectedDept ||
      d.specialty.toLowerCase().includes(selectedDept.toLowerCase().split('/')[0].trim()) ||
      selectedDept.toLowerCase().includes(d.specialty.toLowerCase().split('&')[0].trim())
  );
  const activeDoctorList = filteredDoctors.length > 0 ? filteredDoctors : doctors;
  const currentDoctor =
    doctors.find((d) => d.id === selectedDoctorId) || activeDoctorList[0] || doctors[0];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === selectedDoctorId) || activeDoctorList[0];

    const tokenNum = Math.floor(10 + Math.random() * 90);
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      date: new Date(selectedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: selectedTime,
      hospital: doc.hospital,
      type: consultType,
      status: 'Confirmed',
      reason,
      notes: `Assigned Clinic Room ${Math.floor(200 + Math.random() * 100)}, OPD Wing. Queue Token #${tokenNum}. Please arrive 15 minutes prior for preliminary vitals triage.`
    };

    onAddAppointment(newApt);
    setBookingSuccessApt(newApt);
    setActiveTab('upcoming');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleApt) return;
    const formatted = new Date(rescheduleDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    onRescheduleAppointment(rescheduleApt.id, formatted, rescheduleTime);
    setRescheduleApt(null);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const historyAppointments = appointments.filter((a) => a.status !== 'Confirmed');

  return (
    <div id="appointments-section" className="space-y-6 max-w-full">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Clinical Appointments & Consultations
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              EHR Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Consultations Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Book appointments with specialist clinicians, join high-definition virtual teleconsultations, and review complete consultation passes and preparation checklists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="book-consultation-quick-btn"
            onClick={() => {
              setBookingSuccessApt(null);
              setActiveTab('book');
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* 2. Primary Top Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          id="tab-upcoming-appointments"
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Scheduled Consultations</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'upcoming'
                ? 'bg-white/20 text-white'
                : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
            }`}
          >
            {upcomingAppointments.length}
          </span>
        </button>

        <button
          id="tab-book-appointment"
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'book'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>

        <button
          id="tab-history-appointments"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Past Visits & Cancelled</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'history'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {historyAppointments.length}
          </span>
        </button>
      </div>

      {/* 3. TAB 1: UPCOMING APPOINTMENTS LIST WITH 100% COMPLETE DETAILS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {bookingSuccessApt && (
            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 flex items-start justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-green-900 dark:text-green-100">
                    Appointment Successfully Booked!
                  </h4>
                  <p className="text-xs text-green-800 dark:text-green-200 mt-0.5">
                    Your appointment with <strong>{bookingSuccessApt.doctorName}</strong> on <strong>{bookingSuccessApt.date}</strong> at <strong>{bookingSuccessApt.time}</strong> is confirmed.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookingSuccessApt(null)}
                className="text-green-700 hover:text-green-900 dark:text-green-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {upcomingAppointments.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 space-y-3">
              <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Upcoming Consultations Scheduled
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                You do not have any pending clinical visits or teleconsultations. Click below to book an appointment with our specialist medical doctors.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Book Consultation Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  id={`appointment-card-${apt.id}`}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between overflow-hidden hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-300 font-extrabold text-sm shrink-0 shadow-2xs">
                          {apt.doctorName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(1, 3)
                            .join('') || 'DR'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                              {apt.doctorName}
                            </h3>
                            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          </div>
                          <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold truncate">
                            {apt.specialty}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                            <span>{apt.hospital}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-green-50 dark:bg-green-950/70 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{apt.status}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Ref: {apt.id.slice(0, 12)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body with Detailed Grid */}
                  <div className="p-5 space-y-3.5 flex-1">
                    {/* Time & Location Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CalendarIcon className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Date</div>
                          <div className="font-semibold">{apt.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Time Slot</div>
                          <div className="font-semibold">{apt.time}</div>
                        </div>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          {apt.type === 'Online' ? (
                            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                              <Video className="w-4 h-4" />
                              <span>Online HD Teleconsultation</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                              <Building2 className="w-4 h-4 text-teal-600" />
                              <span>In-Person Clinic Visit (Room 304, OPD)</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                          Token #14
                        </span>
                      </div>
                    </div>

                    {/* Patient and Reason */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Patient:</strong>{' '}
                        {patient?.fullName || 'Rahul Sharma'} (Age {patient?.age || 38} • {patient?.bloodGroup || 'B+'})
                      </div>
                      <div className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Reason for Visit:</strong>{' '}
                        <span>{apt.reason}</span>
                      </div>
                    </div>

                    {/* Pre-Consultation Checklist */}
                    <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-[11px] text-teal-900 dark:text-teal-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-teal-800 dark:text-teal-300">
                        <Info className="w-3.5 h-3.5" />
                        <span>Pre-Consultation Preparation Instructions</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <li>Please have your recent laboratory reports (Hemoglobin & Metabolic) ready.</li>
                        <li>For online teleconsultations, ensure camera and microphone access are enabled.</li>
                        <li>Arrive or join 10 minutes prior for queue triage check.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-wrap items-center gap-2">
                    {apt.type === 'Online' ? (
                      <button
                        id={`join-consultation-btn-${apt.id}`}
                        onClick={() => setActiveCallApt(apt)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Teleconsult</span>
                      </button>
                    ) : (
                      <button
                        id={`view-pass-btn-${apt.id}`}
                        onClick={() => setViewPassApt(apt)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Clinic Pass</span>
                      </button>
                    )}

                    <button
                      id={`view-full-details-btn-${apt.id}`}
                      onClick={() => setViewPassApt(apt)}
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Full Details</span>
                    </button>

                    <button
                      id={`reschedule-btn-${apt.id}`}
                      onClick={() => setRescheduleApt(apt)}
                      className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      id={`cancel-btn-${apt.id}`}
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel your consultation with ${apt.doctorName}?`)) {
                          onCancelAppointment(apt.id);
                        }
                      }}
                      className="py-2 px-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: IN-PAGE FULL BOOKING STUDIO */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Booking Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-teal-600" />
                <span>Book a Medical Specialist Consultation</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your medical specialty, qualified physician, and convenient appointment slot.
              </p>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              {/* Department */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Select Clinical Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    // auto select first doctor of dept
                    const match = doctors.find((d) =>
                      d.specialty.toLowerCase().includes(e.target.value.toLowerCase().split('/')[0].trim())
                    );
                    if (match) setSelectedDoctorId(match.id);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="General Medicine & Hematology">General Medicine & Hematology</option>
                  <option value="Cardiology & Vascular Medicine">Cardiology & Vascular Medicine</option>
                  <option value="Endocrinology & Diabetology">Endocrinology & Diabetology</option>
                  <option value="Dermatology & Clinical Immunology">Dermatology & Clinical Immunology</option>
                  <option value="Pediatrics & Adolescent Care">Pediatrics & Adolescent Care</option>
                  <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                  <option value="Neurology & Headache Specialist">Neurology & Headache Specialist</option>
                  <option value="Gastroenterology & Hepatology">Gastroenterology & Hepatology</option>
                  <option value="Gynecology & Women’s Health">Gynecology & Women’s Health</option>
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Select Specialist Doctor ({activeDoctorList.length} Available in this department)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDoctorList.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center text-xs shrink-0">
                            {doc.name.split(' ')[1]?.[0] || 'D'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {doc.name}
                            </div>
                            <div className="text-[11px] text-teal-700 dark:text-teal-300 font-medium truncate">
                              {doc.specialty}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {doc.hospital}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    3. Preferred Consultation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min="2026-09-20"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    4. Available Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="09:30 AM">09:30 AM (Morning Slot)</option>
                    <option value="10:30 AM">10:30 AM (Morning Slot)</option>
                    <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                    <option value="03:30 PM">03:30 PM (Afternoon Slot)</option>
                    <option value="04:30 PM">04:30 PM (Evening Slot)</option>
                  </select>
                </div>
              </div>

              {/* Consultation Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  5. Consultation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultType('Online')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-3 transition-all ${
                      consultType === 'Online'
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">Online HD Teleconsultation</div>
                      <div className="text-[10px] text-slate-500 font-normal">Connect via browser video room</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('In-person')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-3 transition-all ${
                      consultType === 'In-person'
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">In-Person Hospital Visit</div>
                      <div className="text-[10px] text-slate-500 font-normal">Clinic Room at Hospital OPD</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reason / Symptoms */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  6. Reason for Consultation & Symptoms Note
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Discuss recent Hemoglobin count (11.2 g/dL), mild fatigue, and dietary iron recommendations..."
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('upcoming')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Book Appointment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right 1 Col: Live Booking Summary Preview Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Consultation Summary
                </h3>
              </div>

              {currentDoctor && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{currentDoctor.name}</div>
                    <div className="text-teal-700 dark:text-teal-300 text-[11px] font-semibold">
                      {currentDoctor.specialty}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {currentDoctor.hospital}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] pt-1">
                      Experience: {currentDoctor.experienceYears} Years • Rating: ⭐ {currentDoctor.rating}/5.0
                    </div>
                  </div>

                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient:</span>
                      <strong className="text-slate-900 dark:text-white">
                        {patient?.fullName || 'Rahul Sharma'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Time Slot:</span>
                      <strong className="text-slate-900 dark:text-white">{selectedTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mode:</span>
                      <strong className="text-teal-700 dark:text-teal-300">{consultType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consultation Fee:</span>
                      <strong className="text-slate-900 dark:text-white">₹800 (Verified)</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">Hospital Cancellation Policy:</p>
                <p>Appointments can be rescheduled or cancelled without fee up to 2 hours before the scheduled slot.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: PAST & CANCELLED APPOINTMENTS */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyAppointments.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 text-slate-500 text-xs">
              No historical or cancelled consultations recorded.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 opacity-80"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {apt.doctorName}
                      </h4>
                      <p className="text-xs text-slate-500">{apt.specialty}</p>
                      <p className="text-[11px] text-slate-400">{apt.hospital}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                      {apt.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div><strong>Date & Time:</strong> {apt.date} at {apt.time}</div>
                    <div><strong>Reason:</strong> {apt.reason}</div>
                    <div><strong>Type:</strong> {apt.type}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDept(apt.specialty);
                      setSelectedDoctorId(apt.doctorId);
                      setActiveTab('book');
                    }}
                    className="w-full py-2 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                  >
                    Book Follow-up with this Doctor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. MODAL: FULL MEDICAL APPOINTMENT PASS & CLINICAL SLIP              */}
      {/* ==================================================================== */}
      {viewPassApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Pass Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Clinical Consultation Pass
                  </h3>
                  <p className="text-[11px] text-slate-500">Official Electronic Health Record Entry</p>
                </div>
              </div>

              <button
                onClick={() => setViewPassApt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Token & Hospital Badge */}
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800 dark:text-teal-300">
                  Appointment Reference Token
                </span>
                <div className="text-lg font-mono font-extrabold text-teal-950 dark:text-teal-100">
                  {viewPassApt.id.toUpperCase()}
                </div>
                <div className="text-xs text-teal-700 dark:text-teal-300 font-semibold mt-0.5">
                  Queue Token: #14 • Status: {viewPassApt.status}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-600 text-white">
                  {viewPassApt.type}
                </span>
              </div>
            </div>

            {/* Comprehensive Detail Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Doctor Information</span>
                <div className="font-bold text-slate-900 dark:text-white">{viewPassApt.doctorName}</div>
                <div className="text-teal-700 dark:text-teal-300">{viewPassApt.specialty}</div>
                <div className="text-slate-500 text-[11px]">{viewPassApt.hospital}</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Patient Details</span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {patient?.fullName || 'Rahul Sharma'}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  Age: {patient?.age || 38} • Blood Group: {patient?.bloodGroup || 'B+'}
                </div>
                <div className="text-slate-500 text-[11px]">Phone: {patient?.phone || '+91 98765 43210'}</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Date & Time</span>
                <div className="font-bold text-slate-900 dark:text-white">{viewPassApt.date}</div>
                <div className="text-teal-700 dark:text-teal-300 font-semibold">{viewPassApt.time}</div>
                <div className="text-slate-500 text-[11px]">Triage Arrival: 15 mins prior</div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Venue & Room</span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {viewPassApt.type === 'Online' ? 'Virtual HD Teleconsultation' : 'OPD Wing B, Room 304'}
                </div>
                <div className="text-slate-500 text-[11px]">Floor 3, Central Diagnostic Pavilion</div>
                <div className="text-teal-600 text-[11px] font-semibold">Verified Reception Counter 4</div>
              </div>
            </div>

            {/* Purpose & Notes */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div>
                <strong className="text-slate-900 dark:text-white">Clinical Reason:</strong>{' '}
                <span className="text-slate-600 dark:text-slate-300">{viewPassApt.reason}</span>
              </div>
              {viewPassApt.notes && (
                <div>
                  <strong className="text-slate-900 dark:text-white">Physician Notes:</strong>{' '}
                  <span className="text-slate-600 dark:text-slate-300">{viewPassApt.notes}</span>
                </div>
              )}
            </div>

            {/* Preparation Instructions */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <strong className="block text-amber-800 dark:text-amber-300">Mandatory Instructions:</strong>
              <p>• Please bring government photo identification and recent laboratory reports.</p>
              <p>• In case of any acute emergency or sudden chest pain, immediately dial 112.</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewPassApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700"
                >
                  Close
                </button>
                {viewPassApt.type === 'Online' && (
                  <button
                    onClick={() => {
                      setViewPassApt(null);
                      setActiveCallApt(viewPassApt);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Teleconsult</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. MODAL: RESCHEDULE APPOINTMENT                                     */}
      {/* ==================================================================== */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reschedule Consultation
              </h3>
              <button
                onClick={() => setRescheduleApt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Rescheduling consultation with <strong>{rescheduleApt.doctorName}</strong> ({rescheduleApt.specialty}).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min="2026-09-21"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select New Time Slot
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs"
              >
                Save New Time Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 8. MODAL: ACTIVE TELECONSULTATION SIMULATION ROOM                    */}
      {/* ==================================================================== */}
      {activeCallApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-sm">Active Teleconsultation Video Session</span>
              </div>
              <button
                onClick={() => setActiveCallApt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Stage */}
            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2 p-6">
                <div className="w-20 h-20 rounded-full bg-teal-600/30 border border-teal-500/50 mx-auto flex items-center justify-center text-teal-300 text-2xl font-extrabold shadow-inner">
                  {activeCallApt.doctorName.split(' ')[1]?.[0] || 'D'}
                </div>
                <h4 className="font-bold text-base text-slate-100">{activeCallApt.doctorName}</h4>
                <p className="text-xs text-teal-400 font-semibold">{activeCallApt.specialty}</p>
                <p className="text-xs text-slate-400">{activeCallApt.hospital}</p>
                <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-800 mt-2">
                  Encrypted Clinical Teleconsult Channel Active
                </span>
              </div>

              {/* Self Video PIP */}
              <div className="absolute bottom-3 right-3 w-32 h-24 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] text-slate-300 font-semibold shadow-lg">
                Patient Video (Active)
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400 truncate max-w-md">
                <strong>Subject:</strong> {activeCallApt.reason}
              </span>
              <button
                onClick={() => setActiveCallApt(null)}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-xs"
              >
                End Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
