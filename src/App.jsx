import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ProductDetails from './pages/ProductDetails';
import ProductCategoriesView from './pages/ProductCategoriesView';
import ProductsView from './pages/ProductsView';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import OpenPositions from './components/careers/OpenPositions';
import WhyJoinUs from './components/careers/WhyJoinUs';
import LifeAtGLP from './components/careers/LifeAtGLP';
import Gallery from './pages/Gallery';
import All from './components/gallery/All';
import Manufacturing from './components/gallery/Manufacturing';
import Research from './components/gallery/Research';
import Quality from './components/gallery/Quality';
import Corporate from './components/gallery/Corporate';
import News from './pages/News';
import QuickEnquiry from './pages/QuickEnquiry';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import CompareProducts from './pages/CompareProducts';

function App() {
  return (
    <CompareProvider>
      <CartProvider>
        <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background font-sans text-text-main">
        <Navbar />

        <main className="flex-grow pt-28 lg:pt-[135px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/product-categories-view/:categorySlug" element={<ProductCategoriesView />} />
            <Route path="/products-view/:subCategory" element={<ProductsView />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />}>
              <Route index element={<OpenPositions />} />
              <Route path="why-join-us" element={<WhyJoinUs />} />
              <Route path="life-at-glp" element={<LifeAtGLP />} />
            </Route>
            <Route path="/gallery" element={<Gallery />}>
              <Route index element={<All />} />
              <Route path="manufacturing" element={<Manufacturing />} />
              <Route path="research" element={<Research />} />
              <Route path="quality" element={<Quality />} />
              <Route path="corporate" element={<Corporate />} />
            </Route>
            <Route path="/news" element={<News />} />
            <Route path="/quick-enquiry" element={<QuickEnquiry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/compare" element={<CompareProducts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
    </CartProvider>
    </CompareProvider>
  );
}

export default App;
