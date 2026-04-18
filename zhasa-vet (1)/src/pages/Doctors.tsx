import { Award, Calendar, GraduationCap } from 'lucide-react';
import { MOCK_DOCTORS } from '../mockData';

export default function Doctors() {
  const doctor = MOCK_DOCTORS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Специалист
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
          Врач ZhasaVet
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          Раздел знакомит посетителя с клиникой и помогает повысить доверие к консультациям и
          рекомендациям по товарам.
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-8 items-start">
        <div className="rounded-[36px] overflow-hidden border border-slate-200 shadow-xl">
          <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="text-sm font-semibold text-brand-teal uppercase tracking-widest">Команда</div>
            <h2 className="text-4xl font-display font-bold text-slate-900 mt-2">{doctor.name}</h2>
            <p className="text-xl text-brand-orange mt-2">{doctor.specialty}</p>
          </div>

          <p className="text-lg leading-8 text-slate-500">{doctor.bio}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Award size={20} className="text-brand-teal" />} label="Опыт" value={doctor.experience} />
            <InfoCard
              icon={<GraduationCap size={20} className="text-brand-teal" />}
              label="Фокус"
              value="Профилактика и терапия"
            />
            <InfoCard
              icon={<Calendar size={20} className="text-brand-teal" />}
              label="Формат"
              value="Консультации и приём"
            />
          </div>
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
      <div className="w-11 h-11 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className="text-lg font-semibold text-slate-900 mt-2">{value}</div>
    </div>
  );
}
