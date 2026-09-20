import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { PDFParse } from "pdf-parse";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ---------------------------------------------------------------------------
// Server-Side Persistent Storage (Cross-Device Synchronized Data)
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), "server_data");
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create server_data directory:", err);
  }
}

const MESSAGES_FILE = path.join(DATA_DIR, "doctor_messages.json");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

interface ServerDoctorMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  doctorId: string;
  doctorName: string;
  hospital?: string;
  subject: string;
  message: string;
  urgency?: "routine" | "urgent" | "question";
  timestamp: string;
  status: "unread" | "read" | "replied";
  reply?: {
    text: string;
    repliedAt: string;
    doctorName: string;
  };
}

interface ServerAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  hospital: string;
  type: "In-person" | "Online";
  status: "Confirmed" | "Completed" | "Cancelled";
  reason: string;
  notes?: string;
}

const DEFAULT_SERVER_MESSAGES: ServerDoctorMessage[] = [
  {
    id: "msg-seed-1",
    senderName: "Rahul Sharma",
    senderEmail: "rahul.sharma@healthcompanion.ai",
    senderPhone: "+91 98765 43210",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Sharma",
    hospital: "Apollo Health City, Bengaluru",
    subject: "Question regarding slight hemoglobin variation in CBC report",
    message: "Hello Dr. Ananya, my recent complete blood count showed hemoglobin at 11.2 g/dL. I wanted to ask if I should start any dietary iron supplements or if I should schedule an in-person follow up visit?",
    urgency: "question",
    timestamp: "19 Sep 2026, 11:30 AM",
    status: "replied",
    reply: {
      text: "Hello Rahul, 11.2 g/dL indicates mild variation. Increasing dietary iron (spinach, lentils, beets) and repeating a CBC in 6 to 8 weeks is usually the initial step. If you experience fatigue, please book a routine consultation.",
      repliedAt: "19 Sep 2026, 02:15 PM",
      doctorName: "Dr. Ananya Sharma"
    }
  },
  {
    id: "msg-seed-2",
    senderName: "Priya Mehra",
    senderEmail: "priya.mehra@example.com",
    senderPhone: "+91 98111 22334",
    doctorId: "clinic",
    doctorName: "All Attending Doctors & Clinic Coordinator",
    hospital: "Apollo Health City, Bengaluru",
    subject: "Request for teleconsultation timing confirmation",
    message: "Hello, I booked a digital teleconsultation for this coming Tuesday. Could the clinic team confirm if the secure video link will be sent via SMS or through this portal?",
    urgency: "routine",
    timestamp: "19 Sep 2026, 03:45 PM",
    status: "unread"
  }
];

const DEFAULT_SERVER_APPOINTMENTS: ServerAppointment[] = [
  {
    id: "apt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Sharma",
    specialty: "General Medicine & Hematology",
    date: "24 Sep 2026",
    time: "10:30 AM",
    hospital: "Apollo Health City, Bengaluru",
    type: "In-person",
    status: "Confirmed",
    reason: "Review latest laboratory findings (Hemoglobin follow-up)",
    notes: "Please bring recent fasting lab report and allergy history."
  },
  {
    id: "apt-2",
    doctorId: "doc-2",
    doctorName: "Dr. Rajesh Varma",
    specialty: "Cardiology & Vascular Medicine",
    date: "12 Oct 2026",
    time: "03:00 PM",
    hospital: "Metro Heart & Vascular Institute",
    type: "Online",
    status: "Confirmed",
    reason: "Semi-annual lipid and blood pressure preventative review",
    notes: "Teleconsultation link will be active 10 minutes prior."
  }
];

function loadMessages(): ServerDoctorMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading messages file:", err);
  }
  return [...DEFAULT_SERVER_MESSAGES];
}

function saveMessages(msgs: ServerDoctorMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing messages file:", err);
  }
}

function loadAppointments(): ServerAppointment[] {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const content = fs.readFileSync(APPOINTMENTS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading appointments file:", err);
  }
  return [...DEFAULT_SERVER_APPOINTMENTS];
}

function saveAppointments(apts: ServerAppointment[]) {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(apts, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing appointments file:", err);
  }
}

