import {
  PatientProfile,
  MedicalHistory,
  LifestyleInfo,
  MedicalReport,
  Doctor,
  Appointment,
  TimelineEvent,
  MedicationGuide,
  PreviousHealthRecord
} from '../types';
import { checkLaboratoryValue, findSuggestedDepartment } from '../services/deterministicTools';

export const INITIAL_PATIENT: PatientProfile = {
  fullName: 'Rahul Sharma',
  dob: '1988-05-14',
  age: 38,
  gender: 'Male',
  bloodGroup: 'B Positive (B+)',
  phone: '+91 98765 12340 (Demo)',
  email: 'rahul.sharma.demo@healthcompanion.ai',
  address: '42 Lotus Boulevard, Indiranagar, Bengaluru, Karnataka, India',
  emergencyContact: {
    name: 'Sunita Sharma',
    relation: 'Spouse',
    phone: '+91 98765 99880 (Demo)'
  }
};

export const INITIAL_MEDICAL_HISTORY: MedicalHistory = {
  conditions: ['Mild Seasonal Allergic Rhinitis', 'Occasional Tension-type Headaches'],
  procedures: [
    { name: 'Preventive Dental Scaling', year: '2025', hospital: 'Apollo Dental Care' },
    { name: 'Routine Appendectomy (Uncomplicated)', year: '2016', hospital: 'St. John’s Hospital' }
  ],
  allergies: ['Penicillin (Moderate rash reported in 2014)', 'Dust mites & Pollen'],
  currentMedications: [
    {
      name: 'Cetirizine Hydrochloride',
      dosage: '10 mg',
      frequency: 'Once daily at bedtime (As needed during pollen season)',
      purpose: 'Symptomatic relief of sneezing and runny nose'
    },
    {
      name: 'Vitamin D3 (Cholecalciferol)',
      dosage: '60,000 IU',
      frequency: 'Once monthly maintenance',
      purpose: 'Nutritional bone and metabolic support'
    }
  ],
  hospitalVisits: [
    { reason: 'Annual Wellness Executive Checkup', date: '2026-06-12', hospital: 'Manipal Hospital' },
    { reason: 'General Consultation for Allergic Flare-up', date: '2026-08-18', hospital: 'Apollo Clinic' }
  ]
};

export const INITIAL_LIFESTYLE: LifestyleInfo = {
  activity: 'Moderate — 40 mins brisk walking 4 days/week, light resistance training on weekends',
  sleep: '6.5 to 7.5 hours nightly with consistent bedtime schedule',
  diet: 'Nutrient-rich South Asian vegetarian diet with legumes, whole grains, and fresh seasonal greens',
  smokingStatus: 'Never smoker',
  alcoholStatus: 'Non-drinker'
};

export const DEMO_REPORT_RAW_TEXT = `PATIENT LAB REPORT
LABORATORY & DIAGNOSTIC SERVICES — CENTRAL HEALTHCARE SYSTEM
PATIENT: Rahul Sharma | AGE: 38 | GENDER: Male | REF ID: LAB-2026-0919-881
DATE OF COLLECTION: 19 Sep 2026 | TIME: 07:45 AM
SPECIMEN: Venous Whole Blood (EDTA) & Fasting Serum

[NOTICE: This is fictional data for software testing and educational demonstrations only.]

TEST NAME                    MEASURED VALUE   UNIT      STATED REFERENCE RANGE
---------------------------------------------------------------------------------
Hemoglobin                   11.2             g/dL      12.0 - 16.0 g/dL
White Blood Cell Count (WBC) 7,200            /uL       4,000 - 11,000 /uL
Platelet Count               250,000          /uL       150,000 - 450,000 /uL
Glucose (Fasting Blood Sugar) 92               mg/dL     70 - 100 mg/dL
Total Cholesterol            185              mg/dL     Below 200 mg/dL
---------------------------------------------------------------------------------
OBSERVATIONS / CLINICAL NOTES:
Sample integrity verified. Fasting duration recorded as 10 hours prior to sampling.
Automated flow-cytometry hematology counter calibrated according to ISO-15189 protocol.
Please correlate all parameters clinically with attending medical practitioner.`;

// Build initial demo lab findings via deterministic tool
const demoHb = checkLaboratoryValue('Hemoglobin', 11.2, 'g/dL', 12.0, 16.0, 'Measured at 11.2 g/dL. This is slightly below the stated reference range (12.0 - 16.0 g/dL). Hemoglobin carries oxygen to body tissues. Mild variations are frequently reviewed for dietary iron intake or routine follow-up.');
const demoWbc = checkLaboratoryValue('White Blood Cell Count', 7200, '/uL', 4000, 11000, 'Measured at 7,200 /uL, resting centrally within the healthy reference window (4,000 - 11,000 /uL), indicating balanced baseline immune cell counts.');
const demoPlatelets = checkLaboratoryValue('Platelet Count', 250000, '/uL', 150000, 450000, 'Measured at 250,000 /uL, well within standard parameters (150,000 - 450,000 /uL), representing normal clotting components.');
const demoGlucose = checkLaboratoryValue('Glucose (Fasting)', 92, 'mg/dL', 70, 100, 'Measured at 92 mg/dL. Stated reference range is 70 - 100 mg/dL. This represents normal glycemic fasting regulation without elevation.');
const demoCholesterol = checkLaboratoryValue('Total Cholesterol', 185, 'mg/dL', 100, 200, 'Measured at 185 mg/dL, beneath the standard 200 mg/dL guideline threshold for adult cardiovascular lipid profiling.');

const flaggedDemo = [demoHb];
const demoSuggestedDept = findSuggestedDepartment(flaggedDemo);

export const INITIAL_REPORTS: MedicalReport[] = [
  {
    id: 'report-2026-09-19',
    title: 'Complete Blood Count & Metabolic Panel',
    date: '19 Sep 2026',
    hospital: 'Central Diagnostic Laboratory (Bengaluru)',
    category: 'Hematology & Biochemistry',
    fileName: 'Patient_Lab_Report_19Sep2026.pdf',
    fileSize: '240 KB',
    rawText: DEMO_REPORT_RAW_TEXT,
    summary: 'Your routine complete blood count and fasting metabolic checkup shows four out of five key laboratory markers resting comfortably within normal reference standards. Your fasting glucose (92 mg/dL) and total cholesterol (185 mg/dL) reflect balanced sugar and lipid handling, while your immune defense cells (white blood cells) and clotting platelets are normal.\n\nYour hemoglobin level is 11.2 g/dL against a stated reference range of 12.0 - 16.0 g/dL. This is a mild variation below standard reference values. General Medicine and Hematology specialists typically review this in conjunction with your nutrition and overall vitality.',
    findings: [demoHb, demoWbc, demoPlatelets, demoGlucose, demoCholesterol],
    suggestedDepartment: demoSuggestedDept,
    status: 'analyzed',
    isDemo: true
  },
  {
    id: 'report-2026-06-12',
    title: 'Executive Annual Health Profile',
    date: '12 Jun 2026',
    hospital: 'Manipal Comprehensive Care',
    category: 'Preventive Health',
    fileName: 'Annual_Wellness_Jun2026.pdf',
    fileSize: '512 KB',
    rawText: 'EXECUTIVE WELLNESS CHECKUP\nResting BP: 118/78 mmHg. Normal sinus rhythm on 12-lead ECG. Renal panel: Creatinine 0.9 mg/dL (Ref: 0.7 - 1.2 mg/dL). Liver enzymes AST 22 U/L, ALT 24 U/L within normal limits. Thyroid TSH 2.1 mIU/L.',
    summary: 'Executive health screening showed stable cardiovascular and renal parameters. Resting blood pressure and electrocardiogram were normal. Kidney and liver enzyme markers were within normal laboratory intervals.',
    findings: [
      checkLaboratoryValue('Serum Creatinine', 0.9, 'mg/dL', 0.7, 1.2),
      checkLaboratoryValue('Thyroid Stimulating Hormone (TSH)', 2.1, 'mIU/L', 0.4, 4.0),
      checkLaboratoryValue('Alanine Aminotransferase (ALT)', 24, 'U/L', 7, 56)
    ],
    suggestedDepartment: {
      department: 'General Medicine',
      secondaryDepartment: 'Preventive Cardiology',
      flaggedMarker: 'All markers within standard ranges',
      reason: 'All measured organ-function indicators in this routine panel resided within stated standard intervals.',
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    },
    status: 'analyzed',
    isDemo: true
  }
];

