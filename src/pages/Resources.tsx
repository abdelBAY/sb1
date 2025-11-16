import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, HelpCircle, Shield, Mail, ExternalLink } from "lucide-react";

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Resources
          </h1>
          <p className="text-blue-100 text-center text-lg mb-2">
            Helpful guides, documentation, and support resources
          </p>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            Everything you need to make the most of Givea and connect with our community.
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
                Getting Started
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Donate Items
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Learn how to list items for donation, set up pickup instructions, and connect with recipients in your community.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How to Request Items
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Discover how to browse available items, send requests to donors, and coordinate pickups safely.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Understanding Seeds
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Get familiar with our seed reward system: how to earn seeds, how to use them, and how they help grow our community.
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
                Legal & Policies
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
                    Terms & Conditions
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
                    Privacy Policy
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
                Support & Help
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
                      Contact Us
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Get in touch with our support team
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                  Find answers to common questions about using Givea, managing your account, and participating in the community.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• How do I update my profile information?</li>
                  <li>• What items can I donate on Givea?</li>
                  <li>• How do I report inappropriate content?</li>
                  <li>• Can I cancel a donation request?</li>
                  <li>• How are seeds calculated and awarded?</li>
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
                Community Guidelines
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Provide accurate descriptions and photos of items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Respond promptly to messages and requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Be respectful and courteous in all communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Coordinate safe and convenient pickup locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                    <span>Update item status promptly after completion</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>Meet in public places for item exchanges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>Inspect items before accepting them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>Trust your instincts and report suspicious behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 mt-1">⚠</span>
                    <span>Never share personal financial information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-8">
            <p className="text-blue-100 text-sm">
              Need more help? <Link to="/contact" className="underline hover:text-white">Contact our support team</Link>
            </p>
            <p className="text-blue-200 text-xs mt-2">
              Made with ❤️ in Morocco by the Givea team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;

