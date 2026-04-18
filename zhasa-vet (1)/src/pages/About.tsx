import { Heart, ShieldCheck, Stethoscope, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
            О клинике
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
            ZhasaVet — ветеринарная помощь и аптечный каталог в одном месте
          </h1>
          <p className="text-lg leading-8 text-slate-500">
            Мы соединяем консультации, витрину товаров и понятный процесс оформления заказа. Сайт
            построен как рабочая продакшн-платформа: каталог, блог и админ-панель используют единый
            источник данных в Supabase.
          </p>
        </div>

        <div className="rounded-[36px] overflow-hidden border border-slate-200 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=1400&auto=format&fit=crop"
            alt="Ветеринарная клиника"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <ValueCard
          icon={<Heart size={24} className="text-brand-teal" />}
          title="Забота"
          description="Сайт и процессы выстроены так, чтобы владельцу было легко быстро найти нужный товар или консультацию."
        />
        <ValueCard
          icon={<ShieldCheck size={24} className="text-brand-teal" />}
          title="Надёжность"
          description="Каталог, заказы и блог работают на одной базе данных и не зависят от локального сервера."
        />
        <ValueCard
          icon={<Stethoscope size={24} className="text-brand-teal" />}
          title="Практика"
          description="Мы ориентируемся на реальные сценарии: профилактика, уход, базовая терапия и самовывоз."
        />
        <ValueCard
          icon={<Target size={24} className="text-brand-teal" />}
          title="Фокус"
          description="В центре проекта — понятный клиентский путь от выбора товара до обработки заказа в админке."
        />
      </section>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="text-sm leading-6 text-slate-500 mt-3">{description}</p>
    </div>
  );
}
