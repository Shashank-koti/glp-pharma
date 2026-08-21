import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiChevronRight, FiChevronLeft, FiGrid, FiList, FiInfo, FiStar, FiTag, FiAlertCircle, FiShoppingCart, FiCheck, FiBox, FiCheckCircle, FiTool, FiFilter, FiShield, FiGlobe } from 'react-icons/fi';
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
    const mainCategorySlug = pageMeta?.category?.slug || (products.length > 0 ? products[0].category?.slug : null) || 'api-impurities-and-reference-standards';
    
    if (subCategory !== 'search' && mainCategorySlug === 'api-impurities-and-reference-standards') {
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

  const productsMatchingOtherFilters = products.filter(product => {
    // Alphabet filter
    let letterMatch = true;
    if (currentLetter !== 'All') {
      if (currentLetter === '#') letterMatch = !/^[a-zA-Z]/.test(product.name);
      else letterMatch = product.name?.toUpperCase().startsWith(currentLetter);
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

    return letterMatch && availabilityMatch;
  });

  // Compute category counts for the filter badges based on current letter & availability
  const mainCategorySlug = pageMeta?.category?.slug || (products.length > 0 ? products[0].category?.slug : null) || 'api-impurities-and-reference-standards';
  const baseForCounts = mainCategorySlug === 'api-impurities-and-reference-standards' ? products : productsMatchingOtherFilters;

  const categoryCounts = {
    All: baseForCounts.length,
    reference: baseForCounts.filter(p => p._categoryType === 'reference' || !p._categoryType).length,
    nitroso: baseForCounts.filter(p => p._categoryType === 'nitroso').length,
    isotope: baseForCounts.filter(p => p._categoryType === 'isotope').length,
  };
  const activeCategoriesCount = (categoryCounts.reference > 0 ? 1 : 0) + (categoryCounts.nitroso > 0 ? 1 : 0) + (categoryCounts.isotope > 0 ? 1 : 0);
  const hasMultipleCategories = activeCategoriesCount > 1;
  const isApiImpurities = mainCategorySlug === 'api-impurities-and-reference-standards';

  const filteredProducts = productsMatchingOtherFilters.filter(product => {
    // Category filter
    if (categoryFilter !== 'All') {
      const type = product._categoryType || 'reference';
      return type === categoryFilter;
    }
    return true;
  });

  const categoryName = pageMeta?.category?.categoryName || (products.length > 0 ? products[0].category?.categoryName : null) || subCategory.replace(/-/g, ' ');

  const displaySubCategory = subCategory === 'search' ? 'Search Results' : (pageMeta?.mainProduct?.heading || subCategory || 'D-Group - API-2');
  const displaySubCategoryStr = displaySubCategory.replace(/-/g, ' ');
  const displayCategoryName = subCategory === 'search' ? `"${searchQueryParam}"` : (categoryName || 'API Impurities and Reference Standards');
  const isRedundant = displaySubCategoryStr.toLowerCase() === displayCategoryName.toLowerCase();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans pb-16 ">

      {/* Alphabet Navigation */}
      <div className="w-max-[1600px] mx-auto px-2 sm:px-4 lg:px-6 pt-8 pb-4 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 md:p-4 border border-white/60">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide min-w-0 px-2 pb-1">
                <button
                  onClick={() => handleLetterClick('All')}
                  className={`flex-shrink-0 flex items-center gap-1 px-4 h-[42px] rounded-full text-[14.5px] font-extrabold transition-all duration-300 backdrop-blur-md ${currentLetter === 'All'
                    ? 'bg-gradient-to-r from-[#1AA3B6] to-[#0B7285] text-white shadow-[0_4px_15px_rgba(26,163,182,0.3)] border-0 scale-105'
                    : 'bg-white hover:bg-[#F8FBFC] text-[#12344D] border border-gray-200 shadow-sm hover:shadow-md hover:text-[#1AA3B6]'
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
                          : 'bg-white hover:bg-[#F8FBFC] text-[#12344D] border border-gray-200 shadow-sm hover:shadow-md hover:text-[#1AA3B6] hover:-translate-y-0.5'
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

      {/* Hero & Filters Grid */}
      <div className="w-full xl:w-[98%] 2xl:w-[100%] max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex flex-col lg:flex-row gap-12 lg:gap-8 items-center mb-8">

        {/* Left Side: Premium Hero Content */}
        <div className="w-full lg:w-[48%] flex flex-col items-start px-2 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[15px] text-[#5B7280] font-medium mb-6 flex-wrap">
            <Link to="/" className="hover:text-[#1AA3B6] transition-colors">Home</Link>
            {/* <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
            <span className="text-slate-500">Our Products</span> */}
            {!isRedundant && (
              <>
                <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
                <Link to={`/product-categories-view/${pageMeta?.category?.slug || 'api-impurities-and-reference-standards'}`} className="hover:text-[#1AA3B6] transition-colors">{displayCategoryName}</Link>
              </>
            )}
            <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
            <span className="text-[#1AA3B6] font-semibold">{displaySubCategoryStr}</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6">

            {/* Product Name */}
            <span
              className="
        block
        text-[#084553]
        text-[38px]
        md:text-[48px]
        lg:text-[56px]
        leading-[1.05]
        tracking-[-0.025em]
        font-extrabold
      "
            >
              {displaySubCategoryStr}
            </span>

            {/* Category */}
            {!isRedundant && (
              <span
                className="
                    block
                    mt-3
                    text-[#12344D]
                    text-[16px]
                    md:text-[20px]
                    lg:text-[24px]
                    leading-[1.2]
                    tracking-[f-0.015em]
                    font-bold capitalize"
              >
                {displayCategoryName}
              </span>
            )}

          </h1>



          {/* Description */}
          <p
            className="
      text-[#5B7280]
      text-[16px]
      md:text-[17px]
      max-w-[560px]
      mb-8
      leading-[1.75]
      font-normal
      tracking-[0.005em]
    "
          >
            {pageMeta?.mainProduct?.content ||
              pageMeta?.category?.description ||
              "Explore our comprehensive range of high-quality pharmaceutical impurities and reference standards designed for precise analytical research."}
          </p>

          {/* Features Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-2 lg:pb-0 ">

            {/* Feature 1 */}
            <div className="flex items-center gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0 border border-[#D9E8EC]">
                <FiShield size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#12344D]">Reliable Quality</h4>
                <p className="text-[12px] text-[#5B7280] font-medium mt-0.5">Stringent quality control processes</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-[#EAF2F4]"></div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0 border border-[#D9E8EC]">
                <FaFlask size={18} />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#12344D]">Analytical Excellence</h4>
                <p className="text-[12px] text-[#5B7280] font-medium mt-0.5">Ensuring accurate results</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Filters */}
        <div className="w-full lg:w-[52%] lg:pr-8">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-5 md:p-5">

            {/* Top Row: Count & Availability */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="shrink-0 bg-[#F8FBFC] text-[#084553] px-5 py-2 rounded-xl flex items-center gap-2.5 font-bold border border-[#EAF2F4] shadow-sm w-full md:w-auto justify-center text-[13px] relative z-10">
                <FaFlask className="text-[16px]" />
                <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found</span>
              </div>

              <div className="flex bg-white rounded-xl p-1 border border-gray-200 w-full sm:w-auto shadow-sm">
                {['All', 'In Stock', 'Custom Synthesis'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setAvailabilityFilter(filterType)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 text-[12px] font-bold rounded-lg transition-all duration-300 ${availabilityFilter === filterType
                      ? 'bg-[#25D366] text-white shadow-md'
                      : 'text-black hover:bg-[#084553]/10'
                      }`}
                  >
                    {filterType === 'All' && <FiBox size={14} />}
                    {filterType === 'In Stock' && <FiCheckCircle size={14} />}
                    {filterType === 'Custom Synthesis' && <FiTool size={14} />}
                    <span className="hidden sm:inline">{filterType}</span>
                  </button>


                ))}
              </div>
            </div>

            {/* Category Filters List */}
            {subCategory !== 'search' && (isApiImpurities || hasMultipleCategories) && (
              <div className="flex flex-col gap-3">
                {[
                  { key: 'All', label: 'Pharmaceutical Reference Standards', icon: <FaFlask size={18} />, count: categoryCounts.All },
                  { key: 'nitroso', label: 'Possible Nitroso Standards', icon: <TbTestPipe size={18} />, count: categoryCounts.nitroso },
                  { key: 'isotope', label: 'Stable Isotopes', icon: <TbAtom size={18} />, count: categoryCounts.isotope },
                ].filter(filter => isApiImpurities || filter.count > 0).map((filter) => {
                  const isActive = categoryFilter === filter.key;
                  return (
                    <button
                      key={filter.key}
                      onClick={() => setCategoryFilter(filter.key)}
                      className={`w-full flex items-center justify-between px-5 py-2 rounded-[16px] transition-all duration-300 border-2 ${isActive
                        ? 'bg-white border-[#084553] shadow-sm'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-transparent text-[#084553] shadow-md' : 'bg-transparent text-[#084553]'}`}>
                          {filter.icon}
                        </div>
                        <span className={`text-[14px] font-extrabold ${isActive ? 'text-[#084553]' : 'text-slate-600'}`}>
                          {filter.label}
                        </span>
                      </div>
                      <span className={`text-[13px] font-black px-4 py-1.5 rounded-full ${isActive ? 'bg-[#084553] text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-leftt w-1/2 truncate pl-1">{product.specifications?.catalogueNumber || product.catalogueNumber || 'N/A'}</span>
                  </div>
                  {/* row 1 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaFlask className="text-[#0B7285] text-[13px]" />
                      <span>CAS Number</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{product.specifications?.casNumber || product.casNumber || 'N/A'}</span>
                  </div>
                  {/* row 2 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Formula</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left uppercase w-1/2 truncate pl-1">{product.specifications?.molecularFormula || product.molecularFormula || 'N/A'}</span>
                  </div>
                  {/* row 3 */}
                  <div className="flex items-center p-2.5 text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaBalanceScale className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Weight</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{product.specifications?.molecularWeight || product.molecularWeight || 'N/A'}</span>
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
    </div >
  );
}
