import { useState } from 'react';
import { Copy, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../App';
import { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);

  const copyArticle = async () => {
    await navigator.clipboard.writeText(product.article);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-xl hover:border-brand-teal/20 transition-all">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles(product.status)}`}>
          {productStatusLabel(product.status)}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 leading-6">{product.name}</h3>
            <p className="text-xs text-slate-400 mt-2">{categoryLabel(product.category)}</p>
          </div>

          <button
            onClick={copyArticle}
            title="Скопировать артикул"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {copied ? <span className="text-[10px] font-bold">OK</span> : <Copy size={14} />}
          </button>
        </div>

        <div className="text-xs text-slate-400">Артикул: {product.article}</div>

        <p className="text-sm leading-6 text-slate-500 flex-1 line-clamp-3">{product.description}</p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Цена</div>
            <div className="text-2xl font-display font-bold text-slate-900">
              {product.price.toLocaleString('ru-RU')} тг
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => addToCart(product)}
            className="w-12 h-12 rounded-2xl bg-brand-teal text-white flex items-center justify-center shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>
    </article>
  );
}

function categoryLabel(category: Product['category']) {
  switch (category) {
    case 'food':
      return 'Корма';
    case 'medicines':
      return 'Лекарства';
    case 'hygiene':
      return 'Гигиена';
    case 'accessories':
      return 'Аксессуары';
    case 'equipment':
      return 'Оборудование';
    default:
      return category;
  }
}

function productStatusLabel(status: Product['status']) {
  switch (status) {
    case 'available':
      return 'В наличии';
    case 'preorder':
      return 'Под заказ';
    case 'out_of_stock':
      return 'Нет в наличии';
    default:
      return status;
  }
}

function statusStyles(status: Product['status']) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-700';
    case 'preorder':
      return 'bg-amber-100 text-amber-700';
    case 'out_of_stock':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
