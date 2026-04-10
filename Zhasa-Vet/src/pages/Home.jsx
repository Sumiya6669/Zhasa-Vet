import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Pill, Heart, Clock, Shield, Award } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';
import { motion } from 'framer-motion';

const SERVICES_PREVIEW = [
  { icon: Stethoscope, title: 'Приём и осмотр', desc: 'Комплексная диагностика и лечение' },
  { icon: Pill, title: 'Ветеринарная аптека', desc: 'Корма, лекарства, витамины' },
  { icon: Heart, title: 'Хирургия', desc: 'Оперативные вмешательства любой сложности' },
];

const ADVANTAGES = [
  { icon: Clock, title: '8 лет опыта', desc: 'Опытный специалист с многолетней практикой' },
  { icon: Shield, title: 'Качественные препараты', desc: 'Только сертифицированные лекарства и корма' },
  { icon: Award, title: 'Индивидуальный подход', desc: 'К каждому питомцу — как к своему' },
];

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => base44.entities.Product.list('-created_date', 4),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/cd9d9de14_generated_dc38968b.png"
            alt="Ветеринарная клиника ZhasaVet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36 lg:py-44">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              Ветаптека и клиника в Караганде
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              ZhasaVet — когда здоровье питомца в надёжных руках
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Качественные корма, лекарства и ветеринарные услуги. Всё для здоровья и долголетия вашего любимца.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/pharmacy">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Каталог
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="https://wa.me/77077979079?text=Здравствуйте!%20Хочу%20записаться%20на%20приём." target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                  Записаться на приём
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader badge="Услуги" title="Забота о здоровье питомца" description="Комплексный подход к лечению и профилактике заболеваний" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_PREVIEW.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Все услуги <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      {products.length > 0 && (
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader badge="Аптека" title="Популярные товары" description="Качественные корма и препараты от проверенных производителей" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/pharmacy">
                <Button variant="outline" size="lg">
                  Весь каталог <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Advantages */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Почему выбирают ZhasaVet</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                  <adv.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{adv.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Запишитесь на приём</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Свяжитесь с нами через WhatsApp или позвоните по телефону — мы поможем подобрать удобное время.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/77077979079?text=Здравствуйте!%20Хочу%20записаться%20на%20приём." target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Написать в WhatsApp
              </Button>
            </a>
            <a href="tel:+77077979079">
              <Button size="lg" variant="outline" className="px-8">
                Позвонить
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}