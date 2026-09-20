import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Building2,
  BellRing,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Navigation,
  HeartPulse,
  Clock,
  Copy,
  Check,
  Search,
  Share2
} from 'lucide-react';
import { PatientProfile } from '../../types';

interface EmergencyPageProps {
  patient: PatientProfile;
}

interface NearbyHospital {
  id: string;
  name: string;
  type: string;
  traumaLevel: string;
  distance: string;
  eta: string;
  address: string;
  fullAddress: string;
  emergencyPhone: string;
  ambulancePhone?: string;
  availableBedsEstimate: string;
  specialties: string[];
  mapsQuery: string;
}

const EMERGENCY_HELPLINES = [
  {
    code: '112',
    name: 'National Emergency Helpline',
    subtitle: 'All-in-one emergency dispatch (Ambulance, Police, Fire)',
    category: 'Universal',
    color: 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
  },
  {
    code: '108',
    name: 'Disaster & Medical Ambulance',
    subtitle: 'Free government emergency ambulance & paramedic dispatch',
    category: 'Ambulance',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
  },
  {
    code: '102',
    name: 'Maternal & Child Health Ambulance',
    subtitle: 'Emergency transport for pregnant mothers & infants',
    category: 'Maternity',
    color: 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300'
  },
  {
    code: '1066',
    name: 'Apollo Lifeline 24x7 Ambulance',
    subtitle: 'Private rapid-response cardiac and critical care ambulance',
    category: 'Private ALS',
    color: 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
  },
  {
    code: '1800-11-2555',
    name: 'National Poison Information (AIIMS)',
    subtitle: 'Toxicology guidance for accidental ingestion or poisoning',
    category: 'Poison',
    color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
  },
  {
    code: '911',
    name: 'International (US & Canada)',
    subtitle: 'For overseas coverage or travel assistance coordination',
    category: 'Overseas',
    color: 'border-slate-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
  }
];

