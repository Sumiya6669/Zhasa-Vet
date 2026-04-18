import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, ShieldCheck, ShoppingBag, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { api } from '../lib/api';
import { SITE_CONTACTS } from '../mockData';
import { Product } from '../types';

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'VeterinaryCare',
  name: 'ZhasaVet',
  url: 'https://zhasavet.kz/',
  image: 'https://zhasavet.kz/logo.png',
  logo: 'https://zhasavet.kz/logo.png',
  telephone: SITE_CONTACTS.phoneRaw,
  email: SITE_CONTACTS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Сталелитейная, 3/3А',
    addressLocality: 'Караганда',
    addressRegion: 'Карагандинская область',
    addressCountry: 'KZ',
  },
  areaServed: ['Караганда', 'Майкудук'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  sameAs: [SITE_CONTACTS.instagramUrl, SITE_CONTACTS.tiktokUrl, SITE_CONTACTS.whatsappUrl],
};

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
      <Seo
        title="Ветаптека и ветклиника в Караганде, Майкудук"
        description="ZhasaVet — ветаптека и ветеринарная клиника в Караганде, Майкудук. Лекарства для животных, корма для собак и кошек, прививки, консультации и самовывоз."
        keywords="ветаптека Караганда, ветеринарная аптека Караганда, ветклиника Караганда, ветеринар Майкудук, лекарства для животных Караганда, прививки собакам кошкам Караганда"
        canonicalPath="/"
        jsonLd={homeSchema}
      />

      <section className="relative flex min-h-[78vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
        <img
          src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1800&auto=format&fit=crop"
          alt="Ветаптека и ветклиника ZhasaVet в Караганде, Майкудук"
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
              Ветаптека Караганда и ветклиника Майкудук
            </span>
            <h1 className="text-5xl font-display font-bold leading-tight md:text-7xl">
              Лекарства для животных, корма и ветеринарная помощь
              <br />
              <span className="text-brand-teal">в Караганде рядом с вами</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              ZhasaVet — ветеринарная аптека и клиника в Майкудуке, где можно купить лекарства
              для животных, корм для собак и кошек, товары для КРС и МРС, а также записаться на
              приём, вакцинацию и консультацию. Мы находимся по адресу {SITE_CONTACTS.address} и
              работаем {SITE_CONTACTS.hours.toLowerCase()}.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/pharmacy"
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-7 py-4 font-semibold text-white shadow-xl shadow-brand-teal/20 transition-colors hover:bg-brand-teal-dark"
              >
                Перейти в ветаптеку
                <ShoppingBag size={18} />
              </Link>
              <Link
                to="/services"
                className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Посмотреть услуги клиники
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck size={28} className="text-brand-teal" />}
            title="Лекарства и корма в наличии"
            description="В каталоге собраны востребованные товары для собак, кошек, птиц, лошадей, КРС и МРС: от базовой аптечки до кормов и профилактики."
          />
          <FeatureCard
            icon={<Stethoscope size={28} className="text-brand-teal" />}
            title="Ветеринар Майкудук"
            description="Подскажем по профилактике, прививкам, уходу и домашней аптечке, чтобы вы быстрее поняли, что нужно питомцу именно сейчас."
          />
          <FeatureCard
            icon={<ShoppingBag size={28} className="text-brand-teal" />}
            title="Самовывоз в Караганде"
            description="Оформляйте заказ онлайн и забирайте нужные товары в удобное время. Подтвердим наличие и подготовим заказ заранее."
          />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-display font-bold text-slate-900 md:text-4xl">
            Ветеринарная аптека в Караганде для повседневного ухода и профилактики
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-500 md:text-lg">
            В ZhasaVet удобно купить корм для собак и кошек в Караганде, подобрать лекарства для
            животных, средства от паразитов, товары для фермерских хозяйств и популярные позиции,
            которые часто ищут по запросам Royal Canin Караганда, Hill&apos;s Караганда и Frontline
            Караганда. Мы делаем упор на понятный ассортимент, живую консультацию и локальный
            сервис для района Майкудук.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl space-y-10 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 md:text-4xl">
              Популярные товары ветаптеки в Караганде
            </h2>
            <p className="mt-2 text-slate-500">
              Подборка востребованных позиций для домашней аптечки, сезонной защиты, кормления и
              ежедневного ухода за животными.
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
            Витрина сейчас обновляется. Популярные товары снова появятся здесь после публикации в
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
