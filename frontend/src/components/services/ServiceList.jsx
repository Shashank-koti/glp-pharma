import { motion } from 'framer-motion';
import { FiActivity, FiTool, FiShield, FiFileText, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function ServiceList() {
  const { t } = useTranslation();

  const services = [
    {
      id: "01",
      title: t('services.list.s1Title'),
      subtitle: t('services.list.s1Sub'),
      desc: t('services.list.s1Desc'),
      features: [t('services.list.s1f1'), t('services.list.s1f2'), t('services.list.s1f3'), t('services.list.s1f4')],
      image: "/images/services_cmo.png",
      color: "from-primary/20 to-transparent",
      textColor: "text-primary",
      icon: FiTool
    },
    {
      id: "02",
      title: t('services.list.s2Title'),
      subtitle: t('services.list.s2Sub'),
      desc: t('services.list.s2Desc'),
      features: [t('services.list.s2f1'), t('services.list.s2f2'), t('services.list.s2f3'), t('services.list.s2f4')],
      image: "/images/services_synthesis.png",
      color: "from-accent/20 to-transparent",
      textColor: "text-accent",
      icon: FiActivity
    },
    {
      id: "03",
      title: t('services.list.s3Title'),
      subtitle: t('services.list.s3Sub'),
      desc: t('services.list.s3Desc'),
      features: [t('services.list.s3f1'), t('services.list.s3f2'), t('services.list.s3f3'), t('services.list.s3f4')],
      image: "/images/services_analytical.png",
      color: "from-primary/20 to-transparent",
      textColor: "text-primary",
      icon: FiShield
    },
    {
      id: "04",
      title: t('services.list.s4Title'),
      subtitle: t('services.list.s4Sub'),
      desc: t('services.list.s4Desc'),
      features: [t('services.list.s4f1'), t('services.list.s4f2'), t('services.list.s4f3'), t('services.list.s4f4')],
      image: "/images/services_regulatory.png",
      color: "from-accent/20 to-transparent",
      textColor: "text-accent",
      icon: FiFileText
    }
  ];

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background abstract elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[2px] w-12 bg-primary"></div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm">{t('services.list.ourExpertise')}</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="font-extrabold text-heading leading-tight text-2xl md:text-4xl"
            >
              {t('services.list.excellence')} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> {t('services.list.stage')}</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="text-body text-center font-medium max-w-md pb-2 text-lg"
          >
            {t('services.list.desc')}
          </motion.p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} t={t} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ServiceCard({ service, index, t }) {
  const isEven = index % 2 === 1;

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col relative"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center flex-shrink-0 ${service.textColor}`}>
              <service.icon className="text-2xl" />
            </div>
            <h3 className="font-bold text-heading text-3xl md:text-4xl">{service.title}</h3>
          </div>

          <p className={`text-lg font-semibold ${service.textColor} mb-6`}>{service.subtitle}</p>
          <p className="text-body leading-relaxed mb-10 text-lg">
            {service.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center flex-shrink-0 ${service.textColor} shadow-sm`}>
                  <FiCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-heading/90">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full lg:w-1/2"
      >
        <div className="relative rounded-[2.5rem] overflow-hidden group aspect-[4/3] shadow-2xl bg-white/5 border border-border/50">
          <div className={`absolute inset-0 bg-gradient-to-tr ${service.color} opacity-40 z-10 mix-blend-overlay`}></div>
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover relative z-0"
          />
        </div>
      </motion.div>
    </div>
  );
}
