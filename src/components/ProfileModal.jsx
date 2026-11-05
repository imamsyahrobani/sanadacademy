import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, LogOut, X, Award, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react';

export default function ProfileModal({ 
  user, 
  completedCount = 0, 
  quizCount = 0, 
  courses = [], 
  completedLessons = [],
  onClose, 
  onLogout, 
  onUpdateName,
  onOpenCertificate,
  onOpenVerification
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  if (!user) return null;

  const handleSaveName = (e) => {
    e.preventDefault();
    if (editName.trim() && onUpdateName) {
      onUpdateName(editName.trim());
      setIsEditing(false);
    }
  };

  // Find completed courses (100% progress)
  const completedCoursesList = courses.filter(c => {
    const lessonIds = [];
    c.modules.forEach(m => m.lessons.forEach(l => lessonIds.push(l.id)));
    return lessonIds.length > 0 && lessonIds.every(id => completedLessons.includes(id));
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-sm space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg shadow-emerald-950/20">
            {user.name.charAt(0)}
          </div>
          
          {!isEditing ? (
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                user.role === 'admin' 
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40' 
                  : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
              }`}>
                {user.role === 'admin' ? 'Ustadz / Pengajar' : 'Santri Sanad Academy'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSaveName} className="space-y-2 pt-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl p-2 text-center focus:outline-none focus:border-emerald-500"
                required
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-2 py-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Pelajaran Tuntas</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Kuis Dikerjakan</span>
            <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">{quizCount}</span>
          </div>
        </div>

        {/* Details list */}
        <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-slate-400 shrink-0" />
            <span className="truncate font-medium">{user.email || '-'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
            <Phone className="w-4 h-4 text-emerald-600 dark:text-slate-400 shrink-0" />
            <span className="font-medium">{user.whatsapp || '-'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-slate-400 shrink-0" />
            <span className="font-medium">Bergabung sejak: {user.joinedDate || '2026'}</span>
          </div>
        </div>

        {/* Sertifikat Kelulusan Section */}
        <div className="bg-amber-50/80 dark:bg-slate-950/60 border border-amber-300/80 dark:border-amber-500/30 rounded-2xl p-4 space-y-2.5 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Sertifikat Kelulusan ({completedCoursesList.length})
            </span>
          </div>

          {completedCoursesList.length > 0 ? (
            <div className="space-y-1.5">
              {completedCoursesList.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    if (onOpenCertificate) onOpenCertificate(c);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-amber-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-amber-300 dark:border-amber-500/40 text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between transition shadow-xs"
                >
                  <span className="truncate pr-2">{c.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] text-amber-950/80 dark:text-slate-400 leading-relaxed">
                Tuntaskan 100% pelajaran pada salah satu kursus untuk membuka sertifikat resmi.
              </p>
              {courses.length > 0 && (
                <button
                  onClick={() => {
                    if (onOpenCertificate) onOpenCertificate(courses[0]);
                    onClose();
                  }}
                  className="text-[11px] text-amber-800 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 font-bold underline flex items-center gap-1 transition"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lihat Contoh Sertifikat Kursus</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              if (onOpenVerification) onOpenVerification();
              onClose();
            }}
            className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cek Keaslian Sertifikat 🔍</span>
          </button>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-xs"
            >
              Ubah Nama Tampilan
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:text-rose-300 dark:border-rose-500/30 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
