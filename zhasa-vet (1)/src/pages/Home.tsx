import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Stethoscope, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../mockData';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { api } from '../lib/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(MOCK_PRODUCTS.filter(p => p.is_featured));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.getProducts();
        if (data && data.length > 0) {
          setFeaturedProducts(data.filter(p => p.is_featured).slice(0, 4));
        }
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent z-10" />
        <img 
          src="https://picsum.photos/seed/vetclinic/1920/1080" 
          alt="Vet Clinic" 
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Забота о тех, кто <br />
              <span className="text-brand-teal">не может сказать.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200">
              Лучшая ветеринарная аптека и клиника в Караганде. <br />
              Профессиональный уход и качественные медикаменты для вашего питомца.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/pharmacy" className="px-8 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-teal/20">
                В аптеку <ShoppingBag size={20} />
              </Link>
              <Link to="/contacts" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                Связаться с нами
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<ShieldCheck size={32} className="text-brand-teal" />}
          title="Гарантия качества"
          desc="Все препараты сертифицированы и хранятся в строгом соответствии с нормами."
        />
        <FeatureCard 
          icon={<Stethoscope size={32} className="text-brand-teal" />}
          title="Профессионалы"
          desc="Наши врачи имеют многолетний опыт и искренне любят свою работу."
        />
        <FeatureCard 
          icon={<ShoppingBag size={32} className="text-brand-teal" />}
          title="Широкий выбор"
          desc="От редких лекарств до повседневных кормов и аксессуаров."
        />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Популярные товары</h2>
            <p className="text-slate-500">То, что чаще всего выбирают заботливые хозяева</p>
          </div>
          <Link to="/pharmacy" className="hidden md:flex items-center gap-2 text-brand-teal font-bold hover:gap-3 transition-all">
            Все товары <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] rounded-[40px] bg-slate-100 animate-pulse flex items-center justify-center">
                 <Loader2 className="text-slate-200 animate-spin" />
              </div>
            ))
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        <Link to="/pharmacy" className="md:hidden w-full py-4 border-2 border-brand-teal text-brand-teal rounded-2xl font-bold flex items-center justify-center gap-2">
          Все товары <ArrowRight size={20} />
        </Link>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-teal rounded-[48px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="relative z-10 flex-grow space-y-6 text-white text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">Ваш питомец <br /> <span className="text-slate-900 border-b-4 border-slate-900">в надежных руках</span></h2>
            <p className="text-xl opacity-90 max-w-xl">Мы объединили многолетний опыт и современные технологии, чтобы обеспечить лучший уход за теми, кто вам дорог.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl">
                Наши услуги
              </button>
              <button className="px-8 py-4 bg-white text-brand-teal hover:bg-slate-50 rounded-2xl font-bold transition-all shadow-xl">
                Записаться
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-1/3 group">
            <div className="absolute inset-0 bg-brand-orange rounded-[40px] rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20" />
            <img 
              src="https://picsum.photos/seed/doctor_dog/600/600" 
              alt="Doctor with dog" 
              referrerPolicy="no-referrer"
              className="relative z-10 w-full rounded-[40px] shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:border-brand-teal/20 transition-all hover:-translate-y-1">
      <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
