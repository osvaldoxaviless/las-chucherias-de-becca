import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'chuche-manzanas',
    name: 'Manzanas Gourmet Cubiertas',
    category: 'chucherias',
    price: 85,
    description: 'Manzana crujiente cubierta artesanalmente con chamoy y chile acidito, o chocolate de leche con nuez y caramelo.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    servings: '1 pza grande en palito',
    badge: 'Antojo',
    popular: true,
    available: true,
    preparationTime: '24 hrs',
    options: [
      {
        name: 'Cobertura',
        choices: ['Chamoy & Chile acidito', 'Chocolate de Leche con Nuez', 'Caramelo Clásico & Nuez']
      }
    ]
  },
  {
    id: 'chuche-bento-cake',
    name: 'Pastel Personalizado Artesanal',
    category: 'pasteles',
    price: 260,
    description: 'Elige tu formato (Bento, 1 Piso o 2 Pisos), sabor de bizcocho horneado al día, relleno gourmet y betún a tu gusto.',
    image: '/images/cake-mom.jpg',
    servings: 'Desde 2 hasta 35 personas',
    badge: 'Arma tu Pastel',
    popular: true,
    available: true,
    preparationTime: '2 a 3 días',
    options: [
      {
        name: 'Formato',
        choices: ['Bento Cake Mini (2-4 pers)', '1 Piso Redondo (8-12 pers)', '1 Piso Alto Gourmet (16-20 pers)', '2 Pisos Celebración (25-35 pers)']
      },
      {
        name: 'Bizcocho',
        choices: ['Vainilla de Papantla', 'Chocolate Tradicional', 'Red Velvet', 'Zanahoria con Nuez']
      }
    ]
  },
  {
    id: 'chuche-kit-casa-galleta',
    name: 'Kit Casa de Galleta Navideña',
    category: 'galletas-brownies',
    price: 199,
    description: 'Kit para armar y decorar en familia: galletas de mantequilla, 6 a 8 mangas de royal icing de colores, sprinkles, bombones y base.',
    image: '/images/navidad/navidad-2.jpg',
    servings: 'Kit familiar',
    badge: 'Edición Navideña 🎄',
    popular: true,
    available: true,
    preparationTime: '24 hrs',
    options: [
      {
        name: 'Tamaño del Kit',
        choices: ['Kit 2: 1 Casa Mediana ($199)', 'Kit 3: 1 Casa Grande ($219)', 'Kit 1: 2 Casas Pequeñas ($239)']
      }
    ]
  },
  {
    id: 'chuche-chocobombas-caja',
    name: 'Chocobombas Navideñas (Caja)',
    category: 'cajas-regalo',
    price: 270,
    description: 'Esferas de chocolate rellenas de bombones y cacao para disolver en leche caliente. Sabores: Crema de avellana, Moka, Chocolate Abuelita y Menta.',
    image: '/images/navidad/navidad-3.jpg',
    servings: 'Caja con 6 piezas',
    badge: 'Edición Navideña 🎄',
    popular: true,
    available: true,
    preparationTime: '24 hrs',
    options: [
      {
        name: 'Presentación',
        choices: ['Caja 6 piezas ($270)', 'Caja 4 piezas ($195)', 'Caja 12 piezas ($520)', '1 pieza individual ($52)']
      }
    ]
  },
  {
    id: 'chuche-cupcakes-navidad',
    name: 'Caja de 6 Cupcakes Navideños',
    category: 'cupcakes',
    price: 265,
    description: 'Cupcakes suaves con decoraciones navideñas en relieve: arbolito con sprinkles, hombrecito de jengibre, corona festiva y copo de nieve.',
    image: '/images/navidad/navidad-5.jpg',
    servings: 'Caja con 6 cupcakes',
    badge: 'Edición Navideña 🎄',
    popular: true,
    available: true,
    preparationTime: '24 a 48 hrs'
  },
  {
    id: 'chuche-tarro-jengibre',
    name: 'Tarro con Galletas de Jengibre Reno',
    category: 'galletas-brownies',
    price: 249,
    description: 'Tarro galletero de vidrio reutilizable con listón navideño y 10 galletas artesanales de jengibre y especias en forma de reno.',
    image: '/images/navidad/navidad-4.jpg',
    servings: 'Tarro con 10 galletas',
    badge: 'Edición Navideña 🎄',
    popular: true,
    available: true,
    preparationTime: '24 hrs'
  },
  {
    id: 'chuche-tarro-suspiros',
    name: 'Tarro de Suspiros Navideños',
    category: 'chucherias',
    price: 129,
    description: 'Tarro con merengues y suspiros navideños combinados en figuras festivas. Sabores: plátano, vainilla, avellana o café.',
    image: '/images/navidad/navidad-1.jpg',
    servings: 'Tarro chico (9 suspiros)',
    badge: 'Edición Navideña 🎄',
    popular: true,
    available: true,
    preparationTime: '24 hrs',
    options: [
      {
        name: 'Tamaño del Tarro',
        choices: ['Tarro chico con 9 suspiros ($129)', 'Tarro grande con 17 suspiros ($229)']
      }
    ]
  },
  {
    id: 'chuche-fresas-box',
    name: 'Fresas con Chocolate Gourmet',
    category: 'chucherias',
    price: 260,
    description: 'Fresas selectas frescas bañadas en chocolate con leche y chocolate blanco con finas líneas decorativas.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    servings: 'Caja con 12 piezas',
    badge: 'Regalo',
    popular: true,
    available: true,
    preparationTime: '24 hrs'
  },
  {
    id: 'chuche-caja-regalo',
    name: 'Caja Regalo "Dulce Abrazo"',
    category: 'cajas-regalo',
    price: 380,
    description: 'Selección de fresas cubiertas, mini galletas, brownies artesanales y tarjeta dedicatoria en caja rígida con moño.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    servings: 'Para compartir',
    badge: 'Regalo',
    popular: true,
    available: true,
    preparationTime: '24 hrs'
  },
  {
    id: 'chuche-cajita-minis-navidad',
    name: 'Cajita de Mini Galletas Decoradas',
    category: 'cajas-regalo',
    price: 219,
    description: 'Cajita alargada con 14 mini galletas de mantequilla decoradas a mano con motivos navideños artesanales.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    servings: 'Caja de 14 mini galletas',
    badge: 'Edición Navideña 🎄',
    popular: false,
    available: true,
    preparationTime: '24 hrs'
  }
];
