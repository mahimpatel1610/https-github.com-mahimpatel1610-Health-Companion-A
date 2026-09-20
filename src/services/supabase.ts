import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthUser, UserRole, Doctor, MedicalReport, Appointment } from '../types';

// Check for Supabase environment credentials (standard Vite prefix)
const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  ''
).trim();

const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    SUPABASE_URL.startsWith('http') &&
    SUPABASE_ANON_KEY.length > 15 &&
    !SUPABASE_URL.includes('your-project')
  );
};

// Initialize Supabase Client when configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Database Types matching SQL schema
export interface ProfileRecord {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  specialty?: string;
  hospital?: string;
  bio?: string;
  availability?: string;
  created_at: string;
}

export interface ConversationRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
  updated_at: string;
  doctor_name?: string;
  doctor_specialty?: string;
  patient_name?: string;
  patient_email?: string;
  unread_count?: number;
}

export interface MessageRecord {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: UserRole;
  message: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
}

export interface MedicalReportRecord {
  id: string;
  patient_id: string;
  file_name: string;
  file_url?: string;
  summary: string;
  analysis?: any;
  created_at: string;
}

export interface SharedReportRecord {
  id: string;
  report_id: string;
  patient_id: string;
  doctor_id: string;
  shared_at: string;
  report?: MedicalReportRecord;
  patient_name?: string;
}

export interface AppointmentRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'Pending' | 'Accepted' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at: string;
  doctor_name?: string;
  patient_name?: string;
  hospital?: string;
  specialty?: string;
}

// -----------------------------------------------------------------------------
// 1. CLOUD AUTHENTICATION (Supabase Auth with Server Fallback)
// -----------------------------------------------------------------------------

export interface CloudSignUpParams {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  specialty?: string;
  hospital?: string;
  bio?: string;
  availability?: string;
}

export async function cloudSignUp(params: CloudSignUpParams): Promise<{
  user: AuthUser | null;
  error?: string;
}> {
  const normalizedEmail = params.email.trim().toLowerCase();

  // Mode A: Direct Supabase Cloud Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: params.password,
        options: {
          data: {
            role: params.role,
            full_name: params.fullName,
            phone: params.phone || '',
            specialty: params.specialty || '',
            hospital: params.hospital || ''
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Upsert into public.profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
          user_id: data.user.id,
          role: params.role,
          full_name: params.fullName,
          email: normalizedEmail,
          phone: params.phone || '',
          specialty: params.specialty || '',
          hospital: params.hospital || '',
          bio: params.bio || '',
          availability: params.availability || 'Monday - Friday, 9am - 5pm'
        });

        if (profileError) {
          console.warn('Profile table upsert notice:', profileError.message);
        }

        const authUser: AuthUser = {
          id: data.user.id,
          name: params.fullName,
          email: normalizedEmail,
          role: params.role,
          phone: params.phone,
          specialty: params.specialty,
          hospital: params.hospital
        };

        return { user: authUser };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Supabase authentication failed.' };
    }
  }

  // Mode B: Server-side Cloud Auth Fallback (multi-device synchronization)
  try {
    const res = await fetch('/api/cloud/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const result = await res.json();
    if (!res.ok) {
      return { user: null, error: result.error || 'Registration failed.' };
    }
    return { user: result.user };
  } catch (err: any) {
    return { user: null, error: err.message || 'Network connection failed.' };
  }
}

export async function cloudSignIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Mode A: Direct Supabase Cloud Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Fetch profile to get verified role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        const role = (profile?.role as UserRole) || (data.user.user_metadata?.role as UserRole) || 'patient';
        const name = profile?.full_name || data.user.user_metadata?.full_name || normalizedEmail.split('@')[0];

        const authUser: AuthUser = {
          id: data.user.id,
          name,
          email: normalizedEmail,
          role,
          phone: profile?.phone,
          specialty: profile?.specialty,
          hospital: profile?.hospital
        };

        return { user: authUser };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Supabase sign in failed.' };
    }
  }

  // Mode B: Server-side Cloud Auth Fallback
  try {
    const res = await fetch('/api/cloud/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password })
    });
    const result = await res.json();
    if (!res.ok) {
      return { user: null, error: result.error || 'Invalid email or password.' };
    }
    return { user: result.user };
  } catch (err: any) {
    return { user: null, error: err.message || 'Network connection failed.' };
  }
}

export async function cloudSignOut(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    }
  }
  try {
    await fetch('/api/cloud/auth/logout', { method: 'POST' });
  } catch {}
}

export async function cloudResetPassword(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: window.location.origin
      });
      if (error) {
        return { success: false, message: error.message };
      }
      return {
        success: true,
        message: 'Password reset link has been dispatched to your email address.'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to send reset link.' };
    }
  }

  try {
    const res = await fetch('/api/cloud/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail })
    });
    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || 'Password reset requested successfully.'
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Server unreachable.' };
  }
}

// -----------------------------------------------------------------------------
// 2. DOCTOR DIRECTORY & PROFILES
// -----------------------------------------------------------------------------

