import React from 'react';
import { localDB } from '@/lib/localDB';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingCart, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminOverview() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => localDB.entities.Order.list('-created_date', 100),
  });
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => localDB.entities.Product.list('-created_date', 200),
  });

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const monthRevenue = orders
    .filter(o => new Date(o.created_date).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + (o.total || 0), 0);
  const newOrders = orders.filter(o => o.status === 'new').length;

  const statusColors = {
    new: 'bg-blue-50 text-blue-700',
    confirmed: 'bg-yellow-50 text-yellow-700',
    ready: 'bg-green-50 text-green-700',
    completed: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-red-50 text-red-700',
  };
  const statusLabels = {
    new: 'Новый', confirmed: 'Подтверждён', ready: 'Готов',
    completed: 'Завершён', cancelled: 'Отменён',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Выручка сегодня" value={`${todayRevenue.toLocaleString()} ₸`} sub={`${todayOrders.length} заказов`} color="bg-primary/10 text-primary" />
        <StatCard icon={TrendingUp} label="Выручка за месяц" value={`${monthRevenue.toLocaleString()} ₸`} sub="Текущий месяц" color="bg-green-100 text-green-700" />
        <StatCard icon={ShoppingCart} label="Новых заказов" value={newOrders} sub="Требуют обработки" color="bg-blue-100 text-blue-700" />
        <StatCard icon={Package} label="Всего товаров" value={products.length} sub="В каталоге" color="bg-purple-100 text-purple-700" />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Последние заказы</h2>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">Заказов пока нет</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 8).map(o => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-slate-800 truncate">{o.customer_name}</p>
                  <p className="text-xs text-slate-400">{o.customer_phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm text-slate-800">{o.total?.toLocaleString()} ₸</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[o.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h2 className="font-semibold text-slate-800">Все товары в каталоге</h2>
          <span className="ml-auto text-xs text-slate-400">{products.length} позиций</span>
        </div>
        <div className="divide-y divide-slate-100">
          {products.slice(0, 6).map(p => (
            <div key={p.id} className="px-5 py-3 flex items-center gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded bg-slate-100 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-400">{p.article}</p>
              </div>
              <span className="text-sm font-semibold text-primary shrink-0">{p.price?.toLocaleString()} ₸</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}