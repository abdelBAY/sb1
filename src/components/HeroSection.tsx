import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center min-h-screen 
      bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 
      dark:from-blue-800 dark:via-blue-700 dark:to-blue-900 
      text-white overflow-hidden transition-colors duration-500 pt-20"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-80 animate-gradient-x"></div>

      <motion.div
        className="relative z-10 px-6 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
          {t("home.hero.title")}
        </h1>

        <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-10">
          {t("home.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-full 
              shadow-lg hover:bg-blue-50 dark:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300"
          >
            {t("home.hero.startDonating")}
          </motion.a>
          
          <motion.a
            href="/search"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-full 
              hover:bg-white hover:text-blue-700 transition-all duration-300"
          >
            {t("home.hero.browseItems")}
          </motion.a>
        </div>
      </motion.div>

      {/* Animated gradient style */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background: linear-gradient(-45deg, #2563EB, #3B82F6, #1E40AF, #60A5FA);
          background-size: 300% 300%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
