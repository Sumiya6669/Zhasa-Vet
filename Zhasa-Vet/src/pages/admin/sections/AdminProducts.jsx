import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Upload, Search, X } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Корма и питание', 'Лекарства и фармацевтика', 'Витамины и добавки',
  'Антипаразитарные средства', 'Гигиена и уход', 'Аксессуары и оборудование',
  'Уход за ранами', 'Лакомства',
];

const ANIMAL_TYPES = ['КРС', 'МРС', 'Лошади', 'Собаки', 'Кошки', 'Хомяки и грызуны', 'Попугаи и птицы', 'Мелкие питомцы'];

const EMPTY_FORM = {
  article: '', name: '', description: '', price: 0,
  category: 'Корма и питание', animal_types: [], brand: '', image_url: '', rating: 0, reviews_count: 0,
};

function ProductModal({ open, onClose, product, onSave, products }) {
  const [form, setForm] = useState(product || EMPTY_FORM);
  const isEdit = !!product?.id;

  React.useEffect(() => {
    if (open) {
      if (product) {
        setForm(product);
      } else {
        // Auto-generate article
        const nums = products
          .map(p => parseInt(p.article?.replace('ZV-', '') || '0'))
          .filter(n => !isNaN(n));
        const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
        setForm({ ...EMPTY_FORM, article: `ZV-${String(next).padStart(3, '0')}` });
      }
    }
  }, [open, product]);

  const f = (field) => ({
    value: form[field] ?? '',
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Артикул</Label>
              <Input {...f('article')} placeholder="ZV-001" />
            </div>
            <div className="space-y-1.5">
              <Label>Бренд</Label>
              <Input {...f('brand')} placeholder="Royal Canin" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Название *</Label>
            <Input {...f('name')} placeholder="Название товара" />
          </div>
          <div className="space-y-1.5">
            <Label>Описание</Label>
            <Textarea {...f('description')} rows={3} placeholder="Краткое описание товара..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Цена (₸) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Категория *</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Виды животных</Label>
            <div className="flex flex-wrap gap-2 p-3 border border-input rounded-md">
              {ANIMAL_TYPES.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    const cur = form.animal_types || [];
                    setForm({ ...form, animal_types: cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a] });
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    (form.animal_types || []).includes(a)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>URL изображения</Label>
            <Input {...f('image_url')} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Рейтинг (0–5)</Label>
              <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Кол-во отзывов</Label>
              <Input type="number" value={form.reviews_count} onChange={e => setForm({ ...form, reviews_count: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button
              onClick={() => { if (!form.name || !form.price) { toast.error('Заполните название и цену'); return; } onSave(form); }}
              className="bg-primary hover:bg-primary/90"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JsonImportModal({ open, onClose, onImport }) {
  const [json, setJson] = useState('');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Массовый импорт товаров (JSON)</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-2">
          <p className="text-sm text-slate-500">Вставьте массив объектов JSON с полями: article, name, price, category, brand, description, image_url</p>
          <Textarea rows={10} value={json} onChange={e => setJson(e.target.value)} className="font-mono text-xs" placeholder='[{"article":"ZV-010","name":"Товар","price":5000,"category":"Лекарства"}]' />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button onClick={() => { onImport(json); setJson(''); }} className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-1" /> Импортировать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [importModal, setImportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Все');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 200),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return base44.entities.Product.update(data.id, data);
      return base44.entities.Product.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setProductModal(false);
      setEditProduct(null);
      toast.success('Товар сохранён');
    },
    onError: () => toast.error('Ошибка при сохранении'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Товар удалён');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Ошибка при удалении'),
  });

  const handleImport = async (json) => {
    const items = JSON.parse(json);
    await base44.entities.Product.bulkCreate(items);
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setImportModal(false);
    toast.success(`Импортировано ${items.length} товаров`);
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.article?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'Все' || p.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [products, search, filterCat]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Поиск по названию или артикулу..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Все">Все категории</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-500">{filtered.length} товаров</span>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => setImportModal(true)}>
            <Upload className="w-4 h-4 mr-1" /> JSON импорт
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => { setEditProduct(null); setProductModal(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Добавить товар
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="w-24 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">Товары не найдены</TableCell>
              </TableRow>
            ) : (
              filtered.map(p => (
                <TableRow key={p.id} className="hover:bg-slate-50">
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded bg-slate-100" />
                    )}
                  </TableCell>
                  <TableCell><span className="font-mono text-xs text-slate-600">{p.article}</span></TableCell>
                  <TableCell className="font-medium text-slate-800 max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-600">{p.brand}</TableCell>
                  <TableCell className="font-semibold text-primary">{p.price?.toLocaleString()} ₸</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"
                        onClick={() => { setEditProduct(p); setProductModal(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                        onClick={() => setDeleteTarget(p)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <ProductModal
        open={productModal}
        onClose={() => { setProductModal(false); setEditProduct(null); }}
        product={editProduct}
        onSave={saveMutation.mutate}
        products={products}
      />
      <JsonImportModal open={importModal} onClose={() => setImportModal(false)} onImport={handleImport} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteTarget?.name}» будет удалён безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteMutation.mutate(deleteTarget.id)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}