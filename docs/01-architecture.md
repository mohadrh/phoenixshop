# ققنوس شاپ — معماری، مدل داده و نقشه‌ی سایت

سند مرجع. هر تصمیم دیزاین یا کدی باید با این سند بخونه.

---

## ۰. خلاصه‌ی بیزینس

فروش دیجیتال با **چهار مدل تحویل کاملاً متفاوت** که سایت فعلی هیچ‌کدوم رو مدل نکرده:

| مدل | مثال | بعد از پرداخت چه اتفاقی می‌افته؟ |
|---|---|---|
| کد از انبار | گیفت کارت اپل، کد استیم | یک کد از انبار قفل و به مشتری داده می‌شه |
| اکانت از انبار | اکانت ظرفیتی PS5، ChatGPT اشتراکی | یوزر/پسورد از انبار تخصیص داده می‌شه |
| **شارژ اکانت مشتری با API** | CP کال‌آف‌دیوتی، UC پابجی، Robux | سیستم با شناسه‌ی بازیکنِ مشتری، API تأمین‌کننده رو صدا می‌زنه |
| **ارتقای اکانت مشتری** | Spotify Premium، Canva Pro، CapCut | مشتری ایمیلش رو می‌ده، سیستم دعوت/ارتقا رو انجام می‌ده |

**نتیجه‌ی طراحی:** «افزودن به سبد» برای همه‌ی محصولات یکسان نیست. بعضی محصولات **قبل از پرداخت ورودی از مشتری می‌خوان** (شناسه‌ی بازیکن، ایمیل اکانت). این باید در تایپ محصول، در کارت محصول، در سبد و در چک‌اوت دیده بشه. این تنها بخشیه که اگر اشتباه ساخته بشه، بقیه‌ی سایت هرچقدر هم قشنگ باشه کار نمی‌کنه.

---

## ۱. تاکسونومی محصولات

### مشکل فعلی

`types.ts` این دسته‌ها رو داره: `education | social | ai | design_gaming | gaming | giftcard | currency`

- `design_gaming` یک دسته‌ی جعلیه — «طراحی» و «گیمینگ» هیچ ربطی به هم ندارن
- `education` و `social` با محصولات واقعی شما هم‌خوان نیست
- `mainCategory` و `category` دو فیلد موازی با منطق تکراری‌اند
- `tags: string[]` آزاده — یعنی فیلتر قابل اتکا نمی‌شه ساخت

### دسته‌بندی جدید — ۵ دسته‌ی اصلی

```
۱. هوش مصنوعی            /shop/ai
   ├─ چت و دستیار         /shop/ai/chat          ChatGPT, Claude, Gemini, Perplexity, Grok
   ├─ تصویر و ویدیو       /shop/ai/visual        Midjourney, Runway, Kling, Sora, Leonardo
   ├─ کدنویسی             /shop/ai/coding        Cursor, Copilot, Windsurf
   └─ کردیت API           /shop/ai/api           OpenAI, Anthropic, Google AI

۲. موزیک و سرگرمی        /shop/entertainment
   ├─ موزیک               /shop/entertainment/music     Spotify, Apple Music, SoundCloud
   ├─ ویدیو               /shop/entertainment/video     YouTube Premium, Netflix, Disney+
   └─ پادکست و کتاب       /shop/entertainment/audio     Audible, Storytel

۳. طراحی و تولید محتوا    /shop/creative
   ├─ گرافیک              /shop/creative/graphic        Canva, Adobe CC, Figma
   ├─ ویدیو و ادیت        /shop/creative/video          CapCut, Premiere, DaVinci
   └─ منابع و استوک       /shop/creative/assets         Envato, Freepik, Motion Array

۴. گیمینگ                 /shop/gaming
   ├─ اکانت بازی          /shop/gaming/accounts         ظرفیتی و قانونی
   ├─ اشتراک              /shop/gaming/subscriptions    Game Pass, PS Plus, EA Play
   ├─ ارز و آیتم درون‌بازی /shop/gaming/currency        CP, UC, V-Bucks, VP, Robux
   └─ بازی و DLC          /shop/gaming/titles           Steam, Epic, PSN

۵. گیفت کارت              /shop/giftcards
   ├─ اپل و گوگل          /shop/giftcards/mobile        iTunes, Google Play
   ├─ کنسول و استیم       /shop/giftcards/gaming        Steam, PSN, Xbox, Nintendo
   └─ عمومی               /shop/giftcards/general       Amazon, Visa, Mastercard
```

