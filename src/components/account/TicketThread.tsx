'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Lock, Send } from 'lucide-react';
import {
  closeTicket, getTicket, markRead, replyToTicket, type Ticket,
} from '../../lib/tickets';
import { sound } from '../../lib/sound';

/**
 * گفتگوی یک تیکت.
 *
 * تا قبل از این، کلیک روی تیکت هیچ کاری نمی‌کرد — فهرست بود بدون
 * جزئیات. اینجا کل رفت‌وبرگشت دیده می‌شود و می‌شود جواب داد یا
 * تیکت را بست.
 *
 * چون پاسخ خودکار با تایمر می‌آید، صفحه هر دو ثانیه تیکت را دوباره
 * می‌خواند. سبک است (یک خواندن از localStorage) و جایگزینش در نسخه‌ی
 * واقعی یک اتصال زنده یا polling سمت سرور خواهد بود.
 */

const time = (ts: number) =>
  new Date(ts).toLocaleString('fa-IR', {
    hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long',
  });

const STATUS: Record<Ticket['status'], { label: string; cls: string }> = {
  open: { label: 'در انتظار پاسخ', cls: 'is-open' },
  answered: { label: 'پاسخ داده شد', cls: 'is-answered' },
  closed: { label: 'بسته شده', cls: 'is-closed' },
};

export function TicketThread({ id, onBack }: { id: string; onBack: () => void }) {
  const [ticket, setTicket] = useState<Ticket | undefined>(() => getTicket(id));
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markRead(id);
    setTicket(getTicket(id));
    const t = setInterval(() => setTicket(getTicket(id)), 2000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [ticket?.messages.length]);

  /* پیام تازه‌ی پشتیبانی را همان لحظه خوانده حساب کن، چون کاربر
     دارد همین صفحه را نگاه می‌کند */
  useEffect(() => {
    if (ticket?.unread) markRead(id);
  }, [ticket?.unread, id]);

  if (!ticket) {
    return (
      <div className="tk">
        <p className="tk__hint">این تیکت پیدا نشد.</p>
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          <ArrowRight className="btn__icon" /> بازگشت به فهرست
        </button>
      </div>
    );
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    replyToTicket(ticket.id, text);
    setTicket(getTicket(ticket.id));
    setDraft('');
    sound.success();
  };

  const meta = STATUS[ticket.status];

  return (
    <div className="thr">
      <header className="thr__head">
        <button type="button" className="thr__back" onClick={onBack}>
          <ArrowRight className="w-3.5 h-3.5" />
          فهرست تیکت‌ها
        </button>

        <div className="thr__title-row">
          <h3 className="thr__subject">{ticket.subject}</h3>
          <span className={`acc__ticket-status ${meta.cls}`}>{meta.label}</span>
        </div>

        <div className="thr__meta">
          <span className="code-en">{ticket.id}</span>
          <span>·</span>
          <span>{ticket.category}</span>
          {ticket.orderCode && (
            <>
              <span>·</span>
              <span>سفارش <b className="code-en">{ticket.orderCode}</b></span>
            </>
          )}
          <span>·</span>
          <span className="thr__time">
            <Clock className="w-3 h-3" />
            {time(ticket.createdAt)}
          </span>
        </div>
      </header>

      <div className="thr__list" ref={listRef}>
        {ticket.messages.map((m) => (
          <div key={m.id} className={`thr__msg thr__msg--${m.from}`}>
            <span className="thr__msg-who">
              {m.from === 'user' ? 'شما' : 'پشتیبانی فونیکس شاپ'}
            </span>
            <p className="thr__bubble">{m.text}</p>
            <span className="thr__msg-time num-en">{time(m.at)}</span>
          </div>
        ))}

        {ticket.status === 'open' && (
          <p className="thr__waiting">
            <Clock className="w-3.5 h-3.5" />
            در صف پاسخ‌گویی است. معمولاً کمتر از یک ساعت طول می‌کشد.
          </p>
        )}
      </div>

      {ticket.status === 'closed' ? (
        <p className="thr__closed">
          <Lock className="w-3.5 h-3.5" />
          این تیکت بسته شده. اگر باز هم مشکلی بود، تیکت تازه‌ای ثبت کنید.
        </p>
      ) : (
        <form className="thr__form" onSubmit={send}>
          <textarea
            className="tk__input tk__textarea"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="پاسخ خود را بنویسید…"
            aria-label="پاسخ به تیکت"
          />
          <div className="thr__form-actions">
            <button
              type="button"
              className="btn btn--soft"
              onClick={() => { closeTicket(ticket.id); setTicket(getTicket(ticket.id)); sound.click(); }}
            >
              <CheckCircle2 className="btn__icon" />
              مشکلم حل شد
            </button>
            <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
              <Send className="btn__icon" />
              ارسال پاسخ
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
