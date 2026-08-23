import type { Metadata } from 'next';
import { ArticlesSection } from '../../components/home/ArticlesSection';

export const metadata: Metadata = {
  title: 'مقالات و راهنماها',
  description:
    'راهنمای انتخاب هوش مصنوعی، پرامپت‌نویسی، اکانت ظرفیتی و امنیت پلی‌استیشن — نوشته‌شده برای کسی که می‌خواهد قبل از خرید بداند چه می‌خرد.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <main className="pt-20">
      <ArticlesSection />
    </main>
  );
}
