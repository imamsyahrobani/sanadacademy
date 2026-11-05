import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  MessageCircle, 
  RefreshCw, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

export default function PendingApprovalScreen({ 
  user, 
  onRefreshStatus, 
  onLogout,
  theme,
  onToggleTheme
}) {
  const isDark = theme === 'dark';

  // WhatsApp confirmation link
  const waAdminNumber = "6281198765432";
  const waMessage = encodeURIComponent(
    `Assalamu'alaikum Admin Sanad Academy,\n\nSaya telah mendaftar dengan data berikut:\n- Nama: ${user?.name}\n- Email: ${user?.email}\n- No. WA: ${user?.whatsapp || '-'}\n\nBerikut saya lampirkan bukti infaq pendaftaran program Sanad Academy. Mohon bantuannya untuk mengaktifkan akun saya. Jazakallahu khairan.`
  );
  const waUrl = `https://wa.me/${waAdminNumber}?text=${waMessage}`;

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 transition-colors font-sans selection:bg-emerald-500 selection:text-white`}>
      
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-400 shadow-sm hover:scale-105 transition"
          title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Icon & Status Badge */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 dark:from-amber-600 dark:to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Clock className="w-10 h-10 animate-pulse text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
            ⏳
          </div>
        </div>

        {/* Title & Greeting */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            Menunggu Verifikasi Infaq
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Ahlan wa Sahlan, {user?.name || 'Santri'}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Pendaftaran akun Anda telah tercatat. Akses masuk ke seluruh materi kelas dan evaluasi akan dibuka setelah konfirmasi infaq pendaftaran disetujui oleh Ustadz/Admin Sanad Academy.
          </p>
        </div>

        {/* User Data Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <span className="text-slate-500 dark:text-slate-400">Nama Santri:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <span className="text-slate-500 dark:text-slate-400">Email Akun:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
          </div>
          {user?.whatsapp && (
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <span className="text-slate-500 dark:text-slate-400">WhatsApp:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.whatsapp}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-slate-500 dark:text-slate-400">Status Akun:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Menunggu Persetujuan</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* WhatsApp Direct Confirmation Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 group"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
            <span>Kirim Bukti Infaq via WhatsApp</span>
          </a>

          {/* Refresh & Logout Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onRefreshStatus}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cek Status Akun</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </div>

        {/* Demo Helper Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 text-left">
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Petunjuk Pengujian Demo:</strong> Anda dapat keluar dan login sebagai Ustadz (<code>ustadz@sanad.academy</code> / <code>admin123</code>), lalu buka <strong>CMS Guru ➔ Data Santri & Aktivasi</strong> untuk mengaktifkan akun ini dengan 1 klik.
          </span>
        </div>

      </div>
    </div>
  );
}
