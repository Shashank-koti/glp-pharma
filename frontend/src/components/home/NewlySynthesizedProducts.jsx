import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { FiStar, FiInfo, FiCheck, FiShoppingCart, FiTag, FiLoader } from 'react-icons/fi';
import { FaFlask, FaBalanceScale } from 'react-icons/fa';

export default function NewlySynthesizedProducts() {
  const { t } = useTranslation();
  const { addToCart, cartItems } = useCart();
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://glp-pharma-backend.vercel.app/api/products?sort=-viewsCount&limit=8');
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching popular products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase mb-2 text-sm">{t('home.newProducts.latestInnovations')}</span>
          <h2 className="font-bold text-[#0a192f] text-center relative text-3xl md:text-4xl">
            {t('home.newProducts.title')}
          </h2>
        </div>

        <div className="relative px-4 md:px-10">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <FiLoader className="animate-spin text-primary" size={32} />
            </div>
          ) : products.length > 0 ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              navigation={{ prevEl, nextEl }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-10 !pt-4"
            >
              {products.map((product, index) => (
                <SwiperSlide key={index} className="h-auto pb-4">
                  <div className="w-full flex-none flex flex-col bg-white rounded-[20px] border border-[#EAF2F4] shadow-sm p-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 h-full group/card">
                    {/* Top Labels */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wider uppercase shadow-sm flex items-center gap-1.5 ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-[#1AA3B6] text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-white animate-pulse' : 'bg-orange-500'}`}></span>
                        {product.availability || 'In Stock'}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full aspect-square max-h-[250px] mx-auto mb-3 flex items-center justify-center p-2 group/img">
                      <img
                        src={product.image || "/images/demoprod.gif"}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover/card:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-heading text-[15px] leading-snug min-h-[40px] flex items-center justify-center line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* Details Table */}
                    <div className="border border-[#EAF2F4] rounded-[12px] overflow-hidden mb-4 mt-auto">
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
                        <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.casNumber || product.specifications?.casNumber || 'N/A'}</span>
                      </div>
                      {/* row 2 */}
                      <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                          <FiTag className="text-[#0B7285] text-[13px]" />
                          <span>Mol. Formula</span>
                        </div>
                        <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                        <span className="font-bold text-heading text-right uppercase w-1/2 truncate pl-1">{product.molecularFormula || 'N/A'}</span>
                      </div>
                      {/* row 3 */}
                      <div className="flex items-center p-2.5 text-[12px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                          <FaBalanceScale className="text-[#0B7285] text-[13px]" />
                          <span>Mol. Weight</span>
                        </div>
                        <div className="block w-px h-5 bg-border group-hover/row:bg-[#1AA3B6]/30 transition-colors mx-2"></div>
                        <span className="font-bold text-heading text-right w-1/2 truncate pl-1">{product.molecularWeight || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        to={`/products/${product.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-[#0B7285] text-[#0B7285] font-bold py-2 rounded-[10px] hover:bg-[#F8FBFC] transition-colors text-[14px]"
                      >
                        <FiInfo className="text-sm" />
                        More Info
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#1aa3b6] text-white font-bold py-2 rounded-[10px] hover:bg-[#0B7285] transition-colors text-[14px]"
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
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12 text-body">No popular products found.</div>
          )}

          {/* Navigation Arrows */}
          <button
            ref={(node) => setPrevEl(node)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-border hover:bg-background w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-body cursor-pointer -ml-4"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={14} />
          </button>

          <button
            ref={(node) => setNextEl(node)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-border hover:bg-background w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-body cursor-pointer -mr-4"
            aria-label="Next slide"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
