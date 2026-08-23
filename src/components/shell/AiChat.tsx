'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Headphones, MessageCircle, Send, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES, getLowestPrice, type Product } from '../../data/catalog';
import { findRelevantArticles } from '../../data/helpArticles';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  products?: Product[];
  /** پیشنهاد ادامه‌ی گفتگو */
  chips?: string[];
}

const OPENER: Message = {
  id: 0,
  from: 'bot',
  text: 'سلام. چه کمکی ازم برمیاد؟ هم درباره‌ی سفارش و تحویل جواب می‌دم، هم اگه بگی چه کاری می‌خوای بکنی محصول پیشنهاد می‌دم.',
  chips: ['برای نوشتن و ترجمه', 'برای ادیت ویدیو', 'برای طراحی', 'تلگرام پریمیوم'],
};

/* ---------------------------------------------------------------
   پاسخ‌دهی محلی.

   عمداً بدون تماس با مدل: این ویجت روی هر صفحه‌ای لود می‌شود و
   نباید هر بازدید یک درخواست شبکه بزند. برای نیت‌های واقعی خرید،
   تطبیق کلیدواژه‌ای روی کاتالوگ کافی و فوری است.
--------------------------------------------------------------- */

const INTENTS: { keys: string[]; reply: string; pick: (p: Product) => boolean }[] = [
  {
    keys: ['نوشتن', 'ترجمه', 'مقاله', 'متن', 'چت', 'تحقیق', 'درس', 'کدنویسی', 'برنامه'],
    reply: 'برای نوشتن، ترجمه و تحقیق، این‌ها بهترین انتخاب‌اند:',
    pick: (p) => p.category === 'ai',
  },
  {
    keys: ['ویدیو', 'ادیت', 'کلیپ', 'مونتاژ', 'تدوین', 'کپ کات', 'کپ‌کات'],
    reply: 'برای ادیت ویدیو این‌ها را داریم:',
    pick: (p) => p.id === 'capcut-pro' || p.id === 'canva-pro',
  },
  {
    keys: ['طراحی', 'گرافیک', 'کنوا', 'فیگما', 'بنر', 'لوگو', 'پوستر'],
    reply: 'برای طراحی و گرافیک:',
    pick: (p) => p.category === 'creative',
  },
  {
    keys: ['تلگرام', 'پریمیوم', 'استوری', 'حجم'],
    reply: 'تلگرام پریمیوم با فعال‌سازی خودکار روی یوزرنیم خودت:',
    pick: (p) => p.id === 'telegram-premium',
  },
  {
    keys: ['زبان', 'انگلیسی', 'دولینگو', 'یادگیری', 'آموزش'],
    reply: 'برای یادگیری زبان:',
    pick: (p) => p.category === 'education',
  },
  {
    keys: ['بازی', 'گیم', 'پلی استیشن', 'ps5', 'استیم', 'ایکس باکس'],
    reply: 'از بخش گیم:',
    pick: (p) => p.category === 'gaming',
  },
  {
    keys: ['ارزان', 'ارزون', 'کم', 'بودجه', 'حداقل'],
    reply: 'مقرون‌به‌صرفه‌ترین‌هایی که داریم:',
    pick: () => true,
  },
];

