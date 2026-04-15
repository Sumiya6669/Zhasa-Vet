import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/c57da13c6_image.png"
                alt="ZhasaVet Logo"
                className="w-10 h-10 object-contain rounded-full"
              />
              <span className="font-bold text-xl tracking-tight">
                Zhasa<span className="text-primary">Vet</span>
              </span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Ветеринарная аптека и клиника в Караганде. Здоровье вашего питомца — наша забота.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Аптека', path: '/pharmacy' },
                { label: 'Услуги', path: '/services' },
                { label: 'Наш врач', path: '/doctors' },
                { label: 'Блог', path: '/blog' },
                { label: 'Контакты', path: '/contacts' },
              ].map(item => (
                <Link key={item.path} to={item.path} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+77077979079" className="flex items-start gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                +7 707 797 90 79
              </a>
              <div className="flex items-start gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                г. Караганда, ул. Сталелитейная, 3/3А, 13-й микрорайон
              </div>
              <div className="flex items-start gap-2 text-sm opacity-70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  Пн–Сб: 09:00–19:00<br />
                  Вс: 09:00–15:00
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
            <div className="flex flex-col gap-3">
              <a href="https://www.instagram.com/zhasa.vet" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4" />
                @zhasa.vet
              </a>
              <a href="https://www.tiktok.com/@zhasavet79" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.85 4.85 0 01-1-.15z"/></svg>
                @zhasavet79
              </a>
              <a
                href="https://wa.me/77077979079?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20ZhasaVet."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm opacity-50">© 2026 ZhasaVet. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}