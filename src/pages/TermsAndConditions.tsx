import React from "react";

const TermsAndConditions: React.FC = () => {
  const lastUpdated = "November 13, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Terms & Conditions
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            Last Updated: {lastUpdated}
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            Please read these Terms and Conditions carefully before using Givea. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to Givea. These Terms and Conditions ("Terms") govern your access to and use of the Givea platform, including our website, mobile applications, and services (collectively, the "Service"). By accessing or using Givea, you agree to comply with and be bound by these Terms.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you do not agree to these Terms, please do not use our Service. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Givea is a community-driven platform that facilitates the donation of items between users. Our Service allows users to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>List items they wish to donate</li>
              <li>Browse and request items available for donation</li>
              <li>Communicate with other users to coordinate donations</li>
              <li>Track their donation and adoption history</li>
              <li>Earn and use seeds as part of our reward system</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Givea acts solely as an intermediary platform. We do not take ownership of items, guarantee the condition or quality of items, or assume responsibility for transactions between users.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. User Accounts and Registration
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              3.1 Account Creation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              To use certain features of Givea, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              3.2 Account Security
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              3.3 Age Requirement
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You must be at least 16 years old to use Givea. By using our Service, you represent and warrant that you meet this age requirement.
            </p>
          </section>

          {/* User Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. User Conduct and Responsibilities
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              4.1 Acceptable Use
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You agree to use Givea only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>List items that are illegal, stolen, or prohibited</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the Service for commercial purposes without authorization</li>
              <li>Attempt to manipulate the seed reward system</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              4.2 Item Listings
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When listing items for donation, you agree to provide accurate descriptions, including the condition of items. You are responsible for ensuring that items are safe, legal to transfer, and accurately represented in your listings.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You retain ownership of items until they are successfully transferred to a recipient. Givea does not take ownership of any items listed on the platform.
            </p>
          </section>

          {/* Seed Reward System */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Seed Reward System
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Givea operates a seed-based reward system to encourage community participation:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>New users receive 10 free seeds upon registration</li>
              <li>Seeds are deducted when you contact other users or request items (1 seed per action)</li>
              <li>Seeds are awarded when you successfully complete donations (+2 seeds)</li>
              <li>Seeds have no monetary value and cannot be transferred, sold, or exchanged</li>
              <li>Givea reserves the right to adjust seed balances in cases of abuse or system errors</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Attempting to manipulate, hack, or exploit the seed system is strictly prohibited and may result in account suspension or termination.
            </p>
          </section>

          {/* Transactions and Disputes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Transactions and Disputes
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              6.1 Transaction Responsibility
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              All transactions are conducted directly between users. Givea is not a party to any transaction and does not guarantee the quality, safety, or legality of items. Users are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed mb-4 space-y-2 ml-4">
              <li>Verifying the condition and suitability of items</li>
              <li>Coordinating pickup or delivery arrangements</li>
              <li>Ensuring safe and legal transfer of items</li>
              <li>Resolving disputes between parties</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              6.2 Dispute Resolution
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In the event of a dispute between users, Givea may provide assistance in facilitating communication, but we are not obligated to resolve disputes or provide refunds. Users are encouraged to resolve issues amicably and in good faith.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The Givea platform, including its design, logos, text, graphics, and software, is owned by Givea and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By posting content on Givea, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform. You retain ownership of your content and can remove it at any time.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, GIVEA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Givea provides the Service "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You may terminate your account at any time by contacting us or using account deletion features. We reserve the right to suspend or terminate your account immediately, without prior notice, if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Upon termination, your right to use the Service will cease immediately. We may delete your account information and content, subject to our Privacy Policy and applicable data retention requirements.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Morocco, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of Givea shall be subject to the exclusive jurisdiction of the courts of Rabat, Morocco.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting a notice on our platform or sending an email notification. Your continued use of Givea after changes become effective constitutes acceptance of the updated Terms. The "Last Updated" date at the top of this page indicates when these Terms were most recently revised.
            </p>
          </section>

          {/* Footer Note */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-10">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              Made with ❤️ in Morocco by the Givea team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

