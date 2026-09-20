import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Search,
  Download,
  Trash2,
  AlertTriangle,
  Building2,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  X,
  CheckCircle2,
  Stethoscope,
  Share2,
  UserCheck
} from 'lucide-react';
import { MedicalReport, PatientProfile, LabFinding, AuthUser } from '../../types';
import { parseAndAnalyzeReport } from '../../services/reportParser';
import { DEMO_REPORT_RAW_TEXT, MOCK_DOCTORS } from '../../data/mockHealthData';
import { downloadReportPDF } from '../../services/pdfGenerator';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';
import { checkLaboratoryValue, findSuggestedDepartment } from '../../services/deterministicTools';
import { cloudShareReportWithDoctor } from '../../services/supabase';

interface MedicalReportsPageProps {
  reports: MedicalReport[];
  onAddReport: (newReport: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  patient: PatientProfile;
  currentUser?: AuthUser | null;
  onNavigateToAi: (reportText: string) => void;
  onNavigateToBooking: (department: string) => void;
}

interface ManualParamRow {
  name: string;
  value: string;
  unit: string;
  min: string;
  max: string;
}

export const MedicalReportsPage: React.FC<MedicalReportsPageProps> = ({
  reports,
  onAddReport,
  onDeleteReport,
  patient,
  currentUser,
  onNavigateToAi,
  onNavigateToBooking
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<{ step: number; label: string }>({
    step: 0,
    label: ''
  });
  const [showRawText, setShowRawText] = useState(false);
  const [rawTextSearch, setRawTextSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Report Entry Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualTitle, setManualTitle] = useState('Thyroid Function Test');
  const [manualHospital, setManualHospital] = useState('Apollo Diagnostic Center');
  const [manualDoctor, setManualDoctor] = useState('Dr. R. K. Mehta');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualCategory, setManualCategory] = useState('Endocrinology');
  const [manualParams, setManualParams] = useState<ManualParamRow[]>([
    { name: 'Thyroid Stimulating Hormone (TSH)', value: '3.4', unit: 'uIU/mL', min: '0.4', max: '4.2' },
    { name: 'Free T3', value: '3.1', unit: 'pg/mL', min: '2.0', max: '4.4' },
    { name: 'Free T4', value: '1.2', unit: 'ng/dL', min: '0.8', max: '1.8' }
  ]);

  // Share Report with Doctor State
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoctorIdToShare, setSelectedDoctorIdToShare] = useState<string>(MOCK_DOCTORS[0]?.id || 'doc-1');
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [sharedReportsState, setSharedReportsState] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('hc_shared_reports_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleShareWithDoctor = async () => {
    if (!selectedReport) return;
    setIsSharing(true);
    const doctorObj = MOCK_DOCTORS.find((d) => d.id === selectedDoctorIdToShare);
    const docName = doctorObj?.name || 'Selected Doctor';
    const patientId = currentUser?.id || `patient-${patient.fullName.replace(/\s+/g, '-').toLowerCase()}`;

    try {
      const res = await cloudShareReportWithDoctor(selectedReport.id, patientId, selectedDoctorIdToShare);
      setSharedReportsState((prev) => {
        const current = prev[selectedReport.id] || [];
        const next = Array.from(new Set([...current, selectedDoctorIdToShare]));
        const updated = { ...prev, [selectedReport.id]: next };
        try {
          localStorage.setItem('hc_shared_reports_map', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setShareNotice(res.message || `Successfully shared with ${docName}`);
      setTimeout(() => {
        setShowShareModal(false);
        setShareNotice(null);
      }, 1500);
    } catch (err: any) {
      setShareNotice(`Error: ${err?.message || 'Could not share report'}`);
    } finally {
      setIsSharing(false);
    }
  };

  // Filtering & Sorting
  const filteredReports = reports
    .filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      return sortBy === 'newest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  // Handle file drop / manual file select
  const handleFileProcess = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisStep({ step: 0, label: 'Reading uploaded document...' });

    try {
      let extractedText = '';
      let fileBase64 = '';

      // Read file as base64 for backend PDFParse and Gemini multimodal analysis
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      fileBase64 = btoa(binary);

      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        extractedText = await file.text();
      }

      const newReport = await parseAndAnalyzeReport(
        {
          fileName: file.name,
          fileBase64,
          fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
          rawText: extractedText,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          patientName: patient.fullName
        },
        undefined,
        `${Math.round(file.size / 1024)} KB`,
        (step, label) => {
          setAnalysisStep({ step, label });
        }
      );

      onAddReport(newReport);
      setSelectedReportId(newReport.id);
    } catch (err) {
      console.error(err);
      alert('Unable to parse document. Please upload a valid text or PDF file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manual submission handler
  const handleSaveManualReport = () => {
    if (!manualTitle.trim()) {
      alert('Please enter a report title.');
      return;
    }

    const findings: LabFinding[] = manualParams
      .filter((p) => p.name.trim() && p.value.trim())
      .map((p) => {
        const val = parseFloat(p.value) || 0;
        const min = parseFloat(p.min) || 0;
        const max = parseFloat(p.max) || 100;
        return checkLaboratoryValue(p.name.trim(), val, p.unit.trim() || '', min, max);
      });

    const flagged = findings.filter((f) => f.status === 'outside_range');
    const suggestedDept = findSuggestedDepartment(flagged);

    const normalCount = findings.length - flagged.length;
    const summary = findings.length > 0
      ? `Your manually entered report (${manualTitle}) has been evaluated against the stated reference standards.\n\n${
          flagged.length > 0
            ? `Out of ${findings.length} evaluated parameters, ${flagged.length} item(s) showed variation from the stated reference bounds (${flagged.map((f) => `${f.testName}: ${f.measuredValue} ${f.unit}`).join(', ')}). The remaining ${normalCount} markers are within normal limits.`
            : `All ${findings.length} evaluated laboratory parameters are comfortably within their stated reference ranges.`
        }\n\nA consultation with ${suggestedDept.department} can provide appropriate medical context for your health plan.`
      : `Report (${manualTitle}) has been recorded. Consult your healthcare provider for clinical evaluation.`;

    const rawTextLines = [
      `MANUAL CLINICAL REPORT ENTRY`,
      `Title: ${manualTitle}`,
      `Patient: ${patient.fullName}`,
      `Date: ${manualDate}`,
      `Hospital: ${manualHospital}`,
      `Doctor: ${manualDoctor}`,
      `Category: ${manualCategory}`,
      ``,
      `FINDINGS:`,
      ...findings.map((f) => `${f.testName}   ${f.measuredValue} ${f.unit}   (Ref: ${f.referenceRange}) - ${f.statusLabel}`)
    ];

    const newReport: MedicalReport = {
      id: `report-${Date.now()}`,
      title: manualTitle.trim(),
      date: new Date(manualDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      hospital: manualHospital.trim() || 'Verified Diagnostic Center',
      category: manualCategory.trim() || 'General Medicine',
      rawText: rawTextLines.join('\n'),
      summary,
      findings,
      suggestedDepartment: suggestedDept,
      status: 'analyzed',
      fileName: `${manualTitle.replace(/\s+/g, '_')}_manual.pdf`,
      fileSize: '12 KB',
      isDemo: false
    };

    onAddReport(newReport);
    setSelectedReportId(newReport.id);
    setShowManualModal(false);
  };

  const handleAddParamRow = () => {
    setManualParams((prev) => [
      ...prev,
      { name: '', value: '', unit: 'mg/dL', min: '0', max: '100' }
    ]);
  };

  const handleRemoveParamRow = (index: number) => {
    setManualParams((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateParamRow = (index: number, field: keyof ManualParamRow, value: string) => {
    setManualParams((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  // Hackathon Sample Report Loader (Explicit opt-in only)
  const handleLoadDemoReport = async () => {
    setIsAnalyzing(true);
    setAnalysisStep({ step: 0, label: 'Reading demo sample...' });

    try {
      const demoReport = await parseAndAnalyzeReport(
        'Fictional_Patient_Sample_Report.pdf',
        DEMO_REPORT_RAW_TEXT,
        '215 KB',
        (step, label) => {
          setAnalysisStep({ step, label });
        }
      );

      onAddReport(demoReport);
      setSelectedReportId(demoReport.id);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="medical-reports-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Personalized Medical Document Parser
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Reports & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Upload your clinical PDF or type findings manually. The AI reads your document, checks numerical bounds deterministically, and explains findings in plain language.
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="open-manual-entry-btn"
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 transition-all shadow-2xs"
          >
            <Edit3 className="w-4 h-4" />
            <span>Add Details Manually</span>
          </button>

          <button
            id="load-demo-report-btn"
            onClick={handleLoadDemoReport}
            disabled={isAnalyzing}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Load an optional test sample for demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample Test Report</span>
          </button>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* Upload Drop Zone Card */}
      <div
        id="report-upload-zone"
        className="p-6 rounded-2xl border-2 border-dashed border-teal-300 dark:border-teal-800/80 bg-teal-50/30 dark:bg-teal-950/20 text-center transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileProcess(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.txt,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 dark:bg-teal-900 border border-teal-200 dark:border-teal-700 flex items-center justify-center text-teal-700 dark:text-teal-300 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Medical Report (PDF or Scanned Document)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag and drop your report or choose an action below. AI will extract and verify the actual values from your PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="browse-file-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Browse PDF / Scans</span>
            </button>

            <button
              id="enter-manual-details-btn"
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Enter Details Manually</span>
            </button>
          </div>
        </div>

        {/* Live Automatic Multi-Step Analysis Progress Display */}
        {isAnalyzing && (
          <div
            id="upload-analysis-progress"
            className="mt-6 p-4 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-left max-w-lg mx-auto shadow-md space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <p className="text-xs font-bold text-teal-900 dark:text-teal-200">
                  AI Reading & Parsing Uploaded Document...
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                Step {analysisStep.step + 1} of 7
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="bg-teal-600 dark:bg-teal-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((analysisStep.step + 1) / 7) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium animate-pulse">
              ➔ {analysisStep.label}
            </p>
          </div>
        )}
      </div>

      {/* Main Layout: List of reports on left & Selected Report on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Directory Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              My Saved Reports ({reports.length})
            </h2>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-1 px-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports or parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Reports List */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredReports.map((rep) => {
              const isSelected = rep.id === selectedReport?.id;
              const outsideCount = rep.findings.filter(
                (f) => f.status === 'outside_range'
              ).length;

              return (
                <div
                  key={rep.id}
                  id={`report-item-${rep.id}`}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-teal-500 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {rep.title}
                      </h3>
                    </div>
                    {rep.isDemo && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Demo
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {rep.date} • {rep.hospital}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">
                      {rep.findings.length} parameters
                    </span>
                    {outsideCount > 0 ? (
                      <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {outsideCount} outside range
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        All standard
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="p-8 text-center border border-dashed rounded-2xl border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {reports.length === 0 ? 'No medical reports uploaded yet.' : 'No reports match your search query.'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {reports.length === 0
                    ? 'Upload a PDF above or click "Add Details Manually" to get started.'
                    : 'Try clearing your search term.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Report Detailed View */}
        <div className="lg:col-span-8 space-y-4">
          {selectedReport ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
              {/* Report Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedReport.title}
                    </h2>
                    {selectedReport.isDemo && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Sample Demo Report
                      </span>
                    )}
                    {sharedReportsState[selectedReport.id]?.map((docId) => {
                      const doc = MOCK_DOCTORS.find((d) => d.id === docId);
                      return (
                        <span
                          key={docId}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          Shared with {doc?.name || 'Doctor'}
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{selectedReport.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {selectedReport.hospital}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedReport.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="share-report-btn"
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Share this report with your attending physician"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Share Report with Doctor</span>
                  </button>

                  <button
                    id="download-report-pdf-btn"
                    onClick={() => downloadReportPDF(selectedReport, patient)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    id="ask-ai-report-btn"
                    onClick={() => onNavigateToAi(selectedReport.rawText)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI About This Report</span>
                  </button>

                  <button
                    id="delete-report-btn"
                    onClick={() => onDeleteReport(selectedReport.id)}
                    className="p-2 rounded-xl text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-colors"
                    title="Delete report from records"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1. Plain-Language Educational Summary */}
              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                    Plain-Language Educational Explanation
                  </h3>
                </div>
                <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {selectedReport.summary}
                </div>
              </div>

              {/* 2. Deterministic Tool 1 Findings Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified Numerical Findings ({selectedReport.findings.length})
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Evaluated deterministically against stated reference bounds
                  </span>
                </div>

                {selectedReport.findings.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                          <th className="py-2.5 px-3">Test Parameter</th>
                          <th className="py-2.5 px-3">Measured Value</th>
                          <th className="py-2.5 px-3">Stated Reference Range</th>
                          <th className="py-2.5 px-3">Verified Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                        {selectedReport.findings.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 font-semibold">
                              {f.testName}
                            </td>
                            <td className="py-2.5 px-3 font-bold font-mono">
                              {f.measuredValue} <span className="text-slate-500 font-normal">{f.unit}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                              {f.referenceRange}
                            </td>
                            <td className="py-2.5 px-3">
                              {f.status === 'within_range' ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                                  Within stated range
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                                  Outside stated range
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                    No structured numerical lab parameters detected in this document.
                  </div>
                )}
              </div>

              {/* 3. Suggested Specialty Department */}
              {selectedReport.suggestedDepartment && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                        Suggested Medical Department: {selectedReport.suggestedDepartment.department}
                      </h3>
                    </div>
                    <button
                      onClick={() => onNavigateToBooking(selectedReport.suggestedDepartment.department)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Find Doctors</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedReport.suggestedDepartment.reason}
                  </p>
                  <p className="text-[11px] italic text-slate-500 dark:text-slate-400">
                    {selectedReport.suggestedDepartment.disclaimer}
                  </p>
                </div>
              )}

              {/* 4. Extracted Document Text Accordion */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  id="toggle-raw-text-btn"
                  onClick={() => setShowRawText(!showRawText)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>View Extracted Document Text & Chunks</span>
                  </div>
                  {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRawText && (
                  <div className="p-4 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Search within report text..."
                      value={rawTextSearch}
                      onChange={(e) => setRawTextSearch(e.target.value)}
                      className="w-full py-1.5 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />

                    <pre className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap overflow-x-auto max-h-60 custom-scrollbar border border-slate-200 dark:border-slate-800">
                      {selectedReport.rawText}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-2xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Medical Report Selected
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Upload your clinical laboratory report PDF or enter your findings manually to see verified numbers, reference checks, and AI explanations.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload PDF</span>
                </button>
                <button
                  onClick={() => setShowManualModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Enter Details Manually</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Report Entry Modal */}
      {showManualModal && (
        <div
          id="manual-report-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Manual Clinical Report Entry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Type your laboratory numbers and reference intervals manually.
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Header Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Thyroid Profile, Complete Blood Count"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Hematology">Hematology (Blood)</option>
                  <option value="Biochemistry">Biochemistry (Glucose, Electrolytes)</option>
                  <option value="Endocrinology">Endocrinology (Thyroid, Hormones)</option>
                  <option value="Lipid Profile">Lipid Profile (Cholesterol)</option>
                  <option value="Liver Function">Liver Function (LFT)</option>
                  <option value="Kidney Function">Kidney Function (KFT / RFT)</option>
                  <option value="General Health">General Health Checkup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Diagnostic Center
                </label>
                <input
                  type="text"
                  value={manualHospital}
                  onChange={(e) => setManualHospital(e.target.value)}
                  placeholder="e.g. City Diagnostic Laboratory"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor / Pathologist
                </label>
                <input
                  type="text"
                  value={manualDoctor}
                  onChange={(e) => setManualDoctor(e.target.value)}
                  placeholder="e.g. Dr. R. K. Mehta"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  disabled
                  value={patient.fullName}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Test Parameters Dynamic Table */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Laboratory Test Parameters
                </label>
                <button
                  type="button"
                  onClick={handleAddParamRow}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {manualParams.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Parameter (e.g. TSH)"
                        value={row.name}
                        onChange={(e) => handleUpdateParamRow(idx, 'name', e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="Value"
                        value={row.value}
                        onChange={(e) => handleUpdateParamRow(idx, 'value', e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Unit (mg/dL)"
                        value={row.unit}
                        onChange={(e) => handleUpdateParamRow(idx, 'unit', e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center gap-1.5">
                      <input
                        type="number"
                        step="any"
                        placeholder="Min"
                        value={row.min}
                        onChange={(e) => handleUpdateParamRow(idx, 'min', e.target.value)}
                        className="w-1/2 text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                      <span className="text-slate-400 text-xs">-</span>
                      <input
                        type="number"
                        step="any"
                        placeholder="Max"
                        value={row.max}
                        onChange={(e) => handleUpdateParamRow(idx, 'max', e.target.value)}
                        className="w-1/2 text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveParamRow(idx)}
                        disabled={manualParams.length === 1}
                        className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveManualReport}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Save Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Report with Doctor Modal */}
      {showShareModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Share Report with Doctor
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Explicit physician access control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your report will <strong className="font-semibold text-slate-900 dark:text-white">only</strong> be visible to the physician you choose. No other doctor can see this report without your explicit permission.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <p className="font-bold text-slate-900 dark:text-white truncate">
                Document: {selectedReport.title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedReport.findings.length} findings • {selectedReport.hospital}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                Select Attending Physician:
              </label>
              <select
                value={selectedDoctorIdToShare}
                onChange={(e) => setSelectedDoctorIdToShare(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {MOCK_DOCTORS.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    👨‍⚕️ {doc.name} — {doc.specialty} ({doc.hospital})
                  </option>
                ))}
              </select>
            </div>

            {shareNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{shareNotice}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSharing}
                onClick={handleShareWithDoctor}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isSharing ? 'Sharing...' : 'Confirm & Share Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
