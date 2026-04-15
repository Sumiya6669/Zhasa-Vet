import React from 'react';
import { Award, Heart, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function Doctors() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
            Наш специалист
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Наш ветеринарный врач</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Профессионал, которому вы можете доверить здоровье своего питомца
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Photo */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/8e043fba1_generated_6aacac9a.png"
                alt="Яша Оржов - ветеринарный врач"
                className="w-full object-cover aspect-[3/4]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <div className="text-center text-primary-foreground">
                <span className="text-2xl font-bold block">8+</span>
                <span className="text-xs">лет</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Яша Оржов</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">Ветеринарный терапевт</Badge>
                <Badge variant="outline" className="text-primary border-primary/30">Хирург</Badge>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Яша Оржов — основатель и ведущий ветеринарный врач клиники ZhasaVet. За более чем 8 лет практики он помог
              тысячам питомцев вернуть здоровье и радость жизни. Специализируется как на терапии, так и на хирургических
              вмешательствах различной сложности.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Окончил Карагандинский университет имени Букетова по специальности «Ветеринарная медицина».
              Регулярно повышает квалификацию, посещая профильные семинары и конференции. Владеет современными
              методами диагностики и лечения мелких домашних животных.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Яша уверен: каждый питомец заслуживает внимательного и бережного отношения. Именно поэтому он
              уделяет время не только лечению, но и подробным консультациям для владельцев — чтобы вы понимали,
              что происходит с вашим любимцем, и могли обеспечить ему лучший уход.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: Stethoscope, label: 'Терапия и диагностика' },
                { icon: Heart, label: 'Хирургия' },
                { icon: Award, label: 'Вакцинация' },
                { icon: Clock, label: 'Консультации' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/77077979079?text=Здравствуйте!%20Хочу%20записаться%20на%20приём%20к%20врачу%20Яше%20Оржову."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4">
                Записаться на приём <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}