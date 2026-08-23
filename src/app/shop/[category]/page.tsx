import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, type CategorySlug } from '../../../data/catalog';
import { ShopBrowser } from '../../../components/shop/ShopBrowser';

/** هر دسته یک صفحه‌ی ایستا و قابل ایندکس می‌شود */
/* فهرست کامل است و هر چیز خارج از آن ۴۰۴ می‌شود، پس پارامتر پویا
   نداریم. بدون این خط، Next برای slugهای ناشناخته یک تابع سروری
   نگه می‌دارد و ورسل موقع استقرار دنبال لامبدایی می‌گردد که ساخته
   نشده — همان خطای «Unable to find lambda for route». */
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: cat.title,
    description: `${cat.title} — ${cat.tagline}. خرید با پرداخت ریالی، فعال‌سازی روی حساب خودتان و گارانتی تمام دوره.`,
    alternates: { canonical: `/shop/${cat.slug}` },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  return <ShopBrowser initialCategory={cat.slug as CategorySlug} />;
}
