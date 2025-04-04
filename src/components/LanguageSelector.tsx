import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  dir?: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ur', name: 'اردو', dir: 'rtl' }
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobile?: boolean;
}

export default function LanguageSelector({ isOpen, onToggle, onClose, isMobile = false }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleLanguageChange = async (lang: Language) => {
    // Update document direction based on language
    document.documentElement.dir = lang.dir || 'ltr';
    // Change language
    await i18n.changeLanguage(lang.code);
    onClose();
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1];

  if (isMobile) {
    return (
      <div className="px-3 py-2">
        <button
          onClick={onToggle}
          className="w-full text-left flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <span>{currentLanguage.name}</span>
          <ChevronRight className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {isOpen && (
          <div className="mt-2 space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`w-full text-left px-4 py-2 text-sm ${
                  i18n.language === lang.code
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200"
      >
        <span>{currentLanguage.name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out scale-100 opacity-100 z-50">
          <div className="py-1" role="menu">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`block w-full text-left px-4 py-3 text-sm ${
                  i18n.language === lang.code
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
                } transition-colors duration-200`}
                role="menuitem"
                onClick={() => handleLanguageChange(lang)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}