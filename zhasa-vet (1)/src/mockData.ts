import { Product, Doctor, BlogPost, Service } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // --- DOGS ---
  {
    id: 'd1',
    name: 'Корм Best Dinner для взрослых собак, ягнёнок и томаты 1.5кг',
    description: 'Полноценный сбалансированный корм для собак всех пород с ягненком и овощами.',
    price: 4500,
    category: 'food',
    animal_types: ['dogs'],
    article: 'ZV-D001',
    img: 'https://picsum.photos/seed/best_dinner_dog/600/600',
    status: 'available',
    is_featured: true,
  },
  {
    id: 'd2',
    name: 'Полидекс Поливит Кальций+ 500 таблеток',
    description: 'Витаминно-минеральный комплекс для щенков и взрослых собак.',
    price: 8900,
    category: 'medicines',
    animal_types: ['dogs'],
    article: 'ZV-D002',
    img: 'https://picsum.photos/seed/polydex_vitamins/600/600',
    status: 'available',
  },
  {
    id: 'd3',
    name: 'Корм Monge Dog Medium Adult ягненок с рисом 12кг',
    description: 'Полнорационный корм для взрослых собак средних пород.',
    price: 28500,
    category: 'food',
    animal_types: ['dogs'],
    article: 'ZV-D003',
    img: 'https://picsum.photos/seed/monge_dog_food/600/600',
    status: 'preorder',
  },
  {
    id: 'd4',
    name: 'Мильбемакс для собак 2 таб',
    description: 'Средство от глистов широкого спектра действия.',
    price: 3200,
    category: 'medicines',
    animal_types: ['dogs'],
    article: 'ZV-D004',
    img: 'https://picsum.photos/seed/milbemax_dog/600/600',
    status: 'available',
  },
  {
    id: 'd5',
    name: 'Шампунь Cliny для длинношерстных собак 200мл',
    description: 'Укрепляет шерсть и облегчает расчесывание.',
    price: 1800,
    category: 'hygiene',
    animal_types: ['dogs'],
    article: 'ZV-D005',
    img: 'https://picsum.photos/seed/dog_shampoo/600/600',
    status: 'available',
  },

  // --- CATS ---
  {
    id: 'c1',
    name: 'GRANDORF 4 вида мяса для взрослых кошек 2кг',
    description: 'Гипоаллергенный корм супер-премиум класса.',
    price: 10500,
    category: 'food',
    animal_types: ['cats'],
    article: 'ZV-C001',
    img: 'https://picsum.photos/seed/grandorf_cat/600/600',
    status: 'available',
    is_featured: true,
  },
  {
    id: 'c2',
    name: 'Наполнитель Mr.BOBAA TOFU зеленый чай 7л',
    description: 'Комкующийся натуральный соевый наполнитель.',
    price: 3900,
    category: 'hygiene',
    animal_types: ['cats'],
    article: 'ZV-C002',
    img: 'https://picsum.photos/seed/cat_tofu_lit/600/600',
    status: 'available',
  },
  {
    id: 'c3',
    name: 'Стронгхолд для кошек 45мг',
    description: 'Капли от блох, клещей и гельминтов.',
    price: 4800,
    category: 'medicines',
    animal_types: ['cats'],
    article: 'ZV-C003',
    img: 'https://picsum.photos/seed/stronghold_cat/600/600',
    status: 'available',
  },
  {
    id: 'c4',
    name: 'Консервы Schesir Тунец с креветками 85г',
    description: 'Натуральный влажный корм для кошек.',
    price: 950,
    category: 'food',
    animal_types: ['cats'],
    article: 'ZV-C004',
    img: 'https://picsum.photos/seed/schesir_cat/600/600',
    status: 'available',
  },
  {
    id: 'c5',
    name: 'Расческа-пуходерка для кошек средняя',
    description: 'Для бережного удаления подшерстка.',
    price: 2500,
    category: 'accessories',
    animal_types: ['cats'],
    article: 'ZV-C005',
    img: 'https://picsum.photos/seed/cat_brush/600/600',
    status: 'available',
  },

  // --- LIVESTOCK ---
  {
    id: 'lv1',
    name: 'Мультибактерин Омега-10 для КРС',
    description: 'Пробиотик для крупного рогатого скота.',
    price: 12000,
    category: 'medicines',
    animal_types: ['cattle'],
    article: 'ZV-L001',
    img: 'https://picsum.photos/seed/cow_medicine/600/600',
    status: 'available',
  },
  {
    id: 'lv2',
    name: 'Премикс для коров "Золотой белок" 10кг',
    description: 'Витаминно-минеральная добавка.',
    price: 8500,
    category: 'food',
    animal_types: ['cattle'],
    article: 'ZV-L002',
    img: 'https://picsum.photos/seed/cow_premix/600/600',
    status: 'available',
  },

  // --- HORSES ---
  {
    id: 'h1',
    name: 'Гель для суставов охлаждающе-разогревающий 500мл',
    description: 'Профессиональное средство для ухода за ногами лошадей.',
    price: 4200,
    category: 'hygiene',
    animal_types: ['horses'],
    article: 'ZV-H001',
    img: 'https://picsum.photos/seed/horse_gel/600/600',
    status: 'available',
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Яша Оржов',
    specialty: 'Главный ветеринарный врач, хирург',
    bio: 'Более 15 лет опыта в лечении мелких домашних животных.',
    experience: '15 лет',
    image_url: 'https://picsum.photos/seed/vet_doctor/400/500',
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Первичный осмотр',
    description: 'Комплексный осмотр питомца.',
    price_range: 'от 3000 ₸',
  },
];

export const MOCK_BLOG: BlogPost[] = [
  {
    id: '1',
    title: 'Подготовка к весне',
    excerpt: 'Советы по уходу.',
    content: 'Полный текст статьи...',
    date: '15.03.2024',
    image_url: 'https://picsum.photos/seed/blog1/800/400',
    slug: 'spring-prep'
  }
];
