import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../mockData';
import ProductCard from '../components/ProductCard';
import { Category, AnimalTarget, Product } from '../types';
import { useCart } from '../App';
import { api } from '../lib/api';

export default function Pharmacy() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeAnimal, setActiveAnimal] = useState<AnimalTarget | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, removeFromCart, total, clearCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesAnimal = activeAnimal === 'all' || p.animal_types.includes(activeAnimal as AnimalTarget) || p.animal_types.includes('all');
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.article.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAnimal && matchesSearch;
  });

  const categories: { id: Category | 'all', label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'medicines', label: 'Лекарства' },
    { id: 'hygiene', label: 'Гигиена' },
    { id: 'food', label: 'Корма' },
    { id: 'accessories', label: 'Аксессуары' },
    { id: 'equipment', label: 'Оборудование' },
  ];

  const animals: { id: AnimalTarget | 'all', label: string }[] = [
    { id: 'all', label: 'Все животные' },
    { id: 'cattle', label: 'КРС' },
    { id: 'small_cattle', label: 'МРС' },
    { id: 'horses', label: 'Лошади' },
    { id: 'dogs', label: 'Собаки' },
    { id: 'cats', label: 'Кошки' },
    { id: 'birds', label: 'Птицы' },
    { id: 'small_animals', label: 'Мелкие животные' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1 space-y-10">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Search size={18} className="text-brand-teal" /> Поиск
          </h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Название или артикул..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
            />
            <Search className="absolute right-3 top-3.5 text-slate-400" size={18} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-brand-teal" /> Категории
          </h3>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800">Для кого</h3>
          <div className="flex flex-wrap lg:flex-col gap-2">
            {animals.map(animal => (
              <button
                key={animal.id}
                onClick={() => setActiveAnimal(animal.id)}
                className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeAnimal === animal.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {animal.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Quick View */}
        <div className="bg-brand-teal/5 border border-brand-teal/10 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center justify-between">
            Корзина <span className="text-xs bg-brand-teal text-white px-2 py-0.5 rounded-full">{cart.length}</span>
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Ваша корзина пуста</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-3 text-sm group">
                  <div className="flex-grow space-y-1">
                    <p className="font-bold text-slate-700 leading-tight">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.quantity} x {item.price.toLocaleString()} ₸</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="pt-4 border-t border-brand-teal/10 space-y-4">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Итого:</span>
                <span>{total.toLocaleString()} ₸</span>
              </div>
              <Link 
                to="/checkout"
                className="w-full py-3 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-xl font-bold shadow-lg transition-all block text-center"
              >
                Оформить (Самовывоз)
              </Link>
              <button onClick={clearCart} className="w-full text-xs text-slate-400 hover:text-red-500 transition-colors">
                Очистить корзину
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {loading ? 'Загрузка товаров...' : `Найдено: ${filteredProducts.length}`}
          </h2>
          <div className="text-sm text-slate-400">Сортировка по умолчанию</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 size={48} className="text-brand-teal animate-spin" />
            <p className="text-slate-500 font-medium">Загружаем лучший ассортимент...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={40} />
            </div>
            <p className="text-xl font-medium text-slate-500">К сожалению, ничего не найдено</p>
            <button 
              onClick={() => { setActiveCategory('all'); setActiveAnimal('all'); setSearchQuery(''); }}
              className="text-brand-teal font-bold hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
