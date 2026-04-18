import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../App';
import { api } from '../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (user?.email && !formData.name) {
      setFormData((prev) => ({
        ...prev,
        name: user.email?.split('@')[0] || '',
      }));
    }
  }, [formData.name, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cart.length) {
      return;
    }

    setLoading(true);

    try {
      await api.createOrder({
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        user_id: user?.id,
        items: cart,
        total,
        status: 'new',
        date: new Date().toLocaleString('ru-RU'),
      });

      setIsOrdered(true);
      window.setTimeout(() => clearCart(), 300);
    } catch (err: any) {
      alert(err.message || 'Не удалось оформить заказ. Проверьте данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-[40px] border border-slate-200 bg-white p-10 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Заказ оформлен</h1>
          <p className="text-slate-500 leading-7 mt-4">
            Заказ уже сохранён в Supabase. Мы свяжемся с вами для подтверждения наличия и времени
            самовывоза.
          </p>
          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Адрес самовывоза</div>
            <div className="mt-2">Караганда, ул. Сталелитейная, 3/3А</div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-8 rounded-2xl bg-brand-teal py-4 text-white font-semibold hover:bg-brand-teal-dark transition-colors"
          >
            Вернуться на главную
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-10">
        <section className="space-y-8">
          <button
            onClick={() => navigate('/pharmacy')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-teal transition-colors"
          >
            <ArrowLeft size={16} />
            Вернуться в аптеку
          </button>

          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
              Оформление заказа
            </h1>
            <p className="text-slate-500 mt-3 leading-7">
              Заказ оформляется с самовывозом. После отправки он сразу появится в админ-панели.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                <User size={20} className="text-brand-teal" />
                Контактные данные
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Имя">
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="Например, Айдана"
                    className="field-input"
                  />
                </Field>

                <Field label="Телефон">
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    placeholder="+7 (___) ___ __ __"
                    className="field-input"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                <MapPin size={20} className="text-brand-teal" />
                Получение заказа
              </div>

              <div className="rounded-3xl border border-brand-teal/10 bg-brand-teal/5 p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-brand-teal flex items-center justify-center shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Самовывоз из аптеки</div>
                  <div className="text-sm text-slate-500 mt-1">Караганда, ул. Сталелитейная, 3/3А</div>
                  <div className="text-sm text-slate-500 mt-2">
                    После подтверждения заказа мы уточним готовность и удобное время выдачи.
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 space-y-5">
              <div className="text-xl font-semibold text-slate-900">Комментарий</div>
              <Field label="Дополнительная информация">
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                  placeholder="Например, удобное время звонка"
                  className="field-input resize-none"
                />
              </Field>
            </section>

            <button
              type="submit"
              disabled={loading || !cart.length}
              className={`w-full rounded-[28px] py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                cart.length
                  ? 'bg-brand-teal text-white hover:bg-brand-teal-dark shadow-xl shadow-brand-teal/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <>Подтвердить заказ на {total.toLocaleString('ru-RU')} тг</>
              )}
            </button>
          </form>
        </section>

        <aside className="xl:sticky xl:top-28 h-fit">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <ShoppingBag size={20} className="text-brand-teal" />
              Ваш заказ
            </div>

            {cart.length ? (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 line-clamp-2">{item.name}</div>
                      <div className="text-xs text-slate-400 mt-1">Количество: {item.quantity}</div>
                      <div className="text-sm font-semibold text-brand-teal mt-2">
                        {item.price.toLocaleString('ru-RU')} тг
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Корзина пустая. Добавьте товары в аптеке.
              </div>
            )}

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span>Товары</span>
                <span>{total.toLocaleString('ru-RU')} тг</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Самовывоз</span>
                <span className="text-green-600 font-semibold">Бесплатно</span>
              </div>
              <div className="flex items-center justify-between text-xl font-display font-bold text-slate-900 pt-2">
                <span>Итого</span>
                <span className="text-brand-teal">{total.toLocaleString('ru-RU')} тг</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
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
