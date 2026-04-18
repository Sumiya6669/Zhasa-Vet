import { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../App';
import { Copy, Plus, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const copyArticle = () => {
    navigator.clipboard.writeText(product.article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avgRating = product.reviews?.length 
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden group hover:border-brand-teal/30 transition-all flex flex-col h-full">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.img} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        {product.status === 'preorder' && (
          <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg">
            Предзаказ
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-bold text-slate-700">{avgRating}</span>
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 leading-snug">{product.name}</h3>
          <button 
            onClick={copyArticle}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
            title="Копировать артикул"
          >
            {copied ? <span className="text-[10px] font-bold italic">OK</span> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{product.article}</span>
          <div className="h-1 w-1 bg-slate-300 rounded-full" />
          <span className="text-xs text-brand-teal font-semibold">
            {product.status === 'available' ? 'В наличии' : 'По предзаказу'}
          </span>
        </div>

        <button 
          onClick={() => setShowReviews(!showReviews)}
          className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 hover:text-brand-teal transition-colors"
        >
          <MessageSquare size={12} /> {product.reviews?.length || 0} отзывов
        </button>

        <div className="pt-2 flex items-center justify-between mt-auto">
          <div className="space-y-0.5">
            <span className="text-xl font-bold text-slate-900 leading-none">{product.price.toLocaleString()} ₸</span>
            {product.status === 'preorder' && (
              <p className="text-[9px] text-slate-400 leading-tight">Уточняйте наличие</p>
            )}
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-brand-teal/20"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>

      {/* Reviews Overlay */}
      <AnimatePresence>
        {showReviews && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h4 className="font-bold text-slate-800">Отзывы</h4>
              <button 
                onClick={() => setShowReviews(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {product.reviews?.length ? (
                product.reviews.map(review => (
                  <div key={review.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{review.user_name}</span>
                      <span className="text-slate-400 tracking-tighter">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 italic mt-1 leading-relaxed">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-10">Пока нет отзывов</p>
              )}
            </div>
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold mt-4">
              Оставить отзыв
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
