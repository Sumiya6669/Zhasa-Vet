import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Контакты
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
          Свяжитесь с ZhasaVet
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          Эта страница нужна как опорная точка для клиентов после заказа, консультации или визита в
          аптеку.
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ContactCard
            icon={<Phone size={20} className="text-brand-teal" />}
            title="Телефон"
            value="+7 (707) 123-45-67"
            subtitle="Ежедневно с 09:00 до 21:00"
          />
          <ContactCard
            icon={<Mail size={20} className="text-brand-teal" />}
            title="E-mail"
            value="info@zhasavet.kz"
            subtitle="Для вопросов и обратной связи"
          />
          <ContactCard
            icon={<MapPin size={20} className="text-brand-teal" />}
            title="Адрес"
            value="Караганда, ул. Сталелитейная, 3/3А"
            subtitle="Самовывоз и консультации"
          />
          <ContactCard
            icon={<Send size={20} className="text-brand-teal" />}
            title="Telegram"
            value="@zhasavet"
            subtitle="Можно использовать как дополнительный канал связи"
          />
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-display font-bold text-slate-900">Как нас найти</h2>
          <p className="text-slate-500 leading-7">
            После оформления заказа вы сможете забрать его по адресу клиники. Домен сайта для
            продакшна — <strong>zhasavet.kz</strong>.
          </p>
          <div className="rounded-3xl overflow-hidden border border-slate-200 h-[320px]">
            <iframe
              title="ZhasaVet map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d157351.64294464!2d72.9567406625!3d49.8018264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424346bc37d45731%3A0x86f264104d4a9ec0!2z0YPQuy4g0KHRgtCw0LvQtdC70LjRgtC10LnQvdCw0Y8sIDMvM0EsINCa0LDRgNCw0LPQsNC90LTQsCAxMDAwMDA!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400">{title}</div>
      <div className="text-lg font-semibold text-slate-900 mt-2">{value}</div>
      <div className="text-sm text-slate-500 mt-2 leading-6">{subtitle}</div>
    </div>
  );
}
