import { DoctorMessage } from '../types';

const STORAGE_KEY = 'hc_doctor_messages';

export const INITIAL_DOCTOR_MESSAGES: DoctorMessage[] = [
  {
    id: 'msg-seed-1',
    senderName: 'Rahul Sharma',
    senderEmail: 'rahul.sharma@healthcompanion.ai',
    senderPhone: '+91 98765 43210',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ananya Sharma',
    hospital: 'Apollo Health City, Bengaluru',
    subject: 'Question regarding slight hemoglobin variation in CBC report',
    message: 'Hello Dr. Ananya, my recent complete blood count showed hemoglobin at 11.2 g/dL. I wanted to ask if I should start any dietary iron supplements or if I should schedule an in-person follow up visit?',
    urgency: 'question',
    timestamp: '19 Sep 2026, 11:30 AM',
    status: 'replied',
    reply: {
      text: 'Hello Rahul, 11.2 g/dL indicates mild variation. Increasing dietary iron (spinach, lentils, beets) and repeating a CBC in 6 to 8 weeks is usually the initial step. If you experience fatigue, please book a routine consultation.',
      repliedAt: '19 Sep 2026, 02:15 PM',
      doctorName: 'Dr. Ananya Sharma'
    }
  },
  {
    id: 'msg-seed-2',
    senderName: 'Priya Mehra',
    senderEmail: 'priya.mehra@example.com',
    senderPhone: '+91 98111 22334',
    doctorId: 'clinic',
    doctorName: 'All Attending Doctors & Clinic Coordinator',
    hospital: 'Apollo Health City, Bengaluru',
    subject: 'Request for teleconsultation timing confirmation',
    message: 'Hello, I booked a digital teleconsultation for this coming Tuesday. Could the clinic team confirm if the secure video link will be sent via SMS or through this portal?',
    urgency: 'routine',
    timestamp: '19 Sep 2026, 03:45 PM',
    status: 'unread'
  }
];

export function getStoredDoctorMessages(): DoctorMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCTOR_MESSAGES));
      return INITIAL_DOCTOR_MESSAGES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse doctor messages from storage:', err);
    return INITIAL_DOCTOR_MESSAGES;
  }
}

export function saveStoredDoctorMessages(messages: DoctorMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event('hc_messages_updated'));
  } catch (err) {
    console.error('Failed to save doctor messages:', err);
  }
}

export interface SendMessagePayload {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  doctorId: string;
  doctorName: string;
  hospital?: string;
  subject: string;
  message: string;
  urgency?: 'routine' | 'urgent' | 'question';
}

export function sendDoctorMessage(payload: SendMessagePayload): DoctorMessage {
  const current = getStoredDoctorMessages();
  const newMsg: DoctorMessage = {
    id: `msg-${Date.now()}`,
    senderName: payload.senderName.trim() || 'Patient',
    senderEmail: payload.senderEmail.trim(),
    senderPhone: payload.senderPhone?.trim() || '',
    doctorId: payload.doctorId,
    doctorName: payload.doctorName,
    hospital: payload.hospital || 'Apollo Health City',
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    urgency: payload.urgency || 'routine',
    timestamp: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'unread'
  };

  const updated = [newMsg, ...current];
  saveStoredDoctorMessages(updated);
  return newMsg;
}

export function replyToDoctorMessage(
  messageId: string,
  replyText: string,
  doctorName: string
): DoctorMessage | null {
  const current = getStoredDoctorMessages();
  let updatedMsg: DoctorMessage | null = null;

  const next = current.map((m) => {
    if (m.id === messageId) {
      updatedMsg = {
        ...m,
        status: 'replied' as const,
        reply: {
          text: replyText.trim(),
          repliedAt: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          doctorName: doctorName.trim() || 'Attending Physician'
        }
      };
      return updatedMsg;
    }
    return m;
  });

  if (updatedMsg) {
    saveStoredDoctorMessages(next);
  }
  return updatedMsg;
}

export function markDoctorMessageAsRead(messageId: string): void {
  const current = getStoredDoctorMessages();
  const next = current.map((m) => {
    if (m.id === messageId && m.status === 'unread') {
      return { ...m, status: 'read' as const };
    }
    return m;
  });
  saveStoredDoctorMessages(next);
}

export function deleteDoctorMessage(messageId: string): void {
  const current = getStoredDoctorMessages();
  const next = current.filter((m) => m.id !== messageId);
  saveStoredDoctorMessages(next);
}
