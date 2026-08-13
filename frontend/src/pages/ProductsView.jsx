import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiChevronRight, FiChevronLeft, FiGrid, FiList, FiInfo, FiStar, FiTag, FiAlertCircle, FiShoppingCart, FiCheck, FiBox, FiCheckCircle, FiTool } from 'react-icons/fi';
import { BsLayersFill } from 'react-icons/bs';
import { FaFlask, FaBalanceScale } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { LuArrowLeftRight } from 'react-icons/lu';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
  const { addToCart, cartItems } = useCart();
  const { addToCompare, compareItems, removeFromCompare } = useCompare();

  const currentLetter = searchParams.get('letter') || 'All';
  const searchQueryParam = searchParams.get('q') || '';

  const firstProductCategory = products.length > 0 ? products[0].category : null;
  const categoryName = firstProductCategory ? firstProductCategory.categoryName : '...';
  const categorySlug = firstProductCategory ? firstProductCategory.slug : '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setProducts([]);
        let url;
        if (subCategory === 'search') {
          url = `https://glp-pharma-backend.vercel.app/api/products?search=${searchQueryParam}`;
        } else {
          url = `https://glp-pharma-backend.vercel.app/api/products/subcategory/${subCategory}`;
        }
        const res = await axios.get(url);
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
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
    if (subCategory !== 'search' && categorySlug === 'api-impurities-and-reference-standards') {
      if (letter === 'All') {
        navigate(`/product-categories-view/${categorySlug}`);
      } else {
        navigate(`/product-categories-view/${categorySlug}?letter=${letter}`);
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

  const filteredProducts = products.filter(product => {
    // Alphabet filter
    let letterMatch = true;
    if (currentLetter !== 'All') {
      if (currentLetter === 'Others') letterMatch = !/^[a-zA-Z]/.test(product.name);
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

  const displaySubCategory = subCategory === 'search' ? 'Search Results' : (subCategory || 'D-GROUP - API-2').toUpperCase();
  const displayCategoryName = subCategory === 'search' ? `"${searchQueryParam}"` : (categoryName || 'API IMPURITIES AND REFERENCE STANDARDS').toUpperCase();

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans pb-16 ">

      {/* Alphabet Navigation */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm p-3 md:p-4 border border-[#EAF2F4]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-4 overflow-x-auto scrollbar-hide min-w-0 px-1 pb-1">
                <button
                  onClick={() => handleLetterClick('All')}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 h-[38px] rounded-full text-[14.5px] font-bold transition-colors ${currentLetter === 'All'
                    ? 'bg-[#0B7285] text-white shadow-md'
                    : 'bg-[#F0F6F8] text-body'
                    }`}
                >
                  <FiGrid size={16} /> All
                </button>

                <div className="flex items-center flex-1 justify-between min-w-[1050px] px-1">
                  {alphabet.map(letter => {
                    const isActive = currentLetter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`flex-shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-md text-[18px] font-bold transition-all ${isActive ? 'bg-[#0B7285] text-white shadow-sm' : 'text-[#12344D] hover:bg-[#F0F6F8] hover:text-[#0B7285]'
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

      {/* Breadcrumb Header */}
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-[16px] shadow-sm border border-[#EAF2F4] p-3 md:px-4 md:py-3 flex flex-col md:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
            <div className="shrink-0 bg-[#0B7285] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
              <BsLayersFill className="text-sm" />
            </div>
            <div className="text-[12px] sm:text-[13px] truncate flex items-center">
              <span className="text-[#0B7285] font-bold tracking-wide">{displaySubCategory}</span>
              <span className="text-slate mx-2 font-medium">{'-'}</span>
              <span className="text-body font-bold tracking-wide">{displayCategoryName}</span>
            </div>
          </div>

          <div className="shrink-0 bg-[#F8FBFC] text-[#0B7285] px-4 py-2 rounded-lg flex items-center gap-2 font-bold border border-[#DDF8FB] w-full md:w-auto justify-center text-[13px]">
            <FaFlask className="text-base" />
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found</span>
          </div>

        </div>
      </div>

      {/* Product List Header */}
      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-semibold text-body text-sm">
          Showing {filteredProducts.length} of {products.length} products
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-border shadow-sm items-center">
          {['All', 'In Stock', 'Custom Synthesis'].map((filterType, index, arr) => (
            <div key={filterType} className="flex items-center">
              <button
                onClick={() => setAvailabilityFilter(filterType)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold rounded-md transition-colors ${availabilityFilter === filterType
                  ? 'bg-[#25D366] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-[#059669]'
                  }`}
              >
                {filterType === 'All' && <FiBox size={14} />}
                {filterType === 'In Stock' && <FiCheckCircle size={14} />}
                {filterType === 'Custom Synthesis' && <FiTool size={14} />}
                {filterType}
              </button>
              {index < arr.length - 1 && (
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
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
                  <span className="bg-[#1AA3B6] text-white text-[11px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wide shadow-sm">
                    GL-{product._id.substring(0, 5).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.04)] tracking-wider uppercase ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-orange-50 text-orange-600'}`}>
                      {product.availability || 'In Stock'}
                    </span>
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
                      title={compareItems.some(item => item._id === product._id) ? "Remove from Compare" : "Add to Compare"}
                    >
                      <LuArrowLeftRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="relative w-full aspect-square max-h-[160px] mx-auto mb-3 flex items-center justify-center p-2 group/img">
                  <img
                    src={product.image || "/images/demoprod.gif"}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-heading text-[15px] leading-snug min-h-[40px] flex items-center justify-center line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                {/* Details Table */}
                <div className="border border-[#EAF2F4] rounded-[12px] overflow-hidden mb-4">
                  {/* row 1 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaFlask className="text-[#0B7285] text-[13px]" />
                      <span>CAS Number</span>
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.casNumber || 'N/A'}</span>
                  </div>
                  {/* row 2 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Formula</span>
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right uppercase w-1/2 truncate pl-1">{product.molecularFormula || 'N/A'}</span>
                  </div>
                  {/* row 3 */}
                  <div className="flex items-center p-2.5 text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaBalanceScale className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Weight</span>
                    </div>
                    <div className="hidden sm:block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.molecularWeight || 'N/A'}</span>
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
