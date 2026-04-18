import { useState, useEffect } from 'react';
import { useCart, useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, User, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: user.email?.split('@')[0] || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    try {
      await api.createOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        user_id: user?.id,
        items: cart,
        total: total,
        status: 'new',
        date: new Date().toLocaleString('ru-RU')
      });
      setIsOrdered(true);
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (err) {
      console.error('Order error:', err);
      alert('Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-800">Спасибо за заказ!</h2>
            <p className="text-slate-500 leading-relaxed">
              Ваш заказ успешно оформлен. <br />
              Наш консультант свяжется с вами в течение 15 минут для подтверждения наличия товаров.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-sm text-left space-y-2">
            <p className="font-bold text-slate-700">Тип получения: Самовывоз</p>
            <p className="text-slate-500">Адрес: Караганда, ул. Сталелитейная, 3/3А</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 bg-brand-teal text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-teal/20"
          >
            Вернуться на главную
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Order Form */}
        <div className="flex-grow space-y-12">
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/pharmacy')}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-teal transition-colors font-medium mb-8"
            >
              <ArrowLeft size={18} /> Вернуться в аптеку
            </button>
            <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight">Оформление <span className="text-brand-teal">заказа</span></h1>
            <div className="flex items-center gap-4 text-brand-orange bg-brand-orange/5 px-4 py-2 rounded-xl inline-flex font-bold text-sm italic">
               Только самовывоз из аптеки
            </div>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <User size={20} className="text-brand-teal" /> Ваши данные
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ваше имя*</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Александр" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Телефон*</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+7 (___) ___ __ __" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <MapPin size={20} className="text-brand-teal" /> Способ получения
              </h3>
              <div className="p-6 bg-brand-teal/5 border border-brand-teal/20 rounded-3xl flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-teal shadow-sm flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Самовывоз (из аптеки)</h4>
                  <p className="text-sm text-slate-500">Адрес: Караганда, ул. Сталелитейная, 3/3А</p>
                  <p className="text-xs text-brand-teal font-medium mt-1">Готовы к выдаче сегодня в течение 1 часа</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                Комментарий
              </h3>
              <textarea 
                rows={4} 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Напишите, если важна конкретная дата или время..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all resize-none"
              ></textarea>
            </section>

            <button 
              type="submit"
              disabled={cart.length === 0}
              className={`w-full py-5 text-white rounded-[32px] font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-[0.98] ${cart.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-brand-teal hover:bg-brand-teal-dark shadow-brand-teal/20'}`}
            >
              {loading ? <Loader2 className="mx-auto animate-spin" /> : `Подтвердить заказ на ${total.toLocaleString()} ₸`}
            </button>
          </form>
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:w-96 space-y-8">
          <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl sticky top-28 space-y-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <ShoppingBag size={20} className="text-brand-teal" /> Ваш заказ
            </h3>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.img} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-grow space-y-1">
                    <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{item.name}</p>
                    <p className="text-xs text-slate-400 font-medium">Кол-во: {item.quantity}</p>
                    <p className="text-sm font-bold text-brand-teal italic">{item.price.toLocaleString()} ₸</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-dashed border-slate-200 space-y-4">
              <div className="flex justify-between text-slate-500">
                <span>Товары:</span>
                <span>{total.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Получение:</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest mt-1">Бесплатно</span>
              </div>
              <div className="flex justify-between items-end pt-4 font-bold text-2xl text-slate-900 font-display">
                <span>Итого:</span>
                <span className="text-brand-teal underline decoration-brand-orange/30">{total.toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
