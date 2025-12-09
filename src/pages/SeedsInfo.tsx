import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sprout, Gift, MessageCircle, Info } from 'lucide-react';
import seed1Img from '../assets/seed1.png';
import seedImg from '../assets/seed.png';
import sproutImg from '../assets/sprout.png';

const SeedsInfo: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('seedsInfo.back', 'Back')}</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={sproutImg}
                alt="Seed"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {t('seedsInfo.title', 'Seed Reward System')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('seedsInfo.subtitle', 'Learn how seeds work and how to earn more')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('seedsInfo.whatAreSeeds.title', 'What are Seeds?')}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {t('seedsInfo.whatAreSeeds.description', 'Seeds are Givea\'s reward currency that encourages community participation and helps maintain a healthy giving ecosystem. They represent your contribution to the community and enable you to connect with other members.')}
                </p>
              </div>
            </div>
          </section>

          {/* How Seeds Work */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              {t('seedsInfo.howItWorks.title', 'How Seeds Work')}
            </h2>
            
            <div className="space-y-6">
              {/* Earning Seeds */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-200 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  {t('seedsInfo.earning.title', 'Earning Seeds')}
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">•</span>
                    <span>
                      <strong>{t('seedsInfo.earning.welcomeBonus', 'Welcome Bonus:')}</strong>{' '}
                      {t('seedsInfo.earning.welcomeBonusDesc', 'New users receive 10 free seeds when they register')}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">•</span>
                    <span>
                      <strong>{t('seedsInfo.earning.donationReward', 'Donation Reward:')}</strong>{' '}
                      {t('seedsInfo.earning.donationRewardDesc', 'Earn +2 seeds when you successfully complete a donation')}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Spending Seeds */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-100 dark:border-orange-800">
                <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-200 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t('seedsInfo.spending.title', 'Spending Seeds')}
                </h3>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-600 dark:text-orange-400 font-bold mt-1">•</span>
                    <span>
                      <strong>{t('seedsInfo.spending.contact', 'Contacting Users:')}</strong>{' '}
                      {t('seedsInfo.spending.contactDesc', '1 seed is deducted when you send your first message to another user')}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-600 dark:text-orange-400 font-bold mt-1">•</span>
                    <span>
                      <strong>{t('seedsInfo.spending.request', 'Requesting Items:')}</strong>{' '}
                      {t('seedsInfo.spending.requestDesc', '1 seed is deducted when you request an item from a donor')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seed Balance Indicators */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('seedsInfo.balanceIndicators.title', 'Understanding Your Seed Balance')}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <img src={seed1Img} alt="Low seeds" className="w-10 h-10 object-contain" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('seedsInfo.balanceIndicators.low.title', 'Low (0-3 seeds)')}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('seedsInfo.balanceIndicators.low.description', 'You\'re running low on seeds. Consider donating items to earn more!')}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <img src={seedImg} alt="Medium seeds" className="w-10 h-10 object-contain" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('seedsInfo.balanceIndicators.medium.title', 'Medium (4-10 seeds)')}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('seedsInfo.balanceIndicators.medium.description', 'You have a moderate seed balance. Keep participating to maintain it!')}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <img src={sproutImg} alt="High seeds" className="w-10 h-10 object-contain" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('seedsInfo.balanceIndicators.high.title', 'High (11+ seeds)')}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('seedsInfo.balanceIndicators.high.description', 'Great! You have plenty of seeds. Keep up the good work!')}
                </p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('seedsInfo.importantNotes.title', 'Important Notes')}
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                  <span>
                    {t('seedsInfo.importantNotes.noValue', 'Seeds have no monetary value and cannot be transferred, sold, or exchanged')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                  <span>
                    {t('seedsInfo.importantNotes.noManipulation', 'Attempting to manipulate or exploit the seed system is strictly prohibited and may result in account suspension')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                  <span>
                    {t('seedsInfo.importantNotes.adjustments', 'Givea reserves the right to adjust seed balances in cases of abuse or system errors')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-1">•</span>
                  <span>
                    {t('seedsInfo.importantNotes.purpose', 'The seed system is designed to encourage genuine community participation and maintain a healthy giving ecosystem')}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('seedsInfo.tips.title', 'Tips for Managing Your Seeds')}
            </h2>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓</span>
                  <span>
                    {t('seedsInfo.tips.donate', 'Donate items regularly to earn seeds and help others in your community')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓</span>
                  <span>
                    {t('seedsInfo.tips.useWisely', 'Use seeds wisely - only contact users or request items you\'re genuinely interested in')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓</span>
                  <span>
                    {t('seedsInfo.tips.completeDonations', 'Complete your donations successfully to earn reward seeds')}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">✓</span>
                  <span>
                    {t('seedsInfo.tips.checkBalance', 'Keep an eye on your seed balance - it\'s displayed in your navigation bar')}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer Note */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              {t('seedsInfo.footer', 'Made with ❤️ by the Givea team')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedsInfo;

