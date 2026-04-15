import React from 'react';
import { Phone, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';

const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Телефон / WhatsApp',
    value: '+7 707 797 90 79',
    href: 'tel:+77077979079',
  },
  {
    icon: MapPin,
    title: 'Адрес',
    value: 'г. Караганда, ул. Сталелитейная, 3/3А, 13-й микрорайон',
    href: 'https://yandex.ru/maps/?pt=73.099166,49.834722&z=17&l=map',
  },
  {
    icon: Clock,
    title: 'Режим работы',
    value: 'Пн–Сб: 09:00–19:00 | Вс: 09:00–15:00',
  },
];

const SOCIALS = [
  {
    icon: Instagram,
    label: 'Instagram @zhasa.vet',
    href: 'https://www.instagram.com/zhasa.vet',
  },
  {
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.85 4.85 0 01-1-.15z"/></svg>
    ),
    label: 'TikTok @zhasavet79',
    href: 'https://www.tiktok.com/@zhasavet79',
  },
];

export default function Contacts() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Контакты"
            title="Свяжитесь с нами"
            description="Мы всегда рады помочь вам и вашим питомцам"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            {CONTACT_INFO.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social */}
            <div className="pt-4">
              <h3 className="font-semibold mb-4">Социальные сети</h3>
              <div className="flex flex-col gap-3">
                {SOCIALS.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {typeof social.icon === 'function' ? <social.icon /> : <social.icon className="w-5 h-5" />}
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/77077979079?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20ZhasaVet."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в WhatsApp
              </Button>
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg h-[400px] lg:h-auto min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2539.5!2d73.099166!3d49.834722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDUwJzA1LjAiTiA3M8KwMDUnNTcuMCJF!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ZhasaVet на карте"
            />
          </div>
        </div>
      </div>
    </div>
  );
}