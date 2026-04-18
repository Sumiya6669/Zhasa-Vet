import { BlogPost, Doctor, Product, Service } from './types';

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Жанара Сейтхан',
    specialty: 'Ветеринарный врач общей практики',
    bio: 'Специализируется на профилактике, подборе базовой терапии и консультировании владельцев домашних животных.',
    experience: '15 лет',
    image_url:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=900&auto=format&fit=crop',
  },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Первичный осмотр',
    description: 'Сбор анамнеза, базовая диагностика и рекомендации по дальнейшему лечению.',
    price_range: 'от 3 000 тг',
  },
  {
    id: '2',
    title: 'Вакцинация',
    description: 'Плановые прививки и контроль графика вакцинации для собак и кошек.',
    price_range: 'от 4 500 тг',
  },
  {
    id: '3',
    title: 'Профилактика паразитов',
    description: 'Подбор средств защиты и консультация по сезонной обработке.',
    price_range: 'от 2 500 тг',
  },
  {
    id: '4',
    title: 'Консультация по кормлению',
    description: 'Подбор рациона с учётом возраста, состояния и образа жизни животного.',
    price_range: 'от 5 000 тг',
  },
];

export const MOCK_BLOG: BlogPost[] = [];