### فست‌ها (فیلترهای متقاطع)

اینها **دسته نیستن، تگ آزاد هم نیستن** — مقدارهای بسته‌ان که فیلتر و URL می‌سازن:

| فست | مقادیر | نمونه‌ی URL |
|---|---|---|
| `delivery` | `instant` آنی • `auto` خودکار • `fast` تا ۱۵ دقیقه • `manual` دستی | `?delivery=instant` |
| `accountType` | `private` اختصاصی • `shared` ظرفیتی • `on_your_email` روی ایمیل شما • `code` کد فعال‌سازی • `topup` شارژ روی اکانت شما |
| `duration` | `1m` `3m` `6m` `12m` `lifetime` `one_time` |
| `region` | `global` `us` `tr` `eu` `ar` `ir` |
| `warranty` | `none` • `7d` • `30d` • `full_term` تمام دوره |
| `stock` | `in_stock` `low` `out` `preorder` |
| `priceRange` | بازه‌ی عددی |

فیلتر ترکیبی توی URL: `/shop/ai/chat?delivery=instant&accountType=private&duration=1m`
این برای SEO حیاتیه — هر ترکیب پرتقاضا یک صفحه‌ی قابل ایندکس می‌شه.

---

## ۲. مدل داده

### تایپ محصول (بازنویسی کامل)

```ts
/** مدل تحویل — تعیین می‌کنه بعد از پرداخت چه اتفاقی می‌افته */
export type FulfillmentMode =
  | 'stock_code'       // کد از انبار
  | 'stock_account'    // یوزر/پسورد از انبار
  | 'api_topup'        // شارژ اکانت خودِ مشتری از طریق API تأمین‌کننده
  | 'api_provision'    // خرید/ساخت خودکار اکانت از تأمین‌کننده
  | 'upgrade_on_user'  // ارتقای اکانت خود مشتری (دعوت خانوادگی، ارتقای پلن)
  | 'manual';          // اپراتور انسانی

/** ورودی‌ای که قبل از پرداخت باید از مشتری گرفته بشه */
export interface RequiredInput {
  key: string;                 // 'activisionId' | 'email' | 'playerTag'
  label: string;               // «آی‌دی اکتیویژن شما»
  hint?: string;               // «در بازی از منوی Account کپی کنید»
  type: 'text' | 'email' | 'number';
  pattern?: string;            // اعتبارسنجی سمت کلاینت و سرور
  example?: string;
  required: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;               // «۱ ماهه»، «۲۴۰۰ CP»، «۵۰ دلار»
  price: number;               // تومان
  compareAtPrice?: number;
  sku: string;
  stock: number | null;        // null = نامحدود (مثلاً api_topup)
  duration?: Duration;
  region?: Region;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  slug: string;                // برای URL — /product/chatgpt-plus
  title: string;               // فارسی
  englishTitle: string;
  brand: string;               // OpenAI, Spotify, Activision — برای گروه‌بندی و لوگو

  category: CategorySlug;
  subcategory: SubcategorySlug;

  fulfillment: FulfillmentMode;
  requiredInputs: RequiredInput[];   // خالی برای stock_code
  deliveryEstimate: string;          // «کمتر از ۶۰ ثانیه»

  variants: ProductVariant[];        // حداقل یکی
  accountType: AccountType;
  warranty: WarrantyLevel;
  warrantyDays: number;

  media: {
    thumbnail: string;
    cover: string;             // بک‌گراند کارت
    cutout?: string;           // PNG شفاف برای لایه‌ی جلو
    logo?: string;             // لوگوی برند
    gallery?: string[];
  };

  rating: number;
  reviewsCount: number;
  salesCount: number;          // «۱٬۲۴۰ فروش» — اعتمادساز واقعی

  shortDescription: string;    // یک خط، برای کارت
  description: string;         // کامل، برای صفحه‌ی محصول
  features: string[];
  faq: { q: string; a: string }[];
  notes?: string[];            // «نیاز به VPN ندارد»، «قابل استفاده روی ۱ دستگاه»

  badges: Badge[];             // 'hot' | 'new' | 'bestseller' | 'limited' | 'exclusive'
  seo: { title: string; description: string; };
}
```

