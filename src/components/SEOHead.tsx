import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

/**
 * SEOHead Component - Dynamically updates meta tags for SEO
 * 
 * This component should be used in each page component to set unique
 * meta tags for better SEO. It updates the document head dynamically.
 * 
 * @example
 * <SEOHead
 *   title="Product Name - Givea"
 *   description="Donate this item to help others in your community"
 *   image="/product-image.jpg"
 *   url="https://www.givea.shop/product/123"
 * />
 */
export default function SEOHead({
  title,
  description,
  keywords,
  image = 'https://www.givea.shop/logo1.png',
  url,
  type = 'website',
  noindex = false,
}: SEOHeadProps) {
  const location = useLocation();
  const baseUrl = 'https://www.givea.shop';
  const currentUrl = url || `${baseUrl}${location.pathname}`;
  const fullTitle = title ? `${title} | Givea` : 'Givea — Donate Items & Help People Near You';
  const defaultDescription = 'Join Givea, a community donation platform connecting donors and beneficiaries. Share your unused items and help others in need.';
  const metaDescription = description || defaultDescription;
  const defaultKeywords = 'donation platform, community giving, donate items, charity, sharing platform';
  const metaKeywords = keywords || defaultKeywords;
  const ogImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create primary meta tags
    updateMetaTag('title', fullTitle);
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Update Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', metaDescription, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Givea', true);
    updateMetaTag('fb:app_id', '1525916958651080', true);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', metaDescription);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:url', currentUrl);
    updateMetaTag('twitter:card', 'summary_large_image');

  }, [fullTitle, metaDescription, metaKeywords, ogImage, currentUrl, type, noindex]);

  return null; // This component doesn't render anything
}

