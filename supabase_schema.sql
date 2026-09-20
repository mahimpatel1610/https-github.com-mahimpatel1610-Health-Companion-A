-- ==============================================================================
-- HEALTH COMPANION AI — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Run this entire script in your Supabase Project's SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, foreign keys, RLS security policies, triggers, and storage buckets.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE
-- Connected to Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  specialty TEXT,
  hospital TEXT,
  bio TEXT,
  availability TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CONVERSATIONS TABLE
-- Tracks direct doctor-patient communication threads
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(patient_id, doctor_id)
);

-- 4. MESSAGES TABLE
-- Individual messages inside conversations
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('patient', 'doctor')),
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. MEDICAL REPORTS TABLE
-- Stores persistent patient health reports and AI analysis
CREATE TABLE IF NOT EXISTS public.medical_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  summary TEXT,
  analysis JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. SHARED REPORTS TABLE
-- Explicit patient-to-doctor report authorization
CREATE TABLE IF NOT EXISTS public.shared_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.medical_reports(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(report_id, doctor_id)
);

-- 7. APPOINTMENTS TABLE
-- Online booking and visit management
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Confirmed', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR FAST QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_doctor ON public.conversations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient ON public.medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_shared_reports_doctor ON public.shared_reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone logged in can read doctor profiles (for the directory)
CREATE POLICY "Public read for doctor profiles"
  ON public.profiles FOR SELECT
  USING (role = 'doctor' OR auth.uid() = user_id);

-- Users can insert and update their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- CONVERSATIONS POLICIES
-- ------------------------------------------------------------------------------
-- Patients and Doctors can view conversations where they are a participant
CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Patients can create conversations with doctors
CREATE POLICY "Patients can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- ------------------------------------------------------------------------------
-- MESSAGES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view messages in conversations they are part of
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
    )
  );

-- Users can send messages in conversations they belong to
CREATE POLICY "Users can insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
    )
  );

-- Users can update message read status in their conversations
CREATE POLICY "Recipients can update message read status"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
    )
  );

-- ------------------------------------------------------------------------------
-- MEDICAL REPORTS POLICIES
-- ------------------------------------------------------------------------------
-- Patient can view, insert, and delete their own reports
CREATE POLICY "Patients can view own reports"
  ON public.medical_reports FOR SELECT
  USING (
    auth.uid() = patient_id OR
    EXISTS (
      SELECT 1 FROM public.shared_reports sr
      WHERE sr.report_id = medical_reports.id
      AND sr.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Patients can insert own reports"
  ON public.medical_reports FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can delete own reports"
  ON public.medical_reports FOR DELETE
  USING (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- SHARED REPORTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Patients can share reports"
  ON public.shared_reports FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can view shared report authorizations"
  ON public.shared_reports FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can revoke shared reports"
  ON public.shared_reports FOR DELETE
  USING (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- APPOINTMENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Participants can update appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable Supabase Realtime for instant messaging updates
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- ==============================================================================
-- STORAGE BUCKET FOR PDF REPORTS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Users can read/write their own reports folder
CREATE POLICY "Patients can upload their own reports"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view authorized report files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-reports' AND (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM public.shared_reports sr
        JOIN public.medical_reports mr ON mr.id = sr.report_id
        WHERE sr.doctor_id = auth.uid()
        AND mr.file_url LIKE '%' || name || '%'
      )
    )
  );
