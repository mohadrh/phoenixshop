import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, Platform } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Grid, 
  List, 
  X, 
  Sparkles, 
  Flame, 
  Zap, 
  Check, 
  RotateCcw,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface ShopPageProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQuickView: (product: Product) => void;
  onSelectProductPage: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onAddToCart,
  onOpenQuickView,
  onSelectProductPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(3000000);
  const [onlyInstantDelivery, setOnlyInstantDelivery] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'همه محصولات', icon: '🔥' },
    { id: 'ai', label: 'هوش مصنوعی و لایسنس', icon: '🤖' },
    { id: 'gaming', label: 'اکانت گیم و کنسول', icon: '🎮' },
    { id: 'giftcard', label: 'گیفت کارت بین‌الملل', icon: '💳' },
    { id: 'currency', label: 'ارز درون بازی و والت', icon: '🪙' },
  ];

  const platforms = ['all', 'PC', 'PS5', 'Xbox', 'Steam', 'Web', 'iOS', 'Android'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = product.title.toLowerCase().includes(q) || product.englishTitle.toLowerCase().includes(q);
          const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchTag) return false;
        }

        // Category
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Platform
        if (selectedPlatform !== 'all' && !product.platforms.includes(selectedPlatform as Platform)) {
          return false;
        }

        // Price range
        if (product.price > priceRange) {
          return false;
        }

        // Instant delivery only
        if (onlyInstantDelivery && !product.deliveryTime.includes('آنی') && !product.deliveryTime.includes('فوری')) {
          return false;
        }

        // Discounted only
        if (onlyDiscounted && !product.discountPercent) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0; // featured
      });
  }, [products, searchQuery, selectedCategory, selectedPlatform, priceRange, onlyInstantDelivery, onlyDiscounted, sortBy]);

  const handleResetFilters = () => {
    soundEngine.playClick(500, 0.05);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setPriceRange(3000000);
    setOnlyInstantDelivery(false);
    setOnlyDiscounted(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto select-none">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#181131] via-[#100b21] to-[#1c0f2b] border border-white/10 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>فروشگاه هوشمند ققنوس شاپ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
            آرشیو جامع محصولات اورجینال و قانونی
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl">
            با فیلترهای پیشرفته زیر محصول مدنظرتان را در کمترین زمان بیابید و با سرعت جت تحویل بگیرید
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT SIDEBAR: SMART FILTERS (In RTL: Col 1-4) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0e0a1c]/95 border border-white/10 p-5 space-y-6 backdrop-blur-xl shadow-xl sticky top-24">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>پاکسازی فیلترها</span>
            </button>
            <div className="flex items-center gap-1.5 text-white font-extrabold text-sm">
              <span>فیلترهای هوشمند</span>
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* 1. Live Search */}
          <div className="space-y-2 text-right">
            <label className="text-xs font-bold text-zinc-300">جستجوی عنوان یا تگ</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="مثلا: ChatGPT، GTA، استیم..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-2.5 px-4 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-right"
                dir="rtl"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute top-3 right-3" />
            </div>
          </div>

          {/* 2. Category Selection */}
          <div className="space-y-2 text-right">
            <label className="text-xs font-bold text-zinc-300">دسته‌بندی</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playClick(650, 0.04);
                    setSelectedCategory(cat.id);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-right flex items-center justify-between transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[11px] opacity-75">
                    {cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{cat.label}</span>
                    <span>{cat.icon}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Platform Filter */}
          <div className="space-y-2 text-right">
            <label className="text-xs font-bold text-zinc-300">پلتفرم اجرا</label>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {platforms.map((plat) => (
                <button
                  key={plat}
                  onClick={() => {
                    soundEngine.playClick(600, 0.04);
                    setSelectedPlatform(plat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPlatform === plat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {plat === 'all' ? 'همه' : plat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Price Range Slider */}
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-mono font-bold">
                تا {priceRange.toLocaleString('fa-IR')} تومان
              </span>
              <label className="font-bold text-zinc-300">سقف قیمت</label>
            </div>
            <input
              type="range"
              min="50000"
              max="3000000"
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* 5. Toggles (Instant Delivery & Discounts) */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label
              onClick={() => setOnlyInstantDelivery(!onlyInstantDelivery)}
              className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-white/5"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                onlyInstantDelivery ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
              }`}>
                {onlyInstantDelivery && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs text-zinc-200 font-medium">فقط تحویل آنی (زیر ۲ دقیقه) ⚡</span>
            </label>

            <label
              onClick={() => setOnlyDiscounted(!onlyDiscounted)}
              className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-white/5"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                onlyDiscounted ? 'bg-rose-500 border-rose-400 text-white' : 'border-white/20'
              }`}>
                {onlyDiscounted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs text-zinc-200 font-medium">فقط محصولات دارای تخفیف 🔥</span>
            </label>
          </div>

        </div>

        {/* LEFT CONTENT AREA: PRODUCTS GRID & TOOLBAR (In RTL: Col 5-12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Sort & Results Counter Bar */}
          <div className="p-4 rounded-2xl bg-[#0e0a1c]/90 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl border ${viewMode === 'grid' ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-zinc-400 border-white/10'}`}
                title="نمایش شبکه‌ای"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl border ${viewMode === 'list' ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 text-zinc-400 border-white/10'}`}
                title="نمایش لیستی"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-right">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="featured">پیشنهاد ققنوس شاپ</option>
                <option value="price-low">ارزان‌ترین</option>
                <option value="price-high">گران‌ترین</option>
                <option value="rating">بالاترین امتیاز</option>
                <option value="newest">جدیدترین لایسنس‌ها</option>
              </select>
              <span className="text-xs text-zinc-400 font-bold">:مرتب‌سازی</span>
            </div>

            <div className="text-xs text-zinc-400">
              نمایش <span className="text-white font-bold">{filteredProducts.length}</span> محصول
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== 'all' || selectedPlatform !== 'all' || searchQuery || onlyDiscounted || onlyInstantDelivery) && (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {searchQuery && (
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-zinc-300 flex items-center gap-1">
                  <span>جستجو: {searchQuery}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 flex items-center gap-1">
                  <span>دسته: {categories.find(c => c.id === selectedCategory)?.label}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedPlatform !== 'all' && (
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 flex items-center gap-1">
                  <span>پلتفرم: {selectedPlatform}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPlatform('all')} />
                </span>
              )}
            </div>
          )}

          {/* Product Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#0e0a1c] border border-white/10 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="text-lg font-bold text-white">محصولی با این مشخصات یافت نشد!</h3>
              <p className="text-xs text-zinc-400">لطفا فیلترها را تغییر داده یا جستجوی دیگری انجام دهید.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                پاکسازی فیلترها
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onOpenQuickView={() => onSelectProductPage(prod)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProductPage(prod)}
                  className="cursor-pointer p-4 rounded-2xl bg-[#0e0a1c] hover:bg-[#150f29] border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod, e);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md"
                    >
                      خرید (Su-57)
                    </button>
                    <div className="text-left">
                      <span className="text-sm font-black text-amber-300 font-mono">
                        {prod.price.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[10px] text-zinc-400 mr-1">تومان</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{prod.title}</h4>
                      <p className="text-xs text-zinc-400">{prod.accountType}</p>
                    </div>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/50 p-1 shrink-0">
                      <img
                        src={prod.characterImage || prod.backdropImage}
                        alt={prod.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
