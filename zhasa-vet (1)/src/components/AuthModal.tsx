import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, LogIn, UserPlus, X } from 'lucide-react';
import { normalizeAuthIdentifier } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(false);
    }
  }, [initialMode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const loginIdentifier = normalizeAuthIdentifier(email);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: loginIdentifier,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        onClose();
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: loginIdentifier,
        password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.session) {
        setError('Регистрация создана. Подтвердите email через письмо от Supabase, затем выполните вход.');
      } else {
        setSuccess(true);
      }

      setTimeout(() => {
        setMode('login');
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-bold text-slate-900">
              {mode === 'login' ? 'С возвращением!' : 'Регистрация'}
            </h2>
            <p className="text-slate-500">
              {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт ZhasaVet'}
            </p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'register' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">E-mail или логин</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com или admin-zhasavet"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 border border-red-100"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 border border-green-100"
                >
                  <CheckCircle2 size={18} /> Регистрация успешна. Теперь можно войти.
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              className="w-full py-4 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl font-bold shadow-lg shadow-brand-teal/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </>
              )}
            </button>
          </form>

          {mode === 'login' && email.trim().toLowerCase() === 'admin-zhasavet' && (
            <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-700 border border-amber-100">
              <strong>Внимание:</strong> вы входите как администратор.
            </div>
          )}

          <div className="text-center text-xs text-slate-400">
            Продолжая, вы соглашаетесь с нашей <a href="#" className="underline">политикой конфиденциальности</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