function respond(input: string): Message {
  const q = input.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').toLowerCase();

  // اول: آیا این یک سؤال پشتیبانی است، نه خرید؟
  const help = findRelevantArticles(q, 1);
  const intent = INTENTS.find((i) => i.keys.some((k) => q.includes(k)));

  if (help.length > 0 && !intent) {
    return {
      id: Date.now(),
      from: 'bot',
      text: `${help[0].article.title}\n\n${help[0].article.answer}`,
      chips: ['هنوز سؤال دارم', 'می‌خوام خرید کنم'],
    };
  }

  if (intent) {
    let matches = PRODUCTS.filter(intent.pick);
    if (q.includes('ارزان') || q.includes('ارزون')) {
      matches = [...PRODUCTS].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    }
    return {
      id: Date.now(),
      from: 'bot',
      text: intent.reply,
      products: matches.slice(0, 3),
      chips: ['تفاوتشون چیه؟', 'چطور تحویل می‌دین؟'],
    };
  }

  const canned = FAQ.find((f) => f.keys.some((k) => q.includes(k)));
  if (canned) {
    return { id: Date.now(), from: 'bot', text: canned.answer, chips: canned.chips };
  }

  return {
    id: Date.now(),
    from: 'bot',
    text: 'دقیق‌تر بگو چه کاری می‌خوای انجام بدی — مثلاً «می‌خوام ویدیو ادیت کنم» یا «برای درس لازم دارم». این‌طوری بهتر می‌تونم راهنماییت کنم.',
    chips: CATEGORIES.slice(0, 4).map((c) => c.title),
  };
}


/* ---------------------------------------------------------------
   پاسخ‌های آماده.

   این‌ها سؤال‌هایی‌اند که واقعاً پرسیده می‌شوند: تحویل، گارانتی،
   پرداخت، امنیت اکانت. جواب آماده داشتن یعنی کاربر ساعت دو بامداد
   هم جوابش را می‌گیرد، نه اینکه منتظر پشتیبان بماند.

   ترتیب مهم است: اولین کلیدواژه‌ی منطبق برنده می‌شود، پس موضوع‌های
   خاص‌تر بالاتر از موضوع‌های عمومی می‌نشینند.
--------------------------------------------------------------- */

/** جمله‌های حباب — چرخشی، تا تکراری نشود */
const NUDGES = [
  'احتیاج به کمک داشتی؟ من همین‌جام.',
  'نمی‌دونی کدوم به کارت میاد؟ بپرس.',
  'سؤالی درباره‌ی تحویل یا گارانتی داری؟',
  'قبل از خرید بپرس — جواب دادن رایگانه.',
];

