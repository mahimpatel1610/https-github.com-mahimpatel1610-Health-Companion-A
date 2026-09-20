import { jsPDF } from 'jspdf';
import { Appointment, MedicalReport, PatientProfile } from '../types';

export function downloadReportPDF(report: MedicalReport, patient: PatientProfile) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(13, 148, 136); // Medical Teal (#0d9488)
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HEALTH COMPANION AI', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Patient Health Record Simplifier & Healthcare Companion', 14, 18);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 14, 18, { align: 'right' });

  y = 32;

  // Patient Card
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // Navy 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Patient: ${patient.fullName}`, 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`DOB: ${patient.dob} (${patient.age} yrs) | Gender: ${patient.gender} | Blood Group: ${patient.bloodGroup}`, 20, y + 15);
  doc.text(`Emergency Contact: ${patient.emergencyContact.name} (${patient.emergencyContact.relation}) - ${patient.emergencyContact.phone}`, 20, y + 21);

  y += 34;

  // Report Details Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Report: ${report.title}`, 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Date of Test: ${report.date} | Facility: ${report.hospital} | File: ${report.fileName}`, 14, y);

  y += 10;

  // Plain-Language Summary Box
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(153, 246, 228); // Teal 200
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setTextColor(13, 148, 136);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PLAIN-LANGUAGE EDUCATIONAL SUMMARY', 20, y + 6);

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const splitSummary = doc.splitTextToSize(report.summary.replace(/\n+/g, ' '), pageWidth - 40);
  doc.text(splitSummary.slice(0, 4), 20, y + 12);

  y += 36;

  // Verified Findings Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFIED LABORATORY FINDINGS', 14, y);

  y += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Test Parameter', 18, y + 5);
  doc.text('Measured Value', 80, y + 5);
  doc.text('Stated Reference Range', 120, y + 5);
  doc.text('Status', 165, y + 5);

  y += 7;

  // Table Rows
  report.findings.forEach((finding) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, pageWidth - 14, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(finding.testName, 18, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(`${finding.measuredValue} ${finding.unit}`, 80, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(finding.referenceRange, 120, y + 5);

    // Status pill text
    if (finding.status === 'outside_range') {
      doc.setTextColor(220, 38, 38);
      doc.text('Outside Range', 165, y + 5);
    } else if (finding.status === 'follow_up_appropriate') {
      doc.setTextColor(217, 119, 6);
      doc.text('Borderline', 165, y + 5);
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text('Within Range', 165, y + 5);
    }

    y += 8;
  });

  y += 6;

  // Suggested Department Box
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(67, 56, 202);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Suggested Department: ${report.suggestedDepartment.department}`, 20, y + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const splitReason = doc.splitTextToSize(report.suggestedDepartment.reason, pageWidth - 40);
  doc.text(splitReason.slice(0, 2), 20, y + 12);

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(`Note: ${report.suggestedDepartment.disclaimer}`, 20, y + 20);

  y += 30;

  // Medical Disclaimer Banner (MANDATORY)
  doc.setFillColor(254, 242, 242); // Red 50
  doc.setDrawColor(254, 202, 202); // Red 200
  doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('IMPORTANT MEDICAL SAFETY DISCLAIMER', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Health Companion AI provides educational information only. It does not diagnose conditions, prescribe medication, or replace professional medical advice. Always consult a qualified healthcare provider for clinical evaluation.',
    20,
    y + 11
  );

  // Save the PDF
  const safeFilename = `${report.title.replace(/[^a-z0-9]/gi, '_')}_Summary.pdf`;
  doc.save(safeFilename);
}

export function downloadPatientSummaryPDF(
  patient: PatientProfile,
  reports: MedicalReport[],
  appointments?: Appointment[]
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(13, 148, 136);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HEALTH COMPANION AI — PATIENT DOSSIER', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Comprehensive Health Profile & Document Summary', 14, 18);

  y = 32;

  // Patient Card
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Patient Dossier: ${patient.fullName}`, 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`DOB: ${patient.dob} (Age: ${patient.age}) | Gender: ${patient.gender} | Blood: ${patient.bloodGroup}`, 14, y);
  y += 5;
  doc.text(`Contact: ${patient.phone} | Email: ${patient.email}`, 14, y);
  y += 5;
  doc.text(`Address: ${patient.address}`, 14, y);

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Archived Medical Reports (${reports.length} on record)`, 14, y);

  y += 6;

  reports.forEach((rep, idx) => {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${rep.title} — ${rep.date}`, 18, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Facility: ${rep.hospital} | Suggested Department: ${rep.suggestedDepartment.department}`, 18, y + 12);

    const outside = rep.findings.filter((f) => f.status === 'outside_range');
    doc.text(
      `Verified Parameters: ${rep.findings.length} evaluated (${outside.length > 0 ? outside.map((o) => `${o.testName}: ${o.measuredValue} ${o.unit}`).join(', ') : 'All in range'})`,
      18,
      y + 17
    );

    y += 26;
  });

  y += 6;

  // Disclaimer
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('EDUCATIONAL DISCLAIMER', 20, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.',
    20,
    y + 10
  );

  doc.save(`${patient.fullName.replace(/\s+/g, '_')}_Health_Summary.pdf`);
}
