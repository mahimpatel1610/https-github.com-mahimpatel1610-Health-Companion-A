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
    email: 'dr.shalini.demo@healthcompanion.ai'
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
    category: 'Analgesic & Antipyretic (Pain reliever & fever reducer)',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Temporary relief of mild to moderate discomfort such as headaches, muscle aches, or dental soreness',
      'Assisting in lowering elevated body temperature during fevers'
    ],
    generalPrecautions: [
      'Strictly avoid exceeding maximum daily allowance (typically 3,000 - 4,000 mg within 24 hours in adults)',
      'Be cautious of multi-ingredient cold and flu syrups which often contain hidden paracetamol',
      'Avoid regular alcohol consumption while taking paracetamol due to potential liver strain'
    ],
    commonSideEffects: [
      'Generally well-tolerated at recommended therapeutic doses',
      'Rarely: nausea, mild indigestion, or skin rash in sensitive individuals'
    ],
    whenToSeekDoctor: [
      'If fever persists beyond 3 days without improvement',
      'If pain continues after 5 to 7 days of treatment',
      'Immediately if accidental excessive intake or symptoms of liver distress (yellowing eyes, dark urine) occur'
    ],
    safetyChecklist: {
      ageConsideration: 'Dosing in infants and young children is based strictly on weight, not age. Consult a pediatrician.',
      allergyWarning: 'Do not take if you have a documented allergy to paracetamol or acetaminophen.',
      interactionsWarning: 'Inform your physician if you take blood thinners (e.g., warfarin) or regular medications.',
      pregnancyWarning: 'Often considered a first-line option during pregnancy, but always verify duration and dose with your obstetrician.'
    }
  },
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Non-Steroidal Anti-Inflammatory Drug (NSAID)',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Reducing inflammation, joint swelling, sprains, menstrual cramps, and dental inflammation',
      'Short-term management of fever and inflammatory discomfort'
    ],
    generalPrecautions: [
      'Always take with food or milk to safeguard the stomach lining against acid irritation',
      'Avoid if you have a history of stomach ulcers, severe kidney impairment, or uncontrolled hypertension',
      'Do not combine with other NSAIDs (such as naproxen, aspirin, or diclofenac) without explicit physician guidance'
    ],
    commonSideEffects: [
      'Stomach upset, mild nausea, heartburn, or abdominal discomfort',
      'Fluid retention or dizziness in certain individuals'
    ],
    whenToSeekDoctor: [
      'Signs of gastrointestinal irritation (black tarry stools, severe sharp abdominal pain)',
      'Shortness of breath, swelling of ankles, or unexplained bruising'
    ],
    safetyChecklist: {
      ageConsideration: 'Not recommended for infants under 6 months without specific pediatric clearance.',
      allergyWarning: 'Contraindicated in individuals with aspirin-induced asthma or known NSAID hypersensitivity.',
      interactionsWarning: 'May reduce effectiveness of blood pressure medications and increase bleeding risk with anticoagulants.',
      pregnancyWarning: 'Generally contraindicated during the third trimester of pregnancy due to fetal circulation concerns.'
    }
  },
  {
    id: 'med-cetirizine',
    name: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Second-Generation Antihistamine',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Relief of allergy symptoms including allergic rhinitis, watery itchy eyes, runny nose, and hives (urticaria)'
    ],
    generalPrecautions: [
      'Although considered a non-drowsy antihistamine, it may cause mild sedation in a minority of users; bedtime administration is frequently preferred',
      'Avoid operating heavy machinery until your individual response to the medication is clear',
      'Limit alcohol intake while taking antihistamines'
    ],
    commonSideEffects: [
      'Mild drowsiness, dry mouth, tiredness, or mild headache'
    ],
    whenToSeekDoctor: [
      'If allergic symptoms fail to subside after 7 to 10 days of continuous use',
      'Immediately if experiencing signs of severe allergic anaphylaxis (throat tightness, breathing difficulty)'
    ],
    safetyChecklist: {
      ageConsideration: 'Liquid pediatric formulations exist for children above 2 years; follow exact calibrated syringe measurements.',
      allergyWarning: 'Do not use if sensitive to cetirizine or hydroxyzine.',
      interactionsWarning: 'Use caution with central nervous system depressants or sleep aids.',
      pregnancyWarning: 'Discuss risk-benefit with your physician before taking during pregnancy or breastfeeding.'
    }
  },
  {
    id: 'med-ors',
    name: 'Oral Rehydration Salts (ORS)',
    genericName: 'Electrolyte & Glucose Rehydration Solution (WHO Formula)',
    category: 'Electrolyte Replenisher',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Prevention and management of mild-to-moderate dehydration caused by acute diarrhea, vomiting, or excessive heat perspiration'
    ],
    generalPrecautions: [
      'Dilute strictly in the exact volume of potable drinking water specified on the packet (e.g. 1 packet per 1 liter of clean water)',
      'Do not add sugar, milk, or fruit juice to the mixed solution as this alters osmolarity',
      'Discard unused prepared solution after 24 hours (or store covered in a refrigerator)'
    ],
    commonSideEffects: [
      'Extremely safe when mixed in correct water proportions; slight saltiness may cause mild nausea if gulped rapidly'
    ],
    whenToSeekDoctor: [
      'Inability to keep liquids down, sunken eyes, persistent lethargy, or absence of urination for over 8 hours',
      'Presence of blood in stool or persistent high fever alongside diarrhea'
    ],
    safetyChecklist: {
      ageConsideration: 'Safe for all ages including infants and elderly individuals when given in small frequent sips.',
      allergyWarning: 'Standard elemental electrolyte formulation without known allergens.',
      interactionsWarning: 'No significant negative drug interactions for short-term rehydration.',
      pregnancyWarning: 'Safe during pregnancy for addressing dehydration; consult doctor if vomiting is severe.'
    }
  },
  {
    id: 'med-omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Proton Pump Inhibitor (PPI)',
    otcStatus: 'Over-The-Counter',
    generalUses: [
      'Short-term management of frequent heartburn (acid indigestion occurring 2 or more days per week)'
    ],
    generalPrecautions: [
      'Swallow capsule whole with a glass of water at least 30 to 60 minutes before breakfast; do not chew or crush pellets',
      'Not intended for immediate relief of occasional heartburn (may take 1 to 4 days for full effect)',
      'OTC regimens should generally not exceed 14 consecutive days without physician oversight'
    ],
    commonSideEffects: [
      'Headache, mild stomach ache, nausea, constipation, or gas'
    ],
    whenToSeekDoctor: [
      'Difficulty or pain when swallowing food, vomiting with blood, unexplained weight loss, or persistent symptoms past 14 days'
    ],
    safetyChecklist: {
      ageConsideration: 'OTC versions are typically intended for adults 18 years and older.',
      allergyWarning: 'Avoid if known hypersensitivity to proton pump inhibitors exists.',
      interactionsWarning: 'May alter the absorption of iron supplements, ketoconazole, or interact with clopidogrel.',
      pregnancyWarning: 'Consult your doctor before taking if pregnant or nursing.'
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
