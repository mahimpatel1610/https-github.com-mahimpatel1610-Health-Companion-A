import { AuthUser } from '../types';

export interface DemoAccount {
  role: 'patient' | 'doctor';
  label: string;
  doctorId?: string;
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
    doctorId: 'DOC-ANANYA-44910',
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
    label: 'Neurosurgeon',
    doctorId: 'DOC-ALOK-31092',
    name: 'Dr. Alok Verma',
    email: 'dr.alok.neuro@apollo-health.ai',
    password: 'Doctor@Neuro123',
    specialty: 'Neurosurgery & Spine Specialist',
    hospital: 'Apollo Brain & Spine Institute',
    description: 'Senior Consultant Neurosurgeon • M.Ch Neurosurgery • 19 yrs exp • Reg #KA-2007-31092',
    badge: 'Neurosurgeon'
  },
  {
    role: 'doctor',
    label: 'Dentist & Oral Surgeon',
    doctorId: 'DOC-ROHAN-8821',
    name: 'Dr. Rohan Mehra',
    email: 'dr.rohan.dentist@apollo-dental.ai',
    password: 'Doctor@Dentist123',
    specialty: 'Dentistry & Maxillofacial Surgery',
    hospital: 'Apollo Dental & Craniofacial Center',
    description: 'Lead Dental Surgeon & Implantologist • MDS Dentistry • 13 yrs exp • Reg #DENT-2013-8821',
    badge: 'Dental Specialist'
  },
  {
    role: 'doctor',
    label: 'Cardiologist',
    doctorId: 'DOC-RAJESH-18921',
    name: 'Dr. Rajesh Varma',
    email: 'dr.rajesh@metro-heart.ai',
    password: 'Doctor@456',
    specialty: 'Cardiology & Vascular Medicine',
    hospital: 'Metro Heart & Vascular Institute',
    description: 'Chief Interventional Cardiologist • 18 yrs experience • Reg #MH-2006-18921',
    badge: 'Cardiologist'
  },
  {
    role: 'doctor',
    label: 'Eye Specialist (Ophthalmologist)',
    doctorId: 'DOC-SIDDHARTH-55102',
    name: 'Dr. Siddharth Rao',
    email: 'dr.siddharth.eye@nethralaya.ai',
    password: 'Doctor@Eye123',
    specialty: 'Ophthalmology & Vitreoretinal Eye Surgery',
    hospital: 'Narayana Nethralaya Eye Institute',
    description: 'Senior Consultant Ophthalmologist • MS Ophthalmology, FRCS • 15 yrs exp • Reg #KA-2011-55102',
    badge: 'Eye Specialist'
  },
  {
    role: 'doctor',
    label: 'Psychiatrist & Mental Health',
    doctorId: 'DOC-SNEHA-41098',
    name: 'Dr. Sneha Kulkarni',
    email: 'dr.sneha.psych@nimhans-care.ai',
    password: 'Doctor@Psych123',
    specialty: 'Psychiatry & Behavioral Neurosciences',
    hospital: 'NIMHANS Integrated Behavioral Center',
    description: 'Consultant Psychiatrist • MD Psychiatry • 12 yrs exp • Reg #KA-2014-41098',
    badge: 'Psychiatrist'
  },
  {
    role: 'doctor',
    label: 'Cancer Specialist (Oncologist)',
    doctorId: 'DOC-KABIR-29011',
    name: 'Dr. Kabir Sengupta',
    email: 'dr.kabir.onco@hcg-care.ai',
    password: 'Doctor@Onco123',
    specialty: 'Medical Oncology & Cancer Therapeutics',
    hospital: 'HCG Cancer Centre & Research Pavilion',
    description: 'Chief Medical Oncologist • DM Medical Oncology • 17 yrs exp • Reg #DL-2009-29011',
    badge: 'Oncologist'
  },
  {
    role: 'doctor',
    label: 'ENT Specialist',
    doctorId: 'DOC-POOJA-67120',
    name: 'Dr. Pooja Nair',
    email: 'dr.pooja.ent@manipal-ent.ai',
    password: 'Doctor@Ent123',
    specialty: 'ENT & Head-Neck Micro-Surgery',
    hospital: 'Manipal ENT Speciality Center',
    description: 'Senior Consultant ENT Surgeon • MS ENT • 10 yrs exp • Reg #KA-2016-67120',
    badge: 'ENT Specialist'
  },
  {
    role: 'doctor',
    label: 'Lungs & Pulmonologist',
    doctorId: 'DOC-VIKRAM-33810',
    name: 'Dr. Vikramaditya Roy',
    email: 'dr.vikram.pulmo@care-lungs.ai',
    password: 'Doctor@Pulmo123',
    specialty: 'Pulmonology & Chest Medicine',
    hospital: 'Care Respiratory & Chest Institute',
    description: 'Interventional Pulmonologist • MD, DM Pulmonary Medicine • 14 yrs exp • Reg #MH-2012-33810',
    badge: 'Pulmonologist'
  },
  {
    role: 'doctor',
    label: 'Kidney Specialist (Nephrologist)',
    doctorId: 'DOC-TARIQ-88192',
    name: 'Dr. Tariq Mansoor',
    email: 'dr.tariq.kidney@apex-renal.ai',
    password: 'Doctor@Kidney123',
    specialty: 'Nephrology & Renal Dialysis Care',
    hospital: 'Apex Kidney Care & Dialysis Pavilion',
    description: 'Consultant Nephrologist • DM Nephrology • 13 yrs exp • Reg #KA-2013-88192',
    badge: 'Nephrologist'
  },
  {
    role: 'doctor',
    label: 'Endocrinologist',
    doctorId: 'DOC-PRIYA-11029',
    name: 'Dr. Priya Patel',
    email: 'dr.priya.endo@apollo-health.ai',
    password: 'Doctor@Endo123',
    specialty: 'Endocrinology & Diabetology',
    hospital: 'City Diabetes & Hormone Center',
    description: 'Consultant Diabetologist • MD Endocrinology • 11 yrs exp • Reg #KA-2015-11029',
    badge: 'Endocrinologist'
  },
  {
    role: 'doctor',
    label: 'Dermatologist',
    doctorId: 'DOC-VIKRAM-55410',
    name: 'Dr. Vikram Seth',
    email: 'dr.vikram.derma@care-skin.ai',
    password: 'Doctor@Derma123',
    specialty: 'Dermatology & Clinical Immunology',
    hospital: 'Care Skin & Allergy Center',
    description: 'Consultant Dermatologist • MD Dermatology • 9 yrs exp • Reg #DL-2017-55410',
    badge: 'Dermatologist'
  },
  {
    role: 'doctor',
    label: 'Pediatrician',
    doctorId: 'DOC-MEERA-90182',
    name: 'Dr. Meera Nambiar',
    email: 'dr.meera.peds@aster-children.ai',
    password: 'Doctor@Peds123',
    specialty: 'Pediatrics & Adolescent Care',
    hospital: 'Aster Children’s Hospital',
    description: 'Senior Pediatrician • MD Pediatrics • 16 yrs exp • Reg #KL-2010-90182',
    badge: 'Pediatrician'
  },
  {
    role: 'doctor',
    label: 'Orthopedic Surgeon',
    doctorId: 'DOC-ARVIND-66014',
    name: 'Dr. Arvind Joshi',
    email: 'dr.arvind.ortho@fortis-joint.ai',
    password: 'Doctor@Ortho123',
    specialty: 'Orthopedics & Joint Reconstruction',
    hospital: 'Fortis Bone & Joint Pavilion',
    description: 'Joint Replacement & Spine Orthopedic Specialist • MS Ortho • 15 yrs exp • Reg #KA-2011-66014',
    badge: 'Orthopedic Surgeon'
  },
  {
    role: 'doctor',
    label: 'Gastroenterologist',
    doctorId: 'DOC-FARHAN-77291',
    name: 'Dr. Farhan Ali',
    email: 'dr.farhan.gi@max-digestive.ai',
    password: 'Doctor@GI123',
    specialty: 'Gastroenterology & Hepatology',
    hospital: 'Max Digestive Health Pavilion',
    description: 'Senior Consultant Gastroenterologist • DM GI • 12 yrs exp • Reg #KA-2014-77291',
    badge: 'Gastroenterologist'
  },
  {
    role: 'doctor',
    label: 'Gynecologist & Obstetrician',
    doctorId: 'DOC-SHALINI-44820',
    name: 'Dr. Shalini Verma',
    email: 'dr.shalini.gyn@motherhood-care.ai',
    password: 'Doctor@Gyn123',
    specialty: 'Gynecology & Women’s Health',
    hospital: 'Motherhood Specialty Hospital',
    description: 'Senior Consultant Gynecologist • MS OBG • 14 yrs exp • Reg #KA-2012-44820',
    badge: 'Gynecologist'
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
