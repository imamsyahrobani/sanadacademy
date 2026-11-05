import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  GraduationCap, 
  TrendingUp,
  Save,
  Send
} from 'lucide-react';

export default function StudentReportModal({ 
  isOpen, 
  onClose, 
  student, 
  courses = [], 
  progress = { completedLessons: [], quizScores: {} },
  onSaveTeacherNote,
  teacherNote = ''
}) {
  const [noteText, setNoteText] = useState(teacherNote || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !student) return null;

  const completedList = progress.completedLessons || [];
  const scoresMap = progress.quizScores || {};

  // Compute total lessons & quiz statistics across all courses
  let totalLessonsCount = 0;
  let totalQuizzesList = [];

  courses.forEach(course => {
    (course.modules || []).forEach(module => {
      totalLessonsCount += (module.lessons || []).length;
      if (module.quiz) {
        totalQuizzesList.push({
          quizId: module.quiz.id,
          title: module.quiz.title || `Kuis ${module.title}`,
          courseTitle: course.title,
          moduleTitle: module.title,
          minScore: module.quiz.minScore || 70,
          score: scoresMap[module.quiz.id] !== undefined ? scoresMap[module.quiz.id] : null
        });
      }
    });
  });

  const completedCount = completedList.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  // Calculate average quiz score
  const takenQuizzes = totalQuizzesList.filter(q => q.score !== null);
  const avgScore = takenQuizzes.length > 0 
    ? Math.round(takenQuizzes.reduce((acc, q) => acc + q.score, 0) / takenQuizzes.length)
    : 0;

  const handleSaveNote = () => {
    if (onSaveTeacherNote) {
      onSaveTeacherNote(student.id, noteText);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  // WhatsApp share link formatted report
  const generateWaReport = () => {
    const waNumber = student.whatsapp ? student.whatsapp.replace(/\D/g, '') : '';
    const cleanWa = waNumber.startsWith('0') ? '62' + waNumber.slice(1) : waNumber;

    let quizSummary = totalQuizzesList.map(q => {
      const statusText = q.score === null 
        ? 'Belum dikerjakan' 
        : (q.score >= q.minScore ? `LULUS (${q.score})` : `REMEDI (${q.score})`);
      return `• ${q.moduleTitle}: ${statusText}`;
    }).join('\n');

    const message = encodeURIComponent(
      `*RAPOR BELAJAR SANTRI - SANAD ACADEMY*\n\n` +
      `Nama: ${student.name}\n` +
      `Status: ${student.status === 'active' ? 'Aktif' : 'Menunggu Infaq'}\n` +
      `Progres Materi: ${completedCount}/${totalLessonsCount} Pelajaran (${progressPercent}%)\n` +
      `Rata-Rata Nilai Kuis: ${avgScore}/100\n\n` +
      `*Hasil Evaluasi Kuis:*\n${quizSummary}\n\n` +
      (noteText ? `*Catatan Ustadz:*\n"${noteText}"\n\n` : '') +
      `_Barakallahu fiikum. Terus istiqomah menuntut ilmu bersama Sanad Academy._`
    );

    return `https://wa.me/${cleanWa}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
              {student.name?.charAt(0) || 'S'}
            </div>
            <div className="truncate">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                <span>Rapor Belajar: {student.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  student.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {student.status === 'active' ? 'Aktif' : 'Menunggu Infaq'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {student.email} {student.whatsapp ? `• ${student.whatsapp}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Top Stat Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tuntas Materi</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {completedCount} / {totalLessonsCount}
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Persentase</span>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {progressPercent}%
              </p>
              <span className="text-[10px] text-slate-400">Kurikulum Selesai</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Rata-Rata Kuis</span>
              <p className="text-base font-extrabold text-amber-500">
                {takenQuizzes.length > 0 ? `${avgScore} / 100` : '-'}
              </p>
              <span className="text-[10px] text-slate-400">{takenQuizzes.length} Kuis Diambil</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Kelulusan</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-1">
                {progressPercent === 100 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lulus Penuh
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Dalam Proses
                  </span>
                )}
              </p>
              <span className="text-[10px] text-slate-400">
                {progressPercent === 100 ? 'Sertifikat Terbit' : 'Belum Klaim'}
              </span>
            </div>
          </div>

          {/* TABEL HASIL & NILAI KUIS */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Award className="w-4 h-4" />
                Rekap Nilai Kuis Evaluasi Tiap Bab
              </span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                standar kelulusan (kkm): min. 70
              </span>
            </h4>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="p-3">Materi / Bab Kuis</th>
                    <th className="p-3 text-center">Standar KKM</th>
                    <th className="p-3 text-center">Nilai Santri</th>
                    <th className="p-3 text-right">Status Evaluasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {totalQuizzesList.map((q, idx) => {
                    const hasTaken = q.score !== null;
                    const isPassed = hasTaken && q.score >= q.minScore;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          <div>{q.title}</div>
                          <span className="text-[10px] text-slate-400 font-normal">{q.courseTitle}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-500">
                          {q.minScore}
                        </td>
                        <td className="p-3 text-center">
                          {hasTaken ? (
                            <span className={`font-mono font-black text-sm ${
                              isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                            }`}>
                              {q.score}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Belum ikut</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!hasTaken ? (
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ⏳ Belum Mengerjakan
                            </span>
                          ) : isPassed ? (
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>LULUS</span>
                            </span>
                          ) : (
                            <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              <span>REMEDI</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CATATAN PEMBINAAN & REKOMENDASI DARI USTADZ */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Catatan Bimbingan Ustadz untuk Santri Ini:
              </span>
              {isSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                </span>
              )}
            </div>

            <textarea
              rows="3"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Contoh: MasyaAllah pemahaman konsep sabar sangat baik. Terus pertahankan hafalan ayat dan perbanyak praktek jeda emosi..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNote}
                className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Catatan Guru</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 Rapor ini bisa dikirim langsung ke WhatsApp santri atau orang tua.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Send WhatsApp Report */}
            {student.whatsapp && (
              <a
                href={generateWaReport()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Kirim Rapor ke WhatsApp</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2 px-4 rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
