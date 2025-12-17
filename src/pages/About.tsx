import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Our Story */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.ourStory.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.ourStory.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.ourStory.paragraph2')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.ourStory.paragraph3')}
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.ourMission.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.ourMission.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.ourMission.paragraph2')}
            </p>
          </div>

          {/* Our Values */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.ourValues.title')}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {t('about.ourValues.communityFirst.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.ourValues.communityFirst.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {t('about.ourValues.transparency.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.ourValues.transparency.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {t('about.ourValues.sustainability.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.ourValues.sustainability.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {t('about.ourValues.dignity.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.ourValues.dignity.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {t('about.ourValues.innovation.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('about.ourValues.innovation.description')}
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.howItWorks.title')}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t('about.howItWorks.step1.title')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.howItWorks.step1.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t('about.howItWorks.step2.title')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.howItWorks.step2.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t('about.howItWorks.step3.title')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.howItWorks.step3.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t('about.howItWorks.step4.title')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('about.howItWorks.step4.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Impact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.ourImpact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('about.ourImpact.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('about.ourImpact.paragraph2')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  1,000+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {t('about.ourImpact.itemsDonated')}
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  500+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {t('about.ourImpact.activeUsers')}
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  50+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {t('about.ourImpact.citiesCovered')}
                </div>
              </div>
            </div>
          </div>

          {/* The Team */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.theTeam.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.theTeam.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.theTeam.paragraph2')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.theTeam.paragraph3')}
            </p>
          </div>

          {/* Join Us */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('about.joinUs.title')}
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('about.joinUs.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-item" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center">
                {t('about.joinUs.startDonating')}
              </Link>
              <Link to="/search" className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border-2 border-white text-center">
                {t('about.joinUs.browseItems')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {t('about.contact.description')}
            </p>
            <div className="space-y-3">
              <p className="text-gray-800 dark:text-gray-200">
                <strong>{t('about.contact.email')}</strong> support@givea.shop
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>{t('about.contact.support')}</strong> support@givea.shop
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>{t('about.contact.location')}</strong> Rabat, Morocco
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-blue-100 text-sm">
              {t('about.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;