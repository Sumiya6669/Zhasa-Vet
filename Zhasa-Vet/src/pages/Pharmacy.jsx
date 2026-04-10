import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SectionHeader from '@/components/shared/SectionHeader';
import ProductCard from '@/components/shared/ProductCard';

const ANIMAL_TYPES = [
  'КРС',
  'МРС',
  'Лошади',
  'Собаки',
  'Кошки',
  'Хомяки и грызуны',
  'Попугаи и птицы',
  'Мелкие питомцы',
];

const PRODUCT_CATEGORIES = [
  'Корма и питание',
  'Лекарства и фармацевтика',
  'Витамины и добавки',
  'Антипаразитарные средства',
  'Гигиена и уход',
  'Аксессуары и оборудование',
  'Уход за ранами',
  'Лакомства',
];

const ANIMAL_EMOJIS = {
  'КРС': '🐄',
  'МРС': '🐑',
  'Лошади': '🐴',
  'Собаки': '🐶',
  'Кошки': '🐱',
  'Хомяки и грызуны': '🐹',
  'Попугаи и птицы': '🦜',
  'Мелкие питомцы': '🐾',
};

function FilterChip({ label, emoji, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        border transition-all duration-150 whitespace-nowrap
        ${active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50 hover:text-primary'
        }
      `}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}

export default function Pharmacy() {
  const [search, setSearch] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 200),
  });

  const hasActiveFilters = selectedAnimals.length > 0 || selectedCategories.length > 0 || search;

  const toggleAnimal = (animal) => {
    setSelectedAnimals(prev =>
      prev.includes(animal) ? prev.filter(a => a !== animal) : [...prev, animal]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSelectedAnimals([]);
    setSelectedCategories([]);
    setSearch('');
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchSearch =
          p.name?.toLowerCase().includes(q) ||
          p.article?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }

      // Animal type filter — product must match at least one selected animal
      if (selectedAnimals.length > 0) {
        const productAnimals = Array.isArray(p.animal_types) ? p.animal_types : [];
        const matches = selectedAnimals.some(a => productAnimals.includes(a));
        if (!matches) return false;
      }

      // Category filter — product must match at least one selected category
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(p.category)) return false;
      }

      return true;
    });
  }, [products, search, selectedAnimals, selectedCategories]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Каталог"
            title="Ветеринарная аптека"
            description="Корма, лекарства, витамины и аксессуары для ваших питомцев"
          />
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, артикулу или бренду..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">

          {/* Row 1: Animal types */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Животные</span>
            {ANIMAL_TYPES.map(animal => (
              <FilterChip
                key={animal}
                label={animal}
                emoji={ANIMAL_EMOJIS[animal]}
                active={selectedAnimals.includes(animal)}
                onClick={() => toggleAnimal(animal)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Row 2: Product categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Категория</span>
            {PRODUCT_CATEGORIES.map(cat => (
              <FilterChip
                key={cat}
                label={cat}
                active={selectedCategories.includes(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>

          {/* Active filter summary + reset */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-slate-500">Активные фильтры:</span>
              {selectedAnimals.map(a => (
                <span key={a} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {ANIMAL_EMOJIS[a]} {a}
                  <button onClick={() => toggleAnimal(a)} className="ml-0.5 hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedCategories.map(c => (
                <span key={c} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {c}
                  <button onClick={() => toggleCategory(c)} className="ml-0.5 hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {search && (
                <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  «{search}»
                  <button onClick={() => setSearch('')} className="ml-0.5 hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-destructive underline ml-1 transition-colors"
              >
                Сбросить всё
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Товары не найдены</p>
            <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры поиска или фильтры</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-4 text-sm text-primary underline hover:text-primary/80">
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} товаров</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}