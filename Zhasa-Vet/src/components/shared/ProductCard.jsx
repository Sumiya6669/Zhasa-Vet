import React from 'react';
import { ShoppingCart, Star, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [copied, setCopied] = React.useState(false);

  const handleCopyArticle = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.article);
    setCopied(true);
    toast.success('Артикул скопирован');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-muted relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 opacity-20" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs">
          {product.category}
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        {/* Article */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{product.article}</span>
          <button onClick={handleCopyArticle} className="text-muted-foreground hover:text-primary transition-colors">
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-border'}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews_count || 0})</span>
          </div>
        )}

        {/* Availability */}
        <p className="text-xs text-muted-foreground italic">
          По предзаказу. Уточняйте наличие у консультанта
        </p>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-bold text-primary">{product.price?.toLocaleString()} ₸</span>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              addItem(product);
              toast.success('Добавлено в корзину');
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
}