import { ReactNode } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock, Send } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight">Свяжитесь с нами <br /> для <span className="text-brand-teal">консультации</span></h1>
            <p className="text-slate-500 text-lg">Мы всегда рады помочь вам и вашим питомцам. Вы можете позвонить нам, написать в соцсети или приехать лично в нашу клинику и аптеку в Караганде.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <ContactItem 
              icon={<Phone className="text-brand-teal" />}
              title="Телефон"
              value="+7 (707) 123-4567"
              desc="Пн-Вс: 09:00 - 21:00"
            />
            <ContactItem 
              icon={<Mail className="text-brand-teal" />}
              title="Email"
              value="info@zhasavet.kz"
              desc="Для предложений и жалоб"
            />
            <ContactItem 
              icon={<MapPin className="text-brand-teal" />}
              title="Адрес"
              value="Караганда, ул. Сталелитейная, 3/3А"
              desc="Ветеринарная аптека и клиника"
            />
            <ContactItem 
              icon={<Clock className="text-brand-teal" />}
              title="Режим работы"
              value="Ежедневно"
              desc="С 09:00 до 21:00 без перерывов"
            />
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-xl text-slate-800">Мы в соцсетях</h3>
            <div className="flex gap-4">
              <SocialBtn icon={<Instagram />} label="Instagram" href="#" />
              <SocialBtn icon={<Send />} label="Telegram" href="#" />
              <SocialBtn icon={<Facebook />} label="Facebook" href="#" />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-slate-900">Оставить заявку</h2>
            <p className="text-slate-500">Заполните форму, и мы свяжемся с вами в течение 15 минут.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ваше имя</label>
                <input type="text" placeholder="Иван" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Телефон</label>
                <input type="tel" placeholder="+7 (___) ___ __ __" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ваш вопрос</label>
              <textarea rows={4} placeholder="Опишите вкратце вашу проблему..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all resize-none"></textarea>
            </div>

            <button className="w-full py-5 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-teal/20 transform hover:-translate-y-1 active:scale-[0.98]">
              Отправить сообщение
            </button>
            <p className="text-[10px] text-slate-400 px-4 text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки персональных данных.
            </p>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-slate-100 rounded-[48px] overflow-hidden relative group shadow-inner">
        <iframe 
          title="Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d157351.64294464!2d72.9567406625!3d49.8018264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424346bc37d45731%3A0x86f264104d4a9ec0!2z0YPQuy4g0KHRgtCw0LvQtdC70LjRgtC10LnQvdCw0Y8sIDMvM0EsINCa0LDRgNCw0LPQsNC90LTQsCAxMDAwMDA!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz" 
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/20 to-transparent" />
        <div className="absolute bottom-10 left-10 z-20 bg-white/90 backdrop-blur p-6 rounded-3xl shadow-2xl max-w-sm hidden sm:block border border-white/20">
          <h4 className="font-bold text-lg text-slate-800 mb-2">Найти нас</h4>
          <p className="text-sm text-slate-500 mb-4 tracking-tight">Караганда, ул. Сталелитейная, 3/3А. Отельный вход со стороны дороги, вывеска ZhasaVet.</p>
          <a href="https://2gis.kz/karaganda/search/%D1%83%D0%BB.%20%D0%A1%D1%82%D0%B0%D0%BB%D0%B5%D0%BB%D0%B8%D1%82%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F%2C%203%2F3%D0%90" target="_blank" rel="noreferrer" className="inline-block text-brand-teal font-bold hover:underline">Открыть в 2ГИС →</a>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon, title, value, desc }: { icon: ReactNode, title: string, value: string, desc: string }) {
  return (
    <div className="space-y-3 p-6 rounded-3xl border border-slate-100 hover:border-brand-teal/20 transition-all">
      <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
        <p className="font-bold text-lg text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label, href }: { icon: ReactNode, label: string, href: string }) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl hover:border-brand-teal hover:text-brand-teal transition-all group font-medium text-slate-600"
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-sm">{label}</span>
    </a>
  );
}
