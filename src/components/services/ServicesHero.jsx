import { motion } from 'framer-motion';
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

export default function ServicesHero() {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: "url('/images/services_hero_bg.png')" }}
      ></div>

      {/* Animated Gradient Overlays */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply"
      ></motion.div>
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] mix-blend-multiply"
      ></motion.div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1AA3B6 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background"></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10 w-full text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 variants={itemVariants} className="font-extrabold text-heading mb-6 leading-[1.1] tracking-tight text-2xl md:text-5xl">
            {t('services.hero.title1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">{t('services.hero.title2')}</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-body leading-relaxed max-w-2xl mx-auto font-medium text-lg md:text-xl">
            {t('services.hero.desc')}
          </motion.p>
        </motion.div>
      </div>

    </section>
  );
}
