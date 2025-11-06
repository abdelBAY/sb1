import React from "react";
import heroImg from "../assets/givea-image2.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');

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
          {t('home.hero.titlePart1', 'Connect, Share,')}{" "}
          <span className="text-orange-400">{t('home.hero.titlePart2', 'Make a Difference')}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-10">
          {t('home.hero.subtitle', 'Join our community where giving meets receiving. Make a positive impact by sharing what you no longer need with those who need it most.')}
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

      {/* Hero Image */}
      <motion.div
        className="relative z-10 px-6 w-full max-w-6xl mx-auto mt-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
          <img
            src={heroImg}
            alt="Room preview captured on phone"
            className="w-full h-full object-cover aspect-[16/9] md:aspect-[21/9]"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/logo1.png"; // fallback so the section never appears empty
            }}
          />
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