### تفاوت مهم با مدل فعلی

| مدل فعلی | مدل جدید | چرا |
|---|---|---|
| `price: number` تکی | `variants[]` | «اسپاتیفای» یک قیمت نداره — ۱ماهه/۳ماهه/۶ماهه/سالانه داره |
| `stockStatus` رشته‌ای | `stock: number` روی هر واریانت | «۳ عدد باقی مانده» فوریت واقعی می‌سازه |
| ندارد | `fulfillment` + `requiredInputs` | بدون این، شارژ خودکار اصلاً ممکن نیست |
| `id` در URL | `slug` | `/product/chatgpt-plus` نه `/product/p-42` |
| ندارد | `salesCount` | مهم‌ترین سیگنال اعتماد در این بازار |
| ندارد | `brand` | برای صفحه‌ی برند و SEO |

### وضعیت سفارش

```
awaiting_payment ──> paid ──> fulfilling ──> delivered ──> completed
       │                          │
       │                          ├──> failed ──> refunded
       ↓                          └──> needs_input (ورودی مشتری غلط بود)
   cancelled                                │
                                            ↓
                                     manual_review (اپراتور)

مسیرهای جانبی: warranty_claim، replaced، disputed
```

هر گذار باید به مشتری اطلاع بده (اس‌ام‌اس + نوتیف داخل پنل) و در تایم‌لاین سفارش ثبت بشه.

---

## ۳. نقشه‌ی سایت

```
/                                 خانه
/shop                             فروشگاه — همه + فیلتر
/shop/[category]                  دسته
/shop/[category]/[subcategory]    زیردسته
/brand/[slug]                     همه‌ی محصولات یک برند (SEO)
/product/[slug]                   محصول
/cart                             سبد خرید
/checkout                         تسویه (چندمرحله‌ای)
/checkout/result/[orderId]        نتیجه‌ی پرداخت + تحویل فوری
/track                            رهگیری سفارش برای مهمان (کد پیگیری + موبایل)

/account                          → ریدایرکت به overview
/account/overview                 داشبورد
/account/orders                   سفارش‌ها
/account/orders/[id]              جزئیات سفارش + تحویل
/account/vault                    ★ گاوصندوق — همه‌ی اکانت‌ها و کدهای خریداری‌شده
/account/subscriptions            اشتراک‌های فعال + شمارش معکوس تمدید
/account/wallet                   کیف پول، شارژ، تراکنش‌ها
/account/tickets                  تیکت‌ها
/account/tickets/[id]
/account/warranty                 درخواست گارانتی و تعویض
/account/referrals                دعوت دوستان و پاداش
/account/settings                 پروفایل، امنیت، اعلان‌ها

/auth/login                       ورود با شماره موبایل
/auth/verify                      کد یکبارمصرف

/blog                             وبلاگ (محتوا از وردپرس)
/blog/[slug]
/help                             راهنما و سوالات متداول
/help/[slug]
/rules                            قوانین و شرایط
/about  /contact
/404                              ★ صفحه‌ی سینمایی خروج از بازی
```

★ = بخش‌های متمایزکننده که رقبا ندارن.

---

## ۴. پنل کاربری — ایده‌ی محوری: «گاوصندوق»

مشکل واقعی مشتری این بازار: **شش ماه بعد یادش نیست اکانتی که خریده چی بود و رمزش کجاست.** بیشتر فروشگاه‌ها کد رو توی تلگرام می‌فرستن و تمام.

`/account/vault` هر چیزی که مشتری تا حالا خریده رو نگه می‌داره:

- **افشای امن:** رمز به‌صورت `••••••••` — با یک کلیک نمایش + دکمه‌ی کپی
- **شمارش معکوس گارانتی:** «۲۳ روز گارانتی باقی مانده» روی هر آیتم
- **یک‌کلیک گارانتی:** دکمه‌ی «این اکانت مشکل داره» → تیکت با اطلاعات سفارش از قبل پرشده
- **یادآور انقضا:** «اشتراک اسپاتیفای شما ۵ روز دیگه تموم می‌شه» + دکمه‌ی تمدید با یک کلیک
- **جست‌وجو و فیلتر** روی خریدهای گذشته

### داشبورد (`/account/overview`)

