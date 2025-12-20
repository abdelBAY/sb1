/**
 * Dynamic Sitemap Generator for Givea
 * 
 * This script generates a sitemap.xml file that includes:
 * - Static pages (already in sitemap.xml)
 * - Dynamic product pages from the database
 * - Dynamic donor profile pages from the database
 * 
 * Run this script periodically (e.g., daily via cron job) to keep the sitemap updated.
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * Environment Variables Required:
 *   - SUPABASE_URL
 *   - SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const baseUrl = 'https://www.givea.shop';
const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Static pages (from existing sitemap)
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/search', priority: '0.9', changefreq: 'daily' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/resources', priority: '0.8', changefreq: 'weekly' },
  { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/seeds-info', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.5', changefreq: 'monthly' },
  { loc: '/terms', priority: '0.5', changefreq: 'monthly' },
  { loc: '/login', priority: '0.6', changefreq: 'monthly' },
  { loc: '/register', priority: '0.6', changefreq: 'monthly' },
];

async function fetchProducts() {
  try {
    // Fetch only active products (not GIVEN_AWAY)
    const { data, error } = await supabase
      .from('announcements')
      .select('id, updated_at, created_at')
      .neq('status', 'GIVEN_AWAY')
      .order('updated_at', { ascending: false })
      .limit(10000); // Adjust limit as needed

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchDonors() {
  try {
    // Fetch donors who have public profiles and have created items
    const { data, error } = await supabase
      .from('profiles')
      .select('id, updated_at, created_at')
      .not('id', 'is', null)
      .limit(10000); // Adjust limit as needed

    if (error) {
      console.error('Error fetching donors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching donors:', error);
    return [];
  }
}

function formatDate(dateString) {
  if (!dateString) return currentDate;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

function generateSitemap(staticPages, products, donors) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Static Pages -->\n`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  
`;
  });

  // Add product pages
  xml += `  <!-- Product Pages -->\n`;
  products.forEach(product => {
    const lastmod = formatDate(product.updated_at || product.created_at);
    xml += `  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
`;
  });

  // Add donor profile pages
  xml += `  <!-- Donor Profile Pages -->\n`;
  donors.forEach(donor => {
    const lastmod = formatDate(donor.updated_at || donor.created_at);
    xml += `  <url>
    <loc>${baseUrl}/donor/${donor.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
`;
  });

  xml += `</urlset>\n`;

  return xml;
}

async function main() {
  console.log('Generating sitemap...');
  console.log('Fetching products...');
  const products = await fetchProducts();
  console.log(`Found ${products.length} products`);

  console.log('Fetching donors...');
  const donors = await fetchDonors();
  console.log(`Found ${donors.length} donors`);

  console.log('Generating XML...');
  const sitemapXml = generateSitemap(staticPages, products, donors);

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf8');

  console.log(`Sitemap generated successfully!`);
  console.log(`Total URLs: ${staticPages.length + products.length + donors.length}`);
  console.log(`Output: ${outputPath}`);
}

main().catch(console.error);

