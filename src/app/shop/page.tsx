import type { Metadata } from 'next';
import { ShopBrowser } from '../../components/shop/ShopBrowser';

export const metadata: Metadata = {
  title: 'فروشگاه — همه‌ی محصولات',
  description:
    'همه‌ی اشتراک‌های هوش مصنوعی، طراحی، شبکه‌های اجتماعی، آموزشی و اکانت‌های گیم فونیکس شاپ، با فیلتر دسته، نوع تحویل و قیمت.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return <ShopBrowser />;
}
