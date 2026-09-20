import { LabFinding, FindingStatus, DepartmentSuggestion } from '../types';

/**
 * Tool 1 — Deterministic Medical Value Checker
 * Strictly checks laboratory values against reference ranges stated in the uploaded report.
 * The LLM must NOT decide whether a value is inside/outside the stated range.
 */
export function checkLaboratoryValue(
  testName: string,
  measuredValue: number,
  unit: string,
  minRef: number,
  maxRef: number,
  customExplanation?: string
): LabFinding {
  let status: FindingStatus = 'within_range';
  let statusLabel = 'Within stated reference range';

  if (measuredValue < minRef) {
    status = 'outside_range';
    statusLabel = 'Below stated reference range';
  } else if (measuredValue > maxRef) {
    status = 'outside_range';
    statusLabel = 'Above stated reference range';
  } else {
    // Check if bordering on upper/lower 5% threshold for follow-up note
    const range = maxRef - minRef;
    if (range > 0) {
      const distFromMin = (measuredValue - minRef) / range;
      const distFromMax = (maxRef - measuredValue) / range;
      if (distFromMin < 0.05 || distFromMax < 0.05) {
        status = 'follow_up_appropriate';
        statusLabel = 'Borderline within reference range';
      }
    }
  }

  const defaultExplanation = status === 'outside_range'
    ? `The measured value (${measuredValue} ${unit}) is outside the stated reference range (${minRef} - ${maxRef} ${unit}). A healthcare professional can interpret this in your clinical context.`
    : `The measured value (${measuredValue} ${unit}) sits comfortably within the laboratory's stated reference range (${minRef} - ${maxRef} ${unit}).`;

  return {
    id: `finding-${testName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    testName,
    category: 'Hematology / Biochemistry',
    measuredValue,
    unit,
    referenceRange: `${minRef} - ${maxRef} ${unit}`,
    status,
    statusLabel,
    explanation: customExplanation || defaultExplanation
  };
}

/**
 * Tool 2 — Specialist Finder
 * Deterministically maps flagged report information to a relevant medical department.
 * Explains ONLY the connection between the flagged item and the relevant department.
 * Does NOT diagnose the patient.
 */
export function findSuggestedDepartment(flaggedFindings: LabFinding[]): DepartmentSuggestion {
  if (!flaggedFindings || flaggedFindings.length === 0) {
    return {
      department: 'General Medicine',
      secondaryDepartment: 'Preventive Healthcare',
      flaggedMarker: 'All markers within standard ranges',
      reason: 'All verified values are within their stated reference intervals. A routine annual checkup with a General Physician is sufficient for continued wellness.',
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    };
  }

  const firstFlag = flaggedFindings[0];
  const markerName = firstFlag.testName.toLowerCase();

  if (markerName.includes('hemoglobin') || markerName.includes('platelet') || markerName.includes('white blood')) {
    return {
      department: 'General Medicine / Hematology',
      secondaryDepartment: 'Internal Medicine',
      flaggedMarker: firstFlag.testName,
      reason: `The laboratory report recorded ${firstFlag.testName} (${firstFlag.measuredValue} ${firstFlag.unit}) outside the stated reference range (${firstFlag.referenceRange}). Hematology is the medical branch specializing in blood cells and hemoglobin evaluation, while General Medicine provides primary clinical interpretation.`,
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    };
  }

  if (markerName.includes('glucose') || markerName.includes('sugar') || markerName.includes('hba1c') || markerName.includes('insulin')) {
    return {
      department: 'General Medicine / Endocrinology',
      secondaryDepartment: 'Metabolic Care',
      flaggedMarker: firstFlag.testName,
      reason: `The laboratory report recorded ${firstFlag.testName} (${firstFlag.measuredValue} ${firstFlag.unit}) outside the stated reference range. Endocrinology focuses on hormones and metabolic sugar regulation, while General Medicine assesses overall lifestyle and diet context.`,
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    };
  }

  if (markerName.includes('cholesterol') || markerName.includes('triglyceride') || markerName.includes('lipid') || markerName.includes('ldl')) {
    return {
      department: 'General Medicine / Preventive Cardiology',
      secondaryDepartment: 'Cardiology',
      flaggedMarker: firstFlag.testName,
      reason: `Lipid and cholesterol levels are primarily reviewed by General Physicians and Preventive Cardiology specialists to discuss balanced cardiovascular health and dietary habits.`,
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    };
  }

  if (markerName.includes('creatinine') || markerName.includes('bun') || markerName.includes('urea') || markerName.includes('egfr')) {
    return {
      department: 'General Medicine / Nephrology',
      secondaryDepartment: 'Renal Care',
      flaggedMarker: firstFlag.testName,
      reason: `Creatinine and nitrogenous markers relate to kidney filtration and hydration balance, commonly reviewed by General Practitioners and Nephrologists.`,
      disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
    };
  }

  return {
    department: 'General Medicine',
    secondaryDepartment: 'Specialty Consultation',
    flaggedMarker: firstFlag.testName,
    reason: `The test ${firstFlag.testName} was flagged outside the stated reference range. General Medicine serves as the primary gateway to coordinate appropriate follow-ups.`,
    disclaimer: 'A qualified healthcare professional can determine whether specialist evaluation is appropriate.'
  };
}

/**
 * Tool 3 — Report Retriever (RAG Chunks)
 * Retrieves relevant sections from the uploaded report text using keyword matching.
 */
export function retrieveReportChunks(fullReportText: string, query: string, topK: number = 3): string[] {
  if (!fullReportText) return [];
  const lines = fullReportText.split('\n').filter(l => l.trim().length > 0);
  
  // Group into chunks of 3-4 lines
  const chunks: string[] = [];
  for (let i = 0; i < lines.length; i += 3) {
    chunks.push(lines.slice(i, i + 4).join(' '));
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  if (queryTerms.length === 0) return chunks.slice(0, topK);

  const scored = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      if (chunkLower.includes(term)) score += 2;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.chunk);
}
