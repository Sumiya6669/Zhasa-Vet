import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageCircle,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../App';
import { api } from '../lib/api';
import { buildWhatsAppLink } from '../mockData';
import { CartItem } from '../types';

function formatOrderWhatsAppMessage({
  orderId,
  customerName,
  customerPhone,
  items,
  total,
  notes,
}: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  notes: string;
}) {
  const itemsText = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.quantity} — ${(item.price * item.quantity).toLocaleString('ru-RU')} тг`,
    )
    .join('\n');

  return [
    `Новый заказ №${orderId}`,
    `Имя: ${customerName}`,
    `Телефон: ${customerPhone}`,
    'Товары:',
    itemsText,
    `Сумма: ${total.toLocaleString('ru-RU')} тг`,
    notes.trim() ? `Комментарий: ${notes.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
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
    const whatsAppWindow = window.open('', '_blank');

    try {
      const createdOrder = await api.createOrder({
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        user_id: user?.id,
        items: cart,
        total,
        status: 'new',
        date: new Date().toLocaleString('ru-RU'),
      });

      const orderWhatsAppUrl = buildWhatsAppLink(
        formatOrderWhatsAppMessage({
          orderId: createdOrder.id,
          customerName: formData.name.trim(),
          customerPhone: formData.phone.trim(),
          items: cart,
          total,
          notes: formData.notes,
        }),
      );

      setCreatedOrderId(createdOrder.id);
      setWhatsAppUrl(orderWhatsAppUrl);
      setIsOrdered(true);

      if (whatsAppWindow) {
        whatsAppWindow.location.href = orderWhatsAppUrl;
      }

      window.setTimeout(() => clearCart(), 300);
    } catch (err: any) {
      whatsAppWindow?.close();
      alert(err.message || 'Не удалось оформить заказ. Проверьте данные и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-[40px] border border-slate-200 bg-white p-10 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Заказ оформлен</h1>
          <p className="mt-4 leading-7 text-slate-500">
            Заказ принят. Сообщение для администратора уже подготовлено в WhatsApp, чтобы можно
            было быстро подтвердить наличие и время самовывоза.
          </p>
          {createdOrderId && (
            <div className="mt-4 text-sm font-semibold text-brand-teal">Заказ №{createdOrderId}</div>
          )}
          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Адрес самовывоза</div>
            <div className="mt-2">Караганда, ул. Сталелитейная, 3/3А</div>
          </div>
          {whatsAppUrl && (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-semibold text-white transition-colors hover:bg-green-700"
            >
              <MessageCircle size={18} />
              Открыть WhatsApp администратора
            </a>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-8 w-full rounded-2xl bg-brand-teal py-4 font-semibold text-white transition-colors hover:bg-brand-teal-dark"
          >
            Вернуться на главную
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-8">
          <button
            onClick={() => navigate('/pharmacy')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-teal"
          >
            <ArrowLeft size={16} />
            Вернуться в аптеку
          </button>

          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
              Оформление заказа
            </h1>
            <p className="mt-3 leading-7 text-slate-500">
              Заказ оформляется с самовывозом. После отправки он появится в админ-панели, а для
              администратора откроется готовое сообщение в WhatsApp.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                <User size={20} className="text-brand-teal" />
                Контактные данные
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

            <section className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                <MapPin size={20} className="text-brand-teal" />
                Получение заказа
              </div>

              <div className="flex items-start gap-4 rounded-3xl border border-brand-teal/10 bg-brand-teal/5 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-teal shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Самовывоз из аптеки</div>
                  <div className="mt-1 text-sm text-slate-500">Караганда, ул. Сталелитейная, 3/3А</div>
                  <div className="mt-2 text-sm text-slate-500">
                    После подтверждения заказа мы уточним готовность и удобное время выдачи.
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-5 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
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
              className={`flex w-full items-center justify-center gap-2 rounded-[28px] py-4 text-lg font-semibold transition-colors ${
                cart.length
                  ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal-dark'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
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

        <aside className="h-fit xl:sticky xl:top-28">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3 text-xl font-semibold text-slate-900">
              <ShoppingBag size={20} className="text-brand-teal" />
              Ваш заказ
            </div>

            {cart.length ? (
              <div className="custom-scrollbar max-h-[420px] space-y-4 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.img}
                      alt={`${item.name} — товар ZhasaVet, Караганда`}
                      className="h-16 w-16 rounded-2xl border border-slate-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-400">Количество: {item.quantity}</div>
                      <div className="mt-2 text-sm font-semibold text-brand-teal">
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

            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-slate-500">
                <span>Товары</span>
                <span>{total.toLocaleString('ru-RU')} тг</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Самовывоз</span>
                <span className="font-semibold text-green-600">Бесплатно</span>
              </div>
              <div className="flex items-center justify-between pt-2 text-xl font-display font-bold text-slate-900">
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
