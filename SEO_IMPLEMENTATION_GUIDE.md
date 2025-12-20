# SEO Implementation Guide

## Quick Fixes Applied ✅

1. ✅ **Canonical URL Added** - Added to `index.html` for homepage
2. ✅ **Sitemap Dates Fixed** - Updated all dates from 2025-12-20 to 2025-01-27
3. ✅ **SEOHead Component Created** - Dynamic meta tag management component

## How to Use SEOHead Component

### Basic Usage

Import and use the `SEOHead` component in your page components:

```tsx
import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us - Givea"
        description="Learn about Givea's mission to connect donors and beneficiaries in communities worldwide."
        keywords="about givea, donation platform, community giving, our mission"
        url="https://www.givea.shop/about"
      />
      {/* Your page content */}
    </>
  );
}
```

### Product Detail Page Example

```tsx
import SEOHead from '../components/SEOHead';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ... fetch product data ...

  return (
    <>
      {product && (
        <SEOHead
          title={`${product.title} - Donate on Givea`}
          description={product.description || `Donate ${product.title} to help others in your community. ${product.condition} condition.`}
          keywords={`${product.title}, ${product.category}, donation, ${product.location}`}
          image={product.photos?.[0] || '/logo1.png'}
          url={`https://www.givea.shop/product/${id}`}
          type="product"
        />
      )}
      {/* Your product detail content */}
    </>
  );
}
```

### Donor Profile Page Example

```tsx
import SEOHead from '../components/SEOHead';

export default function DonorProfile() {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);

  // ... fetch donor data ...

  return (
    <>
      {donor && (
        <SEOHead
          title={`${donor.full_name} - Donor Profile on Givea`}
          description={`View ${donor.full_name}'s donation history and profile. ${donor.review_count} reviews, ${donor.rating} star rating.`}
          keywords={`${donor.full_name}, donor, givea, donation profile`}
          image={donor.avatar_url || '/logo1.png'}
          url={`https://www.givea.shop/donor/${id}`}
          type="profile"
        />
      )}
      {/* Your donor profile content */}
    </>
  );
}
```

### Search Page Example

```tsx
import SEOHead from '../components/SEOHead';
import { useSearchParams } from 'react-router-dom';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const title = query 
    ? `Search Results for "${query}" - Givea`
    : 'Browse Donations - Givea';
  
  const description = query
    ? `Find donations matching "${query}" on Givea. Browse available items in your community.`
    : 'Browse available donations in your community. Find items you need or donate items you no longer use.';

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={`search, ${query}, ${category}, donations, givea`}
        url={`https://www.givea.shop/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
      />
      {/* Your search content */}
    </>
  );
}
```

### Private Pages (No Index)

For pages that shouldn't be indexed (dashboard, messages, etc.):

```tsx
<SEOHead
  title="Dashboard - Givea"
  description="Your personal donation dashboard"
  noindex={true}
/>
```

## Pages That Need SEOHead Implementation

### Priority 1 (High Traffic Pages)
- [ ] `src/pages/ProductDetail.tsx` - Product pages
- [ ] `src/pages/Search.tsx` - Search/browse page
- [ ] `src/pages/DonorProfile.tsx` - Donor profiles

### Priority 2 (Important Static Pages)
- [ ] `src/pages/About.tsx` - About page
- [ ] `src/pages/ContactUs.tsx` - Contact page
- [ ] `src/pages/Resources.tsx` - Resources page
- [ ] `src/pages/FAQ.tsx` - FAQ page

### Priority 3 (Other Pages)
- [ ] `src/pages/PrivacyPolicy.tsx` - Privacy policy
- [ ] `src/pages/TermsAndConditions.tsx` - Terms
- [ ] `src/pages/SeedsInfo.tsx` - Seeds info

## Next Steps

1. **Implement SEOHead in ProductDetail.tsx**
   - Use product title, description, and first image
   - Include product category and location in keywords

2. **Implement SEOHead in Search.tsx**
   - Dynamic title based on search query
   - Include search terms in description

3. **Implement SEOHead in DonorProfile.tsx**
   - Use donor name and stats
   - Include location and rating info

4. **Update Static Pages**
   - Add unique titles and descriptions for each page
   - Include relevant keywords

5. **Test Implementation**
   - Use browser dev tools to verify meta tags update
   - Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Test with Twitter Card Validator: https://cards-dev.twitter.com/validator

## Advanced: Server-Side Meta Tags

For even better SEO, consider implementing server-side meta tag injection in `src/entry-server.tsx`. This ensures search engines see the correct meta tags on first load.

Example approach:
1. Create a context/store that holds current page SEO data
2. In `entry-server.tsx`, read the route and fetch necessary data
3. Inject meta tags into the HTML template before sending response

This is more complex but provides the best SEO results for SPAs.

## Monitoring

After implementation:
1. Submit updated sitemap to Google Search Console
2. Request re-indexing of important pages
3. Monitor search performance in Google Search Console
4. Check for crawl errors

---

**Note:** The SEOHead component works client-side. For production, consider implementing server-side rendering of meta tags for optimal SEO.

