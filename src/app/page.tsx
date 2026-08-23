import type { Metadata } from 'next';
import { HeroCinematic } from '../components/HeroCinematic';
import { CategoryFilterSection } from '../components/home/CategoryFilterSection';
import { HotDealsSection } from '../components/home/HotDealsSection';
import { AICommandCenter } from '../components/home/AICommandCenter';
import { PurchaseJourneyGame } from '../components/home/PurchaseJourneyGame';
import { VipReviewsSection } from '../components/home/VipReviewsSection';
import { DealsMarquee } from '../components/home/DealsMarquee';
import { ProductRail } from '../components/home/ProductRail';
import { VirtualNumbersSection } from '../components/home/VirtualNumbersSection';
import { NewsSection } from '../components/home/NewsSection';
import { ArticlesSection } from '../components/home/ArticlesSection';
import { PRODUCTS } from '../data/catalog';

export const metadata: Metadata = {
  title: 'فونیکس شاپ — اکانت هوش مصنوعی، اشتراک و گیفت کارت',
  description:
    'ChatGPT، Claude، کنوا، کپ‌کات، فیگما، تلگرام پریمیوم و اکانت گیم — با پرداخت ریالی، فعال‌سازی روی حساب خودتان و گارانتی تمام دوره.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main>
      {/* A. هیرو سینمایی — پارالاکس سه‌لایه، ماسک‌رویل، Ken Burns */}
      <HeroCinematic />

      {/* نوار تخفیف‌های امروز — محصول واقعی با قیمت واقعی، نه ادعای آماری */}
      <DealsMarquee />

      {/* B. پورتال دسته‌بندی با فیلتر پیشرفته */}
      <CategoryFilterSection />

      {/* C. پیشنهادهای داغ و تخفیف‌دار */}
      <HotDealsSection />

      {/* ریل پرفروش‌ها — یک ردیف، بقیه با ورق زدن */}
      <ProductRail
        title="پرفروش‌ترین‌ها"
        subtitle="اگر مرددی، از اینجا شروع کن — این‌ها را بیشتر از همه می‌برند"
        badge="محبوب"
        accent="#e8862e"
        href="/shop"
        products={[...PRODUCTS].sort((a, b) => b.salesCount - a.salesCount).slice(0, 10)}
      />

      {/* ریل تازه‌ها */}
      <ProductRail
        title="جدیدترین‌ها"
        subtitle="همین هفته اضافه شدند"
        badge="جدید"
        accent="#2ecc8f"
        href="/shop"
        products={PRODUCTS.filter((p) => p.badges.includes('new')).slice(0, 10)}
      />

      {/* ریل پیش‌فروش و ظرفیت محدود */}
      <ProductRail
        title="زود بجنب"
        subtitle="ظرفیت این‌ها معمولاً روز اول تمام می‌شود"
        badge="محدود"
        accent="#8b3fd4"
        href="/shop/gaming"
        products={PRODUCTS.filter((p) => p.badges.includes('limited') || p.category === 'gaming').slice(0, 10)}
      />


      {/* مرکز فرماندهی هوش مصنوعی — قبل از بازی، چون سؤال واقعی‌تری
          را جواب می‌دهد و کاربر هنوز حوصله‌ی خواندن دارد */}
      <AICommandCenter />

      {/* بازی سطح‌ها، کنار کارت‌های باشگاه */}
      <PurchaseJourneyGame />

      {/* شماره مجازی — خلاصه، بقیه در صفحه‌ی خودش */}
      <VirtualNumbersSection />

      {/* F. باشگاه VIP و نظرات گیمرها */}
      <VipReviewsSection />

      {/* G. تازه‌ها، زنگوله و کانال تلگرام */}
      <NewsSection />

      {/* H. مقالات آموزشی — آخرین سکشن */}
      <ArticlesSection />
    </main>
  );
}
