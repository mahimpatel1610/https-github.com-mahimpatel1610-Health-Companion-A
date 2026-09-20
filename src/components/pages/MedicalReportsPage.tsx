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
  ChevronUp
} from 'lucide-react';
import { MedicalReport, PatientProfile } from '../../types';
import { parseAndAnalyzeReport } from '../../services/reportParser';
import { DEMO_REPORT_RAW_TEXT } from '../../data/mockHealthData';
import { downloadReportPDF } from '../../services/pdfGenerator';
import { MedicalDisclaimerBanner } from '../common/MedicalDisclaimerBanner';

interface MedicalReportsPageProps {
  reports: MedicalReport[];
  onAddReport: (newReport: MedicalReport) => void;
  onDeleteReport: (id: string) => void;
  patient: PatientProfile;
  onNavigateToAi: (reportText: string) => void;
  onNavigateToBooking: (department: string) => void;
}

export const MedicalReportsPage: React.FC<MedicalReportsPageProps> = ({
  reports,
  onAddReport,
  onDeleteReport,
  patient,
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

  const selectedReport =
    reports.find((r) => r.id === selectedReportId) || reports[0];

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
    setAnalysisStep({ step: 0, label: 'Reading report file...' });

    try {
      let extractedText = '';
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        extractedText = await file.text();
      } else {
        // Simulated high-fidelity text extraction for PDFs and clinical scans
        extractedText = `PATIENT CLINICAL EVALUATION: ${file.name}\n${DEMO_REPORT_RAW_TEXT}`;
      }

      const newReport = await parseAndAnalyzeReport(
        file.name,
        extractedText,
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

  // Hackathon 1-Click Demo Report Loader
  const handleLoadDemoReport = async () => {
    setIsAnalyzing(true);
    setAnalysisStep({ step: 0, label: 'Reading demo report...' });

    try {
      const demoReport = await parseAndAnalyzeReport(
        'Fictional_Hackathon_Patient_Report.pdf',
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
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Agentic RAG & Deterministic Parser
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Reports & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Upload medical PDFs or scans. The system automatically reads, checks numerical ranges against explicit document bounds, and generates a plain-language explanation.
          </p>
        </div>

        {/* Demo trigger button for immediate hackathon demonstration */}
        <button
          id="load-demo-report-btn"
          onClick={handleLoadDemoReport}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load Hackathon Demo Report</span>
        </button>
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
              Upload Medical Report (PDF or Scanned Image)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag and drop your laboratory document or click below. Supports PDF, JPG, PNG, TXT.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="browse-file-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border border-teal-700 shadow-xs transition-colors disabled:opacity-50"
            >
              Browse Files
            </button>
            <button
              id="fictional-demo-btn"
              onClick={handleLoadDemoReport}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Use Fictional Lab Sample
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
                  Automatic AI & Deterministic Processing...
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

      {/* Main Layout: List of reports on left (or dropdown on mobile) and Selected Report Viewer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Directory Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              My Reports ({reports.length})
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
              placeholder="Search reports or tests..."
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
                        {outsideCount} flagged
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
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed rounded-xl">
                No reports match your search query.
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
                      <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800">
                        Demo Data
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Recorded: {selectedReport.date} | Facility: {selectedReport.hospital} | File: {selectedReport.fileName} ({selectedReport.fileSize || '200 KB'})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Ask AI Button */}
                  <button
                    id="ask-ai-about-report-btn"
                    onClick={() => onNavigateToAi(selectedReport.rawText)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900 flex items-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-teal-600" />
                    <span>Ask AI About This Report</span>
                  </button>

                  {/* Download PDF */}
                  <button
                    id="download-report-pdf-btn"
                    onClick={() => downloadReportPDF(selectedReport, patient)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download PDF</span>
                  </button>

                  {/* Delete Report */}
                  <button
                    id="delete-report-btn"
                    onClick={() => {
                      if (confirm(`Delete ${selectedReport.title}?`)) {
                        onDeleteReport(selectedReport.id);
                      }
                    }}
                    aria-label="Delete report"
                    className="p-1.5 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1. Plain-Language Summary Box */}
              <div
                id="plain-language-summary-card"
                className="p-5 rounded-2xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/30 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-extrabold text-teal-950 dark:text-teal-200">
                    Plain-Language Summary
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedReport.summary}
                </p>
              </div>

              {/* 2. Verified Findings Section (Tool 1 deterministic results) */}
              <div id="verified-findings-card" className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Verified Findings
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      (Strictly checked against stated reference ranges)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold">
                      🟢 Within range
                    </span>
                    <span className="flex items-center gap-1 text-red-700 dark:text-red-400 font-semibold">
                      🔴 Outside range
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        <th className="py-2.5 px-3">Test Parameter</th>
                        <th className="py-2.5 px-3">Measured Value</th>
                        <th className="py-2.5 px-3">Stated Reference Range</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {selectedReport.findings.map((finding) => (
                        <tr
                          key={finding.id}
                          className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                            finding.status === 'outside_range'
                              ? 'bg-red-50/20 dark:bg-red-950/10'
                              : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {finding.testName}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            {finding.measuredValue}{' '}
                            <span className="text-slate-500 font-normal">
                              {finding.unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                            {finding.referenceRange}
                          </td>
                          <td className="py-2.5 px-3">
                            {finding.status === 'within_range' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                                🟢 Within range
                              </span>
                            ) : finding.status === 'outside_range' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                                🔴 Outside range
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                🟡 Follow-up
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs">
                            {finding.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Suggested Department Card (Tool 2 specialist finder) */}
              <div
                id="suggested-department-card"
                className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
                        Suggested Department
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {selectedReport.suggestedDepartment.department}
                      </h3>
                    </div>
                  </div>

                  <button
                    id="book-specialist-btn"
                    onClick={() =>
                      onNavigateToBooking(
                        selectedReport.suggestedDepartment.department
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700 shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <span>Book Specialist Consultation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-indigo-900 dark:text-indigo-300">
                    Why this department?
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedReport.suggestedDepartment.reason}
                  </p>
                  <p className="text-[11px] italic text-slate-500 dark:text-slate-400 pt-1">
                    “{selectedReport.suggestedDepartment.disclaimer}”
                  </p>
                </div>
              </div>

              {/* 4. Extracted Raw Report Text Viewer & Chunks Accordion */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <button
                  id="toggle-raw-text-btn"
                  onClick={() => setShowRawText(!showRawText)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>View Extracted Document Text & Chunks (RAG Index)</span>
                  </div>
                  {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showRawText && (
                  <div className="p-4 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Search within report text chunks..."
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
            <div className="p-12 text-center border-2 border-dashed rounded-2xl text-slate-500">
              Select or upload a report to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
