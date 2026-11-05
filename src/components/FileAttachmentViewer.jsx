import React, { useState } from 'react';
import { FileText, Download, Eye, ExternalLink, Paperclip } from 'lucide-react';
import FilePreviewModal from './FilePreviewModal';

export default function FileAttachmentViewer({ attachments = [] }) {
  const [previewFile, setPreviewFile] = useState(null);

  if (!attachments || attachments.length === 0) return null;

  const getFileIcon = (fileName = '') => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-[10px]">PDF</div>;
    }
    if (['doc', 'docx'].includes(ext)) {
      return <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px]">DOC</div>;
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">XLS</div>;
    }
    return <div className="w-9 h-9 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center"><FileText className="w-4 h-4" /></div>;
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl space-y-3 shadow-sm my-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Paperclip className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Berkas & Modul Pelajaran ({attachments.length})</span>
          </h4>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Bisa Dibaca Langsung / Diunduh</span>
        </div>

        <div className="space-y-2.5">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition gap-3"
            >
              <div className="flex items-center gap-3 truncate">
                {getFileIcon(file.name)}
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {file.name || "Dokumen Modul"}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {file.size ? `${file.size} • ` : ''}{file.type || 'Dokumen Pelajaran'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Preview & Download */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {/* PREVIEW BUTTON */}
                <button
                  type="button"
                  onClick={() => setPreviewFile(file)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-emerald-900/20"
                  title="Baca / Pratinjau Dokumen di Aplikasi"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buka / Pratinjau</span>
                </button>

                {/* DOWNLOAD BUTTON */}
                <a
                  href={file.url}
                  download={file.name || "modul-odoa"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5"
                  title="Unduh Berkas ke Perangkat"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP DOCUMENT PREVIEW MODAL */}
      <FilePreviewModal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </>
  );
}
