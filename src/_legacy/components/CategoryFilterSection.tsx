import React, { useState } from 'react';
import { 
  GraduationCap, 
  Share2, 
  Bot, 
  Gamepad2, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Layers,
  Flame
} from 'lucide-react';
import { Product, Platform, MainPortalCategory } from '../types';
import { ProductCard } from './ProductCard';
import { soundEngine } from '../utils/soundEngine';

interface CategoryFilterSectionProps {
  products: Product[];
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenQuickView: (product: Product) => void;
}

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  products,
  onAddToCart,
  onOpenQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MainPortalCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'price_asc' | 'price_desc' | 'rating'>('hot');

  const CATEGORY_TABS: Array<{
    id: MainPortalCategory | 'all';
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    color: string;
  }> = [
    {
      id: 'all',
      title: 'همه دسته‌ها',
      icon: Layers,
      count: products.length,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'education',
      title: 'آموزشی و مهارت‌آموزی',
      icon: GraduationCap,
      count: products.filter(p => p.mainCategory === 'education' || p.category === 'education').length,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'social',
      title: 'اکانت شبکه اجتماعی و استریم',
      icon: Share2,
      count: products.filter(p => p.mainCategory === 'social' || p.category === 'social').length,
      color: 'from-purple-400 to-pink-500',
    },
    {
      id: 'ai',
      title: 'هوش مصنوعی و پردازش ابری',
      icon: Bot,
      count: products.filter(p => p.mainCategory === 'ai' || p.category === 'ai').length,
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'design_gaming',
      title: 'طراحی و ادیت و اکانت‌های گیم',
      icon: Gamepad2,
      count: products.filter(p => p.mainCategory === 'design_gaming' || p.category === 'design_gaming' || p.category === 'gaming').length,
      color: 'from-rose-500 to-amber-500',
    },
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    // 1. Category check
    if (selectedCategory !== 'all') {
      const matchesCategory = 
        product.mainCategory === selectedCategory ||
        product.category === selectedCategory ||
        (selectedCategory === 'design_gaming' && (product.category === 'gaming' || product.category === 'design_gaming'));
      if (!matchesCategory) return false;
    }

    // 2. Platform filter
    if (selectedPlatform !== 'all' && !product.platforms.includes(selectedPlatform)) {
      return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchEn = product.englishTitle.toLowerCase().includes(q);
      const matchTag = product.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchEn && !matchTag) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (a.isHot && !b.isHot) return -1;
    if (!a.isHot && b.isHot) return 1;
    return 0;
  });

  return (
    <section id="category-filter-section" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-zinc-100">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>دسته‌بندی جامع محصولات ققنوس</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: 'var(--font-vazir)' }}>
            انتخاب دسته‌بندی و فیلتر پیشرفته
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            مشاهده و فیلتر تمام بازی‌ها، ابزارهای هوش مصنوعی و اشتراک‌های بین‌المللی
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-amber-300">
            {sortedProducts.length} محصول موجود
          </span>
        </div>
      </div>

      {/* Horizontal Category Pill Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playClick(650, 0.04);
                setSelectedCategory(tab.id);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-102'
                  : 'bg-[#0d091a]/80 text-zinc-300 border-white/10 hover:border-white/20 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
              <span>{tab.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isSelected ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Platform Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-[#0d091a]/90 border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg backdrop-blur-xl">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام بازی، نرم‌افزار یا اشتراک..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors text-right"
            dir="rtl"
          />
        </div>

        {/* Platform Filter & Sorting Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Platform Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            {(['all', 'PC', 'PS5', 'Web', 'iOS'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => {
                  soundEngine.playClick(600, 0.04);
                  setSelectedPlatform(plat);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedPlatform === plat
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'همه پلتفرم‌ها' : plat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/40 border border-white/10 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="hot">🔥 محبوب‌ترین و داغ‌ترین</option>
            <option value="price_asc">ارزان‌ترین قیمت</option>
            <option value="price_desc">گران‌ترین قیمت</option>
            <option value="rating">بالاترین امتیاز</option>
          </select>
        </div>

      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#0d091a] border border-white/10 space-y-4">
          <Search className="w-12 h-12 text-zinc-500 mx-auto opacity-50 animate-bounce" />
          <h4 className="text-base font-bold text-white">محصولی با این مشخصات یافت نشد</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            لطفاً عبارت جستجو یا فیلتر پلتفرم را تغییر دهید یا از سایر دسته‌بندی‌ها دیدن فرمایید.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPlatform('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
          >
            نمایش همه محصولات
          </button>
        </div>
      )}

    </section>
  );
};
