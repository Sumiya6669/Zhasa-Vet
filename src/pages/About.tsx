import { Heart, ShieldCheck, Stethoscope, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:py-16">
      <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
            О нас
          </span>
          <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
            ZhasaVet — место, где о животных заботятся спокойно, бережно и по делу
          </h1>
          <p className="text-lg leading-8 text-slate-500">
            Мы создали ZhasaVet как понятное пространство для владельцев животных: здесь можно
            выбрать нужные товары, записаться на базовые услуги, получить консультацию и не терять
            время на долгие поиски. Нам важно, чтобы помощь была не формальной, а действительно
            полезной в ежедневной жизни владельца.
          </p>
          <p className="text-lg leading-8 text-slate-500">
            Мы делаем ставку на ясные рекомендации, аккуратную профилактику и ассортимент, который
            помогает в реальных задачах: уход, питание, сезонная защита, домашняя аптечка и
            сопровождение после приёма.
          </p>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-slate-200 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=1400&auto=format&fit=crop"
            alt="Ветеринарная клиника"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ValueCard
          icon={<Heart size={24} className="text-brand-teal" />}
          title="Забота"
          description="Мы думаем не только о лечении, но и о том, как владельцу будет удобно пройти весь путь от вопроса до решения."
        />
        <ValueCard
          icon={<ShieldCheck size={24} className="text-brand-teal" />}
          title="Надёжность"
          description="Подбираем понятные товары и профилактические решения, которые можно использовать в реальной ежедневной практике."
        />
        <ValueCard
          icon={<Stethoscope size={24} className="text-brand-teal" />}
          title="Практика"
          description="Даем советы, которые помогают здесь и сейчас: что проверить, как наблюдать, когда приезжать и что держать дома."
        />
        <ValueCard
          icon={<Target size={24} className="text-brand-teal" />}
          title="Фокус"
          description="Для нас важен спокойный клиентский путь: понятный каталог, ясная запись на услуги и удобный самовывоз без лишнего стресса."
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
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
