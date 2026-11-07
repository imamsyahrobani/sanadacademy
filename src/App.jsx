import React, { useState, useEffect } from 'react';
import { initialCourses } from './data/initialCourses';
import { DEFAULT_USERS } from './data/defaultUsers';
import { getCurrentUser, signOut } from './services/authService';
import Header from './components/Header';
import CourseCatalog from './components/CourseCatalog';
import CoursePlayer from './components/CoursePlayer';
import AdminCMS from './components/AdminCMS';
import QuizModal from './components/QuizModal';
import CertificateModal from './components/CertificateModal';
import DiscussionModal from './components/DiscussionModal';
import QuranModal from './components/QuranModal';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ProfileModal from './components/ProfileModal';
import CloudStatusModal from './components/CloudStatusModal';
import PendingApprovalScreen from './components/PendingApprovalScreen';
import VerifyCertificateModal from './components/VerifyCertificateModal';
import { 
  getCourses, 
  seedInitialCoursesToSupabase, 
  syncLessonProgress, 
  syncQuizSubmission, 
  syncCertificate,
  getUserProgress,
  getUserNotes,
  syncNote,
  getUserCertificates
} from './services/courseService';
import { 
  BookOpen, 
  Play, 
  MessageSquare, 
  User, 
  Check, 
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function App() {
  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('odoa_theme') || 'dark';
  });

  // Apply theme to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('odoa_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('odoa_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_USERS[0];
  });

  // 1b. All Registered Users List (Persisted in localStorage)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('odoa_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_USERS;
  });

  useEffect(() => {
    localStorage.setItem('odoa_registered_users', JSON.stringify(users));
  }, [users]);

  // 2. Kursus State (Persisted in localStorage)
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('odoa_lms_courses_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Perbarui link video demo jika masih menggunakan link dummy lama & file PDF
          const sanitized = parsed.map(c => ({
            ...c,
            modules: c.modules?.map(m => ({
              ...m,
              lessons: m.lessons?.map(l => {
                let updated = { ...l };
                if (updated.mediaUrl && updated.mediaUrl.includes('0bT4r_aZ_r8')) {
                  updated.mediaUrl = c.id === 'kursus-ruqyah-syariyyah' 
                    ? 'https://www.youtube.com/watch?v=voL_L9ZLLyA' 
                    : 'https://www.youtube.com/watch?v=zu6mOmxih8Y';
                }
                if (Array.isArray(updated.attachments)) {
                  updated.attachments = updated.attachments.map(att => {
                    if (att.name && att.name.includes('Rangkuman_Tadabbur_Sabar') && att.url && att.url.startsWith('data:')) {
                      return { ...att, url: '/docs/Rangkuman_Tadabbur_Sabar_Bab1.pdf' };
                    }
                    return att;
                  });
                }
                return updated;
              })
            }))
          }));

          // Merge initial courses jika ada penambahan kursus baru (Ruqyah, Fiqih, dll)
          const existingIds = new Set(sanitized.map(c => c.id));
          const newOnes = initialCourses.filter(c => !existingIds.has(c.id));
          return newOnes.length > 0 ? [...sanitized, ...newOnes] : sanitized;
        }
      } catch (e) {
        console.error("Gagal load saved courses:", e);
      }
    }
    return initialCourses;
  });

  // 3. Student Progress State (Persisted in localStorage)
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('odoa_lms_completed_lessons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['les-1-1'];
  });

  // 4. Quiz Scores State (Persisted in localStorage)
  const [quizScores, setQuizScores] = useState(() => {
    const saved = localStorage.getItem('odoa_lms_quiz_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // 5. Student Notes State (Persisted in localStorage)
  const [studentNotes, setStudentNotes] = useState(() => {
    const saved = localStorage.getItem('odoa_lms_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'les-1-1': 'Pelajaran berharga: Shalat adalah charger energi batin. Latih jeda 3 menit setelah salam.'
    };
  });

  // 6. Rekap Progres Seluruh Santri untuk Guru (Persisted in localStorage)
  const [allStudentsProgress, setAllStudentsProgress] = useState(() => {
    const saved = localStorage.getItem('odoa_all_students_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return {
      'user_1': {
        completedLessons: ['les-1-1', 'les-1-2'],
        quizScores: { 'quiz-1': 100 }
      },
      'user_3': {
        completedLessons: ['les-1-1'],
        quizScores: { 'quiz-1': 60 }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('odoa_all_students_progress', JSON.stringify(allStudentsProgress));
  }, [allStudentsProgress]);

  // 7. Catatan Bimbingan Ustadz per Santri
  const [teacherNotes, setTeacherNotes] = useState(() => {
    const saved = localStorage.getItem('odoa_teacher_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return {
      'user_1': 'Alhamdulillah Ahmad sangat istiqomah. Pemahaman konsep sabar dan dzikir sangat baik.'
    };
  });

  useEffect(() => {
    localStorage.setItem('odoa_teacher_notes', JSON.stringify(teacherNotes));
  }, [teacherNotes]);

  const handleSaveTeacherNote = (studentId, note) => {
    setTeacherNotes(prev => ({
      ...prev,
      [studentId]: note
    }));
    showToast("Catatan bimbingan ustadz berhasil disimpan!");
  };

  // Navigation & Role State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' or 'player'
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  // Modal States
  const [activeQuiz, setActiveQuiz] = useState(null); // { quiz, moduleTitle }
  const [certCourse, setCertCourse] = useState(null); // course object
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showQuranModal, setShowQuranModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifySerial, setVerifySerial] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // 8. Database Sertifikat Kelulusan Resmi
  const [issuedCertificates, setIssuedCertificates] = useState(() => {
    const saved = localStorage.getItem('odoa_issued_certificates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        serialNumber: 'SANAD-KUR-AHM-2026',
        courseId: 'kursus-sabar',
        courseTitle: 'Tadabbur Tematik: Manajemen Hati & Sabar',
        studentName: 'Ahmad Al-Ghifari',
        instructorName: 'Ustadz Hanif Al-Fatih, Lc.',
        issuedDate: '15 Januari 2026'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('odoa_issued_certificates', JSON.stringify(issuedCertificates));
  }, [issuedCertificates]);

  // Deteksi URL parameter "?verify=SERIAL_NUMBER" saat dipindai kamera HP
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlVerifyParam = params.get('verify');
      if (urlVerifyParam) {
        setVerifySerial(urlVerifyParam);
        setShowVerifyModal(true);
      }
    }
  }, []);

  // Handler Buka & Daftarkan Sertifikat
  const handleOpenCertificate = (course) => {
    const cleanStudent = (currentUser?.name || 'STN').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
    const cleanCourse = (course.id || 'CRS').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
    const generatedSerial = course.serialNumber || `SANAD-${cleanCourse}-${cleanStudent}-2026`;

    setIssuedCertificates(prev => {
      if (!prev.some(c => c.serialNumber === generatedSerial)) {
        const newCert = {
          serialNumber: generatedSerial,
          courseId: course.id,
          courseTitle: course.title,
          studentName: currentUser?.name || 'Sahabat Santri Sanad Academy',
          instructorName: course.instructor || 'Ustadz Pembina',
          issuedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
        syncCertificate(newCert);
        return [...prev, newCert];
      }
      return prev;
    });

    setCertCourse({ ...course, serialNumber: generatedSerial });
  };

  // Sinkronisasi data awal dari Cloud Supabase (jika terhubung)
  useEffect(() => {
    async function loadCloudData() {
      try {
        const cloudCourses = await getCourses();
        if (cloudCourses && cloudCourses.length > 0) {
          setCourses(cloudCourses);
        }
      } catch (err) {
        console.warn("Gagal memuat kursus dari cloud:", err);
      }
    }
    loadCloudData();
  }, []);

  // Persist current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('odoa_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('odoa_current_user');
    }
  }, [currentUser]);

  // Persist courses changes
  useEffect(() => {
    localStorage.setItem('odoa_lms_courses_v4', JSON.stringify(courses));
  }, [courses]);

  // Persist completed lessons
  useEffect(() => {
    localStorage.setItem('odoa_lms_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Persist quiz scores
  useEffect(() => {
    localStorage.setItem('odoa_lms_quiz_scores', JSON.stringify(quizScores));
  }, [quizScores]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('odoa_lms_notes', JSON.stringify(studentNotes));
  }, [studentNotes]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAdminMode(false);
    showToast(`Ahlan wa Sahlan, ${user.name}!`);
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    setIsAdminMode(false);
    setShowProfileModal(false);
    showToast("Anda telah keluar dari akun.");
  // Sync progres & catatan dari cloud saat user login
  useEffect(() => {
    if (currentUser?.id) {
      getUserProgress(currentUser.id).then((ids) => {
        if (ids && ids.length > 0) setCompletedLessons(ids);
      });
      getUserNotes(currentUser.id).then((notes) => {
        if (notes && Object.keys(notes).length > 0) setStudentNotes(notes);
      });
      getUserCertificates(currentUser.id).then((certs) => {
        if (certs && certs.length > 0) setIssuedCertificates(certs);
      });
    }
  }, [currentUser?.id]);

  // Sync catatan ke cloud saat berubah
  useEffect(() => {
    if (currentUser?.id && studentNotes) {
      Object.entries(studentNotes).forEach(([lessonId, content]) => {
        syncNote(currentUser.id, lessonId, content);
      });
    }
  }, [studentNotes, currentUser?.id]);
  };

  const handleUpdateName = (newName) => {
    const updated = { ...currentUser, name: newName };
    setCurrentUser(updated);
    showToast("Nama profil berhasil diperbarui!");
  };

  // Toggle Lesson Complete
  const handleToggleCompleteLesson = (lessonId) => {
    let nextCompleted;
    if (completedLessons.includes(lessonId)) {
      nextCompleted = completedLessons.filter(id => id !== lessonId);
      showToast("Tanda selesai dibatalkan.");
    } else {
      nextCompleted = [...completedLessons, lessonId];
      showToast("Alhamdulillah! Pelajaran ditandai selesai.");
      syncLessonProgress(currentUser?.id, lessonId);
    }
    setCompletedLessons(nextCompleted);

    if (currentUser?.id) {
      setAllStudentsProgress(prev => ({
        ...prev,
        [currentUser.id]: {
          ...(prev[currentUser.id] || {}),
          completedLessons: nextCompleted
        }
      }));
    }
  };

  // Handle Save Note
  const handleSaveNote = (lessonId, noteText) => {
    setStudentNotes(prev => ({
      ...prev,
      [lessonId]: noteText
    }));
  };

  // Handle Quiz Complete
  const handleQuizComplete = (score, isPassed) => {
    if (activeQuiz && activeQuiz.quiz) {
      const qId = activeQuiz.quiz.id;
      setQuizScores(prev => ({
        ...prev,
        [qId]: score
      }));

      if (isPassed) {
        showToast(`MasyaAllah! Anda lulus kuis dengan skor ${score}!`);
      } else {
        showToast(`Kuis selesai dengan skor ${score}.`);
      }
      syncQuizSubmission(currentUser?.id, qId, score, isPassed);

      if (currentUser?.id) {
        setAllStudentsProgress(prev => ({
          ...prev,
          [currentUser.id]: {
            ...(prev[currentUser.id] || {}),
            quizScores: {
              ...((prev[currentUser.id] && prev[currentUser.id].quizScores) || {}),
              [qId]: score
            }
          }
        }));
      }
    }
  };

  // Course Selection Handler
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // IF NOT LOGGED IN, RENDER AUTH PAGE
  if (!currentUser) {
    if (!showLogin) {
      return <LandingPage onEnter={() => setShowLogin(true)} />;
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // IF USER IS PENDING VERIFICATION (BELUM LUNAS / MENUNGGU AKTIVASI INFAQ)
  if (currentUser.role === 'santri' && currentUser.status === 'pending') {
    return (
      <PendingApprovalScreen
        user={currentUser}
        onRefreshStatus={() => {
          const saved = localStorage.getItem('odoa_registered_users');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              const found = parsed.find(u => u.id === currentUser.id);
              if (found) {
                if (found.status === 'active') {
                  setCurrentUser(found);
                  showToast("Alhamdulillah! Akun Anda telah diaktifkan oleh pengajar.");
                  return;
                }
              }
            } catch (e) {}
          }
          showToast("Status akun masih dalam proses verifikasi infaq.");
        }}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl border border-emerald-400/40 animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentUser={currentUser}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
        onNavigateHome={() => {
          setIsAdminMode(false);
          setCurrentView('catalog');
        }}
        onOpenQuranLookup={() => setShowQuranModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-4xl px-4 pt-5 pb-24">
        
        {isAdminMode && currentUser.role === 'admin' ? (
          /* ADMIN CMS VIEW */
          <AdminCMS
            courses={courses}
            onUpdateCourses={setCourses}
            onShowToast={showToast}
            users={users}
            onUpdateUsers={(updatedUsers) => {
              setUsers(updatedUsers);
              // Jika status user yang sedang login diubah, perbarui currentUser
              const currentInList = updatedUsers.find(u => u.id === currentUser?.id);
              if (currentInList) {
                setCurrentUser(currentInList);
              }
            }}
            allStudentsProgress={allStudentsProgress}
            teacherNotes={teacherNotes}
            onSaveTeacherNote={handleSaveTeacherNote}
          />
        ) : (
          /* STUDENT LMS VIEW */
          currentView === 'catalog' ? (
            <CourseCatalog
              courses={courses}
              completedLessons={completedLessons}
              quizScores={quizScores}
              onSelectCourse={handleSelectCourse}
              onOpenCertificate={handleOpenCertificate}
            />
          ) : (
            <CoursePlayer
              course={selectedCourse}
              completedLessons={completedLessons}
              quizScores={quizScores}
              onToggleCompleteLesson={handleToggleCompleteLesson}
              onOpenQuiz={(quiz, moduleTitle) => setActiveQuiz({ quiz, moduleTitle })}
              onOpenCertificate={handleOpenCertificate}
              onBack={() => setCurrentView('catalog')}
              studentNotes={studentNotes}
              onSaveNote={handleSaveNote}
            />
          )
        )}

      </main>

      {/* Modals */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz.quiz}
          moduleTitle={activeQuiz.moduleTitle}
          onClose={() => setActiveQuiz(null)}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {certCourse && (
        <CertificateModal
          course={certCourse}
          studentName={currentUser.name}
          onClose={() => setCertCourse(null)}
          onVerifyClick={(serial) => {
            setVerifySerial(serial);
            setShowVerifyModal(true);
          }}
        />
      )}

      <DiscussionModal
        isOpen={showDiscussion}
        onClose={() => setShowDiscussion(false)}
        isAdminMode={isAdminMode && currentUser.role === 'admin'}
        onShowToast={showToast}
      />

      <QuranModal
        isOpen={showQuranModal}
        onClose={() => setShowQuranModal(false)}
      />

      <CloudStatusModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
      />

      <VerifyCertificateModal
        isOpen={showVerifyModal}
        onClose={() => {
          setShowVerifyModal(false);
          if (typeof window !== 'undefined' && window.history.replaceState) {
            const cleanUrl = new URL(window.location);
            cleanUrl.searchParams.delete('verify');
            window.history.replaceState({}, '', cleanUrl);
          }
        }}
        verifySerial={verifySerial}
        certificates={issuedCertificates}
        onOpenCertificate={handleOpenCertificate}
      />

      {showProfileModal && (
        <ProfileModal
          user={currentUser}
          completedCount={completedLessons.length}
          quizCount={Object.keys(quizScores).length}
          courses={courses}
          completedLessons={completedLessons}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
          onUpdateName={handleUpdateName}
          onOpenCertificate={handleOpenCertificate}
          onOpenVerification={() => {
            setVerifySerial('');
            setShowVerifyModal(true);
          }}
        />
      )}

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-center py-2 px-4 shadow-xl transition-colors">
        <div className="w-full max-w-md flex justify-around items-center">
          
          <button
            onClick={() => {
              setIsAdminMode(false);
              setCurrentView('catalog');
            }}
            className={`flex flex-col items-center gap-1 transition ${
              !isAdminMode && currentView === 'catalog' 
                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Katalog</span>
          </button>

          <button
            onClick={() => {
              setIsAdminMode(false);
              setCurrentView('player');
            }}
            className={`flex flex-col items-center gap-1 transition ${
              !isAdminMode && currentView === 'player' 
                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="text-[10px]">Kelas Belajar</span>
          </button>

          <button
            onClick={() => setShowDiscussion(true)}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px]">Forum Tanya</span>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profil Saya</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
