import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Search, X, Flame, Sparkles, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === ''
    ? products.filter(p => p.isHot).slice(0, 4)
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.englishTitle.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-12 flex items-start justify-center select-none pt-20">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
      />

      {/* Search Box */}
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#0f0b1c]/98 text-right p-4 sm:p-6 space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی عنوان بازی، اشتراک AI، گیفت کارت یا پلتفرم..."
            className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 pr-12 pl-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute right-4 pointer-events-none" />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center absolute left-3 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-500 text-[11px]">جستجوهای پرتکرار:</span>
          {['GTA VI', 'Call of Duty', 'ChatGPT Plus', 'Steam Wallet', 'EA FC 27', 'Midjourney'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                soundEngine.playClick();
                setQuery(tag);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] border border-white/5"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pt-2">
          <div className="text-[11px] text-zinc-400 font-bold px-1">
            {query.trim() === '' ? 'پیشنهادات داغ ققنوس شاپ:' : `نتایج یافت شده (${results.length} مورد):`}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              نتیجه‌ای برای «{query}» یافت نشد.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectProduct(product);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/40 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <img
                  src={product.backdropImage}
                  alt={product.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate" style={{ fontFamily: 'var(--font-vazir)' }}>
                    {product.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400 block truncate">{product.accountType}</span>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-400">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono">
                    {product.deliveryTime}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
