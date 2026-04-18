import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Plus, Trash2, Edit2, LogOut, 
  ClipboardList, Newspaper, RefreshCw,
  TrendingUp, Users, DollarSign, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { MOCK_PRODUCTS, MOCK_BLOG } from '../../mockData';
import { Product, BlogPost, Order } from '../../types';
import { api } from '../../lib/api';
import AddProductModal from '../../components/AddProductModal';
import AddBlogPostModal from '../../components/AddBlogPostModal';
import { useAuth } from '../../App';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'blog' | 'stats'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Stats Data
  const [statsData] = useState({
    totalRevenue: 1250000,
    orderCount: 45,
    newOrders: 3,
    lowStock: 2,
    chartData: [
      { name: 'Пн', sales: 45000 },
      { name: 'Вт', sales: 52000 },
      { name: 'Ср', sales: 38000 },
      { name: 'Чт', sales: 65000 },
      { name: 'Пт', sales: 48000 },
      { name: 'Сб', sales: 72000 },
      { name: 'Вс', sales: 58000 },
    ],
    categoryData: [
      { name: 'Корма', value: 400 },
      { name: 'Лекарства', value: 300 },
      { name: 'Аксессуары', value: 200 },
      { name: 'Прочее', value: 100 },
    ]
  });

  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer_name: 'Иван Петров',
      customer_phone: '+7 701 111 2233',
      items: [{ ...MOCK_PRODUCTS[0], quantity: 1 }],
      total: 3500,
      status: 'new',
      date: '2024-03-20 14:30'
    }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const prods = await api.getProducts();
      if (prods && prods.length > 0) {
        setProducts(prods);
      }

      // Fetch Blog Posts
      const blogPosts = await api.getBlogPosts();
      if (blogPosts && blogPosts.length > 0) {
        setPosts(blogPosts);
      }

      // Fetch Orders
      const orderList = await api.getOrders();
      if (orderList && orderList.length > 0) {
        setOrders(orderList);
      }

    } catch (err) {
      console.error('Admin Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin');
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await api.deleteProduct(id);
      fetchData();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Ошибка при удалении.');
    }
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'products': return 'Каталог товаров';
      case 'orders': return 'Заказы (Самовывоз)';
      case 'blog': return 'Управление блогом';
      case 'stats': return 'Аналитика и Отчеты';
      default: return 'Admin Panel';
    }
  };

  const COLORS = ['#0D9488', '#F97316', '#64748B', '#94A3B8'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-slate-800 tracking-tight leading-tight">Admin<br/>ZhasaVet</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <TabButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<LayoutDashboard size={20} />} 
            label="Дашборд" 
          />
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
            icon={<ShoppingBag size={20} />} 
            label="Каталог" 
          />
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
            icon={<ClipboardList size={20} />} 
            label="Заказы" 
            badge={orders.filter(o => o.status === 'new').length}
          />
          <TabButton 
            active={activeTab === 'blog'} 
            onClick={() => setActiveTab('blog')} 
            icon={<Newspaper size={20} />} 
            label="Статьи блога" 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} /> Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-10 glass">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-slate-800 font-display">{getTabTitle()}</h1>
             <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
               <RefreshCw size={18} className={loading ? 'animate-spin text-brand-teal' : ''} />
             </button>
          </div>
          <div className="flex gap-3">
             {activeTab === 'blog' && (
                <button 
                  onClick={() => setShowBlogModal(true)}
                  className="px-6 py-2.5 bg-brand-orange text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-orange/20 hover:bg-brand-orange-dark transition-all"
                >
                  <Plus size={20} /> Написать статью
                </button>
             )}
             {activeTab === 'products' && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2.5 bg-brand-teal text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-teal/20 hover:bg-brand-teal-dark transition-all"
                >
                  <Plus size={20} /> Добавить товар
                </button>
             )}
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox icon={<DollarSign className="text-green-500" />} label="Выручка" value={statsData.totalRevenue.toLocaleString() + ' ₸'} />
                <StatBox icon={<TrendingUp className="text-brand-teal" />} label="Заказов" value={statsData.orderCount.toString()} />
                <StatBox icon={<Users className="text-blue-500" />} label="Новых заказов" value={statsData.newOrders.toString()} />
                <StatBox icon={<AlertTriangle className="text-amber-500" />} label="Мало на складе" value={statsData.lowStock.toString()} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Продажи за неделю</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statsData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="sales" fill="#0D9488" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Категории товаров</h3>
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statsData.categoryData}
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statsData.categoryData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                       <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Всего</span>
                       <span className="text-2xl font-bold text-slate-800">1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <>
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Наименование</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Артикул</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Цена</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Статус</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Управление</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border" />
                            <span className="font-bold text-slate-700">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono tracking-tighter">{product.article}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{product.price.toLocaleString()} ₸</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${product.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-brand-orange/10 text-brand-orange'}`}>
                            {product.status === 'available' ? 'В наличии' : 'Предзаказ'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-brand-teal bg-slate-50 rounded-lg"><Edit2 size={16} /></button>
                            <button onClick={() => deleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
               {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                     <div className="flex-grow space-y-4 w-full md:w-auto">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <h3 className="font-bold text-lg text-slate-800">Заказ {order.id}</h3>
                              <p className="text-xs text-slate-400">{order.date}</p>
                           </div>
                           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${order.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                              {order.status === 'new' ? 'Новый' : 'Выполнен'}
                           </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-2xl">
                           <div>
                              <p className="text-slate-400 text-xs font-medium uppercase mb-1">Клиент</p>
                              <p className="font-bold text-slate-700">{order.customer_name}</p>
                              <p className="text-slate-500">{order.customer_phone}</p>
                           </div>
                           <div className="text-right sm:text-left">
                              <p className="text-slate-400 text-xs font-medium uppercase mb-1">Сумма заказа</p>
                              <p className="font-bold text-brand-teal text-xl">{order.total.toLocaleString()} ₸</p>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3 w-full md:w-48">
                        <button className="w-full py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/10 hover:bg-brand-teal-dark transition-all">Подтвердить</button>
                        <button className="w-full py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold hover:bg-slate-50 transition-all">Детали</button>
                     </div>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="grid grid-cols-1 gap-4">
               {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-4 flex gap-6 items-center hover:border-brand-teal/20 transition-all">
                     <img src={post.image_url} alt="" className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                     <div className="flex-grow">
                        <h4 className="font-bold text-slate-800 mb-1">{post.title}</h4>
                        <p className="text-xs text-slate-400 mb-4">{post.date}</p>
                        <div className="flex gap-2">
                           <button className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-brand-teal hover:text-white transition-all">Изменить</button>
                           <button className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Удалить</button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchData(); }} />
      )}
      {showBlogModal && (
        <AddBlogPostModal onClose={() => setShowBlogModal(false)} onSuccess={() => { setShowBlogModal(false); fetchData(); }} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: ReactNode, label: string, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20' : 'text-slate-500 hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        {icon} 
        <span className="text-sm">{label}</span>
      </div>
      {badge && badge > 0 && (
         <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'bg-white text-brand-teal' : 'bg-brand-teal text-white'}`}>
            {badge}
         </span>
      )}
    </button>
  );
}

function StatBox({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-200 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 bg-slate-50 rounded-2xl transition-transform hover:scale-110">{icon}</div>
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-display font-bold text-slate-800 leading-none">{value}</div>
      </div>
    </div>
  );
}
