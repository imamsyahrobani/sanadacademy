import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { DEFAULT_USERS } from '../data/defaultUsers';
import { signUpWithEmail, signInWithEmail } from '../services/authService';

export default function LoginPage({ onLoginSuccess, theme, onToggleTheme }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [identifier, setIdentifier] = useState('santri@sanad.academy');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isDark = theme === 'dark';

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    password: ''
  });

  const getUsers = () => {
    const saved = localStorage.getItem('odoa_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(u => {
            const def = DEFAULT_USERS.find(d => d.id === u.id);
            if (def && u.email && u.email.endsWith('@odoa.com')) {
              return { ...u, email: def.email };
            }
            return u;
          });
        }
      } catch (e) {}
    }
    return DEFAULT_USERS;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await signInWithEmail(identifier.trim(), password);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMessage(err.message || 'Email/WhatsApp atau kata sandi tidak sesuai. Silakan periksa kembali.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regForm.name.trim() || !regForm.password.trim() || (!regForm.email.trim() && !regForm.whatsapp.trim())) {
      setErrorMessage('Harap lengkapi semua kolom pendaftaran.');
      return;
    }

    try {
      await signUpWithEmail({
        email: regForm.email.trim() || `${regForm.whatsapp}@sanad.academy`,
        password: regForm.password,
        fullName: regForm.name.trim(),
        phone: regForm.whatsapp.trim()
      });
      setSuccessMessage('Alhamdulillah! Pendaftaran berhasil. Akun Anda menunggu verifikasi infaq oleh Ustadz.');
      setRegForm({ name: '', whatsapp: '', email: '', password: '' });
      setIsRegisterMode(false);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mendaftar. Coba lagi.');
    }
  };

  const handleQuickLogin = (demoUser) => {
    const users = getUsers();
    const freshUser = users.find(u => u.id === demoUser.id) || demoUser;
    onLoginSuccess(freshUser);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative">
      
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-2xl border transition flex items-center justify-center bg-white hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-amber-400 shadow-md"
          title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/20 border-2 border-amber-500/40 bg-white p-1 flex items-center justify-center">
            <img src="/logo-sanad.jpg" alt="Sanad Academy" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <h1 className="text-2xl font-black tracking-wide bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 dark:from-emerald-400 dark:via-teal-200 dark:to-amber-300 bg-clip-text text-transparent">
            SANAD ACADEMY
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Platform Pembelajaran Islam Online
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-md transition">
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                !isRegisterMode 
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-md shadow-emerald-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Masuk Member
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                isRegisterMode 
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-md shadow-emerald-900/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Daftar Santri
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/40 p-3 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 p-3 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isRegisterMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Email atau No. WhatsApp Terdaftar:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="nama@email.com atau 0812xxxx"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2"
              >
                <span>Masuk ke Ruang Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-amber-500 inline-block mr-1.5 mb-0.5" />
                Akses materi terbuka untuk santri yang telah terverifikasi oleh pengurus Rumah Qur'an.
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Nama Lengkap:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Contoh: Muhammad Yusuf"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Nomor WhatsApp Aktif:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={regForm.whatsapp}
                    onChange={(e) => setRegForm({ ...regForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Email:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="yusuf@email.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block">Kata Sandi:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-2xl transition shadow-lg shadow-emerald-950/20"
              >
                Daftarkan Akun Santri
              </button>
            </form>
          )}

          {/* Quick Demo Access Pills */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-center">
              ⚡ Akses Cepat Akun Demo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[0])}
                className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-emerald-500/30 p-2 rounded-xl text-left transition group"
              >
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold block w-max mb-1">
                  Santri Aktif
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block truncate">
                  Ahmad Al-Ghifari
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[2])}
                className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-amber-500/30 p-2 rounded-xl text-left transition group"
              >
                <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold block w-max mb-1">
                  Santri Pending
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 block truncate">
                  Zaidan Rabbani
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin(DEFAULT_USERS[1])}
                className="bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-850 border border-teal-500/30 p-2 rounded-xl text-left transition group"
              >
                <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-300 px-1.5 py-0.5 rounded font-bold block w-max mb-1">
                  Pengajar (Admin)
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 block truncate">
                  Ustadz Hanif, Lc.
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
