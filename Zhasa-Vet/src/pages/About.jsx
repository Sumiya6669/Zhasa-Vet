import React from 'react';
import { Heart, Shield, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';

const VALUES = [
  { icon: Heart, title: 'Забота', desc: 'Мы относимся к каждому питомцу с любовью и вниманием, как к своему собственному.' },
  { icon: Shield, title: 'Качество', desc: 'Работаем только с проверенными поставщиками и сертифицированными препаратами.' },
  { icon: Users, title: 'Доверие', desc: 'Строим долгосрочные отношения с нашими клиентами на основе честности и прозрачности.' },
  { icon: MapPin, title: 'Доступность', desc: 'Удобное расположение в 13-м микрорайоне Караганды. Рядом с вашим домом.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/dbccfc506_generated_1e8af846.png"
            alt="О нас ZhasaVet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white text-xs font-semibold tracking-wider uppercase mb-4">
            О нас
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-xl">О клинике ZhasaVet</h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg">
            Ваш надёжный партнёр в заботе о здоровье домашних животных
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeader badge="Наша история" title="Больше, чем аптека" className="text-left !mx-0 !mb-0" />
            <p className="text-muted-foreground leading-relaxed">
              ZhasaVet — это ветеринарная аптека и клиника в Караганде, основанная ветеринарным врачом
              Яшей Оржовым. Мы работаем, чтобы жители Караганды и окрестностей могли получить качественную
              ветеринарную помощь и приобрести всё необходимое для здоровья своих питомцев в одном месте.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              В нашей аптеке вы найдёте корма премиум-класса от ведущих мировых производителей — Royal Canin,
              Farmina, Hill's, Grandorf — а также широкий ассортимент лекарственных препаратов, витаминов и
              аксессуаров. Мы тщательно отбираем каждый товар, чтобы предложить вам только лучшее.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Помимо аптеки, мы предоставляем полный спектр ветеринарных услуг: от профилактических осмотров
              и вакцинации до хирургических операций. Наш врач — Яша Оржов — лично ведёт каждый приём,
              обеспечивая индивидуальный подход и высочайшее качество обслуживания.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/dbccfc506_generated_1e8af846.png"
              alt="Интерьер ZhasaVet"
              className="w-full h-full object-cover aspect-video"
            />
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader badge="Наши ценности" title="Что нас отличает" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <val.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-xl mx-auto text-center">
          <SectionHeader badge="Режим работы" title="Мы всегда рядом" />
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="font-medium">Понедельник — Суббота</span>
              <span className="text-primary font-semibold">09:00 — 19:00</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium">Воскресенье</span>
              <span className="text-primary font-semibold">09:00 — 15:00</span>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/contacts">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Как нас найти
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}