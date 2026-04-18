import { motion } from 'motion/react';
import { MOCK_SERVICES } from '../mockData';
import { Stethoscope, Syringe, Microscope, Heart } from 'lucide-react';
import { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  '1': <Stethoscope size={32} />,
  '2': <Syringe size={32} />,
  '3': <Heart size={32} />,
  '4': <Microscope size={32} />,
};

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight">
          Полный комплекс <br /> <span className="text-brand-teal">ветеринарных услуг</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Мы предлагаем всё необходимое для здоровья вашего питомца: от профилактических осмотров до сложных хирургических операций.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_SERVICES.map((service, index) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-soft hover:border-brand-teal/20 transition-all hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center text-brand-teal flex-shrink-0 group-hover:scale-110 transition-transform">
                {iconMap[service.id] || <Stethoscope size={32} />}
              </div>
              <div className="space-y-4 flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                  <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold whitespace-nowrap">
                    {service.price_range}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {service.description}
                </p>
                <button className="text-brand-teal font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Записаться на услугу <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Specialty Sections */}
      <section className="bg-slate-900 rounded-[56px] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-display font-bold">Почему выбирают <br /> <span className="text-brand-teal">нашу клинику?</span></h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-brand-teal rounded-full flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xl">Современное оборудование</h4>
                <p className="text-slate-400 text-sm">Используем новейшие аппараты УЗИ, рентгена и лабораторные анализаторы.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-brand-orange rounded-full flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xl">Забота и любовь</h4>
                <p className="text-slate-400 text-sm">Мы относимся к каждому пациенту как к члену собственной семьи.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-brand-teal rounded-full flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-xl">Доступные цены</h4>
                <p className="text-slate-400 text-sm">Справедливое ценообразование и отсутствие лишних назначений.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-[40px]">
          <img 
            src="https://picsum.photos/seed/vetclinic2/800/800" 
            alt="Service" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Call to action */}
      <div className="text-center space-y-8 py-12">
        <h2 className="text-3xl font-display font-bold text-slate-800">Не нашли нужную услугу?</h2>
        <p className="text-slate-500">Позвоните нам, и мы обязательно проконсультируем вас по любому вопросу.</p>
        <button className="px-12 py-5 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl font-bold shadow-xl shadow-brand-teal/20 transition-all transform hover:-translate-y-1">
          Связаться с врачом
        </button>
      </div>
    </div>
  );
}
