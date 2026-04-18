import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { Category, AnimalTarget } from '../types';

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    full_description: '',
    price: 0,
    category: 'food' as Category,
    animal_types: [] as AnimalTarget[],
    article: 'ZV-',
    img: 'https://picsum.photos/seed/newproduct/600/600',
    status: 'available' as 'available' | 'preorder' | 'out_of_stock',
  });

  const animals: { id: AnimalTarget, label: string }[] = [
    { id: 'cats', label: 'Кошки' },
    { id: 'dogs', label: 'Собаки' },
    { id: 'birds', label: 'Птицы' },
    { id: 'rodents', label: 'Грызуны' },
  ];

  const categories: { id: Category, label: string }[] = [
    { id: 'medicines', label: 'Лекарства' },
    { id: 'hygiene', label: 'Гигиена' },
    { id: 'food', label: 'Корма' },
    { id: 'accessories', label: 'Аксессуары' },
    { id: 'equipment', label: 'Оборудование' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createProduct(formData);
      onSuccess();
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Ошибка при добавлении товара. Проверьте консоль.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnimal = (animal: AnimalTarget) => {
    setFormData(prev => ({
      ...prev,
      animal_types: prev.animal_types.includes(animal)
        ? prev.animal_types.filter(a => a !== animal)
        : [...prev.animal_types, animal]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-teal rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-teal/20">
                <PlusIcon />
             </div>
             <h2 className="text-2xl font-display font-bold text-slate-800">Добавить товар</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Название товара</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Напр: Корм Royal Canin" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Артикул</label>
              <input 
                required
                type="text" 
                value={formData.article}
                onChange={e => setFormData({...formData, article: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Описание</label>
            <textarea 
              rows={3} 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Подробное описание товара..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Цена (₸)</label>
              <input 
                required
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Категория</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all appearance-none"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Для каких животных</label>
            <div className="flex flex-wrap gap-3">
              {animals.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAnimal(a.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${formData.animal_types.includes(a.id) ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">URL Изображения</label>
              <input 
                type="text" 
                value={formData.img}
                onChange={e => setFormData({...formData, img: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Статус</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all appearance-none"
              >
                <option value="available">В наличии</option>
                <option value="preorder">Предзаказ</option>
                <option value="out_of_stock">Нет в наличии</option>
              </select>
            </div>
          </div>
        </form>

        <footer className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-8 py-4 text-slate-500 font-bold hover:text-slate-700 active:scale-95 transition-all"
          >
            Отмена
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 bg-brand-teal text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-teal/20 hover:bg-brand-teal-dark active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Сохранить товар
          </button>
        </footer>
      </div>
    </div>
  );
}

function PlusIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
