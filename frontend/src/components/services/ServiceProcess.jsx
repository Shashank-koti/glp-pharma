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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 }
  },
};

export default function ServiceProcess() {
  const { t } = useTranslation();
  
  const steps = [
    { num: "01", title: t('services.process.p1Title'), desc: t('services.process.p1Desc') },
    { num: "02", title: t('services.process.p2Title'), desc: t('services.process.p2Desc') },
    { num: "03", title: t('services.process.p3Title'), desc: t('services.process.p3Desc') },
    { num: "04", title: t('services.process.p4Title'), desc: t('services.process.p4Desc') }
  ];

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-t border-border">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="font-extrabold text-heading mb-6 text-3xl md:text-5xl"
          >
            {t('services.process.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('services.process.title2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="text-body font-medium text-lg"
          >
            {t('services.process.desc')}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border hidden lg:block -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-primary to-accent origin-left"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white border-2 border-transparent group-hover:border-primary/20 p-8 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col relative z-10">
                  <div className="font-black text-transparent bg-clip-text bg-gradient-to-br from-border to-body/30 mb-6 group-hover:from-primary group-hover:to-accent transition-all duration-500 text-5xl">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-heading mb-4 text-xl">{step.title}</h3>
                  <p className="text-body leading-relaxed font-medium text-sm">{step.desc}</p>
                </div>

              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
