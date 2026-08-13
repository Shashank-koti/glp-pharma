import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { MdOutlinePeopleOutline } from 'react-icons/md';
import { BiGlobe, BiShieldQuarter } from 'react-icons/bi';
import { FaFlask, FaVials, FaCogs } from 'react-icons/fa';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function Hero() {
  const { t } = useTranslation();

  const slides = [
    {
      image: '/images/hero/slide1.png',
      label: t('home.hero.slide1.label'),
      title: t('home.hero.slide1.title'),
      highlight: t('home.hero.slide1.highlight'),
      desc: t('home.hero.slide1.desc'),
    },
    {
      image: '/images/hero/slide2.png',
      label: t('home.hero.slide2.label'),
      title: t('home.hero.slide2.title'),
      highlight: t('home.hero.slide2.highlight'),
      desc: t('home.hero.slide2.desc'),
    },
    {
      image: '/images/hero/slide3.png',
      label: t('home.hero.slide3.label'),
      title: t('home.hero.slide3.title'),
      highlight: t('home.hero.slide3.highlight'),
      desc: t('home.hero.slide3.desc'),
    }
  ];

  return (
    <div className="relative w-full min-h-[92dvh] lg:min-h-screen lg:h-[100vh] flex flex-col justify-center bg-dark overflow-visible -mt-[100px] lg:-mt-[120px] pt-[120px] lg:pt-[150px]">

      {/* Unified Slider */}
      <div className="absolute inset-0 z-0 h-full w-full bg-black">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white !w-3 !h-3 !opacity-50 transition-all',
            bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100 !w-8 !rounded-full',
          }}
          loop={true}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              {/* Background Image */}
              <div
                className="hero-bg-img absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent w-full z-10"></div>
              </div>

              {/* Text Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-[1300px] mx-auto px-6 lg:px-12 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >

                  {/* Main Heading */}
                  <h1 className="font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg text-2xl md:text-4xl">
                    {slide.title}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      {" " + slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle / Paragraph */}
                  <p className="text-slate-300 leading-relaxed max-w-xl mb-10 font-medium drop-shadow-md text-sm md:text-base">
                    {slide.desc}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-row flex-nowrap gap-2 sm:gap-4 mt-2">
                    <a href="/product-categories-view/api-impurities-and-reference-standards" className="flex-1 sm:flex-none inline-flex items-center justify-center px-2 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-base bg-primary hover:bg-primary text-white font-semibold rounded-lg transition-all duration-300 gap-1.5 hover:-translate-y-0.5 whitespace-nowrap">
                      {t('home.hero.exploreProducts')} <FiArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </a>
                    <a href="/contact" className="flex-1 sm:flex-none inline-flex items-center justify-center px-2 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-base bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-semibold rounded-lg transition-all duration-300 gap-1.5 hover:-translate-y-0.5 whitespace-nowrap">
                      {t('home.hero.getInTouch')} <FiArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Features Bar (Overlapping) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-2 md:px-12 transform translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-[1300px] mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-3 md:p-4 flex flex-col lg:flex-row items-center lg:justify-evenly w-full border border-white/50"
        >
          <div className="grid grid-cols-3 w-full lg:contents">
            {/* Feature 1 */}
            <div className="flex flex-col items-center justify-center text-center gap-1.5 w-full lg:flex-1 group cursor-pointer">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <FaFlask className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-[10px] font-bold text-heading leading-tight md:text-xs">{t('home.hero.feature1')}<br /><span className="text-[9px] md:text-[10px] font-normal text-body">{t('home.hero.feature1Sub')}</span></p>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-border"></div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center justify-center text-center gap-1.5 w-full lg:flex-1 group cursor-pointer">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <FaVials className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-[10px] font-bold text-heading leading-tight md:text-xs">{t('home.hero.feature2')}<br /><span className="text-[9px] md:text-[10px] font-normal text-body">{t('home.hero.feature2Sub')}</span></p>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-border"></div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center justify-center text-center gap-1.5 w-full lg:flex-1 group cursor-pointer">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <HiOutlineDocumentSearch className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <p className="text-[10px] font-bold text-heading leading-tight md:text-xs">{t('home.hero.feature3')}<br /><span className="text-[9px] md:text-[10px] font-normal text-body">{t('home.hero.feature3Sub')}</span></p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-8 bg-border"></div>

          {/* ISO Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full lg:contents pt-5 mt-3 border-t lg:pt-0 lg:mt-0 lg:border-t-0 border-slate-200">
            {/* ISO 9001 */}
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-default lg:flex-1 lg:justify-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-[2px] border-primary flex items-center justify-center relative bg-white shadow-sm">
                <span className="font-bold text-primary text-[8px] md:text-[9px] z-10">ISO</span>
                <div className="absolute inset-1 border border-primary/30 rounded-full"></div>
              </div>
              <div className="text-left leading-none">
                <p className="text-[9px] md:text-[10px] font-bold text-heading mb-0.5">ISO 9001:2015</p>
                <p className="text-[7px] md:text-[8px] text-primary font-semibold tracking-wider">{t('home.hero.certified')}</p>
              </div>
            </div>

            <div className="hidden lg:block w-px h-8 bg-border"></div>

            {/* ISO 17034 */}
            <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-default lg:flex-1 lg:justify-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-[2px] border-primary flex items-center justify-center relative bg-white shadow-sm">
                <span className="font-bold text-primary text-[8px] md:text-[9px] z-10">ISO</span>
                <div className="absolute inset-1 border border-primary/30 rounded-full"></div>
              </div>
              <div className="text-left leading-none">
                <p className="text-[9px] md:text-[10px] font-bold text-heading mb-0.5">ISO 17034:2016</p>
                <p className="text-[7px] md:text-[8px] text-primary font-semibold tracking-wider">{t('home.hero.certified')}</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Spacer to push following content down so it's not hidden by the overlapping bar */}
      <div className="h-32 md:h-24 bg-background w-full"></div>
    </div>
  );
}
