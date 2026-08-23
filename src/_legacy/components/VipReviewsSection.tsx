import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { REVIEWS } from '../data/products';
import { Crown, Star, CheckCircle, ShieldCheck, Sparkles, Trophy, Gift, Zap, MessageSquare, ThumbsUp, Send, Filter, Plus, Flame } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NewReviewForm {
  name: string;
  game: string;
  rating: number;
  comment: string;
}

export const VipReviewsSection: React.FC = () => {
  const [liveTicker, setLiveTicker] = useState('امیر از مشهد همین الان اکانت GTA VI خرید!');
  const [isVipJoined, setIsVipJoined] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'game' | 'ai' | 'giftcard'>('all');
  const [userReviews, setUserReviews] = useState<Review[]>(REVIEWS);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'rev-1': 24,
    'rev-2': 41,
    'rev-3': 18,
    'rev-4': 35,
  });
  
  // Submit new review modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newReview, setNewReview] = useState<NewReviewForm>({
    name: '',
    game: '',
    rating: 5,
    comment: '',
  });
  const [hoverRating, setHoverRating] = useState(0);

  const tickerMessages = [
    'امیر از مشهد همین الان اکانت GTA VI خرید! 🔥',
    'پرهام از تهران اشتراک ChatGPT Plus قانونی دریافت کرد ⚡',
    'سارا از اصفهان گیفت کارت ۲۰ دلاری استیم تحویل گرفت 🎮',
    'مهدی از شیراز اشتراک Midjourney v6 Pro فعال کرد ✨',
    'علیرضا از تبریز اکانت Call of Duty Modern Warfare خرید 🎯',
    'نیما از کرج اشتراک Cursor Pro کدنویسی فعال کرد 🚀',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTicker(tickerMessages[Math.floor(Math.random() * tickerMessages.length)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLikeReview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCoin();
    setLikedReviews((prev) => {
      const isLiked = !prev[id];
      setLikeCounts((c) => ({
        ...c,
        [id]: (c[id] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    soundEngine.playSuccess();
    const created: Review = {
      id: `rev-${Date.now()}`,
      userName: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: 'لحظاتی پیش',
      verifiedBuyer: true,
      gameTitle: newReview.game || 'محصول ققنوس شاپ',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    setUserReviews([created, ...userReviews]);
    setIsSubmitModalOpen(false);
    setNewReview({ name: '', game: '', rating: 5, comment: '' });
  };

  // Filtered reviews
  const filteredReviews = userReviews.filter((rev) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ai') return rev.gameTitle.includes('GPT') || rev.gameTitle.includes('Midjourney') || rev.gameTitle.includes('هوش');
    if (activeCategory === 'giftcard') return rev.gameTitle.includes('گیفت') || rev.gameTitle.includes('استیم') || rev.gameTitle.includes('پلی‌استیشن');
    if (activeCategory === 'game') return !rev.gameTitle.includes('GPT') && !rev.gameTitle.includes('هوش');
    return true;
  });

  return (
    <section id="vip-club-section" className="relative z-10 py-16 md:py-24 text-zinc-100 overflow-hidden">
      
      {/* Background Animated Ambient Elements */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        
        {/* Sticky Section Header Bar with Live Badge */}
        <div className="sticky top-20 z-30 mb-8 p-4 sm:p-5 rounded-2xl bg-[#090616]/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-[#0d091e] rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-vazir)' }}>
                  باشگاه مشتریان VIP و نظرات گیمرها
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>امتیاز ۴.۹ از ۵</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                تجربه واقعی خریداران، دریافت کش‌بک نقدی و هدایای اختصاصی ققنوس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mr-auto sm:mr-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsSubmitModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت تجربه شما</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>رضایت ۹۹.۴٪ خریداران</span>
            </div>
          </div>
        </div>

        {/* Live Order Notification Ribbon */}
        <div className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#120a24] via-[#1a0f30] to-[#120a24] border border-amber-500/30 flex items-center justify-between gap-4 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-400/50 transition-colors">
          <div className="flex items-center gap-2.5 text-xs font-bold text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[11px] text-zinc-400">سفارشات زنده ققنوس:</span>
            <span className="text-white font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20">{liveTicker}</span>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hidden sm:flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>تحویل خودکار زیر ۳۰ ثانیه</span>
          </span>
        </div>

        {/* VIP Phoenix Club Banner with Dynamic Motion */}
        <div className="group relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-[#190e30] via-[#240b28] to-[#140822] border border-amber-500/30 hover:border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-right transition-all duration-500 hover:shadow-[0_25px_60px_rgba(245,158,11,0.25)]">
          
          {/* Flame aura moving background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/25 via-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-gradient-to-tr from-fuchsia-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* VIP Text & Benefits */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black shadow-inner">
                <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>باشگاه اختصاصی گیمرهای ققنوس (VIP Club)</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-snug" style={{ fontFamily: 'var(--font-vazir)' }}>
                با هر خرید امتیاز بگیرید و <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,122,24,0.5)]">گیفت‌کارت رایگان</span> هدیه ببرید!
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                اعضای باشگاه VIP از تخفیف‌های هفتگی اختصاصی تا ۲۵٪، اولویت صف تحویل زیر ۳۰ ثانیه و پشتیبانی مستقیم اختصاصی تلگرام بهره‌مند می‌شوند.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/10 flex items-center gap-3 transition-all duration-300 hover:-translate-y-1">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">کش‌بک نقدی ۵٪</span>
                    <span className="text-[10px] text-zinc-400">بازگشت به کیف پول</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 flex items-center gap-3 transition-all duration-300 hover:-translate-y-1">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">قرعه‌کشی ماهیانه</span>
                    <span className="text-[10px] text-zinc-400">گیفت کارت ۱۰۰ دلاری</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 flex items-center gap-3 transition-all duration-300 hover:-translate-y-1">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">تحویل VIP آنی</span>
                    <span className="text-[10px] text-zinc-400">بدون معطلی در صف</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Action Button */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              {isVipJoined ? (
                <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-center space-y-2 shadow-[0_0_30px_rgba(16,185,129,0.35)] animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>عضو طلایی VIP ققنوس شدید!</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    کد تخفیف <span className="text-amber-400 font-mono font-bold bg-black/40 px-2 py-0.5 rounded border border-amber-400/40">VIP</span> در سبد خرید برای شما فعال شد.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setIsVipJoined(true);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="relative group/btn px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-black text-sm shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:shadow-[0_0_50px_rgba(255,122,24,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-amber-300/40"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-[-100%] transition-transform duration-700 pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-200" />
                      <span>عضویت رایگان در باشگاه VIP</span>
                    </span>
                  </button>
                  <span className="text-[10px] text-zinc-400 mt-2.5 font-mono">بیش از ۱۲,۸۰۰ گیمر فعال عضو</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-right">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>نظرات ثبت شده خریداران</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
                تجربه خرید <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">گیمرها از ققنوس شاپ</span>
              </h3>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0d091e] border border-white/10 overflow-x-auto">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                همه ({userReviews.length})
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory('game');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'game'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                بازی‌ها
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory('ai');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'ai'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                هوش مصنوعی
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory('giftcard');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'giftcard'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                گیفت کارت
              </button>
            </div>
          </div>

          {/* Interactive Reviews Grid with Motion & Likes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredReviews.map((rev, idx) => (
              <div
                key={rev.id}
                onMouseEnter={() => soundEngine.playHover()}
                className="group relative rounded-3xl p-5 bg-gradient-to-b from-[#140b26] via-[#0d071a] to-[#080410] border border-amber-500/20 hover:border-amber-400/70 shadow-[0_15px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(245,158,11,0.2)] transition-all duration-400 hover:-translate-y-2 text-right flex flex-col justify-between overflow-hidden"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                {/* Top Subtle Amber Corner Flare */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-amber-500/15 blur-xl group-hover:bg-amber-500/35 transition-all pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  {/* Rating & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.8)]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{rev.date}</span>
                  </div>

                  {/* Purchased Item Badge */}
                  <div className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl inline-block max-w-full truncate">
                    خرید: {rev.gameTitle}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal min-h-[4rem]">
                    «{rev.comment}»
                  </p>
                </div>

                {/* User profile & Like button */}
                <div className="relative z-10 flex items-center justify-between pt-3.5 border-t border-white/10 mt-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={rev.avatar}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover border border-amber-400/40 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate">{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="خریدار تایید شده" />
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono block">تحویل آنی شده</span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikeReview(rev.id, e)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      likedReviews[rev.id]
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                    title="مفید بود"
                  >
                    <ThumbsUp className={`w-3 h-3 ${likedReviews[rev.id] ? 'fill-rose-400' : ''}`} />
                    <span>{likeCounts[rev.id] || 0}</span>
                  </button>
                </div>

                {/* Card Bottom Light Line */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent group-hover:h-1 group-hover:via-amber-400 transition-all" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Submit Review Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl p-6 bg-gradient-to-b from-[#1a0f30] to-[#0d071a] border border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-right space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
                ثبت نظر و تجربه خرید شما
              </h4>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-300 font-bold block mb-1">نام یا نام مستعار:</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="مثلاً: آرمین کیانی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-bold block mb-1">نام محصول خریداری‌شده:</label>
                <input
                  type="text"
                  value={newReview.game}
                  onChange={(e) => setNewReview({ ...newReview, game: e.target.value })}
                  placeholder="مثلاً: اکانت قانونی GTA VI یا ChatGPT Plus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-bold block mb-1">امتیاز شما:</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        soundEngine.playCoin();
                        setNewReview({ ...newReview, rating: star });
                      }}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || newReview.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-300 font-bold mr-2">
                    {newReview.rating} ستاره
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 font-bold block mb-1">متن تجربه و نظر شما:</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="از کیفیت تحویل، پشتیبانی یا کارایی محصول برای بقیه گیمرها بنویسید..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                ثبت و انتشار فوری نظر
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
