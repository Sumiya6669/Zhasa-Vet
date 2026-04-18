import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Loader2, X } from 'lucide-react';
import { api } from '../lib/api';
import { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function loadBlog() {
      try {
        const data = await api.getBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadBlog();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange">
          Полезные материалы
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
          Блог ZhasaVet
        </h1>
        <p className="text-lg text-slate-500 leading-8">
          Статьи по уходу, питанию и профилактике для владельцев домашних и сельскохозяйственных
          животных. Все публикации подтягиваются из Supabase.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[32px] border border-slate-200 bg-white py-24 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-brand-teal" />
        </div>
      ) : posts.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-brand-teal/20 transition-all"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900">{post.title}</h2>
                <p className="text-slate-500 leading-7 line-clamp-3">{post.excerpt}</p>
                <div className="inline-flex items-center gap-2 text-brand-teal font-semibold">
                  Читать статью
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
          В блоге пока нет публикаций. Добавьте первую статью в админ-панели.
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl my-10 rounded-[36px] overflow-hidden bg-white shadow-2xl">
            <div className="relative aspect-[16/7] overflow-hidden">
              <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute right-5 top-5 w-11 h-11 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 md:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                <Calendar size={14} />
                {selectedPost.date}
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
                {selectedPost.title}
              </h2>
              <p className="text-lg text-slate-500 leading-8">{selectedPost.excerpt}</p>
              <div className="whitespace-pre-line text-slate-700 leading-8">{selectedPost.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
