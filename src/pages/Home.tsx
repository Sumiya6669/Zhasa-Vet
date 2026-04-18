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
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-7 text-white"
          >
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Ветеринарная аптека и клиника в Караганде
            </span>
            <h1 className="text-5xl font-display font-bold leading-tight md:text-7xl">
              Всё нужное для здоровья
              <br />
              <span className="text-brand-teal">вашего питомца</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Подбираем препараты, корма и товары для ухода, объясняем всё простыми словами и
              помогаем оформить заказ без лишней суеты. ZhasaVet объединяет аптеку, консультации и
              удобный самовывоз в одном месте.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/pharmacy"
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-7 py-4 font-semibold text-white shadow-xl shadow-brand-teal/20 transition-colors hover:bg-brand-teal-dark"
              >
                Перейти в аптеку
                <ShoppingBag size={18} />
              </Link>
              <Link
                to="/services"
                className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Посмотреть услуги
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck size={28} className="text-brand-teal" />}
            title="Подобранный ассортимент"
            description="В каталоге собраны товары, которые действительно нужны для профилактики, лечения, ухода и спокойной домашней аптечки."
          />
          <FeatureCard
            icon={<Stethoscope size={28} className="text-brand-teal" />}
            title="Понятные консультации"
            description="Помогаем владельцам разобраться в базовом уходе, вакцинации, рационе и сезонной защите без сложных терминов."
          />
          <FeatureCard
            icon={<ShoppingBag size={28} className="text-brand-teal" />}
            title="Быстрый самовывоз"
            description="Оформляйте заказ онлайн, а мы подготовим его к выдаче и заранее уточним удобное время получения."
          />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl space-y-10 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 md:text-4xl">
              Популярные товары
            </h2>
            <p className="mt-2 text-slate-500">
              Позиции, которые чаще всего выбирают для базового ухода, профилактики и домашней
              ветеринарной аптечки.
            </p>
          </div>

          <Link
            to="/pharmacy"
            className="inline-flex items-center gap-2 font-semibold text-brand-teal transition-all hover:gap-3"
          >
            Открыть весь каталог
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[380px] items-center justify-center rounded-[32px] border border-slate-200 bg-white"
              >
                <Loader2 size={24} className="animate-spin text-slate-300" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-slate-500">
            Витрина сейчас обновляется. Популярные товары появятся здесь сразу после публикации в
            каталоге.
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
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
