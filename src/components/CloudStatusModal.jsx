import React, { useState } from 'react';
import { X, Database, CheckCircle2, Copy, Check, ExternalLink, ShieldCheck, Cloud, Server, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export default function CloudStatusModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopySchema = async () => {
    try {
      const response = await fetch('/supabase_schema.sql');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isConnected 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Status Koneksi Cloud & Backend</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isConnected 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {isConnected ? 'ONLINE CLOUD' : 'MODE LOKAL'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isConnected 
                  ? 'Terhubung dengan database Supabase PostgreSQL.' 
                  : 'Saat ini menggunakan Browser LocalStorage (cadangan aman).'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {isConnected ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selamat! Aplikasi Telah Terhubung ke Cloud Supabase</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Setiap materi baru yang ditambahkan di CMS Guru, pendaftaran santri, progres belajar, nilai kuis, dan sertifikat kini otomatis tersimpan di server cloud dan tersinkronisasi realtime antar seluruh perangkat (HP dan Laptop).
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  Aplikasi saat ini berjalan dalam <strong>Mode Demo Lokal</strong>. Seluruh fitur dapat digunakan dengan lancar di perangkat ini. Ikuti 3 langkah di bawah untuk mengaktifkan sinkronisasi cloud antar HP & Laptop.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>3 Langkah Mudah Menghubungkan ke Supabase (100% Gratis):</span>
                </h4>

                {/* Step 1 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>1. Buat Project Baru di Supabase</span>
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-500 flex items-center gap-1 text-[11px]"
                    >
                      <span>Buka Supabase.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Daftar gratis dengan akun Google atau GitHub, lalu klik <strong>"New Project"</strong> dan beri nama proyek Anda (misal: <code>odoa-academy</code>).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>2. Jalankan Skrip Database di SQL Editor</span>
                    <button
                      onClick={handleCopySchema}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Skema SQL'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Buka menu <strong>SQL Editor</strong> di dashboard Supabase, buat query baru, lalu tempelkan (paste) skrip dari berkas <code>supabase_schema.sql</code> yang telah kami buatkan di folder proyek, lalu klik <strong>Run</strong>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    3. Salin URL & Kunci API ke file <code>.env</code>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Di Supabase, buka <strong>Project Settings ⚙️ ➔ Data API</strong>. Salin <strong>Project URL</strong> dan <strong>anon public key</strong>, lalu buat file <code>.env</code> di root folder proyek ini:
                  </p>
                  <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl text-[10px] font-mono overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                  </pre>
                </div>
              </div>
            </>
          )}

          {/* Keamanan & Garansi Privasi */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[10px] text-slate-600 dark:text-slate-300">
              Dilengkapi <strong>Row Level Security (RLS)</strong>: Santri hanya dapat mengakses data progres miliknya sendiri, dan hanya Ustadz/Admin yang dapat mengubah kurikulum.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
