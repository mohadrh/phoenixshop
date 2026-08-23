import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { ARTICLES, getArticleBySlug, getRelatedArticles } from '../../../data/articles';
import { ArticleBody } from '../../../components/blog/ArticleBody';
import { asset } from '../../../lib/asset';

/* فهرست کامل است و هر چیز خارج از آن ۴۰۴ می‌شود، پس پارامتر پویا
   نداریم. بدون این خط، Next برای slugهای ناشناخته یک تابع سروری
   نگه می‌دارد و ورسل موقع استقرار دنبال لامبدایی می‌گردد که ساخته
   نشده — همان خطای «Unable to find lambda for route». */
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { title: a.title, description: a.excerpt, type: 'article' },
  };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug);

  /* داده‌ی ساخت‌یافته — گوگل مقاله را به‌عنوان مقاله بشناسد، نه یک
     صفحه‌ی معمولی. تاریخ شمسی برای نمایش است؛ اینجا لازم نیست. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: 'فونیکس شاپ' },
    publisher: { '@type': 'Organization', name: 'فونیکس شاپ' },
  };

  return (
    <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* مسیر بازگشت */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 mb-6 text-[11px] font-bold text-zinc-500 hover:text-amber-300 transition-colors"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        همه‌ی مقالات
      </Link>

      {/* سربرگ */}
      <header className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="px-2.5 py-1 rounded-lg text-[10px] font-black"
            style={{ background: `${article.accent}22`, color: article.accent }}
          >
            {article.topicLabel}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Clock className="w-3 h-3" />
            <span className="num-en">{article.readMinutes.toLocaleString('fa-IR')}</span> دقیقه مطالعه
          </span>
          <span className="text-[11px] text-zinc-600">{article.publishedAt}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-relaxed mb-3">
          {article.title}
        </h1>
        <p className="text-sm text-zinc-400 leading-loose">{article.excerpt}</p>

        {article.cover && (
          <figure className="relative mt-6 h-48 sm:h-64 rounded-3xl overflow-hidden bg-[#0a0713] border border-white/[0.08]">
            <img
              src={asset(article.cover)}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-70"
            />
            <span
              className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to top, #08050f 6%, ${article.accent}18 55%, transparent)` }}
            />
          </figure>
        )}
      </header>

      <article>
        <ArticleBody blocks={article.body} accent={article.accent} />
      </article>

      {/* مقالات مرتبط */}
      {related.length > 0 && (
        <section className="mt-14 pt-8 border-t border-white/[0.08]">
          <h2 className="text-base font-black text-white mb-5">بعدش این را بخوان</h2>
          <div className="flex flex-col gap-2.5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group glow-hover flex items-center gap-3 p-4 rounded-2xl
                           bg-white/[0.03] border border-white/[0.08]
                           hover:border-white/25 transition-all duration-200"
                style={{ ['--glow-accent' as string]: r.accent }}
              >
                <span
                  className="px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0"
                  style={{ background: `${r.accent}22`, color: r.accent }}
                >
                  {r.topicLabel}
                </span>
                <b className="flex-1 min-w-0 text-xs font-bold text-zinc-100 truncate">
                  {r.title}
                </b>
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
