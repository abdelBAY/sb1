import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Givea
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            We're building a community where giving meets receiving. A platform that transforms unused items into meaningful impact, connecting generous hearts with those who need support most.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Our Story */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Givea was born from a simple observation: countless people have items they no longer need, while others desperately search for those same items. We saw furniture left on sidewalks, clothes piling up in closets, and electronics gathering dust—all while families struggled to afford basic necessities.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              In 2025, we decided to bridge this gap. Starting in Morocco, we created a platform that makes giving as easy as posting a photo and receiving as simple as sending a message. No complicated processes, no barriers—just human connection and generosity.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Today, Givea is more than a platform. It's a movement of people who believe in the power of community, the value of sustainability, and the joy of helping others. Every donation tells a story, and we're honored to facilitate thousands of these stories every day.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We exist to make generosity accessible and impactful. Our mission is to create a world where resources flow freely to those who need them, where nothing useful goes to waste, and where communities grow stronger through acts of kindness.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe that technology should serve humanity's best instincts. That's why we've built Givea to be intuitive, secure, and focused entirely on facilitating meaningful connections between donors and beneficiaries. We're not here to profit from charity—we're here to amplify it.
            </p>
          </div>

          {/* Our Values */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Values
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Community First
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Every decision we make prioritizes the people who use Givea. We listen to your feedback, adapt to your needs, and build features that genuinely serve our community. You're not users to us—you're partners in creating positive change.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Transparency & Trust
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We operate with complete openness. Your data is yours, your privacy is sacred, and our practices are clear. We build trust not through marketing promises but through consistent, honest action. No hidden agendas, no data selling, no compromises on integrity.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Sustainability
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Every item donated through Givea is one less item in a landfill. We're committed to environmental responsibility through circular economy principles. By extending the life of products and reducing waste, we're contributing to a healthier planet for everyone.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Dignity in Giving and Receiving
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We've designed Givea to preserve dignity on both sides of every transaction. Donors give with generosity, not pity. Recipients receive with gratitude, not shame. Our platform facilitates peer-to-peer connections that recognize the humanity in everyone.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Innovation for Good
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Technology should solve real problems. We continuously innovate to make giving easier, matching smarter, and connections more meaningful. From smart notifications to location-based matching, every feature we build serves our mission of maximizing impact.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Create Your Listing
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Donors snap a photo of items they want to give away, add a quick description, and post. It takes less than 2 minutes. No complicated forms, no verification hassles.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Smart Matching
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our system notifies nearby users who might need these items. Recipients can browse available donations, filter by category and location, and find exactly what they're looking for.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Direct Communication
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Once matched, donors and recipients chat directly through our secure messaging system to coordinate pickup times, locations, and any other details. Simple, direct, personal.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Make the Connection
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Items change hands, lives get a little better, and nothing useful goes to waste. That's the Givea way—straightforward, impactful, and deeply human.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Impact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Impact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Since launching, Givea has facilitated thousands of successful donations across Morocco. We've helped families furnish their homes, students get school supplies, and communities reduce waste. But numbers only tell part of the story.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              The real impact is in the connections made, the gratitude expressed, and the culture of generosity we're building together. Every time someone chooses to give through Givea instead of throwing something away, they're voting for a more compassionate, sustainable world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  10,000+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  Items Donated
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  5,000+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  Active Users
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  50+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  Cities Covered
                </div>
              </div>
            </div>
          </div>

          {/* The Team */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              The Team
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Givea is built by a small, passionate team based in Morocco who believe technology can be a force for good. We're developers, designers, and community builders united by a shared vision: making generosity effortless and impact measurable.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We're not venture-backed, we're not chasing explosive growth, and we're not building features for investors. We're building for you—the donors who want to make a difference and the recipients who need support. Every line of code we write serves that mission.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We work closely with our community, respond to feedback quickly, and continuously improve Givea based on real user needs. This isn't just our platform—it's ours together.
            </p>
          </div>

          {/* Join Us */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Whether you have items to give or needs to fulfill, Givea is here for you. Join thousands of others who are already making their communities better, one donation at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Start Donating
              </button>
              <button className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border-2 border-white">
                Browse Items
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              We love hearing from our community. Whether you have questions, suggestions, partnership ideas, or just want to share your Givea story, we're all ears.
            </p>
            <div className="space-y-3">
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Email:</strong> hello@givea.ma
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Support:</strong> support@givea.ma
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Location:</strong> Rabat, Morocco
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-blue-100 text-sm">
              Made with ❤️ in Morocco by the Givea team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;