import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, MessageCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import photoResourcesSection9Webp from "../assets/optimized/photo-ResourcesSection9.webp";
import photoResourcesSection9Fallback from "../assets/photo-ResourcesSection9.jpg";

const ResourcesSection: React.FC = () => {
  const { t } = useTranslation('common');
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Delay animations to allow text to appear first
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const resources = [
    {
      icon: MapPin,
      title: t('home.resources.findItems.title', 'Find Items Near You'),
      description: t('home.resources.findItems.description', 'Find the items available in your community.')
    },
    {
      icon: MessageCircle,
      title: t('home.resources.getHelp.title', 'Get Help & Support'),
      description: t('home.resources.getHelp.description', 'Connect with donors and get assistance with your requests.')
    },
    {
      icon: Search,
      title: t('home.resources.exploreMore.title', 'Explore More Resources'),
      description: t('home.resources.exploreMore.description', 'Discover more ways to give and receive in your community.')
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFE9DB] dark:bg-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
            whileInView={animationsEnabled ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            transition={animationsEnabled ? { duration: 0.3 } : { duration: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.resources.title', 'Find Items and Resources')}
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                {t('home.resources.subtitle', 'We are here to help you find items and support today.')}
              </p>
            </div>

            {/* Three Information Blocks */}
            <div className="space-y-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <motion.div
                    key={index}
                    initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    whileInView={animationsEnabled ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true }}
                    transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
                    className="flex items-start space-x-4"
                  >
                    {/* Orange Circular Icon */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 underline decoration-orange-500 decoration-2 underline-offset-4">
                        {resource.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, x: 40 } : { opacity: 1, x: 0 }}
            whileInView={animationsEnabled ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            transition={animationsEnabled ? { duration: 0.3 } : { duration: 0 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <picture>
                <source srcSet={photoResourcesSection9Webp} type="image/webp" />
                <img
                  src={photoResourcesSection9Fallback}
                  alt="Community support"
                  className="w-full h-full object-cover aspect-[3/4]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "/optimized/logo1.webp";
                  }}
                />
              </picture>
              {/* Quote Box Overlay */}
              <div className="absolute bottom-6 right-6 max-w-xs bg-green-700 dark:bg-green-800 p-6 rounded-lg shadow-xl">
                <p className="text-white text-lg leading-relaxed italic">
                  "{t('home.resources.quote', 'They\'re actually a lifeline. They\'ve really helped with items and supplies.')}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;

