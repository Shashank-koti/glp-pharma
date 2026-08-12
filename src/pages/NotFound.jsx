import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="font-bold text-primary mb-4 text-9xl">404</h1>
        <h2 className="font-bold text-heading mb-4 text-3xl">{t('notFound.title')}</h2>
        <p className="text-body mb-8">
          {t('notFound.desc')}
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
        >
          {t('notFound.return')}
        </Link>
      </div>
    </div>
  );
}