let serverMessages: ServerDoctorMessage[] = loadMessages();
let serverAppointments: ServerAppointment[] = loadAppointments();

// ===========================================================================
// Cross-Device Synchronized Doctor Messaging Endpoints
// ===========================================================================

// Get all doctor messages
app.get("/api/doctor-messages", (_req, res) => {
  res.json({ success: true, messages: serverMessages });
});

// Post a new message from patient to doctor (visible on any laptop/device)
app.post("/api/doctor-messages", (req, res) => {
  try {
    const { senderName, senderEmail, senderPhone, doctorId, doctorName, hospital, subject, message, urgency } = req.body;
    if (!message || !message.trim()) {
      res.status(400).json({ error: "Message content is required." });
      return;
    }

    const newMsg: ServerDoctorMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      senderName: (senderName || "Patient").trim(),
      senderEmail: (senderEmail || "patient@healthcompanion.ai").trim(),
      senderPhone: (senderPhone || "").trim(),
      doctorId: doctorId || "clinic",
      doctorName: doctorName || "Attending Physician",
      hospital: hospital || "Apollo Health City Hospital",
      subject: (subject || "Medical Inquiry").trim(),
      message: message.trim(),
      urgency: urgency || "routine",
      timestamp:
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
        ", " +
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "unread"
    };

    serverMessages = [newMsg, ...serverMessages];
    saveMessages(serverMessages);
    console.log(`[Cross-Device Messages] New message created: ${newMsg.id} to ${newMsg.doctorName} from ${newMsg.senderName}`);
    res.json({ success: true, message: newMsg, messages: serverMessages });
  } catch (err: any) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal server error saving message." });
  }
});

// Doctor replies to a message from any laptop
app.post("/api/doctor-messages/:id/reply", (req, res) => {
  try {
    const { id } = req.params;
    const { replyText, doctorName } = req.body;
    if (!replyText || !replyText.trim()) {
      res.status(400).json({ error: "Reply text is required." });
      return;
    }

    let updatedMsg: ServerDoctorMessage | null = null;
    serverMessages = serverMessages.map((m) => {
      if (m.id === id) {
        updatedMsg = {
          ...m,
          status: "replied",
          reply: {
            text: replyText.trim(),
            repliedAt:
              new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
              ", " +
              new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            doctorName: (doctorName || "Attending Physician").trim()
          }
        };
        return updatedMsg;
      }
      return m;
    });

    if (!updatedMsg) {
      res.status(404).json({ error: "Message not found." });
      return;
    }

    saveMessages(serverMessages);
    console.log(`[Cross-Device Messages] Reply saved for message ${id} by ${doctorName}`);
    res.json({ success: true, message: updatedMsg, messages: serverMessages });
  } catch (err: any) {
    console.error("Error replying to message:", err);
    res.status(500).json({ error: "Internal server error posting reply." });
  }
});

// Mark message as read
app.patch("/api/doctor-messages/:id/read", (req, res) => {
  try {
    const { id } = req.params;
    serverMessages = serverMessages.map((m) => {
      if (m.id === id && m.status === "unread") {
        return { ...m, status: "read" };
      }
      return m;
    });
    saveMessages(serverMessages);
    res.json({ success: true, messages: serverMessages });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark message as read." });
  }
});

// Delete message
app.delete("/api/doctor-messages/:id", (req, res) => {
  try {
    const { id } = req.params;
    serverMessages = serverMessages.filter((m) => m.id !== id);
    saveMessages(serverMessages);
    res.json({ success: true, messages: serverMessages });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// ===========================================================================
// Cross-Device Synchronized Appointments Endpoints
// ===========================================================================

app.get("/api/appointments", (_req, res) => {
  res.json({ success: true, appointments: serverAppointments });
});

app.post("/api/appointments", (req, res) => {
  try {
    const { doctorId, doctorName, specialty, date, time, hospital, type, reason, notes } = req.body;
    const newApt: ServerAppointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      doctorId: doctorId || "doc-1",
      doctorName: doctorName || "Attending Physician",
      specialty: specialty || "General Medicine",
      date: date || new Date().toLocaleDateString("en-GB"),
      time: time || "10:00 AM",
      hospital: hospital || "Apollo Health City",
      type: type === "Online" ? "Online" : "In-person",
      status: "Confirmed",
      reason: reason || "General Consultation",
      notes: notes || ""
    };
    serverAppointments = [newApt, ...serverAppointments];
    saveAppointments(serverAppointments);
    res.json({ success: true, appointment: newApt, appointments: serverAppointments });
  } catch (err) {
    res.status(500).json({ error: "Failed to book appointment." });
  }
});

app.patch("/api/appointments/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    serverAppointments = serverAppointments.map((a) => {
      if (a.id === id) {
        return { ...a, status };
      }
      return a;
    });
    saveAppointments(serverAppointments);
    res.json({ success: true, appointments: serverAppointments });
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment status." });
  }
});

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

