import React, { useState, useRef } from 'react';
import QuranPicker from './QuranPicker';
import MediaPlayer from './MediaPlayer';
import FilePreviewModal from './FilePreviewModal';
import StudentReportModal from './StudentReportModal';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  BookOpen, 
  Mic, 
  MicOff, 
  HelpCircle, 
  Check, 
  Layers, 
  FileText, 
  User, 
  Save, 
  Volume2, 
  ArrowRight,
  AlertCircle,
  Video,
  Link2,
  Paperclip,
  Upload,
  FileUp,
  Eye,
  X,
  Users,
  UserCheck,
  UserX,
  MessageCircle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function AdminCMS({ 
  courses, 
  onUpdateCourses, 
  onShowToast,
  users = [],
  onUpdateUsers,
  allStudentsProgress = {},
  teacherNotes = {},
  onSaveTeacherNote
}) {
  const [activeSubTab, setActiveSubTab] = useState('courses'); // 'courses', 'lessons', 'quiz'
  const [showQuranPicker, setShowQuranPicker] = useState(false);

  // Media options for lessons
  const [mediaChoice, setMediaChoice] = useState('video'); // 'video', 'audio', 'none'
  const [customMediaUrl, setCustomMediaUrl] = useState('');

  // Student & Teacher Management states
  const [studentFilter, setStudentFilter] = useState('all'); // 'all', 'teachers', 'pending', 'active'
  const [studentSearch, setStudentSearch] = useState('');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedReportStudent, setSelectedReportStudent] = useState(null);
  const [manualStudentForm, setManualStudentForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: 'password123',
    role: 'santri',
    status: 'active'
  });

  // File Attachments for lessons
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [customFileLink, setCustomFileLink] = useState('');
  const [customFileName, setCustomFileName] = useState('');
  const [cmsPreviewFile, setCmsPreviewFile] = useState(null);

  // Selection states
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedModuleId, setSelectedModuleId] = useState(courses[0]?.modules[0]?.id || '');

  // --- Form 1: Buat Kursus Baru ---
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'Tadabbur',
    level: 'Pemula',
    instructor: 'Ustadz Pembina',
    description: '',
    badge: 'Baru'
  });

  // --- Form 2: Tambah Modul Baru ---
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // --- Form 3: Tambah Pelajaran Baru ---
  const [newLesson, setNewLesson] = useState({
    title: '',
    surah: '',
    arabic: '',
    translation: '',
    content: '',
    actionToday: ''
  });

  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // --- Form 4: Tambah Soal Kuis Baru ---
  const [newQuizQuestion, setNewQuizQuestion] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    explanation: ''
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const selectedModule = selectedCourse?.modules.find(m => m.id === selectedModuleId) || selectedCourse?.modules[0];

  // ================= Audio Recording Handlers =================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Akses mikrofon ditolak atau tidak didukung pada perangkat ini.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // ================= CMS Handlers =================
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    const courseId = `kursus_${Date.now()}`;
    const defaultModule = {
      id: `modul_${Date.now()}`,
      title: "Bab 1: Pengantar Materi",
      lessons: [],
      quiz: null
    };

    const created = {
      id: courseId,
      ...newCourse,
      duration: "0 Pelajaran",
      thumbnailBg: "from-emerald-950/60 to-slate-900",
      modules: [defaultModule]
    };

    const updated = [created, ...courses];
    onUpdateCourses(updated);
    setSelectedCourseId(courseId);
    setSelectedModuleId(defaultModule.id);

    setNewCourse({
      title: '',
      category: 'Tadabbur',
      level: 'Pemula',
      instructor: 'Ustadz Pembina',
      description: '',
      badge: 'Baru'
    });

    onShowToast(`Kursus "${created.title}" berhasil dibuat!`);
  };

  const handleDeleteCourse = (courseId) => {
    if (courses.length <= 1) {
      alert("Harus ada minimal 1 kursus aktif dalam sistem LMS!");
      return;
    }
    if (confirm("Apakah Anda yakin ingin menghapus kursus ini beserta seluruh materi di dalamnya?")) {
      const updated = courses.filter(c => c.id !== courseId);
      onUpdateCourses(updated);
      setSelectedCourseId(updated[0]?.id || '');
      onShowToast("Kursus telah dihapus.");
    }
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim() || !selectedCourse) return;

    const newModObj = {
      id: `mod_${Date.now()}`,
      title: newModuleTitle.trim(),
      lessons: [],
      quiz: null
    };

    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          modules: [...c.modules, newModObj]
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);
    setSelectedModuleId(newModObj.id);
    setNewModuleTitle('');
    onShowToast(`Bab "${newModObj.title}" berhasil ditambahkan!`);
  };

  // ================= File Upload Handlers =================
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      const newAtt = {
        name: file.name,
        size: sizeStr,
        url: reader.result,
        type: file.type || 'Berkas Modul'
      };
      setAttachmentsList(prev => [...prev, newAtt]);
      onShowToast(`File "${file.name}" berhasil dilampirkan!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddLinkAttachment = (e) => {
    e.preventDefault();
    if (!customFileLink.trim()) return;

    const fileName = customFileName.trim() || 'Modul_Dokumen.pdf';
    const newAtt = {
      name: fileName,
      size: 'Tautan Awan',
      url: customFileLink.trim(),
      type: 'Tautan Berkas'
    };
    setAttachmentsList(prev => [...prev, newAtt]);
    setCustomFileLink('');
    setCustomFileName('');
    onShowToast(`Tautan file "${fileName}" berhasil ditambahkan!`);
  };

  const handleRemoveAttachment = (index) => {
    setAttachmentsList(prev => prev.filter((_, idx) => idx !== index));
    onShowToast("Lampiran dihapus.");
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLesson.title.trim() || !selectedCourse || !selectedModule) return;

    const finalMediaUrl = mediaChoice === 'video'
      ? customMediaUrl.trim()
      : (mediaChoice === 'audio' ? (customMediaUrl.trim() || recordedAudioUrl) : null);

    const newLessonObj = {
      id: `les_${Date.now()}`,
      title: newLesson.title.trim(),
      surah: newLesson.surah.trim() || "QS. Al-Qur'an",
      arabic: newLesson.arabic.trim(),
      translation: newLesson.translation.trim(),
      content: newLesson.content.trim(),
      actionToday: newLesson.actionToday.trim(),
      mediaType: mediaChoice,
      mediaUrl: finalMediaUrl,
      audioUrl: mediaChoice === 'audio' ? finalMediaUrl : null,
      attachments: attachmentsList
    };

    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === selectedModule.id) {
              return {
                ...m,
                lessons: [...m.lessons, newLessonObj]
              };
            }
            return m;
          })
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);
    setNewLesson({
      title: '',
      surah: '',
      arabic: '',
      translation: '',
      content: '',
      actionToday: ''
    });
    setCustomMediaUrl('');
    setRecordedAudioUrl(null);
    setAttachmentsList([]);
    onShowToast(`Pelajaran "${newLessonObj.title}" berhasil dipublikasikan!`);
  };

  const handleDeleteLesson = (lessonId) => {
    if (!confirm("Hapus materi pelajaran ini?")) return;

    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === selectedModule.id) {
              return {
                ...m,
                lessons: m.lessons.filter(l => l.id !== lessonId)
              };
            }
            return m;
          })
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);
    onShowToast("Materi pelajaran dihapus.");
  };

  const handleAddQuizQuestion = (e) => {
    e.preventDefault();
    if (!newQuizQuestion.question.trim() || !selectedCourse || !selectedModule) return;

    const newQuestionObj = {
      id: `q_${Date.now()}`,
      question: newQuizQuestion.question.trim(),
      options: [
        newQuizQuestion.optionA.trim() || "Opsi A",
        newQuizQuestion.optionB.trim() || "Opsi B",
        newQuizQuestion.optionC.trim() || "Opsi C",
        newQuizQuestion.optionD.trim() || "Opsi D"
      ],
      correctAnswer: parseInt(newQuizQuestion.correctAnswer),
      explanation: newQuizQuestion.explanation.trim()
    };

    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourse.id) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === selectedModule.id) {
              const existingQuiz = m.quiz || {
                id: `quiz_${Date.now()}`,
                title: `Evaluasi ${m.title}`,
                minScore: 70,
                questions: []
              };
              return {
                ...m,
                quiz: {
                  ...existingQuiz,
                  questions: [...existingQuiz.questions, newQuestionObj]
                }
              };
            }
            return m;
          })
        };
      }
      return c;
    });

    onUpdateCourses(updatedCourses);
    setNewQuizQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 0,
      explanation: ''
    });
    onShowToast("Soal kuis baru berhasil ditambahkan!");
  };

  // --- Student Management Handlers ---
  const handleToggleStudentStatus = (studentId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'pending' : 'active';
    const updatedUsers = users.map(u => {
      if (u.id === studentId) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    if (onUpdateUsers) onUpdateUsers(updatedUsers);
    if (nextStatus === 'active') {
      onShowToast("Alhamdulillah! Akun santri berhasil diaktifkan. Infaq terkonfirmasi.");
    } else {
      onShowToast("Akun santri ditangguhkan.");
    }
  };

  const handleDeleteStudent = (studentId, studentName) => {
    if (window.confirm(`Yakin ingin menghapus data "${studentName}"?`)) {
      const updatedUsers = users.filter(u => u.id !== studentId);
      if (onUpdateUsers) onUpdateUsers(updatedUsers);
      onShowToast(`Akun "${studentName}" berhasil dihapus.`);
    }
  };

  const handleToggleRole = (studentId, currentRole, studentName) => {
    const newRole = currentRole === 'admin' ? 'santri' : 'admin';
    const roleTitle = newRole === 'admin' ? 'Pengajar (Admin)' : 'Santri';
    
    if (window.confirm(`Ubah peran "${studentName}" menjadi ${roleTitle}?`)) {
      const updatedUsers = users.map(u => {
        if (u.id === studentId) {
          return { ...u, role: newRole, status: 'active' };
        }
        return u;
      });
      if (onUpdateUsers) onUpdateUsers(updatedUsers);
      onShowToast(`Peran ${studentName} berhasil diubah menjadi ${roleTitle}!`);
    }
  };

  const handleCreateManualStudent = (e) => {
    e.preventDefault();
    if (!manualStudentForm.name.trim() || (!manualStudentForm.email.trim() && !manualStudentForm.whatsapp.trim())) {
      onShowToast("Harap lengkapi nama dan kontak.");
      return;
    }

    const isTeacher = manualStudentForm.role === 'admin';
    const newStudent = {
      id: `user_${Date.now()}`,
      name: manualStudentForm.name.trim(),
      email: manualStudentForm.email.trim() || `${manualStudentForm.whatsapp}@sanad.academy`,
      whatsapp: manualStudentForm.whatsapp.trim(),
      password: manualStudentForm.password || 'password123',
      role: manualStudentForm.role || 'santri',
      status: isTeacher ? 'active' : (manualStudentForm.status || 'active'),
      joinedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      completedCourses: []
    };

    if (onUpdateUsers) onUpdateUsers([...users, newStudent]);
    setManualStudentForm({
      name: '',
      email: '',
      whatsapp: '',
      password: 'password123',
      role: 'santri',
      status: 'active'
    });
    setShowAddStudentModal(false);
    onShowToast(`${isTeacher ? 'Pengajar baru' : 'Santri baru'} "${newStudent.name}" berhasil didaftarkan!`);
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const teachersCount = safeUsers.filter(u => u && u.role === 'admin').length;
  const pendingStudentsCount = safeUsers.filter(u => u && u.role === 'santri' && u.status === 'pending').length;
  const activeStudentsCount = safeUsers.filter(u => u && (u.role === 'santri' || !u.role) && u.status !== 'pending').length;

  const filteredStudents = safeUsers.filter(u => {
    if (!u) return false;
    const role = u.role || 'santri';
    const status = u.status || 'active';
    if (studentFilter === 'teachers' && role !== 'admin') return false;
    if (studentFilter === 'pending' && (role !== 'santri' || status !== 'pending')) return false;
    if (studentFilter === 'active' && (role !== 'santri' || status !== 'active')) return false;
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchWa = String(u.whatsapp || '').includes(q);
      return matchName || matchEmail || matchWa;
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl space-y-6 pb-20">
      
      {/* CMS Header Banner */}
      <div className="bg-gradient-to-br from-amber-800 via-amber-900 to-slate-950 dark:from-amber-950/70 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 p-5 sm:p-6 rounded-3xl space-y-2.5 shadow-lg shadow-amber-950/15 text-white">
        <div className="flex items-center gap-2 text-amber-300">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            Panel CMS Pengajar & Kurikulum LMS
          </h2>
        </div>
        <p className="text-xs text-amber-100/90 dark:text-slate-300 leading-relaxed">
          Kelola kursus, buat bab silabus, publikasikan ulasan suara audio, serta susun soal kuis evaluasi untuk santri Sanad Academy.
        </p>

        {/* Sub-Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/15 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'courses'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/10 dark:bg-slate-800 text-white dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Kelola Kursus</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lessons')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'lessons'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/10 dark:bg-slate-800 text-white dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Modul & Audio Materi</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'quiz'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/10 dark:bg-slate-800 text-white dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Input Soal Kuis</span>
          </button>

          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
              activeSubTab === 'students'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/10 dark:bg-slate-800 text-white dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Santri & Pengajar</span>
            {pendingStudentsCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {pendingStudentsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Select Active Course & Module for Context (hanya untuk Tab Kursus, Modul, Kuis) */}
      {activeSubTab !== 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center shadow-sm">
          <div className="w-full sm:w-1/2 space-y-1">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Pilih Kursus yang Dikelola:</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                const crs = courses.find(c => c.id === e.target.value);
                setSelectedModuleId(crs?.modules[0]?.id || '');
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-amber-300 rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/2 space-y-1">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Pilih Bab / Modul:</label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-emerald-400 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            >
              {selectedCourse?.modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* TAB 1: KELOLA KURSUS */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Form Buat Kursus */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Plus className="w-4 h-4" />
              <span>Buat Kursus Baru</span>
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Judul Kursus:</label>
                <input
                  type="text"
                  placeholder="Contoh: Tadabbur Surah Yusuf: Pelajaran Keteguhan"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Kategori:</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Al-Qur'an & Tadabbur">Al-Qur'an & Tadabbur</option>
                    <option value="Ruqyah Syar'iyyah">Ruqyah Syar'iyyah</option>
                    <option value="Fiqih & Muamalah">Fiqih & Muamalah</option>
                    <option value="Tafsir & Hadis">Tafsir & Hadis</option>
                    <option value="Tahsin & Qira'at">Tahsin & Qira'at</option>
                    <option value="Aqidah & Akhlaq">Aqidah & Akhlaq</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Tingkat Kesulitan:</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Pengajar / Ustadz:</label>
                <input
                  type="text"
                  placeholder="Ustadz Abdullah, Lc."
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Deskripsi Singkat:</label>
                <textarea
                  rows="3"
                  placeholder="Jelaskan tujuan dan gambaran materi kursus ini..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition shadow-md shadow-amber-500/20"
              >
                + Simpan & Terbitkan Kursus
              </button>
            </form>
          </div>

          {/* Daftar Kursus yang Ada */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span>Daftar Kursus ({courses.length})</span>
              <span className="text-[10px] text-slate-400">Klik sampah untuk hapus</span>
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {courses.map(course => (
                <div
                  key={course.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    course.id === selectedCourseId 
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/50' 
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase font-bold">
                      {course.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {course.modules.length} Bab • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Pelajaran
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition"
                    title="Hapus Kursus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MODUL & AUDIO MATERI */}
      {activeSubTab === 'lessons' && (
        <div className="space-y-4">
          
          {/* Sub-form: Tambah Bab Baru ke Kursus Terpilih */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Tambah Bab / Modul Baru ke: {selectedCourse?.title}</span>
            </h3>
            <form onSubmit={handleAddModule} className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: Bab 3: Menghidupkan Dzikir Harian"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
              >
                + Tambah Bab
              </button>
            </form>
          </div>

          {/* Form Tambah Pelajaran Baru */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <FileText className="w-4 h-4" />
                Tambah Pelajaran ke "{selectedModule?.title}"
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Total: {selectedModule?.lessons.length || 0} Pelajaran
              </span>
            </h3>

            <form onSubmit={handleAddLesson} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Judul Pelajaran / Topik:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sabar dalam Menghadapi Tuduhan"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Surah & Ayat Referensi:</label>
                  <input
                    type="text"
                    placeholder="Contoh: QS. Yusuf: 18"
                    value={newLesson.surah}
                    onChange={(e) => setNewLesson({ ...newLesson, surah: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* FITUR PILIH SURAT & AYAT AL-QUR'AN OTOMATIS */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Pilih Otomatis dari Al-Qur'an (114 Surat & Ayat)
                    </span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      Cukup pilih surat apa & ayat berapa, teks Arab dan terjemahan otomatis terisi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuranPicker(!showQuranPicker)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{showQuranPicker ? "Tutup Pemilih" : "Buka Pemilih Surat & Ayat"}</span>
                  </button>
                </div>

                {showQuranPicker && (
                  <div className="pt-2">
                    <QuranPicker
                      onSelectAyat={(data) => {
                        setNewLesson(prev => ({
                          ...prev,
                          surah: data.surahRef,
                          arabic: data.arabic,
                          translation: data.translation,
                          title: prev.title.trim() ? prev.title : `Tadabbur ${data.surahRef}`
                        }));
                        setShowQuranPicker(false);
                        onShowToast(`Ayat ${data.surahRef} berhasil dimasukkan ke form!`);
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Teks Al-Qur'an (Arab):</label>
                <textarea
                  rows="2"
                  dir="rtl"
                  placeholder="فَصَبْرٌ جَمِيلٌ ۖ وَاللَّهُ الْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ..."
                  value={newLesson.arabic}
                  onChange={(e) => setNewLesson({ ...newLesson, arabic: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-base font-serif text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 resize-none text-right"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Terjemahan Ayat:</label>
                <textarea
                  rows="2"
                  placeholder="Maka kesabaran yang baik itulah (kesabaranku). Dan Allah sajalah yang dimohonkan pertolongan-Nya..."
                  value={newLesson.translation}
                  onChange={(e) => setNewLesson({ ...newLesson, translation: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Ulasan & Tadabbur Mendalam:</label>
                <textarea
                  rows="4"
                  placeholder="Tuliskan hikmah, pelajaran kontekstual, dan tafsir ayat ini bagi santri..."
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Tugas / Aksi Penerapan Hari Ini:</label>
                <input
                  type="text"
                  placeholder="Contoh: Luangkan 5 menit merenungi ujian yang sedang dihadapi dan pasrahkan kepada Allah."
                  value={newLesson.actionToday}
                  onChange={(e) => setNewLesson({ ...newLesson, actionToday: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* FITUR MEDIA PEMBELAJARAN (VIDEO YOUTUBE / GOOGLE DRIVE / AUDIO REKAMAN) */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    Pilihan Media Modul (Video / Audio / Teks)
                  </span>
                  <span className="text-[10px] text-slate-500">Mendukung YouTube & GDrive</span>
                </div>

                {/* Media Type Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaChoice('video')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      mediaChoice === 'video'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>🎥 Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaChoice('audio')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      mediaChoice === 'audio'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🎙️ Audio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaChoice('none')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      mediaChoice === 'none'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>📄 Teks Saja</span>
                  </button>
                </div>

                {/* VIDEO OPTION FORM */}
                {mediaChoice === 'video' && (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Tautan Link Video (YouTube / Google Drive / MP4):
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 font-semibold">Coba Demo:</span>
                        <button
                          type="button"
                          onClick={() => setCustomMediaUrl('https://www.youtube.com/watch?v=zu6mOmxih8Y')}
                          className="text-[10px] bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/40 px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 shadow-xs"
                          title="Klik untuk mengisi link YouTube demo QS. Al-Baqarah"
                        >
                          🎬 Demo YouTube 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomMediaUrl('https://www.youtube.com/watch?v=voL_L9ZLLyA')}
                          className="text-[10px] bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600/40 px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 shadow-xs"
                          title="Klik untuk mengisi link YouTube demo Ruqyah Syar'iyyah"
                        >
                          🛡️ Demo YouTube 2
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="Contoh: https://www.youtube.com/watch?v=zu6mOmxih8Y"
                        value={customMediaUrl}
                        onChange={(e) => setCustomMediaUrl(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      💡 <strong>Tips:</strong> Klik tombol <em>Demo YouTube</em> di atas atau tempel (paste) URL video YouTube / Google Drive apa pun. Video akan langsung diputar di bawah.
                    </p>

                    {/* Live Preview */}
                    {customMediaUrl.trim() && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pratinjau Video Pemutar:</span>
                        <MediaPlayer mediaType="video" mediaUrl={customMediaUrl} title="Pratinjau Video Modul" />
                      </div>
                    )}
                  </div>
                )}

                {/* AUDIO OPTION FORM */}
                {mediaChoice === 'audio' && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Opsi 1: Tautan Link Audio (Google Drive / MP3):
                      </label>
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          placeholder="Paste link audio Google Drive atau link file MP3..."
                          value={customMediaUrl}
                          onChange={(e) => setCustomMediaUrl(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                      <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-bold">atau</span>
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    </div>

                    {/* Microphone Recording Option */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Opsi 2: Rekam Suara Langsung via Mikrofon HP/Laptop:
                      </label>
                      <div className="flex items-center gap-3">
                        {!isRecording ? (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            <span>Mulai Rekam Suara</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
                          >
                            <MicOff className="w-3.5 h-3.5 text-rose-400" />
                            <span>Hentikan Rekaman ({recordingTime}s)</span>
                          </button>
                        )}

                        {recordedAudioUrl && (
                          <div className="flex-1 flex items-center gap-2">
                            <audio src={recordedAudioUrl} controls className="w-full h-8" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Preview for Audio URL */}
                    {customMediaUrl.trim() && !recordedAudioUrl && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pratinjau Pemutar Audio:</span>
                        <MediaPlayer mediaType="audio" mediaUrl={customMediaUrl} title="Pratinjau Audio" />
                      </div>
                    )}
                  </div>
                )}

                {/* NONE OPTION */}
                {mediaChoice === 'none' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic py-1">
                    Materi ini akan disajikan dalam bentuk teks tadabbur dan ayat suci tanpa pemutar video/audio.
                  </p>
                )}
              </div>

              {/* FITUR UNGGAH BERKAS / LAMPIRAN FILE MODUL (PDF, DOCX, DLL) */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Lampirkan Berkas Modul (PDF / Rangkuman / Lembar Kerja)
                  </span>
                  <span className="text-[10px] text-slate-500">Santri dapat mengunduh</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Cara 1: Upload File Langsung */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
                    <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Unggah dari Perangkat</span>
                      <span className="text-[10px] text-slate-500">PDF, Word, PPT, Gambar, atau ZIP</span>
                    </div>
                    <label className="inline-block bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-1.5 px-3 rounded-lg cursor-pointer transition">
                      Pilih File
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg"
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Cara 2: Tautan Link File (Google Drive / Dropbox) */}
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Tautan Link Cloud / GDrive</span>
                    <input
                      type="text"
                      placeholder="Nama file (contoh: Ringkasan_Bab_1.pdf)"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        placeholder="Link file Google Drive..."
                        value={customFileLink}
                        onChange={(e) => setCustomFileLink(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddLinkAttachment}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 rounded-lg shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Attached Files */}
                {attachmentsList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Berkas yang Siap Dilampirkan ({attachmentsList.length}):</span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {attachmentsList.map((att, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate font-semibold text-slate-800 dark:text-slate-200">{att.name}</span>
                            <span className="text-[10px] text-slate-400">({att.size})</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setCmsPreviewFile(att)}
                              className="text-emerald-600 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition"
                              title="Pratinjau / Buka Berkas Langsung"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(idx)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition"
                              title="Hapus Lampiran"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pelajaran ke Modul</span>
              </button>
            </form>
          </div>

          {/* Daftar Pelajaran di Bab ini */}
          {selectedModule && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Pelajaran Terdaftar di {selectedModule.title} ({selectedModule.lessons.length})
              </h4>
              <div className="space-y-2">
                {selectedModule.lessons.map((les, idx) => (
                  <div key={les.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{idx + 1}. {les.title}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">{les.surah}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteLesson(les.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: INPUT SOAL KUIS */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Susun Soal Kuis untuk: {selectedModule?.title}</span>
            </h3>

            <form onSubmit={handleAddQuizQuestion} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Pertanyaan Kuis:</label>
                <textarea
                  rows="2"
                  placeholder="Contoh: Apa hikmah utama yang dapat diambil dari QS. Al-Baqarah: 45?"
                  value={newQuizQuestion.question}
                  onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, question: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1">Pilihan A:</label>
                  <input
                    type="text"
                    placeholder="Pilihan jawaban A"
                    value={newQuizQuestion.optionA}
                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, optionA: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1">Pilihan B:</label>
                  <input
                    type="text"
                    placeholder="Pilihan jawaban B"
                    value={newQuizQuestion.optionB}
                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, optionB: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1">Pilihan C:</label>
                  <input
                    type="text"
                    placeholder="Pilihan jawaban C"
                    value={newQuizQuestion.optionC}
                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, optionC: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1">Pilihan D:</label>
                  <input
                    type="text"
                    placeholder="Pilihan jawaban D"
                    value={newQuizQuestion.optionD}
                    onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, optionD: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Kunci Jawaban Benar:</label>
                <select
                  value={newQuizQuestion.correctAnswer}
                  onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, correctAnswer: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-amber-700 dark:text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
                >
                  <option value={0}>Pilihan A</option>
                  <option value={1}>Pilihan B</option>
                  <option value={2}>Pilihan C</option>
                  <option value={3}>Pilihan D</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Penjelasan / Pembahasan:</label>
                <textarea
                  rows="2"
                  placeholder="Jelaskan alasan jawaban tersebut benar untuk dibaca santri setelah menjawab..."
                  value={newQuizQuestion.explanation}
                  onChange={(e) => setNewQuizQuestion({ ...newQuizQuestion, explanation: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl transition shadow-md shadow-amber-500/20"
              >
                + Tambah Soal ke Kuis Bab Ini
              </button>
            </form>
          </div>

          {/* List Soal yang Sudah Ada di Bab Terpilih */}
          {selectedModule?.quiz && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Soal Kuis Saat Ini ({selectedModule.quiz.questions.length})
              </h4>
              <div className="space-y-2.5">
                {selectedModule.quiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{idx + 1}. {q.question}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Jawaban Benar: Opsi {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DATA SANTRI & AKTIVASI AKUN (VERIFIKASI INFAQ) */}
      {activeSubTab === 'students' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Stat Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Pengguna</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {users.length}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-amber-500/40 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Pengajar (Admin)</span>
                <p className="text-xl font-black text-amber-500">
                  {teachersCount} Ustadz
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Santri Aktif</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {activeStudentsCount}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Menunggu Infaq</span>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {pendingStudentsCount}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action Bar: Search, Filters & Add Manual */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari santri/pengajar berdasarkan nama, email, atau no. WA..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddStudentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-emerald-950/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Daftarkan Pengajar / Santri</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setStudentFilter('all')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition shrink-0 ${
                  studentFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Semua ({users.length})
              </button>

              <button
                type="button"
                onClick={() => setStudentFilter('teachers')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  studentFilter === 'teachers'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pengajar ({teachersCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStudentFilter('active')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  studentFilter === 'active'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Santri Aktif ({activeStudentsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setStudentFilter('pending')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  studentFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Menunggu Infaq ({pendingStudentsCount})</span>
              </button>
            </div>
          </div>

          {/* Santri List Cards */}
          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-2">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Tidak ada santri yang sesuai dengan filter atau pencarian.
                </p>
              </div>
            ) : (
              filteredStudents.map((santri) => {
                const isPending = santri.status === 'pending';
                const waNumber = santri.whatsapp ? String(santri.whatsapp).replace(/\D/g, '') : '';
                const waLink = waNumber ? `https://wa.me/${waNumber.startsWith('0') ? '62' + waNumber.slice(1) : waNumber}` : null;

                return (
                  <div
                    key={santri.id}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-4 sm:p-5 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isPending 
                        ? 'border-amber-500/40 bg-amber-500/[0.02]' 
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* User Info */}
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ${
                        santri.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                          : (isPending 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400')
                      }`}>
                        {santri.name?.charAt(0) || 'U'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {santri.name}
                          </h4>

                          {/* Role Badge */}
                          {santri.role === 'admin' ? (
                            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              👑 Pengajar (Admin)
                            </span>
                          ) : (
                            isPending ? (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span>Menunggu Infaq</span>
                              </span>
                            ) : (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Santri Aktif</span>
                              </span>
                            )
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {santri.email} {santri.whatsapp ? `• ${santri.whatsapp}` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Terdaftar sejak: {santri.joinedDate || 'Baru'}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap justify-end">
                      
                      {/* Button Rapor & Rekap Nilai Kuis (Khusus Santri) */}
                      {santri.role === 'santri' && (
                        <button
                          type="button"
                          onClick={() => setSelectedReportStudent(santri)}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                          title="Buka Rapor Belajar & Nilai Kuis Santri"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Rapor & Nilai</span>
                        </button>
                      )}

                      {/* Direct WhatsApp Chat button */}
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-xs p-2 rounded-xl transition"
                          title="Hubungi via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}

                      {/* Role Toggle Button (Promote to Teacher / Demote to Santri) */}
                      <button
                        type="button"
                        onClick={() => handleToggleRole(santri.id, santri.role, santri.name)}
                        className={`text-xs py-2 px-2.5 rounded-xl font-bold transition flex items-center gap-1 border ${
                          santri.role === 'admin'
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border-amber-500/40'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                        title={santri.role === 'admin' ? "Ubah Menjadi Santri Biasa" : "Promosikan Jadi Pengajar / Admin CMS"}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[11px]">{santri.role === 'admin' ? 'Guru' : 'Jadikan Guru'}</span>
                      </button>

                      {/* Toggle Activate / Deactivate Button (Khusus Santri) */}
                      {santri.role === 'santri' && (
                        isPending ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStudentStatus(santri.id, santri.status)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Setujui Infaq</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStudentStatus(santri.id, santri.status)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2 px-2.5 rounded-xl transition flex items-center gap-1"
                            title="Tangguhkan Akun Santri"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}

                      {/* Delete Student Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(santri.id, santri.name)}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-800 p-2 rounded-xl transition"
                        title="Hapus Santri"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* MODAL TAMBAH SANTRI MANUAL */}
          {showAddStudentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Daftarkan Pengajar / Santri Baru</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateManualStudent} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Peran Akun:</label>
                    <select
                      value={manualStudentForm.role || 'santri'}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, role: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                    >
                      <option value="santri">🎓 Santri Belajar</option>
                      <option value="admin">👑 Pengajar / Admin (Akses Penuh CMS Guru)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Lengkap & Gelar:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ustadz Abdullah, Lc. M.Ag"
                      value={manualStudentForm.name}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Santri:</label>
                    <input
                      type="email"
                      placeholder="santribaru@gmail.com"
                      value={manualStudentForm.email}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nomor WhatsApp:</label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={manualStudentForm.whatsapp}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, whatsapp: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Kata Sandi Awal:</label>
                    <input
                      type="text"
                      value={manualStudentForm.password}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, password: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Status Awal:</label>
                    <select
                      value={manualStudentForm.status}
                      onChange={(e) => setManualStudentForm({ ...manualStudentForm, status: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="active">✅ Langsung Aktif (Infaq Lunas Offline)</option>
                      <option value="pending">⏳ Menunggu Verifikasi Infaq</option>
                    </select>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-emerald-950/20"
                    >
                      Simpan Santri
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* POPUP DOCUMENT PREVIEW FOR CMS */}
      <FilePreviewModal
        isOpen={Boolean(cmsPreviewFile)}
        onClose={() => setCmsPreviewFile(null)}
        file={cmsPreviewFile}
      />

      {/* POPUP RAPOR & NILAI BELAJAR SANTRI */}
      <StudentReportModal
        isOpen={Boolean(selectedReportStudent)}
        onClose={() => setSelectedReportStudent(null)}
        student={selectedReportStudent}
        courses={courses}
        progress={allStudentsProgress[selectedReportStudent?.id] || { completedLessons: [], quizScores: {} }}
        teacherNote={teacherNotes[selectedReportStudent?.id] || ''}
        onSaveTeacherNote={onSaveTeacherNote}
      />

    </div>
  );
}
