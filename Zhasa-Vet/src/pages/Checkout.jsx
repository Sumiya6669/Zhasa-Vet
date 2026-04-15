import React, { useState } from 'react';
import { localDB } from '@/lib/localDB';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, MapPin, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
          <p className="text-muted-foreground mb-6">Добавьте товары из каталога</p>
          <Link to="/pharmacy"><Button>Перейти в каталог</Button></Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Заказ оформлен!</h2>
          <p className="text-muted-foreground mb-6">
            Мы свяжемся с вами для подтверждения. Забрать заказ можно по адресу: ул. Сталелитейная, 3/3А.
          </p>
          <Link to="/"><Button size="lg">На главную</Button></Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Заполните имя и телефон');
      return;
    }
    setIsSubmitting(true);

    if (payment === 'whatsapp') {
      const msg = `Заказ из ZhasaVet:\n\nИмя: ${name}\nТелефон: ${phone}\n\nТовары:\n${items.map(i => `• ${i.name} (${i.article}) x${i.quantity} — ${(i.price * i.quantity).toLocaleString()} ₸`).join('\n')}\n\nИтого: ${total.toLocaleString()} ₸\n${notes ? `\nПримечание: ${notes}` : ''}`;
      window.open(`https://wa.me/77077979079?text=${encodeURIComponent(msg)}`, '_blank');
      clearCart();
      setIsSuccess(true);
    } else {
      await localDB.entities.Order.create({
        customer_name: name,
        customer_phone: phone,
        items: items.map(i => ({
          product_id: i.id,
          product_name: i.name,
          article: i.article,
          quantity: i.quantity,
          price: i.price,
        })),
        total,
        payment_method: 'cash',
        notes,
        status: 'new',
      });
      clearCart();
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold mb-2">Оформление заказа</h1>
        <p className="text-muted-foreground mb-10">Заполните данные для оформления заказа на самовывоз</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 707 ..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Примечание</Label>
              <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Дополнительная информация..." />
            </div>

            {/* Pickup notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Самовывоз</p>
                <p className="text-xs text-muted-foreground">г. Караганда, ул. Сталелитейная, 3/3А, 13-й микрорайон</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-3">
              <Label>Способ оплаты</Label>
              <RadioGroup value={payment} onValueChange={setPayment}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Наличные при получении</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="cursor-pointer">Заказ через WhatsApp</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Оформляем...' : payment === 'whatsapp' ? 'Отправить в WhatsApp' : 'Оформить заказ'}
            </Button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Ваш заказ</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.article} × {item.quantity}</p>
                    </div>
                    <span className="font-medium whitespace-nowrap ml-4">{(item.price * item.quantity).toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-primary">{total.toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}