export const DEMO_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sharma',
    specialty: 'General Medicine & Hematology',
    experienceYears: 14,
    hospital: 'Apollo Health City, Bengaluru',
    languages: ['English', 'Hindi', 'Kannada'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Today, 4:00 PM', 'Tomorrow, 10:30 AM', '24 Sep 2026'],
    rating: 4.9,
    isDemo: true,
    phone: '+91 80 4000 1100 (Demo)',
    email: 'dr.ananya.demo@healthcompanion.ai'
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Varma',
    specialty: 'Cardiology & Vascular Medicine',
    experienceYears: 18,
    hospital: 'Metro Heart & Vascular Institute',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['21 Sep 2026', '25 Sep 2026', '28 Sep 2026'],
    rating: 4.85,
    isDemo: true,
    phone: '+91 80 4000 2200 (Demo)',
    email: 'dr.rajesh.demo@healthcompanion.ai'
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Patel',
    specialty: 'Endocrinology & Diabetology',
    experienceYears: 11,
    hospital: 'City Diabetes & Hormone Center',
    languages: ['English', 'Gujarati', 'Hindi'],
    consultationTypes: ['Online'],
    availableDates: ['22 Sep 2026', '24 Sep 2026'],
    rating: 4.92,
    isDemo: true,
    phone: '+91 80 4000 3300 (Demo)',
    email: 'dr.priya.demo@healthcompanion.ai'
  },
  {
    id: 'doc-4',
    name: 'Dr. Vikram Seth',
    specialty: 'Dermatology & Clinical Immunology',
    experienceYears: 9,
    hospital: 'Care Skin & Allergy Center',
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Tomorrow, 2:30 PM', '23 Sep 2026'],
    rating: 4.78,
    isDemo: true,
    phone: '+91 80 4000 4400 (Demo)',
    email: 'dr.vikram.demo@healthcompanion.ai'
  },
  {
    id: 'doc-5',
    name: 'Dr. Meera Nambiar',
    specialty: 'Pediatrics & Adolescent Care',
    experienceYears: 16,
    hospital: 'Aster Children’s Hospital',
    languages: ['English', 'Malayalam', 'Hindi'],
    consultationTypes: ['In-person'],
    availableDates: ['23 Sep 2026', '26 Sep 2026'],
    rating: 4.95,
    isDemo: true,
    phone: '+91 80 4000 5500 (Demo)',
    email: 'dr.meera.demo@healthcompanion.ai'
  },
  {
    id: 'doc-6',
    name: 'Dr. Arvind Joshi',
    specialty: 'Orthopedics & Joint Care',
    experienceYears: 15,
    hospital: 'Fortis Bone & Joint Pavilion',
    languages: ['English', 'Hindi', 'Kannada'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['22 Sep 2026', '25 Sep 2026'],
    rating: 4.82,
    isDemo: true,
    phone: '+91 80 4000 6600 (Demo)',
    email: 'dr.arvind.demo@healthcompanion.ai'
  },
  {
    id: 'doc-7',
    name: 'Dr. Sunita Kulkarni',
    specialty: 'Neurology & Headache Specialist',
    experienceYears: 17,
    hospital: 'Apex Institute of Neurosciences',
    languages: ['English', 'Marathi', 'Hindi'],
    consultationTypes: ['Online'],
    availableDates: ['24 Sep 2026', '29 Sep 2026'],
    rating: 4.91,
    isDemo: true,
    phone: '+91 80 4000 7700 (Demo)',
    email: 'dr.sunita.demo@healthcompanion.ai'
  },
  {
    id: 'doc-8',
    name: 'Dr. Farhan Ali',
    specialty: 'Gastroenterology & Hepatology',
    experienceYears: 12,
    hospital: 'Max Digestive Health Pavilion',
    languages: ['English', 'Urdu', 'Hindi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['23 Sep 2026', '27 Sep 2026'],
    rating: 4.87,
    isDemo: true,
    phone: '+91 80 4000 8800 (Demo)',
    email: 'dr.farhan.demo@healthcompanion.ai'
  },
  {
    id: 'doc-neuro',
    name: 'Dr. Alok Verma',
    specialty: 'Neurosurgery & Spine Specialist',
    experienceYears: 19,
    hospital: 'Apollo Brain & Spine Institute',
    languages: ['English', 'Hindi', 'Kannada'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Today, 5:30 PM', 'Tomorrow, 11:00 AM', '25 Sep 2026'],
    rating: 4.97,
    isDemo: true,
    phone: '+91 80 4000 1010 (Demo)',
    email: 'dr.alok.neuro@apollo-health.ai'
  },
  {
    id: 'doc-dentist',
    name: 'Dr. Rohan Mehra',
    specialty: 'Dentistry & Maxillofacial Surgery',
    experienceYears: 13,
    hospital: 'Apollo Dental & Craniofacial Center',
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationTypes: ['In-person'],
    availableDates: ['Today, 3:00 PM', 'Tomorrow, 2:00 PM', '26 Sep 2026'],
    rating: 4.93,
    isDemo: true,
    phone: '+91 80 4000 2020 (Demo)',
    email: 'dr.rohan.dentist@apollo-dental.ai'
  },
  {
    id: 'doc-eye',
    name: 'Dr. Siddharth Rao',
    specialty: 'Ophthalmology & Vitreoretinal Eye Surgery',
    experienceYears: 15,
    hospital: 'Narayana Nethralaya Eye Institute',
    languages: ['English', 'Kannada', 'Hindi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Tomorrow, 10:00 AM', '24 Sep 2026', '27 Sep 2026'],
    rating: 4.96,
    isDemo: true,
    phone: '+91 80 4000 3030 (Demo)',
    email: 'dr.siddharth.eye@nethralaya.ai'
  },
  {
    id: 'doc-psych',
    name: 'Dr. Sneha Kulkarni',
    specialty: 'Psychiatry & Behavioral Neurosciences',
    experienceYears: 12,
    hospital: 'NIMHANS Integrated Behavioral Center',
    languages: ['English', 'Marathi', 'Hindi'],
    consultationTypes: ['Online'],
    availableDates: ['Today, 6:00 PM', 'Tomorrow, 4:00 PM', '25 Sep 2026'],
    rating: 4.95,
    isDemo: true,
    phone: '+91 80 4000 4040 (Demo)',
    email: 'dr.sneha.psych@nimhans-care.ai'
  },
  {
    id: 'doc-onco',
    name: 'Dr. Kabir Sengupta',
    specialty: 'Medical Oncology & Cancer Therapeutics',
    experienceYears: 17,
    hospital: 'HCG Cancer Centre & Research Pavilion',
    languages: ['English', 'Bengali', 'Hindi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Tomorrow, 11:30 AM', '26 Sep 2026'],
    rating: 4.98,
    isDemo: true,
    phone: '+91 80 4000 5050 (Demo)',
    email: 'dr.kabir.onco@hcg-care.ai'
  },
  {
    id: 'doc-ent',
    name: 'Dr. Pooja Nair',
    specialty: 'ENT & Head-Neck Micro-Surgery',
    experienceYears: 10,
    hospital: 'Manipal ENT Speciality Center',
    languages: ['English', 'Malayalam', 'Hindi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Today, 2:00 PM', '25 Sep 2026'],
    rating: 4.89,
    isDemo: true,
    phone: '+91 80 4000 6060 (Demo)',
    email: 'dr.pooja.ent@manipal-ent.ai'
  },
  {
    id: 'doc-pulmo',
    name: 'Dr. Vikramaditya Roy',
    specialty: 'Pulmonology & Chest Medicine',
    experienceYears: 14,
    hospital: 'Care Respiratory & Chest Institute',
    languages: ['English', 'Hindi', 'Bengali'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Tomorrow, 9:30 AM', '28 Sep 2026'],
    rating: 4.92,
    isDemo: true,
    phone: '+91 80 4000 7070 (Demo)',
    email: 'dr.vikram.pulmo@care-lungs.ai'
  },
  {
    id: 'doc-kidney',
    name: 'Dr. Tariq Mansoor',
    specialty: 'Nephrology & Renal Dialysis Care',
    experienceYears: 13,
    hospital: 'Apex Kidney Care & Dialysis Pavilion',
    languages: ['English', 'Urdu', 'Hindi'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['24 Sep 2026', '29 Sep 2026'],
    rating: 4.91,
    isDemo: true,
    phone: '+91 80 4000 8080 (Demo)',
    email: 'dr.tariq.kidney@apex-renal.ai'
  },
  {
    id: 'doc-9',
    name: 'Dr. Shalini Verma',
    specialty: 'Gynecology & Women’s Health',
    experienceYears: 14,
    hospital: 'Motherhood Specialty Hospital',
    languages: ['English', 'Hindi', 'Telugu'],
    consultationTypes: ['In-person', 'Online'],
    availableDates: ['Tomorrow, 11:00 AM', '25 Sep 2026'],
    rating: 4.94,
    isDemo: true,
    phone: '+91 80 4000 9900 (Demo)',
    email: 'dr.shalini.gyn@motherhood-care.ai'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ananya Sharma',
    specialty: 'General Medicine & Hematology',
    date: '24 Sep 2026',
    time: '10:30 AM',
    hospital: 'Apollo Health City, Bengaluru',
    type: 'In-person',
    status: 'Confirmed',
    reason: 'Review latest laboratory findings (Hemoglobin follow-up)',
    notes: 'Please bring recent fasting lab report and allergy history.'
  },
  {
    id: 'apt-2',
    doctorId: 'doc-2',
    doctorName: 'Dr. Rajesh Varma',
    specialty: 'Cardiology & Vascular Medicine',
    date: '12 Oct 2026',
    time: '03:00 PM',
    hospital: 'Metro Heart & Vascular Institute',
    type: 'Online',
    status: 'Confirmed',
    reason: 'Semi-annual lipid and blood pressure preventative review',
    notes: 'Teleconsultation link will be active 10 minutes prior.'
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'time-1',
    date: '19 Sep 2026',
    year: 2026,
    month: 'September',
    type: 'report',
    title: 'Laboratory Blood Test — Hematology & Metabolic Panel',
    hospital: 'Central Diagnostic Laboratory',
    doctor: 'Pathologist Dr. K. Rao',
    description: 'Complete blood count and fasting sugar test. Stated Hemoglobin: 11.2 g/dL, Fasting glucose: 92 mg/dL.',
    reportId: 'report-2026-09-19'
  },
  {
    id: 'time-2',
    date: '18 Aug 2026',
    year: 2026,
    month: 'August',
    type: 'consultation',
    title: 'General Consultation for Allergic Rhinitis',
    hospital: 'Apollo Clinic (Indiranagar)',
    doctor: 'Dr. Ananya Sharma',
    description: 'Evaluated seasonal sneezing and watery eyes. Prescribed non-sedating antihistamine and allergen avoidance advice.'
  },
  {
    id: 'time-3',
    date: '22 Jul 2026',
    year: 2026,
    month: 'July',
    type: 'prescription',
    title: 'Prescription & Allergy Medication Review',
    hospital: 'Apollo Health Pharmacy',
    doctor: 'Dr. Ananya Sharma',
    description: 'Refill review for Cetirizine 10mg as-needed and monthly Vitamin D3 maintenance schedule.'
  },
  {
    id: 'time-4',
    date: '12 Jun 2026',
    year: 2026,
    month: 'June',
    type: 'checkup',
    title: 'Annual Executive Health Checkup',
    hospital: 'Manipal Comprehensive Care',
    doctor: 'Dr. Suresh Babu',
    description: 'Comprehensive annual physical, 12-lead ECG, fasting lipid and renal profiling. Parameters stable.',
    reportId: 'report-2026-06-12'
  },
  {
    id: 'time-5',
    date: '15 Nov 2025',
    year: 2025,
    month: 'November',
    type: 'checkup',
    title: 'Preventive Dental Prophylaxis & Examination',
    hospital: 'Apollo Dental Care',
    doctor: 'Dr. R. Mehra',
    description: 'Biannual dental checkup, ultrasonic scaling, and fluoride polish. No carious lesions identified.'
  },
  {
    id: 'time-6',
    date: '20 Apr 2025',
    year: 2025,
    month: 'April',
    type: 'consultation',
    title: 'Immunization & Tetanus Toxoid Booster',
    hospital: 'St. John’s Wellness Clinic',
    doctor: 'Dr. Neha Gupta',
    description: 'Routine 10-year tetanus booster administered. Clear of post-injection adverse effects.'
  }
];

export const MEDICATION_GUIDES: MedicationGuide[] = [
  {
    id: 'med-paracetamol',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesic & Antipyretic (Pain Reliever & Fever Reducer)',
    categoryKey: 'pain-fever',
    dosageForm: 'Oral Tablets 500mg / 650mg, Oral Suspension 120mg/5ml, IV Infusion',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Temporary relief of mild to moderate pain (tension headaches, muscle aches, toothaches, dysmenorrhea)',
      'Reduction of elevated body temperature during pyrexia and viral illness',
      'First-line pain management for osteoarthritis in elderly patients when NSAIDs are contraindicated'
    ],
    generalPrecautions: [
      'Strictly avoid exceeding maximum adult daily ceiling of 3,000 mg to 4,000 mg within any 24-hour cycle',
      'Examine combination remedies (cold syrups, decongestants, sinus formulations) to avoid lethal unintentional hepatotoxic duplication',
      'Refrain from chronic alcohol consumption while taking paracetamol due to cytochrome P450 2E1 induction producing toxic NAPQI metabolite'
    ],
    commonSideEffects: [
      'Generally well-tolerated at recommended therapeutic dosages without gastric irritation',
      'Infrequent: mild nausea, dyspepsia, or allergic erythematous rash in susceptible patients'
    ],
    whenToSeekDoctor: [
      'If fever persists beyond 72 consecutive hours without downward trend',
      'If generalized or localized pain continues beyond 5 days in children or 7 days in adults',
      'IMMEDIATELY in suspected acute overdose: signs of acute hepatic failure (right upper quadrant pain, scleral icterus, dark urine, persistent emesis)'
    ],
    clinicalProfile: {
      therapeuticClass: 'Non-opioid Analgesic & Central Antipyretic',
      mechanismOfAction: 'Inhibits central nervous system prostaglandin synthesis (COX-3 / central COX-1 & 2 variant) and modulates descending serotonergic pathways; lacks peripheral anti-inflammatory action.',
      onsetOfAction: 'Oral: 30 to 45 minutes; Peak concentration reached within 60 to 90 minutes.',
      durationOfAction: 'Analgesic effect: 4 to 6 hours; Antipyretic effect: up to 8 hours.'
    },
    administration: {
      typicalDosage: 'Adults & Adolescents >50kg: 500 mg to 1,000 mg orally every 4 to 6 hours as needed.',
      administrationTiming: 'May be taken with or without food. Taking with a full glass of water accelerates gastric emptying and onset.',
      maximumDailyLimit: '4,000 mg/day under medical supervision; 3,000 mg/day recommended for unmonitored self-medication.',
      missedDoseAdvice: 'Take as soon as recalled if pain persists. Never double the dose or take two doses within 4 hours of each other.',
      durationGuideline: 'Limit self-medication to 3 days for fever or 5 days for acute pain without clinical evaluation.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Warfarin & Coumarin Anticoagulants: Prolonged daily usage (>2g/day for >3 days) may elevate INR and bleeding tendency.',
        'Isoniazid, Phenytoin, Carbamazepine: Induces CYP2E1 enzymes, significantly increasing risk of hepatotoxicity even at therapeutic doses.',
        'Cholestyramine: Reduces paracetamol intestinal absorption if taken within 1 hour.'
      ],
      foodAndDietaryInteractions: [
        'Chronic Ethanol / Alcohol: Greatly potentiates risk of liver necrosis via glutathione depletion.',
        'High pectin or fibrous carbohydrates: May marginally delay peak absorption without altering bioavailability.'
      ],
      contraindicatedConditions: [
        'Severe acute hepatic impairment or active end-stage liver disease',
        'Known hypersensitivity to paracetamol or acetaminophen preparations',
        'Severe chronic malnutrition or acute starvation state'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Occasional light nausea or epigastric discomfort',
        'Mild transient somnolence'
      ],
      moderateRequiresMonitoring: [
        'Pruritus, maculopapular cutaneous rash, or urticaria',
        'Asymptomatic elevation of serum transaminases (ALT/AST)'
      ],
      severeEmergencySymptoms: [
        'Acute Liver Failure: Jaundice, coagulopathy, hepatic encephalopathy, severe right hypochondrial tenderness',
        'Stevens-Johnson Syndrome (SJS) and Toxic Epidermal Necrolysis (TEN): blistering mucocutaneous eruption',
        'Anaphylaxis: Angioedema of lips/tongue, bronchospasm, cardiovascular collapse'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at controlled room temperature between 20°C and 25°C (68°F to 77°F). Protect from extreme heat exceeding 40°C.',
      moistureGuidance: 'Keep in original blister packaging or tightly sealed container; avoid bathroom medicine cabinets with high humidity.',
      childSafety: 'Store high out of reach of children. Liquid suspensions must have child-resistant safety caps securely fastened.',
      disposalProcedure: 'Do not flush down household toilets. Utilize pharmacy medication return kiosks or mix with unpalatable cat litter/grounds in sealed trash.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category B. Considered analgesic of choice across all trimesters of pregnancy at lowest effective dose and shortest duration. Passes into breast milk in trace clinically negligible quantities.',
      renalImpairment: 'Severe renal impairment (eGFR <30 mL/min): Prolong dosing interval to every 6 to 8 hours.',
      hepaticConsideration: 'Dose reduction to ≤2,000 mg/day warranted in mild-to-moderate chronic liver impairment or cirrhosis; contraindicated in acute severe liver failure.',
      pediatricGeriatricNotes: 'Pediatric dosing MUST be calculated strictly by body weight (10 to 15 mg/kg per dose every 4-6 hours, max 60 mg/kg/day). Geriatric patients require lower daily thresholds (≤3g/day).'
    },
    safetyChecklist: {
      ageConsideration: 'Weight-based dosing (10-15 mg/kg) mandatory for infants and children under 12 years. Always use the calibrated syringe provided.',
      allergyWarning: 'Do not administer if prior history of facial swelling, hives, or anaphylactoid reaction to paracetamol.',
      interactionsWarning: 'Audit all concurrent cough/cold syrup formulations for hidden acetaminophen content before administering.',
      pregnancyWarning: 'Permissible across pregnancy when clinically indicated; avoid prolonged continuous therapy without obstetrician consultation.'
    }
  },
  {
    id: 'med-tramadol',
    name: 'Tramadol Hydrochloride',
    genericName: 'Tramadol HCl',
    category: 'Pain & Fever (Central Analgesic - Moderate to Severe Pain)',
    categoryKey: 'pain-fever',
    dosageForm: 'Immediate Release Tablets 50mg, Extended Release Capsules 100mg',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Management of moderate to moderately severe acute postoperative or post-traumatic pain',
      'Chronic neuropathic and musculoskeletal pain refractory to non-opioid analgesics'
    ],
    generalPrecautions: [
      'Strict prescription opioid; potential for psychological dependence, tolerance, and physical addiction',
      'Lowers seizure threshold; extreme hazard in epilepsy or concurrent SSRI / SNRI / TCA antidepressant therapy',
      'Risk of lethal respiratory depression if combined with benzodiazepines or alcohol'
    ],
    commonSideEffects: [
      'Dizziness, somnolence, nausea, vomiting, constipation, diaphoresis (sweating), and xerostomia (dry mouth)'
    ],
    whenToSeekDoctor: [
      'Signs of Serotonin Syndrome: agitation, hallucinations, hyperreflexia, clonus, tachycardia, hyperthermia',
      'Signs of Respiratory Depression: shallow slow breathing (<10 breaths/min), extreme drowsiness, cyanotic lips'
    ],
    clinicalProfile: {
      therapeuticClass: 'Centrally-acting Synthetic Opioid Analgesic & Dual Monoamine Reuptake Inhibitor',
      mechanismOfAction: 'Weak agonist at mu-opioid receptors combined with inhibition of neuronal reuptake of norepinephrine and serotonin, dampening ascending pain signals in the spinal cord.',
      onsetOfAction: 'Within 60 minutes; peak analgesic efficacy at 2 to 3 hours.',
      durationOfAction: 'Immediate release: 4 to 6 hours; Extended release: 24 hours.'
    },
    administration: {
      typicalDosage: 'Immediate release: 50 mg to 100 mg orally every 4 to 6 hours as needed for severe pain.',
      administrationTiming: 'May be taken with or without food. Consistent timing improves plasma stability.',
      maximumDailyLimit: '400 mg per day in healthy adults (300 mg per day in patients older than 75 years).',
      missedDoseAdvice: 'Take as soon as remembered unless close to subsequent dose. Never double doses.',
      durationGuideline: 'Strictly limited to shortest duration required; taper gradually under medical supervision to avoid withdrawal symptoms.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'SSRIs, SNRIs, MAOIs, Triptans: Extreme hazard of life-threatening Serotonin Syndrome.',
        'Benzodiazepines & Sedatives: Compounded central nervous system and fatal respiratory depression.',
        'Carbamazepine: Substantially diminishes tramadol analgesic efficacy while increasing seizure risk.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol: Synergistic CNS depression, profound sedation, respiratory arrest. Strictly prohibited.'
      ],
      contraindicatedConditions: [
        'Uncontrolled epilepsy or known seizure disorders',
        'Concurrent or recent (within 14 days) MAO inhibitor antidepressant therapy',
        'Acute intoxication with alcohol, hypnotics, or centrally acting analgesics'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Lightheadedness, dizziness, dry mouth, mild nausea, constipation'
      ],
      moderateRequiresMonitoring: [
        'Orthostatic hypotension, cognitive slowing, urinary retention, tremors'
      ],
      severeEmergencySymptoms: [
        'Severe respiratory depression (<8 breaths/min), grand mal seizures, Serotonin Syndrome, coma'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 15°C to 30°C (59°F to 86°F) in a locked cabinet.',
      moistureGuidance: 'Protect from excess humidity and direct sun exposure.',
      childSafety: 'Schedule IV controlled substance: keep under lock and key away from unauthorized individuals and minors.',
      disposalProcedure: 'Take back to licensed pharmacy take-back collection receptacle; do not discard in common municipal trash.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category C. Crosses placenta and enters breast milk. Chronic maternal use risks neonatal opioid withdrawal syndrome (NOWS). Contraindicated during breastfeeding.',
      renalImpairment: 'eGFR <30 mL/min: Increase dosing interval to every 12 hours; maximum 200 mg/day.',
      hepaticConsideration: 'Cirrhosis / hepatic impairment: 50 mg every 12 hours maximum due to reduced clearance.',
      pediatricGeriatricNotes: 'Contraindicated in pediatric patients under 12 years and post-tonsillectomy/adenoidectomy under 18. Geriatric patients: titrate slowly due to fall risks.'
    },
    safetyChecklist: {
      ageConsideration: 'Contraindicated under 12 years of age due to risk of fatal respiratory depression.',
      allergyWarning: 'Do not administer if prior history of opioid anaphylaxis or hypersensitivity.',
      interactionsWarning: 'Verify patient is not taking fluoxetine, sertraline, duloxetine, or linezolid.',
      pregnancyWarning: 'Avoid during gestation and lactation unless explicitly mandated by maternal-fetal specialist.'
    }
  },
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'NSAID / Anti-inflammatory',
    categoryKey: 'nsaid',
    dosageForm: 'Oral Film-coated Tablets 200mg / 400mg, Oral Suspension 100mg/5ml',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Alleviation of acute inflammatory musculoskeletal discomfort, sports sprains, tendonitis, and joint synovitis',
      'Relief of dental post-procedure inflammation, headache, dysmenorrhea, and inflammatory fevers',
      'Symptomatic management of osteoarthritis and rheumatoid arthritis under medical supervision'
    ],
    generalPrecautions: [
      'Always ingest with a meal, snack, or glass of milk to buffer the gastric mucosal barrier against erosion',
      'Contraindicated in patients with active peptic ulcer disease, gastrointestinal hemorrhage, or severe chronic kidney disease',
      'Black Box Warning: Increased cardiovascular thrombotic risk (myocardial infarction, stroke); avoid immediately after CABG cardiac surgery'
    ],
    commonSideEffects: [
      'Epigastric burn (heartburn), dyspepsia, abdominal cramps, mild nausea, fluid retention (peripheral edema)'
    ],
    whenToSeekDoctor: [
      'Signs of Upper GI Hemorrhage: melena (tarry black foul-smelling stools), coffee-ground emesis, persistent severe epigastric agony',
      'Acute Renal Injury: sudden oliguria (scant urination), rapid facial/ankle puffiness, unexplained shortness of breath'
    ],
    clinicalProfile: {
      therapeuticClass: 'Non-Steroidal Anti-Inflammatory Drug (NSAID) - Propionic Acid Derivative',
      mechanismOfAction: 'Reversibly and non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, halting conversion of arachidonic acid to pro-inflammatory prostaglandins and thromboxanes.',
      onsetOfAction: 'Analgesic: 30 to 60 minutes; Anti-inflammatory peak: up to 1 to 2 weeks of sustained regular dosing.',
      durationOfAction: '4 to 6 hours for analgesic action; half-life approximately 1.8 to 2 hours.'
    },
    administration: {
      typicalDosage: 'Adults: 200 mg to 400 mg orally every 4 to 6 hours with food. Prescription arthritis dose: up to 800 mg 3x daily.',
      administrationTiming: 'Must be administered with meals, milk, or immediately after eating.',
      maximumDailyLimit: 'OTC daily ceiling: 1,200 mg/day. Prescription physician-monitored limit: 2,400 mg/day (or 3,200 mg/day under strict rheumatology oversight).',
      missedDoseAdvice: 'Take with food as soon as remembered. Skip if close to subsequent dose. Never ingest double doses.',
      durationGuideline: 'Do not exceed 10 days for pain or 3 days for fever without physician review.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Aspirin: Ibuprofen competitively interferes with low-dose aspirin antiplatelet cardioprotection if taken simultaneously.',
        'Anticoagulants (Apixaban, Rivaroxaban, Warfarin): Multiplies major gastrointestinal bleeding risk exponentially.',
        'ACE Inhibitors & ARBs (e.g. Lisinopril, Losartan): Blunts anti-hypertensive efficacy and induces acute hyperkalemic renal failure.',
        'Lithium & Methotrexate: Decreases renal clearance, provoking toxic systemic accumulation.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol: Synergistically damages the gastric mucous lining, causing erosion and bleeding.',
        'Ginkgo Biloba & High-Dose Vitamin E: Increases bleeding tendency.'
      ],
      contraindicatedConditions: [
        'Active peptic ulceration, recurrent gastric erosions, or active gastrointestinal bleeding',
        'Severe Heart Failure (NYHA Class III-IV) and coronary artery bypass graft (CABG) perioperative setting',
        'Aspirin-exacerbated respiratory disease (AERD) / triad asthma with nasal polyps'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Heartburn, mild epigastric burn, nausea, flatulence, light dizziness'
      ],
      moderateRequiresMonitoring: [
        'Elevated blood pressure, ankle edema, mild reduction in glomerular filtration, tinnitus (ringing ears)'
      ],
      severeEmergencySymptoms: [
        'Perforated peptic ulcer, acute tubular necrosis, sudden myocardial infarction, anaphylactic bronchospasm'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 20°C to 25°C (68°F to 77°F). Excursions permitted between 15°C and 30°C.',
      moistureGuidance: 'Keep desiccants in bottle; avoid humid steam environments.',
      childSafety: 'Store in child-resistant safety vials away from infant reach.',
      disposalProcedure: 'Take to hazardous medication drop-off bins; avoid contaminating water tables.'
    },
    specialPopulations: {
      pregnancyLactation: 'Strict Black Box Contraindication at ≥20 weeks gestation due to fetal oligohydramnios and premature closure of fetal ductus arteriosus. Compatible with lactation in low single doses.',
      renalImpairment: 'Avoid in moderate to severe chronic kidney disease (eGFR <30 mL/min); induces hemodynamically mediated renal failure.',
      hepaticConsideration: 'Use lowest effective dose; extensive hepatic metabolism (CYP2C9); monitor in cirrhosis.',
      pediatricGeriatricNotes: 'Approved for infants >6 months (weight-based 5 to 10 mg/kg). Geriatric patients have elevated risk of silent catastrophic peptic ulceration.'
    },
    safetyChecklist: {
      ageConsideration: 'Not licensed for infants under 6 months of age without specialized pediatric prescription.',
      allergyWarning: 'Contraindicated if patient has history of bronchospasm, angioedema, or urticaria triggered by aspirin.',
      interactionsWarning: 'Do not combine with other NSAIDs (Naproxen, Diclofenac, Celecoxib) or blood thinners.',
      pregnancyWarning: 'Strictly contraindicated after 20 weeks of gestation due to dangerous fetal vascular complications.'
    }
  },
  {
    id: 'med-naproxen',
    name: 'Naproxen Sodium',
    genericName: 'Naproxen Sodium',
    category: 'NSAID / Anti-inflammatory',
    categoryKey: 'nsaid',
    dosageForm: 'Tablets 220mg (OTC), 500mg (Rx)',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Longer-duration relief of acute joint aches, osteoarthritis flare-ups, bursitis, and ankylosing spondylitis',
      'Management of severe menstrual cramps (primary dysmenorrhea) and dental inflammatory pain'
    ],
    generalPrecautions: [
      'Extended half-life (12 to 17 hours): Requires only 12-hourly dosing; frequent dosing risks toxic accumulation',
      'Must take with plenty of fluids and food to prevent esophageal lodging and gastric ulceration',
      'Elevates blood pressure and attenuates cardioprotective medications'
    ],
    commonSideEffects: [
      'Gastrointestinal distress, constipation, fluid retention, headache, somnolence'
    ],
    whenToSeekDoctor: [
      'Chest pain, unilateral weakness, slurred speech (cerebrovascular warning signs)',
      'Black bloody stools, sudden severe abdominal pain, persistent vomiting'
    ],
    clinicalProfile: {
      therapeuticClass: 'Non-Steroidal Anti-Inflammatory Drug (NSAID) - Arylacetic Acid Derivative',
      mechanismOfAction: 'Inhibits both COX-1 and COX-2 enzymes to decrease synthesis of inflammatory prostanoids with an extended plasma duration.',
      onsetOfAction: 'Within 30 to 60 minutes; peak anti-inflammatory effect reached within 2 to 4 hours.',
      durationOfAction: 'Up to 12 hours.'
    },
    administration: {
      typicalDosage: 'Adults: 220 mg (OTC) orally every 8 to 12 hours with a full glass of water and food.',
      administrationTiming: 'Immediately after food or with milk; do not lie down for 10 minutes after swallowing.',
      maximumDailyLimit: 'OTC: 660 mg within 24 hours. Prescription: 1,000 mg to 1,250 mg daily.',
      missedDoseAdvice: 'Take if remembered within a few hours; otherwise skip. Do not take two 12-hour doses closely.',
      durationGuideline: 'Limit to 10 days for pain or 3 days for fever without physician guidance.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Anticoagulants & Antiplatelets: Severe gastrointestinal hemorrhage risk.',
        'Diuretics (Furosemide) & ACE Inhibitors: Blunts natriuresis and increases risk of acute renal shutdown.',
        'Selective Serotonin Reuptake Inhibitors (SSRIs): Increases platelet dysfunction and upper GI bleed rate.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol: Synergistic mucosal ulceration. Strictly avoid.'
      ],
      contraindicatedConditions: [
        'Active peptic ulcer disease or GI bleeding history',
        'Severe renal impairment (Creatinine Clearance <30 mL/min)',
        'Third trimester of pregnancy'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Nausea, heartburn, abdominal cramps, mild lightheadedness'
      ],
      moderateRequiresMonitoring: [
        'Hypertension, dependent edema, tinnitus, elevated liver enzymes'
      ],
      severeEmergencySymptoms: [
        'Perforated peptic ulcer, acute renal papillary necrosis, anaphylaxis'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 20°C to 25°C in light-resistant container.',
      moistureGuidance: 'Protect from moisture and dampness.',
      childSafety: 'Child-proof containers mandatory.',
      disposalProcedure: 'Pharmacy take-back program.'
    },
    specialPopulations: {
      pregnancyLactation: 'Contraindicated at ≥20 weeks of pregnancy. Low concentrations in breast milk; consult pediatrician.',
      renalImpairment: 'Contraindicated in advanced renal failure (CrCl <30 mL/min).',
      hepaticConsideration: 'Use lowest effective dose; unbound fractions higher in severe cirrhosis.',
      pediatricGeriatricNotes: 'Not recommended for children under 12 without pediatric rheumatologist order. Elderly have high risk of asymptomatic peptic ulcers.'
    },
    safetyChecklist: {
      ageConsideration: 'Do not administer to children under 12 without prescription.',
      allergyWarning: 'Contraindicated in aspirin-sensitive asthma.',
      interactionsWarning: 'Do not take alongside Ibuprofen, Meloxicam, or Aspirin.',
      pregnancyWarning: 'Contraindicated beyond 20th week of pregnancy.'
    }
  },
  {
    id: 'med-cetirizine',
    name: 'Cetirizine Hydrochloride',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamine & Allergy',
    categoryKey: 'antihistamine',
    dosageForm: 'Oral Film-coated Tablets 10mg, Oral Solution 1mg/ml',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Rapid symptomatic relief of seasonal allergic rhinitis (hay fever): sneezing, rhinorrhea, nasal itching, itchy palate',
      'Alleviation of perennial allergic conjunctivitis: ocular pruritus, conjunctival hyperemia, lacrimation',
      'Management of acute and chronic idiopathic urticaria (hives): reduces wheal surface area and severe erythema'
    ],
    generalPrecautions: [
      'Although classified as second-generation non-sedating, causes mild somnolence in approximately 10-14% of patients; bedtime dosing recommended',
      'Exercise caution when operating motor vehicles or precision heavy equipment until individual sedative threshold is known',
      'Avoid simultaneous ingestion of alcohol or central nervous system sedatives'
    ],
    commonSideEffects: [
      'Mild daytime drowsiness or fatigue, dry oral mucosa (xerostomia), pharyngitis, mild dizziness'
    ],
    whenToSeekDoctor: [
      'Signs of Acute Anaphylaxis: laryngeal edema, acute wheezing, stridor, hypotension (requires immediate intramuscular Epinephrine, not oral antihistamines)',
      'Persistence of intense allergic symptoms beyond 14 days of compliant daily administration'
    ],
    clinicalProfile: {
      therapeuticClass: 'Second-Generation Peripheral H1-Receptor Antagonist',
      mechanismOfAction: 'Selectively blocks peripheral H1 histamine receptors on effector cells, preventing histamine-mediated capillary permeability, vasodilation, and sensory nerve terminal itching; possesses minimal central anticholinergic activity.',
      onsetOfAction: 'Within 20 to 60 minutes; peak plasma concentration within 1 hour.',
      durationOfAction: '24 hours with once-daily dosing due to high receptor affinity.'
    },
    administration: {
      typicalDosage: 'Adults & Children ≥12 years: 10 mg orally once daily in the evening (or 5 mg twice daily if sensitive to sedation).',
      administrationTiming: 'May be taken with or without food. Evening administration minimizes daytime drowsiness.',
      maximumDailyLimit: '10 mg within 24 hours (higher doses increase sedation without boosting therapeutic efficacy).',
      missedDoseAdvice: 'Take as soon as remembered. Do not take two doses at the same time to compensate.',
      durationGuideline: 'Safe for seasonal multi-week use during pollen seasons or as prescribed for chronic urticaria.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'CNS Depressants (Benzodiazepines, Zolpidem, Opioids): Compounded psychomotor sedation and slowed reflexes.',
        'Theophylline: Mild (16%) reduction in cetirizine clearance without alteration of theophylline disposition.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol: Markedly potentiates somnolence, cognitive slowing, and impaired coordination.',
        'Food: Does not significantly decrease overall systemic bioavailability, though delays peak absorption time by ~1 hour.'
      ],
      contraindicatedConditions: [
        'End-stage renal disease (eGFR <15 mL/min or patients requiring hemodialysis)',
        'Known severe hypersensitivity to cetirizine, hydroxyzine, or piperazine derivatives'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Dry mouth, mild somnolence, fatigue, headache'
      ],
      moderateRequiresMonitoring: [
        'Urinary retention in men with benign prostatic hyperplasia (BPH), blurred vision'
      ],
      severeEmergencySymptoms: [
        'Hypersensitivity angioedema, bronchospasm, severe drug eruption'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 20°C to 25°C (68°F to 77°F).',
      moistureGuidance: 'Protect from excess moisture and intense direct sunlight.',
      childSafety: 'Store out of sight and reach of children.',
      disposalProcedure: 'Dispose via standard medication collection kiosks.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category B. Animal studies reveal no harm; widely used in pregnancy under clinical guidance. Excreted into human milk; low-sedation alternatives preferred during lactation.',
      renalImpairment: 'Moderate impairment (CrCl 30-49 mL/min): reduce dose to 5 mg once daily. Severe impairment (CrCl <30 mL/min): 5 mg every 48 hours.',
      hepaticConsideration: 'Dose adjustment to 5 mg daily recommended in severe chronic hepatic impairment.',
      pediatricGeriatricNotes: 'Approved for children ≥2 years (weight-based pediatric syrup). Geriatric patients: initiate at 5 mg daily due to age-related renal clearance reductions.'
    },
    safetyChecklist: {
      ageConsideration: 'Liquid syrup available for children 2 to 11 years; 10mg tablets for ages 12 and above.',
      allergyWarning: 'Do not use if allergic to hydroxyzine (Atarax) due to cross-reactivity.',
      interactionsWarning: 'Avoid combining with sleeping pills or heavy alcohol intake.',
      pregnancyWarning: 'Generally favorable profile in pregnancy; consult with prenatal clinician.'
    }
  },
  {
    id: 'med-levocet-montelukast',
    name: 'Levocetirizine + Montelukast',
    genericName: 'Levocetirizine 5mg + Montelukast Sodium 10mg',
    category: 'Antihistamine & Allergy',
    categoryKey: 'antihistamine',
    dosageForm: 'Bilayered Oral Tablets',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Comprehensive management of allergic rhinitis complicated by bronchial asthma or persistent nocturnal airway constriction',
      'Persistent allergic cough, seasonal rhinoconjunctivitis, and perennial nasal polyposis symptoms'
    ],
    generalPrecautions: [
      'Black Box Warning for Montelukast: Potential neuropsychiatric adverse events (agitation, dream abnormalities, depression, suicidal ideation)',
      'Not a rescue bronchodilator: Never utilize to terminate acute asthmatic attacks or status asthmaticus',
      'Administer consistently in the evening to optimize circadian mediator coverage'
    ],
    commonSideEffects: [
      'Headache, dyspepsia, pharyngitis, fatigue, vivid dreams or mild sleep disturbances'
    ],
    whenToSeekDoctor: [
      'Immediately if neuropsychiatric mood swings, severe nightmares, behavioral alterations, or depression emerge',
      'Acute exacerbation of asthma requiring multiple rescue inhaler puffs without relief'
    ],
    clinicalProfile: {
      therapeuticClass: 'Dual-action Anti-allergy: Enantiopure H1 Antihistamine + Leukotriene Receptor Antagonist (LTRA)',
      mechanismOfAction: 'Levocetirizine blocks peripheral H1 histamine receptors, while Montelukast competitively antagonizes cysteinyl leukotriene CysLT1 receptors, suppressing both early vascular leak and late-phase eosinophilic airway inflammation.',
      onsetOfAction: 'Within 1 hour; peak dual therapeutic activity reached within 2 to 3 hours.',
      durationOfAction: 'Full 24-hour therapeutic coverage.'
    },
    administration: {
      typicalDosage: 'Adults & Adolescents ≥15 years: One combination tablet (5mg Levocetirizine / 10mg Montelukast) once daily.',
      administrationTiming: 'Take in the evening with water, with or without meals.',
      maximumDailyLimit: 'One combination tablet daily.',
      missedDoseAdvice: 'Take the next dose at the regular scheduled evening time. Do not ingest two tablets.',
      durationGuideline: 'Prescribed as maintenance therapy for 2 to 6 weeks during peak allergen exposure.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Phenobarbital & Rifampin: Induce CYP enzymes, lowering montelukast plasma levels by ~40%.',
        'Gemfibrozil: Inhibits CYP2C8, elevating montelukast exposure.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol: Enhances levocetirizine central sedation. Avoid.'
      ],
      contraindicatedConditions: [
        'Severe renal impairment (eGFR <10 mL/min) or end-stage hemodialysis',
        'History of acute montelukast-induced neuropsychiatric psychosis'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Morning grogginess, dry throat, mild headache, nasal congestion'
      ],
      moderateRequiresMonitoring: [
        'Vivid dreams, restless sleep, transient skin rash'
      ],
      severeEmergencySymptoms: [
        'Severe neuropsychiatric distress, suicidal ideation, Churg-Strauss systemic eosinophilic vasculitis'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store below 25°C in a dry location protected from light.',
      moistureGuidance: 'Moisture-sensitive blister strips; do not remove until immediately before swallowing.',
      childSafety: 'Store securely away from young children.',
      disposalProcedure: 'Standard return to hospital pharmacy.'
    },
    specialPopulations: {
      pregnancyLactation: 'Use only if clearly needed and approved by maternal pulmonologist. Montelukast is excreted in breast milk in small amounts.',
      renalImpairment: 'Levocetirizine component is renally eliminated; adjust or avoid in severe renal disease.',
      hepaticConsideration: 'No dose adjustment for mild-to-moderate hepatic insufficiency.',
      pediatricGeriatricNotes: 'Combination 5/10mg tablet reserved for ≥15 years. Monitor elderly closely for sedation and falls.'
    },
    safetyChecklist: {
      ageConsideration: 'Prescription formulation designated for patients 15 years and older.',
      allergyWarning: 'Contraindicated if prior hypersensitivity to cetirizine or montelukast.',
      interactionsWarning: 'Inform physician of all psychiatric medications and asthma inhalers.',
      pregnancyWarning: 'Requires explicit clearance from obstetrician and pulmonologist.'
    }
  },
  {
    id: 'med-ors',
    name: 'Oral Rehydration Salts (ORS - WHO Formula)',
    genericName: 'Reduced Osmolarity Electrolyte & Glucose Formulation (WHO 2006)',
    category: 'Electrolytes & Hydration',
    categoryKey: 'electrolytes',
    dosageForm: 'Soluble Powder Packets for Reconstitution (20.5g / 21.8g per 1 Liter)',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Prevention and clinical management of mild-to-moderate dehydration stemming from acute gastroenteritis, secretory diarrhea, or frequent emesis',
      'Rapid replenishment of water and essential electrolytes lost through heavy physical exertion in high-temperature environments',
      'Supportive oral fluid restoration for children and elderly individuals during febrile viral episodes'
    ],
    generalPrecautions: [
      'CRITICAL: Must be reconstituted STRICTLY in the exact volume of clean drinking water specified on the packet (standard WHO: 1 Liter)',
      'NEVER mix with cow’s milk, fruit juices, soda beverages, or supplemental sugar; hyperosmolar solutions exacerbate osmotic diarrhea',
      'Discard any unused prepared reconstituted liquid solution after 24 hours at room temperature (or 48 hours if continuously refrigerated)'
    ],
    commonSideEffects: [
      'Extremely safe and physiologically isotonic; mild nausea if gulped in large volumes instead of sipped slowly'
    ],
    whenToSeekDoctor: [
      'Signs of Severe Dehydration requiring immediate intravenous fluid resuscitation: extreme lethargy, sunken fontanelle/eyes, loss of skin turgor, no urination for >8 hours',
      'Inability to tolerate oral fluids due to intractable projectile vomiting, or appearance of gross hematochezia (bright blood in stool)'
    ],
    clinicalProfile: {
      therapeuticClass: 'Physiological Electrolyte & Volume Replenisher',
      mechanismOfAction: 'Exploits the intact sodium-glucose luminal cotransporter (SGLT-1) in the small intestinal brush border: active absorption of glucose molecules pulls sodium ions and water molecules passively across the mucosa into bloodstream, even during bacterial cholera toxin-mediated diarrhea.',
      onsetOfAction: 'Intestinal absorption begins within 5 to 10 minutes of oral ingestion.',
      durationOfAction: 'Maintains intravascular and cellular volume throughout continuous rehydration protocol.'
    },
    administration: {
      typicalDosage: 'Adults: 200 mL to 400 mL after every loose watery stool. Children: 100 mL to 200 mL after every liquid stool in frequent small sips.',
      administrationTiming: 'Administer sip by sip using a spoon or cup every 2 to 5 minutes; avoid rapid bottle drinking which triggers gastric distension emesis.',
      maximumDailyLimit: 'No strict ceiling; match volume directly to estimated diarrheal/vomiting fluid loss plus maintenance requirements.',
      missedDoseAdvice: 'Rehydrate continuously as long as gastrointestinal fluid loss persists.',
      durationGuideline: 'Continue until diarrhea ceases and patient resumes normal solid feeding.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Potassium-Sparing Diuretics (Spironolactone) & ACE Inhibitors: Monitor potassium levels if consuming massive ORS volumes in renal disease.',
        'Oral Antibiotics & Minerals: ORS solution does not impair antibiotic absorption.'
      ],
      foodAndDietaryInteractions: [
        'Continue regular breastfeeding and age-appropriate nutrition alongside ORS; never withhold food.'
      ],
      contraindicatedConditions: [
        'Intestinal obstruction, ileus, or bowel perforation',
        'Severe intractable shock or unconsciousness (demands emergency IV fluids)',
        'Anuria or severe acute oliguric renal shutdown'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Mild saltiness, transient fullness'
      ],
      moderateRequiresMonitoring: [
        'Vomiting if swallowed too quickly in large gulps'
      ],
      severeEmergencySymptoms: [
        'Hypernatremia (twitching, seizures) if powdered packet incorrectly prepared in too little water'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store dry unopened foil sachets below 30°C.',
      moistureGuidance: 'Protect from moisture; caked or darkened powder should be discarded.',
      childSafety: 'Safe for all ages; keep reconstituted jugs covered.',
      disposalProcedure: 'Discard unused reconstituted solution after 24 hours.'
    },
    specialPopulations: {
      pregnancyLactation: 'Fully safe and recommended during pregnancy and lactation for dehydration from hyperemesis or foodborne illness.',
      renalImpairment: 'Use with caution in chronic kidney failure due to potassium and sodium load; monitor serum electrolytes.',
      hepaticConsideration: 'Safe in liver disease; does not burden hepatic enzyme pathways.',
      pediatricGeriatricNotes: 'Cornerstone WHO therapy worldwide for infants and children with diarrhea. Give 1 teaspoon every 1-2 minutes in infants.'
    },
    safetyChecklist: {
      ageConsideration: 'Safe for all age groups from newborn infants to advanced geriatrics.',
      allergyWarning: 'Contains elemental salts and glucose; no allergen hazards.',
      interactionsWarning: 'Verify correct clean water ratio: 1 packet to 1000ml water.',
      pregnancyWarning: 'Safe and beneficial for rehydration during all gestational phases.'
    }
  },
  {
    id: 'med-pantoprazole',
    name: 'Pantoprazole Sodium',
    genericName: 'Pantoprazole',
    category: 'Acid Reducer & GI',
    categoryKey: 'gi-acid',
    dosageForm: 'Gastro-Resistant Delayed-Release Tablets 40mg, IV Lyophilized Powder',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Treatment and mucosal healing of erosive gastroesophageal reflux disease (GERD) and reflux esophagitis',
      'Eradication of Helicobacter pylori in triple-therapy regimens alongside Amoxicillin and Clarithromycin',
      'Prophylaxis against NSAID-induced gastric mucosal ulceration in high-risk patients',
      'Pathological hypersecretory conditions including Zollinger-Ellison Syndrome'
    ],
    generalPrecautions: [
      'Must be swallowed whole 30 to 60 minutes prior to the first meal of the day; NEVER crush, split, or chew enteric-coated pellets',
      'Prolonged continuous therapy (>1 year) linked to hypomagnesemia, impaired calcium absorption, and elevated osteoporotic fracture risk',
      'Suppresses gastric acid, slightly increasing vulnerability to Clostridioides difficile colitis and community-acquired pneumonia'
    ],
    commonSideEffects: [
      'Mild headache, flatulence, abdominal pain, diarrhea, constipation, mild nausea'
    ],
    whenToSeekDoctor: [
      'Persistent severe watery diarrhea with cramping fever (possible Clostridioides difficile enteritis)',
      'Alarm GI symptoms: dysphagia (trouble swallowing), odynophagia (pain on swallowing), hematemesis, involuntary rapid weight loss'
    ],
    clinicalProfile: {
      therapeuticClass: 'Proton Pump Inhibitor (PPI) - Substituted Benzimidazole',
      mechanismOfAction: 'Accumulates in the acidic secretory canaliculi of parietal cells where it is protonated into active sulfenamide, forming covalent disulfide bonds with H+/K+ ATPase enzyme, irreversibly blocking the final common pathway of gastric hydrochloric acid secretion.',
      onsetOfAction: 'Gastric acid suppression begins within 2 to 2.5 hours; full steady-state antisecretory control achieved within 4 to 7 days.',
      durationOfAction: 'Suppresses acid production for >24 hours despite a short plasma elimination half-life (~1 hour) due to irreversible enzyme binding.'
    },
    administration: {
      typicalDosage: 'GERD & Reflux Esophagitis: 40 mg orally once daily in the morning.',
      administrationTiming: 'Ingest 30 to 60 minutes before breakfast with a glass of plain water.',
      maximumDailyLimit: '80 mg/day for severe erosive disease or up to 240 mg/day divided for Zollinger-Ellison Syndrome.',
      missedDoseAdvice: 'Take before the next meal if remembered that morning. Skip if evening; do not double doses.',
      durationGuideline: 'Standard course 4 to 8 weeks for mucosal healing. Re-evaluate periodically for step-down.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Clopidogrel (Plavix): Pantoprazole has significantly weaker CYP2C19 inhibition than Omeprazole, making it the preferred PPI with clopidogrel.',
        'Atazanavir & Rilpivirine: Acid suppression profoundly decreases antiviral absorption; contraindicated.',
        'Iron Salts, Ketoconazole, Dasatinib: Reduced gastric acidity hampers bioavailability and dissolution.'
      ],
      foodAndDietaryInteractions: [
        'High-fat meals delay absorption without reducing total bioavailability.',
        'Avoid triggers: heavy caffeine, alcohol, spicy meals.'
      ],
      contraindicatedConditions: [
        'Known hypersensitivity to substituted benzimidazoles (pantoprazole, rabeprazole, lansoprazole)',
        'Concurrent administration with rilpivirine-containing HIV antiretroviral regimens'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Headache, bloating, loose stools, nausea, abdominal cramps'
      ],
      moderateRequiresMonitoring: [
        'Hypomagnesemia (muscle spasms, arrhythmias), Vitamin B12 deficiency with long-term use (>3 years)'
      ],
      severeEmergencySymptoms: [
        'Severe Clostridioides difficile diarrhea, subacute cutaneous lupus erythematosus (SCLE), acute interstitial nephritis'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 20°C to 25°C (68°F to 77°F).',
      moistureGuidance: 'Protect from moisture in original foil blister packs.',
      childSafety: 'Store in secure cabinet away from children.',
      disposalProcedure: 'Standard medicine collection bin.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category B. Animal reproduction studies show no teratogenicity. Used during pregnancy when clinically indicated. Detectable in human milk in low amounts.',
      renalImpairment: 'No dose adjustment required across renal impairment or hemodialysis.',
      hepaticConsideration: 'Severe hepatic impairment (cirrhosis): dose should not exceed 20 mg daily or alternate-day 40 mg; monitor transaminases.',
      pediatricGeriatricNotes: 'Approved in adolescents ≥12 for erosive GERD. Well tolerated in elderly patients; ensure calcium/vitamin D intake.'
    },
    safetyChecklist: {
      ageConsideration: 'Prescription 40mg tablets designated for adults and adolescents 12 years and older.',
      allergyWarning: 'Contraindicated in known allergy to any proton pump inhibitor.',
      interactionsWarning: 'Safer choice with clopidogrel compared to omeprazole; verify HIV medication list.',
      pregnancyWarning: 'Discuss risk-benefit with physician; generally permitted in moderate-to-severe GERD.'
    }
  },
  {
    id: 'med-omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Acid Reducer & GI',
    categoryKey: 'gi-acid',
    dosageForm: 'Delayed-Release Capsules 20mg / 40mg',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Short-term management of frequent daytime and nocturnal heartburn occurring 2 or more days per week',
      'Duodenal and benign gastric ulcer healing; maintenance therapy for healed erosive esophagitis'
    ],
    generalPrecautions: [
      'Not intended for immediate instant relief of occasional heartburn (may require 1 to 4 days for full effect)',
      'OTC regimen should strictly not exceed 14 consecutive days or repeat more than once every 4 months without doctor consultation',
      'Swallow capsules whole; do not chew or crush pellets inside capsule'
    ],
    commonSideEffects: [
      'Mild headache, stomach ache, constipation, gas, nausea'
    ],
    whenToSeekDoctor: [
      'Painful or difficult swallowing, lightheadedness, sweating alongside chest discomfort (rule out myocardial infarction)',
      'Symptoms fail to improve after 14 days of compliant therapy'
    ],
    clinicalProfile: {
      therapeuticClass: 'Proton Pump Inhibitor (PPI)',
      mechanismOfAction: 'Inhibits parietal cell H+/K+ ATPase enzyme through covalent binding, suppressing basal and stimulated acid production.',
      onsetOfAction: 'Within 1 hour; maximal antisecretory response within 2 hours.',
      durationOfAction: 'Acid suppression lasts up to 72 hours per dose.'
    },
    administration: {
      typicalDosage: '20 mg once daily taken before morning meal.',
      administrationTiming: 'Take in the morning 30 to 60 minutes before breakfast.',
      maximumDailyLimit: 'OTC: 20 mg/day. Prescription: 40 mg/day (up to 120 mg/day in hypersecretory conditions).',
      missedDoseAdvice: 'Take before the next meal if remembered that day.',
      durationGuideline: '14-day cycle for over-the-counter heartburn relief.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Clopidogrel (Plavix): Significant CYP2C19 competitive inhibition reduces clopidogrel antiplatelet activation. Avoid combination.',
        'Warfarin: May elevate INR and bleeding risk; monitor PT/INR closely.',
        'Methotrexate: May elevate and prolong methotrexate serum levels, provoking toxicity.'
      ],
      foodAndDietaryInteractions: [
        'Food does not decrease absorption if taken prior to eating.'
      ],
      contraindicatedConditions: [
        'Hypersensitivity to omeprazole or benzimidazoles'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Headache, mild diarrhea, abdominal discomfort, flatulence'
      ],
      moderateRequiresMonitoring: [
        'Vitamin B12 malabsorption with long-term usage, hypomagnesemia'
      ],
      severeEmergencySymptoms: [
        'Clostridioides difficile colitis, acute interstitial nephritis, anaphylaxis'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 15°C to 30°C in moisture-tight containers.',
      moistureGuidance: 'Keep container tightly closed.',
      childSafety: 'Store away from children.',
      disposalProcedure: 'Standard medication disposal drop-off.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category C. Extensive human data indicates no elevated teratogenic risk. Compatible with lactation.',
      renalImpairment: 'No dosage reduction required in renal disease.',
      hepaticConsideration: 'Bioavailability increased in cirrhosis; dose reduction may be considered for maintenance.',
      pediatricGeriatricNotes: 'Approved for pediatric GERD >1 year (open capsule onto applesauce). Safe in elderly.'
    },
    safetyChecklist: {
      ageConsideration: 'OTC labeled for adults 18 and older; pediatric use strictly by physician order.',
      allergyWarning: 'Contraindicated in benzimidazole allergy.',
      interactionsWarning: 'Do NOT combine with Clopidogrel without cardiologist review.',
      pregnancyWarning: 'Consult physician prior to taking during pregnancy.'
    }
  },
  {
    id: 'med-amoxicillin-clav',
    name: 'Amoxicillin + Potassium Clavulanate (Augmentin)',
    genericName: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    category: 'Antibiotic (Prescription Only)',
    categoryKey: 'antibiotic',
    dosageForm: 'Film-coated Tablets 625mg / 1000mg, Oral Suspension 457mg/5ml',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Empirical treatment of acute bacterial sinusitis, otitis media, and community-acquired bacterial pneumonia',
      'Management of acute odontogenic and periodontal infections (dental abscess, cellulitis) prior to/following dental surgery',
      'Complicated skin and soft tissue bacterial infections, bite wounds, and recurrent urinary tract infections'
    ],
    generalPrecautions: [
      'STRICT PRESCRIPTION ONLY: Complete the entire prescribed multi-day course even if clinical symptoms resolve early to prevent resistant bacterial strains',
      'MUST be taken at the start of a meal to minimize clavulanate-induced gastrointestinal motility hyperstimulation and nausea',
      'Contraindicated in patients with severe immediate hypersensitivity (anaphylaxis, angioedema) to penicillin or cephalosporin beta-lactams'
    ],
    commonSideEffects: [
      'Diarrhea (frequent due to clavulanic acid), loose watery stools, nausea, candidiasis (oral thrush or vaginal yeast infection)'
    ],
    whenToSeekDoctor: [
      'Signs of Severe Hypersensitivity: sudden diffuse urticaria, wheezing, dyspnea, facial swelling (demands 911 / emergency ER care)',
      'Signs of Cholestatic Jaundice: yellowing of sclera/skin, dark tea-colored urine, clay-colored pale stools (can occur even weeks after stopping)'
    ],
    clinicalProfile: {
      therapeuticClass: 'Beta-Lactam Aminopenicillin + Beta-Lactamase Suicide Inhibitor',
      mechanismOfAction: 'Amoxicillin inhibits bacterial cell wall peptidoglycan cross-linking by binding penicillin-binding proteins (PBPs), causing cell lysis. Clavulanic acid irreversibly binds and inactivates bacterial beta-lactamase enzymes, restoring amoxicillin potency against beta-lactamase producing Staphylococci, H. influenzae, and Moraxella.',
      onsetOfAction: 'Rapid gastrointestinal absorption; peak serum concentrations achieved within 1 to 1.5 hours.',
      durationOfAction: 'Requires 8-hourly (or 12-hourly for Augmentin Duo) administration to keep serum concentrations above minimum inhibitory concentration (MIC).'
    },
    administration: {
      typicalDosage: 'Adults: 625 mg orally every 8 hours, or 1,000 mg (875/125mg) every 12 hours.',
      administrationTiming: 'Administer at the start of a meal or substantive snack to enhance absorption and mitigate gastrointestinal upset.',
      maximumDailyLimit: 'As directed by physician; typically 2,000 mg amoxicillin component daily.',
      missedDoseAdvice: 'Take immediately with food as soon as remembered. Space subsequent dose appropriately. Never double up.',
      durationGuideline: 'Typically 5 to 7 days for uncomplicated infections; up to 10 to 14 days for severe dental or lower respiratory infections.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Methotrexate: Penicillins reduce renal tubular clearance of methotrexate, resulting in severe bone marrow suppression.',
        'Warfarin: Alters gut microflora, potentiating warfarin anticoagulant activity and raising INR.',
        'Allopurinol: Co-administration substantially increases incidence of erythematous maculopapular skin rashes.',
        'Oral Contraceptive Pills: Slight potential for reduced enterohepatic recycling of estrogens; secondary barrier method recommended.'
      ],
      foodAndDietaryInteractions: [
        'Probiotics (Lactobacillus, Saccharomyces boulardii): Recommended 2 hours separated from antibiotic dose to reduce antibiotic-associated diarrhea.'
      ],
      contraindicatedConditions: [
        'Documented history of penicillin or beta-lactam anaphylaxis, angioedema, or exfoliative dermatitis',
        'History of amoxicillin/clavulanate-associated cholestatic jaundice or hepatic dysfunction'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Mild diarrhea, loose stools, mild nausea, vomiting, abdominal cramping'
      ],
      moderateRequiresMonitoring: [
        'Superficial mucocutaneous candidiasis (vaginal itching, white oral plaques), pruritus'
      ],
      severeEmergencySymptoms: [
        'Severe Anaphylaxis, Clostridioides difficile pseudomembranous colitis, Drug-Induced Liver Injury (cholestatic hepatitis)'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store dry tablets below 25°C (77°F) in moisture-proof packaging. Reconstituted liquid suspension MUST be refrigerated at 2°C to 8°C and discarded after 7 to 10 days.',
      moistureGuidance: 'High moisture sensitivity; clavulanate degrades rapidly upon atmospheric exposure. Keep desiccant in bottle.',
      childSafety: 'Keep out of reach of children.',
      disposalProcedure: 'Take unused leftover antibiotics to a designated pharmacy take-back program; never flush down household plumbing.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category B. Widely utilized in pregnancy when indicated. Passes into breast milk in trace amounts; monitor infant for loose stools or oral thrush.',
      renalImpairment: 'Dosing interval must be extended in renal insufficiency: eGFR 10-30 mL/min: 500/125 mg every 12 hours. eGFR <10 mL/min: 500/125 mg every 24 hours.',
      hepaticConsideration: 'Use with caution; monitor hepatic function indices periodically during extended treatment.',
      pediatricGeriatricNotes: 'Pediatric dosing calculated strictly by amoxicillin component (25 to 45 mg/kg/day divided every 8 or 12 hours). Geriatric patients require renal function monitoring.'
    },
    safetyChecklist: {
      ageConsideration: 'Suspension used in infants ≥3 months; 625mg/1000mg tablets for adults and children >40kg.',
      allergyWarning: 'ABSOLUTE CONTRAINDICATION in confirmed penicillin anaphylaxis or cephalosporin severe cross-reactivity.',
      interactionsWarning: 'Advise patient on potential reduction in oral contraceptive efficacy and take with food.',
      pregnancyWarning: 'Considered safe across pregnancy trimesters under licensed medical oversight.'
    }
  },
  {
    id: 'med-azithromycin',
    name: 'Azithromycin Dihydrate',
    genericName: 'Azithromycin',
    category: 'Antibiotic (Prescription Only)',
    categoryKey: 'antibiotic',
    dosageForm: 'Film-coated Tablets 250mg / 500mg, Oral Suspension 200mg/5ml',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Community-acquired pneumonia, acute bacterial exacerbations of COPD, and atypical respiratory infections (Mycoplasma, Chlamydophila)',
      'Alternative antibiotic for acute streptococcal pharyngitis/tonsillitis in penicillin-allergic patients',
      'Uncomplicated urogenital infections (Chlamydia trachomatis) and skin/soft tissue infections'
    ],
    generalPrecautions: [
      'Cardiac Safety Warning: Can prolong cardiac QT interval, predisposing to Torsades de Pointes ventricular arrhythmias',
      'Extremely long tissue half-life (~68 hours); therapeutic concentrations persist in tissues for days after the final dose',
      'Avoid simultaneous administration with aluminum or magnesium antacids which diminish peak absorption'
    ],
    commonSideEffects: [
      'Nausea, diarrhea, abdominal cramps, headache, dizziness'
    ],
    whenToSeekDoctor: [
      'Palpitations, sudden syncope (fainting), lightheadedness (cardiac arrhythmia alert)',
      'Severe intractable watery diarrhea, jaundice, or extensive blistering rash'
    ],
    clinicalProfile: {
      therapeuticClass: 'Macrolide / Azalide Antibiotic',
      mechanismOfAction: 'Reversibly binds to the 50S ribosomal subunit of susceptible microorganisms, inhibiting transpeptidation and protein synthesis.',
      onsetOfAction: 'Tissue concentrations exceed serum concentrations within 2 to 4 hours.',
      durationOfAction: 'Extended tissue half-life allows once-daily dosing and short 3- to 5-day regimens.'
    },
    administration: {
      typicalDosage: 'Standard Z-Pack: 500 mg orally on Day 1, followed by 250 mg once daily on Days 2 through 5.',
      administrationTiming: 'May be taken with or without food. Taking with food reduces stomach irritation.',
      maximumDailyLimit: '500 mg daily for standard respiratory infections (single 1g dose for urogenital Chlamydia).',
      missedDoseAdvice: 'Take as soon as remembered on that day; never double up.',
      durationGuideline: 'Typical course is 3 days (500mg/day) or 5 days (Z-pack).'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'QT-Prolonging Drugs (Amiodarone, Sotalol, Citalopram, Ondansetron): Synergistic QT prolongation and fatal arrhythmia risk.',
        'Antacids containing Aluminum/Magnesium: Slows peak absorption; separate by at least 2 hours.',
        'Warfarin: May amplify hypoprothrombinemic anticoagulant effect.'
      ],
      foodAndDietaryInteractions: [
        'Taking with food improves GI tolerance.'
      ],
      contraindicatedConditions: [
        'Hypersensitivity to azithromycin, erythromycin, or any macrolide antibiotic',
        'History of cholestatic jaundice or hepatic dysfunction with prior azithromycin use',
        'Known congenital long QT syndrome or uncorrected hypokalemia/hypomagnesemia'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Mild diarrhea, nausea, abdominal discomfort, flatulence'
      ],
      moderateRequiresMonitoring: [
        'Reversible hearing impairment with high doses, elevated liver transaminases'
      ],
      severeEmergencySymptoms: [
        'Torsades de Pointes ventricular tachycardia, acute hepatic necrosis, anaphylaxis'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 15°C to 30°C in dry conditions.',
      moistureGuidance: 'Protect from moisture and humidity.',
      childSafety: 'Store securely out of reach of children.',
      disposalProcedure: 'Pharmacy take-back return.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category B. Animal studies show no fetal harm; widely used in pregnant women. Low levels in human breast milk.',
      renalImpairment: 'Caution in severe renal impairment (eGFR <10 mL/min).',
      hepaticConsideration: 'Principal route of elimination is biliary; caution in significant hepatic impairment.',
      pediatricGeriatricNotes: 'Approved for children ≥6 months for otitis media and pharyngitis. Elderly patients are more susceptible to drug-induced QT prolongation.'
    },
    safetyChecklist: {
      ageConsideration: 'Weight-based pediatric dosing (10mg/kg day 1, 5mg/kg days 2-5).',
      allergyWarning: 'Do NOT prescribe in macrolide allergy.',
      interactionsWarning: 'Screen for cardiac history, baseline ECG, and antiarrhythmic medications.',
      pregnancyWarning: 'Approved for pregnancy when indicated (e.g. chlamydial infection in pregnancy).'
    }
  },
  {
    id: 'med-gabapentin',
    name: 'Gabapentin (Neuro-therapeutic)',
    genericName: 'Gabapentin',
    category: 'Neurology & Nerve Care',
    categoryKey: 'neurology',
    dosageForm: 'Capsules 100mg / 300mg / 400mg, Film-coated Tablets 600mg / 800mg',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Management of postherpetic neuralgia (severe burning nerve pain following herpes zoster / shingles)',
      'Treatment of diabetic peripheral neuropathy, lumbar radiculopathy (sciatica), and trigeminal neuralgia',
      'Adjunctive therapy in the treatment of partial-onset seizures in neurological care'
    ],
    generalPrecautions: [
      'Dose MUST be titrated upwards gradually under medical direction to avoid incapacitating dizziness and somnolence',
      'DO NOT discontinue abruptly: sudden cessation triggers severe rebound pain, agitation, and withdrawal seizures',
      'Extreme additive central nervous system and respiratory depression if combined with opioids or alcohol'
    ],
    commonSideEffects: [
      'Somnolence, dizziness, ataxia (unsteadiness / balance difficulty), fatigue, peripheral edema (ankle swelling)'
    ],
    whenToSeekDoctor: [
      'Emergence of severe suicidal thoughts, new or worsening depression, or unusual behavioral alterations',
      'Severe respiratory depression, especially when co-prescribed with pain medications or sedatives'
    ],
    clinicalProfile: {
      therapeuticClass: 'Anticonvulsant & Neuropathic Analgesic (Gabapentinoid)',
      mechanismOfAction: 'Structurally related to gamma-aminobutyric acid (GABA) but does not bind to GABA receptors; binds with high affinity to the alpha-2-delta auxiliary subunit of voltage-gated calcium channels in central nervous system neurons, dampening calcium influx and attenuating presynaptic release of excitatory neurotransmitters (glutamate, substance P, calcitonin gene-related peptide).',
      onsetOfAction: 'Peak plasma concentrations achieved in 2 to 3 hours; clinical neuropathic pain relief builds over 1 to 2 weeks of steady titration.',
      durationOfAction: 'Elimination half-life is 5 to 7 hours, requiring 3-times-daily dosing.'
    },
    administration: {
      typicalDosage: 'Initial: 300 mg on Day 1 (at bedtime), 300 mg twice daily on Day 2, 300 mg three times daily on Day 3; titrated up to 1,800 mg - 3,600 mg daily in divided doses.',
      administrationTiming: 'Take with water, with or without food. Maximum gap between daytime doses should not exceed 12 hours.',
      maximumDailyLimit: '3,600 mg per day divided into three equal doses.',
      missedDoseAdvice: 'Take as soon as remembered. If close to next dose, skip. Do not take double doses.',
      durationGuideline: 'Chronic maintenance therapy; when discontinuing, taper dose gradually over at least 1 week.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Opioids (Morphine, Oxycodone, Tramadol): Significantly elevates risk of fatal respiratory depression, coma, and severe sedation.',
        'Antacids (Aluminum & Magnesium Hydroxide): Reduces gabapentin bioavailability by ~20%; separate by at least 2 hours.',
        'Sedatives & Alcohol: Synergistic impairment of motor skills, balance, and cognitive function.'
      ],
      foodAndDietaryInteractions: [
        'Alcohol severely amplifies somnolence and ataxia. Avoid completely.'
      ],
      contraindicatedConditions: [
        'Hypersensitivity to gabapentin',
        'Severe unmonitored respiratory depression'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Dizziness, drowsiness, unsteady gait, dry mouth, mild tremor'
      ],
      moderateRequiresMonitoring: [
        'Peripheral edema (swelling of ankles/feet), nystagmus, weight gain, cognitive fog'
      ],
      severeEmergencySymptoms: [
        'Suicidal ideation, Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS), profound respiratory failure'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store at 20°C to 25°C (68°F to 77°F). Excursions permitted between 15°C and 30°C.',
      moistureGuidance: 'Protect from moisture; keep capsules sealed.',
      childSafety: 'Store in secure location away from children.',
      disposalProcedure: 'Pharmacy medicine drop-off receptacle.'
    },
    specialPopulations: {
      pregnancyLactation: 'Category C. Crosses human placenta. Excreted into human breast milk. Use only if potential benefit justifies potential fetal risk.',
      renalImpairment: 'Eliminated solely by renal excretion. Mandatory dose reduction based on creatinine clearance (e.g. CrCl 30-59 mL/min: max 700mg/day; CrCl 15-29 mL/min: max 300mg/day).',
      hepaticConsideration: 'Not metabolized by liver; safe in hepatic disease without liver dose reduction.',
      pediatricGeriatricNotes: 'High fall hazard in elderly patients due to ataxia and somnolence; start at 100 mg bedtime.'
    },
    safetyChecklist: {
      ageConsideration: 'Dosage in postherpetic neuralgia evaluated for adults; pediatric use strictly for epilepsy ≥3 years.',
      allergyWarning: 'Contraindicated in gabapentinoid hypersensitivity.',
      interactionsWarning: 'Do NOT combine with opioids or muscle relaxants without neurosurgeon / pain specialist clearance.',
      pregnancyWarning: 'Requires comprehensive maternal-fetal specialist consultation.'
    }
  },
  {
    id: 'med-chlorhexidine-gel',
    name: 'Chlorhexidine 0.2% & Metronidazole Dental Gel',
    genericName: 'Chlorhexidine Gluconate 0.2% w/w + Metronidazole 10mg/g',
    category: 'Dental & Oral Care',
    categoryKey: 'dental',
    dosageForm: 'Topical Gingival Gel 15g / Antiseptic Oral Rinse 0.2%',
    otcStatus: 'Prescription Only',
    generalUses: [
      'Treatment of acute and chronic periodontitis, ulcerative gingivitis, and pericoronitis (wisdom tooth gum flap infection)',
      'Topical post-surgical disinfection following dental extractions, dental implant placement, and periodontal flap surgery',
      'Inhibition of pathogenic subgingival dental plaque biofilm formation and relief of painful oral aphthous ulcerations'
    ],
    generalPrecautions: [
      'FOR TOPICAL ORAL USE ONLY: DO NOT SWALLOW the gel or rinse; expectorate thoroughly after application',
      'May cause temporary extrinsic brown staining of tooth enamel and composite dental restorations; reversible with professional scaling',
      'Do not rinse mouth with water or consume food/beverages for at least 30 minutes following application to allow mucosal binding'
    ],
    commonSideEffects: [
      'Transient altered taste perception (dysgeusia), mild oral burning sensation on initial contact, slight tongue discoloration'
    ],
    whenToSeekDoctor: [
      'Signs of severe hypersensitivity: acute swelling of lips, tongue, or throat, or generalized rash',
      'Spreading facial swelling, difficulty opening mouth (trismus), or fever (requires emergency dental surgeon evaluation)'
    ],
    clinicalProfile: {
      therapeuticClass: 'Topical Oral Microbicide & Subgingival Antiprotozoal / Antibacterial',
      mechanismOfAction: 'Chlorhexidine is a cationic bisbiguanide that binds negatively charged bacterial cell walls, causing cytoplasmic leakage and bactericidal destruction, with strong salivary substantivity (>12 hours). Metronidazole exerts targeted bactericidal action against anaerobic periodontal pathogens (Porphyromonas gingivalis, Treponema denticola) by disrupting helical DNA structure.',
      onsetOfAction: 'Immediate bactericidal action upon mucosal and gingival contact.',
      durationOfAction: 'Binds to oral epithelial surfaces and dental enamel, providing sustained antimicrobial release for 8 to 12 hours.'
    },
    administration: {
      typicalDosage: 'Apply a pea-sized amount directly to inflamed gingival margins using a clean fingertip or soft cotton applicator twice daily after brushing.',
      administrationTiming: 'Apply after morning and evening tooth brushing. Wait 30 minutes after brushing before applying (toothpastes with sodium lauryl sulfate inactivate chlorhexidine).',
      maximumDailyLimit: 'Apply 2 to 3 times daily as directed by dentist.',
      missedDoseAdvice: 'Apply as soon as remembered. Do not double the quantity.',
      durationGuideline: 'Use for 7 to 14 consecutive days as prescribed by dental practitioner; avoid indefinite unmonitored use.'
    },
    interactionsDetail: {
      majorDrugInteractions: [
        'Anionic Dentifrices (Sodium Lauryl Sulfate): Common toothpaste detergents chemically neutralize chlorhexidine; brush teeth and thoroughly rinse with water 30 minutes before applying.',
        'Oral Alcohol: Avoid alcohol mouthwashes while applying metronidazole gel to prevent disulfiram-like local burning.'
      ],
      foodAndDietaryInteractions: [
        'Avoid coffee, tea, red wine, and tobacco for 1 hour after application to prevent tooth enamel discoloration.'
      ],
      contraindicatedConditions: [
        'Known hypersensitivity to chlorhexidine, metronidazole, or nitroimidazole derivatives',
        'Open deep puncture wounds of the neck or skull'
      ]
    },
    sideEffectsBreakdown: {
      mildFrequent: [
        'Altered taste, bitter aftertaste, temporary brownish staining of tongue/teeth'
      ],
      moderateRequiresMonitoring: [
        'Oral mucosal peeling (desquamation), localized mucosal soreness or mild parotid gland swelling'
      ],
      severeEmergencySymptoms: [
        'Severe oral mucosal ulceration, immediate anaphylaxis with angioedema'
      ]
    },
    storageAndDisposal: {
      temperature: 'Store below 25°C (77°F). Do not freeze.',
      moistureGuidance: 'Keep tube tightly capped to prevent gel drying.',
      childSafety: 'Keep out of reach of young children.',
      disposalProcedure: 'Standard household waste disposal.'
    },
    specialPopulations: {
      pregnancyLactation: 'Minimal systemic absorption when used topically on gingiva. Generally considered safe in dental care during pregnancy under dental surgeon direction.',
      renalImpairment: 'No dosage alteration needed due to minimal systemic absorption.',
      hepaticConsideration: 'Safe for topical dental use.',
      pediatricGeriatricNotes: 'Not recommended in children under 6 years due to risk of swallowing. Excellent for geriatric patients with dentures or compromised manual brushing dexterity.'
    },
    safetyChecklist: {
      ageConsideration: 'Prescribed for adults and children over 6 under dental supervision.',
      allergyWarning: 'Do not use if known history of hypersensitivity to chlorhexidine rinses.',
      interactionsWarning: 'Wait 30 minutes after conventional tooth brushing before applying.',
      pregnancyWarning: 'Safe for localized dental treatment when prescribed by a dentist.'
    }
  }
];

