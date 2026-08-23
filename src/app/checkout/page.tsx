import type { Metadata } from 'next';
import { CheckoutFlow } from '../../components/checkout/CheckoutFlow';

export const metadata: Metadata = {
  title: 'تسویه حساب',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
