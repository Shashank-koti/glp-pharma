import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

export default function RecentlyViewed({ currentProductId }) {
  const [recentProducts, setRecentProducts] = useState([]);
  const { addToCart, cartItems } = useCart();

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        let parsed = JSON.parse(stored);
        // Filter out the current product if we are on a product details page
        if (currentProductId) {
          parsed = parsed.filter(p => p._id !== currentProductId);
        }
        setRecentProducts(parsed);
      }
    } catch (e) {
      console.error('Failed to load recently viewed products', e);
    }
  };

  useEffect(() => {
    loadRecentlyViewed();

    // Listen for changes from other tabs or from the current tab
    window.addEventListener('storage', loadRecentlyViewed);
    window.addEventListener('recentlyViewedUpdated', loadRecentlyViewed);

    return () => {
      window.removeEventListener('storage', loadRecentlyViewed);
      window.removeEventListener('recentlyViewedUpdated', loadRecentlyViewed);
    };
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <div className="container mx-auto px-4 w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mt-16 mb-12">
      <div className="flex flex-col mb-8">
        <h2 className="font-extrabold text-heading flex items-center gap-2 text-2xl">
          <FiEye className="text-[#1AA3B6]" /> Recently Viewed
        </h2>
        <p className="text-body mt-1 font-medium text-sm">Pick up right where you left off.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentProducts.slice(0, 5).map(product => (
          <Link
            to={`/products/${product.slug}`}
            key={product._id}
            className="group bg-white rounded-2xl border border-[#D9E8EC] shadow-[0_10px_30px_rgba(26,163,182,0.03)] hover:shadow-[0_15px_40px_rgba(26,163,182,0.08)] hover:border-[#1AA3B6]/20 transition-all duration-300 p-4 flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wider uppercase shadow-sm flex items-center gap-1.5 ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-[#1AA3B6] text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${(product.availability || 'In Stock').toLowerCase() === 'in stock' ? 'bg-white animate-pulse' : 'bg-orange-500'}`}></span>
                {product.availability || 'In Stock'}
              </span>
            </div>

            {/* Image Area */}
            <div className="relative w-full aspect-square max-h-[220px] mx-auto mb-4 flex items-center justify-center p-2">
              <img
                src={product.image || "/images/demoprod.gif"}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="text-center mb-3 mt-auto">
              <h3 className="font-extrabold text-heading text-[14px] leading-snug line-clamp-2 transition-colors group-hover:text-[#1AA3B6]">
                {product.name}
              </h3>
            </div>

            <div className="border border-[#EAF2F4] rounded-[12px] overflow-hidden mb-4 mt-auto">
              {/* row 0 */}
              <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[11px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                  <span className="truncate">CAT No.</span>
                </div>
                <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{product.specifications?.catalogueNumber || product.catalogueNumber || 'N/A'}</span>
              </div>
              {/* row 1 */}
              <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[11px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                  <span className="truncate">CAS</span>
                </div>
                <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{product.casNumber || product.specifications?.casNumber || 'N/A'}</span>
              </div>
              {/* row 2 */}
              <div className="flex items-center p-2.5 border-b border-[#EAF2F4] text-[11px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                  <span className="truncate">Mol. Formula</span>
                </div>
                <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                <span className="font-bold text-heading text-left uppercase w-1/2 truncate pl-1">{product.molecularFormula || 'N/A'}</span>
              </div>
              {/* row 3 */}
              <div className="flex items-center p-2.5 text-[11px] bg-white group/row hover:bg-[#F8FAFC] transition-colors relative">
                <div className="flex items-center gap-2 text-slate-700 font-semibold uppercase tracking-wide w-1/2">
                  <span className="truncate">Mol. Weight</span>
                </div>
                <div className="block w-[1.5px] h-5 bg-slate-300 group-hover/row:bg-[#1AA3B6]/50 transition-colors mx-2"></div>
                <span className="font-bold text-heading text-left w-1/2 truncate pl-1">{product.molecularWeight || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#E8F4F6] text-[#1AA3B6] border border-[#D9E8EC] font-bold py-2 rounded-xl hover:bg-[#1AA3B6] hover:text-white transition-colors text-[12.5px]"
              >
                {cartItems.some(item => item.id === product._id) ? (
                  <>
                    <FiCheckCircle className="text-[14px]" /> Added to RFQ
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="text-[14px]" /> Add to RFQ
                  </>
                )}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
