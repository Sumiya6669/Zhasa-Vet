import { Award, Calendar, GraduationCap, MessageCircle } from 'lucide-react';
import Seo from '../components/Seo';
import { MOCK_DOCTORS, buildWhatsAppLink } from '../mockData';

export default function Doctors() {
  const doctor = MOCK_DOCTORS[0];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <Seo
        title="Ветеринар Оржов Яша Насирбекович — приём в Караганде, Майкудук"
        description="Оржов Яша Насирбекович — ветеринарный врач ZhasaVet в Караганде, Майкудук. Приём, профилактика, консультации по терапии, вакцинации и домашнему уходу."
        keywords="ветеринар Майкудук, ветеринар Караганда, Оржов Яша Насирбекович, ветеринарный врач Караганда"
        canonicalPath="/doctors"
      />

      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Врачи
        </span>
        <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
          Ветеринар в Караганде, которому можно доверить важные вопросы о питомце
        </h1>
      </div>

      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 shadow-xl">
          <img
            src={doctor.image_url}
            alt={`${doctor.name} — ветеринар ZhasaVet в Караганде`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-brand-teal">
              Команда
            </div>
            <h2 className="mt-2 text-4xl font-display font-bold text-slate-900">{doctor.name}</h2>
            <p className="mt-2 text-xl text-brand-orange">{doctor.specialty}</p>
          </div>

          <div className="space-y-4 text-lg leading-8 text-slate-500">
            {doctor.bio.split('\n\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard
              icon={<Award size={20} className="text-brand-teal" />}
              label="Опыт"
              value={doctor.experience}
            />
            <InfoCard
              icon={<GraduationCap size={20} className="text-brand-teal" />}
              label="Фокус"
              value="Терапия, профилактика, домашний уход"
            />
            <InfoCard
              icon={<Calendar size={20} className="text-brand-teal" />}
              label="Формат"
              value="Очный приём и консультации"
            />
          </div>

          <a
            href={buildWhatsAppLink(
              `Здравствуйте! Хочу записаться на консультацию к врачу ${doctor.name}.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
          >
            <MessageCircle size={16} />
            Записаться к врачу
          </a>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-teal/10">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}
