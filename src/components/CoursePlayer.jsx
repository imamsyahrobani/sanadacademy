import React, { useState } from 'react';
import MediaPlayer from './MediaPlayer';
import FileAttachmentViewer from './FileAttachmentViewer';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  HelpCircle, 
  FileText, 
  Save, 
  ArrowRight,
  Share2,
  Check,
  MessageSquare,
  Play
} from 'lucide-react';

export default function CoursePlayer({ 
  course, 
  completedLessons = [], 
  quizScores = {},
  onToggleCompleteLesson, 
  onOpenQuiz, 
  onOpenCertificate, 
  onBack,
  studentNotes = {},
  onSaveNote
}) {
  const allLessons = [];
  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      allLessons.push({ ...l, moduleId: m.id, moduleTitle: m.title });
    });
  });

  const [activeLessonId, setActiveLessonId] = useState(allLessons[0]?.id || null);
  const [collapsedModules, setCollapsedModules] = useState({});
  const [copied, setCopied] = useState(false);
  const [localNote, setLocalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);

  React.useEffect(() => {
    if (activeLesson) {
      setLocalNote(studentNotes[activeLesson.id] || '');
      setNoteSaved(false);
    }
  }, [activeLessonId, studentNotes]);

  const toggleModuleCollapse = (moduleId) => {
    setCollapsedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleCopyAyat = () => {
    if (!activeLesson) return;
    const textToCopy = `${activeLesson.surah}\n\n${activeLesson.arabic}\n\n"${activeLesson.translation}"\n\n— Sanad Academy: ${course.title}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveLocalNote = () => {
    if (!activeLesson) return;
    onSaveNote(activeLesson.id, localNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const isCurrentLessonCompleted = completedLessons.includes(activeLesson?.id);
  const totalLessonCount = allLessons.length;
  const completedCount = completedLessons.filter(id => allLessons.some(l => l.id === id)).length;
  const progressPercent = totalLessonCount > 0 ? Math.round((completedCount / totalLessonCount) * 100) : 0;
  const isCourseFinished = progressPercent === 100;

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentLessonIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!course || allLessons.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada materi pada kursus ini.</p>
        <button onClick={onBack} className="bg-slate-800 text-white text-xs px-4 py-2 rounded-xl">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4 pb-20">
      
      {/* Top Navbar */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalog Kursus</span>
        </button>

        <div className="text-right flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Progres Kursus</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}% Tuntas</span>
          </div>
          {isCourseFinished && (
            <button
              onClick={() => onOpenCertificate(course)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-md shadow-amber-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Sertifikat</span>
            </button>
          )}
        </div>
      </div>

      {/* Course Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Completion Banner if 100% */}
      {isCourseFinished && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 dark:from-amber-950/60 dark:via-slate-900 dark:to-emerald-950/60 border border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Selamat! Kursus Telah Berhasil Dituntaskan</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Anda berhak mengklaim sertifikat kelulusan resmi dari Sanad Academy.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenCertificate(course)}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Klaim Sertifikat Anda</span>
          </button>
        </div>
      )}

      {/* Main Grid: Content Area & Syllabus Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT / MAIN COLUMN: Active Lesson */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Lesson Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm dark:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                {activeLesson.moduleTitle}
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                Pelajaran {currentLessonIndex + 1} dari {allLessons.length}
              </span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {activeLesson.title}
              </h1>
              <button
                onClick={handleCopyAyat}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0"
                title="Salin Ayat"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <span className="inline-block text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-xl">
              {activeLesson.surah}
            </span>

            {/* Arabic Scripture Display (Mushaf Paper Style in Light Mode) */}
            {activeLesson.arabic && (
              <div className="bg-[#FFFDF7] dark:bg-slate-950/90 p-5 sm:p-7 rounded-2xl border border-amber-300/70 dark:border-slate-800 text-right shadow-sm my-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <p className="text-2xl sm:text-3xl lg:text-[32px] leading-[2.5] font-serif text-slate-900 dark:text-slate-100 tracking-wide" dir="rtl">
                  {activeLesson.arabic}
                </p>
              </div>
            )}

            {/* Translation */}
            {activeLesson.translation && (
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Terjemahan</h4>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{activeLesson.translation}"
                </p>
              </div>
            )}

            {/* Media Player (Video YouTube / Google Drive / Audio) */}
            <MediaPlayer
              mediaType={activeLesson.mediaType || (activeLesson.audioUrl ? 'audio' : 'none')}
              mediaUrl={activeLesson.mediaUrl || activeLesson.audioUrl}
              title={activeLesson.title}
            />
          </div>

          {/* Lesson Deep-Dive / Tadabbur Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 rounded-3xl space-y-2.5 shadow-sm">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Materi & Tadabbur Mendalam</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed sm:leading-loose whitespace-pre-line font-normal">
              {activeLesson.content}
            </p>
          </div>

          {/* File Attachments (PDF / Modul Bacaan / Lembar Kerja) */}
          {activeLesson.attachments && activeLesson.attachments.length > 0 && (
            <FileAttachmentViewer attachments={activeLesson.attachments} />
          )}

          {/* Action / Assignment Card */}
          {activeLesson.actionToday && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-2 shadow-sm">
              <h3 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Aksi & Penerapan Hari Ini</span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-950/90 dark:text-slate-300 leading-relaxed font-medium">
                {activeLesson.actionToday}
              </p>
            </div>
          )}

          {/* Student Personal Notes Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Catatan Belajar Pribadi (Siswa)</span>
              </h3>
              {noteSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> Tersimpan!
                </span>
              )}
            </div>
            <textarea
              rows="3"
              placeholder="Tuliskan refleksi, poin penting, atau pemahaman pribadimu di sini..."
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none transition"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveLocalNote}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Save className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>

          {/* Lesson Action Bar (Mark Completed & Prev / Next) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-3 shadow-sm">
            <button
              onClick={() => onToggleCompleteLesson(activeLesson.id)}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                isCurrentLessonCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCurrentLessonCompleted ? "✓ Pelajaran Ini Sudah Selesai (Batal)" : "Tandai Pelajaran Selesai"}</span>
            </button>

            <div className="flex justify-between items-center gap-2.5 pt-1">
              <button
                onClick={goToPrevLesson}
                disabled={currentLessonIndex === 0}
                className="flex-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={goToNextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="flex-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-800 dark:text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Syllabus Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Silabus & Modul
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {completedCount}/{totalLessonCount} Selesai
              </span>
            </div>

            <div className="space-y-3">
              {course.modules.map((module) => {
                const isCollapsed = collapsedModules[module.id];
                const quizScore = quizScores[module.quiz?.id];
                const isQuizPassed = quizScore !== undefined && quizScore >= (module.quiz?.minScore || 70);

                return (
                  <div key={module.id} className="border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/40">
                    
                    {/* Module Header Accordion */}
                    <button
                      onClick={() => toggleModuleCollapse(module.id)}
                      className="w-full text-left p-3 bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-850 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition"
                    >
                      <span className="truncate pr-2">{module.title}</span>
                      {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>

                    {/* Lessons in Module */}
                    {!isCollapsed && (
                      <div className="p-2 space-y-1">
                        {module.lessons.map((lesson) => {
                          const isDone = completedLessons.includes(lesson.id);
                          const isActive = lesson.id === activeLessonId;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                                isActive 
                                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40 shadow-xs' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                {isDone ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}

                        {/* Module Quiz Button if available */}
                        {module.quiz && (
                          <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-850">
                            <button
                              onClick={() => onOpenQuiz(module.quiz, module.title)}
                              className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition border ${
                                isQuizPassed 
                                  ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500/40 dark:text-amber-300' 
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <HelpCircle className={`w-3.5 h-3.5 ${isQuizPassed ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                                <span className="truncate">{module.quiz.title}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                isQuizPassed 
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold' 
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {quizScore !== undefined ? `${quizScore} Poin` : 'Mulai Kuis'}
                              </span>
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
