import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Edit2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import AddBlogPostModal from '../../components/AddBlogPostModal';
import AddProductModal from '../../components/AddProductModal';
import { useAuth } from '../../App';
import { api } from '../../lib/api';
import { BlogPost, Order, Product } from '../../types';

type Tab = 'overview' | 'products' | 'orders' | 'blog';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [orderActionId, setOrderActionId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsData, ordersData, postsData] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getBlogPosts(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setPosts(postsData);
    } catch (err: any) {
      setError(err.message || 'Не удалось загрузить данные админ-панели.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin', { replace: true });
  };

  const handleDeleteProduct = async (productId: string) => {
    const shouldDelete = window.confirm('Удалить этот товар из каталога?');
    if (!shouldDelete) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Не удалось удалить товар.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    const shouldDelete = window.confirm('Удалить статью из блога?');
    if (!shouldDelete) {
      return;
    }

    try {
      await api.deleteBlogPost(postId);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Не удалось удалить статью.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      setOrderActionId(orderId);
      await api.updateOrderStatus(orderId, status);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Не удалось обновить статус заказа.');
    } finally {
      setOrderActionId(null);
    }
  };

  const revenue = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  const newOrdersCount = orders.filter((order) => order.status === 'new').length;
  const featuredProductsCount = products.filter((product) => product.is_featured).length;
  const unavailableProductsCount = products.filter((product) => product.status !== 'available').length;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden md:flex w-72 bg-slate-950 text-slate-300 flex-col">
        <div className="px-7 py-8 border-b border-white/10">
          <div className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-2">ZhasaVet</div>
          <div className="text-2xl font-display font-bold text-white">Панель управления</div>
        </div>

        <div className="p-4 space-y-2 flex-grow">
          <SidebarButton
            active={activeTab === 'overview'}
            icon={<LayoutDashboard size={18} />}
            label="Обзор"
            onClick={() => setActiveTab('overview')}
          />
          <SidebarButton
            active={activeTab === 'products'}
            icon={<Package size={18} />}
            label="Товары"
            onClick={() => setActiveTab('products')}
          />
          <SidebarButton
            active={activeTab === 'orders'}
            icon={<ClipboardList size={18} />}
            label="Заказы"
            badge={newOrdersCount}
            onClick={() => setActiveTab('orders')}
          />
          <SidebarButton
            active={activeTab === 'blog'}
            icon={<FileText size={18} />}
            label="Блог"
            onClick={() => setActiveTab('blog')}
          />
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">{tabTitle(activeTab)}</h1>
              <p className="text-sm text-slate-500">
                Управляйте товарами, заказами и блогом напрямую через Supabase.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => void fetchData()}
                className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-brand-teal/20 hover:text-brand-teal transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Обновить
              </button>

              {activeTab === 'products' && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-brand-teal text-white text-sm font-semibold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Добавить товар
                </button>
              )}

              {activeTab === 'blog' && (
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setShowBlogModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-brand-orange text-white text-sm font-semibold shadow-lg shadow-brand-orange/20 hover:bg-brand-orange-dark transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Добавить статью
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
          {error && (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-[32px] border border-slate-200 bg-white py-24 flex items-center justify-center">
              <Loader2 size={30} className="animate-spin text-brand-teal" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard label="Выручка" value={`${revenue.toLocaleString('ru-RU')} тг`} />
                    <StatCard label="Всего заказов" value={String(orders.length)} />
                    <StatCard label="Новые заказы" value={String(newOrdersCount)} />
                    <StatCard label="Товаров вне наличия" value={String(unavailableProductsCount)} />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <OverviewBlock
                      title="Последние заказы"
                      subtitle={orders.length ? 'Новые заявки из витрины и checkout' : 'Пока нет заказов'}
                    >
                      {orders.length ? (
                        orders.slice(0, 5).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                          >
                            <div>
                              <div className="font-semibold text-slate-900">Заказ #{order.id}</div>
                              <div className="text-sm text-slate-500">{order.customer_name}</div>
                              <div className="text-xs text-slate-400">{order.date}</div>
                            </div>
                            <span className="text-sm font-semibold text-brand-teal">
                              {order.total.toLocaleString('ru-RU')} тг
                            </span>
                          </div>
                        ))
                      ) : (
                        <EmptyState text="Заказы появятся здесь после первого оформления на сайте." />
                      )}
                    </OverviewBlock>

                    <OverviewBlock
                      title="Витрина"
                      subtitle={`${products.length} товаров, из них ${featuredProductsCount} отображаются на главной`}
                    >
                      {products.length ? (
                        products.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                          >
                            <div>
                              <div className="font-semibold text-slate-900">{product.name}</div>
                              <div className="text-xs text-slate-400">{product.article}</div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                              {product.price.toLocaleString('ru-RU')} тг
                            </span>
                          </div>
                        ))
                      ) : (
                        <EmptyState text="Каталог пока пуст. Добавьте товары или выполните сидирование." />
                      )}
                    </OverviewBlock>

                    <OverviewBlock
                      title="Блог"
                      subtitle={posts.length ? 'Последние публикации сайта' : 'Пока нет публикаций'}
                    >
                      {posts.length ? (
                        posts.slice(0, 5).map((post) => (
                          <div
                            key={post.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                          >
                            <div className="font-semibold text-slate-900">{post.title}</div>
                            <div className="text-xs text-slate-400 mt-1">{post.date}</div>
                          </div>
                        ))
                      ) : (
                        <EmptyState text="Добавьте первую статью, чтобы блог сразу был живым после релиза." />
                      )}
                    </OverviewBlock>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="rounded-[32px] border border-slate-200 bg-white overflow-hidden">
                  {products.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[820px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr className="text-left text-xs uppercase tracking-widest text-slate-400">
                            <th className="px-6 py-4">Товар</th>
                            <th className="px-6 py-4">Артикул</th>
                            <th className="px-6 py-4">Категория</th>
                            <th className="px-6 py-4">Цена</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50/80">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                                  />
                                  <div>
                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                    <div className="text-xs text-slate-400">{product.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">{product.article}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {categoryLabel(product.category)}
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-900">
                                {product.price.toLocaleString('ru-RU')} тг
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles(product.status)}`}>
                                  {productStatusLabel(product.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(product);
                                      setShowProductModal(true);
                                    }}
                                    className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => void handleDeleteProduct(product.id)}
                                    className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10">
                      <EmptyState text="Товары ещё не добавлены. Выполните сидирование или создайте первый товар вручную." />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length ? (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[32px] border border-slate-200 bg-white p-6 md:p-7 flex flex-col xl:flex-row xl:items-start gap-6"
                      >
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900">Заказ #{order.id}</h3>
                              <p className="text-sm text-slate-500">
                                {order.customer_name} • {order.customer_phone}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">{order.date}</p>
                            </div>
                            <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${orderStatusStyles(order.status)}`}>
                              {orderStatusLabel(order.status)}
                            </span>
                          </div>

                          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                            <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                              Состав заказа
                            </div>
                            <div className="space-y-2">
                              {getOrderItems(order).map((item, index) => (
                                <div
                                  key={`${order.id}-${index}`}
                                  className="flex items-center justify-between gap-4 text-sm"
                                >
                                  <span className="text-slate-700">
                                    {item.name || 'Товар без названия'} × {item.quantity || 1}
                                  </span>
                                  <span className="font-semibold text-slate-900">
                                    {Number(item.price || 0).toLocaleString('ru-RU')} тг
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-full xl:w-64 space-y-4">
                          <div className="rounded-2xl bg-brand-teal/5 border border-brand-teal/10 p-4">
                            <div className="text-xs uppercase tracking-widest text-slate-400">Сумма</div>
                            <div className="text-2xl font-display font-bold text-brand-teal mt-1">
                              {order.total.toLocaleString('ru-RU')} тг
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            <OrderStatusButton
                              active={order.status === 'new'}
                              disabled={orderActionId === order.id}
                              label="Оставить новым"
                              onClick={() => void handleUpdateOrderStatus(order.id, 'new')}
                            />
                            <OrderStatusButton
                              active={order.status === 'completed'}
                              disabled={orderActionId === order.id}
                              label="Отметить выполненным"
                              onClick={() => void handleUpdateOrderStatus(order.id, 'completed')}
                            />
                            <OrderStatusButton
                              active={order.status === 'cancelled'}
                              disabled={orderActionId === order.id}
                              label="Отменить"
                              onClick={() => void handleUpdateOrderStatus(order.id, 'cancelled')}
                              tone="danger"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[32px] border border-slate-200 bg-white p-10">
                      <EmptyState text="Пока нет заказов. После первого checkout они появятся здесь автоматически." />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="space-y-4">
                  {posts.length ? (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6 flex flex-col md:flex-row gap-5"
                      >
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full md:w-56 h-40 rounded-[28px] object-cover border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-semibold text-slate-900">{post.title}</h3>
                              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                              <div className="text-xs text-slate-400 mt-3">
                                {post.date} • /blog/{post.slug}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:justify-end">
                              <button
                                onClick={() => {
                                  setEditingPost(post);
                                  setShowBlogModal(true);
                                }}
                                className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => void handleDeletePost(post.id)}
                                className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[32px] border border-slate-200 bg-white p-10">
                      <EmptyState text="В блоге пока нет материалов. Добавьте первую статью прямо из панели." />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showProductModal && (
        <AddProductModal
          initialProduct={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowProductModal(false);
            setEditingProduct(null);
            void fetchData();
          }}
        />
      )}

      {showBlogModal && (
        <AddBlogPostModal
          initialPost={editingPost}
          onClose={() => {
            setShowBlogModal(false);
            setEditingPost(null);
          }}
          onSuccess={() => {
            setShowBlogModal(false);
            setEditingPost(null);
            void fetchData();
          }}
        />
      )}
    </div>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
        active ? 'bg-brand-teal text-white' : 'text-slate-300 hover:bg-white/5'
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      {badge && badge > 0 ? (
        <span
          className={`min-w-5 h-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
            active ? 'bg-white text-brand-teal' : 'bg-brand-orange text-white'
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="text-xs uppercase tracking-widest text-slate-400">{label}</div>
      <div className="text-3xl font-display font-bold text-slate-900 mt-3">{value}</div>
    </div>
  );
}

function OverviewBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">{text}</div>;
}

function OrderStatusButton({
  active,
  disabled,
  label,
  tone = 'default',
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  tone?: 'default' | 'danger';
  onClick: () => void;
}) {
  const baseClass =
    tone === 'danger'
      ? active
        ? 'bg-red-500 text-white'
        : 'bg-red-50 text-red-600 hover:bg-red-100'
      : active
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${baseClass}`}
    >
      {disabled ? 'Сохранение...' : label}
    </button>
  );
}

function tabTitle(tab: Tab) {
  switch (tab) {
    case 'overview':
      return 'Обзор';
    case 'products':
      return 'Управление товарами';
    case 'orders':
      return 'Заказы';
    case 'blog':
      return 'Блог';
    default:
      return 'Админ-панель';
  }
}

function categoryLabel(category: Product['category']) {
  switch (category) {
    case 'food':
      return 'Корма';
    case 'medicines':
      return 'Лекарства';
    case 'hygiene':
      return 'Гигиена';
    case 'accessories':
      return 'Аксессуары';
    case 'equipment':
      return 'Оборудование';
    default:
      return category;
  }
}

function productStatusLabel(status: Product['status']) {
  switch (status) {
    case 'available':
      return 'В наличии';
    case 'preorder':
      return 'Под заказ';
    case 'out_of_stock':
      return 'Нет в наличии';
    default:
      return status;
  }
}

function orderStatusLabel(status: Order['status']) {
  switch (status) {
    case 'new':
      return 'Новый';
    case 'completed':
      return 'Выполнен';
    case 'cancelled':
      return 'Отменён';
    default:
      return status;
  }
}

function statusStyles(status: Product['status']) {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-700';
    case 'preorder':
      return 'bg-amber-100 text-amber-700';
    case 'out_of_stock':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function orderStatusStyles(status: Order['status']) {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-700';
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function getOrderItems(order: Order) {
  if (!Array.isArray(order.items)) {
    return [];
  }

  return order.items as Array<{ name?: string; quantity?: number; price?: number }>;
}
