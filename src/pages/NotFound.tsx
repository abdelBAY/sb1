import { useRouteError, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation('common');
  const error: any = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">{t('notFound.title')}</h1>
      <h2 className="text-2xl font-semibold mb-2">{t('notFound.heading')}</h2>
      <p className="text-gray-600 mb-6">
        {error?.statusText || t('notFound.message')}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-3 px-5 py-2.5 text-white font-semibold uppercase tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 transition"
      >
        {t('notFound.goHome')}
      </Link>
    </div>
  );
}
