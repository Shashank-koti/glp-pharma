import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function GalleryGrid({ images }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {images.map((image, idx) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-border shadow-sm cursor-pointer"
        >
          {/* Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-400"></div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-secondary font-bold tracking-wider uppercase mb-1 block text-sm">
                {t(`gallery.images.${image.categoryKey}`)}
              </span>
              <h3 className="text-white font-bold text-xl">{t(`gallery.images.${image.titleKey}`)}</h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
