import { motion } from 'motion/react';
import { Heart, Microscope, Stethoscope, Syringe } from 'lucide-react';
import { MOCK_SERVICES } from '../mockData';

const icons = [Stethoscope, Syringe, Heart, Microscope];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Услуги
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
          Базовые ветеринарные услуги
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          Страница услуг помогает объяснить, чем занимается клиника и какие вопросы можно решить
          ещё до визита или оформления заказа.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SERVICES.map((service, index) => {
          const Icon = icons[index % icons.length];

          return (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-5">
                <Icon size={24} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{service.title}</h2>
                  <p className="text-sm leading-6 text-slate-500 mt-3">{service.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 whitespace-nowrap">
                  {service.price_range}
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
