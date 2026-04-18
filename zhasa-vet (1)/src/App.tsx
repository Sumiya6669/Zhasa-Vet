import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, Phone, MapPin, Instagram, Facebook, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { CartItem, Product } from './types';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthModal from './components/AuthModal';
import { isAdminEmail } from './lib/auth';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  openAuth: (mode?: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- Cart Context ---
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
} | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// --- Admin Guard ---
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth settled
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

// --- Pages ---
import Home from './pages/Home';
import Pharmacy from './pages/Pharmacy';
import Services from './pages/Services';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Blog from './pages/Blog';
import Contacts from './pages/Contacts';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import Checkout from './pages/Checkout';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({
    isOpen: false,
    mode: 'login'
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = isAdminEmail(user?.email);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut, openAuth }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} cartCount={cart.length} />
            
            <main className="flex-grow pt-20">
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
                  <Route path="/admin/dashboard" element={
                    <AdminGuard>
                      <AdminDashboard />
                    </AdminGuard>
                  } />
                </Routes>
              </AnimatePresence>
            </main>

            <Footer />

            <AuthModal 
              isOpen={authModal.isOpen}
              initialMode={authModal.mode}
              onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
            />
          </div>
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

function Navbar({ isMenuOpen, setIsMenuOpen, cartCount }: { isMenuOpen: boolean, setIsMenuOpen: (v: boolean) => void, cartCount: number }) {
  const location = useLocation();
  const { user, isAdmin, signOut, openAuth } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="ZhasaVet Logo" 
            referrerPolicy="no-referrer"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).hidden = true;
            }}
          />
          <span className="font-display font-bold text-2xl tracking-tight text-slate-800">
            Zhasa<span className="text-brand-teal">Vet</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`font-medium transition-colors hover:text-brand-teal ${location.pathname === link.path ? 'text-brand-teal' : 'text-slate-600'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <Link to="/pharmacy" className="relative p-2 text-slate-600 hover:text-brand-teal transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-all"
                >
                  <UserIcon size={18} className="text-brand-teal" />
                  <span className="max-w-[120px] truncate">
                    {isAdmin ? 'Админ' : (user.email?.split('@')[0] || 'Профиль')}
                  </span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                    >
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings size={16} className="text-brand-teal" /> Панель управления
                        </Link>
                      )}
                      <button 
                        onClick={() => { signOut(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Выйти
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openAuth('login')}
                  className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-brand-teal transition-colors"
                >
                  Войти
                </button>
                <button 
                  onClick={() => openAuth('register')}
                  className="px-5 py-2 bg-brand-teal text-white rounded-xl text-sm font-bold hover:bg-brand-teal-dark shadow-md shadow-brand-teal/20 transition-all"
                >
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/pharmacy" className="relative p-2 text-slate-600">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white border-b shadow-lg md:hidden py-4 px-4 flex flex-col gap-2"
          >
            {links.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium py-3 border-b border-slate-50"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                  <UserIcon className="text-brand-teal" size={20} />
                  <span className="font-bold">{user.email}</span>
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-brand-teal font-bold"
                  >
                    <Settings size={20} /> Админ-панель
                  </Link>
                )}
                <button 
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-red-600 font-bold flex items-center gap-3"
                >
                  <LogOut size={20} /> Выйти
                </button>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => { openAuth('login'); setIsMenuOpen(false); }}
                  className="py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl"
                >
                  Войти
                </button>
                <button 
                  onClick={() => { openAuth('register'); setIsMenuOpen(false); }}
                  className="py-4 bg-brand-teal text-white font-bold rounded-2xl"
                >
                  Регистрация
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="ZhasaVet Logo" 
              referrerPolicy="no-referrer"
              className="h-10 w-auto object-contain brightness-0 invert" 
              onError={(e) => {
                (e.target as HTMLImageElement).hidden = true;
              }}
            />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Zhasa<span className="text-brand-teal">Vet</span>
            </span>
          </Link>
          <p className="text-sm">
            Забота о ваших питомцах — наша главная миссия. Лучшие лекарства и профессиональные врачи в одном месте.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/pharmacy" className="hover:text-brand-teal">Аптека</Link></li>
            <li><Link to="/doctors" className="hover:text-brand-teal">Врачи</Link></li>
            <li><Link to="/blog" className="hover:text-brand-teal">Блог</Link></li>
            <li><Link to="/contacts" className="hover:text-brand-teal">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 font-medium">
              <Phone size={16} className="text-brand-teal" />
              +7 (707) 123-4567
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-brand-teal mt-1 flex-shrink-0" />
              Караганда, <br />ул. Сталелитейная, 3/3А
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Соцсети</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-teal transition-colors">
              <Instagram size={20} className="text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-teal transition-colors">
              <Facebook size={20} className="text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        <p>&copy; 2024 ZhasaVet. Все права защищены. Разработано с любовью к животным.</p>
      </div>
    </footer>
  );
}
