import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiTag, FiSearch, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuBuilding2, LuMicroscope, LuFileCheck, LuCalendarDays } from 'react-icons/lu';

export default function News() {
  const { t } = useTranslation();

  const news = [
    { id: 1, title: t('newsPage.articles.n1Title'), date: t('newsPage.articles.n1Date'), category: t('newsPage.articles.n1Cat'), desc: t('newsPage.articles.n1Desc') },
    { id: 2, title: t('newsPage.articles.n2Title'), date: t('newsPage.articles.n2Date'), category: t('newsPage.articles.n2Cat'), desc: t('newsPage.articles.n2Desc') },
    { id: 3, title: t('newsPage.articles.n3Title'), date: t('newsPage.articles.n3Date'), category: t('newsPage.articles.n3Cat'), desc: t('newsPage.articles.n3Desc') },
    { id: 4, title: t('newsPage.articles.n4Title'), date: t('newsPage.articles.n4Date'), category: t('newsPage.articles.n4Cat'), desc: t('newsPage.articles.n4Desc') },
  ];

  const categories = [
    { name: t('newsPage.cats.all') || 'All News', icon: LuBuilding2 },
    { name: t('newsPage.cats.company') || 'Company', icon: LuBuilding2 },
    { name: t('newsPage.cats.research') || 'Research', icon: LuMicroscope },
    { name: t('newsPage.cats.regulatory') || 'Regulatory', icon: LuFileCheck },
    { name: t('newsPage.cats.events') || 'Events', icon: LuCalendarDays }
  ];

  return (
    <section className="relative min-h-screen bg-[#F8FBFC] overflow-hidden pt-[110px] pb-[90px] px-4 md:px-6">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#D9E8EC] to-transparent -z-10" />
      <div className="absolute inset-0 bg-[url('/images/credBG.png')] bg-center bg-cover bg-no-repeat -z-20 opacity-40" />

      {/* Header */}
      <div className="text-center mb-[50px] max-w-[800px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-primary text-[28px] sm:text-[38px] font-[800] tracking-[-0.03em] leading-[1.2] mb-[16px] uppercase"
        >
          {t('newsPage.banner.title') || 'Latest News & Insights'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#5B7280] text-[15px] sm:text-[17px] font-medium leading-[1.6]"
        >
          {t('newsPage.banner.desc') || 'Stay updated with the latest developments, research findings, and company announcements from GLP Pharma.'}
        </motion.p>
      </div>

      <div className="w-full max-w-[1300px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-[30px] xl:gap-[40px]">
        {/* Main Content: News List */}
        <div className="flex flex-col gap-[30px]">
          {news.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group border border-[#D9E8EC] rounded-[16px] bg-white shadow-[0_10px_30px_rgba(26,163,182,0.04)] overflow-hidden hover:shadow-[0_15px_40px_rgba(26,163,182,0.08)] transition-all duration-300 hover:border-[#1AA3B6]/20 flex flex-col sm:flex-row"
            >


              <div className="p-[25px_30px] sm:p-[30px_35px] flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#E8F4F6] text-[#1AA3B6] text-[11px] font-[750] uppercase tracking-[0.05em] px-[10px] py-[4px] rounded-[4px]">
                    {item.category}
                  </span>
                  <span className="text-[#5B7280] text-[12px] font-medium flex items-center gap-1.5">
                    <FiCalendar className="text-[#9ABAC0]" /> {item.date}
                  </span>
                </div>

                <h2 className="text-[#12344D] text-[20px] sm:text-[22px] font-[750] leading-[1.3] mb-[12px] group-hover:text-[#1AA3B6] transition-colors">
                  {item.title}
                </h2>

                <p className="text-[#5B7280] text-[14.5px] font-medium leading-[1.6] mb-[20px] line-clamp-3">
                  {item.desc}
                </p>

                <div className="mt-auto pt-[15px] border-t border-[#D9E8EC] flex items-center justify-between">
                  <Link to={`/news/${item.id}`} className="inline-flex items-center gap-2 text-[#1AA3B6] font-[700] text-[13.5px] hover:text-[#0B7285] transition-colors group/link">
                    {t('newsPage.readFull') || 'Read Full Article'}
                    <FiArrowRight className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <button className="w-[32px] h-[32px] rounded-full bg-[#E8F4F6] flex items-center justify-center text-[#9ABAC0] hover:text-[#1AA3B6] hover:bg-[#E8F4F6] transition-colors cursor-pointer">
                    <FiTag size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-[10px]">
            <div className="flex gap-2">
              <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] border border-[#D9E8EC] bg-white text-[#5B7280] hover:text-[#12344D] hover:border-[#D9E8EC] transition-colors cursor-pointer">
                <FiChevronRight className="rotate-180" />
              </button>
              <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-[#1AA3B6] text-white font-[700] shadow-[0_4px_10px_rgba(26,163,182,0.2)] cursor-pointer">1</button>
              <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] border border-[#D9E8EC] bg-white text-[#5B7280] font-[600] hover:text-[#12344D] hover:border-[#D9E8EC] transition-colors cursor-pointer">2</button>
              <button className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] border border-[#D9E8EC] bg-white text-[#5B7280] hover:text-[#12344D] hover:border-[#D9E8EC] transition-colors cursor-pointer">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-[30px]">
          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border border-[#D9E8EC] rounded-[16px] bg-white p-[24px_30px] shadow-[0_10px_30px_rgba(26,163,182,0.03)]"
          >
            <h3 className="text-[#12344D] text-[16px] font-[750] mb-[16px]">Search News</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full h-[44px] bg-[#F8FBFC] border border-[#D9E8EC] rounded-[8px] text-[13.5px] px-[16px] pr-[40px] outline-none transition-colors focus:border-[#1AA3B6]/50 focus:bg-white placeholder:text-[#5B7280]"
              />
              <button className="absolute right-0 top-0 w-[44px] h-[44px] flex items-center justify-center text-[#5B7280] hover:text-[#1AA3B6] transition-colors cursor-pointer">
                <FiSearch />
              </button>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="border border-[#D9E8EC] rounded-[16px] bg-white shadow-[0_10px_30px_rgba(26,163,182,0.03)] overflow-hidden"
          >
            <div className="p-[20px_24px] border-b border-[#D9E8EC] bg-[#FFFFFF]">
              <h3 className="text-[#12344D] text-[16px] font-[750]">{t('newsPage.categoriesTitle') || 'Categories'}</h3>
            </div>
            <div className="p-[12px_16px]">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button key={idx} className="w-full flex items-center justify-between p-[10px_12px] rounded-[8px] hover:bg-[#E8F4F6] group transition-colors text-left cursor-pointer">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[32px] h-[32px] rounded-[6px] bg-white border border-[#D9E8EC] flex items-center justify-center text-[#5B7280] group-hover:text-[#1AA3B6] group-hover:border-[#1AA3B6]/30 transition-colors shadow-sm">
                        <Icon size={15} strokeWidth={2} />
                      </div>
                      <span className="text-[#5B7280] text-[14px] font-[600] group-hover:text-[#12344D] transition-colors">{cat.name}</span>
                    </div>
                    <FiChevronRight className="text-[#aabdc7] group-hover:text-[#1AA3B6] transition-colors" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
        <h1>testing stage</h1>

      </div>
    </section>
  );
}
