import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { MOCK_DOCTORS } from '../mockData';
import { GraduationCap, Award, Calendar } from 'lucide-react';

export default function Doctors() {
  const doctor = MOCK_DOCTORS[0]; // Currently only one doctor

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
      <div className="text-center space-y-4 max-w-2xl mx-auto font-display">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Наши специалисты</h1>
        <p className="text-slate-500 text-lg">Команда профессионалов, преданных своему делу. Мы заботимся о каждом пациенте как о своем собственном.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-brand-teal rounded-[40px] opacity-10 rotate-3" />
          <img 
            src={doctor.image_url} 
            alt={doctor.name} 
            className="relative z-10 w-full rounded-[32px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-brand-teal font-bold tracking-wider uppercase text-sm">Ведущий врач</span>
            <h2 className="text-4xl font-display font-bold text-slate-900">{doctor.name}</h2>
            <p className="text-xl text-brand-orange font-medium">{doctor.specialty}</p>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            {doctor.bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem 
              icon={<Award className="text-brand-teal" />}
              label="Стаж работы"
              value={doctor.experience}
            />
            <InfoItem 
              icon={<GraduationCap className="text-brand-teal" />}
              label="Образование"
              value="Высшее ветеринарное"
            />
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-brand-teal text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-teal-dark transition-all shadow-lg shadow-brand-teal/20">
              <Calendar size={20} /> Записаться на прием
            </button>
            <div className="flex items-center gap-4 text-slate-500 text-sm font-medium px-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Сегодня есть свободные места
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="bg-slate-900 rounded-[48px] p-8 md:p-16 text-white grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div className="space-y-4">
          <div className="text-4xl font-display font-bold text-brand-teal tracking-tight">01</div>
          <h3 className="text-xl font-bold">Бережный подход</h3>
          <p className="text-slate-400 text-sm">Минимизируем стресс для животного при осмотре и процедурах.</p>
        </div>
        <div className="space-y-4">
          <div className="text-4xl font-display font-bold text-brand-teal tracking-tight">02</div>
          <h3 className="text-xl font-bold">Лучшие медикаменты</h3>
          <p className="text-slate-400 text-sm">Используем только проверенные и эффективные препараты.</p>
        </div>
        <div className="space-y-4">
          <div className="text-4xl font-display font-bold text-brand-teal tracking-tight">03</div>
          <h3 className="text-xl font-bold">Постоянная связь</h3>
          <p className="text-slate-400 text-sm">Всегда на связи с владельцами после сложных операций.</p>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
      <div className="p-2 bg-white rounded-xl shadow-sm italic-normal">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-400 font-medium">{label}</div>
        <div className="font-bold text-slate-800">{value}</div>
      </div>
    </div>
  );
}
