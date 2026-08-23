import type { MetadataRoute } from 'next';

/**
 * قواعد خزنده‌ها.
 *
 * پنل کاربری، چک‌اوت و پیگیری از ایندکس بیرون‌اند: محتوای شخصی‌اند و
 * برای کسی که از گوگل می‌آید بی‌معنی‌اند. مسدود کردنشان بودجه‌ی خزش
 * را روی صفحه‌هایی می‌گذارد که واقعاً باید دیده شوند.
 */

/* در خروجی ایستا باید صریح باشد، وگرنه بیلد شکایت می‌کند که
   این مسیر پویاست. در بیلد معمولی هم بی‌ضرر است. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/account/', '/checkout', '/track', '/preview-404'],
    },
    sitemap: 'https://phoenixshop.ir/sitemap.xml',
  };
}
