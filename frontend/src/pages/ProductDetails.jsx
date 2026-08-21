import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import RecentlyViewed from '../components/products/RecentlyViewed';
import CountryAutocomplete from '../components/common/CountryAutocomplete';

import {
  FiBox, FiTag, FiSend, FiShoppingCart, FiInfo, FiChevronRight,
  FiCheckCircle, FiLock, FiCommand, FiAperture,
  FiGlobe, FiHeadphones, FiClock, FiArrowLeft, FiX, FiClipboard, FiChevronDown, FiDollarSign
} from 'react-icons/fi';
import {
  BsShieldCheck, BsSnow, BsFileEarmarkText, BsClipboardData
} from 'react-icons/bs';
import {
  LuBeaker, LuHexagon, LuArrowLeftRight
} from 'react-icons/lu';
import { TbHexagon, TbCertificate } from 'react-icons/tb';
import { FaFlask, FaBalanceScale } from 'react-icons/fa';

export default function ProductDetails() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const { addToCompare, compareItems, removeFromCompare } = useCompare();
  const { user } = useAuth();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteFormType, setQuoteFormType] = useState('quote');
  const [quoteFormData, setQuoteFormData] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    role: '',
    message: '',
    poNumber: ''
  });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSubmitStatus, setQuoteSubmitStatus] = useState(null);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [isIndianUser, setIsIndianUser] = useState(false);

  useEffect(() => {
    // Fetch user location based on IP to hide pricing for Indian users
    const checkUserLocation = async () => {
      try {
        const res = await axios.get('https://glp-pharma-backend.vercel.app/api/location');
        if (res.data?.success && res.data?.data?.country === 'IN') {
          setIsIndianUser(true);
        }
      } catch (error) {
        console.error('Failed to check user location:', error);
        // Defaulting to false (show pricing) if the API fails
      }
    };

    checkUserLocation();
  }, []);

  const handleQuoteChange = (e) => {
    setQuoteFormData({ ...quoteFormData, [e.target.name]: e.target.value });
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteSubmitStatus(null);

    try {
      const endpoint = quoteFormType === 'checkout'
        ? 'https://glp-pharma-backend.vercel.app/api/pricing'
        : 'https://glp-pharma-backend.vercel.app/api/inquiries';

      const res = await axios.post(endpoint, {
        ...quoteFormData,
        inquiryType: quoteFormType === 'checkout' ? 'Pricing Request' : 'Quote Request',
        items: [{
          productId: product._id,
          name: product.name,
          cas: product.casNumber,
          quantity: 1,
          unit: 'ea' // Generic placeholder for single product quote
        }]
      }, {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
      });

      if (res.data.success) {
        setQuoteSubmitStatus({ type: 'success', message: 'Quote request submitted successfully!' });
        setQuoteFormData({ customerName: '', companyName: '', email: '', phone: '', country: '', role: '', message: '' });
        setTimeout(() => {
          setShowQuoteForm(false);
          setQuoteSubmitStatus(null);
        }, 3000);
      }
    } catch (error) {
      setQuoteSubmitStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit quote request.' });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const [pendingDownload, setPendingDownload] = useState(null);

  const handleDownload = (docType) => {
    if (!user) {
      setPendingDownload(docType);
      setShowAuthAlert(true);
    } else {
      // Placeholder for actual download logic
      alert(`${docType} download started!`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let actualSlug = slug;

        // Detect if the slug is actually a CAS number format
        if (/^\d+-\d+-\d+$/.test(slug)) {
          try {
            const searchRes = await axios.get(`https://glp-pharma-backend.vercel.app/api/products?search=${slug}`);
            if (searchRes.data.success && searchRes.data.data.length > 0) {
              actualSlug = searchRes.data.data[0].slug;
              // Update browser URL silently
              window.history.replaceState(null, '', `/products/${actualSlug}`);
            }
          } catch (e) {
            console.error("CAS lookup failed", e);
          }
        }

        const res = await axios.get(`https://glp-pharma-backend.vercel.app/api/products/${actualSlug}`);
        if (res.data.success) {
          const currentProduct = res.data.data;
          setProduct(currentProduct);
          // Increment view count in the background
          axios.post(`https://glp-pharma-backend.vercel.app/api/products/${actualSlug}/view`).catch(err => console.error("View count error", err));

          if (currentProduct.mainProduct && currentProduct.mainProduct.p_link) {
            axios.get(`https://glp-pharma-backend.vercel.app/api/products/${currentProduct.mainProduct.p_link}/subproducts`)
              .then(relRes => {
                if (relRes.data.success && relRes.data.data) {
                  // Filter out the current product itself
                  let related = relRes.data.data.filter(p => p._id !== currentProduct._id);
                  // Sort by catalogue number
                  related.sort((a, b) => {
                    const catA = a.specifications?.catalogueNumber || a.catalogueNumber || '';
                    const catB = b.specifications?.catalogueNumber || b.catalogueNumber || '';
                    return catA.localeCompare(catB, undefined, { numeric: true, sensitivity: 'base' });
                  });
                  setRelatedProducts(related);
                }
              })
              .catch(err => console.error("Error fetching related products:", err));
          }

          // Add to recently viewed in localStorage
          try {
            let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const productToSave = {
              _id: currentProduct._id,
              name: currentProduct.name,
              slug: currentProduct.slug,
              image: currentProduct.image,
              casNumber: currentProduct.casNumber,
              molecularFormula: currentProduct.molecularFormula,
              molecularWeight: currentProduct.molecularWeight
            };

            // Remove if already exists to move it to the front
            recent = recent.filter(p => p._id !== currentProduct._id);
            recent.unshift(productToSave);

            // Keep only the last 6 items
            if (recent.length > 6) {
              recent.pop();
            }
            localStorage.setItem('recentlyViewed', JSON.stringify(recent));

            // Dispatch a custom event to notify other components (like the RecentlyViewed component)
            window.dispatchEvent(new Event('recentlyViewedUpdated'));
          } catch (e) {
            console.error('Error updating recently viewed:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-slate-400 text-xl">{t('products.loadingDet')}</div>;
  if (!product) return <div className="min-h-screen pt-32 text-center text-slate-400 text-xl">{t('products.prodNotFnd')}</div>;

  const renderImageCard = () => (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-[#EAF2F4] p-5 relative overflow-hidden flex flex-col items-center min-h-[300px]">
      {/* Product Card Specific Background Pattern */}
      <div className="absolute inset-0 opacity-40 z-0 bg-repeat"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 3L37.32 13V33L20 43L2.68 33V13L20 3Z' fill='none' stroke='%23e2e8f0' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '40px' }}>
      </div>

      {/* Decorative green corner - Corrected Shape */}
      <div className="absolute top-0 left-0 w-14 h-14 bg-gradient-to-br from-[#1AA3B6] to-[#1AA3B6] rounded-br-full z-10 opacity-90 shadow-sm"></div>

      {/* Stock / Availability Badge */}
      <div className="absolute top-3 right-3 z-20">
        <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${(product.availability || 'In Stock').toLowerCase() === 'in stock'
          ? 'bg-[#1AA3B6] text-white border-0 animate-pulse'
          : 'bg-orange-50 text-orange-600 border border-orange-100'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-white' : 'bg-orange-500'
            }`}></span>
          {product.availability || 'In Stock'}
        </span>
      </div>

      <div className="relative z-20 flex-grow flex items-center justify-center w-full mb-4">
        <div className="w-full flex items-center justify-center transition-all duration-300">
          <img
            src={product.image || "/images/demoprod.gif"}
            alt={product.name?.split(';')[0] || "Product Image"}
            onClick={() => setShowImageZoom(true)}
            className="max-w-full w-auto h-auto max-h-[350px] md:max-h-[450px] object-contain mix-blend-multiply drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
            title="Click to zoom"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full justify-center relative z-20 mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 py-2 bg-[#1AA3B6] text-white hover:bg-[#0B7285] border-0 shadow-sm rounded-lg text-[14px] font-bold flex-1 justify-center whitespace-nowrap transition-colors cursor-pointer w-full"
          >
            <span>
              {cartItems.some(item => item.id === product._id) ? <FiCheckCircle size={18} /> : <FiShoppingCart size={18} />}
            </span>
            <span>{cartItems.some(item => item.id === product._id) ? 'Added to RFQ' : 'Add to RFQ'}</span>
          </button>
          <button
            onClick={() => {
              const text = `Check out this product: ${product.name}\nCatalogue No: ${product.catalogueNumber || 'GLP-0009'}\nCAS No: ${product.casNumber || 'N/A'}\n${window.location.href}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center gap-2 py-2 bg-[#25D366] text-white hover:bg-[#128C7E] border-0 shadow-sm rounded-lg text-[14px] font-bold flex-1 justify-center whitespace-nowrap transition-colors cursor-pointer w-full">
            <span><FiSend size={18} /></span>
            <span>Share On WhatsApp</span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (compareItems.some(item => item._id === product._id)) {
              removeFromCompare(product._id);
            } else {
              addToCompare(product);
            }
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 border text-[13px] font-extrabold w-full shadow-md hover:shadow-lg ${compareItems.some(item => item._id === product._id) ? 'bg-[#1AA3B6] text-white border-[#1AA3B6]' : 'bg-white text-[#0B7285] border-[#1AA3B6]/30 hover:border-[#1AA3B6]/60 hover:bg-[#F0F7F9]'}`}
          title={compareItems.some(item => item._id === product._id) ? "Remove from Compare" : "Compare"}
        >
          <LuArrowLeftRight size={16} />
          <span>{compareItems.some(item => item._id === product._id) ? 'Remove From Compare' : 'Add to Compare'}</span>
        </button>
      </div>
    </div>
  );

  const renderDescriptionAccordion = () => (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-[#EAF2F4] overflow-hidden">
      <div
        onClick={() => setIsDescOpen(!isDescOpen)}
        className="flex items-center justify-between p-4 cursor-pointer bg-background/50 hover:bg-background transition-colors"
      >
        <div className="flex items-center gap-2">
          <FiInfo className="text-[#0B7285]" size={18} />
          <h3 className="text-[13px] font-bold text-heading uppercase tracking-wider">Product Description</h3>
        </div>
        <div className={`transform transition-transform duration-300 ${isDescOpen ? 'rotate-90' : ''}`}>
          <FiChevronRight size={18} className="text-slate-400" />
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isDescOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4 pt-0">
          <div className="w-full h-px bg-[#F0F6F8] mb-3"></div>
          <p className="text-body text-[13px] leading-relaxed font-medium">
            <span className="font-bold text-heading">{product.name}</span> is a premium-grade reference standard synthesized specifically for advanced analytical research, method validation, and quality control. This highly purified compound undergoes rigorous characterization to ensure consistent reliability in demanding laboratory environments.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FBFC] font-sans text-heading">

      {/* Header Section with detailspageBG */}
      <div
        className="relative overflow-hidden pt-20 md:pt-12 pb-32 border-b border-border/60 shadow-sm bg-white"
        style={{
          backgroundImage: "url('/images/detailspageBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="max-w-2xl w-full">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[15px] text-[#5B7280] font-medium mb-6 flex-wrap">
                <Link to="/" className="hover:text-[#1AA3B6] transition-colors">Home</Link>
                <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
                <Link to={`/product-categories-view/${product.category?.slug || 'api-impurities-and-reference-standards'}`} className="hover:text-[#1AA3B6] transition-colors">{product.category?.categoryName || 'API IMPURITIES'}</Link>
                {product.mainProduct && (
                  <>
                    <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
                    <Link to={`/products-view/${product.mainProduct.p_link || product.mainProduct.slug}`} className="hover:text-[#1AA3B6] transition-colors">{product.mainProduct.heading || product.mainProduct.name}</Link>
                  </>
                )}
                <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
                <span className="text-[#1AA3B6] font-semibold truncate max-w-[200px] sm:max-w-[400px]">{product.name?.split(';')[0]}</span>
              </div>

              <h1 className="font-extrabold text-heading mb-4 tracking-tight drop-shadow-sm text-3xl md:text-4xl">
                {product.name?.split(';')[0]}
              </h1>
              <p className="text-body mb-5 leading-relaxed max-w-xl font-medium text-base">
                High-quality pharmaceutical impurities and reference standards <br className="hidden md:block" /> for accurate research and regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Overlaps Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 -mt-24">

        {/* Mobile Image Card (Shows only on mobile, before grid) */}
        <div className="block lg:hidden mb-6">
          {renderImageCard()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 flex flex-col lg:block">

            {/* Technical Specifications Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-[#EAF2F4] p-4">
              <div className="flex items-center mb-6 border-b border-[#EAF2F4]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1AA3B6] flex items-center justify-center text-white shadow-sm mb-1">
                    <BsFileEarmarkText size={20} />
                  </div>
                  <h2 className="font-bold text-heading text-lg">Technical Specifications</h2>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                {[
                  { icon: <LuBeaker size={16} />, label: 'IUPAC Name', value: (product.iupacName && product.iupacName !== 'NA') ? product.iupacName : product.chemicalName || 'N/A' },
                  { icon: <BsFileEarmarkText size={16} />, label: 'Catalogue No.', value: (product.catalogueNumber && product.catalogueNumber !== 'NA') ? product.catalogueNumber : 'N/A' },
                  { icon: <TbHexagon size={18} />, label: 'CAS Number', value: product.casNumber || '1852-56-7' },
                  { icon: <LuHexagon size={16} />, label: 'Alternate CAS', value: product.similarProducts && product.similarProducts.length > 0 ? product.similarProducts : 'NA', isSimilarProducts: true },
                  { icon: <FiTag size={16} />, label: 'Synonyms', value: product.name },
                  { icon: <FiCommand size={16} />, label: 'Molecular Formula', value: product.molecularFormula || 'C12H19NOO' },
                  { icon: <FiLock size={16} />, label: 'Molecular Weight', value: product.molecularWeight || '260.29' },
                  { icon: <FiCheckCircle size={16} />, label: 'Purity (HPLC / GC / LCMS)', value: product.purity || '>98%', highlight: true },
                  { icon: <FiAperture size={16} />, label: 'Appearance', value: product.appearance || 'White Powder' },
                  { icon: <BsSnow size={16} />, label: 'Storage', value: product.storage || '2-8°C Refrigerator' },
                  { icon: <FiBox size={16} />, label: 'Shipping Conditions', value: product.shippingConditions || 'Ambient' },
                  { icon: <FiGlobe size={16} />, label: 'Country of Origin', value: product.countryOfOrigin || 'India' },

                ].map((spec, i) => (
                  <div key={i} className="p-1.5 flex flex-row items-center justify-start gap-1 sm:gap-3 group hover:bg-[#F8FAFC] transition-all duration-200 rounded-xl border border-transparent hover:border-[#EAF2F4] hover:shadow-sm -mx-2">
                    <div className="flex items-center gap-2 sm:gap-3 w-[45%] sm:w-[40%] shrink-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-6 rounded-xl bg-background group-hover:bg-white flex items-center justify-center text-[#1AA3B6] shadow-sm shrink-0 transition-all">
                        {spec.icon}
                      </div>
                      <span className="text-[11px] sm:text-[15px] font-bold text-slate-800 tracking-wide">{spec.label}</span>
                    </div>
                    <div className="block w-px h-5 bg-border group-hover:bg-[#1AA3B6]/30 transition-colors mx-1 sm:-ml-16 shrink-0"></div>
                    <div className={`text-[12px] sm:text-[15px] font-semibold flex-1 min-w-0 text-left sm:pl-2 break-all sm:break-words ${spec.highlight ? 'text-[#1AA3B6] text-[13px] sm:text-[15px] bg-[#DDF8FB] px-2 sm:px-3 py-1 rounded-lg self-center border border-[#DDF8FB] shadow-sm inline-block' : 'text-heading'}`}>
                      {spec.isSimilarProducts && spec.value !== 'NA' ? (
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(spec.value) ? spec.value : [spec.value]).map((simProd, idx, arr) => (
                            <Link
                              key={idx}
                              to={`/products/${encodeURIComponent(simProd.split('(')[0].trim())}`}
                              className="text-[#1AA3B6] hover:underline"
                            >
                              {simProd}{idx < arr.length - 1 ? ',' : ''}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        spec.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Product Description (Shows only on mobile, after tech specs) */}
            <div className="block lg:hidden">
              {renderDescriptionAccordion()}
            </div>

            {/* Important Notes */}
            <div className="flex flex-col gap-4">
              {/* Usage Note */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13px] font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiInfo size={16} /> Usage Note
                </h3>
                <p className="text-[14px] text-body font-medium leading-relaxed">
                  This Product is For Laboratory, Research and Analytical Use Only. Not intended for diagnostic, therapeutic or consumption purposes in humans or animals.
                </p>
              </div>

              {/* Regulatory Description */}
              <div className="bg-[#DDF8FB] border border-[#DDF8FB] rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13px] font-bold text-[#1AA3B6] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BsShieldCheck size={16} /> Regulatory Description
                </h3>
                <p className="text-[14px] text-body font-medium leading-relaxed">
                  <span className="font-extrabold text-heading">{product.name?.split(';')[0]}</span> Impurity is supplied with detailed characterization data compliant with regulatory guidelines.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13px] font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FiInfo size={16} /> Disclaimer
                </h3>
                <p className="text-[14px] text-rose-900/80 font-medium leading-relaxed">
                  The PASL product information reflects existing knowledge at the time of webpage creation. The purchaser or user is responsible for verifying item accuracy at the time of order, as specifications may change without notice.
                </p>
              </div>
            </div>

            {/* Features Block */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-[#EAF2F4] p-2 flex flex-col md:flex-row justify-between items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {[
                { icon: <FiGlobe size={18} />, title: 'Global Compliance', desc: 'Meeting international regulatory standards' },
                { icon: <BsShieldCheck size={18} />, title: 'Reliable Quality', desc: 'Strict quality control at every step' },
                { icon: <FiHeadphones size={18} />, title: 'Expert Support', desc: 'Technical assistance from our experts' },
                { icon: <FiClock size={18} />, title: 'On-time Delivery', desc: 'Committed to reliable and secure delivery' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-4 flex-1 w-full hover:bg-background transition-colors rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-[#084553] flex-shrink-0 flex items-center justify-center text-white border border-[#DDF8FB]">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-heading text-[12px] mb-1">{feat.title}</h3>
                    <p className="text-[11px] text-body leading-tight pr-1">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Image Card (Desktop only, hidden on mobile) */}
            <div className="hidden lg:block">
              {renderImageCard()}
            </div>

            {/* Description Accordion (Desktop only, hidden on mobile) */}
            <div className="hidden lg:block">
              {renderDescriptionAccordion()}
            </div>

            {/* Pricing Section (Premium Redesign) - Hidden for Indian IPs */}
            {!isIndianUser && (
              <div className="bg-gradient-to-b from-white to-[#F8FBFC] rounded-2xl shadow-lg border border-[#EAF2F4] p-6 relative overflow-hidden mt-8 ring-1 ring-black/5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#1AA3B6] opacity-[0.05] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1AA3B6] to-[#0B7285] flex items-center justify-center text-white shadow-md">
                    <FiDollarSign size={20} />
                  </div>
                  <h2 className="text-[19px] font-extrabold text-heading tracking-tight">Quantities & Pricing</h2>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { unit: '100 mg', price: ((product?.casNumber?.charCodeAt(0) || 45) * 1.5).toFixed(2), highlight: false, desc: 'For initial testing' },
                    { unit: '1 g', price: ((product?.casNumber?.charCodeAt(0) || 45) * 8.5).toFixed(2), highlight: false, desc: 'Standard lab pack' },
                    { unit: '1 kg', price: ((product?.casNumber?.charCodeAt(0) || 45) * 45.0).toFixed(2), highlight: true, badge: 'Best Value', desc: 'Bulk production scale' }
                  ].map((tier, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setQuoteFormType('checkout');
                        setQuoteFormData({ ...quoteFormData, message: `I would like to request a quote for ${tier.unit} of ${product.name?.split(';')[0]} (CAS: ${product.casNumber}).` });
                        setShowQuoteForm(true);
                      }}
                      className={`group rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${tier.highlight ? 'border border-[#1AA3B6]/30 bg-[#1AA3B6]/[0.02] shadow-[0_2px_10px_rgba(26,163,182,0.05)] hover:bg-[#1AA3B6]/[0.05]' : 'border border-[#EAF2F4] bg-white hover:border-[#1AA3B6]/50 hover:shadow-sm'}`}
                    >
                      {tier.highlight && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1AA3B6] to-[#0B7285]"></div>
                      )}

                      <div className={`flex flex-col ${tier.highlight ? 'pl-4' : 'pl-2'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-heading font-extrabold text-[17px]">{tier.unit}</span>
                          {tier.badge && (
                            <span className="bg-[#1AA3B6] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[#5B7280] text-[12px] font-medium mt-0.5">{tier.desc}</span>
                      </div>

                      <div className="flex flex-col items-end pr-2">
                        <span className={`text-[21px] font-black tracking-tight ${tier.highlight ? 'text-[#1AA3B6]' : 'text-heading'}`}>
                          ${tier.price}
                        </span>
                        <span className="text-[10px] text-[#1AA3B6] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex items-center gap-1">
                          proceed to check out <FiChevronRight size={10} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Documents */}
            <div className="flex flex-row gap-3">
              <button
                onClick={() => handleDownload('MSDS')}
                className="flex-1 bg-[#E8F4F6] border border-[#1AA3B6] shadow-md hover:shadow-lg rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#1AA3B6] hover:text-white transition-all group"
              >
                <BsFileEarmarkText size={18} className="text-[#1AA3B6] group-hover:text-white" />
                <span className="text-[#0B7285] font-bold text-[13px] group-hover:text-white">Download MSDS</span>
              </button>
              <button
                onClick={() => handleDownload((product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'COA' : 'Draft COA')}
                className="flex-1 bg-[#E8F4F6] border border-[#1AA3B6] shadow-md hover:shadow-lg rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#1AA3B6] hover:text-white transition-all group"
              >
                <TbCertificate size={18} className="text-[#1AA3B6] group-hover:text-white" />
                <span className="text-[#0B7285] font-bold text-[13px] group-hover:text-white">
                  {(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'Download COA' : 'Draft COA'}
                </span>
              </button>
            </div>

            {/* Action Card */}
            <div className="rounded-2xl p-6 relative overflow-hidden text-white shadow-lg">
              {/* Decorative clipboard icon on right */}
              <div className="absolute -right-6 -bottom-6 opacity-[0.15] text-white pointer-events-none">
                <BsClipboardData size={140} strokeWidth={0.2} />
              </div>

              <div className="relative z-10">
                <h3 className="font-bold mb-2 tracking-tight text-xl">Interested in this product?</h3>
                <p className="text-primary text-[14px] mb-6 leading-relaxed opacity-95">
                  Get custom pricing, availability, and technical documents.
                </p>

                <button
                  onClick={() => {
                    setQuoteFormType('quote');
                    setShowQuoteForm(true);
                  }}
                  className="py-3 w-full bg-[#1AA3B6]/20 text-[#0B7285] border border-[#1AA3B6]/20 shadow-md hover:shadow-lg rounded-xl font-bold text-[15px] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <FiSend size={16} /> Request a Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mt-16 mb-12">
          <div className="flex flex-col mb-8">
            <h2 className="font-extrabold text-heading flex items-center gap-2 text-2xl">
              <FiTag className="text-[#1AA3B6]" /> Related Products
            </h2>
            <p className="text-body mt-1 font-medium text-sm">Explore related standards from the same parent family.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map(rel => (
              <Link
                to={`/products/${rel.slug}`}
                key={rel._id}
                className="group bg-white rounded-2xl border border-[#EAF2F4] shadow-sm p-4 flex flex-col w-full mx-auto max-w-[380px]"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wider uppercase shadow-sm flex items-center gap-1.5 ${(rel.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-[#1AA3B6] text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(rel.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-white animate-pulse' : 'bg-orange-500'}`}></span>
                    {rel.availability || 'In Stock'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative group/compare">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (compareItems.some(item => item._id === rel._id)) {
                            removeFromCompare(rel._id);
                          } else {
                            addToCompare(rel);
                          }
                        }}
                        className={`p-1.5 rounded-md transition-all duration-300 active:scale-90 hover:scale-110 hover:shadow-md ${compareItems.some(item => item._id === rel._id) ? 'bg-[#1AA3B6] text-white' : 'bg-[#E8F4F6] text-[#0B7285] hover:bg-[#1AA3B6] hover:text-white'}`}
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

                {/* Image Area */}
                <div className="relative w-full aspect-square max-h-[200px] mx-auto mb-3 flex items-center justify-center group/img">
                  <img
                    src={rel.image || "/images/demoprod.gif"}
                    alt={rel.name?.split(';')[0]}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="text-center mb-4 mt-2">
                  <h3 className="font-extrabold text-heading text-[15px] leading-snug min-h-[40px] flex items-center justify-center line-clamp-2  transition-colors group-hover:text-[#1AA3B6]">
                    {rel.name?.split(';')[0]}
                  </h3>
                </div>
                <div className="border border-[#EAF2F4] rounded-[12px] overflow-hidden mb-4 mt-auto">
                  {/* row 0 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>CAT No.</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{rel.specifications?.catalogueNumber || rel.catalogueNumber || 'N/A'}</span>
                  </div>
                  {/* row 1 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaFlask className="text-[#0B7285] text-[13px]" />
                      <span>CAS Number</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{rel.specifications?.casNumber || rel.casNumber || 'N/A'}</span>
                  </div>
                  {/* row 2 */}
                  <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FiTag className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Formula</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left uppercase w-1/2 truncate pl-1">{rel.specifications?.molecularFormula || rel.molecularFormula || 'N/A'}</span>
                  </div>
                  {/* row 3 */}
                  <div className="flex items-center p-2.5 text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                      <FaBalanceScale className="text-[#0B7285] text-[13px]" />
                      <span>Mol. Weight</span>
                    </div>
                    <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                    <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{rel.specifications?.molecularWeight || rel.molecularWeight || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-auto pt-2 flex gap-3">
                  <div className="w-full flex items-center justify-center gap-2 border border-[#1AA3B6] text-[#1AA3B6] font-bold py-2 rounded-xl hover:bg-[#DDF8FB] transition-colors text-[14px]">
                    <FiInfo size={14} /> More info
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(rel);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#0B7285] text-white font-bold py-2 rounded-[10px] hover:bg-[#0B7285] transition-colors text-[14px]"
                  >
                    {cartItems.some(item => item.id === rel._id) ? (
                      <>
                        <FiCheckCircle className="text-sm" /> Added to RFQ
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="text-sm" /> Add to RFQ
                      </>
                    )}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Terms Section */}
      <div className="container mx-auto px-4 w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mt-4 ">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
          <h2 className="font-extrabold text-heading flex items-center gap-2 text-xl md:text-2xl">
            <FiCommand className="text-[#1AA3B6]" /> Product Applications & Regulatory Search Terms
          </h2>
          <p className="mb-6 mt-3 text-body font-medium text-sm">
            Useful product, supplier and regulatory search terms for this reference standard.
          </p>

          <div className="flex flex-wrap items-center gap-y-2.5">
            {(() => {
              const nameParts = (product.name || '').split(';');
              const nameBase = nameParts[0]?.trim();
              const nameSynonyms = nameParts.slice(1).map(s => s.trim()).filter(Boolean);

              const rawCas = product.specifications?.casNumber || product.casNumber;
              const casBase = rawCas && !['N/A', 'NA', '-', 'TBD', '', 'NOT APPLICABLE'].includes(rawCas.toUpperCase().trim()) ? rawCas : '';

              let rawSynonyms = product.synonyms || product.specifications?.synonyms || '';
              let synonymsList = [];
              if (Array.isArray(rawSynonyms)) {
                synonymsList = rawSynonyms.map(s => String(s).trim());
              } else if (typeof rawSynonyms === 'string') {
                synonymsList = rawSynonyms.split(',').map(s => s.trim());
              }

              if (nameSynonyms.length > 0) {
                synonymsList = [...synonymsList, ...nameSynonyms];
              }

              synonymsList = [...new Set(synonymsList.filter(s => s && !['N/A', 'NA', '-', 'TBD'].includes(s.toUpperCase())))];

              const terms = [];

              if (casBase) {
                [
                  `Buy high quality CAS ${casBase}`,
                  `Purchase CAS ${casBase}`,
                  `CAS ${casBase} Suppliers`,
                  `CAS ${casBase} Manufacturers`,
                  `CAS ${casBase} Price`,
                  `Order CAS ${casBase}`,
                  `Enquire CAS ${casBase}`,
                  `CAS ${casBase} Cost`,
                  `CAS ${casBase} Supplier`,
                  `CAS ${casBase} Distributor`,
                  `CAS ${casBase} for Method Validation`,
                  `CAS ${casBase} for ANDA Filing`,
                  `CAS ${casBase} for Forced Degradation Studies`,
                  `CAS ${casBase} Identification Standards`,
                  `CAS ${casBase} for DMF Filing`,
                  `CAS ${casBase} Reference Standard`
                ].forEach(t => terms.push(t));
              }

              if (nameBase) {
                [
                  `Buy high quality ${nameBase}`,
                  `Purchase ${nameBase}`,
                  `${nameBase} Suppliers`,
                  `${nameBase} Manufacturers`,
                  `${nameBase} Price`,
                  `Order ${nameBase}`,
                  `Enquire ${nameBase}`,
                  `${nameBase} Cost`,
                  `${nameBase} Supplier`,
                  `${nameBase} Distributor`,
                  `${nameBase} for Method Validation`,
                  `${nameBase} for ANDA Filing`,
                  `${nameBase} for Forced Degradation Studies`,
                  `${nameBase} Identification Standards`,
                  `${nameBase} for DMF Filing`,
                  `${nameBase} Reference Standard`
                ].forEach(t => terms.push(t));
              }

              if (synonymsList.length > 0) {
                synonymsList.forEach(syn => {
                  [
                    `Buy high quality ${syn}`,
                    `Purchase ${syn}`,
                    `${syn} Suppliers`,
                    `${syn} Manufacturers`,
                    `${syn} Price`,
                    `Order ${syn}`,
                    `Enquire ${syn}`,
                    `${syn} Cost`,
                    `${syn} Supplier`,
                    `${syn} Distributor`,
                    `${syn} for Method Validation`,
                    `${syn} for ANDA Filing`,
                    `${syn} for Forced Degradation Studies`,
                    `${syn} Identification Standards`,
                    `${syn} Reference Standard`
                  ].forEach(t => terms.push(t));
                });
              }

              return terms.map((term, i) => (
                <div key={i} className="flex items-center">
                  <h1 className="text-[12px] font-bold text-[#5B7280] hover:text-[#1AA3B6] transition-colors cursor-default leading-tight">
                    {term}
                  </h1>
                  {i < terms.length - 1 && (
                    <span className="text-[#D9E8EC] mx-2.5 select-none font-light">|</span>
                  )}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      <RecentlyViewed currentProductId={product?._id} />

      {/* Premium Auth Alert Modal */}
      <AnimatePresence>
        {showAuthAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthAlert(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAF2F4]"
            >
              {/* Top Accent */}
              <div className="h-2 w-full bg-gradient-to-r from-primary to-[#0B7285]"></div>

              <div className="p-8">
                <div className="w-16 h-16 bg-[#F0F7F9] text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/10">
                  <FiLock size={28} />
                </div>

                <h3 className="font-extrabold text-heading text-center mb-3 tracking-tight text-2xl">Authentication Required</h3>
                <p className="text-body text-center mb-8 font-medium">
                  Please log in or create an account to securely download the <span className="font-bold text-heading">{pendingDownload}</span>.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 bg-primary hover:bg-[#0B7285] text-white rounded-xl font-bold shadow-md transition-all duration-300"
                  >
                    Log In to Download
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-3.5 bg-[#F0F7F9] hover:bg-[#EAF2F4] text-primary rounded-xl font-bold transition-all duration-300 border border-[#EAF2F4]"
                  >
                    Create an Account
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAuthAlert(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-heading transition-colors"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quote Form Modal */}
      <AnimatePresence>
        {showQuoteForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuoteForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border border-[#EAF2F4]"
            >
              {/* Top Accent */}
              <div className="h-2 w-full bg-gradient-to-r from-primary to-[#0B7285] sticky top-0 z-10"></div>

              <div className="flex items-center justify-between p-[24px_30px] border-b border-[#D9E8EC] sticky top-2 bg-white z-10">
                <div className="flex items-center gap-3">
                  <FiClipboard className="text-[26px] text-[#1AA3B6]" strokeWidth={1.5} />
                  <div>
                    <h2 className="text-[#12344D] text-[18px] font-[750]">
                      {quoteFormType === 'checkout' ? 'Checkout Request' : 'Get a Quote / Product Inquiry'}
                    </h2>
                    <p className="text-[#5B7280] text-[13px] mt-0.5">Fill in the details below for <span className="font-bold">{product.name}</span>.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-slate-400 hover:text-[#12344D] transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full shrink-0"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form className="p-[25px_30px]" onSubmit={handleQuoteSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[18px]">
                  <div>
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Full Name <span className="text-[#e04545]">*</span>
                    </label>
                    <input name="customerName" value={quoteFormData.customerName} onChange={handleQuoteChange} type="text" placeholder="Enter your full name" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
                  </div>
                  <div>
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Company / Organization <span className="text-[#e04545]">*</span>
                    </label>
                    <input name="companyName" value={quoteFormData.companyName} onChange={handleQuoteChange} type="text" placeholder="Enter company name" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
                  </div>
                  <div>
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Email Address <span className="text-[#e04545]">*</span>
                    </label>
                    <input name="email" value={quoteFormData.email} onChange={handleQuoteChange} type="email" placeholder="Enter your email" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
                    <p className="text-[11px] text-[#5B7280] mt-1.5 ml-1">* Must be a valid email address</p>
                  </div>
                  <div>
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Phone Number <span className="text-[#e04545]">*</span>
                    </label>
                    <input name="phone" value={quoteFormData.phone} onChange={handleQuoteChange} type="tel" placeholder="Enter your phone number" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required />
                    <p className="text-[11px] text-[#5B7280] mt-1.5 ml-1">* Please include country code</p>
                  </div>
                  <div className="relative z-50">
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Country <span className="text-[#e04545]">*</span>
                    </label>
                    <CountryAutocomplete
                      name="country"
                      value={quoteFormData.country}
                      onChange={handleQuoteChange}
                      className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10"
                      required={true}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                      Your Role
                    </label>
                    <div className="relative">
                      <select name="role" value={quoteFormData.role} onChange={handleQuoteChange} className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 appearance-none cursor-pointer">
                        <option value="" disabled className="text-[#5B7280]">Select your role</option>
                        <option value="researcher">Researcher</option>
                        <option value="purchasing">Purchasing Manager</option>
                      </select>
                      <FiChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5B7280] pointer-events-none" />
                    </div>
                  </div>
                  {quoteFormType === 'checkout' && (
                    <div className="sm:col-span-2">
                      <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                        PO Number / Ref. Number <span className="text-[#e04545]">*</span>
                      </label>
                      <input name="poNumber" value={quoteFormData.poNumber || ''} onChange={handleQuoteChange} type="text" placeholder="Enter PO Number or Reference Number" className="w-full h-[44px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] px-[14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280]" required={quoteFormType === 'checkout'} />
                    </div>
                  )}
                </div>

                <div className="mt-[18px]">
                  <label className="block text-[#12344D] text-[12.5px] font-[700] mb-1.5">
                    Your Requirement / Message <span className="text-[#e04545]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={quoteFormData.message}
                    onChange={handleQuoteChange}
                    placeholder="Please provide details about your requirement, quantity, intended use, etc."
                    className="w-full min-h-[90px] bg-white border border-[#D9E8EC] rounded-[6px] text-[13.5px] p-[12px_14px] outline-none transition-colors focus:border-[#1AA3B6]/70 focus:ring-[3px] focus:ring-[#1AA3B6]/10 placeholder:text-[#5B7280] resize-y"
                    required
                  />
                </div>

                <div className="mt-[20px] bg-[#E8F4F6] border border-[#D9E8EC] rounded-[8px] p-[16px] relative overflow-hidden">
                  <svg className="absolute -right-4 -bottom-4 w-[100px] h-[100px] text-[#1AA3B6]/[0.05] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 3h6v6l4 10H5l4-10V3z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 14h6" strokeLinecap="round" />
                  </svg>

                  <div className="relative z-10">
                    <span className="text-[#12344D] text-[12.5px] font-[750] flex items-center gap-1.5 mb-2.5">
                      <span className="text-[#1AA3B6] text-[14px]">›</span> Product in Inquiry
                    </span>
                    <ul className="text-[#5B7280] text-[12px] font-medium leading-[1.6] space-y-1 list-disc pl-[20px]">
                      <li>
                        {product.name?.split(';')[0]} (CAS: {product.casNumber || 'N/A'})
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-[18px] mb-[20px] text-[#5B7280] text-[11.5px] font-medium">
                  <FiLock className="text-[#9ABAC0] shrink-0" />
                  Your information is secure and will only be used to {quoteFormType === 'checkout' ? 'process your checkout request' : 'respond to your inquiry'}.
                </div>

                <button disabled={isSubmittingQuote} type="submit" className="flex items-center justify-center w-full h-[46px] bg-[#1AA3B6] text-white text-[15px] font-bold rounded-[6px] border-0 cursor-pointer transition-all hover:bg-[#0B7285] shadow-[0_6px_15px_rgba(26,163,182,0.25)] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                  <FiSend className="mr-[8px]" />
                  {quoteFormType === 'checkout'
                    ? (isSubmittingQuote ? 'Processing Checkout...' : 'Proceed to Checkout')
                    : (isSubmittingQuote ? 'Sending Inquiry...' : 'Send Inquiry')}
                </button>

                {quoteSubmitStatus && (
                  <div className={`mt-5 p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${quoteSubmitStatus.type === 'success' ? 'bg-[#084553] text-white border border-[#DDF8FB]' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {quoteSubmitStatus.message}
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showImageZoom && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageZoom(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm cursor-zoom-out"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAF2F4] flex flex-col"
              style={{ maxHeight: '90vh' }}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowImageZoom(false)}
                  className="bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md transition-colors backdrop-blur-md"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-auto bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 3L37.32 13V33L20 43L2.68 33V13L20 3Z\' fill=\'none\' stroke=\'%23e2e8f0\' stroke-width=\'0.5\'/%3E%3C/svg%3E')]">
                <img
                  src={product.image || "/images/demoprod.gif"}
                  alt={product.name?.split(';')[0]}
                  className="w-full h-auto max-h-[75vh] object-contain drop-shadow-2xl mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