export async function cloudGetDoctors(): Promise<Doctor[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.user_id,
          name: p.full_name.startsWith('Dr.') ? p.full_name : `Dr. ${p.full_name}`,
          specialty: p.specialty || 'General Medicine',
          experienceYears: 12,
          hospital: p.hospital || 'Apollo Health City',
          languages: ['English', 'Hindi'],
          consultationTypes: ['In-person', 'Online'],
          availableDates: ['Today, 4:00 PM', 'Tomorrow, 10:00 AM'],
          rating: 4.9,
          isDemo: true,
          phone: p.phone || '+91 98765 43210',
          email: p.email
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch doctors notice:', err);
    }
  }

  // Fallback to server cloud API
  try {
    const res = await fetch('/api/cloud/doctors');
    if (res.ok) {
      const data = await res.json();
      if (data.doctors && data.doctors.length > 0) {
        return data.doctors;
      }
    }
  } catch {}

  return [];
}

// -----------------------------------------------------------------------------
// 3. ONLINE MESSAGING & REALTIME CONVERSATIONS
// -----------------------------------------------------------------------------

export async function cloudGetOrCreateConversation(
  patientId: string,
  doctorId: string
): Promise<string> {
  if (supabase) {
    try {
      // Find existing
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(patient_id.eq.${patientId},doctor_id.eq.${doctorId}),and(patient_id.eq.${doctorId},doctor_id.eq.${patientId})`)
        .maybeSingle();

      if (existing?.id) return existing.id;

      // Insert new
      const { data: inserted, error } = await supabase
        .from('conversations')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId
        })
        .select('id')
        .single();

      if (!error && inserted) return inserted.id;
    } catch (err) {
      console.warn('Supabase conversation lookup error:', err);
    }
  }

  // Server Fallback
  try {
    const res = await fetch('/api/cloud/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId })
    });
    const data = await res.json();
    return data.conversationId;
  } catch (err) {
    return `conv-${patientId}-${doctorId}`;
  }
}

export async function cloudGetConversations(
  userId: string,
  role: UserRole
): Promise<ConversationRecord[]> {
  if (supabase) {
    try {
      const field = role === 'doctor' ? 'doctor_id' : 'patient_id';
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          patient_id,
          doctor_id,
          created_at,
          updated_at
        `)
        .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getConversations notice:', err);
    }
  }

  try {
    const res = await fetch(`/api/cloud/conversations?userId=${encodeURIComponent(userId)}&role=${role}`);
    if (res.ok) {
      const json = await res.json();
      return json.conversations || [];
    }
  } catch {}

  return [];
}

export async function cloudGetMessages(conversationId: string): Promise<MessageRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase getMessages notice:', err);
    }
  }

  try {
    const res = await fetch(`/api/cloud/messages?conversationId=${encodeURIComponent(conversationId)}`);
    if (res.ok) {
      const json = await res.json();
      return json.messages || [];
    }
  } catch {}

  return [];
}

export async function cloudSendMessage(payload: {
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  message: string;
}): Promise<MessageRecord | null> {
  const newMsg: MessageRecord = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    conversation_id: payload.conversationId,
    sender_id: payload.senderId,
    sender_role: payload.senderRole,
    sender_name: payload.senderName,
    message: payload.message.trim(),
    read: false,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: payload.conversationId,
          sender_id: payload.senderId,
          sender_role: payload.senderRole,
          message: payload.message.trim()
        })
        .select()
        .single();

      if (!error && data) {
        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', payload.conversationId);

        return data;
      }
    } catch (err) {
      console.warn('Supabase insert message error:', err);
    }
  }

  // Server Fallback
  try {
    const res = await fetch('/api/cloud/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.message || newMsg;
    }
  } catch (err) {
    console.warn('Network send error:', err);
  }

  return newMsg;
}

export async function cloudMarkMessageRead(messageId: string): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('messages').update({ read: true }).eq('id', messageId);
    } catch {}
  }
  try {
    await fetch(`/api/cloud/messages/${encodeURIComponent(messageId)}/read`, { method: 'PATCH' });
  } catch {}
}

