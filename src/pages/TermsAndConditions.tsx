import React from "react";
import { useTranslation } from "react-i18next";

const TermsAndConditions: React.FC = () => {
  const { t } = useTranslation('common');
  const lastUpdated = "November 13, 2025";

  return (
    <>
      <SEOHead
        title="Terms and Conditions - Givea"
        description="Read Givea's terms and conditions to understand the rules and guidelines for using our community donation platform."
        keywords="terms and conditions, terms of service, user agreement, givea terms"
        url="https://www.givea.shop/terms"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            {t('termsAndConditions.title')}
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            {t('termsAndConditions.lastUpdated')} {lastUpdated}
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            {t('termsAndConditions.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.acceptance.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.acceptance.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.acceptance.paragraph2')}
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.descriptionOfService.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.descriptionOfService.paragraph1')}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>{t('termsAndConditions.descriptionOfService.listItem1')}</li>
              <li>{t('termsAndConditions.descriptionOfService.listItem2')}</li>
              <li>{t('termsAndConditions.descriptionOfService.listItem3')}</li>
              <li>{t('termsAndConditions.descriptionOfService.listItem4')}</li>
              <li>{t('termsAndConditions.descriptionOfService.listItem5')}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.descriptionOfService.paragraph2')}
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.userAccounts.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.userAccounts.accountCreation.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.userAccounts.accountCreation.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.userAccounts.accountSecurity.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.userAccounts.accountSecurity.description')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.userAccounts.ageRequirement.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.userAccounts.ageRequirement.description')}
            </p>
          </section>

          {/* User Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.userConduct.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.userConduct.acceptableUse.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.userConduct.acceptableUse.paragraph1')}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem1')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem2')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem3')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem4')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem5')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem6')}</li>
              <li>{t('termsAndConditions.userConduct.acceptableUse.listItem7')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.userConduct.itemListings.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.userConduct.itemListings.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.userConduct.itemListings.paragraph2')}
            </p>
          </section>

          {/* Seed Reward System */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.seedRewardSystem.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.seedRewardSystem.paragraph1')}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>{t('termsAndConditions.seedRewardSystem.listItem1')}</li>
              <li>{t('termsAndConditions.seedRewardSystem.listItem2')}</li>
              <li>{t('termsAndConditions.seedRewardSystem.listItem3')}</li>
              <li>{t('termsAndConditions.seedRewardSystem.listItem4')}</li>
              <li>{t('termsAndConditions.seedRewardSystem.listItem5')}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.seedRewardSystem.paragraph2')}
            </p>
          </section>

          {/* Transactions and Disputes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.transactions.title')}
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.transactions.transactionResponsibility.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.transactions.transactionResponsibility.paragraph1')}
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>{t('termsAndConditions.transactions.transactionResponsibility.listItem1')}</li>
              <li>{t('termsAndConditions.transactions.transactionResponsibility.listItem2')}</li>
              <li>{t('termsAndConditions.transactions.transactionResponsibility.listItem3')}</li>
              <li>{t('termsAndConditions.transactions.transactionResponsibility.listItem4')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {t('termsAndConditions.transactions.disputeResolution.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.transactions.disputeResolution.description')}
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.intellectualProperty.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.intellectualProperty.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.intellectualProperty.paragraph2')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.limitationOfLiability.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.limitationOfLiability.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.limitationOfLiability.paragraph2')}
            </p>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.termination.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('termsAndConditions.termination.paragraph1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.termination.paragraph2')}
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.governingLaw.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.governingLaw.description')}
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('termsAndConditions.changesToTerms.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('termsAndConditions.changesToTerms.description')}
            </p>
          </section>

          {/* Footer Note */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              {t('termsAndConditions.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsAndConditions;

