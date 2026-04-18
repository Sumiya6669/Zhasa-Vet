import { useEffect, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { AnimalTarget, Category, Product, ProductInput } from '../types';

interface AddProductModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: ProductInput = {
  name: '',
  description: '',
  full_description: '',
  price: 0,
  category: 'food',
  animal_types: [],
  article: 'ZV-',
  img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop',
  status: 'available',
  is_featured: false,
};

const ANIMAL_OPTIONS: { id: AnimalTarget; label: string }[] = [
  { id: 'cats', label: 'Кошки' },
  { id: 'dogs', label: 'Собаки' },
  { id: 'birds', label: 'Птицы' },
  { id: 'rodents', label: 'Грызуны' },
  { id: 'cattle', label: 'КРС' },
  { id: 'small_cattle', label: 'МРС' },
  { id: 'horses', label: 'Лошади' },
  { id: 'small_animals', label: 'Мелкие животные' },
  { id: 'all', label: 'Для всех' },
];

const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: 'food', label: 'Корма' },
  { id: 'medicines', label: 'Лекарства' },
  { id: 'hygiene', label: 'Гигиена' },
  { id: 'accessories', label: 'Аксессуары' },
  { id: 'equipment', label: 'Оборудование' },
];

export default function AddProductModal({
  initialProduct,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductInput>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialProduct) {
      setFormData(EMPTY_FORM);
      return;
    }

    const { id: _id, reviews: _reviews, ...product } = initialProduct;
    setFormData({
      ...EMPTY_FORM,
      ...product,
      animal_types: [...product.animal_types],
    });
  }, [initialProduct]);

  const toggleAnimal = (animal: AnimalTarget) => {
    setFormData((prev) => ({
      ...prev,
      animal_types: prev.animal_types.includes(animal)
        ? prev.animal_types.filter((item) => item !== animal)
        : [...prev.animal_types, animal],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.animal_types.length) {
      alert('Выберите хотя бы один тип животных.');
      return;
    }

    setLoading(true);

    try {
      if (initialProduct) {
        await api.updateProduct(initialProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }

      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Не удалось сохранить товар.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl flex flex-col"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              {initialProduct ? 'Редактирование товара' : 'Новый товар'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Изменения сразу появляются в каталоге и становятся доступны на сайте после сохранения.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Название">
              <input
                required
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="field-input"
              />
            </Field>

            <Field label="Артикул">
              <input
                required
                type="text"
                value={formData.article}
                onChange={(event) => setFormData({ ...formData, article: event.target.value })}
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Краткое описание">
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="field-input resize-none"
            />
          </Field>

          <Field label="Полное описание">
            <textarea
              rows={5}
              value={formData.full_description || ''}
              onChange={(event) => setFormData({ ...formData, full_description: event.target.value })}
              className="field-input resize-none"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Цена, тг">
              <input
                required
                type="number"
                min={0}
                value={formData.price}
                onChange={(event) => setFormData({ ...formData, price: Number(event.target.value) })}
                className="field-input"
              />
            </Field>

            <Field label="Категория">
              <select
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value as Category })
                }
                className="field-input"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Для каких животных">
            <div className="flex flex-wrap gap-2">
              {ANIMAL_OPTIONS.map((animal) => (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => toggleAnimal(animal.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    formData.animal_types.includes(animal.id)
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {animal.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Ссылка на изображение">
              <input
                type="url"
                value={formData.img}
                onChange={(event) => setFormData({ ...formData, img: event.target.value })}
                className="field-input"
              />
            </Field>

            <Field label="Статус">
              <select
                value={formData.status}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    status: event.target.value as ProductInput['status'],
                  })
                }
                className="field-input"
              >
                <option value="available">В наличии</option>
                <option value="preorder">Под заказ</option>
                <option value="out_of_stock">Нет в наличии</option>
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={Boolean(formData.is_featured)}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  is_featured: event.target.checked,
                })
              }
              className="h-5 w-5 rounded border-slate-300 text-brand-teal focus:ring-brand-teal"
            />
            Показывать товар в блоке популярных на главной странице
          </label>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-brand-teal text-white text-sm font-semibold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {initialProduct ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}
