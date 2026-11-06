import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { initialCourses } from '../data/initialCourses';

/**
 * Mengambil daftar kursus (dari Supabase jika terhubung, atau LocalStorage sebagai cadangan)
 */
export async function getCourses() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (coursesError) throw coursesError;

      // Jika database Supabase masih kosong, kita inisialisasi dengan initialCourses
      if (!coursesData || coursesData.length === 0) {
        console.info("Supabase terhubung tapi masih kosong. Mengunggah data awal...");
        await seedInitialCoursesToSupabase(initialCourses);
        return initialCourses;
      }

      // Ambil modules & lessons
      const { data: modulesData } = await supabase.from('modules').select('*').order('order_index');
      const { data: lessonsData } = await supabase.from('lessons').select('*').order('order_index');
      const { data: quizzesData } = await supabase.from('quizzes').select('*');

      // Rakit kembali ke struktur hierarki
      const fullCourses = coursesData.map(c => {
        const cModules = (modulesData || [])
          .filter(m => m.course_id === c.id)
          .map(m => {
            const mLessons = (lessonsData || [])
              .filter(l => l.module_id === m.id)
              .map(l => ({
                id: l.id,
                title: l.title,
                surah: l.surah,
                arabic: l.arabic,
                translation: l.translation,
                content: l.content,
                actionToday: l.action_today,
                mediaType: l.media_type,
                mediaUrl: l.media_url,
                audioUrl: l.audio_url,
                attachments: l.attachments || []
              }));

            const mQuiz = (quizzesData || []).find(q => q.module_id === m.id);

            return {
              id: m.id,
              title: m.title,
              lessons: mLessons,
              quiz: mQuiz ? {
                id: mQuiz.id,
                title: mQuiz.title,
                minScore: mQuiz.min_score,
                questions: mQuiz.questions
              } : null
            };
          });

        return {
          id: c.id,
          title: c.title,
          category: c.category,
          level: c.level,
          instructor: c.instructor,
          description: c.description,
          badge: c.badge,
          totalMinutes: c.total_minutes,
          modules: cModules
        };
      });

      return fullCourses;
    } catch (err) {
      console.warn("Gagal mengambil kursus dari Supabase, beralih ke cache lokal:", err);
    }
  }

  // Fallback LocalStorage
  const saved = localStorage.getItem('odoa_lms_courses_v4');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return initialCourses;
}

/**
 * Menyimpan / menyinkronkan data awal ke Supabase
 */
export async function seedInitialCoursesToSupabase(courses) {
  if (!isSupabaseConfigured() || !supabase) return;

  try {
    for (const c of courses) {
      // 1. Insert course
      await supabase.from('courses').upsert({
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        instructor: c.instructor,
        description: c.description,
        badge: c.badge,
        total_minutes: c.totalMinutes || 60
      });

      // 2. Insert modules
      if (c.modules) {
        for (let mIdx = 0; mIdx < c.modules.length; mIdx++) {
          const m = c.modules[mIdx];
          await supabase.from('modules').upsert({
            id: m.id,
            course_id: c.id,
            title: m.title,
            order_index: mIdx
          });

          // 3. Insert lessons
          if (m.lessons) {
            for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
              const l = m.lessons[lIdx];
              await supabase.from('lessons').upsert({
                id: l.id,
                module_id: m.id,
                title: l.title,
                surah: l.surah,
                arabic: l.arabic,
                translation: l.translation,
                content: l.content,
                action_today: l.actionToday,
                media_type: l.mediaType || 'video',
                media_url: l.mediaUrl,
                audio_url: l.audioUrl,
                attachments: l.attachments || [],
                order_index: lIdx
              });
            }
          }

          // 4. Insert quiz
          if (m.quiz) {
            await supabase.from('quizzes').upsert({
              id: m.quiz.id,
              module_id: m.id,
              title: m.quiz.title,
              min_score: m.quiz.minScore || 70,
              questions: m.quiz.questions || []
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Gagal melakukan seeding Supabase:", err);
  }
}

/**
 * Simpan Progres Selesai Pelajaran
 */
export async function syncLessonProgress(userId, lessonId) {
  if (isSupabaseConfigured() && supabase && userId) {
    try {
      await supabase.from('user_progress').upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' });
    } catch (e) {
      console.warn("Gagal simpan progres ke cloud:", e);
    }
  }
}

/**
 * Ambil progres selesai pelajaran dari Supabase
 */
export async function getUserProgress(userId) {
  if (!isSupabaseConfigured() || !supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('lesson_id')
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(r => r.lesson_id);
  } catch (e) {
    console.warn('Gagal ambil progres dari cloud:', e);
    return [];
  }
}

export async function syncQuizSubmission(userId, quizId, score, passed) {
  if (isSupabaseConfigured() && supabase && userId) {
    try {
      await supabase.from('quiz_submissions').insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        passed,
        submitted_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Gagal simpan kuis ke cloud:", e);
    }
  }
}

/**
 * Simpan Sertifikat Kelulusan
 */
export async function syncCertificate(certData) {
  if (isSupabaseConfigured() && supabase && certData.userId) {
    try {
      await supabase.from('certificates').insert({
        user_id: certData.userId,
        course_id: certData.courseId,
        serial_number: certData.serialNumber,
        student_name: certData.studentName,
        course_title: certData.courseTitle,
        instructor_name: certData.instructorName,
        issued_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Gagal simpan sertifikat ke cloud:", e);
    }
  }
}
