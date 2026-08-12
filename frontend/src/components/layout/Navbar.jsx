import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiChevronDown, FiSearch, FiGlobe, FiLoader, FiPhone, FiMail, FiUser, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { LuFlaskConical, LuShare2, LuAtom, LuHexagon, LuNetwork, LuDna, LuTestTubeDiagonal, LuLeaf, LuChevronRight, LuBriefcase, LuPhone, LuInfo, LuSettings, LuZap, LuMicroscope, LuSprout, LuGitCompare } from 'react-icons/lu';
import navImg from "/navImg.png";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const currentLang = i18n.language || 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { compareItems } = useCompare();

  const isHomePage = location.pathname === '/';
  const isTransparent = false;

  const categories = [
    { _id: '1', categoryName: 'API IMPURITIES & REFERENCE STANDARDS', slug: 'api-impurities-and-reference-standards', icon: LuFlaskConical },
    { _id: '2', categoryName: 'NITROSO IMPURITIES', slug: 'nitroso-impurities', icon: LuHexagon },
    { _id: '3', categoryName: 'PEPTIDES', slug: 'peptides', icon: LuNetwork },
    { _id: '4', categoryName: 'ISOTOPE LABELLED COMPOUNDS', slug: 'isotope-labelled-compounds', icon: LuDna },
    { _id: '5', categoryName: 'CRO MOLECULES', slug: 'cro-molecules', icon: LuMicroscope },
    { _id: '6', categoryName: 'PHYTOCHEMICALS', slug: 'phyto-chemicals', icon: LuSprout },
    { _id: '7', categoryName: 'INTERMEDIATES', slug: 'intermediates', icon: LuShare2 },
    { _id: '8', categoryName: 'CATALYSTS', slug: 'catalysts', icon: LuAtom },
    { _id: '9', categoryName: 'FINE CHEMICALS', slug: 'fine-chemicals', icon: LuTestTubeDiagonal },
    { _id: '10', categoryName: 'AGRO CHEMICALS', slug: 'agro-chemicals', icon: LuLeaf },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const res = await axios.get(`https://glp-pharma-backend.vercel.app/api/products?search=${searchQuery}&limit=5`);
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products-view/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${!isTransparent ? 'bg-white/85 backdrop-blur-xl shadow-md border-b border-border' : 'bg-transparent'}`}>

      {/* Top Bar - Hidden on mobile, visible on desktop */}
      <div className={`hidden lg:block w-full relative z-50 transition-all duration-500 border-b ${!isTransparent ? 'bg-primary/5 border-border/60 text-black' : 'bg-black/20 backdrop-blur-sm border-white/10 text-white'}`}>
        <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[50px] text-[13px] font-semibold tracking-wide">
            {/* Left Side: Contact Info */}
            <div className="flex items-center gap-6">
              <a href="tel:+919866074638" className={`flex items-center gap-2 transition-colors group ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                <FiPhone size={15} className={`transition-colors ${!isTransparent ? 'text-primary' : 'text-accent group-hover:text-white'}`} />
                <span>+91 9866074638</span>
              </a>
              <a href="mailto:info@glppharmastandards.com" className={`flex items-center gap-2 transition-colors group ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                <FiMail size={15} className={`transition-colors ${!isTransparent ? 'text-primary' : 'text-accent group-hover:text-white'}`} />
                <span>info@glppharmastandards.com</span>
              </a>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8 z-[60] shrink" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[400px] lg:max-w-[500px] xl:max-w-[600px]">
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true);
                    if (searchQuery.trim()) setShowSearchDropdown(true);
                  }}
                  onBlur={() => setIsInputFocused(false)}
                  className={`pl-4 pr-12 py-[12px] w-full border-0 rounded-full text-[13px] transition-all duration-300 focus:outline-none shadow-sm ${!isTransparent
                    ? 'bg-white text-body shadow-[0_0_10px_rgba(26,163,182,0.15)]'
                    : 'bg-white/20 backdrop-blur-md text-white shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                    }`}
                />
                {!searchQuery && !isInputFocused && (
                  <div className="absolute inset-y-0 left-4 right-12 flex items-center pointer-events-none overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
                    <div className="w-full flex items-center h-full relative">
                      <span className={`absolute whitespace-nowrap text-[12.5px] font-semibold animate-placeholder-marquee ${!isTransparent ? 'text-primary/70' : 'text-white/90'}`}>
                        Product Name., CAS No., Catalogue Number., IUPAC Name., Mol. Formula.
                      </span>
                    </div>
                  </div>
                )}
                <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-1.5 w-[34px] h-[34px] bg-primary text-white flex items-center justify-center rounded-full cursor-pointer z-10 hover:bg-primary/90 transition-colors shadow-sm">
                  {isSearching ? (
                    <FiLoader className="animate-spin" size={16} />
                  ) : (
                    <FiSearch size={16} />
                  )}
                </button>
              </form>

              {/* Desktop Search Dropdown */}
              <AnimatePresence>
                {showSearchDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-border/60 shadow-xl rounded-xl overflow-hidden z-50 flex flex-col"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-body text-sm">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        <div className="px-4 py-2 bg-background border-b border-[#EAF2F4] font-bold text-slate-400 uppercase tracking-wider text-xs">
                          {t('navbar.productsFound')}
                        </div>
                        {searchResults.map(prod => (
                          <Link
                            key={prod._id}
                            to={`/products-view/search?q=${encodeURIComponent(prod.name)}`}
                            onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                            className="px-4 py-3 hover:bg-primary/5 border-b border-slate-50 last:border-none flex flex-col transition-colors group"
                          >
                            <span className="font-semibold text-heading group-hover:text-primary transition-colors text-sm">{prod.name}</span>
                            <span className="text-body text-xs">{prod.casNumber ? `CAS: ${prod.casNumber}` : (prod.category?.categoryName || 'Product')}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-body text-sm">No products found for "{searchQuery}"</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Auth Links & Language */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className={`flex items-center gap-1.5 transition-colors group ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                    <FiUser size={15} className={`transition-colors ${!isTransparent ? 'text-primary' : 'text-accent group-hover:text-white'}`} />
                    <span>{user.clientName || 'Profile'}</span>
                  </div>
                  <div className={`w-px h-3.5 ${!isTransparent ? 'bg-slate-300' : 'bg-white/40'}`}></div>
                  <button onClick={logout} className={`transition-colors ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={`flex items-center gap-1.5 transition-colors group ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                    <FiUser size={15} className={`transition-colors ${!isTransparent ? 'text-primary' : 'text-accent group-hover:text-white'}`} />
                    <span>Login</span>
                  </Link>
                  <div className={`w-px h-3.5 ${!isTransparent ? 'bg-slate-300' : 'bg-white/40'}`}></div>
                  <Link to="/register" className={`transition-colors ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                    Register
                  </Link>
                </>
              )}

              <div className={`w-px h-3.5 ${!isTransparent ? 'bg-slate-300' : 'bg-white/40'}`}></div>

              {/* Language Select (Top Bar) */}
              <div
                className="relative"
                onMouseEnter={() => setLangOpen(true)}
                onMouseLeave={() => setLangOpen(false)}
              >
                <button className={`relative flex items-center gap-1 transition-colors group ${!isTransparent ? 'hover:text-primary' : 'hover:text-white'}`}>
                  <FiGlobe size={15} className={`transition-colors ${!isTransparent ? 'text-primary' : 'text-accent group-hover:text-white'}`} />
                  <span className="uppercase">{currentLang}</span>
                  <FiChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-border p-1.5 z-50 text-heading"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-[12.5px] rounded-lg transition-all duration-300 flex items-center justify-between group ${currentLang === lang.code
                            ? 'text-primary bg-primary/10 font-semibold'
                            : 'hover:bg-background hover:text-primary'
                            }`}
                        >
                          {lang.name}
                          {currentLang === lang.code && <div className="w-1 h-1 rounded-full bg-primary"></div>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`relative z-40 transition-all duration-500 ${!isTransparent ? 'py-0.75' : 'py-2'}`}>
        <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-6">

            {/* Left Side: Logo */}
            <Link to="/" className="flex items-center shrink-0 cursor-pointer relative z-10">
              <img
                src={navImg}
                alt="GLP Pharma Logo"
                className="h-12 md:h-15 w-auto object-contain transition-transform duration-300"
              />
            </Link>

            {/* Middle: Desktop Menu */}
            <div className="hidden lg:flex items-center">
              {/* Company Dropdown removed */}

              {/* Products Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className={`relative flex items-center gap-1 px-2 py-2 text-sm font-semibold tracking-wider transition-all duration-300 group-hover:text-primary ${!isTransparent ? 'text-heading' : 'text-white/90 hover:text-white'
                  }`}>
                  {t('navbar.products')} <FiChevronDown className={`transition-transform duration-300 ${productsOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[390px] bg-white shadow-2xl rounded-[20px] py-3 px-3 flex flex-col z-50 before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-white before:rotate-45"
                    >
                      {categories.length > 0 ? (
                        <div className="flex flex-col">
                          {categories.map((category, idx) => {
                            const Icon = category.icon;
                            return (
                              <motion.div
                                key={category._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                              >
                                <Link
                                  to={category.slug === 'api-impurities-and-reference-standards'
                                    ? `/product-categories-view/${category.slug}`
                                    : `/products-view/${category.categoryName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-')}`
                                  }
                                  className="group flex items-center justify-between px-3 py-1.5 border-b border-[#EAF2F4] last:border-b-0 hover:bg-background/60 transition-all"
                                  onClick={() => setProductsOpen(false)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-[28px] h-[28px] rounded-md bg-[#E8F4F6] flex items-center justify-center text-[#1AA3B6] transition-colors shrink-0">
                                      <Icon size={15} strokeWidth={2} />
                                    </div>
                                    <span className="text-body font-bold text-[12.5px] leading-tight group-hover:text-black transition-colors">
                                      {category.categoryName}
                                    </span>
                                  </div>
                                  <LuChevronRight className="text-[#1AA3B6] transition-transform shrink-0 ml-2" size={14} strokeWidth={2.5} />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-5 py-3 text-slate-400 text-sm">Loading...</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { name: t('navbar.about') || 'About', path: '/about' },
                { name: t('navbar.services') || 'Services', path: '/services' },
                { name: 'News', path: '/news' },
                { name: 'Quick Enquiry', path: '/quick-enquiry' },
                { name: t('navbar.gallery'), path: '/gallery' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-semibold tracking-wider transition-all duration-300 group ${!isTransparent ? 'text-heading' : 'text-white/90 hover:text-white'
                    }`}
                >
                  <span className="relative inline-block pb-1">
                    {item.name}
                    <span className={`absolute left-0 right-0 bottom-0 h-[2px] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${!isTransparent ? 'bg-primary' : 'bg-accent'
                      }`}></span>
                  </span>
                </Link>
              ))}

              {/* Get In Touch Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setContactOpen(true)}
                onMouseLeave={() => setContactOpen(false)}
              >
                <button className={`relative flex items-center px-2 gap-1 py-2 text-sm font-semibold tracking-wider whitespace-nowrap transition-all duration-300 group-hover:text-primary ${!isTransparent ? 'text-heading' : 'text-white/90 hover:text-white'}`}>
                  Get in touch <FiChevronDown className={`transition-transform duration-300 ${contactOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                <AnimatePresence>
                  {contactOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-[260px] bg-white shadow-2xl rounded-[20px] py-1 px-3 flex flex-col z-50 before:absolute before:-top-2 before:right-10 before:w-4 before:h-4 before:bg-white before:rotate-45"
                    >
                      <Link to="/careers" onClick={() => setContactOpen(false)} className="group flex items-center justify-between px-3 py-1.5 border-b border-[#EAF2F4] last:border-b-0 hover:bg-background/60 transition-all rounded-t-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-[28px] h-[28px] rounded-md bg-[#E8F4F6] flex items-center justify-center text-[#1AA3B6] transition-colors shrink-0">
                            <LuBriefcase size={15} strokeWidth={2} />
                          </div>
                          <span className="text-body font-bold text-[12.5px] leading-tight group-hover:text-black transition-colors">
                            Careers
                          </span>
                        </div>
                        <LuChevronRight className="text-[#1AA3B6] transition-transform shrink-0 ml-2" size={14} strokeWidth={2.5} />
                      </Link>
                      <Link to="/contact" onClick={() => setContactOpen(false)} className="group flex items-center justify-between px-3 py-1.5 border-b border-[#EAF2F4] last:border-b-0 hover:bg-background/60 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-[28px] h-[28px] rounded-md bg-[#E8F4F6] flex items-center justify-center text-[#1AA3B6] transition-colors shrink-0">
                            <LuPhone size={15} strokeWidth={2} />
                          </div>
                          <span className="text-body font-bold text-[12.5px] leading-tight group-hover:text-black transition-colors">
                            Contact
                          </span>
                        </div>
                        <LuChevronRight className="text-[#1AA3B6] transition-transform shrink-0 ml-2" size={14} strokeWidth={2.5} />
                      </Link>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Actions */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 ">

              {/* Compare Button */}
              <Link
                to="/compare"
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 border border-transparent ${!isTransparent
                  ? 'hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-heading'
                  : 'hover:bg-white/20 hover:border-white/30 text-white'
                  }`}
              >
                <LuGitCompare size={20} className={`transition-colors duration-300 ${!isTransparent ? 'text-body group-hover:text-primary' : 'text-white'}`} />
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold rounded-full ${!isTransparent ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'}`}>{compareItems?.length || 0}</span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 border border-transparent ${!isTransparent
                  ? 'hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-heading'
                  : 'hover:bg-white/20 hover:border-white/30 text-white'
                  }`}
              >
                <FiShoppingCart size={20} className={`transition-colors duration-300 ${!isTransparent ? 'text-body group-hover:text-primary' : 'text-white'}`} />
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold rounded-full ${!isTransparent ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'}`}>{cartItems?.length || 0}</span>
              </Link>
            </div>

            {/* Mobile Icons & Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/compare"
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 border border-transparent ${!isTransparent
                  ? 'hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-heading'
                  : 'hover:bg-white/20 hover:border-white/30 text-white'
                  }`}
              >
                <LuGitCompare size={22} className={`transition-colors duration-300 ${!isTransparent ? 'text-body' : 'text-white'}`} />
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold rounded-full ${!isTransparent ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'}`}>{compareItems?.length || 0}</span>
              </Link>
              <Link
                to="/cart"
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 border border-transparent ${!isTransparent
                  ? 'hover:bg-primary/5 hover:border-primary/20 hover:text-primary text-heading'
                  : 'hover:bg-white/20 hover:border-white/30 text-white'
                  }`}
              >
                <FiShoppingCart size={22} className={`transition-colors duration-300 ${!isTransparent ? 'text-body' : 'text-white'}`} />
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold rounded-full ${!isTransparent ? 'bg-primary text-white' : 'bg-white text-primary shadow-sm'}`}>{cartItems?.length || 0}</span>
              </Link>
              <button
                className={`p-2 rounded-lg transition-colors ${!isTransparent || isOpen ? 'text-heading hover:bg-background' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-border overflow-hidden shadow-2xl absolute w-full"
            >
              <div className="container mx-auto px-6 py-6 flex flex-col space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4" ref={mobileSearchRef}>
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
                      className="w-full pl-4 pr-12 py-3 bg-background border border-border rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                    />
                    <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-1.5 w-[36px] h-[36px] bg-primary text-white flex items-center justify-center rounded-lg cursor-pointer hover:bg-primary/90 transition-colors shadow-sm">
                      {isSearching ? (
                        <FiLoader className="animate-spin" size={18} />
                      ) : (
                        <FiSearch size={18} />
                      )}
                    </button>
                  </form>

                  {/* Mobile Search Dropdown */}
                  <AnimatePresence>
                    {showSearchDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-border/60 shadow-lg rounded-xl overflow-hidden z-50 flex flex-col max-h-[300px] overflow-y-auto"
                      >
                        {isSearching ? (
                          <div className="p-4 text-center text-body text-sm">Searching...</div>
                        ) : searchResults.length > 0 ? (
                          <div className="flex flex-col">
                            {searchResults.map(prod => (
                              <Link
                                key={prod._id}
                                to={`/products-view/search?q=${encodeURIComponent(prod.name)}`}
                                onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); setIsOpen(false); }}
                                className="px-4 py-3 hover:bg-primary/5 border-b border-slate-50 last:border-none flex flex-col transition-colors"
                              >
                                <span className="font-semibold text-heading text-sm">{prod.name}</span>
                                <span className="text-body text-xs">{prod.casNumber ? `CAS: ${prod.casNumber}` : 'Product'}</span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-body text-sm">No products found for "{searchQuery}"</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/about" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.about') || 'About'}</Link>
                <Link to="/services" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>{t('navbar.services') || 'Services'}</Link>
                <Link to="/news" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>News</Link>
                <Link to="/quick-enquiry" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>Quick Enquiry</Link>

                <div className="py-2 border-b border-border">
                  <span className="font-semibold text-slate-400 mb-2 block uppercase tracking-wider text-sm">Products</span>
                  <div className="flex flex-col space-y-2 pl-4">
                    {categories.map(category => (
                      <Link
                        key={category._id}
                        to={category.slug === 'api-impurities-and-reference-standards'
                          ? `/product-categories-view/${category.slug}`
                          : `/products-view/${category.categoryName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-')}`
                        }
                        className="text-heading hover:text-primary py-1.5 transition-colors text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {category.categoryName}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link to="/gallery" className="text-heading hover:text-primary py-3 border-b border-border transition-colors" onClick={() => setIsOpen(false)}>Gallery</Link>

                <div className="py-2 border-b border-border">
                  <span className="font-semibold text-slate-400 mb-2 block uppercase tracking-wider text-sm">Get in touch</span>
                  <div className="flex flex-col space-y-2 pl-4">
                    <Link to="/careers" className="text-heading hover:text-primary py-1.5 transition-colors text-sm" onClick={() => setIsOpen(false)}>Careers</Link>
                    <Link to="/contact" className="text-heading hover:text-primary py-1.5 transition-colors text-sm" onClick={() => setIsOpen(false)}>Contact</Link>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-body text-sm">Language</span>
                  <div className="flex gap-2">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentLang === lang.code ? 'bg-primary text-white' : 'bg-background text-body'}`}
                      >
                        {lang.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
