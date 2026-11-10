export type ProductCategory = 
  | 'todos'
  | 'chucherias'
  | 'pasteles'
  | 'cupcakes'
  | 'galletas-brownies'
  | 'cajas-regalo';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  servings?: string;
  badge?: string;
  popular?: boolean;
  available?: boolean; // Toggle for "Disponible / Agotado"
  preparationTime?: string;
  options?: {
    name: string;
    choices: string[];
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  note?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface DeliveryDetails {
  type: 'delivery' | 'pickup';
  zoneId?: string;
  zoneName?: string;
  deliveryCost: number; // Costo de envío pagado por el cliente
  customerName: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
  address?: string;
  neighborhood?: string;
  notes?: string;
}

export interface CustomCakeQuote {
  eventType: string;
  servings: string;
  tier: string;
  flavor: string;
  flavorName: string;
  filling: string;
  fillingName: string;
  frosting: string;
  frostingName: string;
  toppings: string[];
  candle: boolean;
  dedication?: string;
  estimatedPrice: number;
  isSpecialArtDesign: boolean;
  customerName?: string;
  phone?: string;
  eventDate?: string;
  details?: string;
}

export interface CustomizerFlavor {
  id: string;
  name: string;
  tagColor?: string;
  color?: string;
  desc?: string;
}

export interface CustomizerFilling {
  id: string;
  name: string;
  price: number;
}

export interface CustomizerFrosting {
  id: string;
  name: string;
  desc?: string;
  color?: string;
  isNaked?: boolean;
}

export interface CustomizerTopping {
  id: string;
  name: string;
  price: number;
}

export interface PortfolioItem {
  id: string;
  frameNum: string;
  title: string;
  category: string;
  servings: string;
  image: string;
  description: string;
}

export type SeasonId = 
  | 'regular'
  | 'navidad'
  | 'san-valentin'
  | 'madres'
  | 'halloween'
  | 'primavera';

export interface HeroCardConfig {
  id: 'left' | 'right' | 'bottom';
  image: string;
  label: string;
  badgeBgColor?: string;
  alt?: string;
}

export interface SeasonConfig {
  id: SeasonId;
  name: string;
  icon: string;
  badge: string;
  accentColor: string;
  confettiColors: string[];
  seasonalAtmosphere?: 'none' | 'snow' | 'hearts' | 'flowers' | 'bats' | 'sparkles';
  cards: {
    left: HeroCardConfig;
    right: HeroCardConfig;
    bottom: HeroCardConfig;
  };
}

export interface StoreConfig {
  storeName: string;
  instagramHandle: string;
  whatsappNumber: string;
  address: string;
  city: string;
  announcementText: string;
  bannerVisible: boolean;
  isStoreOpen: boolean;
  adminPin: string;
  currency: string;
  // Redacción y textos editables de la página principal (Español de México)
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroButtonPrimary?: string;
  heroButtonSecondary?: string;
  aboutTitle?: string;
  aboutStory?: string;
  aboutQuote?: string;
  // Sabores e ingredientes editables para "Arma tu pastel"
  customFlavors?: CustomizerFlavor[];
  customFillings?: CustomizerFilling[];
  customFrostings?: CustomizerFrosting[];
  customToppings?: CustomizerTopping[];
  // Canvas por Bloques & Personalización Visual
  blockOrder?: string[];
  hiddenBlocks?: string[];
  customTierImages?: Record<string, string>;
  portfolioItems?: PortfolioItem[];
  // Capas de Personalización por Temporada
  activeSeason?: SeasonId;
  seasons?: Record<SeasonId, SeasonConfig>;
  enableSeasonalAtmosphere?: boolean;
}
