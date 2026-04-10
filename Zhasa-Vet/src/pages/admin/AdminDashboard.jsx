import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  ClipboardList, Settings, ExternalLink, Menu, X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminOverview from './sections/AdminOverview';
import AdminProducts from './sections/AdminProducts';
import AdminOrders from './sections/AdminOrders';
import AdminBlog from './sections/AdminBlog';
import AdminInventory from './sections/AdminInventory';
import AdminSettings from './sections/AdminSettings';

const NAV = [
  { id: 'overview',   label: 'Обзор',          icon: LayoutDashboard },
  { id: 'products',   label: 'Товары',          icon: Package },
  { id: 'orders',     label: 'Заказы',          icon: ShoppingCart },
  { id: 'blog',       label: 'Статьи',          icon: FileText },
  { id: 'inventory',  label: 'Остатки',         icon: ClipboardList },
  { id: 'settings',   label: 'Настройки',       icon: Settings },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveSection = {
    overview: AdminOverview,
    products: AdminProducts,
    orders: AdminOrders,
    blog: AdminBlog,
    inventory: AdminInventory,
    settings: AdminSettings,
  }[active];

  const activeNav = NAV.find(n => n.id === active);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
          <img
            src="https://media.base44.com/images/public/69d53b93d34df65b976e7cba/c57da13c6_image.png"
            alt="ZhasaVet"
            className="w-9 h-9 rounded-full object-contain"
          />
          <div>
            <p className="font-bold text-slate-800 leading-none">ZhasaVet</p>
            <p className="text-xs text-slate-400 mt-0.5">Панель управления</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {active === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors">
            <ExternalLink className="w-4 h-4" />
            Перейти на сайт
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="font-semibold text-slate-800 text-lg leading-none">{activeNav?.label}</h1>
            <p className="text-xs text-slate-400 mt-0.5">ZhasaVet Admin</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ActiveSection />
        </main>
      </div>
    </div>
  );
}