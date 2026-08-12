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
              <span className="bg-[#1AA3B6] text-white text-[10px] font-bold px-2.5 py-1 rounded-full border-0 tracking-wider uppercase">
                GL-{product._id.substring(0, 5)}
              </span>
            </div>

            {/* Image Area */}
            <div className="relative w-full aspect-square max-h-[140px] mx-auto mb-4 flex items-center justify-center p-2">
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
            
            <div className="border border-slate-50 rounded-xl overflow-hidden mb-4 bg-background/50 p-2.5 space-y-1.5">
              <div className="flex justify-between text-[11px] border-b border-[#EAF2F4] pb-1">
                <span className="text-body font-semibold">CAS</span>
                <span className="font-bold text-body">{product.casNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[11px] border-b border-[#EAF2F4] pb-1">
                <span className="text-body font-semibold">Mol. Formula</span>
                <span className="font-bold text-body uppercase truncate max-w-[50%] text-right">{product.molecularFormula || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-body font-semibold">Mol. Weight</span>
                <span className="font-bold text-body">{product.molecularWeight || 'N/A'}</span>
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