چهار بلوک، به ترتیب اهمیت برای مشتری:
1. **اکشن فوری** — سفارشی که منتظر ورودی شماست، یا اشتراکی که داره تموم می‌شه
2. **اشتراک‌های فعال** — کارت‌های کوچک با نوار پیشرفت تا انقضا
3. **آخرین سفارش‌ها** — سه تای آخر با وضعیت زنده
4. **کیف پول و امتیاز** — موجودی + سطح باشگاه مشتریان

---

## ۵. فلوی خرید

```
کارت محصول
   │
   ├─ محصول ساده (stock_code) ──────────> مستقیم به سبد ✈ (انیمیشن Su-57)
   │
   └─ محصول واریانت‌دار یا ورودی‌دار ────> شیت انتخاب سریع
                                             ├─ انتخاب واریانت (۱/۳/۶/۱۲ ماهه)
                                             ├─ گرفتن ورودی (آی‌دی بازیکن / ایمیل)
                                             └─ به سبد ✈

سبد ──> چک‌اوت
          ۱. تأیید هویت (موبایل + کد یکبارمصرف)
          ۲. بازبینی ورودی‌ها  ← اینجا غلط بودن آی‌دی گرفته می‌شه، نه بعد از پرداخت
          ۳. کد تخفیف / کیف پول
          ۴. انتخاب درگاه
          ۵. پرداخت
          ↓
      نتیجه ──> اگر آنی: کد/اکانت همون‌جا نمایش داده می‌شه
                اگر خودکار: نوار پیشرفت زنده‌ی شارژ
                اگر دستی: زمان تخمینی + اطلاع‌رسانی
```

**قانون:** هیچ ورودی‌ای بعد از پرداخت گرفته نمی‌شه. هر ورودی لازم، قبل از رفتن به درگاه اعتبارسنجی می‌شه.

---

## ۶. معماری فنی

### الگو: BFF (بک‌اند برای فرانت‌اند)

```
مرورگر
   │  fetch به مسیرهای داخلی خودمون
   ↓
Next.js Route Handlers  (/app/api/*)   ← کلیدها فقط اینجا، هرگز سمت کلاینت
   ├──> WooCommerce REST API      محصول، دسته، سفارش، مشتری
   ├──> درگاه پرداخت              زرین‌پال / آیدی‌پی
   ├──> API تأمین‌کننده‌ها          شارژ خودکار
   └──> سرویس پیامک                کد یکبارمصرف و اطلاع‌رسانی
```

مرورگر **هرگز** مستقیم با ووکامرس حرف نمی‌زنه. کلیدهای ووکامرس و درگاه فقط سمت سرور.

### ساختار پوشه

```
src/
├─ app/
│  ├─ (marketing)/              خانه، درباره، وبلاگ، راهنما
│  ├─ (shop)/                   فروشگاه، محصول، برند
│  ├─ (checkout)/               سبد، چک‌اوت — بدون هدر و فوتر شلوغ
│  ├─ (account)/                پنل کاربری — لایوت اختصاصی
│  ├─ api/                      Route Handlers
│  ├─ not-found.tsx             ★ صفحه‌ی ۴۰۴ سینمایی
│  └─ layout.tsx
│
├─ features/                    منطق دامنه — هر فیچر مستقل
│  ├─ catalog/                  محصول، فیلتر، جست‌وجو
│  ├─ cart/
│  ├─ checkout/
│  ├─ fulfillment/              ★ موتور تحویل
│  ├─ account/
│  └─ auth/
│
├─ components/
│  ├─ ui/                       دکمه، ورودی، مودال — بی‌طرف
│  ├─ motion/                   ★ کامپوننت‌های موشن قابل استفاده‌ی مجدد
│  └─ three/                    ★ صحنه‌های سه‌بعدی (Su-57، ققنوس، مرد عنکبوتی)
│
├─ lib/
│  ├─ woo/                      کلاینت ووکامرس + نگاشت تایپ‌ها
│  ├─ payment/
│  └─ utils/
│
├─ data/                        داده‌ی موقت — همون شکل خروجی ووکامرس
├─ styles/                      توکن‌های دیزاین
└─ types/
```

**نکته‌ی کلیدی برای قابلیت ارتقا:** `data/` و `lib/woo/` **دقیقاً یک تایپ برمی‌گردونن**. روز اتصال به وردپرس، فقط منبع عوض می‌شه — هیچ کامپوننتی دست نمی‌خوره.

### نگاشت به ووکامرس

