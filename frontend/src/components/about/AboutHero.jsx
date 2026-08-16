import { motion } from 'framer-motion';
import { FiActivity, FiGlobe, FiAward } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function AboutHero() {
  const { t } = useTranslation();
  return (
    <section className="relative pt-24 pb-32 lg:pt-4 lg:pb-40 bg-white overflow-hidden">
      {/* Premium Abstract Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"
      ></motion.div>
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"
      ></motion.div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1AA3B6 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10 w-full">

        {/* Centered Typography Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="font-bold text-heading mb-2 pt-8 text-primary leading-[1.15] tracking-tight text-2xl md:text-4xl">
              {t('about.hero.title')}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-body leading-relaxed max-w-2xl mx-auto font-medium text-lg">
              {t('about.hero.desc')}
            </motion.p>
          </motion.div>
        </div>

        {/* Stunning Visual Composition */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "tween" }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          {/* Main Wide Image */}
          <div className="aspect-[16/9] md:aspect-[2.5/1] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(26,163,182,0.15)] relative border border-border group">
            <img
              src="/images/about_hero_lab.png"
              alt="Advanced Pharmaceutical Laboratory"
              className="w-full h-full object-cover transform"
            />
            {/* Subtle inner overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent mix-blend-multiply"></div>
          </div>

          {/* Floating Glassmorphic Card - Left (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.4, type: "tween" }}
            className="hidden md:block absolute -left-12 bottom-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white max-w-[260px] transform hover:-translate-y-2 transition-transform duration-300"
          >
            <motion.div variants={floatVariants} initial="initial" animate="animate">
              <div className="w-12 h-12 rounded-full bg-[#084553] flex items-center justify-center mb-4 text-white">
                <FiGlobe className="text-xl" />
              </div>
              <div className="font-black text-heading mb-1 text-3xl">{t('about.hero.card1Val')}</div>
              <div className="text-body font-medium leading-tight text-sm">{t('about.hero.card1Text')}</div>
            </motion.div>
          </motion.div>

          {/* Floating Glassmorphic Card - Right (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.5, type: "tween" }}
            className="hidden md:block absolute -right-12 top-20 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white max-w-[260px] transform hover:-translate-y-2 transition-transform duration-300"
          >
            <motion.div variants={floatVariants} initial="initial" animate="animate" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                <FiActivity className="text-xl" />
              </div>
              <div className="font-black text-heading mb-1 text-3xl">{t('about.hero.card2Val')}</div>
              <div className="text-body font-medium leading-tight text-sm">{t('about.hero.card2Text')}</div>
            </motion.div>
          </motion.div>

        </motion.div>

        {/* Mobile Stats Cards (Hidden on Desktop) */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 md:hidden">
          <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-[#EAF2F4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#084553] flex items-center justify-center text-white shrink-0">
              <FiGlobe className="text-xl" />
            </div>
            <div>
              <div className="font-black text-heading text-xl">{t('about.hero.card1Val')}</div>
              <div className="text-body font-medium text-[13px]">{t('about.hero.card1Text')}</div>
            </div>
          </div>
          <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-[#EAF2F4] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <FiActivity className="text-xl" />
            </div>
            <div>
              <div className="font-black text-heading text-xl">{t('about.hero.card2Val')}</div>
              <div className="text-body font-medium text-[13px]">{t('about.hero.card2Text')}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}



