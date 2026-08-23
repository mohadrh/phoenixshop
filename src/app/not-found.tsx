import type { Metadata } from 'next';
import { NotFoundScene } from '../components/notfound/NotFoundScene';

export const metadata: Metadata = {
  title: 'از بازی خارج شدید — ۴۰۴',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundScene />;
}
