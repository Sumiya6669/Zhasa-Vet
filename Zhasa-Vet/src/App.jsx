import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { CartProvider } from '@/lib/CartContext';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Pharmacy from '@/pages/Pharmacy';
import Services from '@/pages/Services';
import Doctors from '@/pages/Doctors';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogPostPage from '@/pages/BlogPost';
import Contacts from '@/pages/Contacts';
import Checkout from '@/pages/Checkout';
import AdminDashboard from '@/pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </CartProvider>
      </Router>
      <Toaster />
      <SonnerToaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;