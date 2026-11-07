import React from 'react';
import { ArrowRight, BookOpen, Award, Cloud, MessageCircle } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Hero */}
      <section className="px-4 py-16 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Belajar Islam yang Menenangkan Hati, Kapan Saja, Di Mana Saja.
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          SANAD ACADEMY — platform pembelajaran Islam online: tadabbur, sabar, ruqyah syar’iyyah, fikih.
          Audio/video, kuis interaktif, catatan pribadi, sertifikat kelulusan. Gratis, cukup daftar.
        </p>
        <button
          onClick={onEnter}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/20"
        >
          Daftar Sekarang — Gratis <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Interest */}
      <section className="px-4 py-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
        {[
          { icon: BookOpen, title: 'Materi Terstruktur', desc: 'Per bab & modul, mudah diikuti.' },
          { icon: Award, title: 'Kuis & Sertifikat', desc: 'Evaluasi + sertifikat digital.' },
          { icon: Cloud, title: 'Progres Cloud', desc: 'Lanjut belajar di HP/laptop.' },
          { icon: MessageCircle, title: 'Forum Tanya Ustadz', desc: 'Diskusi & bimbingan.' }
        ].map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex gap-3">
            <f.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Desire */}
      <section className="px-4 py-10 text-center max-w-2xl mx-auto">
        <p className="italic text-slate-600 dark:text-slate-300">
          “Tadabbur bab sabar sangat melegakan hati.” — Santri SANAD ACADEMY
        </p>
      </section>

      {/* Action */}
      <section className="px-4 py-12 text-center">
        <button
          onClick={onEnter}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/20"
        >
          Mulai Belajar Sekarang <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-slate-500 mt-3">
          Setelah daftar, tunggu verifikasi infaq oleh Ustadz, lalu langsung belajar.
        </p>
      </section>
    </div>
  );
}
