import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiChevronRight, FiChevronLeft, FiGrid, FiList, FiInfo, FiStar, FiTag, FiAlertCircle, FiShoppingCart, FiCheck, FiBox, FiCheckCircle, FiTool, FiFilter } from 'react-icons/fi';
import { TbAtom, TbTestPipe } from 'react-icons/tb';
import { BsLayersFill } from 'react-icons/bs';
import { FaFlask, FaBalanceScale } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { LuArrowLeftRight } from 'react-icons/lu';

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#'];

const HexagonIcon = () => (
  <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-3 mt-1">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm">
      <polygon
        points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25"
        fill="#F8FBFC"
        stroke="#DDF8FB"
        strokeWidth="2"
      />
    </svg>
    <svg className="w-6 h-6 text-[#0B7285] relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10l-3-2v-4" />
      <path d="M18 10l3-2v-4" />
      <path d="M12 22l-5-3v-6l5-3 5 3v6z" />
      <circle cx="3" cy="3" r="1" fill="currentColor" />
      <circle cx="21" cy="3" r="1" fill="currentColor" />
    </svg>
  </div>
);

export default function ProductsView() {
  const { t } = useTranslation();
  const { subCategory } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { addToCart, cartItems } = useCart();
  const { addToCompare, compareItems, removeFromCompare } = useCompare();

  const currentLetter = searchParams.get('letter') || 'All';
  const searchQueryParam = searchParams.get('q') || '';

  const [pageMeta, setPageMeta] = useState(null);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        setPageMeta(null);
        setCategoryFilter('All');
        let url;
        if (subCategory === 'search') {
          url = `https://glp-pharma-backend.vercel.app/api/products?search=${searchQueryParam}`;
          const res = await axios.get(url);
          if (res.data.success) {
            setProducts(res.data.data);
            if (res.data.pagination) setPageMeta(res.data.pagination);
          } else {
            setProducts([]);
          }
        } else {
          // Fetch main subproducts
          url = `https://glp-pharma-backend.vercel.app/api/products/${subCategory}/subproducts`;
          const res = await axios.get(url);
          let allProducts = [];
          if (res.data.success) {
            // Tag each product with its type
            allProducts = res.data.data.map(p => ({
              ...p,
              _categoryType: (p.category?.slug === 'nitroso-impurities') ? 'nitroso'
                : (p.category?.slug === 'isotope-labelled-compounds') ? 'isotope'
                  : 'reference'
            }));
            if (res.data.pagination) setPageMeta(res.data.pagination);
          }

          // Also fetch related nitroso & isotope products by searching the API name
          const apiName = subCategory.replace(/-/g, ' ');
          try {
            const searchRes = await axios.get(`https://glp-pharma-backend.vercel.app/api/products?search=${encodeURIComponent(apiName)}`).catch(() => ({ data: { data: [] } }));

            const existingIds = new Set(allProducts.map(p => p._id));

            if (searchRes.data?.data) {
              searchRes.data.data.forEach(p => {
                if (!existingIds.has(p._id)) {
                  const catSlug = p.category?.slug;
                  if (catSlug === 'nitroso-impurities') {
                    existingIds.add(p._id);
                    allProducts.push({ ...p, _categoryType: 'nitroso' });
                  } else if (catSlug === 'isotope-labelled-compounds') {
                    existingIds.add(p._id);
                    allProducts.push({ ...p, _categoryType: 'isotope' });
                  }
                }
              });
            }
          } catch (e) {
            console.error('Error fetching related products:', e);
          }

          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subCategory, searchQueryParam]);

  const handleLetterClick = (letter) => {
    if (subCategory !== 'search') {
      const mainCategorySlug = pageMeta?.category?.slug || (products.length > 0 ? products[0].category?.slug : null) || 'api-impurities-and-reference-standards';
      if (letter === 'All') {
        navigate(`/product-categories-view/${mainCategorySlug}`);
      } else {
        navigate(`/product-categories-view/${mainCategorySlug}?letter=${letter}`);
      }
    } else {
      if (letter === 'All') {
        searchParams.delete('letter');
      } else {
        searchParams.set('letter', letter);
      }
      setSearchParams(searchParams);
    }
  };

  // Compute category counts for the filter badges
  const categoryCounts = {
    All: products.length,
    reference: products.filter(p => p._categoryType === 'reference' || !p._categoryType).length,
    nitroso: products.filter(p => p._categoryType === 'nitroso').length,
    isotope: products.filter(p => p._categoryType === 'isotope').length,
  };
  const hasMultipleCategories = categoryCounts.nitroso > 0 || categoryCounts.isotope > 0;

  const filteredProducts = products.filter(product => {
    // Alphabet filter
    let letterMatch = true;
    if (currentLetter !== 'All') {
      if (currentLetter === '#') letterMatch = !/^[a-zA-Z]/.test(product.name);
      else letterMatch = product.name?.toUpperCase().startsWith(currentLetter);
    }

    // Category filter
    let categoryMatch = true;
    if (categoryFilter !== 'All') {
      const type = product._categoryType || 'reference';
      categoryMatch = type === categoryFilter;
    }

    // Availability filter
    let availabilityMatch = true;
    if (availabilityFilter !== 'All') {
      const prodAvail = (product.availability || 'In Stock').toLowerCase();
      if (availabilityFilter === 'In Stock') {
        availabilityMatch = prodAvail === 'in stock';
      } else if (availabilityFilter === 'Custom Synthesis') {
        availabilityMatch = prodAvail !== 'in stock';
      }
    }

    return letterMatch && categoryMatch && availabilityMatch;
  });

  const categoryName = pageMeta?.category?.categoryName || (products.length > 0 ? products[0].category?.categoryName : null) || subCategory.replace(/-/g, ' ');

  const displaySubCategory = subCategory === 'search' ? 'Search Results' : (pageMeta?.mainProduct?.heading || subCategory || 'D-GROUP - API-2').toUpperCase();
  const displaySubCategoryStr = displaySubCategory.replace(/-/g, ' ');
  const displayCategoryName = subCategory === 'search' ? `"${searchQueryParam}"` : (categoryName || 'API IMPURITIES AND REFERENCE STANDARDS').toUpperCase();
  const isRedundant = displaySubCategoryStr === displayCategoryName;

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans pb-16 ">

      {/* Hero Section */}
      <div
        className="w-full min-h-[420px] bg-cover bg-center bg-no-repeat relative bg-white"
        style={{ backgroundImage: "url('/images/productsBG.png')" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-18">
          <div className="max-w-[900px]">
            <h1 className="text-[36px] md:text-[48px] lg:text-[54px] font-[900] leading-[1.15] tracking-tight text-[#12344D] mb-5 uppercase">
              <span className="text-[#084553]">{displaySubCategoryStr}</span>
              {!isRedundant && (
                <>
                  <span className="hidden sm:inline text-[#12344D] mx-2 md:mx-4">-</span>
                  <span className="block sm:inline text-[24px] md:text-[36px] lg:text-[44px] mt-1 sm:mt-0">{displayCategoryName}</span>
                </>
              )}
            </h1>
            <p className="text-body text-[15px] md:text-[16px] max-w-[500px] mb-8 leading-relaxed font-medium">
              {pageMeta?.mainProduct?.content || pageMeta?.category?.description || "High-quality pharmaceutical impurities and reference standards for accurate research and analysis."}
            </p>
          </div>
        </div>
      </div>

      {/* Alphabet Navigation */}
      <div className="w-max-[1600px] mx-auto px-2 sm:px-4 lg:px-6 mb-8 relative z-20 -mt-16">
        <div className="bg-white/40 backdrop-blur-xl rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 md:p-4 border border-white/60">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide min-w-0 px-2 pb-1">
                <button
                  onClick={() => handleLetterClick('All')}
                  className={`flex-shrink-0 flex items-center gap-1 px-4 h-[42px] rounded-full text-[14.5px] font-extrabold transition-all duration-300 backdrop-blur-md ${currentLetter === 'All'
                    ? 'bg-gradient-to-r from-[#1AA3B6] to-[#0B7285] text-white shadow-[0_4px_15px_rgba(26,163,182,0.3)] border-0 scale-105'
                    : 'bg-white/60 hover:bg-white text-[#12344D] border border-white/80 shadow-sm hover:shadow-md hover:text-[#1AA3B6]'
                    }`}
                >
                  <FiGrid size={16} /> All
                </button>

                <div className="flex items-center flex-1 justify-between min-w-[1050px] px-1 gap-1.5">
                  {alphabet.map(letter => {
                    const isActive = currentLetter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded-[14px] text-[17px] font-extrabold transition-all duration-300 backdrop-blur-md ${isActive
                          ? 'bg-gradient-to-br from-[#1AA3B6] to-[#0B7285] text-white shadow-[0_4px_15px_rgba(26,163,182,0.3)] border-0 scale-110'
                          : 'bg-white hover:bg-white text-[#12344D] border border-white/80 shadow-sm hover:shadow-md hover:text-[#1AA3B6] hover:-translate-y-0.5'
                          }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Header & Filters */}
      <div className="w-full xl:w-[98%] 2xl:w-[100%] max-w-[1700px] mx-auto px-3 sm:px-4 lg:px-6 mb-14">
        <div className="bg-white rounded-[16px] shadow-sm border border-primary/15 overflow-hidden">

          {/* Top Section: Breadcrumb */}
          <div className="relative p-3 md:px-5 md:py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-[#EAF2F4] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#084553 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
              <div className="shrink-0 bg-[#084553] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                <BsLayersFill className="text-[16px]" />
              </div>
              <div className="text-[13px] sm:text-[14px] flex flex-wrap items-center uppercase tracking-wide">
                <span className="text-[#084553] font-bold">{displaySubCategory}</span>
                <span className="text-slate-300 mx-3 font-light">{'-'}</span>
                <span className="text-body font-bold">{displayCategoryName}</span>
              </div>
            </div>

            <div className="shrink-0 bg-[#F8FBFC] text-[#084553] px-5 py-2 rounded-xl flex items-center gap-2.5 font-bold border border-[#EAF2F4] shadow-sm w-full md:w-auto justify-center text-[13px] relative z-10">
              <FaFlask className="text-[16px]" />
              <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found</span>
            </div>
          </div>

          {/* Bottom Section: Filters */}
          <div className="p-3 md:px-5 md:py-3 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5 relative z-10 bg-white">

            {/* Left Side: Category Filters */}
            {subCategory !== 'search' && (
              <div className="flex flex-col gap-2.5 flex-1">
                {/* <div className="flex items-center justify-center gap-2">
                  <FiFilter size={14} className="text-[#084553]" />
                  <span className="text-[12.5px] font-bold text-[#084553] uppercase tracking-wider">Filter by Category</span>
                </div> */}
                <div className="flex flex-wrap gap-5 justify-evenly">
                  {[
                    { key: 'All', label: 'Pharmaceutical Reference Standards', icon: <FaFlask size={13} />, count: categoryCounts.All },
                    { key: 'nitroso', label: 'Possible Nitroso Standards', icon: <TbTestPipe size={15} />, count: categoryCounts.nitroso },
                    { key: 'isotope', label: 'Isotope Labelled Standards', icon: <TbAtom size={15} />, count: categoryCounts.isotope },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setCategoryFilter(filter.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all duration-300 border ${categoryFilter === filter.key
                        ? 'bg-[#084553] text-white border-[#084553] shadow-md'
                        : 'border-[#084553]/40 text-[#475569] hover:border-[#084553]/90 hover:bg-white hover:shadow-sm'
                        }`}
                    >
                      {filter.icon}
                      <span className="max-w-[200px] sm:max-w-none truncate">{filter.label}</span>
                      <span className={`ml-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors duration-300 ${categoryFilter === filter.key
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E2E8F0] text-[#084553]'
                        }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Vertical Divider Line */}
            {subCategory !== 'search' && (
              <div className="hidden xl:block w-px self-stretch bg-gradient-to-b from-slate-500 to-slate-500 mx-16 opacity-70"></div>
            )}

            {/* Right Side: Stock Status */}
            <div className="flex flex-col gap-2.5 shrink-0 pt-3 xl:pt-0 border-t border-[#EAF2F4] xl:border-0 mt-2 xl:mt-0">
              {/* <div className="flex items-center gap-2">
                <FiCheckCircle size={14} className="text-[#084553]" />
                <span className="text-[12.5px] font-bold text-[#084553] uppercase tracking-wider">Availability</span>
              </div> */}
              <div className="flex bg-[#F8FBFC] rounded-xl p-1 border border-[#EAF2F4] shadow-sm items-center overflow-x-auto scrollbar-hide">
                {['All', 'In Stock', 'Custom Synthesis'].map((filterType, index, arr) => (
                  <div key={filterType} className="flex items-center">
                    <button
                      onClick={() => setAvailabilityFilter(filterType)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 text-[12px] font-bold rounded-lg transition-all duration-300 ${availabilityFilter === filterType
                        ? 'bg-[#25D366] text-white shadow-md shadow-[#25D366]/20'
                        : 'text-[#64748B] hover:bg-white hover:text-[#059669]'
                        }`}
                    >
                      {filterType === 'All' && <FiBox size={13} />}
                      {filterType === 'In Stock' && <FiCheckCircle size={13} />}
                      {filterType === 'Custom Synthesis' && <FiTool size={13} />}
                      {filterType}
                    </button>
                    {index < arr.length - 1 && (
                      <div className="w-px h-4 bg-[#E2E8F0] mx-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full xl:w-[98%] 2xl:w-[96%] max-w-[1700px] mx-auto px-3 sm:px-4 lg:px-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#EAF2F4] border-t-[#0B7285] rounded-full animate-spin"></div>
            <span className="mt-3 text-body font-medium text-sm">{t('products.loadingProd')}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-border shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="text-slate-300 text-3xl" />
            </div>
            <h3 className="font-bold text-heading mb-1 text-xl">{t('products.noProdFound')}</h3>
            <p className="text-body text-sm">{t('products.noProdDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                inistial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="w-full flex flex-col bg-white rounded-[20px] border border-[#EAF2F4] shadow-sm p-4 hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wide shadow-sm flex items-center gap-1.5 ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-[#1AA3B6] text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-white animate-pulse' : 'bg-orange-500'}`}></span>
                    {product.availability || 'In Stock'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative group/compare">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (compareItems.some(item => item._id === product._id)) {
                            removeFromCompare(product._id);
                          } else {
                            addToCompare(product);
                          }
                        }}
                        className={`p-1.5 rounded-md transition-all duration-300 active:scale-90 hover:scale-110 hover:shadow-md ${compareItems.some(item => item._id === product._id) ? 'bg-[#1AA3B6] text-white' : 'bg-[#E8F4F6] text-[#0B7285] hover:bg-[#1AA3B6] hover:text-white'}`}
                      >
                        <LuArrowLeftRight size={14} />
                      </button>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#12344D] text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/compare:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-sm">
                        Add To Compare
                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#12344D] rotate-45"></div>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full aspect-square max-h-[250px] mx-auto mb-3 flex items-center justify-center group/img">
                  <img
                    src={product.image || "/images/demoprod.gif"}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-[#1AA3B6] text-[15px] leading-snug min-h-[40px] flex items-center justify-center line-clamp-2 hover:text-heading">
                    {product.name?.split(';')[0]}
                  </h3>
                </div>

                {/* Details Table */}
                <div className="border border-[#EAF2F4] rounded-[12px] overflow-hidden mb-4">
                  {/* row 0 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>CAT No.</span>
                    </div>
                    <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.specifications?.catalogueNumber || product.catalogueNumber || 'N/A'}</span>
                  </div>
                  {/* row 1 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaFlask className="text-[#0B7285] text-[13px]" />
                      <span>CAS Number</span>
                    </div>
                    <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.specifications?.casNumber || product.casNumber || 'N/A'}</span>
                  </div>
                  {/* row 2 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Formula</span>
                    </div>
                    <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right uppercase w-1/2 truncate pl-1">{product.specifications?.molecularFormula || product.molecularFormula || 'N/A'}</span>
                  </div>
                  {/* row 3 */}
                  <div className="flex items-center p-2.5 text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaBalanceScale className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Weight</span>
                    </div>
                    <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.specifications?.molecularWeight || product.molecularWeight || 'N/A'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 mt-auto">
                  <Link
                    to={`/products/${product.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-[#0B7285] text-[#0B7285] font-bold py-2 rounded-[10px] hover:bg-[#F8FBFC] transition-colors text-[14px]"
                  >
                    <FiInfo className="text-sm" />
                    More Info
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#0B7285] text-white font-bold py-2 rounded-[10px] hover:bg-[#0B7285] transition-colors text-[14px]"
                  >
                    {cartItems.some(item => item.id === product._id) ? (
                      <>
                        <FiCheck className="text-sm" />
                        Added to RFQ
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="text-sm" />
                        Add to RFQ
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
