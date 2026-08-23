export type MainPortalCategory = 'education' | 'social' | 'ai' | 'design_gaming';

export type ProductCategory = 
  | 'all' 
  | 'education' 
  | 'social' 
  | 'ai' 
  | 'design_gaming' 
  | 'gaming' 
  | 'giftcard' 
  | 'currency';

export type Platform = 'PC' | 'PS5' | 'PS4' | 'Xbox' | 'Steam' | 'Battle.net' | 'Web' | 'iOS' | 'Android';

export interface Product {
  id: string;
  title: string;
  englishTitle: string;
  category: 'education' | 'social' | 'ai' | 'design_gaming' | 'gaming' | 'giftcard' | 'currency';
  mainCategory?: MainPortalCategory;
  price: number; // in Tomans
  originalPrice?: number;
  discountPercent?: number;
  isHot?: boolean;
  isSpecialOffer?: boolean;
  deliveryTime: string; // e.g. "تحویل آنی", "۱۰ دقیقه"
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  characterImage?: string; // Transparent PNG / cutout
  backdropImage: string;
  platforms: Platform[];
  accountType: string; // e.g. "اکانت قانونی", "ظرفیت ۲", "کد فعال‌سازی", "اشتراک ۱ ماهه"
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  systemRequirements?: {
    os: string;
    gpu: string;
    ram: string;
    storage: string;
  };
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPlatform?: Platform;
  selectedAccountType?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  highlightText: string;
  englishTitle: string;
  subtitle: string;
  description: string;
  badge: string;
  price: number;
  originalPrice?: number;
  backdropImage: string;
  characterImage: string;
  platforms: Platform[];
  warranty: string;
  version: string;
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  gameTitle: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}
