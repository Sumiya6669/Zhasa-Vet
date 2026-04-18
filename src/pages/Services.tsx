import { motion } from 'motion/react';
import { ArrowRight, Heart, MessageCircle, Microscope, Stethoscope, Syringe } from 'lucide-react';
import Seo from '../components/Seo';
import { MOCK_SERVICES, buildWhatsAppLink } from '../mockData';

const icons = [Stethoscope, Syringe, Heart, Microscope];

export default function Services() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <Seo
        title="Ветклиника Караганда, Майкудук — приём, прививки, консультации"
        description="Ветеринарная клиника ZhasaVet в Караганде, Майкудук: первичный приём, прививки собакам и кошкам, обработка от паразитов, консультации по питанию и профилактике."
        keywords="ветклиника Караганда, ветеринарная клиника Майкудук, ветеринар Майкудук, прививки собакам кошкам Караганда, ветеринар Караганда услуги"
        canonicalPath="/services"
      />

      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Услуги
        </span>
        <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
          Ветеринарная клиника в Караганде для повседневной помощи и профилактики
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          В ZhasaVet можно записаться на приём к ветеринару в Майкудуке, сделать прививки собакам
          и кошкам, подобрать профилактику от паразитов и получить понятную консультацию по уходу и
          питанию. Мы работаем без лишней бюрократии и помогаем быстро перейти от вопроса к
          конкретному решению.
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
