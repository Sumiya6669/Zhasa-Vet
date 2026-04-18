import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl ? 'Set (starts with ' + supabaseUrl.substring(0, 5) + ')' : 'Not set');
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('Error: VITE_SUPABASE_URL is missing or invalid.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // DOGS
  {
    article: 'D-001',
    name: 'Корм Royal Canin Veterinary Diet Gastrointestinal для собак 2кг',
    price: 9500,
    category: 'food',
    description: 'Диетический корм для собак при нарушениях пищеварения.',
    full_description: 'Полнорационный диетический сухой корм для взрослых собак, предназначенный для компенсации нарушений пищеварения и мальабсорбции.',
    img: 'https://images.unsplash.com/photo-1589924691106-073b61073860?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: true,
    status: 'available'
  },
  {
    article: 'D-002',
    name: 'Frontline Combo для собак 10-20кг (3 пипетки)',
    price: 7800,
    category: 'medicines',
    description: 'Капли на холку от блох, клещей и власоедов.',
    full_description: 'Инсектоакарицидный раствор для наружного применения. Защищает от паразитов на 4 недели.',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'D-003',
    name: 'Шампунь 8in1 Tea Tree Oil для собак 250мл',
    price: 3200,
    category: 'hygiene',
    description: 'Успокаивающий шампунь с маслом чайного дерева.',
    full_description: 'Эффективно очищает шерсть, снимает раздражение кожи и зуд.',
    img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'D-004',
    name: 'Лежак Ferplast Siesta Deluxe 4',
    price: 12500,
    category: 'accessories',
    description: 'Пластиковый лежак с антискользящим покрытием.',
    full_description: 'Удобный лежак для собак и кошек, легко моется и имеет вентиляционные отверстия.',
    img: 'https://images.unsplash.com/photo-1591768793355-74d7c869c1b7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs', 'cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'D-005',
    name: 'Бравекто для собак 10-20кг (1 табл)',
    price: 18500,
    category: 'medicines',
    description: 'Жевательная таблетка от блох и клещей на 12 недель.',
    full_description: 'Обеспечивает системную защиту от клещей и блох в течение трех месяцев.',
    img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: true,
    status: 'available'
  },

  // CATS
  {
    article: 'C-001',
    name: 'GRANDORF Cat 4 Meat & Brown Rice Adult Sterilized 2кг',
    price: 9200,
    category: 'food',
    description: 'Низкозерновой корм для стерилизованных кошек.',
    full_description: 'Бельгийский корм супер-премиум класса с высоким содержанием мяса.',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: true,
    status: 'available'
  },
  {
    article: 'C-002',
    name: 'Наполнитель TOFU Mr.Fresh Зеленый чай 6л',
    price: 4500,
    category: 'hygiene',
    description: 'Экологичный соевый наполнитель.',
    full_description: 'Комкующийся натуральный наполнитель, который можно смывать в унитаз.',
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'C-003',
    name: 'Мильбемакс для кошек (2 табл)',
    price: 3800,
    category: 'medicines',
    description: 'Таблетки от гельминтов широкого спектра.',
    full_description: 'Эффективное средство для дегельминтизации кошек.',
    img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'C-004',
    name: 'Дерево-когтеточка Trixie "Altea"',
    price: 24000,
    category: 'accessories',
    description: 'Игровой городок для кошек с когтеточками и платформой.',
    full_description: 'Высота 117 см. Обеспечивает досуг и уход за когтями вашей кошки.',
    img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'C-005',
    name: 'Витамины Beaphar Malt Paste 100г',
    price: 3600,
    category: 'medicines',
    description: 'Мальт-паста для вывода шерсти из желудка.',
    full_description: 'Помогает предотвратить образование волосяных комков в пищеварительном тракте.',
    img: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: false,
    status: 'available'
  },

  // LIVESTOCK
  {
    article: 'L-001',
    name: 'Е-селен для сельскохозяйственных животных 100мл',
    price: 4800,
    category: 'medicines',
    description: 'Витаминный препарат с селеном.',
    full_description: 'Применяется для профилактики и лечения заболеваний, вызванных дефицитом витамина Е и селена.',
    img: 'https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cattle', 'small_cattle', 'horses'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'L-002',
    name: 'Лизунец Kula Salt 5кг',
    price: 2200,
    category: 'food',
    description: 'Минеральный солевой камень.',
    full_description: 'Содержит необходимые минералы для поддержания здоровья скота.',
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cattle', 'small_cattle'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'L-003',
    name: 'Биовит-80 кормовой антибиотик 1кг',
    price: 1500,
    category: 'medicines',
    description: 'Стимулятор роста и лечебная добавка.',
    full_description: 'Применяется для лечения пастереллеза, колибактериоза и других инфекций.',
    img: 'https://images.unsplash.com/photo-1484557918186-7b4e571d4b12?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['cattle', 'small_cattle', 'birds'],
    is_featured: false,
    status: 'available'
  },

  // HORSES
  {
    article: 'H-001',
    name: 'Гель Alezan охлаждающе-разогревающий 500мл',
    price: 5200,
    category: 'medicines',
    description: 'Средство для ухода за суставами и мышцами.',
    full_description: 'Применяется при миозитах, серозных синовитах, тендинитах.',
    img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['horses'],
    is_featured: true,
    status: 'available'
  },
  {
    article: 'H-002',
    name: 'Шампунь-кондиционер для лошадей ZooVIP 500мл',
    price: 2800,
    category: 'hygiene',
    description: 'Придает блеск и облегчает расчесывание.',
    full_description: 'Профессиональное средство для ухода за гривой и хвостом.',
    img: 'https://images.unsplash.com/photo-1598974357851-98165a819bb7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['horses'],
    is_featured: false,
    status: 'available'
  },

  // BIRDS & SMALL ANIMALS
  {
    article: 'S-001',
    name: 'Корм RIO для волнистых попугаев 1кг',
    price: 1950,
    category: 'food',
    description: 'Основной рацион для мелких птиц.',
    full_description: 'Сбалансированная зерносмесь с витаминами и аптечными травами.',
    img: 'https://images.unsplash.com/photo-1522850935371-49c059385653?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['birds'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'S-002',
    name: 'Клетка Ferplast Record 3 для птиц',
    price: 18500,
    category: 'accessories',
    description: 'Классическая клетка с аксессуарами.',
    full_description: 'В комплекте кормушки, поилки и жердочки.',
    img: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['birds'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'S-003',
    name: 'Корм Little One для кроликов 900г',
    price: 1800,
    category: 'food',
    description: 'Полнорационный корм для декоративных кроликов.',
    full_description: 'Содержит травяные гранулы, овощи и плоды рожкового дерева.',
    img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['rodents', 'small_animals'],
    is_featured: false,
    status: 'available'
  },

  // EQUIPMENT
  {
    article: 'E-001',
    name: 'Термометр ветеринарный электронный Microlife',
    price: 4500,
    category: 'equipment',
    description: 'Быстрое и точное измерение температуры.',
    full_description: 'С гибким кончиком, подходит для всех видов животных.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['all'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'E-002',
    name: 'Машинка для стрижки Moser Max 45',
    price: 68000,
    category: 'equipment',
    description: 'Профессиональная машинка для груминга.',
    full_description: 'Мощная двухскоростная машинка для профессиональной стрижки собак и кошек.',
    img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs', 'cats'],
    is_featured: false,
    status: 'preorder'
  },
  {
    article: 'E-003',
    name: 'Микроскоп ветеринарный лабораторный',
    price: 155000,
    category: 'equipment',
    description: 'Для лабораторных исследований.',
    full_description: 'Бинокулярный микроскоп для ветеринарных клиник.',
    img: 'https://images.unsplash.com/photo-1582719501235-953bd9504225?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['all'],
    is_featured: false,
    status: 'preorder'
  },

  // MORE MEDICINES
  {
    article: 'V-001',
    name: 'Гамавит раствор 10мл',
    price: 2800,
    category: 'medicines',
    description: 'Иммуностимулятор для животных.',
    full_description: 'Комбинированный биостимулятор, повышающий устойчивость к заболеваниям.',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['all'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'V-002',
    name: 'Вакцина Мультикан-8 (1 доза)',
    price: 4200,
    category: 'medicines',
    description: 'Комплексная вакцина для собак.',
    full_description: 'Защищает от чумы, парвовируса, аденовируса, лептоспироза и бешенства.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'V-003',
    name: 'Каниквантел Плюс (6 табл)',
    price: 4500,
    category: 'medicines',
    description: 'Антигельминтик для собак и кошек.',
    full_description: 'Высокоэффективный препарат против круглых и ленточных червей.',
    img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs', 'cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'V-004',
    name: 'Бриллиантовые глаза капли 10мл',
    price: 1800,
    category: 'hygiene',
    description: 'Глазные капли для собак и кошек.',
    full_description: 'Применяются для профилактики катаракты и гигиены глаз.',
    img: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs', 'cats'],
    is_featured: false,
    status: 'available'
  },
  {
    article: 'V-005',
    name: 'Фитэкс успокаивающие капли 10мл',
    price: 1500,
    category: 'medicines',
    description: 'Растительный успокаивающий препарат.',
    full_description: 'Снимает стресс при перевозке, посещении врача или смене обстановки.',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&h=800&auto=format&fit=crop',
    animal_types: ['dogs', 'cats'],
    is_featured: false,
    status: 'available'
  }
];

async function seed() {
  console.log('--- Starting Seeding ---');
  
  // 1. Check if products already exist
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking products:', countError);
    return;
  }

  if (count && count > 0) {
    console.log(`Database already contains ${count} products. Skipping insert.`);
  } else {
    console.log('Database empty. Inserting 25 products...');
    const { error: insertError } = await supabase
      .from('products')
      .insert(products);

    if (insertError) {
      console.error('Error seeding products:', insertError);
    } else {
      console.log('Successfully seeded 25 products.');
    }
  }

  // 2. Add some initial blog posts if empty
  const { count: blogCount, error: blogCountError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  if (!blogCountError && (!blogCount || blogCount === 0)) {
    console.log('Seeding blog posts...');
    const blogPosts = [
      {
        title: 'Как подготовить питомца к весне?',
        excerpt: 'Основные советы по профилактике клещей и весенней линьке.',
        content: 'Весна — это не только время солнца, но и период активности паразитов. Убедитесь, что ваш питомец обработан от клещей и блох. Мы рекомендуем использовать капли или таблетки длительного действия...',
        date: '15.03.2024',
        image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&h=600&auto=format&fit=crop',
        slug: 'spring-preparation'
      },
      {
        title: 'Правильное питание: сухой корм или натуралка?',
        excerpt: 'Разбираем плюсы и минусы популярных систем кормления.',
        content: 'Выбор питания — важнейшее решение для здоровья животного. Сухой корм обеспечивает стабильный баланс нутриентов, в то время как натуральное питание требует тщательного расчета рациона специалистом...',
        date: '10.03.2024',
        image_url: 'https://images.unsplash.com/photo-1589924691106-073b61073860?q=80&w=1200&h=600&auto=format&fit=crop',
        slug: 'diet-guide'
      }
    ];
    await supabase.from('blog_posts').insert(blogPosts);
    console.log('Successfully seeded blog posts.');
  }

  console.log('--- Seeding Done ---');
}

seed();
