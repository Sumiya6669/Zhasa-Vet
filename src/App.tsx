import { Suspense, createContext, lazy, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Instagram,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Settings,
  ShoppingCart,
  User as UserIcon,
  X,
} from 'lucide-react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import AuthModal from './components/AuthModal';
import TikTokIcon from './components/TikTokIcon';
import { isAdminEmail } from './lib/auth';
import { SITE_CONTACTS, buildWhatsAppLink } from './mockData';
import { supabase } from './lib/supabase';
import { CartItem, Product } from './types';

const About = lazy(() => import('./pages/About'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const Blog = lazy(() => import('./pages/Blog'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Home = lazy(() => import('./pages/Home'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const Services = lazy(() => import('./pages/Services'));

const CART_STORAGE_KEY = 'zhasavet-cart';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  signOut: () => Promise<void>;
  openAuth: (mode?: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthContext.Provider');
  }

  return context;
}

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
} | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartContext.Provider');
  }

  return context;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-brand-teal" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  useEffect(() => {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) {
      return;
    }

    try {
      setCart(JSON.parse(rawCart) as CartItem[]);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = isAdminEmail(user?.email);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, authLoading, signOut, openAuth }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
        <BrowserRouter>
          <AppShell
            authModal={authModal}
            onCloseAuth={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
          />
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

function AppShell({
  authModal,
  onCloseAuth,
}: {
  authModal: { isOpen: boolean; mode: 'login' | 'register' };
  onCloseAuth: () => void;
}) {
  const location = useLocation();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDashboardRoute = location.pathname === '/admin/dashboard';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {!isDashboardRoute && (
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} cartCount={cart.length} />
      )}

      <main className={`flex-grow ${isDashboardRoute ? '' : 'pt-20'}`}>
        <Suspense fallback={<RouteLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isDashboardRoute && <Footer />}

      <AuthModal isOpen={authModal.isOpen} initialMode={authModal.mode} onClose={onCloseAuth} />
    </div>
  );
}

function Navbar({
  isMenuOpen,
  setIsMenuOpen,
  cartCount,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  cartCount: number;
}) {
  const location = useLocation();
  const { user, isAdmin, signOut, openAuth } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  const links = [
    { name: 'Главная', path: '/' },
    { name: 'Аптека', path: '/pharmacy' },
    { name: 'Услуги', path: '/services' },
    { name: 'О нас', path: '/about' },
    { name: 'Врачи', path: '/doctors' },
    { name: 'Блог', path: '/blog' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="ZhasaVet"
            className="h-14 w-auto object-contain"
            onError={(event) => {
              (event.target as HTMLImageElement).hidden = true;
            }}
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.path
                  ? 'text-brand-teal'
                  : 'text-slate-600 hover:text-brand-teal'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/checkout"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-teal/20 hover:text-brand-teal"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-teal/20 hover:text-brand-teal"
              >
                <UserIcon size={18} />
                <span className="max-w-[160px] truncate">
                  {isAdmin ? 'Администратор' : user.email?.split('@')[0] || 'Профиль'}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                  >
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Settings size={16} className="text-brand-teal" />
                        Панель управления
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        void signOut();
                        setShowProfileMenu(false);
                      }}
                      className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Выйти
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-teal"
              >
                Вход
              </button>
              <button
                onClick={() => openAuth('register')}
                className="rounded-2xl bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition-colors hover:bg-brand-teal-dark"
              >
                Регистрация
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/checkout"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-slate-200 bg-white md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold text-brand-teal hover:bg-brand-teal/5"
                    >
                      Панель управления
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      void signOut();
                      setIsMenuOpen(false);
                    }}
                    className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      openAuth('login');
                      setIsMenuOpen(false);
                    }}
                    className="rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-slate-700"
                  >
                    Вход
                  </button>
                  <button
                    onClick={() => {
                      openAuth('register');
                      setIsMenuOpen(false);
                    }}
                    className="rounded-2xl bg-brand-teal py-3 text-sm font-semibold text-white"
                  >
                    Регистрация
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center text-white">
            <img
              src="/logo.svg"
              alt="ZhasaVet"
              className="h-12 w-auto object-contain"
              onError={(event) => {
                (event.target as HTMLImageElement).hidden = true;
              }}
            />
          </div>
          <p className="text-sm leading-6">
            Ветеринарная аптека и клиника в Караганде. Товары для ухода, консультации, запись на
            услуги и удобный самовывоз в одном месте.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Разделы</h4>
          <div className="space-y-2 text-sm">
            <Link to="/pharmacy" className="block hover:text-brand-teal">
              Аптека
            </Link>
            <Link to="/services" className="block hover:text-brand-teal">
              Услуги
            </Link>
            <Link to="/blog" className="block hover:text-brand-teal">
              Блог
            </Link>
            <Link to="/contacts" className="block hover:text-brand-teal">
              Контакты
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Контакты</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-brand-teal" />
              <a href={`tel:${SITE_CONTACTS.phoneRaw}`} className="hover:text-brand-teal">
                {SITE_CONTACTS.phoneDisplay}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-1 flex-shrink-0 text-brand-teal" />
              <span>{SITE_CONTACTS.address}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Соцсети</h4>
          <div className="flex gap-3">
            <a
              href={SITE_CONTACTS.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition-colors hover:bg-brand-teal"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-white" />
            </a>
            <a
              href={SITE_CONTACTS.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition-colors hover:bg-brand-teal"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-[18px] w-[18px] text-white" />
            </a>
            <a
              href={buildWhatsAppLink('Здравствуйте! Хочу связаться с ZhasaVet.')}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition-colors hover:bg-brand-teal"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs">
          © 2026 ZhasaVet. Все права защищены.
        </div>
      </div>
    </footer>
  );
}

function RouteLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 size={30} className="animate-spin text-brand-teal" />
    </div>
  );
}
