import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, FileText, HelpCircle, Shield, Mail, ExternalLink } from "lucide-react";
import SEOHead from "../components/SEOHead";

const Resources: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <>
      <SEOHead
        title="Resources - Givea"
        description="Helpful resources, guides, and information for using Givea. Learn how to donate, request items, stay safe, and make the most of our community donation platform."
        keywords="givea resources, donation guides, how to donate, community giving, help, tutorials"
        url="https://www.givea.shop/resources"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            {t('resources.title')}
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            {t('resources.subtitle')}
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            {t('resources.description')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Getting Started */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('resources.gettingStarted.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('resources.gettingStarted.donateItems.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('resources.gettingStarted.donateItems.description')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('resources.gettingStarted.requestItems.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('resources.gettingStarted.requestItems.description')}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('resources.gettingStarted.understandingSeeds.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t('resources.gettingStarted.understandingSeeds.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Legal & Policies */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('resources.legalPolicies.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <Link
                to="/terms"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('resources.legalPolicies.terms')}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              <Link
                to="/privacy"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('resources.legalPolicies.privacy')}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            </div>
          </div>

          {/* Support & Help */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('resources.supportHelp.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <Link
                to="/contact"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white block">
                      {t('resources.supportHelp.contactUs.title')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('resources.supportHelp.contactUs.description')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t('resources.supportHelp.faq.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                  {t('resources.supportHelp.faq.description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• {t('resources.supportHelp.faq.updateProfile')}</li>
                  <li>• {t('resources.supportHelp.faq.whatItems')}</li>
                  <li>• {t('resources.supportHelp.faq.reportContent')}</li>
                  <li>• {t('resources.supportHelp.faq.cancelRequest')}</li>
                  <li>• {t('resources.supportHelp.faq.seedsCalculated')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('resources.communityGuidelines.title')}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('resources.communityGuidelines.bestPractices.title')}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>{t('resources.communityGuidelines.bestPractices.accurateDescriptions')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>{t('resources.communityGuidelines.bestPractices.respondPromptly')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>{t('resources.communityGuidelines.bestPractices.beRespectful')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>{t('resources.communityGuidelines.bestPractices.safeLocations')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>{t('resources.communityGuidelines.bestPractices.updateStatus')}</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('resources.communityGuidelines.safetyTips.title')}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>{t('resources.communityGuidelines.safetyTips.publicPlaces')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>{t('resources.communityGuidelines.safetyTips.inspectItems')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>{t('resources.communityGuidelines.safetyTips.trustInstincts')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>{t('resources.communityGuidelines.safetyTips.noFinancialInfo')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-8">
            <p className="text-blue-100 text-sm">
              {t('resources.footer.needHelp')} <Link to="/contact" className="underline hover:text-white">{t('resources.footer.contactSupport')}</Link>
            </p>
            <p className="text-blue-200 text-xs mt-2">
              {t('resources.footer.madeWith')}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Resources;

