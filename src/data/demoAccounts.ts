import { AuthUser } from '../types';

export interface DemoAccount {
  role: 'patient' | 'doctor';
  label: string;
  email: string;
  password: string;
  name: string;
  description: string;
  specialty?: string;
  hospital?: string;
  badge: string;
}

export const DEMO_LOGIN_ACCOUNTS: DemoAccount[] = [
  {
    role: 'patient',
    label: 'Primary Patient',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@healthcompanion.ai',
    password: 'Patient@123',
    description: 'Male, 38 yrs • Active health record with blood count & lipid diagnostics',
    badge: 'Verified Patient'
  },
  {
    role: 'patient',
    label: 'Secondary Patient',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@healthcompanion.ai',
    password: 'Patient@456',
    description: 'Female, 35 yrs • Allergy & pediatric wellness tracking record',
    badge: 'Verified Patient'
  },
  {
    role: 'doctor',
    label: 'Lead Clinician',
    name: 'Dr. Ananya Sharma',
    email: 'dr.ananya@apollo-health.ai',
    password: 'Doctor@123',
    specialty: 'General Medicine & Hematology',
    hospital: 'Apollo Health City, Bengaluru',
    description: 'Senior Consultant • 14 yrs experience • Reg #KA-2010-44910',
    badge: 'Certified Physician'
  },
  {
    role: 'doctor',
    label: 'Cardiologist',
    name: 'Dr. Rajesh Varma',
    email: 'dr.rajesh@metro-heart.ai',
    password: 'Doctor@456',
    specialty: 'Cardiology & Vascular Medicine',
    hospital: 'Metro Heart & Vascular Institute',
    description: 'Chief Interventional Cardiologist • 18 yrs experience • Reg #MH-2006-18921',
    badge: 'Certified Specialist'
  }
];

export const INITIAL_AUTH_STATE: AuthUser = {
  id: 'patient-rahul-01',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@healthcompanion.ai',
  role: 'patient',
  patientId: 'HC-PAT-2026-8821',
  phone: '+91 98765 12340',
  provider: 'email'
};
