import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Phone, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  new:       { label: 'Новый',            cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  confirmed: { label: 'Подтверждён',      cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ready:     { label: 'Готов к выдаче',   cls: 'bg-green-100 text-green-700 border-green-200' },
  completed: { label: 'Выдан',            cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  cancelled: { label: 'Отменён',          cls: 'bg-red-100 text-red-700 border-red-200' },
};

const PAYMENT_LABELS = { cash: 'Наличные', whatsapp: 'WhatsApp' };

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Детали заказа</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-slate-500">Клиент</p><p className="font-medium">{order.customer_name}</p></div>
            <div><p className="text-slate-500">Телефон</p>
              <a href={`tel:${order.customer_phone}`} className="font-medium text-primary hover:underline">{order.customer_phone}</a>
            </div>
            <div><p className="text-slate-500">Оплата</p><p className="font-medium">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</p></div>
            <div><p className="text-slate-500">Дата</p><p className="font-medium">{format(new Date(order.created_date), 'd MMM yyyy, HH:mm', { locale: ru })}</p></div>
          </div>
          {order.notes && (
            <div className="p-3 bg-slate-50 rounded-lg text-sm">
              <p className="text-slate-500 mb-1">Примечание</p>
              <p>{order.notes}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Товары</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-slate-400 text-xs">{item.article} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} ₸</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t font-semibold">
            <span>Итого</span>
            <span className="text-primary text-lg">{order.total?.toLocaleString()} ₸</span>
          </div>
          <div className="flex gap-2 pt-2">
            <a href={`tel:${order.customer_phone}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm"><Phone className="w-4 h-4 mr-1" />Позвонить</Button>
            </a>
            <a href={`https://wa.me/${order.customer_phone?.replace(/\D/g,'')}?text=Здравствуйте, ${order.customer_name}! Ваш заказ на сумму ${order.total?.toLocaleString()} ₸ готов к выдаче.`} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Все');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Статус обновлён');
    },
    onError: () => toast.error('Ошибка при обновлении'),
  });

  const filtered = filterStatus === 'Все' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Фильтр по статусу" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Все">Все статусы</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-500">{filtered.length} заказов</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Клиент</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-32 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => <TableCell key={j}><div className="h-4 bg-slate-100 rounded animate-pulse" /></TableCell>)}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">Заказов нет</TableCell>
              </TableRow>
            ) : (
              filtered.map(o => (
                <TableRow key={o.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-800">{o.customer_name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{o.customer_phone}</TableCell>
                  <TableCell className="font-semibold text-primary">{o.total?.toLocaleString()} ₸</TableCell>
                  <TableCell><span className="text-sm text-slate-600">{PAYMENT_LABELS[o.payment_method] || o.payment_method}</span></TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {format(new Date(o.created_date), 'd MMM, HH:mm', { locale: ru })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs border ${STATUS_CONFIG[o.status]?.cls || 'bg-slate-100 text-slate-600'}`} variant="outline">
                      {STATUS_CONFIG[o.status]?.label || o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(o)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Select value={o.status} onValueChange={status => updateStatus.mutate({ id: o.id, status })}>
                        <SelectTrigger className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-slate-100 rounded [&>svg]:hidden flex items-center justify-center">
                          <span className="text-xs">···</span>
                        </SelectTrigger>
                        <SelectContent align="end">
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}