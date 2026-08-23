import React from 'react';
import { Zap, ShieldCheck, CreditCard, Users } from 'lucide-react';

const STATS = [
  { icon: Zap, value: '< ۶۰ ثانیه', label: 'تحویل کدهای آماده' },
  { icon: ShieldCheck, value: 'تمام دوره', label: 'گارانتی هر اشتراک' },
  { icon: CreditCard, value: 'ریالی', label: 'بدون کارت ارزی' },
  { icon: Users, value: '۱۲٬۴۰۰+', label: 'سفارش تحویل‌شده' },
];

export function TrustStrip() {
  return (
    <section className="trust" aria-label="تعهدهای فونیکس شاپ">
      <div className="trust__inner">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="trust__item">
            <Icon className="trust__icon" />
            <div className="trust__text">
              <b>{value}</b>
              <small>{label}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
