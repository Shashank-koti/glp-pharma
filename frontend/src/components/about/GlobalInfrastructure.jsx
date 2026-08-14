import { motion } from 'framer-motion';
import { FiGlobe, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

export default function GlobalInfrastructure() {
  const { t } = useTranslation();
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white relative overflow-hidden text-body border-t border-border/50">

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <FiGlobe className="text-primary" />
              </motion.div>
              <span className="text-primary font-bold tracking-widest uppercase text-xs">{t('about.infra.title')}</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="font-extrabold text-heading mb-8 leading-tight text-2xl md:text-4xl">
              {t('about.infra.worldClass')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('about.infra.manufacturing')}</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-body mb-10 leading-relaxed font-medium text-lg">
              {t('about.infra.desc')}
            </motion.p>

            <ul className="space-y-6 mb-12">
              {[
                t('about.infra.p1'),
                t('about.infra.p2'),
                t('about.infra.p3'),
                t('about.infra.p4')
              ].map((item, i) => (
                <motion.li
                  variants={itemVariants}
                  key={i}
                  className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border hover:bg-white hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-default"
                >
                  <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
                    <FiCheckCircle className="text-primary flex-shrink-0 text-xl" />
                  </motion.div>
                  <span className="text-heading font-medium group-hover:text-primary transition-colors">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              { number: "3", label: t('about.infra.s1') },
              { number: "10k+", label: t('about.infra.s2') },
              { number: "50+", label: t('about.infra.s3') },
              { number: "250+", label: t('about.infra.s4') }
            ].map((stat, i) => (
              <motion.div
                variants={statItemVariants}
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-background backdrop-blur-md border border-border p-8 rounded-3xl text-center hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all duration-300 group shadow-sm cursor-default"
              >
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm inline-block text-5xl md:text-6xl">
                  {stat.number}
                </div>
                <div className="text-heading font-bold uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
