import type { Metadata } from 'next';
import { FaqBrowser } from '../../components/faq/FaqBrowser';

export const metadata: Metadata = {
  title: 'سوالات متداول',
  description:
    'پاسخ پرتکرارترین سوال‌ها درباره‌ی خرید اشتراک، تحویل، فعال‌سازی، گارانتی و پرداخت در فونیکس شاپ.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return <FaqBrowser />;
}
