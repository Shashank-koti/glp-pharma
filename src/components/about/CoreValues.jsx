import { motion } from 'framer-motion';
import { FiTarget, FiGlobe, FiAward, FiUsers } from 'react-icons/fi';
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

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "tween", duration: 0.5 }
  },
};

export default function CoreValues() {
  const { t } = useTranslation();
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-t border-border/50">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px', color: '#1AA3B6' }}></div>
      
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h2 className="font-extrabold text-heading mb-6 text-3xl md:text-5xl">{t('about.values.title')}</h2>
            <p className="text-body font-medium text-lg">
              {t('about.values.desc')}
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { icon: FiTarget, title: t('about.values.v1Title'), desc: t('about.values.v1Desc') },
            { icon: FiAward, title: t('about.values.v2Title'), desc: t('about.values.v2Desc') },
            { icon: FiGlobe, title: t('about.values.v3Title'), desc: t('about.values.v3Desc') },
            { icon: FiUsers, title: t('about.values.v4Title'), desc: t('about.values.v4Desc') }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="group relative h-full cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-background backdrop-blur-xl p-10 rounded-3xl h-full border border-border group-hover:border-primary/50 group-hover:bg-white transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(26,163,182,0.15)]">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-8 relative overflow-hidden group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <value.icon className="text-primary transform group-hover:scale-110 transition-transform duration-500 text-4xl" />
                  </motion.div>
                </div>
                <h3 className="font-bold text-heading mb-4 group-hover:text-primary transition-colors duration-300 text-2xl">{value.title}</h3>
                <p className="text-body leading-relaxed font-medium">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
