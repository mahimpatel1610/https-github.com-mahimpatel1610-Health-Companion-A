import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './components/pages/HomePage';
import { MyHealthPage } from './components/pages/MyHealthPage';
import { MedicalReportsPage } from './components/pages/MedicalReportsPage';
import { AppointmentsPage } from './components/pages/AppointmentsPage';
import { DoctorsPage } from './components/pages/DoctorsPage';
import { AiAssistantPage } from './components/pages/AiAssistantPage';
import { PatientDataPage } from './components/pages/PatientDataPage';
import { PreviousRecordsPage } from './components/pages/PreviousRecordsPage';
import { MedicationInfoPage } from './components/pages/MedicationInfoPage';
import { HealthTimelinePage } from './components/pages/HealthTimelinePage';
import { HealthInsightsPage } from './components/pages/HealthInsightsPage';
import { EmergencyPage } from './components/pages/EmergencyPage';
import { ContactPage } from './components/pages/ContactPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LoginPage } from './components/pages/LoginPage';
import { DoctorPortalPage } from './components/pages/DoctorPortalPage';

// Data & Services
import {
  MOCK_PATIENT,
  MOCK_REPORTS,
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_MEDICAL_HISTORY,
  MOCK_LIFESTYLE,
  MOCK_PREVIOUS_RECORDS
} from './data/mockHealthData';
import {
  INITIAL_AUTH_STATE
} from './data/demoAccounts';
import {
  MedicalReport,
  Appointment,
  Doctor,
  PatientProfile,
  MedicalHistory,
  LifestyleInfo,
  AuthUser
} from './types';
import { downloadPatientSummaryPDF } from './services/pdfGenerator';
import { getUserWorkspace, saveUserWorkspace } from './utils/userWorkspace';