const FAQ: { keys: string[]; answer: string; chips?: string[] }[] = [
  {
    keys: ['گارانتی', 'ضمانت', 'خراب شد', 'قطع شد', 'کار نمی', 'کار نمیکنه'],
    answer:
      'روی همه‌ی محصولات گارانتی داریم. اگر دسترسی‌ات قبل از پایان دوره قطع شد، جایگزین یا مبلغش را برمی‌گردانیم. تنها شرطش این است که رمز یا ایمیل اکانت دست‌کاری نشده باشد. مدت دقیق گارانتی روی هر محصول نوشته شده.',
    chips: ['چطور تیکت بزنم؟', 'شرایط تعویض چیه؟'],
  },
  {
    keys: ['تحویل', 'چقدر طول', 'کی میرسه', 'زمان', 'فوری', 'آنی'],
    answer:
      'کدهای آماده بلافاصله بعد از پرداخت تحویل می‌شوند. ارتقای اکانت معمولاً کمتر از ۱۵ دقیقه طول می‌کشد. زمان دقیق هر محصول روی صفحه‌ی خودش نوشته شده و بعد از خرید هم در پنل کاربری قابل پیگیری است.',
    chips: ['پیگیری سفارش', 'شروع خرید'],
  },
  {
    keys: ['پرداخت', 'کارت', 'درگاه', 'ریال', 'تومان', 'پول', 'واریز'],
    answer:
      'پرداخت با کارت بانکی ایرانی از طریق درگاه امن انجام می‌شود. مبلغ به تومان است و هیچ کارمزد پنهانی اضافه نمی‌شود. اگر پول کم شد ولی سفارش ثبت نشد، ظرف حداکثر ۷۲ ساعت خودکار برمی‌گردد — و اگر برنگشت تیکت بزن، پیگیری می‌کنیم.',
    chips: ['پیگیری سفارش', 'گارانتی چیه؟'],
  },
  {
    keys: ['رمز', 'پسورد', 'امنیت', 'ایمیل من', 'اطلاعات', 'حریم'],
    answer:
      'هیچ‌وقت رمز عبورت را نمی‌خواهیم. برای محصولاتی که روی اکانت خودت فعال می‌شوند فقط ایمیل یا یوزرنیم لازم است — همان چیزی که خودت روی صفحه‌ی خرید وارد می‌کنی. هیچ اطلاعات دیگری بعد از پرداخت از تو نمی‌پرسیم.',
    chips: ['چطور فعال می‌شه؟'],
  },
  {
    keys: ['ظرفیت', 'اشتراکی', 'مشترک', 'چند نفر', 'اختصاصی'],
    answer:
      'اکانت ظرفیتی یعنی بازی بین چند نفر تقسیم می‌شود و برای همین ارزان‌تر است؛ اکانت اختصاصی کامل مال خودت است. اگر بخش آنلاین برایت مهم است یا بازی را سال‌ها نگه می‌داری، اختصاصی بگیر. راهنمای کاملش را در مقالات نوشته‌ایم.',
    chips: ['فرق ظرفیت دو و سه؟', 'محصولات گیم'],
  },
  {
    keys: ['تیکت', 'پشتیبان', 'تماس', 'شکایت', 'مشکل دارم'],
    answer:
      'از پنل کاربری بخش تیکت‌ها می‌توانی مستقیم پیام بدهی؛ موضوع را که بنویسی خودمان دسته‌بندی‌اش می‌کنیم. سریع‌ترین راه هم همین است، چون سابقه‌ی سفارشت جلوی چشممان است.',
    chips: ['پیگیری سفارش'],
  },
  {
    keys: ['تفاوت', 'فرق', 'مقایسه', 'کدوم بهتر', 'کدام بهتر'],
    answer:
      'تفاوت اصلی در نوع تحویل است: بعضی محصولات روی حساب خودت ارتقا داده می‌شوند (فقط ایمیلت را می‌گیریم)، بعضی کد آماده‌اند و آنی تحویل می‌شوند. روی هر محصول این را نوشته‌ایم. اگر بگویی چه کاری می‌خواهی بکنی، دقیق‌تر راهنماییت می‌کنم.',
    chips: ['محصولات هوش مصنوعی', 'محصولات طراحی'],
  },
  {
    keys: ['تخفیف', 'ارزان‌تر', 'کد تخفیف', 'حراج', 'کمپین'],
    answer:
      'تخفیف‌های روز را بالای صفحه‌ی اصلی روی نوار متحرک می‌بینی. تخفیف‌های کوتاه‌مدت و فقط‌کانالی هم اول در تلگرام اعلام می‌شوند. باشگاه مشتریان هم هست: هرچه بیشتر خرید کنی، درصد ثابت بیشتری می‌گیری.',
    chips: ['پیشنهادهای داغ', 'باشگاه مشتریان'],
  },
  {
    keys: ['لغو', 'کنسل', 'مرجوع', 'پس دادن', 'بازگشت وجه'],
    answer:
      'تا وقتی سفارش تحویل نشده، لغو و بازگشت کامل وجه ممکن است. بعد از تحویلِ کد یا فعال‌سازی، چون محصول دیجیتال مصرف شده، به‌جای بازگشت وجه از گارانتی استفاده می‌کنیم — یعنی اگر مشکلی بود جایگزین می‌شود.',
    chips: ['گارانتی چیه؟', 'تیکت بزنم'],
  },
];

