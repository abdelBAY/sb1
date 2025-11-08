import React from "react";

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "November 8, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Privacy Policy
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            Last Updated: {lastUpdated}
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            At Givea, we're committed to protecting your privacy and ensuring transparency about how we handle your information. This policy explains our practices in detail.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to Givea. This Privacy Policy describes how Givea ("we," "our," or "us") collects, uses, shares, and protects your personal information when you use our platform. By accessing or using Givea, you agree to this Privacy Policy.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We operate a community-driven platform where users can donate items they no longer need to those who need them most. Your trust is essential to our mission, and we take your privacy seriously.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              2.1 Information You Provide
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you create an account, list items for donation, or communicate with other users, you provide us with information including your name, email address, phone number, profile photo, location, and any content you post such as item descriptions and photos.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We automatically collect certain information when you use Givea, including your IP address, browser type, device information, operating system, pages visited, time spent on pages, links clicked, and the referring URL. We use cookies and similar tracking technologies to collect this data.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              2.3 Location Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              With your permission, we collect precise location data to help match donors with nearby beneficiaries. You can control location permissions through your device settings at any time.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use the information we collect to provide and improve Givea's services, including facilitating donations between users, personalizing your experience, sending notifications about matching items and messages, preventing fraud and abuse, analyzing platform usage to improve functionality, and communicating with you about updates and features.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We do not sell your personal information to third parties. Your data is used solely to operate our platform and enhance your experience as part of our charitable community.
            </p>
          </section>

          {/* Information Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Information Sharing and Disclosure
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              4.1 With Other Users
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you list items for donation or request items, your profile information and item listings are visible to other Givea users. Direct communication features allow you to exchange messages with matched users to coordinate donations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              4.2 Service Providers
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We share information with trusted third-party service providers who help us operate our platform, such as hosting providers, analytics services, and communication tools. These providers are contractually obligated to protect your data and use it only for specified purposes.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              4.3 Legal Requirements
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may disclose your information if required by law, in response to valid legal processes, to protect the rights and safety of Givea and its users, or to prevent fraud and abuse of our platform.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption of data in transit and at rest, secure authentication mechanisms, regular security audits, and restricted access to personal data.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You have the right to access, update, or delete your personal information at any time through your account settings. You can opt out of promotional communications while still receiving essential service-related messages. You may disable cookies through your browser settings, though this may affect platform functionality. You can request a copy of your data or account deletion by contacting us.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For users in Morocco and the EU, you have additional rights under applicable data protection laws, including the right to data portability and the right to object to certain processing activities.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Givea is not intended for users under the age of 16. We do not knowingly collect personal information from children. If we discover that we have inadvertently collected data from a child, we will delete it promptly. Parents or guardians who believe their child has provided us with information should contact us immediately.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use cookies, web beacons, and similar technologies to enhance your experience, remember your preferences, understand how you use our platform, and analyze traffic patterns. You can control cookie preferences through your browser settings.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use essential cookies for platform functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings and choices.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Givea is based in Morocco. If you access our platform from outside Morocco, your information may be transferred to, stored, and processed in Morocco or other countries where our service providers operate. By using Givea, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting a notice on our platform or sending you an email. The "Last Updated" date at the top of this policy indicates when it was most recently revised. Your continued use of Givea after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>Email:</strong> privacy@givea.ma
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                <strong>Address:</strong> Givea Team, Rabat, Morocco
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Response Time:</strong> We aim to respond to all inquiries within 72 hours.
              </p>
            </div>
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

export default PrivacyPolicy;