| مدل ما | ووکامرس |
|---|---|
| `Product` | Product (variable) |
| `ProductVariant` | Product Variation |
| `category` / `subcategory` | `product_cat` (سلسله‌مراتبی) |
| `brand` | `product_brand` یا تکسونومی سفارشی |
| `accountType` `region` `duration` | Attributes: `pa_account_type`, `pa_region`, `pa_duration` |
| `fulfillment` | متای محصول `_phx_fulfillment_mode` |
| `requiredInputs` | متای محصول `_phx_required_inputs` (JSON) |
| `warrantyDays` | متای محصول `_phx_warranty_days` |
| انبار کدها | جدول سفارشی `wp_phx_codes` — نه متای محصول |
| ورودی مشتری | متای آیتم سفارش `_phx_input_*` |

**وردپرس برای SEO:** وبلاگ و صفحات راهنما از وردپرس خونده می‌شن (WP REST API) و با دیزاین اختصاصی خودمون رندر می‌شن. یعنی تیم محتوا با پنل آشنای وردپرس کار می‌کنه، ولی ظاهر سایت هیچ ربطی به قالب وردپرس نداره.

---

## ۷. جهت‌گیری دیزاین

| اصل | یعنی چه |
|---|---|
| مینیمال ولی سینمایی | فضای خالی زیاد، تایپوگرافی بزرگ، نور و سایه به‌جای شلوغی |
| تاریک و گیمینگ | پس‌زمینه‌ی خیلی تیره، لهجه‌ی رنگی از گرادیانت ققنوس، نه رنگین‌کمان |
| موشن هدفمند | هر انیمیشن باید یک کار بکنه: جهت بده، تأیید کنه، یا لذت بده. هیچ‌کدوم نباید حواس‌پرت‌کن باشه |
| نرم با اوج‌های هیجانی | ۹۰٪ حرکت‌ها آروم (۲۰۰–۴۰۰ms). فقط لحظه‌های خاص (افزودن به سبد، تکمیل خرید) هیجانی |
| شفافیت | قیمت، زمان تحویل، گارانتی و موجودی همیشه پیدا — بدون کلیک اضافه |

### فهرست موشن‌ها

| # | موشن | جایگاه | اولویت |
|---|---|---|---|
| ۱ | هیرو: پارالاکس سه‌لایه + ماسک‌رویل + Ken Burns | خانه | **بالا** |
| ۲ | Su-57 پرواز به سبد | همه‌ی دکمه‌های افزودن | **بالا** |
| ۳ | ققنوس اسکرول-تو-تاپ (لوگوموشن) | همه‌ی صفحات | **بالا** |
| ۴ | ۴۰۴ سینمایی با ویدیو | `/not-found` | **بالا** |
| ۵ | مرد عنکبوتی سه‌بعدی تارانداز | جایگزین/کنار ققنوس | متوسط |
| ۶ | ریویل کارت‌ها هنگام اسکرول | فروشگاه | متوسط |
| ۷ | افشای کد در گاوصندوق | پنل | متوسط |
| ۸ | نوار پیشرفت زنده‌ی شارژ خودکار | نتیجه‌ی پرداخت | متوسط |

**قاعده‌ی سخت:** همه‌ی موشن‌ها زیر `prefers-reduced-motion` غیرفعال می‌شن. صحنه‌های سه‌بعدی روی موبایل و دستگاه ضعیف به نسخه‌ی سبک سقوط می‌کنن.

---

## ۸. فازبندی ساخت

| فاز | خروجی | وضعیت |
|---|---|---|
| ۱ | این سند | ✅ |
| ۲ | اسکلت Next.js + لایه‌ی داده‌ی قابل تعویض | در حال انجام |
| ۳ | دیزاین سیستم از گرادیانت لوگو | منتظر لوگو |
| ۴ | هیرو (پارالاکس سه‌لایه) | منتظر عکس‌ها |
| ۵ | ۴۰۴ سینمایی | منتظر ویدیو |
| ۶ | کارت محصول، فروشگاه، فیلتر | — |
| ۷ | صفحه‌ی محصول + شیت انتخاب واریانت/ورودی | — |
| ۸ | سبد و چک‌اوت | — |
| ۹ | پنل کاربری + گاوصندوق | — |
| ۱۰ | اتصال به ووکامرس + درگاه + موتور تحویل | — |