export const INITIAL_PREVIOUS_RECORDS: PreviousHealthRecord[] = [
  {
    id: 'prev-rec-1',
    title: 'Executive Annual Health Profile & Biomarkers',
    date: '12 Jun 2026',
    category: 'Preventive Health',
    hospital: 'Manipal Comprehensive Care',
    doctor: 'Dr. Suresh Babu (MD Internal Medicine)',
    summary: 'Resting cardiovascular parameters, 12-lead resting ECG, renal and liver function profiles examined. All standard biomarkers resided within baseline healthy boundaries.',
    fileName: 'Annual_Wellness_Jun2026.pdf'
  },
  {
    id: 'prev-rec-2',
    title: 'General Consultation for Allergic Rhinitis',
    date: '18 Aug 2026',
    category: 'Outpatient Consultation',
    hospital: 'Apollo Clinic (Indiranagar)',
    doctor: 'Dr. Ananya Sharma (General Medicine)',
    summary: 'Clinical assessment of nasal congestion, seasonal sneezing, and watery eyes during elevated pollen weeks. Prescribed non-sedating antihistamines.',
    fileName: 'OPD_Consultation_Aug2026.pdf'
  },
  {
    id: 'prev-rec-3',
    title: 'Prescription & Medication Refill Review',
    date: '22 Jul 2026',
    category: 'Pharmacy Review',
    hospital: 'Apollo Health Pharmacy',
    doctor: 'Dr. Ananya Sharma',
    summary: 'Refill consultation for seasonal antihistamines and verification of monthly high-potency Vitamin D3 maintenance schedule.',
    fileName: 'Prescription_Refill_Jul2026.pdf'
  },
  {
    id: 'prev-rec-4',
    title: 'Preventive Dental Prophylaxis & Scaling',
    date: '15 Nov 2025',
    category: 'Dental Medicine',
    hospital: 'Apollo Dental Care',
    doctor: 'Dr. R. Mehra (BDS, MDS)',
    summary: 'Routine dental examination, subgingival ultrasonic scaling, and topical fluoride varnish application. Healthy gingival status confirmed.',
    fileName: 'Dental_Prophylaxis_Nov2025.pdf'
  },
  {
    id: 'prev-rec-5',
    title: 'Immunization & Tetanus Toxoid Booster',
    date: '20 Apr 2025',
    category: 'Preventive Immunization',
    hospital: 'St. John’s Wellness Clinic',
    doctor: 'Dr. Neha Gupta (Community Health)',
    summary: 'Routine 10-year decennial tetanus toxoid booster administered intramuscularly in left deltoid without immediate adverse reactions.',
    fileName: 'Vaccination_Record_Apr2025.pdf'
  }
];

export const MOCK_PATIENT = INITIAL_PATIENT;
export const MOCK_MEDICAL_HISTORY = INITIAL_MEDICAL_HISTORY;
export const MOCK_LIFESTYLE = INITIAL_LIFESTYLE;
export const MOCK_REPORTS = INITIAL_REPORTS;
export const MOCK_APPOINTMENTS = INITIAL_APPOINTMENTS;
export const MOCK_DOCTORS = DEMO_DOCTORS;
export const MOCK_TIMELINE_EVENTS = INITIAL_TIMELINE_EVENTS;
export const MOCK_PREVIOUS_RECORDS = INITIAL_PREVIOUS_RECORDS;
export const MOCK_MEDICATION_GUIDE = MEDICATION_GUIDES;