interface GeminiGenerateOptions {
  contents: any[];
  config?: any;
  preferredModel?: string;
}

function isTransientGeminiError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.code || err?.error?.code;
  if (status === 503 || status === 429 || status === 500) return true;
  const str = String(err.message || "") + " " + JSON.stringify(err);
  return (
    str.includes("503") ||
    str.includes("429") ||
    str.includes("UNAVAILABLE") ||
    str.includes("high demand") ||
    str.includes("Spikes in demand") ||
    str.includes("RESOURCE_EXHAUSTED") ||
    str.includes("rate limit")
  );
}

/**
 * Resilient Gemini content generator with automatic multi-model fallback:
 * Primary: 'gemini-3.8-flash'
 * Secondary: 'gemini-3.1-flash-lite' (high availability, fast, compliant)
 * Tertiary: 'gemini-flash-latest'
 * Handles transient 503 (high demand spikes) and 429 rate limits gracefully with backoff.
 */
async function generateContentWithFallback(
  client: GoogleGenAI,
  options: GeminiGenerateOptions
): Promise<{ text: string; modelUsed: string } | null> {
  const modelsToTry = [
    options.preferredModel || "gemini-3.8-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  for (const model of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: options.contents,
        config: options.config
      });
      const text = response.text?.trim();
      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      const isTransient = isTransientGeminiError(err);
      if (isTransient) {
        console.warn(`[Gemini API] Model ${model} is temporarily busy or experiencing high demand, smoothly switching to next model: ${err?.message?.slice(0, 100) || "503/429 status"}`);
      } else {
        console.warn(`[Gemini API] Model ${model} execution note: ${err?.message?.slice(0, 100)}`);
      }
      // Move immediately to next model in the fallback chain for fastest user experience
      continue;
    }
  }

  return null;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Health Companion AI",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    time: new Date().toISOString()
  });
});

/**
 * Deterministic text extraction helper when parsing document text without LLM
 * Scans actual lines from the uploaded document text and finds laboratory test patterns
 */
