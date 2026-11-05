import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, RotateCcw, X } from 'lucide-react';

export default function QuizModal({ quiz, moduleTitle, onClose, onQuizComplete }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) return null;

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    const isPassed = finalScore >= (quiz.minScore || 70);
    if (onQuizComplete) {
      onQuizComplete(finalScore, isPassed);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const isAllAnswered = quiz.questions.every((_, idx) => selectedAnswers[idx] !== undefined);
  const isPassed = score >= (quiz.minScore || 70);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-5 relative shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider block">
              Evaluasi Pemahaman • {moduleTitle}
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{quiz.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score Banner when Submitted */}
        {submitted && (
          <div className={`p-4 rounded-2xl border text-center space-y-1.5 ${
            isPassed 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300' 
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-300'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {isPassed ? <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" /> : <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />}
              <span className="font-extrabold text-sm sm:text-base">
                {isPassed ? "Alhamdulillah! Anda Lulus Kuis" : "Belum Memenuhi Nilai Kelulusan"}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Skor Anda: <strong className="text-slate-900 dark:text-white text-base">{score} / 100</strong> (Batas Lulus: {quiz.minScore || 70})
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-5">
          {quiz.questions.map((q, qIdx) => {
            const isUserAnswered = selectedAnswers[qIdx] !== undefined;
            const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;

            return (
              <div key={q.id || qIdx} className="bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2 pt-1 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    let optionStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-emerald-500/50 shadow-xs";

                    if (submitted) {
                      if (optIdx === q.correctAnswer) {
                        optionStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 shadow-xs";
                      } else {
                        optionStyle = "bg-slate-100/60 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/50 text-slate-400 dark:text-slate-500";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold shadow-xs";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {submitted && optIdx === q.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && q.explanation && (
                  <div className="mt-2 ml-7 p-3 rounded-xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-xs text-amber-950 dark:text-slate-400 leading-relaxed">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">💡 Pembahasan:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          {!submitted ? (
            <button
              onClick={calculateScore}
              disabled={!isAllAnswered}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                isAllAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Periksa & Kumpulkan Jawaban</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              {!isPassed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Ulangi Kuis</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span>Tutup & Simpan Hasil</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
