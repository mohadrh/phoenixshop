# نقشه‌ی بک‌اند فونیکس شاپ

سندی برای وقتی که لاراول را باز می‌کنی. جدول‌ها، مسیرهای API، و اینکه
هر صفحه‌ی موجودِ فرانت‌اند به کدام مسیر وصل می‌شود.

این طرح از روی تایپ‌های واقعی همین پروژه نوشته شده — `src/data/catalog.ts`،
`src/lib/orders.ts`، `src/lib/tickets.ts` و `src/data/account.ts` — نه از روی
یک الگوی عمومی فروشگاه. یعنی وقتی API را ساختی، فرانت‌اند بدون تغییر
کامپوننت وصل می‌شود.

---

## ۰. اصلی که همه‌چیز رویش سوار است

> **بعد از پرداخت هیچ اطلاعاتی از مشتری نمی‌گیریم.**

هر چیزی که برای تحویل لازم است — ایمیل، یوزرنیم تلگرام — **قبل** از رفتن به
درگاه گرفته و اعتبارسنجی می‌شود. این تصمیم محصول است، نه فنی، و روی طراحی
جدول‌ها اثر مستقیم دارد: `order_items.inputs` در لحظه‌ی ثبت سفارش پر است و
بعد از آن فقط خوانده می‌شود.

---

## ۱. احراز هویت — اول این

تنها چیزی که واقعاً مانع شروع بک‌اند است. الان فرانت‌اند هیچ ورودی ندارد و
سفارش‌ها در `localStorage` مرورگر می‌نشینند؛ یعنی کاربر با عوض کردن مرورگر
سفارش‌هایش را از دست می‌دهد.

**روش: OTP روی شماره‌ی موبایل.** بدون رمز عبور. برای بازار ایران هم طبیعی‌تر
است و هم یک سطح کامل از مشکلات امنیتی (نشت رمز، بازیابی رمز) را حذف می‌کند.

```
users
  id
  phone            unique, E.164 یا 09xxxxxxxxx یکدست‌شده
  name             nullable
  email            nullable, برای ارسال تحویل
  tier             enum: bronze | silver | gold | phoenix
  wallet_balance   bigint, تومان
  total_spent      bigint, مبنای محاسبه‌ی سطح
  created_at, updated_at

otp_codes
  id
  phone
  code_hash        هرگز خام ذخیره نشود
  expires_at       ۲ دقیقه
  attempts         سقف ۵، بعدش باطل
  consumed_at      nullable
  ip               برای محدودسازی
```

**نکته‌های امنیتی که نباید فراموش شوند:**

- کد را **هش‌شده** ذخیره کن. اگر دیتابیس لو رفت، کدهای فعال نباید قابل استفاده باشند.
- روی `phone` و روی `ip` جداگانه rate limit بگذار — وگرنه یک نفر می‌تواند
  با پیمایش شماره‌ها هزینه‌ی پیامک تو را بسوزاند.
- بعد از تأیید موفق، `consumed_at` را پر کن. کد یک‌بارمصرف است.
- توکن با **Sanctum**. برای این سایت توکن ساده کافی است؛ نیازی به Passport و OAuth نیست.

```
POST /api/auth/request-otp   { phone }              → 204
POST /api/auth/verify-otp    { phone, code }        → { token, user }
POST /api/auth/logout                               → 204
GET  /api/me                                        → { user }
PATCH /api/me                { name?, email? }      → { user }
```

---

## ۲. کاتالوگ

از `src/data/catalog.ts` مستقیماً ترجمه می‌شود.

