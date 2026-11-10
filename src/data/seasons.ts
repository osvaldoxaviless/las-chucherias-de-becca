import { SeasonConfig, SeasonId, StoreConfig } from '../types';

export const DEFAULT_SEASONS: Record<SeasonId, SeasonConfig> = {
  regular: {
    id: 'regular',
    name: 'Todo el Año (Clásico)',
    icon: '✨',
    badge: '🦄 El paraíso de los postres • Toluca y alrededores',
    accentColor: '#99ffcc',
    confettiColors: ['#ff99cc', '#7bbbff', '#ffcc99', '#99ffcc', '#d8b4fe'],
    seasonalAtmosphere: 'sparkles',
    cards: {
      left: {
        id: 'left',
        image: '/images/cake-monkey.jpg',
        label: '🎂 Pasteles de Diseño',
        badgeBgColor: '#99ffcc',
        alt: 'Pastel temático artesanal de Becca',
      },
      right: {
        id: 'right',
        image: '/images/cake-wedding.jpg',
        label: '🍪 Repostería Artesanal',
        badgeBgColor: '#ffcc99',
        alt: 'Repostería y pastelería fina',
      },
      bottom: {
        id: 'bottom',
        image: '/images/cake-blue.jpg',
        label: '🧁 Horneado al Día',
        badgeBgColor: '#7bbbff',
        alt: 'Cupcakes y postres recién horneados',
      },
    },
  },
  navidad: {
    id: 'navidad',
    name: 'Navidad & Fin de Año',
    icon: '🎄',
    badge: '🎄 Edición Navideña & Fin de Año • Pedidos con Anticipación',
    accentColor: '#e63946',
    confettiColors: ['#e63946', '#2a9d8f', '#e9c46a', '#ffffff', '#c1121f'],
    seasonalAtmosphere: 'snow',
    cards: {
      left: {
        id: 'left',
        image: '/images/navidad/navidad-1.jpg',
        label: '🎄 Pasteles Navideños',
        badgeBgColor: '#e63946',
        alt: 'Pastel festivo navideño de Becca',
      },
      right: {
        id: 'right',
        image: '/images/navidad/navidad-2.jpg',
        label: '🏠 Casitas de Jengibre',
        badgeBgColor: '#e9c46a',
        alt: 'Casita de galleta artesanal',
      },
      bottom: {
        id: 'bottom',
        image: '/images/navidad/navidad-5.jpg',
        label: '🧁 Cupcakes Navideños',
        badgeBgColor: '#2a9d8f',
        alt: 'Cupcakes navideños horneados al día',
      },
    },
  },
  'san-valentin': {
    id: 'san-valentin',
    name: 'San Valentín & Amor',
    icon: '💖',
    badge: '💖 Especial San Valentín & Amor • Agenda tu Sorpresa',
    accentColor: '#ff4d6d',
    confettiColors: ['#ff4d6d', '#ff758f', '#ffccd5', '#ffffff', '#c9184a'],
    seasonalAtmosphere: 'hearts',
    cards: {
      left: {
        id: 'left',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
        label: '💌 Bento Cakes de Amor',
        badgeBgColor: '#ff758f',
        alt: 'Pastel romántico vintage San Valentín',
      },
      right: {
        id: 'right',
        image: '/images/navidad/navidad-3.jpg',
        label: '🍓 Fresas con Chocolate',
        badgeBgColor: '#ff4d6d',
        alt: 'Fresas premium con chocolate artesanal',
      },
      bottom: {
        id: 'bottom',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
        label: '🧁 Cupcakes Amorosos',
        badgeBgColor: '#ffccd5',
        alt: 'Cupcakes románticos decorados a mano',
      },
    },
  },
  madres: {
    id: 'madres',
    name: 'Día de las Madres',
    icon: '🌸',
    badge: '🌸 Especial Día de las Madres • Festejando a Mamá',
    accentColor: '#d8b4fe',
    confettiColors: ['#d8b4fe', '#f472b6', '#fed7aa', '#fbcfe8', '#a78bfa'],
    seasonalAtmosphere: 'flowers',
    cards: {
      left: {
        id: 'left',
        image: '/images/cake-mom.jpg',
        label: '💐 Pasteles para Mamá',
        badgeBgColor: '#d8b4fe',
        alt: 'Pastel floral especial para el día de las madres',
      },
      right: {
        id: 'right',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        label: '🍰 Repostería Fina',
        badgeBgColor: '#f472b6',
        alt: 'Detalles de repostería fina para consentir a mamá',
      },
      bottom: {
        id: 'bottom',
        image: '/images/cake-wedding.jpg',
        label: '🌷 Cajas de Regalo',
        badgeBgColor: '#fed7aa',
        alt: 'Cajas de regalo con flores y postres',
      },
    },
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween & Día de Muertos',
    icon: '🎃',
    badge: '🎃 Halloween & Día de Muertos • Spooky Sweets',
    accentColor: '#ff9f43',
    confettiColors: ['#ff9f43', '#ee5253', '#5f27cd', '#10ac84', '#333333'],
    seasonalAtmosphere: 'bats',
    cards: {
      left: {
        id: 'left',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
        label: '👻 Pasteles Espeluznantes',
        badgeBgColor: '#ff9f43',
        alt: 'Pastel temático de Halloween y Día de Muertos',
      },
      right: {
        id: 'right',
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
        label: '🧁 Cupcakes Terroríficos',
        badgeBgColor: '#5f27cd',
        alt: 'Cupcakes con decoración divertida de temporada',
      },
      bottom: {
        id: 'bottom',
        image: '/images/navidad/navidad-4.jpg',
        label: '🍪 Galletas de Ofrenda',
        badgeBgColor: '#10ac84',
        alt: 'Galletas de mantequilla para altar y fiesta',
      },
    },
  },
  primavera: {
    id: 'primavera',
    name: 'Primavera & Pascua',
    icon: '🐣',
    badge: '🌼 Bienvenida Primavera & Pascua • Tonos Pastel',
    accentColor: '#86efac',
    confettiColors: ['#86efac', '#fef08a', '#bae6fd', '#fbcfe8', '#fed7aa'],
    seasonalAtmosphere: 'flowers',
    cards: {
      left: {
        id: 'left',
        image: '/images/cake-blue.jpg',
        label: '🐣 Pasteles de Primavera',
        badgeBgColor: '#bae6fd',
        alt: 'Pastel primaveral con colores suaves',
      },
      right: {
        id: 'right',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
        label: '🐰 Repostería de Pascua',
        badgeBgColor: '#fef08a',
        alt: 'Galletas y cupcakes de pascua',
      },
      bottom: {
        id: 'bottom',
        image: '/images/cake-monkey.jpg',
        label: '🌸 Antojitos en Flor',
        badgeBgColor: '#86efac',
        alt: 'Postres frescos de temporada',
      },
    },
  },
};

export const SEASONS_LIST: SeasonConfig[] = Object.values(DEFAULT_SEASONS);

/**
 * Returns the currently active SeasonConfig merged with user customizations.
 */
export function getActiveSeasonConfig(config: StoreConfig): SeasonConfig {
  const activeId = config.activeSeason || 'regular';
  const defaultSeason = DEFAULT_SEASONS[activeId] || DEFAULT_SEASONS.regular;
  const userSeason = config.seasons?.[activeId];

  if (!userSeason) return defaultSeason;

  return {
    ...defaultSeason,
    ...userSeason,
    cards: {
      left: { ...defaultSeason.cards.left, ...(userSeason.cards?.left || {}) },
      right: { ...defaultSeason.cards.right, ...(userSeason.cards?.right || {}) },
      bottom: { ...defaultSeason.cards.bottom, ...(userSeason.cards?.bottom || {}) },
    },
  };
}
