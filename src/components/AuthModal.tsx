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

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMode(initialMode);
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

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
          emailRedirectTo:
            typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        setSuccessMessage('Аккаунт создан. Теперь вы можете сразу войти в личный кабинет.');
      } else {
        setSuccessMessage(
          'Регистрация завершена. Если для аккаунтов включено подтверждение почты, подтвердите email и затем войдите.',
        );
      }

      setTimeout(() => {
        setMode('login');
        setSuccessMessage(null);
      }, 2400);
    } catch (err: any) {
      setError(err.message || 'Не удалось выполнить действие. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        className="relative w-full max-w-md rounded-[36px] border border-white/40 bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-display font-bold text-slate-900">
              {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login'
                ? 'Войдите, чтобы оформить заказ быстрее и видеть свой профиль.'
                : 'Зарегистрируйтесь, чтобы оформить заказ и пользоваться сайтом удобнее.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
                mode === 'login' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
                mode === 'register' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">E-mail или логин</label>
              <input
                type="text"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@mail.com или admin-zhasavet"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Пароль</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
              />
            </div>

            <AnimatePresence initial={false}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-brand-teal py-4 text-white font-semibold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                </>
              )}
            </button>
          </form>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 leading-5">
            Для входа в админ-панель используйте e-mail <strong>admin@zhasavet.kz</strong> или
            алиас <strong>admin-zhasavet</strong>.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
