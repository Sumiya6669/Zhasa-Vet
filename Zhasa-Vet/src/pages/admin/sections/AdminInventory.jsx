import React, { useState, useMemo } from 'react';
import { localDB } from '@/lib/localDB';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Корма и питание', 'Лекарства и фармацевтика', 'Витамины и добавки',
  'Антипаразитарные средства', 'Гигиена и уход', 'Аксессуары и оборудование',
  'Уход за ранами', 'Лакомства',
];

export default function AdminInventory() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Все');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => localDB.entities.Product.list('-created_date', 200),
  });

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.article?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'Все' || p.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [products, search, filterCat]);

  const exportJSON = () => {
    const data = filtered.map(p => ({
      article: p.article,
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zhasavet-inventory-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Экспортировано ${data.length} позиций`);
  };

  const totalValue = filtered.reduce((s, p) => s + (p.price || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Позиций</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Категорий</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{new Set(filtered.map(p => p.category)).size}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Сумма каталога</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalValue.toLocaleString()} ₸</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Поиск по артикулу или названию..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Все">Все категории</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportJSON}>
          <Download className="w-4 h-4 mr-1" /> Экспорт JSON
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Артикул</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead className="text-right">Цена (₸)</TableHead>
              <TableHead className="text-right">Рейтинг</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><div className="h-4 bg-slate-100 rounded animate-pulse" /></TableCell>)}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-400">Нет данных</TableCell></TableRow>
            ) : (
              filtered.map(p => (
                <TableRow key={p.id} className="hover:bg-slate-50">
                  <TableCell><span className="font-mono text-xs text-slate-600">{p.article}</span></TableCell>
                  <TableCell className="font-medium text-slate-800 max-w-[200px] truncate">{p.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-600">{p.brand || '—'}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{p.price?.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-slate-600">
                    {p.rating > 0 ? `${p.rating} ★` : '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}