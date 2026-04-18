import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, ShieldCheck, ShoppingBag, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await api.getProducts();
        setFeaturedProducts(products.filter((product) => product.is_featured).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  return (
    <div className="pb-24">
      <section className="relative min-h-[78vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
        <img
          src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1800&auto=format&fit=crop"
          alt="ZhasaVet"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-white space-y-7"
          >
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Ветеринарная аптека и клиника в Караганде
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Всё для здоровья
              <br />
              <span className="text-brand-teal">вашего питомца</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-slate-200 leading-8">
              Препараты, корма, консультации и удобный самовывоз. Витрина работает на Supabase и
              готова к реальному запуску без локального сервера.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/pharmacy"
                className="px-7 py-4 rounded-2xl bg-brand-teal text-white font-semibold shadow-xl shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors flex items-center justify-center gap-2"
              >
                Перейти в аптеку
                <ShoppingBag size={18} />
              </Link>
              <Link
                to="/contacts"
                className="px-7 py-4 rounded-2xl border border-white/20 bg-white/10 text-white font-semibold backdrop-blur hover:bg-white/15 transition-colors flex items-center justify-center"
              >
                Связаться с нами
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-14 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<ShieldCheck size={28} className="text-brand-teal" />}
            title="Проверенные препараты"
            description="Каталог собирается из Supabase и показывает только актуальные позиции без моков и заглушек."
          />
          <FeatureCard
            icon={<Stethoscope size={28} className="text-brand-teal" />}
            title="Практикующие специалисты"
            description="Консультируем по товарам и уходу за животными, а не просто публикуем карточки товаров."
          />
          <FeatureCard
            icon={<ShoppingBag size={28} className="text-brand-teal" />}
            title="Быстрый самовывоз"
            description="Корзина и checkout работают напрямую через Supabase, поэтому заказы сразу попадают в админку."
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-24 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              Популярные товары
            </h2>
            <p className="text-slate-500 mt-2">
              Блок заполняется товарами с флагом «показывать на главной».
            </p>
          </div>

          <Link
            to="/pharmacy"
            className="inline-flex items-center gap-2 text-brand-teal font-semibold hover:gap-3 transition-all"
          >
            Открыть весь каталог
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] rounded-[32px] border border-slate-200 bg-white flex items-center justify-center"
              >
                <Loader2 size={24} className="animate-spin text-slate-300" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
            На главной пока нет товаров. Добавьте несколько позиций в админ-панели или выполните сидирование базы.
          </div>
        )}
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
      <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-6 text-slate-500 mt-3">{description}</p>
    </div>
  );
}
