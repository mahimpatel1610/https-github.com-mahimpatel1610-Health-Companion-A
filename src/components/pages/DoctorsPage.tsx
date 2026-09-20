import React, { useState } from 'react';
import {
  Search,
  Building2,
  Calendar,
  Globe,
  Video,
  User,
  Star,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Doctor } from '../../types';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface DoctorsPageProps {
  doctors: Doctor[];
  onBookDoctor: (doctor: Doctor) => void;
  onContactDoctor: (doctor: Doctor) => void;
}

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'General Medicine',
  'Neurosurgery',
  'Dentistry',
  'Cardiology',
  'Ophthalmology',
  'Psychiatry',
  'Oncology',
  'ENT',
  'Pulmonology',
  'Nephrology',
  'Endocrinology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Gastroenterology',
  'Gynecology'
];

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  onBookDoctor,
  onContactDoctor
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchQuery, setSearchQuery] = useState('');
  const [consultFilter, setConsultFilter] = useState<'All' | 'Online' | 'In-person'>('All');

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'All Specialties' ||
      doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.languages.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesConsult =
      consultFilter === 'All' || doc.consultationTypes.includes(consultFilter as any);

    return matchesSpecialty && matchesSearch && matchesConsult;
  });

  return (
    <div id="doctors-section" className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Specialist Network
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Demo Doctors Only
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find a Doctor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Connect with qualified specialists for second opinions, report reviews, and in-person or online teleconsultations.
        </p>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search doctors by name, hospital, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Consultation Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {(['All', 'Online', 'In-person'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setConsultFilter(type)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  consultFilter === type
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Specialties Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {SPECIALTY_OPTIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            id={`doctor-card-${doc.id}`}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Doctor Avatar & Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-300 font-extrabold text-base">
                    {doc.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold line-clamp-1">
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                {/* Mandatory Demo Label */}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Demo Doctor
                </span>
              </div>

              {/* Stats / Details */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {doc.experienceYears} Years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rating:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {doc.rating} / 5.0
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{doc.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{doc.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                    Next Available: {doc.availableDates[0]}
                  </span>
                </div>
              </div>

              {/* Consultation modes */}
              <div className="flex items-center gap-1.5 text-[11px]">
                {doc.consultationTypes.map((mode) => (
                  <span
                    key={mode}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {mode === 'Online' ? (
                      <Video className="w-3 h-3 text-indigo-500" />
                    ) : (
                      <User className="w-3 h-3 text-teal-500" />
                    )}
                    {mode}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                id={`book-doc-${doc.id}`}
                onClick={() => onBookDoctor(doc)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Book Appointment</span>
              </button>
              <button
                id={`contact-doc-${doc.id}`}
                onClick={() => onContactDoctor(doc)}
                className="py-2 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                title={`Send direct message to ${doc.name}`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Message Doctor</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
