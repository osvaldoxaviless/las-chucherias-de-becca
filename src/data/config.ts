import { StoreConfig } from '../types';
import { DEFAULT_PORTFOLIO_ITEMS } from './portfolio';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Las chucherías de Becca',
  instagramHandle: 'laschucheriasdebecca',
  whatsappNumber: '527225628061',
  address: 'El Oro 112, Toluca, Estado de México',
  city: 'Toluca y alrededores',
  announcementText: 'Toluca y alrededores • Pedidos con anticipación',
  bannerVisible: true,
  isStoreOpen: true,
  adminPin: '2026',
  currency: 'MXN',
  heroBadge: '🦄 El paraíso de los postres • Toluca y alrededores',
  heroTitle: 'El paraíso de los postres y pasteles únicos para celebrar.',
  heroSubtitle: 'Pasteles personalizados, bento cakes temáticos, fresas con chocolate y repostería artesanal por Rebecca Sánchez en Toluca y alrededores (envío calculado según zona).',
  heroButtonPrimary: 'Ver Menú de Postres',
  heroButtonSecondary: 'Atelier: Arma tu Pastel',
  aboutTitle: 'Hola, soy Becca.',
  aboutStory: 'Las chucherías de Becca nació del amor por hornear postres que no solo se vean hermosos, sino que tengan un sabor inolvidable. Desde nuestro taller en Toluca elaboramos cada creación artesanalmente con mantequilla pura, chocolate de primera calidad y fruta fresca al día.',
  aboutQuote: 'Cada pastel es horneado especialmente para tu celebración con ingredientes frescos.',
  // Canvas por Bloques
  blockOrder: ['hero', 'catalog', 'customizer', 'portfolio', 'about', 'faq'],
  hiddenBlocks: [],
  // Fotos de pasteles personalizados
  customTierImages: {
    bento: '/images/cake-blue.jpg',
    '1piso': '/images/cake-mom.jpg',
    '1piso-alto': '/images/cake-corporate.jpg',
    '2pisos': '/images/cake-wedding.jpg',
  },
  portfolioItems: DEFAULT_PORTFOLIO_ITEMS,
};
