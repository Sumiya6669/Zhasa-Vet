import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, Loader2, X } from 'lucide-react';
import Seo from '../components/Seo';
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
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 md:py-16">
      <Seo
        title="Блог ZhasaVet — советы ветеринара в Караганде"
        description="Полезные материалы ZhasaVet о профилактике, питании, сезонном уходе и домашней аптечке для собак, кошек и других животных в Караганде."
        keywords="ветеринарный блог Караганда, советы ветеринара Караганда, уход за животными Караганда, прививки собакам кошкам Караганда"
        canonicalPath="/blog"
      />

      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-semibold text-brand-orange">
          Полезные материалы
        </span>
        <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
          Блог ZhasaVet о здоровье животных в Караганде
        </h1>
        <p className="text-lg leading-8 text-slate-500">
          Пишем о профилактике, домашнем уходе, питании и сезонных вопросах, с которыми чаще всего
          сталкиваются владельцы кошек, собак и других животных в Караганде и Майкудуке.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[32px] border border-slate-200 bg-white py-24">
          <Loader2 size={32} className="animate-spin text-brand-teal" />
        </div>
      ) : posts.length ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-teal/20 hover:shadow-xl"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post.image_url}
                  alt={`${post.title} — блог ZhasaVet, Караганда`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  <Calendar size={14} />
                  {post.date}
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900">{post.title}</h2>
                <p className="line-clamp-4 leading-7 text-slate-500">{post.excerpt}</p>
                <div className="inline-flex items-center gap-2 font-semibold text-brand-teal">
                  Читать статью
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
          В блоге скоро появятся новые материалы по уходу, питанию и профилактике.
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="my-10 w-full max-w-4xl overflow-hidden rounded-[36px] bg-white shadow-2xl">
            <div className="relative aspect-[16/7] overflow-hidden">
              <img
                src={selectedPost.image_url}
                alt={`${selectedPost.title} — статья ZhasaVet`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                <Calendar size={14} />
                {selectedPost.date}
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 md:text-4xl">
                {selectedPost.title}
              </h2>
              <p className="text-lg leading-8 text-slate-500">{selectedPost.excerpt}</p>
              <div className="whitespace-pre-line leading-8 text-slate-700">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