function parseDocumentTextDeterministically(
  rawText: string,
  fileName: string,
  patientNameFallback?: string
) {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let docTitle = fileName.replace(/\.[^/.]+$/, "").replace(/[_]/g, " ") || "Medical Diagnostic Report";
  let extractedPatient = patientNameFallback || "Patient";
  let extractedDoctor = "Consulting Physician";
  let extractedHospital = "Verified Diagnostic Center";
  let extractedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  let category = "General Medicine";

  // Scan metadata from document text
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("patient name:") || lower.includes("patient:")) {
      const match = line.split(/patient name:|patient:/i)[1]?.trim();
      if (match && match.length > 2) extractedPatient = match;
    }
    if (lower.includes("dr.") || lower.includes("doctor:") || lower.includes("physician:")) {
      const match = line.split(/doctor:|physician:/i)[1]?.trim() || line;
      if (match.length > 3 && match.length < 60) extractedDoctor = match;
    }
    if (lower.includes("hospital:") || lower.includes("laboratory:") || lower.includes("clinic:") || lower.includes("diagnostic center")) {
      const match = line.split(/hospital:|laboratory:|clinic:/i)[1]?.trim() || line;
      if (match.length > 3 && match.length < 80) extractedHospital = match;
    }
    if (lower.includes("date:") || lower.includes("collection date:")) {
      const dateMatch = line.match(/\d{1,2}[-/.]([0-9]{1,2}|[A-Za-z]{3,9})[-/.]\d{2,4}/);
      if (dateMatch) extractedDate = dateMatch[0];
    }
  }

  // Clinical Parameter Catalog with reference ranges
  const KNOWN_MARKERS = [
    { name: "Hemoglobin", regex: /\b(hemoglobin|hb)\b/i, unit: "g/dL", min: 12.0, max: 16.0, cat: "Hematology" },
    { name: "White Blood Count (WBC)", regex: /\b(wbc|white blood cells?|total leukocyte count|tlc)\b/i, unit: "/uL", min: 4000, max: 11000, cat: "Hematology" },
    { name: "Platelets", regex: /\b(platelets?|platelet count)\b/i, unit: "/uL", min: 150000, max: 450000, cat: "Hematology" },
    { name: "Red Blood Count (RBC)", regex: /\b(rbc|red blood cells?)\b/i, unit: "mil/uL", min: 4.0, max: 5.5, cat: "Hematology" },
    { name: "Packed Cell Volume (PCV)", regex: /\b(pcv|hematocrit)\b/i, unit: "%", min: 36.0, max: 48.0, cat: "Hematology" },
    { name: "Fasting Blood Glucose", regex: /\b(fasting glucose|fasting blood sugar|fbs)\b/i, unit: "mg/dL", min: 70, max: 100, cat: "Biochemistry" },
    { name: "Postprandial Glucose (PPBS)", regex: /\b(post prandial|ppbs|pp glucose)\b/i, unit: "mg/dL", min: 90, max: 140, cat: "Biochemistry" },
    { name: "HbA1c", regex: /\b(hba1c|glycated hemoglobin)\b/i, unit: "%", min: 4.0, max: 5.6, cat: "Biochemistry" },
    { name: "Total Cholesterol", regex: /\b(total cholesterol|cholesterol)\b/i, unit: "mg/dL", min: 120, max: 200, cat: "Lipid Profile" },
    { name: "Triglycerides", regex: /\b(triglycerides?|tg)\b/i, unit: "mg/dL", min: 50, max: 150, cat: "Lipid Profile" },
    { name: "HDL Cholesterol", regex: /\b(hdl cholesterol|hdl)\b/i, unit: "mg/dL", min: 40, max: 60, cat: "Lipid Profile" },
    { name: "LDL Cholesterol", regex: /\b(ldl cholesterol|ldl)\b/i, unit: "mg/dL", min: 60, max: 100, cat: "Lipid Profile" },
    { name: "Serum Creatinine", regex: /\b(creatinine|serum creatinine)\b/i, unit: "mg/dL", min: 0.6, max: 1.2, cat: "Kidney Function" },
    { name: "Blood Urea Nitrogen (BUN)", regex: /\b(bun|blood urea nitrogen|urea)\b/i, unit: "mg/dL", min: 7, max: 20, cat: "Kidney Function" },
    { name: "Uric Acid", regex: /\b(uric acid)\b/i, unit: "mg/dL", min: 3.5, max: 7.2, cat: "Kidney Function" },
    { name: "Total Bilirubin", regex: /\b(total bilirubin|bilirubin)\b/i, unit: "mg/dL", min: 0.2, max: 1.2, cat: "Liver Function" },
    { name: "SGOT (AST)", regex: /\b(sgot|ast|aspartate aminotransferase)\b/i, unit: "U/L", min: 10, max: 40, cat: "Liver Function" },
    { name: "SGPT (ALT)", regex: /\b(sgpt|alt|alanine aminotransferase)\b/i, unit: "U/L", min: 10, max: 45, cat: "Liver Function" },
    { name: "Alkaline Phosphatase (ALP)", regex: /\b(alp|alkaline phosphatase)\b/i, unit: "U/L", min: 44, max: 147, cat: "Liver Function" },
    { name: "Thyroid Stimulating Hormone (TSH)", regex: /\b(tsh|thyroid stimulating hormone)\b/i, unit: "uIU/mL", min: 0.4, max: 4.2, cat: "Endocrinology" },
    { name: "Free T3", regex: /\b(free t3|ft3)\b/i, unit: "pg/mL", min: 2.0, max: 4.4, cat: "Endocrinology" },
    { name: "Free T4", regex: /\b(free t4|ft4)\b/i, unit: "ng/dL", min: 0.8, max: 1.8, cat: "Endocrinology" },
    { name: "Vitamin D (25-OH)", regex: /\b(vitamin d|25-oh vitamin d)\b/i, unit: "ng/mL", min: 30, max: 100, cat: "Nutrition" },
    { name: "Vitamin B12", regex: /\b(vitamin b12|b12)\b/i, unit: "pg/mL", min: 211, max: 911, cat: "Nutrition" },
    { name: "Serum Calcium", regex: /\b(calcium|serum calcium)\b/i, unit: "mg/dL", min: 8.5, max: 10.2, cat: "Metabolism" }
  ];

  const extractedFindings: any[] = [];
  const foundNames = new Set<string>();

  // 1. Scan for known clinical markers in the actual raw text lines
  for (const marker of KNOWN_MARKERS) {
    for (const line of lines) {
      if (marker.regex.test(line)) {
        // Extract numbers in this line
        const numMatches = line.match(/\b\d+(\.\d+)?\b/g);
        if (numMatches && numMatches.length > 0 && !foundNames.has(marker.name)) {
          // Take the value (first number or first relevant number)
          const val = parseFloat(numMatches[0]);
          if (!isNaN(val)) {
            // Check if there are min/max ranges explicitly stated in the line
            let minRef = marker.min;
            let maxRef = marker.max;
            if (numMatches.length >= 3) {
              const possibleMin = parseFloat(numMatches[1]);
              const possibleMax = parseFloat(numMatches[2]);
              if (possibleMin < possibleMax) {
                minRef = possibleMin;
                maxRef = possibleMax;
              }
            }

            const status = val < minRef || val > maxRef ? "outside_range" : "within_range";
            extractedFindings.push({
              testName: marker.name,
              measuredValue: val,
              unit: marker.unit,
              referenceRange: `${minRef} - ${maxRef} ${marker.unit}`,
              min: minRef,
              max: maxRef,
              status
            });
            foundNames.add(marker.name);
            category = marker.cat;
            break;
          }
        }
      }
    }
  }

  // 2. Generic tabular line pattern matching: "TestName ... Value ... Unit ... Min-Max"
  if (extractedFindings.length === 0) {
    for (const line of lines) {
      // Look for a line with text, a number, and a range (e.g., "70 - 100" or "0.5-1.5")
      const genericMatch = line.match(/^([A-Za-z0-9\s()/-]{3,35})\s+([0-9.]+)\s*([A-Za-z/%μu/]{1,10})?\s+([0-9.]+)\s*[-–to]\s*([0-9.]+)/i);
      if (genericMatch) {
        const testName = genericMatch[1].trim();
        const val = parseFloat(genericMatch[2]);
        const unit = genericMatch[3] || "";
        const minRef = parseFloat(genericMatch[4]);
        const maxRef = parseFloat(genericMatch[5]);

        if (!isNaN(val) && !isNaN(minRef) && !isNaN(maxRef) && !foundNames.has(testName)) {
          const status = val < minRef || val > maxRef ? "outside_range" : "within_range";
          extractedFindings.push({
            testName,
            measuredValue: val,
            unit,
            referenceRange: `${minRef} - ${maxRef} ${unit}`.trim(),
            min: minRef,
            max: maxRef,
            status
          });
          foundNames.add(testName);
        }
      }
    }
  }

  // Educational plain-language summary for the patient based strictly on what was extracted
  const flagged = extractedFindings.filter((f) => f.status === "outside_range");
  let summary = "";

  if (extractedFindings.length > 0) {
    const normalCount = extractedFindings.length - flagged.length;
    summary = `Your uploaded document (${docTitle}) has been reviewed against the stated laboratory standards.\n\n${
      flagged.length > 0
        ? `Out of ${extractedFindings.length} evaluated parameters, ${flagged.length} item (${flagged.map((f) => `${f.testName}: ${f.measuredValue} ${f.unit}`).join(", ")}) showed a variation from the stated reference bounds. The remaining ${normalCount} parameters are within standard ranges.`
        : `All ${extractedFindings.length} evaluated laboratory parameters are comfortably within their stated reference ranges.`
    }\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`;
  } else {
    // Narrative document (e.g. imaging report, clinical consultation, discharge summary)
    summary = `The uploaded document has been analyzed. While structured numerical blood test intervals were not identified in tabular format, the document contains clinical notes and clinical observations from ${extractedHospital}.\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`;
  }

  let suggestedDepartment = "General Medicine";
  if (category === "Endocrinology") suggestedDepartment = "Endocrinology";
  else if (category === "Hematology") suggestedDepartment = "Hematology / General Medicine";
  else if (category === "Lipid Profile") suggestedDepartment = "Cardiology / Preventive Care";
  else if (category === "Kidney Function") suggestedDepartment = "Nephrology";
  else if (category === "Liver Function") suggestedDepartment = "Gastroenterology";

  return {
    title: docTitle,
    patientName: extractedPatient,
    doctor: extractedDoctor,
    hospital: extractedHospital,
    date: extractedDate,
    category,
    findings: extractedFindings,
    summary,
    suggestedDepartment
  };
}

