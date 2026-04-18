import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../App';
import { ADMIN_EMAIL, normalizeAuthIdentifier } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authLoading, isAdmin, navigate, user]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedIdentifier = normalizeAuthIdentifier(identifier);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedIdentifier,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user?.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error('Этот аккаунт не имеет прав администратора.');
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Не удалось войти в админ-панель.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl">
        <div className="bg-slate-950 px-8 py-10 text-white">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-display font-bold">Админ-панель</h1>
          <p className="mt-2 text-sm text-slate-300">
            Войдите, чтобы управлять товарами, блогом и заказами.
          </p>
        </div>

        <div className="space-y-6 p-8">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                E-mail
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="example@mail.com"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Пароль
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Введите пароль"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 font-semibold text-white transition-colors hover:bg-black disabled:opacity-70"
            >
              {loading || authLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Войти в панель'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
