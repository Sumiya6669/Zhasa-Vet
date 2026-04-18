import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { useCart } from '../App';
import { api } from '../lib/api';
import { AnimalTarget, Category, Product } from '../types';

export default function Pharmacy() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeAnimal, setActiveAnimal] = useState<AnimalTarget | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, removeFromCart, total, clearCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesAnimal =
      activeAnimal === 'all' ||
      product.animal_types.includes(activeAnimal as AnimalTarget) ||
      product.animal_types.includes('all');
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.article.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesAnimal && matchesQuery;
  });

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Все категории' },
    { id: 'medicines', label: 'Лекарства' },
    { id: 'hygiene', label: 'Гигиена' },
    { id: 'food', label: 'Корма' },
    { id: 'accessories', label: 'Аксессуары' },
    { id: 'equipment', label: 'Оборудование' },
  ];

  const animals: { id: AnimalTarget | 'all'; label: string }[] = [
    { id: 'all', label: 'Все животные' },
    { id: 'cats', label: 'Кошки' },
    { id: 'dogs', label: 'Собаки' },
    { id: 'birds', label: 'Птицы' },
    { id: 'rodents', label: 'Грызуны' },
    { id: 'cattle', label: 'КРС' },
    { id: 'small_cattle', label: 'МРС' },
    { id: 'horses', label: 'Лошади' },
    { id: 'small_animals', label: 'Мелкие животные' },
  ];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:py-14">
      <Seo
        title="Ветаптека Караганда — лекарства, корма, Royal Canin, Hill's, Frontline"
        description="Ветеринарная аптека ZhasaVet в Караганде, Майкудук: лекарства для животных, корма для собак и кошек, товары для КРС и МРС, Frontline, Royal Canin и Hill's."
        keywords="ветаптека Караганда, ветеринарная аптека Караганда, купить корм для собак Караганда, лекарства для животных Караганда, royal canin караганда, frontline караганда, КРС МРС ветаптека Караганда"
        canonicalPath="/pharmacy"
      />

      <aside className="space-y-6">
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Search size={18} className="text-brand-teal" />
            Поиск по каталогу
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Название или артикул"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
            />
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <SlidersHorizontal size={18} className="text-brand-teal" />
            Категории
          </div>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  activeCategory === category.id
                    ? 'bg-brand-teal text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="font-semibold text-slate-900">Для кого</div>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => setActiveAnimal(animal.id)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  activeAnimal === animal.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {animal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-brand-teal/10 bg-brand-teal/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">Корзина</h3>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-teal px-2 text-xs font-bold text-white">
              {cart.length}
            </span>
          </div>

          {cart.length ? (
            <div className="custom-scrollbar max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-semibold text-slate-900">{item.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.quantity} x {item.price.toLocaleString('ru-RU')} тг
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-teal/20 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
              Корзина пока пустая.
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between font-semibold text-slate-900">
              <span>Итого</span>
              <span>{total.toLocaleString('ru-RU')} тг</span>
            </div>
            <Link
              to="/checkout"
              className={`block w-full rounded-2xl py-3 text-center text-sm font-semibold transition-colors ${
                cart.length
                  ? 'bg-brand-teal text-white hover:bg-brand-teal-dark'
                  : 'pointer-events-none bg-slate-200 text-slate-400'
              }`}
            >
              Перейти к оформлению
            </Link>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full text-center text-sm font-semibold text-slate-500 transition-colors hover:text-red-500"
              >
                Очистить корзину
              </button>
            )}
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 md:text-4xl">
              Ветеринарная аптека в Караганде
            </h1>
            <p className="mt-2 text-slate-500">
              Подберите лекарства для животных, корма для собак и кошек, средства от паразитов,
              товары для КРС и МРС с помощью удобных фильтров по категории и виду животного.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            {loading ? 'Загрузка каталога...' : `Найдено товаров: ${filteredProducts.length}`}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-slate-200 bg-white py-24">
            <Loader2 size={32} className="animate-spin text-brand-teal" />
            <div className="text-slate-500">Загружаем каталог...</div>
          </div>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
            По текущим фильтрам ничего не найдено.
            <div className="mt-4">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveAnimal('all');
                  setSearchQuery('');
                }}
                className="font-semibold text-brand-teal hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
