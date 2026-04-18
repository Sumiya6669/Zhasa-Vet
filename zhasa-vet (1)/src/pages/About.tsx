import { motion } from 'motion/react';
import { ShieldCheck, Heart, Zap, Award, Target, Users } from 'lucide-react';
import { ReactNode } from 'react';

export default function About() {
  return (
    <div className="space-y-24 pb-24">
      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-brand-teal font-bold tracking-widest uppercase text-sm">О нашей клинике</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight">
              История заботы <br /> с <span className="text-brand-teal">2009 года</span>
            </h1>
          </div>
          <p className="text-slate-600 text-lg leading-relaxed">
            ZhasaVet начиналась как небольшая семейная аптека для животных в Караганде. Сегодня мы — это полноценный многофункциональный центр, объединяющий современную клинику и одну из лучших ветеринарных аптек в области.
          </p>
          <p className="text-slate-600 text-lg leading-relaxed italic">
            "Наша цель — не просто лечить, а делать жизнь питомцев и их владельцев счастливее и спокойнее."
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-1">
              <div className="text-4xl font-display font-bold text-brand-teal">15+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Лет опыта</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-display font-bold text-brand-teal">10к+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Пациентов</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-brand-teal rounded-[60px] opacity-10 rotate-6" />
          <img 
            src="https://picsum.photos/seed/aboutvet/800/800" 
            alt="Clinic interior" 
            className="relative z-10 w-full rounded-[48px] shadow-2xl"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900">Наши ценности</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Фундамент, на котором строится наше отношение к работе и пациентам.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Heart size={32} />}
              title="Любовь к животным"
              desc="Мы понимаем, что ваш питомец — член семьи, и заслуживает самого нежного и внимательного отношения."
            />
            <ValueCard 
              icon={<ShieldCheck size={32} />}
              title="Честность"
              desc="Мы никогда не назначаем лишних процедур и всегда открыто обсуждаем план лечения и его стоимость."
            />
            <ValueCard 
              icon={<Award size={32} />}
              title="Профессионализм"
              desc="Постоянное обучение и совершенствование навыков — обязательное условие для каждого нашего сотрудника."
            />
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-teal text-white p-12 md:p-16 rounded-[48px] space-y-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Target size={32} />
          </div>
          <h3 className="text-3xl font-display font-bold">Наша миссия</h3>
          <p className="text-white/80 text-lg leading-relaxed">
            Обеспечить каждого домашнего питомца качественной медицинской помощью и лучшими препаратами, делая ветеринарную медицину доступной и понятной.
          </p>
        </div>
        <div className="bg-slate-900 text-white p-12 md:p-16 rounded-[48px] space-y-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Users size={32} />
          </div>
          <h3 className="text-3xl font-display font-bold">Наше видение</h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Стать эталоном ветеринарного сервиса в Казахстане, где современные технологии сочетаются с искренней человеческой заботой.
          </p>
        </div>
      </section>

      {/* Team Preview CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-800">Познакомьтесь с командой</h2>
          <p className="text-slate-500 text-lg">У нас работают только те, кто не представляет свою жизнь без помощи животным.</p>
        </div>
        <div className="flex justify-center">
          <motion.a 
            href="/doctors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-brand-orange text-white rounded-2xl font-bold shadow-xl shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            Посмотреть всех врачей <Zap size={20} />
          </motion.a>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-soft space-y-4 group hover:border-brand-teal/20 transition-all">
      <div className="text-brand-teal transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
