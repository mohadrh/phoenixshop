import type { MetadataRoute } from 'next';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { ARTICLES } from '../data/articles';

/**
 * نقشه‌ی سایت.
 *
 * از خود داده ساخته می‌شود نه فهرست دستی: محصول یا مقاله‌ی تازه که
 * اضافه شود، خودش در نقشه می‌آید. فهرست دستی همیشه از کاتالوگ عقب
 * می‌ماند و همان صفحه‌هایی جا می‌مانند که تازه‌اند و بیشترین نیاز را
 * به ایندکس شدن دارند.
 */

const BASE = 'https://phoenixshop.ir';

/* در خروجی ایستا باید صریح باشد، وگرنه بیلد شکایت می‌کند که
   این مسیر پویاست. در بیلد معمولی هم بی‌ضرر است. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: BASE,               changeFrequency: 'daily',   priority: 1.0,  lastModified: now },
    { url: `${BASE}/shop`,     changeFrequency: 'daily',   priority: 0.9,  lastModified: now },
    { url: `${BASE}/numbers`,  changeFrequency: 'daily',   priority: 0.9,  lastModified: now },
    { url: `${BASE}/blog`,     changeFrequency: 'weekly',  priority: 0.7,  lastModified: now },
    { url: `${BASE}/faq`,      changeFrequency: 'monthly', priority: 0.6,  lastModified: now },
    { url: `${BASE}/rules`,    changeFrequency: 'monthly', priority: 0.5,  lastModified: now },
    { url: `${BASE}/track`,    changeFrequency: 'monthly', priority: 0.4,  lastModified: now },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/shop/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.8,
    lastModified: now,
  }));

  const products: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
    lastModified: now,
  }));

  const articles: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
    lastModified: now,
  }));

  return [...statics, ...categories, ...products, ...articles];
}