const fmt = (n: number) => n.toLocaleString('fa-IR');

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENER]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const [nudgeLeaving, setNudgeLeaving] = useState(false);
  const [nudgeMuted, setNudgeMuted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  /* حباب یادآوری.

     اولین بار بعد از ۲۰ ثانیه می‌آید و بعد هر دو دقیقه یکی از
     جمله‌ها را نشان می‌دهد. اگر کاربر ببنددش یا چت را باز کند،
     تا پایان همان بازدید دیگر نمی‌آید — اصرار بعد از «نه» آزاردهنده
     است، نه مفید. */
  useEffect(() => {
    if (open || nudgeMuted) { setNudge(null); return; }

    let idx = 0;
    let hideTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      setNudgeLeaving(false);
      setNudge(NUDGES[idx % NUDGES.length]);
      idx += 1;
      hideTimer = setTimeout(() => {
        setNudgeLeaving(true);
        setTimeout(() => setNudge(null), 300);
      }, 9000);
    };

    const first = setTimeout(show, 20000);
    const loop = setInterval(show, 120000);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(loop);
    };
  }, [open, nudgeMuted]);

  const dismissNudge = () => {
    setNudgeLeaving(true);
    setNudgeMuted(true);
    setTimeout(() => setNudge(null), 300);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { id: Date.now(), from: 'user', text: t }]);
    setDraft('');
    setTyping(true);
    // تأخیر کوتاه — پاسخ آنی ماشینی و بی‌اعتماد به نظر می‌رسد
    setTimeout(() => {
      setMessages((m) => [...m, respond(t)]);
      setTyping(false);
    }, 480);
  };

  return (
    <>
      {nudge && !open && (
        <div
          className={`chat__nudge ${nudgeLeaving ? 'is-leaving' : ''}`}
          role="status"
          onClick={() => { setOpen(true); dismissNudge(); }}
        >
          <span className="flex-1">{nudge}</span>
          <button
            type="button"
            className="chat__nudge-close"
            aria-label="بستن یادآوری"
            onClick={(e) => { e.stopPropagation(); dismissNudge(); }}
          >
            <X />
          </button>
        </div>
      )}

      <button
        type="button"
        className={`chat__fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'بستن گفتگو' : 'پشتیبانی آنلاین'}
      >
        <span className="chat__fab-icon">{open ? <X /> : <MessageCircle />}</span>

        {!open && <span className="chat__fab-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="chat" role="dialog" aria-label="پشتیبانی آنلاین فونیکس شاپ">
          <header className="chat__head">
            <div className="chat__head-icon"><Headphones /></div>
            <div className="chat__head-text">
              <b>پشتیبانی آنلاین</b>
              <small>سؤال خرید، تحویل یا گارانتی — همین‌جا بپرس</small>
            </div>
            <button className="chat__close" onClick={() => setOpen(false)} aria-label="بستن">
              <X />
            </button>
          </header>

          <div ref={listRef} className="chat__list">
            {messages.map((m) => (
              <div key={m.id} className={`chat__msg chat__msg--${m.from}`}>
                <p className="chat__bubble">{m.text}</p>

                {m.products && m.products.length > 0 && (
                  <ul className="chat__products">
                    {m.products.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} className="chat__product" onClick={() => setOpen(false)}>
                          <span className="chat__product-dot" style={{ background: p.media.accent }} />
                          <span className="chat__product-body">
                            <b>{p.title}</b>
                            <small>{p.shortDescription}</small>
                          </span>
                          <span className="chat__product-price num-en">
                            {fmt(getLowestPrice(p))}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {m.chips && m.from === 'bot' && (
                  <div className="chat__chips">
                    {m.chips.map((c) => (
                      <button key={c} type="button" className="chat__chip" onClick={() => send(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="chat__msg chat__msg--bot">
                <p className="chat__bubble chat__typing" aria-label="در حال نوشتن">
                  <i /><i /><i />
                </p>
              </div>
            )}
          </div>

          <form
            className="chat__form"
            onSubmit={(e) => { e.preventDefault(); send(draft); }}
          >
            <input
              className="chat__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="مثلاً: می‌خوام ویدیو ادیت کنم"
              aria-label="پیام شما"
            />
            <button type="submit" className="chat__send" disabled={!draft.trim()} aria-label="ارسال">
              <Send />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