```
categories
  id, slug (ai|creative|social|education|gaming)
  title, tagline, icon, accent, sort_order

products
  id
  slug              unique
  title             فارسی
  english_title
  brand
  category_id
  fulfillment       enum: stock_code | stock_account
                        | upgrade_on_user | api_topup | manual
  delivery_estimate  متن، مثل «کمتر از ۱۵ دقیقه»
  warranty_label
  short_description, description
  features           json آرایه
  notes              json آرایه، nullable
  faq                json [{q,a}], nullable
  platforms          json آرایه، nullable
  media              json {thumbnail, cover?, cutout?, accent}
  rating             decimal
  reviews_count, sales_count
  badges             json: hot|new|bestseller|limited
  is_active          boolean
  created_at, updated_at

product_variants
  id, product_id
  code              همان id در فرانت، مثل tg-3m
  label             «سه ماهه»
  price             bigint تومان
  compare_at        bigint nullable — برای نمایش تخفیف
  stock             int nullable (null = نامحدود)
  is_default        boolean
  sort_order

product_required_inputs
  id, product_id
  key               telegramUsername
  label, hint, example
  type              text | email | number
  pattern           regex اعتبارسنجی
  sort_order

tags  /  product_tag        رابطه‌ی چند‌به‌چند
```

**چرا `required_inputs` جدول جداست و نه ستون json:** چون سرور باید موقع ثبت
سفارش همین قوانین را اعتبارسنجی کند. اعتبارسنجی سمت کلاینت هیچ ارزش امنیتی
ندارد — هر کسی می‌تواند درخواست را دستکاری کند.

```
GET /api/categories                    → همه‌ی دسته‌ها با تعداد
GET /api/products?category=&tag=&platform=&sort=&q=&page=
GET /api/products/{slug}               → محصول کامل با واریانت‌ها و ورودی‌ها
GET /api/products/deals                → فقط تخفیف‌دارها، برای چرخ‌فلک
```

---

## ۳. انبار راز — حساس‌ترین بخش

اینجا جایی است که ووکامرس واقعاً کم می‌آورد و دلیل اصلی نوشتن بک‌اند
اختصاصی است.

```
stock_secrets
  id
  product_variant_id
  kind              code | account
  payload_encrypted  رمزنگاری‌شده، هرگز خام
  status            available | reserved | delivered | void
  reserved_until    nullable — رزرو موقت هنگام پرداخت
  order_item_id     nullable — بعد از تحویل پر می‌شود
  created_at, delivered_at
```

**مشکل واقعی: دو نفر هم‌زمان آخرین کد را می‌خرند.**

این «کم شدن موجودی» نیست، یک شرط رقابتی است. اگر با `SELECT` بعد `UPDATE`
حلش کنی، هر دو همان ردیف را می‌بینند و هر دو کد را می‌گیرند.

راه درست، قفل ردیف در تراکنش است:

```php
DB::transaction(function () use ($variantId, $orderItem) {
    $secret = StockSecret::where('product_variant_id', $variantId)
        ->where('status', 'available')
        ->lockForUpdate()          // ← بدون این، شرط رقابتی برمی‌گردد
        ->first();

    if (! $secret) {
        throw new OutOfStockException();
    }

    $secret->update([
        'status'        => 'delivered',
        'order_item_id' => $orderItem->id,
        'delivered_at'  => now(),
    ]);
});
```

`lockForUpdate()` ردیف را تا پایان تراکنش قفل می‌کند؛ درخواست دوم پشت آن
صف می‌کشد و وقتی نوبتش شد ردیف دیگر `available` نیست.

**رمزنگاری:** از `Crypt::encryptString()` لاراول استفاده کن، نه ذخیره‌ی خام.
اگر دیتابیس لو رفت، کدهای فروخته‌نشده نباید قابل استفاده باشند. کلید در
`APP_KEY` است، پس آن را جدا از دیتابیس نگه دار.

---

## ۴. سفارش و پرداخت

```
orders
  id
  code              PHX-123456، unique، همانی که کاربر می‌بیند
  user_id
  status            enum: awaiting_payment | paid | fulfilling
                        | delivered | needs_input | failed | refunded
  phone             کپی می‌شود، چون کاربر ممکن است بعداً عوضش کند
  gateway           zarinpal | idpay
  ref_id            nullable — شناسه‌ی تراکنش درگاه
  authority         nullable — توکن مرحله‌ی اول درگاه
  subtotal, discount, wallet_used, payable   همه bigint
  coupon_id         nullable
  note              nullable
  created_at, paid_at, delivered_at

order_items
  id, order_id
  product_id, product_variant_id
  title_snapshot, variant_label_snapshot     ← عمداً کپی
  quantity
  price             قیمت لحظه‌ی خرید
  inputs            json — ورودی‌های تأییدشده‌ی مشتری
  delivery_estimate
  secret_id         nullable
  status            pending | delivered | failed
```

