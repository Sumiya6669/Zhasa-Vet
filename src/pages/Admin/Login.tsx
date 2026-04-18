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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[40px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="bg-slate-950 text-white px-8 py-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-display font-bold">Админ-панель</h1>
          <p className="text-sm text-slate-300 mt-2">
            Войдите под администраторским аккаунтом, чтобы управлять товарами, блогом и заказами.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-start gap-3">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Логин или e-mail
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="admin-zhasavet"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
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
                  placeholder="Введите пароль администратора"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full rounded-2xl bg-slate-950 py-4 text-white font-semibold hover:bg-black transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading || authLoading ? <Loader2 size={20} className="animate-spin" /> : 'Войти в панель'}
            </button>
          </form>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500 leading-6">
            Используйте <strong>{ADMIN_EMAIL}</strong> или короткий логин <strong>admin-zhasavet</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