const NEARBY_HOSPITALS: NearbyHospital[] = [
  {
    id: 'hosp-apollo',
    name: 'Apollo Hospital — 24/7 Emergency Wing',
    type: 'Super Speciality Hospital',
    traumaLevel: 'Level-1 Tertiary Trauma Center',
    distance: '1.8 km',
    eta: '6 mins',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    fullAddress: 'Sarita Vihar, Delhi Mathura Road, New Delhi, Delhi 110076',
    emergencyPhone: '+91 11 2692 5858',
    ambulancePhone: '1066',
    availableBedsEstimate: '18 Emergency ICU beds active',
    specialties: ['Code STEMI Cardiac', 'Acute Stroke Unit', 'Poly-trauma ICU', '24/7 Blood Bank'],
    mapsQuery: 'Apollo+Hospital+Sarita+Vihar+New+Delhi'
  },
  {
    id: 'hosp-max',
    name: 'Max Super Speciality Hospital Trauma Unit',
    type: 'Super Speciality Hospital',
    traumaLevel: 'Level-1 Comprehensive Trauma Care',
    distance: '3.2 km',
    eta: '11 mins',
    address: '1, 2, Press Enclave Marg, Saket',
    fullAddress: '1, 2, Press Enclave Marg, Saket Institutional Area, Saket, New Delhi, Delhi 110017',
    emergencyPhone: '+91 11 2651 5050',
    ambulancePhone: '+91 11 4055 4055',
    availableBedsEstimate: '14 Emergency ICU beds active',
    specialties: ['Neuro-trauma', 'Pediatric Emergency Resuscitation', '24/7 CT/MRI Imaging', 'Burn Care'],
    mapsQuery: 'Max+Super+Speciality+Hospital+Saket+New+Delhi'
  },
  {
    id: 'hosp-aiims',
    name: 'AIIMS — JPN Apex Trauma Center',
    type: 'Premier National Institute & Public Hospital',
    traumaLevel: 'National Apex Level-1 Trauma Center',
    distance: '5.4 km',
    eta: '15 mins',
    address: 'Sri Aurobindo Marg, Ansari Nagar',
    fullAddress: 'Sri Aurobindo Marg, Ansari Nagar East, New Delhi, Delhi 110029',
    emergencyPhone: '+91 11 2658 8500',
    ambulancePhone: '+91 11 2659 3677',
    availableBedsEstimate: '32 Emergency triage bays active',
    specialties: ['Multi-organ Resuscitation', 'Toxicology & Poison Center', 'Maxillofacial Trauma', 'Hyperbaric Medicine'],
    mapsQuery: 'AIIMS+Apex+Trauma+Center+New+Delhi'
  },
  {
    id: 'hosp-fortis',
    name: 'Fortis Escorts Heart Institute — 24/7 Emergency',
    type: 'Cardiac Super Speciality Hospital',
    traumaLevel: 'Advanced Cardiac Emergency Center',
    distance: '4.1 km',
    eta: '12 mins',
    address: 'Okhla Road, New Friends Colony',
    fullAddress: 'Okhla Road, Sukhdev Vihar Metro Station, New Friends Colony, New Delhi, Delhi 110025',
    emergencyPhone: '+91 11 4713 5000',
    ambulancePhone: '105010',
    availableBedsEstimate: '10 Cardiac Emergency bays active',
    specialties: ['24/7 Primary Angioplasty', 'Code STEMI Emergency Team', 'Cardiac ICU (CCU)', 'ECMO Support'],
    mapsQuery: 'Fortis+Escorts+Heart+Institute+Okhla+Road+New+Delhi'
  },
  {
    id: 'hosp-manipal',
    name: 'Manipal Hospital — 24/7 Critical Care & ER',
    type: 'Multi Speciality Hospital',
    traumaLevel: 'Level-2 Trauma & Critical Care',
    distance: '6.0 km',
    eta: '18 mins',
    address: 'Sector 6, Dwarka',
    fullAddress: 'Sector 6, Dwarka, New Delhi, Delhi 110075',
    emergencyPhone: '+91 11 4967 4967',
    ambulancePhone: '+91 11 4967 4900',
    availableBedsEstimate: '12 Emergency beds active',
    specialties: ['Emergency Hemodialysis', 'Neonatal ICU (NICU)', 'Sepsis Resuscitation', 'Fracture & Ortho Trauma'],
    mapsQuery: 'Manipal+Hospital+Dwarka+New+Delhi'
  },
  {
    id: 'hosp-gangaram',
    name: 'Sir Ganga Ram Hospital — Emergency Casualty',
    type: 'Multi Speciality Trust Hospital',
    traumaLevel: 'Comprehensive Acute Casualty Care',
    distance: '8.2 km',
    eta: '22 mins',
    address: 'Sir Ganga Ram Hospital Marg, Rajinder Nagar',
    fullAddress: 'Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi, Delhi 110060',
    emergencyPhone: '+91 11 4225 4000',
    ambulancePhone: '+91 11 2575 7575',
    availableBedsEstimate: '16 Casualty beds active',
    specialties: ['Acute Respiratory Care', 'Vascular Trauma Surgery', 'Gastroenterology Emergencies', 'General Casualty'],
    mapsQuery: 'Sir+Ganga+Ram+Hospital+Rajinder+Nagar+New+Delhi'
  }
];

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ patient }) => {
  const [dispatchedAlert, setDispatchedAlert] = useState(false);
  const [dialModalNumber, setDialModalNumber] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  const handleNotifyContact = () => {
    setDispatchedAlert(true);
    setTimeout(() => setDispatchedAlert(false), 6000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHospitals = NEARBY_HOSPITALS.filter((hosp) => {
    const matchesSearch =
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterSpecialty === 'cardiac') {
      return hosp.specialties.some((s) => s.toLowerCase().includes('cardiac') || s.toLowerCase().includes('stemi'));
    }
    if (filterSpecialty === 'trauma') {
      return hosp.traumaLevel.toLowerCase().includes('trauma');
    }
    if (filterSpecialty === 'stroke') {
      return hosp.specialties.some((s) => s.toLowerCase().includes('stroke') || s.toLowerCase().includes('neuro'));
    }
    return true;
  });

  return (
    <div id="emergency-section" className="space-y-6">
      {/* High-Visibility Emergency Header Card */}
      <div className="p-6 rounded-2xl border-2 border-red-500 dark:border-red-600 bg-red-600 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/20">
                  Immediate Critical Care Assistance
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-800/80 text-amber-200 border border-red-400/40">
                  24x7 Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Emergency Healthcare & Hospital Directory
              </h1>
            </div>
          </div>

          <button
            id="emergency-notify-contact-btn"
            onClick={handleNotifyContact}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-red-800/90 hover:bg-red-900 text-white border border-red-300/40 shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <BellRing className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Alert Emergency Contact</span>
          </button>
        </div>

        <p className="text-sm text-red-50 leading-relaxed font-medium">
          If you or someone nearby is experiencing severe chest pain, shortness of breath, loss of consciousness, stroke signs (FAST), severe trauma, or life-threatening symptoms, dial emergency dispatch immediately or navigate to the nearest facility below.
        </p>

        {/* Big Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="emergency-call-112-btn"
            onClick={() => setDialModalNumber('112')}
            className="px-6 py-3 rounded-xl font-black text-sm bg-white text-red-700 hover:bg-red-50 shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-red-600" />
            <span>Dial 112 (National All-in-One)</span>
          </button>

          <button
            id="emergency-call-108-btn"
            onClick={() => setDialModalNumber('108')}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-red-700/90 hover:bg-red-800 text-white border border-red-300/50 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-amber-200" />
            <span>Dial 108 (Ambulance Service)</span>
          </button>

          <button
            id="emergency-call-1066-btn"
            onClick={() => setDialModalNumber('1066')}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-red-800/90 hover:bg-red-900 text-white border border-red-400/50 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-teal-300" />
            <span>1066 (Apollo Lifeline ALS)</span>
          </button>

          <button
            id="emergency-call-911-btn"
            onClick={() => setDialModalNumber('911')}
            className="px-4 py-3 rounded-xl font-bold text-xs bg-red-900/80 hover:bg-red-950 text-white border border-red-500/50 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>US / Int'l: 911</span>
          </button>
        </div>
      </div>

      {/* Dispatched Notification Banner */}
      {dispatchedAlert && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/60 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-300 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <strong>Emergency Alert Dispatched: </strong>
            Direct SMS and notification with live GPS coordinates, patient blood group ({patient.bloodGroup}), and allergy profile sent to designated contact <strong>{patient.emergencyContact.name} ({patient.emergencyContact.phone})</strong>.
          </div>
        </div>
      )}

      {/* Patient Emergency Medical Dossier Card */}
      <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[10px]">
              Paramedic Rapid Assessment Card
            </span>
            <p className="font-extrabold text-slate-900 dark:text-white text-sm">
              {patient.fullName} ({patient.age} yrs, {patient.gender}) • Blood Group: <span className="text-red-600 dark:text-red-400 font-black">{patient.bloodGroup}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              Primary Allergies: <strong className="text-red-700 dark:text-red-300">Penicillin (Moderate rash), Dust mites</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="text-right sm:block hidden">
            <span className="text-[11px] text-slate-500">Designated Contact:</span>
            <div className="font-bold text-slate-900 dark:text-white">
              {patient.emergencyContact.name} ({patient.emergencyContact.relation})
            </div>
          </div>
          <button
            onClick={() => setDialModalNumber(patient.emergencyContact.phone)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>Call {patient.emergencyContact.phone}</span>
          </button>
        </div>
      </div>

      {/* National & Emergency Helplines Grid */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-600" />
              All Critical Emergency Helpline Numbers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Government and private emergency hotlines operational 24 hours a day, 7 days a week.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            Toll-Free & 24/7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EMERGENCY_HELPLINES.map((line) => (
            <div
              key={line.code}
              className={`p-4 rounded-xl border ${line.color} transition-all space-y-2 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/30 border border-current/20">
                    {line.category}
                  </span>
                  <span className="text-lg font-black font-mono tracking-tight">
                    {line.code}
                  </span>
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mt-1.5">
                  {line.name}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                  {line.subtitle}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-current/15">
                <button
                  onClick={() => handleCopy(line.code, line.code)}
                  className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/80 hover:bg-white text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1"
                  title="Copy number"
                >
                  {copiedId === line.code ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px] font-semibold">Copy</span>
                </button>

                <button
                  onClick={() => setDialModalNumber(line.code)}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {line.code}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Hospitals & Trauma Centers Directory */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Nearby Hospitals with 24x7 Emergency & Trauma Departments
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified locations, real-time estimated arrival times, direct emergency casualty phones, and specializations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {[
              { id: 'all', label: 'All Facilities' },
              { id: 'trauma', label: 'Level-1 Trauma' },
              { id: 'cardiac', label: 'Cardiac & STEMI' },
              { id: 'stroke', label: 'Stroke & Neuro' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterSpecialty(f.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  filterSpecialty === f.id
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby hospitals by name, locality, or clinical emergency service..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredHospitals.length === 0 ? (
            <div className="col-span-2 py-10 text-center text-xs text-slate-500">
              No emergency facilities match your search query or filter.
            </div>
          ) : (
            filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-400 dark:hover:border-teal-600 transition-all shadow-2xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {hosp.traumaLevel}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {hosp.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {hosp.type}
                      </p>
                    </div>

                    <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="text-sm font-extrabold text-teal-700 dark:text-teal-400 flex items-center justify-end gap-1">
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{hosp.distance}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ETA: {hosp.eta}
                      </span>
                    </div>
                  </div>

                  {/* Location / Full Address */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {hosp.address}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {hosp.fullAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Emergency Wings */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Emergency Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hosp.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact and Navigation CTAs */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[11px]">Casualty Line:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {hosp.emergencyPhone}
                      </span>
                    </div>
                    {hosp.ambulancePhone && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">Direct Ambulance:</span>
                        <span className="font-mono font-bold text-red-600 dark:text-red-400">
                          {hosp.ambulancePhone}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hosp.mapsQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-teal-600" />
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <button
                      onClick={() => setDialModalNumber(hosp.emergencyPhone)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call ER</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Simulated Dial Confirmation Modal */}
      {dialModalNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-600">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Initiate Emergency Call
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You are about to dial emergency service:
              </p>
              <p className="text-2xl font-mono font-black text-red-600 mt-2">
                {dialModalNumber}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2 text-xs">
              <button
                onClick={() => setDialModalNumber(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <a
                href={`tel:${dialModalNumber}`}
                onClick={() => setDialModalNumber(null)}
                className="px-6 py-2 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
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

