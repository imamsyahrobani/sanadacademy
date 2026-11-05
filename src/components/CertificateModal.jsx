import React from 'react';
import { Award, CheckCircle, Download, Share2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CertificateModal({ course, studentName, onClose, onVerifyClick }) {
  if (!course) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Deterministic official serial number based on course & student
  const cleanStudent = (studentName || 'STN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
  const cleanCourse = (course.id || 'CRS').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
  const serialNumber = course.serialNumber || `SANAD-${cleanCourse}-${cleanStudent}-2026`;

  // Public verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(serialNumber)}`
    : `https://sanad.academy/?verify=${encodeURIComponent(serialNumber)}`;

  const handleShare = () => {
    const text = `Alhamdulillah! Saya telah menyelesaikan kursus "${course.title}" di Sanad Academy. 🎓✨\n\nVerifikasi keaslian sertifikat: ${verifyUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("Tautan verifikasi sertifikat berhasil disalin untuk dibagikan!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 w-full max-w-xl space-y-5 relative shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition z-10"
          title="Tutup Sertifikat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Printable Area */}
        <div id="certificate-print" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-400/50 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-inner">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 pointer-events-none" />

          {/* Brand Logo on Certificate */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-1 border-2 border-amber-400/60 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <img src="/logo-sanad.jpg" alt="Sanad Academy" className="w-full h-full object-contain rounded-xl" />
          </div>

          <p className="text-[10px] uppercase tracking-widest text-amber-400 font-extrabold">
            SANAD ACADEMY • SERTIFIKAT KELULUSAN
          </p>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-1">
            Certificate of Completion
          </h2>

          <p className="text-xs text-slate-400 mt-3">Diberikan secara terhormat kepada:</p>
          <div className="my-2 py-1 border-b border-amber-500/40 inline-block px-6">
            <span className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
              {studentName || "Sahabat Santri Sanad Academy"}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto mt-2">
            Telah menyelesaikan seluruh rangkaian silabus, materi tadabbur, dan asesmen evaluasi pemahaman dalam kursus:
          </p>

          <p className="text-sm sm:text-base font-extrabold text-emerald-400 mt-2 bg-emerald-950/40 py-1.5 px-3 rounded-xl border border-emerald-500/30 inline-block">
            {course.title}
          </p>

          {/* Bottom Verification Section with Real Scannable QR Code */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 px-2">
            
            {/* Instructor Signature Info */}
            <div className="text-left space-y-0.5">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Pengajar Pengampu</span>
              <div className="font-serif italic text-amber-300 text-sm font-semibold border-b border-amber-500/30 pb-0.5 inline-block">
                {course.instructor || "Ustadz Pembina"}
              </div>
              <span className="block text-[9px] text-slate-400">Dewan Asatidz Sanad Academy</span>
            </div>

            {/* Issued Date & Serial */}
            <div className="text-center sm:text-left space-y-1">
              <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Tanggal Kelulusan</span>
              <span className="font-semibold text-slate-200 block text-xs">{todayStr}</span>
              <span className="font-mono text-[9px] text-amber-400 tracking-wider block bg-slate-950 py-0.5 px-2 rounded border border-slate-800">
                {serialNumber}
              </span>
            </div>

            {/* Scannable QR Code */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onVerifyClick && onVerifyClick(serialNumber)}
                className="p-1.5 bg-white rounded-xl shadow-md hover:scale-105 transition group cursor-pointer border border-amber-400/50"
                title="Pindai dengan kamera HP untuk verifikasi keaslian (atau klik untuk cek)"
              >
                <QRCodeSVG
                  value={verifyUrl}
                  size={65}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#022c22"
                />
              </button>
              <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Scan Keaslian 🔍
              </span>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Bagikan Tautan Verifikasi</span>
          </button>
        </div>

      </div>
    </div>
  );
}
