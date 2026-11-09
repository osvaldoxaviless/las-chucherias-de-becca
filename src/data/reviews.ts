export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number;
  product: string;
  source: string;
  date: string;
}

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Valeria M.',
    comment: '¡El bento cake para el cumpleaños de mi novio quedó idéntico a la foto que le mandé! Y el sabor de red velvet con frutos rojos estaba delicioso, súper fresco y nada empalagoso.',
    rating: 5,
    product: 'Bento Cake Personalizado',
    source: 'Instagram DM',
    date: 'Hace 3 días'
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    comment: 'Pedí la caja de fresas con chocolate y un domo de uvas para un aniversario y fue un éxito total. La presentación impecable y la atención de Becca por WhatsApp súper amable.',
    rating: 5,
    product: 'Fresas con Chocolate & Uvas',
    source: 'Toluca Centro',
    date: 'Hace 1 semana'
  },
  {
    id: '3',
    name: 'Fernanda Ortiz',
    comment: 'Las mini cookies son una adicción total. Pedí una bolsita para probar y al día siguiente ya estaba pidiendo dos más para la oficina. ¡100% recomendadas!',
    rating: 5,
    product: 'Mini Cookies de las Chuches',
    source: 'Metepec',
    date: 'Hace 2 semanas'
  }
];
