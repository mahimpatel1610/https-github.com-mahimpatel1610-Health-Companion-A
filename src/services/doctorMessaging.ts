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

// In-memory cache for ultra-fast UI rendering
let cachedMessages: DoctorMessage[] | null = null;
let isPollingActive = false;

/**
 * Synchronous getter for current messages (from cache, localStorage, or defaults)
 */
export function getStoredDoctorMessages(): DoctorMessage[] {
  if (cachedMessages) {
    return cachedMessages;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cachedMessages = JSON.parse(raw);
      return cachedMessages!;
    }
  } catch (err) {
    console.warn('Failed to parse doctor messages from local cache:', err);
  }
  cachedMessages = INITIAL_DOCTOR_MESSAGES;
  return INITIAL_DOCTOR_MESSAGES;
}

/**
 * Save messages locally and notify listeners
 */
export function saveStoredDoctorMessages(messages: DoctorMessage[], notify = true): void {
  cachedMessages = messages;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (notify) {
      window.dispatchEvent(new Event('hc_messages_updated'));
    }
  } catch (err) {
    console.error('Failed to save doctor messages to local storage:', err);
  }
}

/**
 * Fetch the latest messages from the server backend.
 * This guarantees that messages sent from other laptops/devices appear immediately.
 */
export async function syncDoctorMessagesFromServer(): Promise<DoctorMessage[]> {
  try {
    const res = await fetch('/api/doctor-messages', {
      headers: { credentials: 'omit' }
    });
    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.messages)) {
      const serverMsgs: DoctorMessage[] = data.messages;
      const currentSerialized = JSON.stringify(getStoredDoctorMessages());
      const serverSerialized = JSON.stringify(serverMsgs);

      if (currentSerialized !== serverSerialized) {
        saveStoredDoctorMessages(serverMsgs, true);
      }
      return serverMsgs;
    }
  } catch (err) {
    // Silently fall back to cached messages if offline
    // console.warn('Background sync with server failed:', err);
  }
  return getStoredDoctorMessages();
}

/**
 * Start background real-time polling to sync messages across different laptops/devices
 */
export function initCrossDeviceMessageSync(): void {
  if (typeof window === 'undefined' || isPollingActive) return;
  isPollingActive = true;

  // Immediate initial sync
  syncDoctorMessagesFromServer();

  // Poll server every 2.5 seconds to detect messages sent from other laptops
  const intervalId = window.setInterval(() => {
    syncDoctorMessagesFromServer();
  }, 2500);

  // Sync immediately when window is refocused or visible
  const handleVisibilityOrFocus = () => {
    if (document.visibilityState === 'visible') {
      syncDoctorMessagesFromServer();
    }
  };

  window.addEventListener('focus', handleVisibilityOrFocus);
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);

  // Cleanup on page unload (optional)
  window.addEventListener('beforeunload', () => {
    window.clearInterval(intervalId);
  });
}

// Auto-initialize when running in browser
if (typeof window !== 'undefined') {
  initCrossDeviceMessageSync();
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

/**
 * Send a message to a doctor.
 * Saves immediately to local state and posts to the central server so other laptops see it.
 */
export function sendDoctorMessage(payload: SendMessagePayload): DoctorMessage {
  const current = getStoredDoctorMessages();
  const newMsg: DoctorMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    senderName: payload.senderName.trim() || 'Patient',
    senderEmail: payload.senderEmail.trim(),
    senderPhone: payload.senderPhone?.trim() || '',
    doctorId: payload.doctorId,
    doctorName: payload.doctorName,
    hospital: payload.hospital || 'Apollo Health City Hospital',
    subject: payload.subject.trim() || 'General Inquiry',
    message: payload.message.trim(),
    urgency: payload.urgency || 'routine',
    timestamp:
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) +
      ', ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'unread'
  };

  // 1. Optimistic local update so sender sees it immediately
  const updated = [newMsg, ...current];
  saveStoredDoctorMessages(updated, true);

  // 2. Persist to server for cross-laptop visibility
  fetch('/api/doctor-messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && Array.isArray(data.messages)) {
        saveStoredDoctorMessages(data.messages, true);
      }
    })
    .catch((err) => {
      console.warn('Network send to /api/doctor-messages delayed:', err);
    });

  return newMsg;
}

/**
 * Doctor replies to a message.
 * Updates local state and propagates reply to server so patient on any laptop sees it.
 */
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
          repliedAt:
            new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) +
            ', ' +
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          doctorName: doctorName.trim() || 'Attending Physician'
        }
      };
      return updatedMsg;
    }
    return m;
  });

  if (updatedMsg) {
    // 1. Optimistic local save
    saveStoredDoctorMessages(next, true);

    // 2. Transmit to server so patient laptop receives the reply
    fetch(`/api/doctor-messages/${messageId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText, doctorName })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.messages)) {
          saveStoredDoctorMessages(data.messages, true);
        }
      })
      .catch((err) => {
        console.warn('Network reply to /api/doctor-messages/:id/reply delayed:', err);
      });
  }

  return updatedMsg;
}

/**
 * Mark message as read
 */
export function markDoctorMessageAsRead(messageId: string): void {
  const current = getStoredDoctorMessages();
  const next = current.map((m) => {
    if (m.id === messageId && m.status === 'unread') {
      return { ...m, status: 'read' as const };
    }
    return m;
  });
  saveStoredDoctorMessages(next, true);

  fetch(`/api/doctor-messages/${messageId}/read`, {
    method: 'PATCH'
  }).catch(() => {});
}

/**
 * Delete a doctor message
 */
export function deleteDoctorMessage(messageId: string): void {
  const current = getStoredDoctorMessages();
  const next = current.filter((m) => m.id !== messageId);
  saveStoredDoctorMessages(next, true);

  fetch(`/api/doctor-messages/${messageId}`, {
    method: 'DELETE'
  }).catch(() => {});
}

