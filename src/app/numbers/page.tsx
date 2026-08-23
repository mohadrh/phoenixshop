import type { Metadata } from 'next';
import { NumbersBrowser } from '../../components/numbers/NumbersBrowser';

export const metadata: Metadata = {
  title: 'شماره مجازی',
  description:
    'شماره‌ی مجازی برای ثبت‌نام در تلگرام، واتساپ، ChatGPT و صدها سرویس دیگر. یک‌بارمصرف، اجاره‌ای و دائمی از هشت کشور، با نمایش آنی پیامک در پنل.',
  alternates: { canonical: '/numbers' },
};

export default function NumbersPage() {
  return <NumbersBrowser />;
}
