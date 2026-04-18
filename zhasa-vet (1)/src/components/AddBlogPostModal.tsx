import { useState } from 'react';
import { X, Save, Loader2, Plus } from 'lucide-react';
import { api } from '../lib/api';

interface AddBlogPostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBlogPostModal({ onClose, onSuccess }: AddBlogPostModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('ru-RU'),
    image_url: 'https://picsum.photos/seed/blog/800/400',
    slug: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\wа-яё-]+/gi, '') // allowing cyrillic or just stripping
      .replace(/--+/g, '-');
    
    try {
      await api.createBlogPost({ ...formData, slug });
      onSuccess();
    } catch (err) {
      console.error('Error adding blog post:', err);
      alert('Ошибка при сохранении статьи.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <header className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-orange/20">
                <Plus size={24} />
             </div>
             <h2 className="text-2xl font-display font-bold text-slate-800">Написать статью</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Заголовок статьи</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Напр: Как ухаживать за котятами?" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Краткое описание (анонс)</label>
            <textarea 
              required
              rows={2} 
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              placeholder="Кратко о чем статья..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Полный текст</label>
            <textarea 
              required
              rows={8} 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="Текст вашей статьи..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all resize-none"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">URL Изображения</label>
            <input 
              type="text" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
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
            className="px-10 py-4 bg-brand-orange text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-orange/20 hover:bg-brand-orange-dark active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Опубликовать
          </button>
        </footer>
      </div>
    </div>
  );
}
