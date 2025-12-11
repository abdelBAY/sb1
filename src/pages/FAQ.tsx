import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link, useNavigate } from "react-router-dom";

const FAQ: React.FC = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a hash in the URL (anchor link)
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      setOpenSection(sectionId);
      // Scroll to the section after a short delay to ensure it's rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const faqSections = [
    {
      id: 'create-listing',
      titleKey: 'faq.createListing.title',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      id: 'security-tips',
      titleKey: 'faq.securityTips.title',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: 'matching-works',
      titleKey: 'faq.matchingWorks.title',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'guidelines',
      titleKey: 'faq.guidelines.title',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Quick Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('faq.quickNavigation')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faqSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setOpenSection(section.id);
                    navigate(`/faq#${section.id}`, { replace: true });
                    setTimeout(() => {
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400 text-left w-full"
                >
                  {section.icon}
                  <span className="font-medium">{t(section.titleKey)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Sections */}
          {faqSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-left">
                    {t(section.titleKey)}
                  </h2>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {(openSection === section.id || location.hash === `#${section.id}`) && (
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      {section.id === 'create-listing' && (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                          <p className="leading-relaxed">{t('faq.createListing.intro')}</p>
                          
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                              {t('faq.createListing.step1.title')}
                            </h3>
                            <p className="leading-relaxed">{t('faq.createListing.step1.description')}</p>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                              {t('faq.createListing.step2.title')}
                            </h3>
                            <p className="leading-relaxed">{t('faq.createListing.step2.description')}</p>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                              {t('faq.createListing.step3.title')}
                            </h3>
                            <p className="leading-relaxed">{t('faq.createListing.step3.description')}</p>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                              {t('faq.createListing.step4.title')}
                            </h3>
                            <p className="leading-relaxed">{t('faq.createListing.step4.description')}</p>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                              {t('faq.createListing.step5.title')}
                            </h3>
                            <p className="leading-relaxed">{t('faq.createListing.step5.description')}</p>
                          </div>

                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>{t('faq.createListing.tip.title')}</strong> {t('faq.createListing.tip.description')}
                            </p>
                          </div>
                        </div>
                      )}

                      {section.id === 'security-tips' && (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                          <p className="leading-relaxed">{t('faq.securityTips.intro')}</p>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.securityTips.password.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.securityTips.password.description')}</p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.securityTips.twoFactor.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.securityTips.twoFactor.description')}</p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.securityTips.personalInfo.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.securityTips.personalInfo.description')}</p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.securityTips.suspiciousActivity.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.securityTips.suspiciousActivity.description')}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'matching-works' && (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                          <p className="leading-relaxed">{t('faq.matchingWorks.intro')}</p>
                          
                          <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {t('faq.matchingWorks.step1.title')}
                                </h3>
                                <p className="leading-relaxed">{t('faq.matchingWorks.step1.description')}</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                2
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {t('faq.matchingWorks.step2.title')}
                                </h3>
                                <p className="leading-relaxed">{t('faq.matchingWorks.step2.description')}</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                3
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {t('faq.matchingWorks.step3.title')}
                                </h3>
                                <p className="leading-relaxed">{t('faq.matchingWorks.step3.description')}</p>
                              </div>
                            </div>

                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                4
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                  {t('faq.matchingWorks.step4.title')}
                                </h3>
                                <p className="leading-relaxed">{t('faq.matchingWorks.step4.description')}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>{t('faq.matchingWorks.benefit.title')}</strong> {t('faq.matchingWorks.benefit.description')}
                            </p>
                          </div>
                        </div>
                      )}

                      {section.id === 'guidelines' && (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                          <p className="leading-relaxed">{t('faq.guidelines.intro')}</p>
                          
                          <div className="space-y-4">
                            <div className="p-4 border-l-4 border-blue-600 dark:border-blue-400">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.guidelines.respect.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.guidelines.respect.description')}</p>
                            </div>

                            <div className="p-4 border-l-4 border-green-600 dark:border-green-400">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.guidelines.honesty.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.guidelines.honesty.description')}</p>
                            </div>

                            <div className="p-4 border-l-4 border-yellow-600 dark:border-yellow-400">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.guidelines.safety.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.guidelines.safety.description')}</p>
                            </div>

                            <div className="p-4 border-l-4 border-purple-600 dark:border-purple-400">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.guidelines.communication.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.guidelines.communication.description')}</p>
                            </div>

                            <div className="p-4 border-l-4 border-red-600 dark:border-red-400">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('faq.guidelines.prohibited.title')}
                              </h3>
                              <p className="leading-relaxed">{t('faq.guidelines.prohibited.description')}</p>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              <strong>{t('faq.guidelines.violation.title')}</strong> {t('faq.guidelines.violation.description')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Back to Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('faq.needMoreHelp')}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {t('faq.contactUs')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

