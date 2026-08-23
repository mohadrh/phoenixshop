import type { Metadata } from 'next';
import { OrderTracker } from '../../components/track/OrderTracker';

export const metadata: Metadata = {
  title: 'پیگیری سفارش',
  description: 'وضعیت سفارش خود را با شماره‌ی پیگیری یا شماره‌ی موبایل استعلام کنید.',
  alternates: { canonical: '/track' },
};

export default function TrackPage() {
  return <OrderTracker />;
}
