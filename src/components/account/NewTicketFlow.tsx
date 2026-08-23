'use client';

import { createTicket } from '../../lib/tickets';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown, CheckCircle2, LifeBuoy, Lightbulb,
  Paperclip, Send, ThumbsUp, X,
} from 'lucide-react';
import {
  findRelevantArticles, HELP_CATEGORIES, type HelpArticle, type HelpCategory,
} from '../../data/helpArticles';

type Stage = 'subject' | 'form' | 'sent';

interface NewTicketFlowProps {
  orders?: { id: string; label: string }[];
  /** موضوع از پیش پرشده — وقتی از گاوصندوق درخواست گارانتی می‌آید */
  initialSubject?: string;
  onCancel?: () => void;
  onSubmitted?: (ticketId: string) => void;
}

export const NewTicketFlow: React.FC<NewTicketFlowProps> = ({
  orders = [],
  initialSubject = '',
  onCancel,
  onSubmitted,
}) => {
  const [stage, setStage] = useState<Stage>('subject');
  const [subject, setSubject] = useState(initialSubject);
  /* موضوعِ تأخیردار — تا کاربر وسط تایپ با تغییر لیست پیشنهادها گیج نشه */
  const [settled, setSettled] = useState('');
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [resolvedBy, setResolvedBy] = useState<HelpArticle | null>(null);

  const [category, setCategory] = useState<HelpCategory>('general');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [relatedOrder, setRelatedOrder] = useState('');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSettled(subject), 350);
    return () => clearTimeout(t);
  }, [subject]);

  const matches = useMemo(() => findRelevantArticles(settled), [settled]);

  /* دسته‌ی تیکت از پرامتیازترین مقاله حدس زده می‌شه — کاربر می‌تونه عوضش کنه */
  useEffect(() => {
    if (matches.length > 0) setCategory(matches[0].article.category);
  }, [matches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* تیکت واقعاً ذخیره می‌شود تا در فهرست تیکت‌ها دیده شود. قبلاً فقط
       یک شناسه‌ی تصادفی ساخته می‌شد و تیکت هیچ‌جا نمی‌رفت. */
    const ticket = createTicket({
      subject: subject.trim(),
      category,
      priority,
      message: message.trim(),
      orderCode: relatedOrder || undefined,
    });
    setTicketId(ticket.id);
    setStage('sent');
    onSubmitted?.(ticket.id);
  };

  /* ---------- کاربر با مقاله مشکلش حل شد ---------- */
  if (resolvedBy) {
    return (
      <div className="tk tk--resolved">
        <CheckCircle2 className="tk__resolved-icon" />
        <h3 className="tk__resolved-title">خوشحالیم که حل شد</h3>
        <p className="tk__resolved-text">
          اگر دوباره به مشکل خوردید، همیشه می‌توانید تیکت ثبت کنید.
        </p>
        <div className="tk__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setResolvedBy(null)}>
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  /* ---------- تیکت ثبت شد ---------- */
  if (stage === 'sent') {
    return (
      <div className="tk tk--resolved">
        <CheckCircle2 className="tk__resolved-icon" />
        <h3 className="tk__resolved-title">تیکت شما ثبت شد</h3>
        <p className="tk__resolved-text">
          شماره‌ی پیگیری: <b className="num-en">{ticketId}</b>
          <br />
          میانگین زمان پاسخ برای این دسته حدود ۲ ساعت است. نتیجه هم اینجا و هم با پیامک اطلاع داده می‌شود.
        </p>
        <div className="tk__actions">
          <button type="button" className="btn btn--primary" onClick={onCancel}>
            بازگشت به تیکت‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tk">
      <header className="tk__head">
        <div className="tk__head-icon"><LifeBuoy /></div>
        <div>
          <h3 className="tk__title">ثبت تیکت پشتیبانی</h3>
          <p className="tk__subtitle">
            اول موضوع را بنویسید — اگر پاسخ آماده‌ای داشته باشیم، همان‌جا نشانتان می‌دهیم.
          </p>
        </div>
        {onCancel && (
          <button type="button" className="tk__close" onClick={onCancel} aria-label="بستن">
            <X />
          </button>
        )}
      </header>

      {/* ---------- گام ۱: موضوع ---------- */}
      <div className="tk__field">
        <label htmlFor="tk-subject" className="tk__label">موضوع مشکل شما</label>
        <input
          id="tk-subject"
          className="tk__input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="مثلاً: تلگرام پریمیوم روی حسابم فعال نشد"
          autoComplete="off"
          maxLength={120}
        />
        <span className="tk__hint">
          هرچه دقیق‌تر بنویسید، پاسخ سریع‌تری می‌گیرید.
        </span>
      </div>

      {/* ---------- پیشنهاد مقالات ---------- */}
      {matches.length > 0 && stage === 'subject' && (
        <section className="tk__suggest" aria-live="polite">
          <div className="tk__suggest-head">
            <Lightbulb className="tk__suggest-icon" />
            <span>
              {matches.length === 1
                ? 'شاید پاسخ همین باشد'
                : `${matches.length} پاسخ آماده پیدا شد`}
            </span>
          </div>

          <ul className="tk__articles">
            {matches.map(({ article }) => {
              const isOpen = openArticle === article.id;
              return (
                <li key={article.id} className={`tk__article ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="tk__article-toggle"
                    aria-expanded={isOpen}
                    onClick={() => setOpenArticle(isOpen ? null : article.id)}
                  >
                    <span className="tk__article-cat">{HELP_CATEGORIES[article.category]}</span>
                    <span className="tk__article-title">{article.title}</span>
                    <ChevronDown className="tk__article-chevron" />
                  </button>

                  {isOpen && (
                    <div className="tk__article-body">
                      <p className="tk__article-answer">{article.answer}</p>

                      {article.steps && (
                        <ol className="tk__steps">
                          {article.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      )}

                      <div className="tk__article-foot">
                        <button
                          type="button"
                          className="btn btn--soft"
                          onClick={() => setResolvedBy(article)}
                        >
                          <ThumbsUp className="btn__icon" />
                          مشکلم حل شد
                        </button>
                        <span className="tk__article-count num-en">
                          {article.helpfulCount.toLocaleString('fa-IR')} نفر مفید دانستند
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---------- گذار به فرم کامل ---------- */}
      {stage === 'subject' && (
        <div className="tk__actions">
          <button
            type="button"
            className={matches.length > 0 ? 'btn btn--ghost' : 'btn btn--primary'}
            disabled={subject.trim().length < 5}
            onClick={() => setStage('form')}
          >
            {matches.length > 0 ? 'هیچ‌کدام کمکم نکرد، تیکت می‌زنم' : 'ادامه'}
          </button>
          {subject.trim().length < 5 && (
            <span className="tk__hint">برای ادامه، موضوع را کامل‌تر بنویسید.</span>
          )}
        </div>
      )}

      {/* ---------- گام ۲: فرم کامل ---------- */}
      {stage === 'form' && (
        <form className="tk__form" onSubmit={handleSubmit}>
          <div className="tk__row">
            <div className="tk__field">
              <label htmlFor="tk-cat" className="tk__label">دسته</label>
              <select
                id="tk-cat"
                className="tk__input"
                value={category}
                onChange={(e) => setCategory(e.target.value as HelpCategory)}
              >
                {Object.entries(HELP_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="tk__field">
              <label htmlFor="tk-pri" className="tk__label">اولویت</label>
              <select
                id="tk-pri"
                className="tk__input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
              >
                <option value="low">عادی — پاسخ تا ۲۴ ساعت</option>
                <option value="normal">مهم — پاسخ تا ۴ ساعت</option>
                <option value="high">فوری — پاسخ تا ۱ ساعت</option>
              </select>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="tk__field">
              <label htmlFor="tk-order" className="tk__label">
                سفارش مرتبط <span className="tk__optional">اختیاری</span>
              </label>
              <select
                id="tk-order"
                className="tk__input"
                value={relatedOrder}
                onChange={(e) => setRelatedOrder(e.target.value)}
              >
                <option value="">— انتخاب کنید —</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              <span className="tk__hint">
                انتخاب سفارش، پاسخ‌گویی را به‌طور محسوسی سریع‌تر می‌کند.
              </span>
            </div>
          )}

          <div className="tk__field">
            <label htmlFor="tk-msg" className="tk__label">شرح مشکل</label>
            <textarea
              id="tk-msg"
              className="tk__input tk__textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="دقیقاً چه اتفاقی افتاد؟ چه پیام خطایی دیدید؟"
              rows={5}
              required
              minLength={10}
            />
            <span className="tk__hint num-en">{message.length} / ۲۰۰۰</span>
          </div>

          <div className="tk__actions tk__actions--split">
            <button type="button" className="btn btn--soft">
              <Paperclip className="btn__icon" />
              افزودن تصویر
            </button>
            <div className="tk__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setStage('subject')}>
                بازگشت
              </button>
              <button type="submit" className="btn btn--primary">
                <Send className="btn__icon" />
                ثبت تیکت
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};