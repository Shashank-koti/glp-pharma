import { motion } from 'framer-motion';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Careers() {
  const { t } = useTranslation();

  const tabs = [
    { name: t('careers.tabs.open'), path: '/careers' },
    { name: t('careers.tabs.why'), path: '/careers/why-join-us' },
    { name: t('careers.tabs.life'), path: '/careers/life-at-glp' }
  ];

  return (
    <div className="min-h-screen">

      {/* Header Banner */}
      <div className="text-white pt-15 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-bold text-primary mb-4 text-4xl md:text-5xl">{t('careers.banner.title')}</h1>
            <p className="text-body leading-relaxed text-lg">
              {t('careers.banner.desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 ">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-border pb-4 max-w-4xl mx-auto">
          {tabs.map((tab, idx) => (
            <NavLink
              key={idx}
              to={tab.path}
              end={tab.path === '/careers'}
              className={({ isActive }) =>
                `px-6 py-3 rounded-t-xl font-bold transition-colors ${isActive
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-body hover:text-primary hover:bg-background'
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        {/* Tab Content via Outlet */}
        <Outlet />
      </div>
    </div>
  );
}
