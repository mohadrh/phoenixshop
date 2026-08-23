import type { Metadata } from 'next';
import { AccountPage, type AccountTab } from '../../../components/account/AccountPage';

const TABS: AccountTab[] = [
  'overview', 'orders', 'vault', 'numbers', 'subscriptions',
  'wallet', 'tickets', 'warranty', 'settings',
];

/* هر تب از قبل ساخته می‌شود. در خروجی ایستا اجباری است، و در بیلد
   معمولی هم صفحه را سریع‌تر می‌کند. */
export function generateStaticParams() {
  return [{ tab: [] as string[] }, ...TABS.map((t) => ({ tab: [t] }))];
}

export const metadata: Metadata = {
  title: 'پنل کاربری',
  robots: { index: false, follow: false },
};

/** روت اختیاریِ چندبخشی: /account و /account/<tab> هر دو همین صفحه‌اند */
export default async function Account(
  { params }: { params: Promise<{ tab?: string[] }> }
) {
  const { tab } = await params;
  const requested = tab?.[0] as AccountTab | undefined;
  const initialTab = requested && TABS.includes(requested) ? requested : 'overview';

  return <AccountPage initialTab={initialTab} />;
}
