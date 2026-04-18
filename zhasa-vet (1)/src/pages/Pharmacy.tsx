import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
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
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-10">
      <aside className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Search size={18} className="text-brand-teal" />
            Поиск
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Название или артикул"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-3 outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
            />
            <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <SlidersHorizontal size={18} className="text-brand-teal" />
            Категории
          </div>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-left transition-colors ${
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

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 space-y-4">
          <div className="text-slate-900 font-semibold">Для кого</div>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => setActiveAnimal(animal.id)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-left transition-colors ${
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

        <div className="rounded-[28px] border border-brand-teal/10 bg-brand-teal/5 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">Корзина</h3>
            <span className="min-w-6 h-6 px-2 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center">
              {cart.length}
            </span>
          </div>

          {cart.length ? (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white border border-white/70 px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 line-clamp-2">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.quantity} × {item.price.toLocaleString('ru-RU')} тг
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-teal/20 bg-white/70 px-4 py-6 text-sm text-slate-500 text-center">
              Корзина пока пустая.
            </div>
          )}

          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between font-semibold text-slate-900">
              <span>Итого</span>
              <span>{total.toLocaleString('ru-RU')} тг</span>
            </div>
            <Link
              to="/checkout"
              className={`block w-full text-center rounded-2xl py-3 text-sm font-semibold transition-colors ${
                cart.length
                  ? 'bg-brand-teal text-white hover:bg-brand-teal-dark'
                  : 'bg-slate-200 text-slate-400 pointer-events-none'
              }`}
            >
              Перейти к оформлению
            </Link>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full text-center text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors"
              >
                Очистить корзину
              </button>
            )}
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Аптека</h1>
            <p className="text-slate-500 mt-2">
              Каталог загружается из Supabase и фильтруется на клиенте без дополнительных API.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            {loading ? 'Загрузка каталога...' : `Найдено товаров: ${filteredProducts.length}`}
          </div>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-slate-200 bg-white py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 size={32} className="animate-spin text-brand-teal" />
            <div className="text-slate-500">Загружаем товары из Supabase...</div>
          </div>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                className="text-brand-teal font-semibold hover:underline"
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
