import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { FiX, FiCheckCircle, FiShoppingCart, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { LuArrowLeftRight } from 'react-icons/lu';

export default function CompareProducts() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart, cartItems } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#F8FBFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#EAF2F4] text-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#F0F7F9] rounded-full flex items-center justify-center mx-auto mb-6">
            <LuArrowLeftRight className="text-[#1AA3B6] text-4xl" />
          </div>
          <h2 className="font-extrabold text-heading mb-3 tracking-tight text-2xl">Compare Products</h2>
          <p className="text-body mb-8 font-medium">You haven't added any products to compare yet.</p>
          <Link
            to="/product-categories-view/api-impurities-and-reference-standards"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#1AA3B6] hover:bg-[#0B7285] text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Define the rows we want to display
  const rows = [
    { label: 'Category', key: 'category' },
    { label: 'CAS Number', key: 'casNumber' },
    { label: 'Catalogue Number', key: 'catalogueNumber' },
    { label: 'Molecular Formula', key: 'molecularFormula' },
    { label: 'Molecular Weight', key: 'molecularWeight' },
    { label: 'Purity', key: 'purity' },
    { label: 'Appearance', key: 'appearance' },
    { label: 'Storage', key: 'storage' },
    { label: 'Availability', key: 'availability' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FBFC] font-sans pb-20 pt-6 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center pt-14 sm:pt-4 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1AA3B6] rounded-xl flex items-center justify-center text-white shadow-md">
              <LuArrowLeftRight size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-heading tracking-tight text-2xl md:text-3xl">Compare Products</h1>
              <p className="text-body font-medium mt-1 text-sm">Comparing {compareItems.length} {compareItems.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={clearCompare}
            className="font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-1.5 text-sm"
          >
            <FiX size={16} /> Clear All
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-[#EAF2F4] overflow-x-auto md:overflow-hidden relative flex mx-auto w-fit max-w-full">
          {/* Sticky Left Column for Labels */}
          <div className="w-40 md:w-56 shrink-0 border-r border-[#EAF2F4] bg-white z-10 static md:sticky md:left-0 shadow-none md:shadow-[4px_0_15px_rgba(0,0,0,0.03)]">
            {/* Header placeholder */}
            <div className="h-[280px] p-4 flex items-end justify-center border-b border-[#EAF2F4] bg-[#F8FBFC]">
              <span className="font-extrabold text-heading tracking-wide text-lg">Features</span>
            </div>

            {/* Rows labels */}
            {rows.map((row, idx) => (
              <div key={idx} className={`h-16 px-4 flex items-center font-bold text-heading text-sm border-b border-[#EAF2F4] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FBFC]/50'}`}>
                {row.label}
              </div>
            ))}

            {/* Footer placeholder */}
            <div className="h-20 p-4 border-b-0"></div>
          </div>

          {/* Horizontally Scrollable Content Area */}
          <div className="flex-1 overflow-visible md:overflow-x-auto scrollbar-hide bg-white flex w-max md:w-auto">
            {compareItems.map((product) => (
              <div key={product._id} className="w-64 shrink-0 border-r border-[#EAF2F4] flex flex-col hover:bg-slate-50/50 transition-colors">

                {/* Product Header Card */}
                <div className="h-[280px] p-5 flex flex-col items-center justify-between border-b border-[#EAF2F4] relative group">
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from compare"
                  >
                    <FiX size={16} />
                  </button>

                  <div className="w-32 h-32 relative mb-4 flex items-center justify-center">
                    <img
                      src={product.image || "/images/demoprod.gif"}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <Link to={`/products/${product.slug}`} className="text-center w-full">
                    <h3 className="font-extrabold text-heading text-[15px] leading-snug line-clamp-2 hover:text-[#1AA3B6] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="bg-[#1AA3B6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-0 tracking-wider uppercase mt-2">
                    GL-{product._id.substring(0, 5)}
                  </span>
                </div>

                {/* Property Rows */}
                {rows.map((row, idx) => {
                  let val = product[row.key];
                  if (row.key === 'category' && typeof val === 'object' && val !== null) {
                    val = val.categoryName;
                  }

                  return (
                    <div key={idx} className={`h-16 px-4 flex items-center justify-center text-center text-[13px] font-semibold text-body border-b border-[#EAF2F4] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FBFC]/50'}`}>
                      {val || '-'}
                    </div>
                  );
                })}

                {/* Footer Action */}
                <div className="h-20 p-4 flex items-center justify-center bg-white border-t border-[#EAF2F4]">
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full flex items-center justify-center gap-1.5 font-bold py-2.5 rounded-xl transition-all shadow-sm text-[13px] ${cartItems.some(item => item.id === product._id)
                      ? 'bg-[#E8F4F6] text-[#0B7285] border border-[#1AA3B6]/20'
                      : 'bg-[#0B7285] hover:bg-[#1AA3B6] text-white border-0'
                      }`}
                  >
                    {cartItems.some(item => item.id === product._id) ? (
                      <>
                        <FiCheckCircle size={16} /> Added
                      </>
                    ) : (
                      <>
                        <FiShoppingCart size={16} /> Add to RFQ
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
