import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MOCK_BLOG } from '../mockData';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await api.getBlogPosts();
        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error('Blog fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-bold text-slate-900 underline decoration-brand-teal decoration-4 underline-offset-8">Полезный блог</h1>
        <p className="text-slate-500 text-lg">Статьи о здоровье, питании и уходе за вашими питомцами от наших врачей.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-brand-teal animate-spin" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post, index) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/9] overflow-hidden rounded-[32px] mb-6 relative">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-brand-teal flex items-center gap-2 shadow-sm">
                <Calendar size={14} /> {post.date}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="text-brand-orange">Уход и здоровье</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-1.5">
                  <User size={12} /> РЕДАКЦИЯ ZHASAVET
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-slate-800 group-hover:text-brand-teal transition-colors">
                {post.title}
              </h2>

              <p className="text-slate-500 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              <div className="pt-2 flex items-center gap-2 text-brand-teal font-bold group-hover:gap-3 transition-all">
                Читать полностью <ArrowRight size={18} />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      )}

      {/* Newsletter */}
      <section className="bg-brand-teal/5 border border-brand-teal/10 rounded-[40px] p-8 md:p-12 text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-display font-bold text-slate-900">Будьте в курсе</h2>
          <p className="text-slate-500 text-lg">Подпишитесь на нашу рассылку, чтобы получать новые статьи и информацию об акциях первым.</p>
        </div>
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Ваш e-mail" 
            className="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
          />
          <button className="px-8 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-2xl font-bold transition-all whitespace-nowrap">
            Подписаться
          </button>
        </form>
      </section>
    </div>
  );
}
