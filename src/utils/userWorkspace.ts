import {
  PatientProfile,
  MedicalHistory,
  LifestyleInfo,
  MedicalReport,
  Appointment,
  AuthUser
} from '../types';
import {
  INITIAL_PATIENT,
  INITIAL_MEDICAL_HISTORY,
  INITIAL_LIFESTYLE,
  MOCK_REPORTS,
  MOCK_APPOINTMENTS
} from '../data/mockHealthData';

export interface UserWorkspace {
  patient: PatientProfile;
  reports: MedicalReport[];
  appointments: Appointment[];
  medicalHistory: MedicalHistory;
  lifestyle: LifestyleInfo;
}

/**
 * Returns user-specific workspace data from localStorage.
 * For new users (e.g. Mahim Patel or newly registered patients/doctors),
 * it starts with clean, personal records (0 reports, 0 appointments)
 * so they can upload their own PDFs and add their own records manually.
 */
export function getUserWorkspace(user: AuthUser | null): UserWorkspace {
  if (!user || !user.email) {
    return {
      patient: {
        fullName: 'Guest User',
        dob: '',
        age: 0,
        gender: 'Not Specified',
        bloodGroup: 'Not Recorded',
        phone: '',
        email: '',
        address: '',
        emergencyContact: { name: '', relation: '', phone: '' }
      },
      reports: [],
      appointments: [],
      medicalHistory: {
        conditions: [],
        procedures: [],
        allergies: [],
        currentMedications: [],
        hospitalVisits: []
      },
      lifestyle: {
        activity: 'Not recorded',
        sleep: 'Not recorded',
        diet: 'Not recorded',
        smokingStatus: 'Non-smoker',
        alcoholStatus: 'Non-drinker'
      }
    };
  }

  const emailKey = user.email.toLowerCase().trim();
  const storageKey = `hc_user_ws_${emailKey}`;
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Ensure user name is up to date
      if (parsed.patient && user.name && parsed.patient.fullName !== user.name) {
        parsed.patient.fullName = user.name;
      }
      return parsed;
    } catch {
      // ignore parse error and proceed to initialize
    }
  }

  // Only the designated demo account contains pre-seeded demo records
  if (emailKey === 'rahul.sharma@healthcompanion.ai') {
    return {
      patient: INITIAL_PATIENT,
      reports: MOCK_REPORTS,
      appointments: MOCK_APPOINTMENTS,
      medicalHistory: INITIAL_MEDICAL_HISTORY,
      lifestyle: INITIAL_LIFESTYLE
    };
  }

  // Brand new patient / doctor account: Clean slate with user's personal details
  const cleanWorkspace: UserWorkspace = {
    patient: {
      fullName: user.name || 'Patient Profile',
      dob: '',
      age: 0,
      gender: 'Not Specified',
      bloodGroup: 'Not Recorded',
      phone: user.phone || '',
      email: user.email || '',
      address: '',
      emergencyContact: {
        name: '',
        relation: '',
        phone: ''
      }
    },
    reports: [], // Clean: 0 reports until user uploads their own PDF or enters data
    appointments: [], // Clean: 0 appointments until user schedules one
    medicalHistory: {
      conditions: [],
      procedures: [],
      allergies: [],
      currentMedications: [],
      hospitalVisits: []
    },
    lifestyle: {
      activity: 'Not recorded',
      sleep: 'Not recorded',
      diet: 'Not recorded',
      smokingStatus: 'Non-smoker',
      alcoholStatus: 'Non-drinker'
    }
  };

  // Persist the clean initial workspace
  try {
    localStorage.setItem(storageKey, JSON.stringify(cleanWorkspace));
  } catch {
    // ignore
  }

  return cleanWorkspace;
}

/**
 * Saves the active workspace to localStorage for the logged-in user
 */
export function saveUserWorkspace(user: AuthUser | null, ws: UserWorkspace) {
  if (!user || !user.email) return;
  const emailKey = user.email.toLowerCase().trim();
  const storageKey = `hc_user_ws_${emailKey}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(ws));
  } catch (e) {
    console.error('Failed to save user workspace:', e);
  }
}
