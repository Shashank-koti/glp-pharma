import { motion } from 'framer-motion';
import { BiGlobe } from 'react-icons/bi';
import { FaAward, FaCertificate } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function GlobalTrust() {
  const { t } = useTranslation();
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden text-body">
      {/* Abstract World Map Background */}
      <div className="absolute inset-0 text-primary opacity-5">
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <path fill="currentColor" d="M100,200 Q150,150 200,200 T300,200 T400,200 T500,200 T600,200 T700,200 T800,200 T900,200" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" fillOpacity="0.2" />
          <circle cx="200" cy="200" r="10" fill="currentColor" />
          <circle cx="500" cy="200" r="15" fill="currentColor" />
          <circle cx="800" cy="200" r="8" fill="currentColor" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2 backdrop-blur-md">
              <BiGlobe className="text-primary w-4 h-4" />
              <h4 className="text-[#084553] font-bold tracking-widest uppercase text-xs">{t('home.globalTrust.globalReach')}</h4>
            </div>

            <h3 className="font-extrabold text-heading leading-tight mb-4 drop-shadow-sm text-2xl md:text-4xl">
              {t('home.globalTrust.trustedBy')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('home.globalTrust.worldwide')}</span>
            </h3>

            <p className="text-body leading-relaxed mb-10 font-medium max-w-xl text-lg">
              {t('home.globalTrust.desc')}
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <div className="font-black text-primary mb-2 drop-shadow-sm text-4xl md:text-5xl">50+</div>
                <div className="text-heading font-semibold uppercase tracking-widest text-sm">{t('home.globalTrust.countriesServed')}</div>
              </div>
              <div className="w-px h-16 bg-border hidden sm:block"></div>
              <div>
                <div className="font-black text-primary mb-2 drop-shadow-sm text-4xl md:text-5xl">10k+</div>
                <div className="text-heading font-semibold uppercase tracking-widest text-sm">{t('home.globalTrust.productsAvailable')}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Certificate 1 */}
            <div className="bg-background border border-border p-8 rounded-3xl hover:bg-white hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <FaAward className="text-primary mb-6 text-4xl" />
              <h4 className="font-bold text-heading mb-2 text-2xl">{t('home.globalTrust.c1Title')}</h4>
              <p className="text-body font-medium text-sm">{t('home.globalTrust.c1Desc')}</p>
            </div>

            {/* Certificate 2 */}
            <div className="bg-background border border-border p-8 rounded-3xl hover:bg-white hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:translate-y-8">
              <FaCertificate className="text-primary mb-6 text-4xl" />
              <h4 className="font-bold text-heading mb-2 text-2xl">{t('home.globalTrust.c2Title')}</h4>
              <p className="text-body font-medium text-sm">{t('home.globalTrust.c2Desc')}</p>
            </div>

            {/* Certificate 3 */}
            <div className="bg-background border border-border p-8 rounded-3xl hover:bg-white hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
                  <span className="text-primary font-bold text-xs">ISO</span>
                </div>
              </div>
              <h4 className="font-bold text-heading mb-2 text-2xl">{t('home.globalTrust.c3Title')}</h4>
              <p className="text-body font-medium text-sm">{t('home.globalTrust.c3Desc')}</p>
            </div>

            {/* Certificate 4 */}
            <div className="bg-background border border-border p-8 rounded-3xl hover:bg-white hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:translate-y-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
                  <span className="text-primary font-bold text-xs">ISO</span>
                </div>
              </div>
              <h4 className="font-bold text-heading mb-2 text-2xl">{t('home.globalTrust.c4Title')}</h4>
              <p className="text-body font-medium text-sm">{t('home.globalTrust.c4Desc')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
