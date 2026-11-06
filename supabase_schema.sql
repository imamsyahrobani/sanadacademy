-- ========================================================
-- SKEMA DATABASE ODOA ACADEMY (SUPABASE POSTGRESQL)
-- Salin dan jalankan skrip ini di SQL Editor Supabase Anda.
-- ========================================================

-- 1. Tabel Profil Pengguna (Santri & Ustadz/Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'santri' CHECK (role IN ('santri', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Kursus (Courses)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  instructor TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  total_minutes INT DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Modul / Bab (Modules)
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Pelajaran / Ayat (Lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  surah TEXT NOT NULL,
  arabic TEXT,
  translation TEXT,
  content TEXT,
  action_today TEXT,
  media_type TEXT DEFAULT 'video' CHECK (media_type IN ('video', 'audio', 'none')),
  media_url TEXT,
  audio_url TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Kuis & Evaluasi (Quizzes)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  min_score INT DEFAULT 70,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Progres Belajar Santri (Lesson Completions)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 7. Tabel Hasil Kuis Santri (Quiz Submissions)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INT NOT NULL,
  passed BOOLEAN NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Sertifikat Kelulusan (Certificates)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  serial_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Catatan Pribadi Santri (Notes)
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  note_content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ========================================================
-- 10. Forum Diskusi
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'santri',
  message TEXT NOT NULL,
  parent_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Discussions can be read by anyone" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert discussions" ON public.discussions FOR INSERT WITH CHECK (auth.uid() = user_id);
-- KEAMANAN: ROW LEVEL SECURITY (RLS)
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

-- Kebijakan Membaca Kursus & Materi: Terbuka untuk semua user yang login / terverifikasi
CREATE POLICY "Courses can be read by anyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Modules can be read by anyone" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Lessons can be read by anyone" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Quizzes can be read by anyone" ON public.quizzes FOR SELECT USING (true);

-- Kebijakan Progres Belajar: Santri hanya bisa membaca dan menulis data miliknya sendiri
CREATE POLICY "Users can manage own progress" ON public.user_progress 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own quiz scores" ON public.quiz_submissions 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notes" ON public.user_notes 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own certificates" ON public.certificates 
  FOR SELECT USING (auth.uid() = user_id);

-- Kebijakan Admin: Pengajar dengan role 'admin' memiliki akses penuh CRUD kursus
CREATE POLICY "Admin can insert courses" ON public.courses 
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update courses" ON public.courses 
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
