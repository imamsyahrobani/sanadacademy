import React, { useState, useEffect } from 'react';
import { SURAH_LIST } from '../data/quranSurahs';
import { fetchAyat } from '../utils/quranService';
import { BookOpen, Search, Check, Loader2, Sparkles } from 'lucide-react';

export default function QuranPicker({ onSelectAyat, onClose }) {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(2); // Default Al-Baqarah
  const [selectedAyatNumber, setSelectedAyatNumber] = useState(45); // Default Ayat 45
  const [searchSurah, setSearchSurah] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentSurah = SURAH_LIST.find(s => s.number === parseInt(selectedSurahNumber)) || SURAH_LIST[1];

  const filteredSurahs = SURAH_LIST.filter(s => 
    s.name.toLowerCase().includes(searchSurah.toLowerCase()) ||
    s.number.toString().includes(searchSurah) ||
    s.translation.toLowerCase().includes(searchSurah.toLowerCase())
  );

  // Auto fetch when surah or ayat changes
  const handleFetchAyat = async (sNum = selectedSurahNumber, aNum = selectedAyatNumber) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await fetchAyat(sNum, aNum);
      setPreviewData(result);
    } catch (err) {
      setErrorMsg("Gagal memuat teks ayat. Pastikan terhubung ke internet.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleFetchAyat(selectedSurahNumber, selectedAyatNumber);
  }, []);

  const handleApply = () => {
    if (previewData && onSelectAyat) {
      onSelectAyat({
        surahRef: previewData.surahRef,
        surahName: previewData.surahName,
        surahNumber: selectedSurahNumber,
        ayatNumber: selectedAyatNumber,
        arabic: previewData.arabic,
        translation: previewData.translation
      });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Pilih Surat & Ayat Al-Qur'an Otomatis
          </h4>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
          114 Surat Lengkap
        </span>
      </div>

      {/* Inputs: Surat and Ayat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Pilih Surat */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Pilih Surat ({SURAH_LIST.length} Surat):
          </label>
          <div className="flex gap-1.5">
            <select
              value={selectedSurahNumber}
              onChange={(e) => {
                const newSurahNum = parseInt(e.target.value);
                setSelectedSurahNumber(newSurahNum);
                setSelectedAyatNumber(1);
                handleFetchAyat(newSurahNum, 1);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-xs"
            >
              {SURAH_LIST.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.name} ({surah.arabic} - {surah.totalAyah} ayat)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pilih Nomor Ayat */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Ayat (1 - {currentSurah.totalAyah}):
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={currentSurah.totalAyah}
              value={selectedAyatNumber}
              onChange={(e) => {
                const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), currentSurah.totalAyah);
                setSelectedAyatNumber(val);
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-amber-700 dark:text-amber-300 font-bold focus:outline-none focus:border-emerald-500 text-center shadow-xs"
            />
            <button
              type="button"
              onClick={() => handleFetchAyat(selectedSurahNumber, selectedAyatNumber)}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-3 rounded-xl transition shrink-0 flex items-center justify-center shadow-xs"
              title="Muat Ulang Ayat"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Muat"}
            </button>
          </div>
        </div>

      </div>

      {/* Loading or Preview Card */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mengambil teks Al-Qur'an & terjemahan resmi Kemenag...</p>
        </div>
      ) : previewData ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-amber-800 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
              {previewData.surahRef}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {currentSurah.translation} • {currentSurah.arabic}
            </span>
          </div>

          {/* Teks Arab */}
          <div className="bg-[#FFFDF7] dark:bg-slate-950 p-4 rounded-xl border border-amber-300/70 dark:border-slate-800/80 text-right shadow-xs">
            <p className="text-xl sm:text-2xl leading-[2.3] font-serif text-slate-900 dark:text-slate-100 tracking-wide" dir="rtl">
              {previewData.arabic}
            </p>
          </div>

          {/* Terjemahan */}
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Terjemahan Kemenag:</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{previewData.translation}"
            </p>
          </div>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApply}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/30"
          >
            <Check className="w-4 h-4" />
            <span>Gunakan Ayat Ini ke Materi Pelajaran</span>
          </button>
        </div>
      ) : null}

    </div>
  );
}
