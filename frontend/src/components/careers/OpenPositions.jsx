import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function OpenPositions() {
  const { t } = useTranslation();

  const jobs = [
    { id: 1, title: t('careers.open.j1Title'), department: t('careers.open.j1Dept'), location: t('careers.open.j1Loc'), type: t('careers.open.j1Type') },
    { id: 2, title: t('careers.open.j2Title'), department: t('careers.open.j2Dept'), location: t('careers.open.j2Loc'), type: t('careers.open.j2Type') },
    { id: 3, title: t('careers.open.j3Title'), department: t('careers.open.j3Dept'), location: t('careers.open.j3Loc'), type: t('careers.open.j3Type') },
    { id: 4, title: t('careers.open.j4Title'), department: t('careers.open.j4Dept'), location: t('careers.open.j4Loc'), type: t('careers.open.j4Type') },
  ];

  return (
    <div className="py-10">
      <div className="text-center mb-16">
        <h2 className="font-bold text-heading mb-4 text-3xl">{t('careers.open.title')}</h2>
        <div className="w-16 h-1 bg-secondary mx-auto rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {jobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white p-8 rounded-2xl border border-border hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="text-secondary font-bold tracking-wider uppercase mb-2 text-sm">
                {job.department}
              </div>
              <h3 className="font-bold text-heading mb-4 group-hover:text-primary transition-colors text-2xl">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-body text-sm">
                <div className="flex items-center gap-1.5"><FiMapPin /> {job.location}</div>
                <div className="flex items-center gap-1.5"><FiClock /> {job.type}</div>
                <div className="flex items-center gap-1.5"><FiBriefcase /> {t('careers.open.minExp')}</div>
              </div>
            </div>
            <button className="bg-background hover:bg-primary text-body hover:text-white px-8 py-3 rounded-xl font-medium transition-colors whitespace-nowrap">
              {t('careers.open.apply')}
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-20 bg-white rounded-3xl p-10 md:p-16 border border-border shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto">
        <h3 className="font-bold text-heading mb-4 text-2xl">{t('careers.open.noFitTitle')}</h3>
        <p className="text-body mb-8 max-w-2xl mx-auto">
          {t('careers.open.noFitDesc')}
        </p>
        <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md">
          {t('careers.open.submit')}
        </button>
      </div>
    </div>
  );
}
