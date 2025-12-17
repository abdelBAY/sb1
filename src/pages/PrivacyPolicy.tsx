import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation('common');
  const lastUpdated = "November 8, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            {t('privacyPolicy.lastUpdated')} {lastUpdated}
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            {t('privacyPolicy.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.introduction.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.introduction.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.introduction.paragraph2')}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.informationWeCollect.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationWeCollect.youProvide.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.informationWeCollect.youProvide.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationWeCollect.automaticallyCollected.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.informationWeCollect.automaticallyCollected.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationWeCollect.locationInformation.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.informationWeCollect.locationInformation.description')}
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.howWeUse.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.howWeUse.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.howWeUse.paragraph2')}
            </p>
          </section>

          {/* Information Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.informationSharing.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationSharing.withOtherUsers.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.informationSharing.withOtherUsers.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationSharing.serviceProviders.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.informationSharing.serviceProviders.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('privacyPolicy.informationSharing.legalRequirements.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.informationSharing.legalRequirements.description')}
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.dataSecurity.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.dataSecurity.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.dataSecurity.paragraph2')}
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.yourRights.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.yourRights.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.yourRights.paragraph2')}
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.childrensPrivacy.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.childrensPrivacy.description')}
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.cookies.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.cookies.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.cookies.paragraph2')}
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.internationalTransfers.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.internationalTransfers.description')}
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.changesToPolicy.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('privacyPolicy.changesToPolicy.description')}
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('privacyPolicy.contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacyPolicy.contact.description')}
            </p>
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>{t('privacyPolicy.contact.email')}</strong> support@givea.shop
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>{t('privacyPolicy.contact.address')}</strong> Givea Team, Rabat, Morocco
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>{t('privacyPolicy.contact.responseTime')}</strong> {t('privacyPolicy.contact.responseTimeValue')}
              </p>
            </div>
          </section>

          {/* Footer Note */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              {t('privacyPolicy.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;