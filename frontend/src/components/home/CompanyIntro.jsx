import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function CompanyIntro() {
  const { t } = useTranslation();
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent skew-x-12 translate-x-20 z-0 opacity-70"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 mt-10 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <h4 className="text-primary font-bold tracking-widest uppercase text-xs">{t('home.companyIntro.about')}</h4>
              </div>
              <h1 className="font-extrabold text-heading leading-[1.15] text-3xl md:text-4xl">
                {t('home.companyIntro.pioneering')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                  {t('home.companyIntro.pharmaceuticals')}
                </span>
              </h1>
            </div>

            <p className="text-body leading-relaxed font-medium text-lg">
              {t('home.companyIntro.desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
              {t('home.companyIntro.points', { returnObjects: true }).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <FiCheckCircle className="text-primary group-hover:text-white transition-colors duration-300 w-4 h-4" />
                  </div>
                  <span className="text-body font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <div className="">
              <a href="/about" className="group inline-flex items-center gap-2 text-primary font-bold hover:text-blue-800 transition-colors text-lg">
                {t('home.companyIntro.readOurStory')}
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image container with premium styling */}
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('/images/hero/pharma_hero_lab.png')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

              {/* Floating Glass Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">20+</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold leading-tight text-lg">{t('home.companyIntro.yearsOfExcellence')}</h4>
                    <p className="text-blue-200 text-sm">{t('home.companyIntro.inGlobalPharma')}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative dots behind image */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[radial-gradient(circle,theme(colors.blue.400)_2px,transparent_2px)] [background-size:12px_12px] opacity-30 -z-10 rounded-full"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[radial-gradient(circle,theme(colors.cyan.400)_2px,transparent_2px)] [background-size:12px_12px] opacity-30 -z-10 rounded-full"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
