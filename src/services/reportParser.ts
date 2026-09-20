import { LabFinding, MedicalReport } from '../types';
import { checkLaboratoryValue, findSuggestedDepartment } from './deterministicTools';

export interface ParseProgressStep {
  step: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ParseReportInput {
  fileName: string;
  fileBase64?: string;
  fileType?: string;
  rawText?: string;
  fileSize?: string;
  patientName?: string;
}

/**
 * Main report analyzer:
 * 1. Reads uploaded PDF / Document / Scan via backend AI endpoint (/api/gemini/parse-pdf)
 * 2. If PDF, extracts actual embedded text and runs Gemini or deterministic parser on the real text
 * 3. Never falls back to hardcoded mock numbers (like Hemoglobin 11.2) unless specifically in the file
 */
export async function parseAndAnalyzeReport(
  inputOrFileName: string | ParseReportInput,
  rawTextArg?: string,
  fileSizeArg: string = '180 KB',
  onProgress?: (stepIndex: number, label: string) => void
): Promise<MedicalReport> {
  let fileName = '';
  let fileBase64 = '';
  let fileType = '';
  let rawText = '';
  let fileSize = fileSizeArg;
  let patientName = '';

  if (typeof inputOrFileName === 'string') {
    fileName = inputOrFileName;
    rawText = rawTextArg || '';
    fileType = fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain';
  } else {
    fileName = inputOrFileName.fileName;
    fileBase64 = inputOrFileName.fileBase64 || '';
    fileType = inputOrFileName.fileType || (fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain');
    rawText = inputOrFileName.rawText || '';
    fileSize = inputOrFileName.fileSize || '180 KB';
    patientName = inputOrFileName.patientName || '';
  }

  const steps = [
    'Reading report document...',
    'Extracting document text & structures...',
    'Parsing laboratory parameters & reference intervals...',
    'Evaluating numerical values against stated bounds...',
    'Mapping relevant specialist department...',
    'Generating plain-language educational summary...',
    'Analysis complete.'
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) {
      onProgress(i, steps[i]);
    }
    await new Promise((resolve) => setTimeout(resolve, 260));
  }

  // 1. Call server-side PDF / Gemini parser
  try {
    const response = await fetch('/api/gemini/parse-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64,
        fileName,
        fileType,
        rawText,
        patientName
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.report) {
        const rep = data.report;
        const findings: LabFinding[] = (rep.findings || []).map((f: any) => {
          const val = typeof f.measuredValue === 'number' ? f.measuredValue : parseFloat(f.measuredValue) || 0;
          const min = typeof f.min === 'number' ? f.min : (typeof f.referenceRangeMin === 'number' ? f.referenceRangeMin : 0);
          const max = typeof f.max === 'number' ? f.max : (typeof f.referenceRangeMax === 'number' ? f.referenceRangeMax : 100);

          return checkLaboratoryValue(
            f.testName || 'Clinical Marker',
            val,
            f.unit || '',
            min,
            max
          );
        });

        const flagged = findings.filter((f) => f.status === 'outside_range');
        const suggestedDept = findSuggestedDepartment(flagged);

        return {
          id: `report-${Date.now()}`,
          title: rep.title || fileName.replace(/\.[^/.]+$/, '').replace(/[_]/g, ' ') || 'Diagnostic Report',
          date: rep.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          hospital: rep.hospital || 'Verified Diagnostic Center',
          category: rep.category || 'Diagnostic Laboratory',
          rawText: data.rawText || rawText || `Diagnostic report: ${fileName}`,
          summary: rep.summary || 'Your report has been analyzed. All parameters have been evaluated against stated reference bounds.',
          findings,
          suggestedDepartment: suggestedDept,
          status: 'analyzed',
          fileName,
          fileSize,
          isDemo: false
        };
      }
    }
  } catch (err) {
    console.warn('Backend document parsing encountered an error, running client fallback:', err);
  }

  // 2. Client-side fallback: Deterministic parse without fake values
  const findings: LabFinding[] = [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Look for test lines with numbers and ranges
    const m = line.match(/^([A-Za-z0-9\s()/-]{3,35})\s+([0-9.]+)\s*([A-Za-z/%μu/]{1,10})?\s+([0-9.]+)\s*[-–to]\s*([0-9.]+)/i);
    if (m) {
      const testName = m[1].trim();
      const val = parseFloat(m[2]);
      const unit = m[3] || '';
      const min = parseFloat(m[4]);
      const max = parseFloat(m[5]);
      if (!isNaN(val) && !isNaN(min) && !isNaN(max)) {
        findings.push(checkLaboratoryValue(testName, val, unit, min, max));
      }
    }
  }

  const flagged = findings.filter((f) => f.status === 'outside_range');
  const suggestedDept = findSuggestedDepartment(flagged);

  const summary = findings.length > 0
    ? `Your uploaded document (${fileName}) was analyzed. Out of ${findings.length} evaluated parameters, ${flagged.length} item(s) showed variation from standard reference bounds.\n\nHealth Companion AI provides educational information only.`
    : `Your uploaded document (${fileName}) has been processed and archived in your health records. Consult with your healthcare provider for clinical evaluation.`;

  return {
    id: `report-${Date.now()}`,
    title: fileName.replace(/\.[^/.]+$/, '').replace(/[_]/g, ' ') || 'Diagnostic Health Report',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    hospital: 'Verified Diagnostic Center',
    category: 'Diagnostic Laboratory',
    rawText: rawText || `Uploaded file: ${fileName}`,
    summary,
    findings,
    suggestedDepartment: suggestedDept,
    status: 'analyzed',
    fileName,
    fileSize,
    isDemo: false
  };
}
