import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LifeAtGLP() {
  const { t } = useTranslation();
  return (
    <div className="pt-6 relative overflow-hidden mb-14">
      <div className="w-full xl:w-[95%] 2xl:w-[92%] max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <span className="text-[#1AA3B6] font-extrabold tracking-widest uppercase mb-3 block text-sm">{t('careers.life.culture')}</span>
            <h2 className="font-extrabold text-[#12344D] mb-6 tracking-tight text-4xl md:text-5xl">
              {t('careers.life.title')}
            </h2>

            <p className="text-[#5B7280] leading-relaxed mb-6 font-medium text-lg">
              {t('careers.life.p1')}
            </p>
            <p className="text-[#5B7280] leading-relaxed font-medium text-lg">
              {t('careers.life.p2')}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="border-l-4 border-[#1AA3B6] pl-4">
                <h4 className="font-extrabold text-[#12344D] mb-1 text-3xl">500+</h4>
                <p className="text-[#5B7280] font-semibold uppercase tracking-wide text-sm">Global Team Members</p>
              </div>
              <div className="border-l-4 border-[#1AA3B6] pl-4">
                <h4 className="font-extrabold text-[#12344D] mb-1 text-3xl">40+</h4>
                <p className="text-[#5B7280] font-semibold uppercase tracking-wide text-sm">Nationalities</p>
              </div>
            </div>
          </motion.div>

          {/* Image Collage / Masonry */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-[#1AA3B6]/20 to-[#0B7285]/20 blur-3xl rounded-full -z-10"></div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="flex flex-col pt-10">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EAF2F4] group aspect-[4/5]">
                  <img src="/images/careers/life_glp_1.png" alt="Life at GLP 1" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="flex flex-col pb-10">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EAF2F4] group aspect-[4/5]">
                  <img src="/images/careers/life_glp_3.png" alt="Life at GLP 3" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
