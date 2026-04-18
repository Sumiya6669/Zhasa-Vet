import { motion } from 'motion/react';
import { ArrowRight, Heart, MessageCircle, Microscope, Stethoscope, Syringe } from 'lucide-react';
import { MOCK_SERVICES, buildWhatsAppLink } from '../mockData';

const icons = [Stethoscope, Syringe, Heart, Microscope];

export default function Services() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Услуги
        </span>
        <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
          Практичные ветеринарные услуги без лишних обещаний
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          Мы помогаем быстро понять, что происходит с питомцем, подобрать базовую тактику ухода и
          вовремя направить на лечение. Если хотите записаться, отправьте сообщение прямо со
          страницы, и мы свяжемся с вами.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal">
                <Icon size={24} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{service.description}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                  {service.price_range}
                </span>
              </div>

              <a
                href={buildWhatsAppLink(
                  `Здравствуйте! Хочу записаться на услугу "${service.title}" в ZhasaVet.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-teal px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
              >
                <MessageCircle size={16} />
                Записаться
                <ArrowRight size={16} />
              </a>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
