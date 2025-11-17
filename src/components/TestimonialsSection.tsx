import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  rating: number;
  review: string;
  gradient?: boolean;
}

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation('common');

  const testimonials: Testimonial[] = [
    {
      name: t('home.testimonials.cards.sarah.name', 'Sarah Johnson'),
      rating: 5,
      review: t('home.testimonials.cards.sarah.review', "I've tried other donation platforms, both free and paid, and this app is the only one that I would recommend 10 out of 10 times. The community is amazing!"),
    },
    {
      name: t('home.testimonials.cards.michael.name', 'Michael Chen'),
      rating: 5,
      review: t('home.testimonials.cards.michael.review', "10 years ago, I struggled to find ways to donate items. This platform has made it so easy and efficient. Can't recommend enough!"),
    },
    {
      name: t('home.testimonials.cards.emma.name', 'Emma Rodriguez'),
      rating: 5,
      review: t('home.testimonials.cards.emma.review', "Incredible platform. Professionally speaking it's life-saving. The direct communication feature makes coordinating donations seamless."),
      gradient: true,
    },
    {
      name: t('home.testimonials.cards.david.name', 'David Thompson'),
      rating: 5,
      review: t('home.testimonials.cards.david.review', "This app has become integral to my workflow and it keeps getting better and better. The seed rewards system is a great incentive!"),
    },
    {
      name: t('home.testimonials.cards.lisa.name', 'Lisa Anderson'),
      rating: 5,
      review: t('home.testimonials.cards.lisa.review', "I run a small charity shop and some of the items I've received through this platform have been perfect for our community needs."),
    },
    {
      name: t('home.testimonials.cards.james.name', 'James Wilson'),
      rating: 5,
      review: t('home.testimonials.cards.james.review', "Brilliant digital solution, it's great to see technology being used for such a meaningful cause. The user experience is excellent!"),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Headline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                {t('home.testimonials.itemsCount', '10,000+')}
              </span>{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                {t('home.testimonials.items', 'items')}
              </span>{' '}
              <span className="text-purple-400">{t('home.testimonials.shared', 'shared')}</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              {t('home.testimonials.subtitle', '10,000+ people love us')}
            </p>
          </motion.div>

          {/* Right Column - Testimonials Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`rounded-2xl p-6 shadow-xl ${
                  testimonial.gradient
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                    : 'bg-gray-800 dark:bg-gray-800 text-white'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          testimonial.gradient
                            ? 'text-white fill-white'
                            : 'text-yellow-400 fill-yellow-400'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm md:text-base leading-relaxed">
                    {testimonial.review}
                  </p>
                  <p className="text-sm md:text-base font-semibold opacity-90">
                    {testimonial.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