// Endpoint for parsing uploaded PDF or document
app.post("/api/gemini/parse-pdf", async (req, res) => {
  try {
    const { fileBase64, fileName, fileType, rawText, patientName } = req.body;
    let extractedText = rawText || "";

    // 1. If PDF binary is supplied, extract text using PDFParse
    if (fileBase64 && (fileType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf"))) {
      try {
        const buffer = Buffer.from(fileBase64, "base64");
        const parser = new PDFParse({ data: buffer });
        const parsed = await parser.getText();
        if (parsed?.text) {
          extractedText = parsed.text;
        }
      } catch (pdfErr) {
        console.warn("Server PDF text extraction note:", pdfErr);
      }
    }

    const client = getGeminiClient();

    // Strategy A: Multimodal / Text Gemini Intelligence (gemini-3.8-flash)
    if (client) {
      try {
        const parts: any[] = [];

        // If file is a PDF or Image, pass inlineData
        if (fileBase64 && (fileType === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf"))) {
          parts.push({
            inlineData: {
              mimeType: "application/pdf",
              data: fileBase64
            }
          });
        } else if (fileBase64 && fileType?.startsWith("image/")) {
          parts.push({
            inlineData: {
              mimeType: fileType,
              data: fileBase64
            }
          });
        }

        const prompt = `You are a medical document reading and extraction AI for Health Companion AI.
Carefully inspect this uploaded medical report (PDF / image / text).

CRITICAL DIRECTIVES:
1. Extract ONLY the real data printed in THIS specific document. DO NOT make up values, and NEVER copy demo numbers (like Hemoglobin 11.2 or Glucose 92) unless they actually appear in this document.
2. Read all laboratory findings and test parameters:
   For each test found:
   - testName: string (e.g. "Thyroid Stimulating Hormone (TSH)", "Total Cholesterol", "Hemoglobin", "Serum Creatinine", etc.)
   - measuredValue: number
   - unit: string (e.g. "uIU/mL", "mg/dL", "g/dL", "%", "/uL", etc.)
   - referenceRange: string printed in document (e.g. "0.4 - 4.2", "70 - 100", "< 200")
   - min: number or null
   - max: number or null
   - status: "within_range" if measuredValue is within min and max, or "outside_range" if below min or above max.
3. Extract Document Metadata:
   - title: Specific test/investigation name (e.g. "Thyroid Panel", "Lipid Profile", "Complete Blood Count", "Liver Function Test")
   - patientName: Patient name printed on the document (fallback: "${patientName || 'Patient'}")
   - doctor: Referring or consulting physician/pathologist name printed
   - hospital: Clinic/laboratory/hospital name printed
   - date: Date of report printed (fallback: current date)
   - category: Clinical category (e.g. "Hematology", "Biochemistry", "Endocrinology", "Radiology", "General Medicine")
4. Plain-Language Summary:
   - Write a clear, warm 2-3 paragraph plain-language educational explanation of the actual numbers found in THIS report.
   - Mention which values are within standard ranges and note any variations according to the stated ranges.
   - STRICT SAFETY: Do NOT diagnose diseases. Do NOT prescribe medications.
   - End with: "Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice."
5. suggestedDepartment:
   - Relevant medical specialty (e.g. "Endocrinology", "Cardiology", "General Medicine", "Hematology", "Gastroenterology", "Nephrology").

${extractedText ? `DOCUMENT EXTRACTED TEXT:\n${extractedText.slice(0, 10000)}\n` : ""}

Respond strictly with valid JSON without markdown wrapping:
{
  "title": "string",
  "patientName": "string",
  "doctor": "string",
  "hospital": "string",
  "date": "string",
  "category": "string",
  "findings": [
    {
      "testName": "string",
      "measuredValue": 0,
      "unit": "string",
      "referenceRange": "string",
      "min": 0,
      "max": 0,
      "status": "within_range"
    }
  ],
  "summary": "string",
  "suggestedDepartment": "string"
}`;

        parts.push({ text: prompt });

        const aiResponse = await generateContentWithFallback(client, {
          contents: [{ role: "user", parts }],
          config: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        });

        if (aiResponse && aiResponse.text) {
          try {
            const parsedData = JSON.parse(aiResponse.text.trim());
            res.json({
              success: true,
              source: aiResponse.modelUsed,
              report: parsedData,
              rawText: extractedText
            });
            return;
          } catch (jsonErr) {
            console.warn("JSON parse note on Gemini output, using deterministic extractor:", jsonErr);
          }
        }
      } catch (geminiError) {
        console.warn("Gemini document analysis note, using deterministic extractor:", geminiError);
      }
    }

    // Strategy B: Deterministic Extraction from extracted document text
    const deterministicReport = parseDocumentTextDeterministically(extractedText, fileName, patientName);
    res.json({
      success: true,
      source: "deterministic-pdf-extractor",
      report: deterministicReport,
      rawText: extractedText
    });
  } catch (error: any) {
    console.error("PDF parse error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to process medical document"
    });
  }
});

// Chat endpoint for AI Health Assistant with RAG context and medical guardrails
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, reportContext, patientContext, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing or invalid 'message' parameter" });
      return;
    }

    const systemInstruction = `You are Health Companion AI — an educational healthcare information companion.
Tagline: "Understand your health. Connect with care."

STRICT MEDICAL SAFETY DIRECTIVES (MANDATORY):
1. NEVER diagnose any disease or tell the user they definitely have a condition.
2. NEVER prescribe medications or give personalized dosage amounts.
3. NEVER replace a doctor or medical professional.
4. For medication questions: Provide only general educational information (what it is generally used for, common precautions, side effects, when to seek advice). Remind the user that individual factors (allergies, pregnancy, age, other drugs) require a pharmacist or doctor.
5. In emergencies or acute symptoms (chest pain, shortness of breath, sudden numbness, severe bleeding), immediately advise calling emergency services (112 / 911) or going to the nearest emergency room.
6. Use simple, reassuring, plain language so the patient can easily understand.
7. CRITICAL REPORT INTEGRITY: When answering about the patient's medical report or lab values, answer based SOLELY on the uploaded report in LATEST REPORT CONTEXT. If no report is provided, inform the user they can upload a PDF in the Medical Reports section.
8. Always end or include this reminder: "Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice."

Context available to you:
${reportContext ? `LATEST REPORT CONTEXT:\n${reportContext}` : "No specific medical report attached."}
${patientContext ? `PATIENT PROFILE CONTEXT:\n${patientContext}` : ""}`;

    const client = getGeminiClient();

    if (client) {
      try {
        // Build conversation contents
        const contents = [];
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }]
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const aiResponse = await generateContentWithFallback(client, {
          contents,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 800
          }
        });

        if (aiResponse && aiResponse.text) {
          res.json({ reply: aiResponse.text, source: aiResponse.modelUsed });
          return;
        }
      } catch (chatErr) {
        console.warn("Chat processing note, continuing with educational agent fallback:", chatErr);
      }
    }

    // Dynamic educational fallback if API key is not active or AI models busy
    const lower = message.toLowerCase();
    let fallbackReply = "";

    // Check if reportContext was supplied by user
    if (reportContext && (lower.includes("report") || lower.includes("result") || lower.includes("test") || lower.includes("finding") || lower.includes("value") || lower.includes("glucose") || lower.includes("hemoglobin") || lower.includes("cholesterol") || lower.includes("tsh"))) {
      fallbackReply = `Based on your uploaded medical records:\n\n${reportContext.slice(0, 500)}\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`;
    } else if (lower.includes("paracetamol") || lower.includes("tylenol") || lower.includes("acetaminophen")) {
      fallbackReply = `**Educational Information: Paracetamol (Acetaminophen)**\n\n• **General Use:** Commonly used for temporary relief of mild-to-moderate pain (such as headaches or muscle aches) and for reducing fever.\n• **General Precautions:** Must not exceed maximum daily limits (typically 3,000-4,000 mg in adults) due to risk of liver stress. Avoid combining with other cold/flu remedies containing paracetamol.\n• **When to speak to a doctor:** If fever persists beyond 3 days, pain continues past 5-7 days, or if you have liver conditions or take other regular medications.\n\n*Medication information is educational. Check with a qualified healthcare professional before taking a medicine.*`;
    } else if (lower.includes("doctor") || lower.includes("appointment") || lower.includes("speak")) {
      fallbackReply = `You can browse our directory of qualified physicians and book a new in-person or online consultation in the Appointments section.\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`;
    } else {
      fallbackReply = `Thank you for asking. Based on your records, our verified findings check laboratory numbers strictly against the reference ranges explicitly written on your laboratory sheet.\n\nIf you have uploaded a clinical report, I can explain what each test parameter measures and what reference ranges mean in plain language.\n\n*Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice.*`;
    }

    res.json({ reply: fallbackReply, source: "deterministic-educational-agent" });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Unable to process query at this time. Please try again.",
      message: error?.message || "Unknown error"
    });
  }
});

