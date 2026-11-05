import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Calendar, 
  User, 
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function VerifyCertificateModal({ 
  isOpen, 
  onClose, 
  verifySerial, 
  certificates = [],
  onOpenCertificate
}) {
  const [searchInput, setSearchInput] = useState(verifySerial || '');
  const [activeSerial, setActiveSerial] = useState(verifySerial || '');

  if (!isOpen) return null;

  // Search in certificates database
  const cleanSearch = activeSerial ? activeSerial.trim().toUpperCase() : '';
  const matchedCert = certificates.find(c => 
    c.serialNumber?.toUpperCase() === cleanSearch
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSerial(searchInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl border border-amber-500/30 bg-white p-0.5 flex items-center justify-center shadow-md">
              <img src="/logo-sanad.jpg" alt="Sanad Academy" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Verifikasi Keaslian Sertifikat
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Pusat Validasi Dokumen Digital Resmi Sanad Academy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          
          {/* Serial Number Search Bar */}
          <form onSubmit={handleSearch} className="space-y-1.5">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Masukkan Nomor Registrasi / Seri:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Contoh: SANAD-SBR-AHM-2026"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-amber-300 placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm shrink-0"
              >
                Cek Validasi
              </button>
            </div>
          </form>

          {/* VERIFICATION RESULT CARD */}
          {cleanSearch && (
            matchedCert ? (
              /* IF VALID */
              <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/40 rounded-3xl p-5 space-y-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    ✓ TERVERIFIKASI RESMI & ASLI
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Sertifikat Sah Terdaftar
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dokumen ini sah diterbitkan oleh <strong>Sanad Academy</strong> dan tercatat resmi dalam sistem pangkalan data kelulusan santri.
                  </p>
                </div>

                {/* Details Table */}
                <div className="bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <User className="w-3.5 h-3.5 text-emerald-600" /> Penerima Sertifikat:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {matchedCert.studentName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Kursus / Silabus:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs text-right max-w-[200px] truncate">
                      {matchedCert.courseTitle}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Tanggal Kelulusan:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      {matchedCert.issuedDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-500 text-[11px]">Pengajar Pengampu:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      {matchedCert.instructorName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-slate-500 text-[11px]">Nomor Seri Valid:</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {matchedCert.serialNumber}
                    </span>
                  </div>
                </div>

                {/* Optional open certificate preview button */}
                {onOpenCertificate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCertificate({ id: matchedCert.courseId, title: matchedCert.courseTitle, instructor: matchedCert.instructorName });
                    }}
                    className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Lihat Format Sertifikat Digital</span>
                  </button>
                )}
              </div>
            ) : (
              /* IF NOT FOUND / INVALID */
              <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500/30 rounded-3xl p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                    Sertifikat Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Nomor seri <code className="font-mono text-rose-600 font-bold">{cleanSearch}</code> tidak terdaftar dalam database sertifikat resmi Sanad Academy.
                  </p>
                </div>
                <p className="text-[10px] text-slate-400">
                  Pastikan Anda memindai kode QR dari lembar sertifikat asli atau tidak salah mengetik nomor seri.
                </p>
              </div>
            )
          )}

          {/* Quick Info Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Setiap sertifikat kelulusan Sanad Academy dilengkapi <strong>kode QR unik</strong> yang dapat dipindai secara langsung menggunakan kamera smartphone apa pun untuk membuktikan keasliannya kapan saja.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs py-2 px-4 rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
