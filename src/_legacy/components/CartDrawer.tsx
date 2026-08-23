import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Tag, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  ArrowRight,
  CreditCard,
  Key,
  QrCode,
  Check,
  UploadCloud,
  Wallet
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  appliedCoupon?: string;
}

type PaymentMethodType = 'gateway' | 'card2card' | 'crypto' | 'wallet';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
}) => {
  const [couponCode, setCouponCode] = useState(appliedCoupon || '');
  const [discountPercent, setDiscountPercent] = useState(appliedCoupon ? 5 : 0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    appliedCoupon ? { type: 'success', text: `کوپن هدیه گیمر (${appliedCoupon}) با ۵٪ تخفیف اعمال شد!` } : null
  );

  React.useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon);
      setDiscountPercent(5);
      setCouponMessage({ type: 'success', text: `کوپن هدیه گیمر (${appliedCoupon}) با ۵٪ تخفیف اعمال شد!` });
    }
  }, [appliedCoupon]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('gateway');
  const [cardTrackCode, setCardTrackCode] = useState('');
  const [copiedCryptoAddress, setCopiedCryptoAddress] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string; pass: string; key: string } | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);
  const usdtAmount = (finalTotal / 620000).toFixed(2); // estimated USDT conversion

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (code === 'PHOENIX20' || code === 'PHOENIX') {
      soundEngine.playSuccess();
      setDiscountPercent(20);
      setCouponMessage({ type: 'success', text: 'کد تخفیف ۲۰ درصدی ققنوس شاپ اعمال شد!' });
    } else if (code === 'VIP') {
      soundEngine.playSuccess();
      setDiscountPercent(15);
      setCouponMessage({ type: 'success', text: 'تخفیف ویژه ۱۵ درصدی اعضای VIP اعمال شد!' });
    } else if (code === 'PHOENIX-VIP5' || code === 'VIP5') {
      soundEngine.playSuccess();
      setDiscountPercent(5);
      setCouponMessage({ type: 'success', text: 'کوپن جایزه بازی (۵٪ تخفیف مافوق صوت) اعمال شد!' });
    } else {
      soundEngine.playClick(300, 0.1);
      setCouponMessage({ type: 'error', text: 'کد تخفیف نامعتبر است. (کد PHOENIX20 را امتحان کنید)' });
    }
  };

  const handleCopyCrypto = () => {
    navigator.clipboard.writeText('TX99qPhoenixShopOfficialTetherWalletTRC20');
    soundEngine.playSuccess();
    setCopiedCryptoAddress(true);
    setTimeout(() => setCopiedCryptoAddress(false), 2000);
  };

  const handleSimulatePayment = () => {
    soundEngine.playFireIgnite();
    setIsCheckingOut(true);

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setGeneratedCredentials({
        email: 'phoenix_user_' + Math.floor(Math.random() * 89999 + 10000) + '@game-cloud.org',
        pass: 'PHX-Key#' + Math.random().toString(36).substring(2, 9).toUpperCase() + '!',
        key: 'PHX-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-VIP99',
      });
      soundEngine.playSuccess();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f43f5e', '#a855f7', '#10b981'],
      });
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#0a0715] border-r border-white/10 shadow-2xl flex flex-col justify-between p-4 sm:p-5 text-right relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <button
              onClick={() => {
                soundEngine.playClick(400, 0.05);
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
                سبد خرید و تسویه‌حساب
              </h3>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </div>
          </div>

          {/* Success State Screen */}
          {orderComplete ? (
            <div className="flex-1 py-6 overflow-y-auto space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
                  پرداخت با موفقیت انجام شد!
                </h4>
                <p className="text-xs text-zinc-400">
                  اطلاعات اکانت و لایسنس شما به صورت آنی صادر شد و در پنل کاربری نیز ذخیره گردید.
                </p>
              </div>

              {/* Instant Credentials Delivery Box */}
              {generatedCredentials && (
                <div className="glass-card rounded-2xl p-4 border border-amber-500/40 text-right space-y-3 bg-amber-500/5">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-white/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Key className="w-4 h-4" />
                      <span>اطلاعات لایسنس تحویل شده</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      STATUS: DELIVERED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-zinc-400">ایمیل اختصاصی:</span>
                      <span className="text-white select-all font-bold">{generatedCredentials.email}</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-zinc-400">رمز عبور:</span>
                      <span className="text-amber-300 select-all font-bold">{generatedCredentials.pass}</span>
                    </div>
                    <div className="bg-black/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="text-zinc-400">کد فعال‌سازی:</span>
                      <span className="text-rose-400 select-all font-bold">{generatedCredentials.key}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center pt-1">
                    گارانتی مادام‌العمر ققنوس شاپ برای این خرید ثبت گردید.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  onClearCart();
                  setOrderComplete(false);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                بستن و بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-white">سبد خرید شما خالی است!</p>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      بازی‌ها، اشتراک‌های هوش مصنوعی و گیفت کارت‌های مورد علاقه خود را اضافه کنید.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="glass-card rounded-2xl p-3 border border-white/8 flex items-center justify-between gap-3 bg-white/[0.02]"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.backdropImage}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate" style={{ fontFamily: 'var(--font-vazir)' }}>
                          {item.product.title}
                        </h4>
                        <span className="text-[10px] text-zinc-400 block truncate">
                          {item.selectedAccountType || item.product.accountType}
                        </span>
                        <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono">
                          {(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                        </div>
                      </div>

                      {/* Quantity Modifier & Remove */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            soundEngine.playClick(400, 0.05);
                            onRemoveItem(item.product.id);
                          }}
                          className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                          title="حذف از سبد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon & Payment Methods & Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-white/10 pt-3 space-y-3.5">
                  
                  {/* Coupon Code Form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                      >
                        اعمال
                      </button>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="کد تخفیف (مثال: PHOENIX20)"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-left font-mono"
                        />
                        <Tag className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    {couponMessage && (
                      <p className={`text-[10px] ${couponMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </form>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 block">انتخاب روش پرداخت:</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playClick(600, 0.04);
                          setSelectedPaymentMethod('gateway');
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'gateway'
                            ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 mx-auto mb-0.5 text-amber-400" />
                        <span className="text-[10px] font-bold block">درگاه بانکی</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playClick(650, 0.04);
                          setSelectedPaymentMethod('card2card');
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'card2card'
                            ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5 mx-auto mb-0.5 text-cyan-400" />
                        <span className="text-[10px] font-bold block">کارت به کارت</span>
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playClick(700, 0.04);
                          setSelectedPaymentMethod('crypto');
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          selectedPaymentMethod === 'crypto'
                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 mx-auto mb-0.5 text-purple-400" />
                        <span className="text-[10px] font-bold block">کریپتو USDT</span>
                      </button>
                    </div>

                    {/* Method Details Info */}
                    {selectedPaymentMethod === 'card2card' && (
                      <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200 space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span>شماره کارت:</span>
                          <span className="font-mono font-bold text-white select-all">۶۰۳۷-۹۹۷۵-۱۸۲۴-۸۸۱۱</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>به نام:</span>
                          <span>پشتیبانی مالی ققنوس شاپ</span>
                        </div>
                        <input
                          type="text"
                          value={cardTrackCode}
                          onChange={(e) => setCardTrackCode(e.target.value)}
                          placeholder="کد پیگیری یا ۴ رقم آخر کارت..."
                          className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                    )}

                    {selectedPaymentMethod === 'crypto' && (
                      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200 space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span>معادل دلاری تتر:</span>
                          <span className="font-mono font-bold text-emerald-400">${usdtAmount} USDT (TRC20)</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/50 p-1.5 rounded-lg border border-purple-500/20">
                          <span className="font-mono text-[9px] text-zinc-300 truncate pl-2">TX99qPhoenixShopOfficialTetherTRC20</span>
                          <button
                            onClick={handleCopyCrypto}
                            className="px-2 py-0.5 rounded bg-purple-500/30 text-[10px] text-purple-300 font-bold shrink-0"
                          >
                            {copiedCryptoAddress ? 'کپی شد!' : 'کپی ولت'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1 text-xs text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">جمع کل سبد خرید:</span>
                      <span className="font-mono">{rawSubtotal.toLocaleString('fa-IR')} تومان</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>تخفیف ({discountPercent}٪):</span>
                        <span className="font-mono">- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm font-black text-white border-t border-white/10 pt-1.5">
                      <span>مبلغ نهایی قابل پرداخت:</span>
                      <span className="text-amber-400 text-base font-mono">
                        {finalTotal.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={isCheckingOut}
                    onClick={handleSimulatePayment}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>در حال پردازش امن و صدور لایسنس...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {selectedPaymentMethod === 'gateway'
                            ? 'اتصال به درگاه بانکی شاپرک'
                            : selectedPaymentMethod === 'card2card'
                            ? 'تایید فیش و صدور لایسنس'
                            : 'تایید واریز کریپتو تتر'}
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>تحویل زیر ۶۰ ثانیه</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>ضمانت ۱۰۰٪ تعویض</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