export default function App() {
  // Theme State (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hc_ai_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light'; // Default to clean medical light theme
  });

  // User Auth State (Patient vs Doctor)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('hc_auth_user');
    return saved ? JSON.parse(saved) : INITIAL_AUTH_STATE;
  });

  // Navigation State
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('hc_sidebar_collapsed') === 'true';
  });

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('hc_sidebar_collapsed', String(next));
      return next;
    });
  };

  // App Data State - Initialized from the active user's workspace
  const [patient, setPatient] = useState<PatientProfile>(() => getUserWorkspace(currentUser).patient);
  const [reports, setReports] = useState<MedicalReport[]>(() => getUserWorkspace(currentUser).reports);
  const [appointments, setAppointments] = useState<Appointment[]>(() => getUserWorkspace(currentUser).appointments);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>(() => getUserWorkspace(currentUser).medicalHistory);
  const [lifestyle, setLifestyle] = useState<LifestyleInfo>(() => getUserWorkspace(currentUser).lifestyle);
  const [previousRecords] = useState(MOCK_PREVIOUS_RECORDS);

  // Shared state for navigation flow
  const [selectedDeptForBooking, setSelectedDeptForBooking] = useState<string | undefined>(undefined);
  const [selectedDoctorForContact, setSelectedDoctorForContact] = useState<string | undefined>(undefined);
  const [aiPreloadedContext, setAiPreloadedContext] = useState<string | undefined>(undefined);

  // Synchronize Root HTML class and attributes for Tailwind dark mode
  useEffect(() => {
    localStorage.setItem('hc_ai_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // When user logs in or switches, load their dedicated personal workspace
  useEffect(() => {
    const ws = getUserWorkspace(currentUser);
    setPatient(ws.patient);
    setReports(ws.reports);
    setAppointments(ws.appointments);
    setMedicalHistory(ws.medicalHistory);
    setLifestyle(ws.lifestyle);
  }, [currentUser?.email]);

  // Persist State to LocalStorage for the current user's workspace
  useEffect(() => {
    if (currentUser?.email) {
      saveUserWorkspace(currentUser, {
        patient,
        reports,
        appointments,
        medicalHistory,
        lifestyle
      });
    }
  }, [patient, reports, appointments, medicalHistory, lifestyle, currentUser?.email]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hc_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hc_auth_user');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'doctor') {
      setCurrentSection('doctor-portal');
    } else {
      // Update patient profile name if provided
      if (user.name) {
        setPatient((prev) => ({
          ...prev,
          fullName: user.name,
          email: user.email || prev.email
        }));
      }
      setCurrentSection('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSection('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Report Handlers
  const handleAddReport = (newReport: MedicalReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Appointment Handlers
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a))
    );
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, date: newDate, time: newTime } : a))
    );
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  // Navigation Links
  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAiAboutReport = (reportText: string) => {
    setAiPreloadedContext(reportText);
    setCurrentSection('ai-assistant');
  };

  const handleBookFromSpecialist = (deptName: string) => {
    setSelectedDeptForBooking(deptName);
    setCurrentSection('appointments');
  };

  const handleResetDemoData = () => {
    if (currentUser?.email === 'rahul.sharma@healthcompanion.ai') {
      setReports(MOCK_REPORTS);
      setAppointments(MOCK_APPOINTMENTS);
      setPatient(MOCK_PATIENT);
      setMedicalHistory(MOCK_MEDICAL_HISTORY);
      setLifestyle(MOCK_LIFESTYLE);
      saveUserWorkspace(currentUser, {
        patient: MOCK_PATIENT,
        reports: MOCK_REPORTS,
        appointments: MOCK_APPOINTMENTS,
        medicalHistory: MOCK_MEDICAL_HISTORY,
        lifestyle: MOCK_LIFESTYLE
      });
    } else {
      const cleanWs = getUserWorkspace(currentUser);
      setReports([]);
      setAppointments([]);
      setPatient(cleanWs.patient);
      saveUserWorkspace(currentUser, {
        ...cleanWs,
        reports: [],
        appointments: []
      });
    }
  };

  return (
    <div
      id="health-companion-app"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors"
    >
      {/* Top Application Navbar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        patient={patient}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleDesktopSidebar={toggleDesktopSidebar}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 items-start">
        {/* Persistent Responsive Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onNavigate={handleNavigate}
          patient={patient}
          theme={theme}
          onToggleTheme={toggleTheme}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={toggleDesktopSidebar}
        />

        {/* Dynamic Page Views */}
        <main id="main-content-viewport" className="flex-1 min-w-0">
          {currentSection === 'login' && (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'doctor-portal' && currentUser && (
            <DoctorPortalPage
              currentUser={currentUser}
              appointments={appointments}
              reports={reports}
              patient={patient}
              onNavigate={handleNavigate}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {currentSection === 'home' && (
            <HomePage
              patient={patient}
              reports={reports}
              appointments={appointments}
              onNavigate={handleNavigate}
              onOpenUpload={() => setCurrentSection('medical-reports')}
              onDownloadPatientSummary={() =>
                downloadPatientSummaryPDF(patient, reports, appointments)
              }
            />
          )}

          {currentSection === 'my-health' && (
            <MyHealthPage
              patient={patient}
              medicalHistory={medicalHistory}
              appointments={appointments}
              reports={reports}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'medical-reports' && (
            <MedicalReportsPage
              reports={reports}
              onAddReport={handleAddReport}
              onDeleteReport={handleDeleteReport}
              patient={patient}
              onNavigateToAi={handleAskAiAboutReport}
              onNavigateToBooking={handleBookFromSpecialist}
            />
          )}

          {currentSection === 'appointments' && (
            <AppointmentsPage
              appointments={appointments}
              doctors={doctors}
              patient={patient}
              onAddAppointment={handleAddAppointment}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              initialSelectedDepartment={selectedDeptForBooking}
            />
          )}

          {currentSection === 'doctors' && (
            <DoctorsPage
              doctors={doctors}
              onBookDoctor={(doc) => {
                setSelectedDeptForBooking(doc.specialty);
                setCurrentSection('appointments');
              }}
              onContactDoctor={(doc) => {
                setSelectedDoctorForContact(doc.id);
                setCurrentSection('contact');
              }}
            />
          )}

          {currentSection === 'ai-assistant' && (
            <AiAssistantPage
              reports={reports}
              patient={patient}
              preloadedReportContext={aiPreloadedContext}
              onNavigateToBooking={() => setCurrentSection('appointments')}
            />
          )}

          {currentSection === 'patient-data' && (
            <PatientDataPage
              patient={patient}
              medicalHistory={medicalHistory}
              lifestyle={lifestyle}
              onUpdatePatient={setPatient}
              onUpdateHistory={setMedicalHistory}
              onUpdateLifestyle={setLifestyle}
            />
          )}

          {currentSection === 'previous-records' && (
            <PreviousRecordsPage records={previousRecords} patient={patient} />
          )}

          {currentSection === 'medication-info' && (
            <MedicationInfoPage
              onAskAiAboutMed={(medName) => {
                setAiPreloadedContext(`Medication reference for: ${medName}`);
                setCurrentSection('ai-assistant');
              }}
            />
          )}

          {currentSection === 'health-timeline' && (
            <HealthTimelinePage
              reports={reports}
              appointments={appointments}
              previousRecords={previousRecords}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'health-insights' && (
            <HealthInsightsPage
              reports={reports}
              appointments={appointments}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'emergency' && <EmergencyPage patient={patient} />}

          {currentSection === 'contact' && (
            <ContactPage
              doctors={doctors}
              patient={patient}
              currentUser={currentUser}
              preselectedDoctorId={selectedDoctorForContact}
              onStartConsultation={(doc) => {
                if (doc?.specialty) {
                  setSelectedDeptForBooking(doc.specialty);
                }
                setCurrentSection('appointments');
              }}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'settings' && (
            <SettingsPage
              theme={theme}
              onToggleTheme={toggleTheme}
              patient={patient}
              reports={reports}
              appointments={appointments}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Global Professional Healthcare Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
