import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { BLOG_CONTENT_OVERRIDES, PRODUCT_CONTENT_OVERRIDES } from './src/mockData';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const products = [
  {
    article: 'DOG-001',
    name: 'Royal Canin Gastrointestinal для собак 2 кг',
    price: 9500,
    category: 'food',
    description: 'Диетический корм для поддержки пищеварения.',
    full_description:
      'Подходит для собак с чувствительным ЖКТ и используется как часть восстановительного рациона.',
    img: 'https://images.unsplash.com/photo-1589924691106-073b61073860?q=80&w=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: true,
    status: 'available',
  },
  {
    article: 'DOG-002',
    name: 'Frontline Combo для собак 10–20 кг',
    price: 7800,
    category: 'medicines',
    description: 'Защита от блох, клещей и власоедов.',
    full_description:
      'Капли для наружного применения с удобной схемой использования и понятной дозировкой.',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop',
    animal_types: ['dogs'],
    is_featured: false,
    status: 'available',
  },
  {
    article: 'CAT-001',
    name: 'Grandorf Cat Adult Sterilized 2 кг',
    price: 9200,
    category: 'food',
    description: 'Сбалансированный корм для стерилизованных кошек.',
    full_description:
      'Рацион с высоким содержанием белка и мягкой формулой для ежедневного кормления.',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: true,
    status: 'available',
  },
  {
    article: 'CAT-002',
    name: 'Наполнитель TOFU для кошек 6 л',
    price: 4500,
    category: 'hygiene',
    description: 'Комкующийся наполнитель без резкого запаха.',
    full_description:
      'Подходит для ежедневного использования, легко убирается и хорошо удерживает запах.',
    img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
    animal_types: ['cats'],
    is_featured: false,
    status: 'available',
  },
  {
    article: 'EQ-001',
    name: 'Электронный термометр Microlife',
    price: 4500,
    category: 'equipment',
    description: 'Удобный цифровой термометр для домашнего применения.',
    full_description:
      'Подходит для базового контроля температуры животных в домашних условиях и на ферме.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&auto=format&fit=crop',
    animal_types: ['all'],
    is_featured: false,
    status: 'available',
  },
  {
    article: 'HORSE-001',
    name: 'Гель Alezan для суставов 500 мл',
    price: 5200,
    category: 'medicines',
    description: 'Поддержка суставов и связок у лошадей.',
    full_description:
      'Используется как вспомогательное средство после нагрузок и для регулярного ухода.',
    img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800&auto=format&fit=crop',
    animal_types: ['horses'],
    is_featured: true,
    status: 'available',
  },
  {
    article: 'BIRD-001',
    name: 'Корм RIO для волнистых попугаев 1 кг',
    price: 1950,
    category: 'food',
    description: 'Ежедневный зерновой рацион для декоративных птиц.',
    full_description:
      'Содержит подобранную смесь зерна и подходит для регулярного кормления волнистых попугаев.',
    img: 'https://images.unsplash.com/photo-1522850935371-49c059385653?q=80&w=800&auto=format&fit=crop',
    animal_types: ['birds'],
    is_featured: false,
    status: 'available',
  },
  {
    article: 'FARM-001',
    name: 'Премикс для КРС 10 кг',
    price: 8500,
    category: 'food',
    description: 'Минеральная добавка для хозяйств.',
    full_description:
      'Используется как часть кормовой программы для крупного рогатого скота.',
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=800&auto=format&fit=crop',
    animal_types: ['cattle', 'small_cattle'],
    is_featured: false,
    status: 'preorder',
  },
];

const blogPosts = [
  {
    title: 'Как подготовить питомца к весне',
    excerpt: 'Короткий чеклист по обработке от паразитов, питанию и профилактическому осмотру.',
    content:
      'Весной стоит пересмотреть график обработки от паразитов, обновить базовую аптечку и оценить рацион питомца. Если животное проводит много времени на улице, важно заранее обсудить сезонную профилактику с ветеринарным врачом.',
    date: '15.03.2026',
    image_url:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200&auto=format&fit=crop',
    slug: 'spring-care-checklist',
  },
  {
    title: 'Что должно быть в домашней ветеринарной аптечке',
    excerpt: 'Базовый набор, который полезно держать дома владельцу кошки или собаки.',
    content:
      'В домашней аптечке стоит держать термометр, перевязочные материалы, антисептик, средства для обработки от паразитов и препараты, которые ветеринар уже рекомендовал вашему животному. Не используйте человеческие лекарства без консультации.',
    date: '22.03.2026',
    image_url:
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1200&auto=format&fit=crop',
    slug: 'home-vet-first-aid-kit',
  },
  {
    title: 'Как выбрать корм для стерилизованной кошки',
    excerpt: 'На что смотреть в составе и почему нельзя ориентироваться только на цену.',
    content:
      'После стерилизации важно контролировать калорийность и режим кормления. Лучше выбирать корма с понятным составом, адекватным уровнем белка и формулой, рассчитанной на стерилизованных животных.',
    date: '03.04.2026',
    image_url:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop',
    slug: 'food-for-sterilized-cat',
  },
];

const syncedProducts = products.map((product) => ({
  ...product,
  ...PRODUCT_CONTENT_OVERRIDES[product.article],
}));

const syncedBlogPosts = blogPosts.map((post) => ({
  ...post,
  ...BLOG_CONTENT_OVERRIDES[post.slug],
}));

async function seed() {
  console.log('Seeding products and blog posts...');

  const { error: productsError } = await supabase
    .from('products')
    .upsert(syncedProducts, { onConflict: 'article' });

  if (productsError) {
    throw productsError;
  }

  const { error: blogError } = await supabase
    .from('blog_posts')
    .upsert(syncedBlogPosts, { onConflict: 'slug' });

  if (blogError) {
    throw blogError;
  }

  const [{ count: productsCount, error: productsCountError }, { count: postsCount, error: postsCountError }] =
    await Promise.all([
      supabase.from('products').select('*', { head: true, count: 'exact' }),
      supabase.from('blog_posts').select('*', { head: true, count: 'exact' }),
    ]);

  if (productsCountError) {
    throw productsCountError;
  }

  if (postsCountError) {
    throw postsCountError;
  }

  console.log(`Products in database: ${productsCount ?? 0}`);
  console.log(`Blog posts in database: ${postsCount ?? 0}`);
  console.log('Seeding completed successfully.');
}

seed().catch((error) => {
  console.error('Seeding failed.');
  console.error(error);
  process.exit(1);
});