// Real-time subscription to conversation messages
export function cloudSubscribeToConversation(
  conversationId: string,
  onNewMessage: (msg: MessageRecord) => void
): () => void {
  if (supabase) {
    try {
      const channel = supabase
        .channel(`room:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            if (payload.new) {
              onNewMessage(payload.new as MessageRecord);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription note:', err);
    }
  }

  // Fallback Polling for cross-device updates
  const interval = setInterval(async () => {
    const msgs = await cloudGetMessages(conversationId);
    if (msgs.length > 0) {
      const latest = msgs[msgs.length - 1];
      onNewMessage(latest);
    }
  }, 2500);

  return () => clearInterval(interval);
}

// -----------------------------------------------------------------------------
// 4. MEDICAL REPORTS & SHARING WITH DOCTOR
// -----------------------------------------------------------------------------

export async function cloudSaveReport(
  patientId: string,
  report: MedicalReport
): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('medical_reports').upsert({
        id: report.id,
        patient_id: patientId,
        file_name: report.fileName,
        summary: report.summary,
        analysis: {
          findings: report.findings,
          suggestedDepartment: report.suggestedDepartment,
          category: report.category,
          hospital: report.hospital,
          date: report.date
        }
      });
    } catch (err) {
      console.warn('Supabase save report note:', err);
    }
  }

  try {
    await fetch('/api/cloud/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, report })
    });
  } catch {}
}

export async function cloudGetPatientReports(patientId: string): Promise<MedicalReport[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id,
          title: r.analysis?.title || r.file_name.replace(/\.[^/.]+$/, ''),
          date: r.analysis?.date || new Date(r.created_at).toISOString().split('T')[0],
          hospital: r.analysis?.hospital || 'Apollo Hospital',
          category: r.analysis?.category || 'Diagnostic Lab',
          rawText: '',
          summary: r.summary || '',
          findings: r.analysis?.findings || [],
          suggestedDepartment: r.analysis?.suggestedDepartment || {
            department: 'General Medicine',
            flaggedMarker: '',
            reason: 'Routine baseline laboratory parameters.',
            disclaimer: 'Educational information only.'
          },
          status: 'analyzed',
          fileName: r.file_name
        }));
      }
    } catch (err) {
      console.warn('Supabase get reports note:', err);
    }
  }

  try {
    const res = await fetch(`/api/cloud/reports?patientId=${encodeURIComponent(patientId)}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.reports) && json.reports.length > 0) {
        return json.reports;
      }
    }
  } catch {}

  return [];
}

export async function cloudShareReportWithDoctor(
  reportId: string,
  patientId: string,
  doctorId: string
): Promise<{ success: boolean; message: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from('shared_reports').insert({
        report_id: reportId,
        patient_id: patientId,
        doctor_id: doctorId
      });
      if (error) {
        if (error.code === '23505') {
          return { success: true, message: 'Report is already shared with this physician.' };
        }
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Medical report successfully shared with doctor.' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  try {
    const res = await fetch('/api/cloud/shared-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, patientId, doctorId })
    });
    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || 'Report shared with doctor.'
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function cloudGetSharedReportsForDoctor(
  doctorId: string
): Promise<SharedReportRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('shared_reports')
        .select(`
          id,
          report_id,
          patient_id,
          doctor_id,
          shared_at,
          report:medical_reports(*)
        `)
        .eq('doctor_id', doctorId);

      if (!error && data) {
        return data as any;
      }
    } catch (err) {
      console.warn('Supabase get shared reports note:', err);
    }
  }

  try {
    const res = await fetch(`/api/cloud/shared-reports?doctorId=${encodeURIComponent(doctorId)}`);
    if (res.ok) {
      const json = await res.json();
      return json.sharedReports || [];
    }
  } catch {}

  return [];
}

// -----------------------------------------------------------------------------
// 5. APPOINTMENTS
// -----------------------------------------------------------------------------

export async function cloudCreateAppointment(apt: Appointment, patientId: string): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('appointments').insert({
        id: apt.id,
        patient_id: patientId,
        doctor_id: apt.doctorId,
        appointment_date: apt.date,
        appointment_time: apt.time,
        status: apt.status || 'Pending',
        notes: apt.notes || apt.reason
      });
    } catch (err) {
      console.warn('Supabase create appointment note:', err);
    }
  }

  try {
    await fetch('/api/cloud/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment: apt, patientId })
    });
  } catch {}
}

export async function cloudGetAppointments(
  userId: string,
  role: UserRole
): Promise<Appointment[]> {
  if (supabase) {
    try {
      const field = role === 'doctor' ? 'doctor_id' : 'patient_id';
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq(field, userId)
        .order('appointment_date', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((a) => ({
          id: a.id,
          doctorId: a.doctor_id,
          doctorName: 'Attending Specialist',
          specialty: 'Clinical Medicine',
          date: a.appointment_date,
          time: a.appointment_time,
          hospital: 'Apollo Health City',
          type: 'In-person',
          status: a.status,
          reason: a.notes || 'Consultation follow-up'
        }));
      }
    } catch (err) {
      console.warn('Supabase get appointments note:', err);
    }
  }

  try {
    const res = await fetch(`/api/cloud/appointments?userId=${encodeURIComponent(userId)}&role=${role}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.appointments) && json.appointments.length > 0) {
        return json.appointments;
      }
    }
  } catch {}

  return [];
}

export async function cloudUpdateAppointmentStatus(
  appointmentId: string,
  status: 'Confirmed' | 'Accepted' | 'Completed' | 'Cancelled'
): Promise<void> {
  if (supabase) {
    try {
      await supabase.from('appointments').update({ status }).eq('id', appointmentId);
    } catch {}
  }
  try {
    await fetch(`/api/cloud/appointments/${encodeURIComponent(appointmentId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch {}
}
