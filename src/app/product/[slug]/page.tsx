import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProductBySlug, getLowestPrice } from '../../../data/catalog';
import { ProductDetail } from '../../../components/product/ProductDetail';

/* فهرست کامل است و هر چیز خارج از آن ۴۰۴ می‌شود، پس پارامتر پویا
   نداریم. بدون این خط، Next برای slugهای ناشناخته یک تابع سروری
   نگه می‌دارد و ورسل موقع استقرار دنبال لامبدایی می‌گردد که ساخته
   نشده — همان خطای «Unable to find lambda for route». */
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.englishTitle}`,
    description: p.description.slice(0, 160),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: p.title, description: p.shortDescription, type: 'website' },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  /* داده‌ی ساختاریافته — گوگل قیمت و امتیاز را مستقیم در نتایج نشان می‌دهد.
     برای فروشگاهی که تازه ایندکس می‌شود، این تفاوت واقعی در نرخ کلیک دارد. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    alternateName: product.englishTitle,
    description: product.shortDescription,
    brand: { '@type': 'Brand', name: product.brand },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IRR',
      lowPrice: getLowestPrice(product),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.stock === null || v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
