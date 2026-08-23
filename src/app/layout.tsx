import type { Metadata, Viewport } from 'next';
import { Vazirmatn, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { SiteChrome } from '../components/shell/SiteChrome';
import './globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://phoenixshop.ir'),
  title: {
    default: 'فونیکس شاپ — اکانت هوش مصنوعی، اشتراک و گیفت کارت',
    template: '%s | فونیکس شاپ',
  },
  description:
    'خرید اشتراک ChatGPT، Claude، کنوا، کپ‌کات، تلگرام پریمیوم و اکانت‌های گیم با پرداخت ریالی، فعال‌سازی روی حساب خودتان و گارانتی تمام دوره.',
  keywords: [
    'خرید اکانت هوش مصنوعی', 'ChatGPT Plus', 'Claude Pro', 'تلگرام پریمیوم',
    'کنوا پرو', 'کپ کات پرو', 'گیفت کارت', 'اکانت گیم',
  ],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'فونیکس شاپ',
    title: 'فونیکس شاپ — دسترسی بدون مرز',
    description: 'اشتراک‌های بین‌المللی با پرداخت ریالی و فعال‌سازی روی حساب خودتان.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08060d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${grotesk.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {/* SiteChrome همه‌ی چیزهای همیشه‌حاضر را نگه می‌دارد:
              نوبار، سبد، ققنوسِ بازگشت به بالا، چت هوش مصنوعی، اورلی پرواز سوخو.
              چون در لایوت ریشه است، روی هر روتی حاضرند — از خانه تا ۴۰۴. */}
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
