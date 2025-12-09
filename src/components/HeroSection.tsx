import React from "react";
import heroImgWebp from "../assets/optimized/givea-image2.webp";
import heroImgFallback from "../assets/givea-image2.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <section
      className="relative flex items-center justify-center min-h-screen 
      overflow-hidden transition-colors duration-500 pt-20"
    >
      {/* Hero Image as Background */}
      <div className="absolute inset-0 w-full h-full">
        <picture>
          <source srcSet={heroImgWebp} type="image/webp" />
          <img
            src={heroImgFallback}
            alt="Community helping"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/optimized/logo1.webp";
            }}
          />
        </picture>
        {/* Darkened overlay for text readability - only on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Text Overlay on Left Side */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-lg">
              {t('home.hero.titlePart1', 'Connect, Share,')}{" "}
              <span className="text-orange-400">{t('home.hero.titlePart2', 'Make a Difference')}</span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow-md">
              {t('home.hero.subtitle', 'Join our community where giving meets receiving. Make a positive impact by sharing what you no longer need with those who need it most.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-full 
                  shadow-lg hover:bg-blue-50 transition-all duration-300 border-2 border-white"
              >
                {t("home.hero.startDonating")}
              </motion.a>
              
              <motion.a
                href="/search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-full 
                  hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                {t("home.hero.browseItems")}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
