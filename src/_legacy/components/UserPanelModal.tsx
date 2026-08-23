import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Key,
  CreditCard,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  AlertCircle,
  LogOut,
  Sparkles,
  Wallet,
  FileText,
  Lock,
  Phone,
  Mail,
  ChevronLeft,
  Check,
  Headphones,
  Paperclip,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface UserTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  department: 'ai_support' | 'game_activation' | 'finance' | 'vip_concierge';
  priority: 'urgent' | 'high' | 'normal';
  status: 'answered' | 'pending' | 'closed';
  createdAt: string;
  lastUpdated: string;
  messages: {
    id: string;
    sender: 'user' | 'support' | 'ai_agent';
    senderName: string;
    text: string;
    time: string;
  }[];
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  productTitle: string;
  category: 'ai' | 'gaming' | 'giftcard';
  price: number;
  date: string;
  status: 'delivered' | 'processing';
  licenseKey?: string;
  accountCredentials?: {
    email: string;
    pass: string;
  };
  activationGuideUrl?: string;
}

interface UserPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'orders' | 'tickets' | 'wallet';
}

export const UserPanelModal: React.FC<UserPanelModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('09129998877');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  
  // Dashboard navigation
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'tickets' | 'wallet'>(initialTab);
  
  // User Data State
  const [userName, setUserName] = useState('امیرحسین رضایی');
  const [userPhone, setUserPhone] = useState('۰۹۱۲۹۹۹۸۸۷۷');
  const [userEmail, setUserEmail] = useState('amir.rezaei.gamer@gmail.com');
  const [walletBalance, setWalletBalance] = useState<number>(1850000);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Orders State
  const [orders] = useState<UserOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'PHX-84920',
      productTitle: 'ChatGPT Plus (GPT-4o) - اشتراک ۱ ماهه قانونی',
      category: 'ai',
      price: 980000,
      date: '۱۴۰۳/۰۵/۲۲ - ۱۶:۴۵',
      status: 'delivered',
      licenseKey: 'OPENAI-GPT4O-PRO-9842-FX77-Q901',
      accountCredentials: {
        email: 'amir.rezaei.gamer@gmail.com',
        pass: 'فعال‌سازی روی ایمیل اختصاصی',
      },
    },
    {
      id: 'ord-102',
      orderNumber: 'PHX-71934',
      productTitle: 'Grand Theft Auto VI - ظرفیت ۲ قانونی PS5',
      category: 'gaming',
      price: 4290000,
      date: '۱۴۰۳/۰۵/۱۸ - ۱۱:۲۰',
      status: 'delivered',
      licenseKey: 'PSN-GTA6-CAP2-GOLD-8812-KK34',
      accountCredentials: {
        email: 'phx_gta6_vip88@phoenix.club',
        pass: 'PhxGamer#9921',
      },
    },
    {
      id: 'ord-103',
      orderNumber: 'PHX-62381',
      productTitle: 'Spotify Individual 1 Year - پرمیوم قانونی',
      category: 'ai',
      price: 680000,
      date: '۱۴۰۳/۰۴/۱۱ - ۲۰:۱۰',
      status: 'delivered',
      licenseKey: 'SPOT-IND-365D-PHX-4421-TT90',
    },
  ]);

  // Tickets State
  const [tickets, setTickets] = useState<UserTicket[]>([
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-9941',
      subject: 'درخواست راهنمایی فعال‌سازی ویس چت پیشرفته GPT-4o روی iOS',
      department: 'ai_support',
      priority: 'high',
      status: 'answered',
      createdAt: '۱۴۰۳/۰۵/۲۲ - ۱۷:۱۰',
      lastUpdated: '۱۴۰۳/۰۵/۲۲ - ۱۷:۳۰',
      messages: [
        {
          id: 'm-1',
          sender: 'user',
          senderName: 'امیرحسین رضایی',
          text: 'سلام خسته نباشید، اکانت چت جی‌پی‌تی پلاس رو گرفتم عالیه، فقط میخواستم بدونم چطور ویس چت پیشرفته (Advanced Voice Mode) رو روی گوشی آیفون فعال کنم؟',
          time: '۱۷:۱۰',
        },
        {
          id: 'm-2',
          sender: 'support',
          senderName: 'کارشناس هوش مصنوعی ققنوس',
          text: 'درود بر شما کاربر گرامی ققنوس شاپ 🌹 برای فعال‌سازی کافیست ریجن اپل آیدی یا نرم‌افزار خود را روی آمریکا قرار دهید و با آخرین نسخه اپ ChatGPT وارد اکانت اختصاصی شوید. قابلیت صوتی به صورت ۱۰۰٪ روی لایسنس شما فعال است.',
          time: '۱۷:۳۰',
        },
      ],
    },
    {
      id: 'tkt-2',
      ticketNumber: 'TKT-8412',
      subject: 'استعلام تایید وریفای کارت به کارت سفارش GTA VI',
      department: 'finance',
      priority: 'normal',
      status: 'closed',
      createdAt: '۱۴۰۳/۰۵/۱۸ - ۱۱:۲۵',
      lastUpdated: '۱۴۰۳/۰۵/۱۸ - ۱۱:۳۵',
      messages: [
        {
          id: 'm-3',
          sender: 'user',
          senderName: 'امیرحسین رضایی',
          text: 'فیش واریزی رو آپلود کردم، کد رهگیری ۱۸۹۴۲۱',
          time: '۱۱:۲۵',
        },
        {
          id: 'm-4',
          sender: 'support',
          senderName: 'واحد مالی ققنوس',
          text: 'تایید شد و لایسنس ظرفیت ۲ برای شما ارسال گردید. سپاس از اعتماد شما.',
          time: '۱۱:۳۵',
        },
      ],
    },
  ]);

  // Selected Ticket for Chat View
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  
  // New Ticket Form State
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDept, setNewTicketDept] = useState<'ai_support' | 'game_activation' | 'finance' | 'vip_concierge'>('ai_support');
  const [newTicketPriority, setNewTicketPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // Wallet Top-up
  const [topupAmount, setTopupAmount] = useState<number>(500000);
  const [showTopupSuccess, setShowTopupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    soundEngine.playSuccess();
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;

    soundEngine.playClick(600, 0.05);
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      senderName: userName,
      text: replyText.trim(),
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setTickets((prev) =>
      prev.map((tkt) =>
        tkt.id === selectedTicketId
          ? {
              ...tkt,
              status: 'pending',
              lastUpdated: 'همین الان',
              messages: [...tkt.messages, newMsg],
            }
          : tkt
      )
    );
    setReplyText('');

    // Simulated Auto response from Phoenix AI Support Assistant
    setTimeout(() => {
      soundEngine.playSuccess();
      const autoReply = {
        id: `m-${Date.now() + 1}`,
        sender: 'ai_agent' as const,
        senderName: 'پشتیبان هوشمند ققنوس (پاسخ آنی ۲۴/۷)',
        text: 'پیام شما در صف بررسی کارشناس ارشد قرار گرفت. لایسنس و سرویس شما کاملاً فعال بوده و بدون وقفه مانیتور می‌شود. در صورت نیاز به بررسی بیشتر، همکاران ما تا حداکثر ۵ دقیقه آینده پاسخ خواهند داد.',
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setTickets((prev) =>
        prev.map((tkt) =>
          tkt.id === selectedTicketId
            ? {
                ...tkt,
                status: 'answered',
                lastUpdated: 'همین الان',
                messages: [...tkt.messages, autoReply],
              }
            : tkt
        )
      );
    }, 1200);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    soundEngine.playSuccess();
    const newTkt: UserTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketSubject.trim(),
      department: newTicketDept,
      priority: newTicketPriority,
      status: 'pending',
      createdAt: 'همین الان',
      lastUpdated: 'همین الان',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          senderName: userName,
          text: newTicketMessage.trim(),
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setTickets([newTkt, ...tickets]);
    setSelectedTicketId(newTkt.id);
    setIsCreatingTicket(false);
    setNewTicketSubject('');
    setNewTicketMessage('');
  };

  const handleTopup = () => {
    soundEngine.playSuccess();
    setWalletBalance((prev) => prev + topupAmount);
    setShowTopupSuccess(true);
    setTimeout(() => setShowTopupSuccess(false), 3000);
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop blur overlay */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#090713] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>پنل کاربری و مرکز پشتیبانی ققنوس</span>
                {isLoggedIn && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                    VIP GOLD MEMBER
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">مدیریت لایسنس‌ها، تیکت‌های پشتیبانی و تراکنش‌های امن</p>
            </div>
          </div>

          <button
            onClick={onClose}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTH VIEW (If logged out) */}
        {!isLoggedIn ? (
          <div className="p-6 md:p-10 max-w-md mx-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white">
                {authMode === 'login' ? 'ورود به حساب کاربری' : 'عضویت در باشگاه ققنوس'}
              </h3>
              <p className="text-xs text-zinc-400">
                برای مشاهده لایسنس‌های خریداری شده و ثبت تیکت پشتیبانی وارد شوید.
              </p>
            </div>

            {/* Quick Demo Login Banner */}
            <button
              onClick={() => {
                soundEngine.playSuccess();
                setIsLoggedIn(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-between hover:bg-amber-500/30 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>ورود سریع تستی با اکانت VIP طلایی</span>
              </div>
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                soundEngine.playSuccess();
                setIsLoggedIn(true);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">شماره موبایل یا ایمیل:</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">رمز عبور یا کد پیامک:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="رمز عبور"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                onMouseEnter={() => soundEngine.playHover()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {authMode === 'login' ? 'ورود به حساب کاربری' : 'تکمیل ثبت نام'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                {authMode === 'login'
                  ? 'حساب کاربری ندارید؟ ثبت‌نام در ققنوس شاپ'
                  : 'قبلاً ثبت‌نام کرده‌اید؟ ورود به حساب'}
              </button>
            </div>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD VIEW */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-l border-white/10 p-4 space-y-2 bg-black/30 shrink-0">
              
              {/* User Mini Profile */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                    {userName[0]}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-white truncate">{userName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono truncate">{userPhone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/5">
                  <span className="text-zinc-400">موجودی:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {walletBalance.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              </div>

              {/* Tab Navigation Buttons */}
              <button
                onClick={() => {
                  soundEngine.playClick(600, 0.04);
                  setActiveTab('orders');
                }}
                className={`w-full p-3 rounded-xl text-right text-xs font-bold flex items-center justify-between transition-all ${
                  activeTab === 'orders'
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4" />
                  <span>لایسنس‌ها و سفارشات</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono">{orders.length}</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick(650, 0.04);
                  setActiveTab('tickets');
                }}
                className={`w-full p-3 rounded-xl text-right text-xs font-bold flex items-center justify-between transition-all ${
                  activeTab === 'tickets'
                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>تیکت‌های پشتیبانی</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">
                  {tickets.length}
                </span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick(700, 0.04);
                  setActiveTab('wallet');
                }}
                className={`w-full p-3 rounded-xl text-right text-xs font-bold flex items-center justify-between transition-all ${
                  activeTab === 'wallet'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4" />
                  <span>کیف پول و شارژ</span>
                </div>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick(750, 0.04);
                  setActiveTab('profile');
                }}
                className={`w-full p-3 rounded-xl text-right text-xs font-bold flex items-center justify-between transition-all ${
                  activeTab === 'profile'
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>مشخصات و امنیت</span>
                </div>
              </button>

              {/* Logout Button */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    soundEngine.playClick(400, 0.05);
                    setIsLoggedIn(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[600px]">
              
              {/* TAB 1: ORDERS & LICENSES */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>لایسنس‌ها و اکانت‌های فعال شما</span>
                    </h3>
                    <span className="text-xs text-zinc-400">تضمین ۱۰۰٪ اصالت و پشتیبانی</span>
                  </div>

                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-xs font-mono text-zinc-500">{ord.orderNumber} • {ord.date}</span>
                            <h4 className="text-sm font-bold text-white">{ord.productTitle}</h4>
                          </div>
                          <span className="self-start sm:self-center text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                            {ord.price.toLocaleString('fa-IR')} تومان • تحویل داده شده
                          </span>
                        </div>

                        {/* License Key Box with 1-click Copy */}
                        {ord.licenseKey && (
                          <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-xs font-mono font-bold text-amber-300 select-all">
                                {ord.licenseKey}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyKey(ord.licenseKey!)}
                              onMouseEnter={() => soundEngine.playHover()}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all self-end sm:self-auto"
                            >
                              {copiedKey === ord.licenseKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">کپی شد!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>کپی لایسنس</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Account credentials if applicable */}
                        {ord.accountCredentials && (
                          <div className="text-xs text-zinc-400 flex flex-wrap gap-4 pt-1">
                            <span>ایمیل اکانت: <strong className="text-zinc-200 font-mono">{ord.accountCredentials.email}</strong></span>
                            <span>گذرواژه: <strong className="text-zinc-200 font-mono">{ord.accountCredentials.pass}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SUPPORT TICKETS */}
              {activeTab === 'tickets' && (
                <div className="space-y-4">
                  {/* Ticket Header & Create Button */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>تیکت‌های پشتیبانی ۲۴/۷</span>
                    </h3>

                    <button
                      onClick={() => {
                        soundEngine.playClick(650, 0.05);
                        setIsCreatingTicket(!isCreatingTicket);
                      }}
                      onMouseEnter={() => soundEngine.playHover()}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isCreatingTicket ? 'مشاهده تیکت‌ها' : 'ثبت تیکت جدید'}</span>
                    </button>
                  </div>

                  {/* CREATE NEW TICKET FORM */}
                  {isCreatingTicket ? (
                    <form onSubmit={handleCreateTicketSubmit} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>ارسال تیکت جدید به پشتیبانی فنی و مالی</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-300 font-medium">موضوع تیکت:</label>
                          <input
                            type="text"
                            value={newTicketSubject}
                            onChange={(e) => setNewTicketSubject(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                            placeholder="مثلاً: سوال در مورد تمدید اکانت Claude Sonnet"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-zinc-300 font-medium">دپارتمان مربوطه:</label>
                          <select
                            value={newTicketDept}
                            onChange={(e) => setNewTicketDept(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#120f24] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                          >
                            <option value="ai_support">دپارتمان هوش مصنوعی و لایسنس‌ها</option>
                            <option value="game_activation">فعال‌سازی بازی‌ها و کنسول</option>
                            <option value="finance">امور مالی، کارت به کارت و کریپتو</option>
                            <option value="vip_concierge">پشتیبانی اختصاصی اعضای VIP</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-zinc-300 font-medium">شرح کامل پیام یا درخواست:</label>
                        <textarea
                          rows={4}
                          value={newTicketMessage}
                          onChange={(e) => setNewTicketMessage(e.target.value)}
                          className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none resize-none"
                          placeholder="لطفاً جزییات درخواست، شماره سفارش یا سوال خود را اینجا بنویسید..."
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-zinc-400">میانگین زمان پاسخگویی: کمتر از ۵ دقیقه</span>
                        <button
                          type="submit"
                          onMouseEnter={() => soundEngine.playHover()}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
                        >
                          ارسال تیکت ↗
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* TICKETS LIST & ACTIVE CHAT THREAD */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Ticket Selector List */}
                      <div className="md:col-span-5 space-y-2">
                        {tickets.map((tkt) => {
                          const isSelected = tkt.id === selectedTicketId;
                          return (
                            <button
                              key={tkt.id}
                              onClick={() => {
                                soundEngine.playClick(600, 0.04);
                                setSelectedTicketId(tkt.id);
                              }}
                              className={`w-full text-right p-3 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-purple-500/15 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                  : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-purple-400">{tkt.ticketNumber}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                                  tkt.status === 'answered'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : tkt.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {tkt.status === 'answered' ? 'پاسخ داده شده' : tkt.status === 'pending' ? 'در انتظار' : 'بسته شده'}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-white line-clamp-1">{tkt.subject}</h5>
                              <span className="text-[10px] text-zinc-500 mt-1 block">{tkt.lastUpdated}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Ticket Chat Thread */}
                      <div className="md:col-span-7 flex flex-col justify-between bg-black/40 border border-white/10 rounded-2xl p-4 min-h-[320px]">
                        {selectedTicket ? (
                          <>
                            {/* Thread Header */}
                            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-white">{selectedTicket.subject}</h4>
                                <span className="text-[10px] text-zinc-400">{selectedTicket.ticketNumber} • اولویت: {selectedTicket.priority === 'urgent' ? 'فوری' : 'عادی'}</span>
                              </div>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>LIVE SUPPORT</span>
                              </span>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[220px]">
                              {selectedTicket.messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
                                >
                                  <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                                      msg.sender === 'user'
                                        ? 'bg-white/10 text-white rounded-tr-sm'
                                        : msg.sender === 'ai_agent'
                                        ? 'bg-purple-900/40 border border-purple-500/40 text-purple-200 rounded-tl-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                        : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 rounded-tl-sm'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold opacity-80">
                                      <span>{msg.senderName}</span>
                                      <span className="font-mono">{msg.time}</span>
                                    </div>
                                    <p className="leading-relaxed">{msg.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Reply Input Box */}
                            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                placeholder="ارسال پاسخ به کارشناس پشتیبانی..."
                                className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                              />
                              <button
                                onClick={handleSendReply}
                                onMouseEnter={() => soundEngine.playHover()}
                                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shrink-0"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                            تیکتی انتخاب نشده است.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WALLET & DEPOSIT */}
              {activeTab === 'wallet' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-slate-900/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-400">موجودی کیف پول شما:</span>
                      <div className="text-2xl md:text-3xl font-black text-white font-mono flex items-center gap-2">
                        <span>{walletBalance.toLocaleString('fa-IR')}</span>
                        <span className="text-sm font-normal text-emerald-400">تومان</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                        تخفیف ۳٪ در پرداخت با کیف پول
                      </span>
                    </div>
                  </div>

                  {/* Top-up Selection */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-zinc-300">افزایش موجودی کیف پول:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[200000, 500000, 1000000, 2000000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            soundEngine.playClick(600, 0.04);
                            setTopupAmount(amt);
                          }}
                          className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                            topupAmount === amt
                              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                              : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {amt.toLocaleString('fa-IR')} تومان
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleTopup}
                      onMouseEnter={() => soundEngine.playHover()}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>شارژ آنلاین {topupAmount.toLocaleString('fa-IR')} تومان با درگاه شاپرک</span>
                    </button>

                    {showTopupSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs text-center animate-in fade-in">
                        کیف پول شما با موفقیت شارژ شد! 🎉
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE & SECURITY */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">اطلاعات حساب کاربری</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">نام و نام خانوادگی:</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">شماره تماس (تایید شده):</label>
                      <input
                        type="text"
                        value={userPhone}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-zinc-400 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">آدرس ایمیل:</label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">سطح حساب کاربری:</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>VIP Gold Member (تخفیف دائمی ۵٪)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        soundEngine.playSuccess();
                        alert('تغییرات پروفایل با موفقیت ذخیره شد.');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      ذخیره تغییرات پروفایل
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
