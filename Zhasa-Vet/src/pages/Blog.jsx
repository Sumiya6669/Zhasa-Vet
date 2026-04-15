import React from 'react';
import { localDB } from '@/lib/localDB';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import SectionHeader from '@/components/shared/SectionHeader';
import { motion } from 'framer-motion';

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => localDB.entities.BlogPost.list('-created_date', 20),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="Блог"
            title="Полезные статьи"
            description="Советы по уходу, питанию и здоровью ваших питомцев от ветеринарного врача"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Статьи скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.id}`} className="group block rounded-2xl border border-border overflow-hidden bg-card hover:shadow-lg transition-all duration-300">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.created_date), 'd MMMM yyyy', { locale: ru })}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>}
                    <div className="flex items-center gap-1 text-sm text-primary font-medium pt-2">
                      Читать далее <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}