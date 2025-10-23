import { useEffect } from 'react';
import { Gift, MessageCircle, Bell, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from './lib/store';
import { useTranslation } from 'react-i18next';

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const navigate = useNavigate();
  const setDarkMode = useStore((state) => state.setDarkMode);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  const handleStartDonating = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-50 via-light to-light-50 dark:from-dark dark:via-dark-50 dark:to-dark transition-colors duration-300">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-light-900 dark:text-light-50 tracking-tight">
            {i18n.language === 'fr' ? (
              <>
                Connectez, Partagez,{' '}
                <span className="text-blue-800 dark:text-blue-300 font-black tracking-wide">
                  Faites la différence
                </span>
              </>
            ) : i18n.language === 'en' ? (
              <>
                Connect, Share,{' '}
                <span className="text-blue-800 dark:text-blue-300 font-black tracking-wide">
                  Make a Difference
                </span>
              </>
            ) : i18n.language === 'ar' ? (
              <>
                تواصل، شارك،{' '}
                <span className="text-blue-800 dark:text-blue-300 font-black tracking-wide">
                  أحدث فرقاً
                </span>
              </>
            ) : i18n.language === 'ur' ? (
              <>
                جڑیں، بانٹیں،{' '}
                <span className="text-blue-800 dark:text-blue-300 font-black tracking-wide">
                  فرق پیدا کریں
                </span>
              </>
            ) : (
              t('home.hero.title')
            )}
          </h1>
          <p className="mt-4 md:mt-6 max-w-md mx-auto text-base md:text-lg lg:text-xl text-light-600 dark:text-light-300 md:max-w-3xl">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-6 md:mt-8 max-w-md mx-auto flex flex-col sm:flex-row sm:justify-center gap-4">
            <button
              onClick={handleStartDonating}
              className="w-full sm:w-auto flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transform hover:-translate-y-0.5 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Gift className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              {t('home.hero.startDonating')}
            </button>
            <Link
              to="/search"
              className="w-full sm:w-auto flex items-center justify-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transform hover:-translate-y-0.5 bg-light-100 dark:bg-dark-100 text-light-800 dark:text-light-50 hover:bg-light-200 dark:hover:bg-dark-200 transition-all duration-300 border border-light-200 dark:border-dark-200 shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              {t('home.hero.browseItems')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: Gift,
                title: t('home.features.easyDonations.title'),
                description: t('home.features.easyDonations.description')
              },
              {
                icon: MessageCircle,
                title: t('home.features.directCommunication.title'),
                description: t('home.features.directCommunication.description')
              },
              {
                icon: Bell,
                title: t('home.features.smartNotifications.title'),
                description: t('home.features.smartNotifications.description')
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-lg">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-dark-200 dark:to-dark-300">
        <div className="max-w-7xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {t('home.cta.title')}
            </h2>
            <p className="mt-4 text-lg md:text-xl text-blue-100 dark:text-light-300">
              {t('home.cta.subtitle')}
            </p>
            <button
              onClick={handleStartDonating}
              className="mt-6 md:mt-8 inline-flex items-center px-8 md:px-10 py-4 md:py-5 border border-transparent text-lg md:text-xl font-bold rounded-2xl text-blue-600 dark:text-blue-400 bg-white dark:bg-dark-50 hover:bg-blue-50 dark:hover:bg-dark-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('home.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;