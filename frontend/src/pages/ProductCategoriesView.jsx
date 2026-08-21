import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  FiChevronRight,
  FiShield,
  FiDroplet,
  FiGlobe,
  FiGrid,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), '#'];

export default function ProductCategoriesView() {
  const { t } = useTranslation();
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  // Initial fallback text matching the image structure
  const [categoryName, setCategoryName] = useState('API IMPURITIES AND REFERENCE STANDARDS');
  const [categoryDescription, setCategoryDescription] = useState('High-quality pharmaceutical impurities and reference standards for accurate research and analysis.');
  const [loading, setLoading] = useState(true);

  const currentLetter = searchParams.get('letter') || 'All';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch category details for the header
        const catRes = await axios.get(`https://glp-pharma-backend.vercel.app/api/categories/${categorySlug}`);
        if (catRes.data.success) {
          setCategoryName(catRes.data.data.categoryName);
          if (catRes.data.data.description) setCategoryDescription(catRes.data.data.description);
        }

        // Fetch groups
        const res = await axios.get(`https://glp-pharma-backend.vercel.app/api/categories/${categorySlug}/products`);
        if (res.data.success) {
          setGroups(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching product groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlug, currentLetter]);

  const handleLetterClick = (letter) => {
    if (letter === 'All') {
      searchParams.delete('letter');
    } else {
      searchParams.set('letter', letter);
    }
    setSearchParams(searchParams);
  };

  // Filter locally just in case backend doesn't support the letter param
  const filteredGroups = groups.filter(group => {
    let letterMatch = true;
    if (currentLetter !== 'All') {
      const name = group.heading || group.name || '';
      if (currentLetter === '#') letterMatch = !/^[a-zA-Z]/.test(name);
      else letterMatch = name.toUpperCase().startsWith(currentLetter);
    }
    return letterMatch;
  });

  // Keep ascending sort as default
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const nameA = a.heading || a.name || '';
    const nameB = b.heading || b.name || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="min-h-screen bg-[#F8FBFC] font-sans">

      {/* 1. Hero Section */}
      <div
        className="w-full min-h-[420px] bg-cover bg-center bg-no-repeat relative bg-white"
        style={{ backgroundImage: "url('/images/productsBG.png')" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-20">
          <div className="max-w-[900px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[15px] text-[#5B7280] font-medium mb-6 flex-wrap">
              <Link to="/" className="hover:text-[#1AA3B6] transition-colors">Home</Link>
              <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
              <span className="text-slate-500">Our Products</span>
              <FiChevronRight className="text-slate-400 text-[14px] mt-0.5" />
              <span className="text-[#1AA3B6] font-semibold">{categoryName}</span>
            </div>

            <h1 className="text-[24px] md:text-[36px] lg:text-[44px] font-[900] leading-[1.15] tracking-tight text-[#12344D] mb-5 uppercase">
              {categoryName.toUpperCase().includes(' AND ') ? (
                <>
                  {categoryName.toUpperCase().split(' AND ')[0]} AND <br />
                  <span className="text-[#084553]">
                    {categoryName.toUpperCase().split(' AND ').slice(1).join(' AND ')}
                  </span>
                </>
              ) : (
                <span className="text-[#084553]">{categoryName}</span>
              )}
            </h1>
            <p className="text-body text-[15px] md:text-[16px] max-w-[500px] mb-8 leading-relaxed font-medium">
              {categoryDescription}
            </p>


            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-10 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0 border border-[#D9E8EC]">
                  <FiShield size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#12344D]">Trusted Quality</h4>
                  <p className="text-[12px] text-body font-medium mt-0.5">Stringent Testing</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-border"></div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0 border border-[#D9E8EC]">
                  <FiDroplet size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#12344D]">Research Grade</h4>
                  <p className="text-[12px] text-body font-medium mt-0.5">High Purity Standards</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-border"></div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0 border border-[#D9E8EC]">
                  <FiGlobe size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#12344D]">Global Compliance</h4>
                  <p className="text-[12px] text-body font-medium mt-0.5">ISO, GMP & Regulatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Alphabet Navigation */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 -mt-12 relative z-20">
        <div className="bg-white/40 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 md:p-4 border border-white/60">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide min-w-0 px-2 pb-1">
                <button
                  onClick={() => handleLetterClick('All')}
                  className={`flex-shrink-0 flex items-center gap-1 px-5 h-[42px] rounded-full text-[14.5px] font-extrabold transition-all duration-300 backdrop-blur-md ${currentLetter === 'All'
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
                          : 'bg-white/50 hover:bg-white text-[#12344D] border border-white/80 shadow-sm hover:shadow-md hover:text-[#1AA3B6] hover:-translate-y-0.5'
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

      {/* <div className='text-center align-center pt-5 '>
        <p className='text-[22px] font-bold text-[#1AA3B6]'>List of Parent API's</p>
      </div> */}

      {/* 3. Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 min-h-[40vh]">

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#EAF2F4] border-t-[#1AA3B6] rounded-full animate-spin"></div>
            <span className="mt-4 text-body font-medium">{t('products.loadingCat')}</span>
          </div>
        ) : sortedGroups.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6">
              <FiAlertCircle className="text-slate-300 text-4xl" />
            </div>
            <h3 className="font-bold text-heading mb-2 text-2xl">{t('products.noCatFound')}</h3>
            <p className="text-body mb-8 max-w-md text-lg">
              {t('products.noCatDesc')}
            </p>
            <button
              onClick={() => handleLetterClick('All')}
              className="bg-[#1AA3B6] hover:bg-[#0B7285] text-white px-8 py-3.5 rounded-xl font-bold transition-all"
            >
              {t('products.viewAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {sortedGroups.map((group, idx) => (
              <Link
                to={`/products-view/${group.p_link}`}
                key={idx}
                className="bg-white rounded-[16px] p-3 lg:p-4 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0">
                    <FiFileText size={20} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-[#12344D] text-[16px] font-bold leading-tight mb-0.5 group-hover:text-[#1AA3B6] transition-colors line-clamp-1">
                      {group.heading || group.name}
                    </h3>
                    <p className="text-slate-400 text-[11px] font-medium">Explore Products</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#1AA3B6] group-hover:text-white transition-colors">
                  <FiChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
