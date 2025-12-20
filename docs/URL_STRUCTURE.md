# URL Structure Documentation - Givea Platform

This document outlines the complete URL structure for the Givea community donation platform.

## Base URL
```
https://www.givea.shop/
```

## URL Structure Overview

### 1. Public Pages

#### Homepage
- **URL**: `/`
- **Description**: Landing page with hero section, features, testimonials, and CTA
- **Access**: Public
- **SEO Priority**: 1.0

#### About Page
- **URL**: `/about`
- **Description**: Information about Givea, mission, vision, and values
- **Access**: Public
- **SEO Priority**: 0.8

#### Contact Page
- **URL**: `/contact`
- **Description**: Contact form and information
- **Access**: Public
- **SEO Priority**: 0.7

#### Resources Page
- **URL**: `/resources`
- **Description**: Helpful resources, guides, and information
- **Access**: Public
- **SEO Priority**: 0.8

---

### 2. Authentication Pages

#### Login
- **URL**: `/login`
- **Description**: User login page
- **Access**: Public (redirects if authenticated)
- **SEO Priority**: 0.6

#### Register
- **URL**: `/register`
- **Description**: New user registration page
- **Access**: Public (redirects if authenticated)
- **SEO Priority**: 0.6

#### Reset Password
- **URL**: `/reset-password`
- **Description**: Password reset functionality
- **Access**: Public
- **SEO Priority**: 0.4

---

### 3. User Dashboard & Profile

#### Dashboard
- **URL**: `/dashboard`
- **Description**: User dashboard with statistics and activity
- **Access**: Authenticated users only
- **SEO Priority**: Not indexed (private)

#### Profile
- **URL**: `/profile`
- **Description**: User profile management
- **Access**: Authenticated users only
- **SEO Priority**: Not indexed (private)

#### Donor Profile
- **URL**: `/donor/:id`
- **Description**: Public profile of a donor
- **Access**: Public (for viewing)
- **SEO Priority**: 0.7 (dynamic)
- **Parameters**: 
  - `id` - Donor user ID

---

### 4. Item Management

#### Create Item
- **URL**: `/create-item`
- **Description**: Form to create a new donation listing
- **Access**: Authenticated users only
- **SEO Priority**: Not indexed (private)

#### Edit Item
- **URL**: `/edit-item/:id`
- **Description**: Edit an existing donation listing
- **Access**: Authenticated users (item owner only)
- **SEO Priority**: Not indexed (private)
- **Parameters**: 
  - `id` - Item/announcement ID

#### Product Detail
- **URL**: `/product/:id`
- **Description**: Detailed view of a donation item
- **Access**: Public (for viewing)
- **SEO Priority**: 0.9 (dynamic)
- **Parameters**: 
  - `id` - Product/item ID

#### Search
- **URL**: `/search`
- **Description**: Search and browse available donation items
- **Access**: Public
- **SEO Priority**: 0.9
- **Query Parameters** (optional):
  - `q` - Search query string
  - `category` - Filter by category
  - `city` - Filter by city
  - `condition` - Filter by item condition

---

### 5. Communication

#### Messages
- **URL**: `/messages`
- **Description**: User messaging center
- **Access**: Authenticated users only
- **SEO Priority**: Not indexed (private)

---

### 6. Legal Pages

#### Privacy Policy
- **URL**: `/privacy`
- **Description**: Privacy policy and data protection information
- **Access**: Public
- **SEO Priority**: 0.5

#### Terms and Conditions
- **URL**: `/terms`
- **Description**: Terms of service and user agreement
- **Access**: Public
- **SEO Priority**: 0.5

---

### 7. Error Pages

#### 404 Not Found
- **URL**: `/*` (any unmatched route)
- **Description**: Custom 404 error page
- **Access**: Public
- **SEO Priority**: Not indexed

---

## URL Patterns

### Static Routes
- All static routes use lowercase with hyphens (kebab-case)
- Examples: `/about`, `/contact`, `/reset-password`

### Dynamic Routes
- Dynamic routes use parameters with colons
- Examples: `/product/:id`, `/donor/:id`, `/edit-item/:id`

### Query Parameters
- Search page supports query parameters for filtering
- Format: `/search?q=keyword&category=electronics&city=NewYork`

---

## SEO Considerations

### Indexed Pages (Public)
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/resources` - Resources page
- `/search` - Search page
- `/product/:id` - Product detail pages (dynamic)
- `/donor/:id` - Donor profile pages (dynamic)
- `/privacy` - Privacy policy
- `/terms` - Terms and conditions

### Non-Indexed Pages (Private/Authenticated)
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/messages` - Messages
- `/create-item` - Create item form
- `/edit-item/:id` - Edit item form
- `/login` - Login page
- `/register` - Registration page
- `/reset-password` - Password reset

---

## Sitemap

The sitemap is available at:
```
https://www.givea.shop/sitemap.xml
```

## Robots.txt

The robots.txt file is available at:
```
https://www.givea.shop/robots.txt
```

---

## URL Best Practices

1. **Consistency**: All URLs use lowercase with hyphens
2. **Descriptive**: URLs clearly indicate the page content
3. **SEO-Friendly**: Important pages are included in sitemap
4. **Security**: Private pages are excluded from indexing
5. **Dynamic Content**: Product and donor pages are dynamically generated

---

## Future Enhancements

Consider implementing:
- Category-based URLs: `/category/:name`
- City-based URLs: `/city/:name`
- Pagination: `/search?page=2`
- Sorting: `/search?sort=date&order=desc`
- User-friendly slugs for products: `/product/:slug` instead of `/product/:id`

---

Last Updated: January 27, 2025