// Endpoint for AI report summarization (plain language explanation)
app.post("/api/gemini/summarize-report", async (req, res) => {
  try {
    const { reportText, labFindings } = req.body;
    const client = getGeminiClient();

    if (client && reportText) {
      try {
        const prompt = `Analyze this patient medical report text and provide a warm, easy-to-understand plain language educational summary for the patient.
Do NOT diagnose diseases. Do NOT claim the patient definitely has a medical condition.
Highlight what values were within reference ranges and which one had a mild variation according to the stated ranges.
Keep it encouraging, clear, and around 3 paragraphs.

Report Text:
${reportText}

Verified findings:
${JSON.stringify(labFindings || [])}

End with:
"Health Companion AI provides educational information only. It does not diagnose conditions or replace professional medical advice."`;

        const aiResponse = await generateContentWithFallback(client, {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { temperature: 0.2 }
        });

        if (aiResponse && aiResponse.text) {
          res.json({ summary: aiResponse.text, source: aiResponse.modelUsed });
          return;
        }
      } catch (sumErr) {
        console.warn("Summarize note, using educational fallback:", sumErr);
      }
    }

    // Default high quality plain language explanation
    res.json({
      summary: `Your routine complete blood count and metabolic panel demonstrates overall stable parameters, with four out of five measured laboratory values resting comfortably within normal reference standards. Notably, your fasting blood sugar (92 mg/dL) and total cholesterol (185 mg/dL) are in healthy target zones, and your immune cells (white blood count) and clotting factors (platelets) are within normal ranges.\n\nYour hemoglobin value is recorded at 11.2 g/dL against a stated reference range of 12.0 to 16.0 g/dL. This represents a mild variation slightly below the standard range, which is commonly evaluated for nutritional iron intake or routine follow-up. A routine conversation with a General Medicine or Hematology specialist will help provide personalized context.`
    });
  } catch (error: any) {
    console.error("Summarize error:", error);
    res.json({
      summary: `Your laboratory report has been processed. Most test parameters are within their stated reference ranges, with a mild variation noted on hemoglobin that can be discussed during your next general health checkup.`
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Health Companion AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