**چرا `title_snapshot` و `price` کپی می‌شوند:** فاکتور باید همان چیزی را
نشان دهد که در لحظه‌ی خرید بوده. اگر بعداً قیمت یا نام محصول عوض شود،
سفارش قدیمی نباید تغییر کند. این یک باگ رایج است که فقط وقتی معلوم می‌شود
که مشتری با فاکتور قدیمی برگردد.

### جریان پرداخت — چهار مرحله، هیچ‌کدام حذف‌شدنی نیست

```
۱. POST /api/orders
      اعتبارسنجی سرور: قیمت‌ها، موجودی، ورودی‌های لازم
      → سفارش با awaiting_payment ثبت می‌شود
      → کدها reserved می‌شوند با reserved_until = now + 15min

۲. POST /api/orders/{code}/pay
      → درخواست به درگاه، authority می‌گیرد
      → { redirect_url }

۳. کاربر در درگاه پرداخت می‌کند و برمی‌گردد به
      /checkout/callback?Authority=...&Status=OK

۴. POST /api/payments/verify   { authority, status }
      → تأیید سمت سرور با درگاه
      → paid + ref_id، بعد به صف تحویل
```

**مرحله‌ی ۴ حذف‌شدنی نیست.** آدرس برگشت از درگاه در دست کاربر است؛ هر کسی
می‌تواند `?Status=OK` را دستی بزند. تنها چیزی که پرداخت را اثبات می‌کند،
پاسخ خود درگاه به درخواست تأییدِ سرورِ توست.

**رزرو ۱۵ دقیقه‌ای** هم لازم است: بین ثبت سفارش و برگشت از درگاه، کد نباید
به کس دیگری فروخته شود. یک job زمان‌بندی‌شده رزروهای منقضی را آزاد می‌کند.

---

## ۵. صف تحویل

```
fulfilment_jobs
  id, order_item_id
  mode              همان fulfillment محصول
  attempts          شمارنده
  last_error        nullable
  status            queued | running | done | failed | needs_human
  run_after         برای عقب‌نشینی نمایی
```

هر حالت `fulfillment` یک هندلر جدا دارد:

| حالت | کار |
|---|---|
| `stock_code` | یک راز `available` را قفل و تحویل می‌دهد |
| `stock_account` | همان، ولی یوزر/پسورد |
| `upgrade_on_user` | با ایمیل مشتری کار دستی — به صف انسانی می‌رود |
| `api_topup` | تماس با API طرف سوم، با تلاش مجدد |
| `manual` | مستقیم به صف انسانی |

**عقب‌نشینی نمایی**: تلاش دوم بعد از ۱ دقیقه، سوم ۵ دقیقه، چهارم ۳۰ دقیقه.
بعد از آن `needs_human` و اطلاع به پشتیبانی. تلاش بی‌وقفه روی API طرف سوم
فقط باعث بلاک شدن می‌شود.

```
GET /api/orders                 → سفارش‌های من
GET /api/orders/{code}          → جزئیات
GET /api/track/{code}           → پیگیری عمومی، بدون ورود
```

---

## ۶. گاوصندوق، کیف پول، باشگاه

```
vault_items
  id, user_id, order_item_id
  kind              code | account | upgrade
  payload_encrypted
  warranty_ends_at
  revealed_at       nullable — چه زمانی کاربر دیدش

wallet_transactions
  id, user_id
  kind              cashback | refund | spend | topup
  amount            bigint، منفی برای خرج
  order_id          nullable
  description

coupons
  id, code unique
  percent           یا amount
  min_tier          nullable — کد مخصوص سطح
  usage_limit, used_count
  starts_at, expires_at
  is_active
```

**سطح باشگاه محاسبه می‌شود، ذخیره نمی‌شود** — یا اگر ذخیره شد، بعد از هر
سفارش موفق دوباره حساب شود. مبنا `total_spent` است.

