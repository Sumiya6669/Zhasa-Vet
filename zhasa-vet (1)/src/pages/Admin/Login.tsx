import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock, User } from 'lucide-react';
import { useAuth } from '../../App';
import { ADMIN_EMAIL, normalizeAuthIdentifier } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailIdentifier = normalizeAuthIdentifier(username);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailIdentifier,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.user?.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error('Доступ запрещен. Войдите под аккаунтом администратора.');
      }

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Вход в панель</h2>
          <p className="text-slate-500">Только для авторизованных сотрудников</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Логин или E-mail</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin-zhasavet"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Войти в систему'}
          </button>
        </form>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-500">
          Вход доступен только для аккаунта <span className="font-semibold text-slate-700">{ADMIN_EMAIL}</span> или по алиасу <span className="font-semibold text-slate-700">admin-zhasavet</span>.
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
