import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, MessageCircle, X, HelpCircle, ShieldCheck } from 'lucide-react';

export default function DiscussionModal({ isOpen, onClose, isAdminMode, onShowToast }) {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('odoa_lms_discussions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 1,
        nama: "Ahmad Hidayat",
        role: "Santri",
        waktu: "10 menit yang lalu",
        teks: "Ustadz, terkait QS. Al-Baqarah: 45, bagaimana cara praktis melatih khusyuk saat shalat di tengah kepenatan deadline kerja?",
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: 101,
            nama: "Ustadz Hanif Al-Fatih, Lc.",
            role: "Ustadz",
            waktu: "5 menit yang lalu",
            teks: "Assalamu'alaikum Akh Ahmad. Kuncinya pada wudhu yang disempurnakan dan jeda 2 menit sebelum takbiratul ihram untuk menyadari bahwa kita sedang menghadap Sang Pencipta alam semesta.",
            likes: 8,
            isLiked: true
          }
        ]
      },
      {
        id: 2,
        nama: "Siti Rahma",
        role: "Santri",
        waktu: "1 jam yang lalu",
        teks: "MasyaAllah tadabbur bab sabar ini sangat melegakan hati. Penjelasan ulasan audionya sangat menyentuh.",
        likes: 12,
        isLiked: false,
        replies: []
      }
    ];
  });

  const [inputNama, setInputNama] = useState('');
  const [inputText, setInputText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const saveComments = (newComments) => {
    setComments(newComments);
    localStorage.setItem('odoa_lms_discussions', JSON.stringify(newComments));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment = {
      id: Date.now(),
      nama: isAdminMode ? "Ustadz Hanif (Pengajar)" : (inputNama.trim() || "Sahabat Santri"),
      role: isAdminMode ? "Ustadz" : "Santri",
      waktu: "Baru saja",
      teks: inputText.trim(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    const updated = [newComment, ...comments];
    saveComments(updated);
    setInputText('');
    setInputNama('');
    onShowToast("Pertanyaan / refleksi berhasil dikirim!");
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: Date.now(),
              nama: isAdminMode ? "Ustadz Hanif (Pengajar)" : "Sahabat Santri",
              role: isAdminMode ? "Ustadz" : "Santri",
              waktu: "Baru saja",
              teks: replyText.trim(),
              likes: 0,
              isLiked: false
            }
          ]
        };
      }
      return c;
    });

    saveComments(updated);
    setReplyText('');
    setActiveReplyId(null);
    onShowToast("Tanggapan berhasil dikirim!");
  };

  const handleToggleLike = (commentId, replyId = null) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        if (replyId) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === replyId) {
                return {
                  ...r,
                  likes: r.isLiked ? r.likes - 1 : r.likes + 1,
                  isLiked: !r.isLiked
                };
              }
              return r;
            })
          };
        }
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked
        };
      }
      return c;
    });

    saveComments(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 w-full max-w-xl space-y-4 relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Forum Diskusi & Tanya Ustadz</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tanyakan materi kurikulum atau bagikan refleksi tadabburmu.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddComment} className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2.5 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Tulis Diskusi Baru:</span>
            {isAdminMode && (
              <span className="text-[10px] bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                Menjawab sebagai Pengajar 🎙️
              </span>
            )}
          </div>

          {!isAdminMode && (
            <input
              type="text"
              placeholder="Nama Anda (Opsional)"
              value={inputNama}
              onChange={(e) => setInputNama(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          )}

          <textarea
            rows="2"
            placeholder="Tuliskan pertanyaan atau tadabbur Anda..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke Forum Diskusi</span>
          </button>
        </form>

        {/* List of comments */}
        <div className="space-y-3 pt-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Diskusi Santri ({comments.length})
          </span>

          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 transition">
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    comment.role === 'Ustadz' 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400'
                  }`}>
                    {comment.nama.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{comment.nama}</span>
                  {comment.role === 'Ustadz' && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                      Pengajar 🎙️
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{comment.waktu}</span>
              </div>

              <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed pl-9">
                {comment.teks}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pl-9 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => handleToggleLike(comment.id)}
                  className={`flex items-center gap-1.5 transition ${
                    comment.isLiked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{comment.likes}</span>
                </button>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Tanggapi ({comment.replies.length})</span>
                </button>
              </div>

              {/* Nested replies */}
              {comment.replies.length > 0 && (
                <div className="ml-9 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                  {comment.replies.map(r => (
                    <div key={r.id} className="bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{r.nama}</span>
                        <span className="text-slate-500 dark:text-slate-400">{r.waktu}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{r.teks}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {activeReplyId === comment.id && (
                <div className="ml-9 pt-2 space-y-2">
                  <textarea
                    rows="2"
                    placeholder={`Tulis balasan untuk ${comment.nama}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none transition"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-xs"
                    >
                      Kirim Tanggapan
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
