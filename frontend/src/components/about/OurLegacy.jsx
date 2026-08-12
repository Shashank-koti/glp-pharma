import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
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
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function OurLegacy() {
  const { t } = useTranslation();
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-t border-border/50">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "tween" }}
            className="relative order-1 lg:order-2"
          >
            <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <img
                src="/images/about_legacy_research.png"
                alt="Scientific Research"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-dark/40 via-transparent to-transparent"></div>

              {/* Floating Badge */}
              <motion.div
                variants={floatVariants}
                initial="initial"
                animate="animate"
                className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white max-w-xs transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-1 inline-block text-4xl">{t('about.legacy.years')}</div>
                <div className="text-heading font-bold uppercase tracking-wider text-sm">{t('about.legacy.yearsText')}</div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[60px] -z-10"
            ></motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-[40px] -z-10"
            ></motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="order-2 lg:order-1"
          >
            <motion.h2 variants={itemVariants} className="font-extrabold text-heading mb-8 leading-tight text-2xl md:text-4xl">
              {t('about.legacy.title1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('about.legacy.title2')}</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-6 text-body mb-10 font-medium text-lg">
              <p>
                {t('about.legacy.p1')}
              </p>
              <p>
                {t('about.legacy.p2')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border w-max hover:border-primary/30 transition-colors duration-300">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20"
              >
                <FiAward className="text-primary text-2xl" />
              </motion.div>
              <div>
                <div className="font-bold text-heading text-lg">{t('about.legacy.certTitle')}</div>
                <div className="text-body text-sm">{t('about.legacy.certSub')}</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
