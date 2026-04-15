import React, { useState, useEffect } from 'react';
import { localDB } from '@/lib/localDB';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

const EMPTY_FORM = { title: '', excerpt: '', content: '', image_url: '', author: 'Яша Оржов', published: true };

function PostModal({ open, onClose, post, onSave }) {
  const [form, setForm] = useState(post || EMPTY_FORM);

  React.useEffect(() => {
    setForm(post || EMPTY_FORM);
  }, [post, open]);

  const f = (field) => ({
    value: form[field] ?? '',
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post?.id ? 'Редактировать статью' : 'Новая статья'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Заголовок *</Label>
            <Input {...f('title')} placeholder="Название статьи" />
          </div>
          <div className="space-y-1.5">
            <Label>Краткое описание</Label>
            <Input {...f('excerpt')} placeholder="Пару предложений для превью" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Автор</Label>
              <Input {...f('author')} placeholder="Яша Оржов" />
            </div>
            <div className="space-y-1.5">
              <Label>URL обложки</Label>
              <Input {...f('image_url')} placeholder="https://..." />
            </div>
          </div>
          {form.image_url && (
            <div className="rounded-lg overflow-hidden border border-slate-200 h-32">
              <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Содержимое (Markdown) *</Label>
            <Textarea {...f('content')} rows={12} className="font-mono text-sm" placeholder="## Заголовок&#10;&#10;Текст статьи..." />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <Label htmlFor="published" className="cursor-pointer">Опубликовать</Label>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t">
            <Button variant="outline" onClick={onClose}>Отмена</Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                if (!form.title || !form.content) { toast.error('Заполните заголовок и содержимое'); return; }
                onSave(form);
              }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: () => localDB.entities.BlogPost.list('-created_date', 50),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (data.id) return localDB.entities.BlogPost.update(data.id, data);
      return localDB.entities.BlogPost.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setModal(false);
      setEditPost(null);
      toast.success('Статья сохранена');
    },
    onError: () => toast.error('Ошибка при сохранении'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => localDB.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setDeleteTarget(null);
      toast.success('Статья удалена');
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">{posts.length} статей</span>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90"
          onClick={() => { setEditPost(null); setModal(true); }}
        >
          <Plus className="w-4 h-4 mr-1" /> Новая статья
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-16"></TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Автор</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-24 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><div className="h-4 bg-slate-100 rounded animate-pulse" /></TableCell>)}
                </TableRow>
              ))
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">Статей пока нет</TableCell>
              </TableRow>
            ) : (
              posts.map(p => (
                <TableRow key={p.id} className="hover:bg-slate-50">
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-100" />
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-800 line-clamp-1">{p.title}</p>
                    {p.excerpt && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.excerpt}</p>}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{p.author}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {format(new Date(p.created_date), 'd MMM yyyy', { locale: ru })}
                  </TableCell>
                  <TableCell>
                    {p.published !== false ? (
                      <span className="flex items-center gap-1 text-xs text-green-600"><Eye className="w-3 h-3" /> Опубликовано</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400"><EyeOff className="w-3 h-3" /> Скрыто</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"
                        onClick={() => { setEditPost(p); setModal(true); }}>
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

      <PostModal open={modal} onClose={() => { setModal(false); setEditPost(null); }} post={editPost} onSave={saveMutation.mutate} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить статью?</AlertDialogTitle>
            <AlertDialogDescription>«{deleteTarget?.title}» будет удалена безвозвратно.</AlertDialogDescription>
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