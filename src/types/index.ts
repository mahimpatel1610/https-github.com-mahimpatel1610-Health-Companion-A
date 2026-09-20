export type FindingStatus = 'within_range' | 'outside_range' | 'follow_up_appropriate';

export interface LabFinding {
  id: string;
  testName: string;
  category: string;
  measuredValue: number | string;
  unit: string;
  referenceRange: string;
  status: FindingStatus;
  statusLabel: string;
  explanation: string;
}

export interface DepartmentSuggestion {
  department: string;
  secondaryDepartment?: string;
  flaggedMarker: string;
  reason: string;
  disclaimer: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  hospital: string;
  category: string;
  rawText: string;
  summary: string;
  findings: LabFinding[];
  suggestedDepartment: DepartmentSuggestion;
  status: 'analyzed' | 'analyzing' | 'error';
  fileSize?: string;
  fileName: string;
  isDemo?: boolean;
}

export interface PatientProfile {
  fullName: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface MedicalHistory {
  conditions: string[];
  procedures: { name: string; year: string; hospital: string }[];
  allergies: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    purpose: string;
  }[];
  hospitalVisits: { reason: string; date: string; hospital: string }[];
}

export interface LifestyleInfo {
  activity: string;
  sleep: string;
  diet: string;
  smokingStatus: string;
  alcoholStatus: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  hospital: string;
  type: 'In-person' | 'Online';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  hospital: string;
  languages: string[];
  consultationTypes: ('In-person' | 'Online')[];
  availableDates: string[];
  rating: number;
  isDemo: true;
  phone: string;
  email: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
  isVoiceInput?: boolean;
}

export interface DoctorMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  doctorId: string;
  doctorName: string;
  hospital?: string;
  subject: string;
  message: string;
  urgency: 'routine' | 'urgent' | 'question';
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
  reply?: {
    text: string;
    repliedAt: string;
    doctorName: string;
  };
}

export interface TimelineEvent {
  id: string;
  date: string;
  year: number;
  month: string;
  type: 'report' | 'appointment' | 'consultation' | 'prescription' | 'checkup';
  title: string;
  doctor?: string;
  hospital: string;
  description: string;
  reportId?: string;
}

export interface MedicationAdministration {
  typicalDosage: string;
  administrationTiming: string;
  maximumDailyLimit: string;
  missedDoseAdvice: string;
  durationGuideline: string;
}

export interface MedicationInteractionsDetail {
  majorDrugInteractions: string[];
  foodAndDietaryInteractions: string[];
  contraindicatedConditions: string[];
}

export interface MedicationSideEffectsBreakdown {
  mildFrequent: string[];
  moderateRequiresMonitoring: string[];
  severeEmergencySymptoms: string[];
}

export interface MedicationStorageAndDisposal {
  temperature: string;
  moistureGuidance: string;
  childSafety: string;
  disposalProcedure: string;
}

export interface MedicationSpecialPopulations {
  pregnancyLactation: string;
  renalImpairment: string;
  hepaticConsideration: string;
  pediatricGeriatricNotes: string;
}

export interface MedicationClinicalProfile {
  therapeuticClass: string;
  mechanismOfAction: string;
  onsetOfAction: string;
  durationOfAction: string;
}

export interface MedicationGuide {
  id: string;
  name: string;
  genericName: string;
  category: string;
  categoryKey: string;
  dosageForm?: string;
  otcStatus: 'Over-The-Counter' | 'Prescription Only';
  generalUses: string[];
  generalPrecautions: string[];
  commonSideEffects: string[];
  whenToSeekDoctor: string[];
  safetyChecklist: {
    ageConsideration: string;
    allergyWarning: string;
    interactionsWarning: string;
    pregnancyWarning: string;
  };
  clinicalProfile?: MedicationClinicalProfile;
  administration?: MedicationAdministration;
  interactionsDetail?: MedicationInteractionsDetail;
  sideEffectsBreakdown?: MedicationSideEffectsBreakdown;
  storageAndDisposal?: MedicationStorageAndDisposal;
  specialPopulations?: MedicationSpecialPopulations;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  notifications: {
    appointmentReminders: boolean;
    reportAnalysisReady: boolean;
    healthCheckupAlerts: boolean;
  };
}

export interface PreviousHealthRecord {
  id: string;
  title: string;
  date: string;
  category: string;
  hospital: string;
  doctor: string;
  summary: string;
  fileName: string;
}

export type MedicationGuideItem = MedicationGuide;

export type UserRole = 'patient' | 'doctor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  hospital?: string;
  phone?: string;
  patientId?: string;
  doctorId?: string;
  licenseNumber?: string;
  provider?: 'email' | 'google';
}
