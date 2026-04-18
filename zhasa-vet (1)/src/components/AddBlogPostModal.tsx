import { useEffect, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { api } from '../lib/api';
import { BlogPost, BlogPostInput } from '../types';

interface AddBlogPostModalProps {
  initialPost?: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM: BlogPostInput = {
  title: '',
  excerpt: '',
  content: '',
  date: new Date().toLocaleDateString('ru-RU'),
  image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop',
  slug: '',
};

function createSlug(value: string) {
  const fallback = `post-${Date.now()}`;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0400-\u04ff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || fallback;
}

export default function AddBlogPostModal({
  initialPost,
  onClose,
  onSuccess,
}: AddBlogPostModalProps) {
  const [formData, setFormData] = useState<BlogPostInput>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialPost) {
      setFormData(EMPTY_FORM);
      return;
    }

    const { id: _id, ...post } = initialPost;
    setFormData(post);
  }, [initialPost]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      slug: createSlug(formData.slug || formData.title),
    };

    try {
      if (initialPost) {
        await api.updateBlogPost(initialPost.id, payload);
      } else {
        await api.createBlogPost(payload);
      }

      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Не удалось сохранить статью.');
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
              {initialPost ? 'Редактирование статьи' : 'Новая статья'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Публикация сохраняется в Supabase и сразу отображается в блоге.
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
          <Field label="Заголовок">
            <input
              required
              type="text"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="field-input"
            />
          </Field>

          <Field label="Анонс">
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })}
              className="field-input resize-none"
            />
          </Field>

          <Field label="Полный текст">
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(event) => setFormData({ ...formData, content: event.target.value })}
              className="field-input resize-none"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Дата публикации">
              <input
                type="text"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                className="field-input"
              />
            </Field>

            <Field label="Slug">
              <input
                type="text"
                value={formData.slug}
                onChange={(event) => setFormData({ ...formData, slug: event.target.value })}
                placeholder="Оставьте пустым для автогенерации"
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Ссылка на изображение">
            <input
              type="url"
              value={formData.image_url}
              onChange={(event) => setFormData({ ...formData, image_url: event.target.value })}
              className="field-input"
            />
          </Field>
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
            className="px-6 py-3 rounded-2xl bg-brand-orange text-white text-sm font-semibold shadow-lg shadow-brand-orange/20 hover:bg-brand-orange-dark transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {initialPost ? 'Сохранить изменения' : 'Опубликовать'}
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
