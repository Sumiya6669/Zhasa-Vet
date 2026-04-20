import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Seo from '../components/Seo';
import TikTokIcon from '../components/TikTokIcon';
import { SITE_CONTACTS, buildWhatsAppLink } from '../mockData';

const contactsSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'ZhasaVet',
  url: 'https://zhasavet.kz/contacts',
  image: 'https://zhasavet.kz/logo.png',
  telephone: SITE_CONTACTS.phoneRaw,
  email: SITE_CONTACTS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Сталелитейная, 3/3А',
    addressLocality: 'Караганда',
    addressRegion: 'Карагандинская область',
    addressCountry: 'KZ',
  },
  areaServed: ['Караганда', 'Майкудук'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '09:00',
      closes: '15:00',
    },
  ],
};

export default function Contacts() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <Seo
        title="Контакты ZhasaVet — ветаптека и ветклиника в Караганде, Майкудук"
        description="Контакты ZhasaVet: Караганда, ул. Сталелитейная, 3/3А, Майкудук. Телефон, WhatsApp, Instagram, TikTok, часы работы и карта проезда."
        keywords="контакты ветаптека Караганда, ветклиника Майкудук адрес, ветеринарная клиника Караганда телефон, ветаптека Караганда Майкудук"
        canonicalPath="/contacts"
        jsonLd={contactsSchema}
      />

      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          Контакты
        </span>
        <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
          Контакты ветаптеки и ветклиники ZhasaVet в Караганде
        </h1>
      </div>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2">
          <ContactCard
            icon={<Phone size={20} className="text-brand-teal" />}
            title="Телефон"
            value={SITE_CONTACTS.phoneDisplay}
            subtitle={
              <>
                <span className="block">{SITE_CONTACTS.hoursWeekdays}</span>
                <span className="mt-1 block">{SITE_CONTACTS.hoursSunday}</span>
              </>
            }
            href={`tel:${SITE_CONTACTS.phoneRaw}`}
          />
          <ContactCard
            icon={<Mail size={20} className="text-brand-teal" />}
            title="E-mail"
            value={SITE_CONTACTS.email}
            subtitle="Для вопросов по заказам, товарам, записи и консультациям"
            href={`mailto:${SITE_CONTACTS.email}`}
          />
          <ContactCard
            icon={<MapPin size={20} className="text-brand-teal" />}
            title="Адрес"
            value={`${SITE_CONTACTS.address}, Майкудук`}
            subtitle="Самовывоз, консультации и запись по предварительной связи"
          />
          <ContactCard
            icon={<MessageCircle size={20} className="text-brand-teal" />}
            title="WhatsApp"
            value={SITE_CONTACTS.phoneDisplay}
            subtitle="Самый быстрый способ записаться или уточнить наличие"
            href={buildWhatsAppLink(
              'Здравствуйте! Хочу уточнить информацию по услугам и товарам ZhasaVet.',
            )}
          />
        </div>

        <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-display font-bold text-slate-900">Соцсети и маршрут</h2>
          <p className="leading-7 text-slate-500">
            Подписывайтесь на наши обновления, чтобы видеть советы по уходу, сезонные рекомендации
            и новости каталога. Для записи и быстрых вопросов удобнее всего писать в WhatsApp.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={SITE_CONTACTS.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-teal/20 hover:text-brand-teal"
            >
              <Instagram size={16} />
              Instagram
            </a>
            <a
              href={SITE_CONTACTS.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-teal/20 hover:text-brand-teal"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </a>
            <a
              href={buildWhatsAppLink('Здравствуйте! Хочу связаться с ZhasaVet.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand-teal px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <iframe
              title="ZhasaVet map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d157351.64294464!2d72.9567406625!3d49.8018264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424346bc37d45731%3A0x86f264104d4a9ec0!2z0YPQuy4g0KHRgtCw0LvQtdC70LjRgtC10LnQvdCw0Y8sIDMvM0EsINCa0LDRgNCw0LPQsNC90LTQsCAxMDAwMDA!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz"
              className="h-[320px] w-full border-0"
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
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-brand-teal/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="block h-full"
    >
      {content}
    </a>
  );
}
