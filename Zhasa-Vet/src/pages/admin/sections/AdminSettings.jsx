import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Building2, Phone, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULTS = {
  company_name: 'ZhasaVet',
  tagline: 'Ветеринарная аптека и клиника в Караганде',
  phone: '+7 707 797 90 79',
  whatsapp: '77077979079',
  address: 'г. Караганда, ул. Сталелитейная, 3/3А, 13-й микрорайон',
  hours_weekday: '09:00 — 19:00',
  hours_sunday: '09:00 — 15:00',
  instagram: 'https://instagram.com/zhasavet79',
  tiktok: 'https://tiktok.com/@zhasavet79',
  about_text: 'ZhasaVet — ветеринарная аптека и клиника, основанная врачом Яшей Оржовым. Мы предлагаем широкий ассортимент товаров и профессиональные ветеринарные услуги.',
};

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('zhasavet_settings') || '{}') }; }
    catch { return DEFAULTS; }
  });

  const f = (field) => ({
    value: settings[field] ?? '',
    onChange: (e) => setSettings(s => ({ ...s, [field]: e.target.value })),
  });

  const save = () => {
    localStorage.setItem('zhasavet_settings', JSON.stringify(settings));
    toast.success('Настройки сохранены');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Section icon={Building2} title="Информация о компании">
        <div className="space-y-1.5">
          <Label>Название компании</Label>
          <Input {...f('company_name')} />
        </div>
        <div className="space-y-1.5">
          <Label>Слоган</Label>
          <Input {...f('tagline')} />
        </div>
        <div className="space-y-1.5">
          <Label>О компании</Label>
          <Textarea {...f('about_text')} rows={3} />
        </div>
      </Section>

      <Section icon={Phone} title="Контактные данные">
        <div className="space-y-1.5">
          <Label>Телефон</Label>
          <Input {...f('phone')} placeholder="+7 707 797 90 79" />
        </div>
        <div className="space-y-1.5">
          <Label>WhatsApp (номер без +)</Label>
          <Input {...f('whatsapp')} placeholder="77077979079" />
        </div>
        <div className="space-y-1.5">
          <Label>Instagram</Label>
          <Input {...f('instagram')} placeholder="https://instagram.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label>TikTok</Label>
          <Input {...f('tiktok')} placeholder="https://tiktok.com/..." />
        </div>
      </Section>

      <Section icon={MapPin} title="Адрес">
        <div className="space-y-1.5">
          <Label>Адрес</Label>
          <Input {...f('address')} />
        </div>
      </Section>

      <Section icon={Clock} title="Режим работы">
        <div className="space-y-1.5">
          <Label>Пн–Сб</Label>
          <Input {...f('hours_weekday')} placeholder="09:00 — 19:00" />
        </div>
        <div className="space-y-1.5">
          <Label>Воскресенье</Label>
          <Input {...f('hours_sunday')} placeholder="09:00 — 15:00" />
        </div>
      </Section>

      <Button onClick={save} className="bg-primary hover:bg-primary/90 w-full sm:w-auto px-8">
        <Save className="w-4 h-4 mr-2" /> Сохранить настройки
      </Button>
    </div>
  );
}