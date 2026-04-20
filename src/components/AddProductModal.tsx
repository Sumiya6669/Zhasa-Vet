import { useEffect, useState } from 'react';
import { Loader2, Save, Upload, X } from 'lucide-react';
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
  img: '',
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    if (!initialProduct) {
      setFormData({ ...EMPTY_FORM });
      setUploadedFileName('');
      return;
    }

    const { id: _id, reviews: _reviews, ...product } = initialProduct;
    setFormData({
      ...EMPTY_FORM,
      ...product,
      animal_types: [...product.animal_types],
    });
    setUploadedFileName('');
  }, [initialProduct]);

  const toggleAnimal = (animal: AnimalTarget) => {
    setFormData((prev) => ({
      ...prev,
      animal_types: prev.animal_types.includes(animal)
        ? prev.animal_types.filter((item) => item !== animal)
        : [...prev.animal_types, animal],
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение в формате JPG, PNG или WEBP.');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);

    try {
      const imageUrl = await api.uploadProductImage(file);
      setFormData((prev) => ({ ...prev, img: imageUrl }));
      setUploadedFileName(file.name);
    } catch (err: any) {
      alert(
        err.message ||
          'Не удалось загрузить изображение. Проверьте bucket product-images в Supabase Storage.',
      );
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.animal_types.length) {
      alert('Выберите хотя бы один тип животных.');
      return;
    }

    if (!formData.img.trim()) {
      alert('Загрузите изображение товара с компьютера.');
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
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-8 py-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              {initialProduct ? 'Редактирование товара' : 'Новый товар'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Изменения сразу появляются в каталоге и становятся доступны на сайте после сохранения.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <Field label="Изображение товара">
            <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <label className="block cursor-pointer rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition-colors hover:border-brand-teal/30 hover:bg-brand-teal/5">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(event) => void handleImageUpload(event)}
                  disabled={uploadingImage || loading}
                  className="hidden"
                />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal">
                  {uploadingImage ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                </div>
                <div className="mt-4 text-base font-semibold text-slate-900">
                  {uploadingImage ? 'Загружаем изображение...' : 'Загрузить фото с компьютера'}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Ссылка не нужна. Изображение загрузится в Supabase Storage, а адрес сохранится автоматически.
                </p>
              </label>

              {uploadedFileName ? (
                <div className="text-sm text-slate-500">Загружен файл: {uploadedFileName}</div>
              ) : null}

              {formData.img ? (
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  <img
                    src={formData.img}
                    alt="Предпросмотр изображения товара"
                    className="h-64 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
                  После загрузки здесь появится превью изображения.
                </div>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-8 py-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="flex items-center gap-2 rounded-2xl bg-brand-teal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition-colors hover:bg-brand-teal-dark disabled:opacity-70"
          >
            {loading || uploadingImage ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
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
