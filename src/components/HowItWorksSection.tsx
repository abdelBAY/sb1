import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import giveaHowItWorksVideo from "../assets/givea-how-it-works.mp4";

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation('common');
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  
  const steps = [
    {
      title: t('home.howItWorks.steps.list.title', 'List'),
      description: t('home.howItWorks.steps.list.description', 'Items are listed on the Givea marketplace. Alert emails are sent to all members who have registered and signed up to receive alerts.')
    },
    {
      title: t('home.howItWorks.steps.chat.title', 'Chat'),
      description: t('home.howItWorks.steps.chat.description', 'Items are usually requested within 12-24 hours. The listing member chooses who the items go to. The members chat and agree on a collection date and time.')
    },
    {
      title: t('home.howItWorks.steps.collect.title', 'Collect'),
      description: t('home.howItWorks.steps.collect.description', 'Items are collected by requesting members. Members fill out a feedback form. The information is used to create case studies and collect ESG data.')
    }
  ];

  // Handle user pause/play interactions
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => {
      setUserPaused(true);
    };

    const handlePlay = () => {
      setUserPaused(false);
    };

    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
    };
  }, []);

  // Handle auto-play when section is in view
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only auto-play if user hasn't manually paused
            if (!userPaused && video.paused) {
              video.play().catch((error) => {
                // Handle autoplay restrictions (some browsers require user interaction)
                console.log("Autoplay prevented:", error);
              });
            }
          } else {
            // Pause video when section is out of view (unless user is controlling it)
            if (!userPaused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [userPaused]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0">
        {/* Teal-blue top-left */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-500 dark:from-teal-600 dark:via-cyan-700 dark:to-teal-800"></div>
        {/* White bottom-right diagonal overlay */}
        <div className="absolute bottom-0 right-0 w-full h-full bg-white dark:bg-gray-900" style={{
          clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto"
                controls
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src={giveaHowItWorksVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Right Column - How It Works Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Light Blue Rounded Panel */}
            <div className="bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl p-8 md:p-10 shadow-xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                {t('home.howItWorks.title', 'How It Works')}
              </h2>

              {/* Three Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

