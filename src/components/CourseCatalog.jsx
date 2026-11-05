import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Play, 
  User, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function CourseCatalog({ 
  courses = [], 
  completedLessons = [], 
  quizScores = {},
  onSelectCourse, 
  onOpenCertificate 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = [
    'Semua', 
    'Al-Qur\'an & Tadabbur', 
    'Ruqyah Syar\'iyyah', 
    'Fiqih & Muamalah', 
    'Tafsir & Hadis', 
    'Tahsin'
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.instructor && c.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || 
                            c.category === selectedCategory ||
                            (selectedCategory === 'Al-Qur\'an & Tadabbur' && (c.category === 'Tadabbur' || c.category === 'Al-Qur\'an')) ||
                            (selectedCategory === 'Tafsir & Hadis' && (c.category === 'Tafsir' || c.category === 'Hadis'));
    return matchesSearch && matchesCategory;
  });

  // Calculate global learning stats
  const totalCompletedLessons = completedLessons.length;
  const totalPassedQuizzes = Object.values(quizScores).filter(s => s >= 70).length;

  return (
    <div className="w-full max-w-4xl space-y-6 pb-20">
      
      {/* Student Profile & Quick Learning Stats */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950 border border-emerald-600/30 dark:border-emerald-500/20 p-5 sm:p-6 rounded-3xl space-y-4 shadow-lg shadow-emerald-950/15 dark:shadow-xl text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Selamat Datang di Sanad Academy
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Platform Pembelajaran Islam & Kurikulum Bersanad
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 dark:text-slate-300 font-normal leading-relaxed">
              Tadabbur Al-Qur'an, Ruqyah Syar'iyyah, Fiqih, & Ilmu Keislaman dibimbing langsung oleh Asatidz terpercaya.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/15">
          <div className="bg-white/10 dark:bg-slate-950/50 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center shadow-sm">
            <span className="text-[10px] text-emerald-100 dark:text-slate-400 block font-semibold">Pelajaran Tuntas</span>
            <span className="text-base sm:text-lg font-black text-white dark:text-emerald-400">{totalCompletedLessons}</span>
          </div>
          <div className="bg-white/10 dark:bg-slate-950/50 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center shadow-sm">
            <span className="text-[10px] text-emerald-100 dark:text-slate-400 block font-semibold">Kuis Lulus</span>
            <span className="text-base sm:text-lg font-black text-amber-300 dark:text-amber-400">{totalPassedQuizzes}</span>
          </div>
          <div className="bg-white/10 dark:bg-slate-950/50 backdrop-blur-sm p-3 rounded-2xl border border-white/15 text-center shadow-sm">
            <span className="text-[10px] text-emerald-100 dark:text-slate-400 block font-semibold">Total Kursus</span>
            <span className="text-base sm:text-lg font-black text-white">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Cari tema kursus, surah, atau nama ustadz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-sm transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => {
          // Calculate course specific progress
          const courseLessonIds = [];
          course.modules.forEach(m => m.lessons.forEach(l => courseLessonIds.push(l.id)));
          const completedInCourse = completedLessons.filter(id => courseLessonIds.includes(id)).length;
          const progressPercent = courseLessonIds.length > 0 
            ? Math.round((completedInCourse / courseLessonIds.length) * 100) 
            : 0;
          const isCompleted = progressPercent === 100;

          return (
            <div 
              key={course.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-slate-700 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm dark:shadow-lg relative group"
            >
              <div className="space-y-3">
                
                {/* Header tags */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  {course.badge && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      {course.badge}
                    </span>
                  )}
                </div>

                {/* Course Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Instructor & Lesson count info */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.instructor || "Ustadz Pembina"}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.duration || `${courseLessonIds.length} Pelajaran`}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Progres Belajar</span>
                    <span className={isCompleted ? "text-amber-600 dark:text-amber-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{progressPercent > 0 ? "Lanjutkan Belajar" : "Mulai Belajar"}</span>
                </button>

                {isCompleted && (
                  <button
                    onClick={() => onOpenCertificate(course)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-md shadow-amber-500/20"
                    title="Buka Sertifikat Kelulusan"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Tidak ada kursus yang cocok</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Silakan coba kata kunci pencarian lain atau pilih kategori Semua.</p>
        </div>
      )}

    </div>
  );
}