```
GET  /api/vault                      → آیتم‌های تحویل‌شده
POST /api/vault/{id}/reveal          → لاگ می‌شود، برای گارانتی
GET  /api/wallet                     → موجودی و تراکنش‌ها
POST /api/coupons/validate  { code } → { valid, percent }
```

اعتبارسنجی کوپن **باید** سمت سرور باشد. الان در فرانت‌اند یک نگاشت ثابت است
که هر کسی می‌تواند در کنسول ببیندش.

---

## ۷. تیکت پشتیبانی

```
tickets
  id, code (PHX-123456), user_id
  subject, category, priority (low|normal|high)
  status            open | answered | closed
  order_id          nullable
  unread_by_user    boolean
  created_at, updated_at

ticket_messages
  id, ticket_id
  author_type       user | support
  author_id
  body
  attachment_path   nullable
  created_at
```

```
GET  /api/tickets
POST /api/tickets            { subject, category, priority, message, order_code? }
GET  /api/tickets/{code}
POST /api/tickets/{code}/reply   { body }
POST /api/tickets/{code}/close
```

---

## ۸. محتوا

```
articles            slug, title, excerpt, body(json blocks), topic,
                    read_minutes, cover, published_at, is_published
help_articles       برای پیشنهاد خودکار موقع ثبت تیکت
news_items          عرضه‌های در راه، با زنگوله
hero_slides         بنرهای هیرو، قابل تغییر از پنل
reminders           user_id, news_item_id  ← زنگوله‌ی «خبرم کن»
```

الان `hero_slides` و `articles` فایل ثابت‌اند. آوردنشان به دیتابیس یعنی
می‌توانی بدون دیپلوی، بنر عوض کنی.

---

## ۹. نقشه‌ی صفحه به API

| صفحه‌ی فعلی | مسیر API |
|---|---|
| `/` | `GET /api/products/deals`، `GET /api/categories`، `hero-slides` |
| `/shop`, `/shop/[category]` | `GET /api/products` با فیلتر |
| `/product/[slug]` | `GET /api/products/{slug}` |
| `/checkout` | `POST /api/orders` → `pay` → `verify` |
| `/track` | `GET /api/track/{code}` |
| `/account` (سفارش‌ها) | `GET /api/orders` |
| `/account/vault` | `GET /api/vault` |
| `/account/wallet` | `GET /api/wallet` |
| `/account/tickets` | `GET/POST /api/tickets` |
| `/blog`, `/blog/[slug]` | `GET /api/articles` |
| `/faq` | `GET /api/help-articles` |

---

## ۱۰. ترتیب کار

۱. **احراز هویت** — بدون این بقیه مالک ندارند
۲. **کاتالوگ + سیدر** — قیمت‌های واقعی همین‌جا وارد می‌شوند
۳. **سفارش + درگاه** — تا اینجا سایت واقعاً می‌فروشد
۴. **انبار راز + صف تحویل** — تا اینجا خودکار تحویل می‌دهد
۵. **گاوصندوق، کیف پول، باشگاه**
۶. **تیکت**
۷. **محتوا** — آخر، چون فایل ثابت فعلاً کار می‌کند

بعد از قدم ۳ سایت قابل بهره‌برداری است. بقیه بهبود است، نه پیش‌نیاز.

---

## ۱۱. اتصال به فرانت‌اند

مرورگر هیچ‌وقت مستقیم با لاراول حرف نمی‌زند. همه‌چیز از Route Handlerهای
خود Next.js می‌گذرد:

```
مرورگر → /api/... در Next.js → لاراول
```

سه دلیل: توکن API در سرور می‌ماند و در جاوااسکریپت مرورگر دیده نمی‌شود،
مشکل CORS از بین می‌رود، و می‌شود پاسخ‌ها را در همان لایه کش کرد.

**چه چیزی در فرانت‌اند عوض می‌شود:** فقط `src/lib/orders.ts` و
`src/lib/tickets.ts` — که عمداً شبیه کلاینت API نوشته شده‌اند — و
`src/data/*.ts` که به `fetch` تبدیل می‌شوند. **هیچ کامپوننتی دست نمی‌خورد**،
چون تایپ‌ها همان می‌مانند.
