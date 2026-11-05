import React from 'react';
import QuranPicker from './QuranPicker';
import { X } from 'lucide-react';

export default function QuranModal({ isOpen, onClose, onSelectAyat }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 w-full max-w-xl space-y-4 relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full bg-slate-100 dark:bg-slate-800 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <QuranPicker
          onSelectAyat={(data) => {
            if (onSelectAyat) onSelectAyat(data);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
