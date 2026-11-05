import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Download, FileText, Maximize2, AlertCircle } from 'lucide-react';
import { extractGoogleDriveId } from '../utils/mediaParser';

export default function FilePreviewModal({ isOpen, onClose, file }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isOpen || !file) {
      setBlobUrl(null);
      setLoadError(false);
      return;
    }

    // Convert data: base64 PDF/image to Blob URL for smoother iframe rendering
    if (file.url && file.url.startsWith('data:')) {
      try {
        const arr = file.url.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.warn("Failed to convert dataURL to Blob URL:", err);
      }
    }
  }, [isOpen, file]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  const fileName = file.name || 'Dokumen Modul';
  const ext = fileName.split('.').pop().toLowerCase();
  const fileUrl = blobUrl || file.url || '';
  const gdriveId = extractGoogleDriveId(file.url);

  const isPdf = ext === 'pdf' || (file.type && file.type.toLowerCase().includes('pdf')) || (file.url && file.url.startsWith('data:application/pdf'));
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || (file.type && file.type.toLowerCase().includes('image')) || (file.url && file.url.startsWith('data:image'));
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);

  // Determine iframe preview source
  let previewSrc = null;
  if (gdriveId) {
    previewSrc = `https://drive.google.com/file/d/${gdriveId}/preview`;
  } else if (isPdf) {
    previewSrc = fileUrl;
  } else if (isOffice && file.url && file.url.startsWith('http')) {
    // Office web documents can be rendered via Google Docs Viewer
    previewSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {fileName}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="uppercase font-semibold tracking-wider text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                  {ext || 'BERKAS'}
                </span>
                <span>{file.size || 'Pratinjau Langsung'}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in new tab */}
            {file.url && (
              <a
                href={blobUrl || file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2 px-3 rounded-xl transition"
                title="Buka di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Penuh</span>
              </a>
            )}

            {/* Download button */}
            {file.url && (
              <a
                href={file.url}
                download={fileName}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition shadow-sm"
                title="Unduh Berkas ke Perangkat"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh</span>
              </a>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Tutup Pratinjau (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 overflow-auto flex items-center justify-center">
          {/* IMAGE PREVIEW */}
          {isImage ? (
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-h-[75vh] max-w-full rounded-2xl shadow-md object-contain border border-slate-200 dark:border-slate-800"
              />
            </div>
          ) : previewSrc ? (
            /* OBJECT / IFRAME FOR PDF, GOOGLE DRIVE, OR OFFICE (WITHOUT RESTRICTIVE SANDBOX) */
            <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-inner flex flex-col">
              {isPdf ? (
                <object
                  data={previewSrc}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <iframe
                    src={previewSrc}
                    title={fileName}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen"
                  >
                    <div className="p-6 text-center space-y-3 bg-white">
                      <p className="text-xs text-slate-700">Browser Anda tidak dapat menampilkan pratinjau PDF langsung di sini.</p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition"
                      >
                        Buka Dokumen PDF di Tab Baru ↗
                      </a>
                    </div>
                  </iframe>
                </object>
              ) : (
                <iframe
                  src={previewSrc}
                  title={fileName}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                />
              )}
            </div>
          ) : (
            /* FALLBACK FOR UNPREVIEWABLE FILES (ZIP, LOCAL DOCX, ETC) */
            <div className="text-center p-8 max-w-md mx-auto space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau Dalam Aplikasi Tidak Tersedia
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Berkas berformat <strong>.{ext.toUpperCase()}</strong> memerlukan aplikasi eksternal (seperti Microsoft Office / Word / Excel) untuk dibuka.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                {file.url && (
                  <a
                    href={file.url}
                    download={fileName}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas Sekarang</span>
                  </a>
                )}
                {file.url && file.url.startsWith('http') && (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Tautan Luar</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>💡 Dokumen dapat dibaca langsung, di-scroll, atau diperbesar di layar ini.</span>
          <span className="hidden sm:inline">Tekan <strong>Esc</strong> untuk menutup</span>
        </div>

      </div>
    </div>
  );
}
