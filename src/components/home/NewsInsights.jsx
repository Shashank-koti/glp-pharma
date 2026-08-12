import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function NewsInsights() {
  const { t } = useTranslation();
  const news = [
    {
      category: t('home.newsInsights.n1Category'),
      title: t('home.newsInsights.n1Title'),
      date: t('home.newsInsights.n1Date'),
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tcGFueSUyMG5ld3N8ZW58MHx8MHx8fDA%3D",
      link: "#"
    },
    {
      category: t('home.newsInsights.n2Category'),
      title: t('home.newsInsights.n2Title'),
      date: t('home.newsInsights.n2Date'),
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    },
    {
      category: t('home.newsInsights.n3Category'),
      title: t('home.newsInsights.n3Title'),
      date: t('home.newsInsights.n3Date'),
      image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlc2VhcmNofGVufDB8fDB8fHww",
      link: "#"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <h4 className="text-primary font-bold tracking-widest uppercase text-xs">{t('home.newsInsights.knowledgeHub')}</h4>
            </div>
            <h3 className="font-extrabold text-heading leading-tight text-4xl md:text-5xl">
              {t('home.newsInsights.industryInsights')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">{t('home.newsInsights.andNews')}</span>
            </h3>
          </div>
          <div className="pb-2 hidden md:block">
            <a href="/news" className="inline-flex items-center gap-2 px-6 py-3 text-primary font-medium hover:transition-colors duration-300 group">
              {t('home.newsInsights.viewAllArticles')}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] transition-all duration-500 border border-border flex flex-col cursor-pointer hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-primary shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-xs">
                  {item.category}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow relative">
                {/* Floating Date Badge */}
                <div className="absolute -top-6 right-8 bg-primary text-white px-4 py-3 rounded-2xl shadow-lg shadow-blue-600/30 flex flex-col items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="font-bold leading-none mb-1 text-xl">{item.date.split(' ')[1].replace(',', '')}</span>
                  <span className="uppercase font-medium tracking-wider text-xs">{item.date.split(' ')[0]}</span>
                </div>

                <h4 className="font-bold text-heading mb-6 line-clamp-3 group-hover: transition-colors duration-300 mt-2 text-lg">
                  {item.title}
                </h4>

                <div className="mt-auto">
                  <a href={item.link} className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all duration-300">
                    {t('home.newsInsights.readFullStory')} <FiArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <a href="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-primary transition-colors duration-300 group">
            {t('home.newsInsights.viewAllArticles')} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
