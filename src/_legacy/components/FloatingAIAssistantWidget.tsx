import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Zap, 
  ArrowLeft, 
  Compass, 
  ShoppingBag, 
  ChevronDown, 
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/products';

interface FloatingAIAssistantWidgetProps {
  onOpenFullAdvisor: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  recommendedProduct?: Product;
}

export const FloatingAIAssistantWidget: React.FC<FloatingAIAssistantWidgetProps> = ({
  onOpenFullAdvisor,
  onSelectProduct,
  onAddToCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'سلام! 👋 من دستیار هوشمند ققنوس شاپ هستم. دنبال چه بازی، هوش مصنوعی یا سرویسی هستی تا بهترین آفر رو بهت پیشنهاد بدم؟',
      timestamp: 'هم‌اکنون',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Periodic greeting speech bubble
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromptBubble(true);
    }, 4000);

    const interval = setInterval(() => {
      if (!isOpen) {
        setShowPromptBubble(true);
      }
    }, 35000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowPromptBubble(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const quickPrompts = [
    'بهترین هوش مصنوعی برای کدنویسی چیه؟',
    'تفاوت ظرفیت ۲ و ۳ بازی‌ها چیه؟',
    'چطور اشتراک ChatGPT Plus بخرم؟',
    'تحویل لایسنس چقدر طول می‌کشه؟',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    soundEngine.playClick(800, 0.04);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Intelligent Response Logic
    setTimeout(() => {
      let replyText = '';
      let recommendedProduct: Product | undefined;

      const q = query.toLowerCase();

      if (q.includes('کد') || q.includes('برنامه') || q.includes('cursor') || q.includes('claude')) {
        replyText = 'برای برنامه‌نویسی و کدنویسی پیشرفته، اشتراک Claude 3.5 Sonnet و Cursor Pro بهترین انتخاب‌های دنیا هستند! سرعت تحلیل فوق‌العاده بالایی دارن و لایسنس هر دو با تحویل آنی موجوده.';
        recommendedProduct = PRODUCTS_CATALOG.find(p => p.id === 'claude-pro') || PRODUCTS_CATALOG.find(p => p.id === 'cursor-pro');
      } else if (q.includes('chatgpt') || q.includes('gpt') || q.includes('چت')) {
        replyText = 'اشتراک رسمی ChatGPT Plus دسترسی کامل به مدل GPT-4o، ساخت تصاویر DALL-E 3 و افزونه‌های تخصصی رو بهت میده. فعال‌سازی ۱۰۰٪ روی ایمیل اختصاصی خودت انجام میشه و بدون قطعیه.';
        recommendedProduct = PRODUCTS_CATALOG.find(p => p.id === 'chatgpt-plus');
      } else if (q.includes('ظرفیت') || q.includes('۲') || q.includes('3') || q.includes('ps5') || q.includes('پلی')) {
        replyText = 'در ظرفیت ۲ (قانونی)، شما روی اکانت شخصی خودت بازی می‌کنی، تمام تروفی‌ها و سیوها ذخیره میشن و امکان بازی آفلاین و آنلاین رو داری با گارانتی مادام‌العمر!';
        recommendedProduct = PRODUCTS_CATALOG.find(p => p.id === 'gta-6') || PRODUCTS_CATALOG.find(p => p.id === 'ps-plus-deluxe');
      } else if (q.includes('تحویل') || q.includes('زمان') || q.includes('چقدر')) {
        replyText = 'تمام سفارش‌ها توسط سیستم هوشمند روباتیک ققنوس شاپ زیر ۲ دقیقه صادر میشن و کد فعال‌سازی یا لایسنس به شماره موبایل و پنل کاربریت پیامک میشه ⚡';
      } else {
        replyText = 'برای این مورد، اشتراک‌های ویژه و اکانت‌های قانونی ققنوس شاپ بهترین گزینه‌اند. روی دکمه «مشاور هوشمند خرید» بالای چت بزن تا گام‌به‌گام بهت کمک کنم!';
        recommendedProduct = PRODUCTS_CATALOG[0];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        recommendedProduct,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      soundEngine.playCoin();
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      
      {/* Speech Prompt Bubble (Autonomous greeting popup) - Positioned to the LEFT of the button */}
      {!isOpen && showPromptBubble && (
        <div className="absolute bottom-1 right-16 mr-2 w-max max-w-[240px] sm:max-w-xs animate-in fade-in slide-in-from-right-3 duration-300 z-50">
          <div 
            onClick={() => {
              soundEngine.playClick(750, 0.05);
              setIsOpen(true);
            }}
            className="cursor-pointer p-3 rounded-2xl bg-[#140e2b]/95 border border-amber-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl text-right flex items-center justify-between gap-2.5 hover:border-amber-400 transition-colors"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPromptBubble(false);
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 shrink-0"
              aria-label="بستن پیام"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white leading-relaxed">
                می‌خوای کمکت کنم زودتر به چیزی که می‌خوای برسی؟ 🤖
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            </div>
          </div>
          {/* Arrow Pointer pointing right towards the avatar button */}
          <div className="w-2.5 h-2.5 bg-[#140e2b] border-t border-r border-amber-400/50 rotate-45 absolute top-1/2 -translate-y-1/2 -right-1.5" />
        </div>
      )}

      {/* Expanded AI Chat Box */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[480px] rounded-3xl bg-[#0e0a1c]/98 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 mb-3">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-900/50 via-[#181033] to-amber-900/40 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick(600, 0.04);
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white flex items-center gap-1 justify-end">
                  <span>مشاور هوشمند ققنوس</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>آنلاین و پاسخگو</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-md flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* TOP QUICK-ACTION PILL BANNER (Runs Full Recommendation Wizard) */}
          <div className="p-2.5 bg-black/40 border-b border-white/10">
            <button
              onClick={() => {
                soundEngine.playClick(750, 0.05);
                setIsOpen(false);
                onOpenFullAdvisor();
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-amber-500/30 hover:from-purple-600/50 hover:to-amber-500/50 text-amber-300 hover:text-white border border-amber-400/40 text-xs font-black flex items-center justify-between transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>مشاور هوشمند انتخاب و مقایسه لایسنس ⚡</span>
              </div>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] text-right leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-black font-bold rounded-bl-xs'
                      : 'bg-white/10 text-zinc-200 border border-white/10 rounded-br-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Attached Product Recommendation Card inside Chat */}
                  {msg.recommendedProduct && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/60 border border-amber-400/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onSelectProduct(msg.recommendedProduct!);
                          setIsOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm shrink-0"
                      >
                        <span>مشاهده</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>

                      <div className="text-right">
                        <span className="text-[11px] font-black text-white block line-clamp-1">
                          {msg.recommendedProduct.title}
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">
                          {msg.recommendedProduct.price.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-zinc-400 text-xs p-2 bg-white/5 rounded-2xl w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-zinc-400 mr-1">در حال نوشتن...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-black/30 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 text-[10px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-[#090614] border-t border-white/10 flex items-center gap-2"
          >
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-md shrink-0"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="سوالی درباره خرید یا فعال‌سازی داری بنویس..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 text-right"
              dir="rtl"
            />
          </form>

        </div>
      )}

      {/* Floating Animated Trigger Button with Holographic Avatar */}
      <button
        onClick={() => {
          soundEngine.playClick(700, 0.08);
          setIsOpen(!isOpen);
        }}
        className="group relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center"
        title="مشاور و چت هوش مصنوعی ققنوس"
        aria-label="مشاور هوشمند"
      >
        {/* Pulsing Aura Rings */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 opacity-40 blur-md group-hover:opacity-75 animate-pulse" />
        
        <div className="relative z-10 w-full h-full rounded-[14px] bg-[#0d091d] flex items-center justify-center overflow-hidden">
          <Bot className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Glowing Green Online Indicator */}
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d091d] animate-pulse" />
        </div>
      </button>

    </div>
  );
};
