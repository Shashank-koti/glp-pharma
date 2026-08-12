import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiTrendingUp, FiHeart, FiBriefcase, FiClock } from 'react-icons/fi';

export default function WhyJoinUs() {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t('careers.why.b1Title'),
      desc: t('careers.why.b1Desc'),
      icon: FiBriefcase,
      color: "from-[#1AA3B6] to-[#0B7285]"
    },
    {
      title: t('careers.why.b2Title'),
      desc: t('careers.why.b2Desc'),
      icon: FiHeart,
      color: "from-rose-500 to-pink-600"
    },
    {
      title: t('careers.why.b3Title'),
      desc: t('careers.why.b3Desc'),
      icon: FiTrendingUp,
      color: "from-amber-400 to-orange-500"
    },
    {
      title: t('careers.why.b4Title'),
      desc: t('careers.why.b4Desc'),
      icon: FiClock,
      color: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="py-20 bg-[#F8FBFC] relative overflow-hidden">


      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#1AA3B6] font-extrabold tracking-widest uppercase mb-3 block text-sm">Perks & Benefits</span>
            <h2 className="font-extrabold text-[#12344D] tracking-tight mb-6 text-4xl md:text-5xl">
              {t('careers.why.title')}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#5B7280] max-w-2xl mx-auto leading-relaxed font-medium text-lg md:text-xl"
          >
            {t('careers.why.desc')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group relative bg-white rounded-3xl p-8 sm:p-10 border border-[#EAF2F4] hover:border-transparent transition-all duration-300"
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F0F7F9] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-xl z-0 pointer-events-none"></div>

              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${benefit.color} text-white shadow-lg mb-8 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <benefit.icon size={28} />
                </div>
                <h3 className="font-bold text-[#12344D] mb-4 group-hover:text-[#1AA3B6] transition-colors text-2xl">{benefit.title}</h3>
                <p className="text-[#5B7280] text-[15px] leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
