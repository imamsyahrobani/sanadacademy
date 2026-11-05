import React from 'react';
import { GraduationCap, ShieldCheck, UserCheck, BookOpen, Sun, Moon } from 'lucide-react';

export default function Header({ 
  currentUser,
  isAdminMode, 
  onToggleAdminMode, 
  onNavigateHome,
  onOpenQuranLookup,
  onOpenProfile,
  theme,
  onToggleTheme
}) {
  const isDark = theme === 'dark';

  return (
    <header className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 sticky top-0 z-40 flex justify-between items-center transition-colors shadow-sm dark:shadow-md">
      
      {/* Brand Logo & Name */}
      <button 
        onClick={onNavigateHome}
        className="flex items-center gap-2.5 text-left group"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-950/20 group-hover:scale-105 transition border border-amber-500/30 bg-white flex items-center justify-center p-0.5">
          <img src="/logo-sanad.jpg" alt="Sanad Academy" className="w-full h-full object-contain rounded-lg" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-black tracking-wide bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 dark:from-emerald-400 dark:via-teal-200 dark:to-amber-300 bg-clip-text text-transparent">
            SANAD ACADEMY
          </h1>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Platform Pembelajaran Islam Online</p>
        </div>
      </button>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        
        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl border transition flex items-center justify-center bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-amber-400 shadow-sm"
          title={isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Tombol Pilih & Baca Ayat Al-Qur'an (Hanya muncul saat Ustadz berada di Mode CMS Guru) */}
        {currentUser?.role === 'admin' && isAdminMode && (
          <button
            onClick={onOpenQuranLookup}
            className="text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
            title="Pilih Surat & Ayat Al-Qur'an (114 Surat)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pilih Ayat</span>
          </button>
        )}

        {/* CMS Guru Button (Khusus Admin / Pengajar) */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={onToggleAdminMode}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 border shadow-sm ${
              isAdminMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-amber-500/30 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-400'
            }`}
          >
            {isAdminMode ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mode Santri</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CMS Guru 🎙️</span>
              </>
            )}
          </button>
        )}

        {/* Member Profile Avatar Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 p-1 sm:px-2.5 sm:py-1 rounded-xl transition"
          title="Lihat Profil Saya"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
            {currentUser?.name || 'Member'}
          </span>
        </button>

      </div>

    </header>
  );
}
