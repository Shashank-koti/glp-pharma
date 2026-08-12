import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Gallery() {
  const { t } = useTranslation();
  
  const links = [
    { name: t('gallery.tabs.all'), path: '/gallery' },
    { name: t('gallery.tabs.manufacturing'), path: '/gallery/manufacturing' },
    { name: t('gallery.tabs.research'), path: '/gallery/research' },
    { name: t('gallery.tabs.quality'), path: '/gallery/quality' },
    { name: t('gallery.tabs.corporate'), path: '/gallery/corporate' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              end={link.path === '/gallery'}
              className={({ isActive }) =>
                `px-6 py-2 rounded-full font-medium transition-colors ${isActive
                  ? 'bg-primary text-white'
                  : 'bg-white text-body border border-border hover:bg-background'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Gallery Grid via Outlet */}
        <Outlet />
      </div>
    </div>
  );
}
