import React from 'react';
import { Stethoscope, Syringe, Heart, Scissors, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    icon: Stethoscope,
    title: 'Первичный приём и осмотр',
    description: 'Комплексная диагностика состояния здоровья вашего питомца. Включает физикальный осмотр, аускультацию и консультацию по дальнейшему лечению.',
    price: '5 000',
  },
  {
    icon: Syringe,
    title: 'Вакцинация',
    description: 'Плановая вакцинация собак и кошек от бешенства, чумки, парвовируса и других инфекционных заболеваний. Оформление ветеринарного паспорта.',
    price: 'от 4 500',
  },
  {
    icon: Heart,
    title: 'Кастрация / Стерилизация',
    description: 'Плановые хирургические операции с применением современных методов анестезии. Послеоперационное наблюдение и рекомендации по уходу.',
    price: 'от 18 000',
  },
  {
    icon: Scissors,
    title: 'Хирургия',
    description: 'Оперативные вмешательства различной сложности: удаление новообразований, остеосинтез, абдоминальная хирургия и экстренная помощь.',
    price: 'от 25 000',
  },
  {
    icon: Sparkles,
    title: 'Чистка зубов (ультразвук)',
    description: 'Профессиональная чистка зубов ультразвуковым скалером. Удаление зубного камня и налёта, полировка эмали.',
    price: '12 000',
  },
  {
    icon: Shield,
    title: 'Обработка от паразитов',
    description: 'Комплексная обработка от блох, клещей, гельминтов. Подбор оптимальных препаратов с учётом возраста и породы.',
    price: 'от 3 000',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/e45058155_generated_96f17e8f.png"
            alt="Ветеринарные услуги"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white text-xs font-semibold tracking-wider uppercase mb-4">
            Услуги
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-xl">Ветеринарные услуги</h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg">
            Профессиональная помощь и забота о здоровье вашего питомца
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-lg font-bold text-primary">{service.price} ₸</span>
                <a
                  href={`https://wa.me/77077979079?text=${encodeURIComponent(`Здравствуйте! Хочу записаться на услугу: ${service.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary/5">
                    Записаться <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}