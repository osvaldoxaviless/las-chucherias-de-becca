export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: '¿Con cuánta anticipación debo hacer mi pedido?',
    answer: 'Para postres del catálogo diario (mini cookies, fresas, manzanas, domos de uvas) recomendamos al menos 24 a 48 horas de anticipación. Para Bento Cakes y pasteles de cumpleaños requerimos de 3 a 5 días, y para tortas temáticas complejas o eventos grandes, de 1 a 2 semanas.'
  },
  {
    question: '¿Cómo funciona la entrega a domicilio (Delivery)?',
    answer: 'Contamos con envíos locales seguros en Toluca, Metepec, San Mateo Atenco y Zinacantepec a través de servicio de chofer privado/mensajería con costo adicional según tu ubicación exacta. También puedes retirar sin costo en nuestro taller ubicado en El Oro 112, Toluca.'
  },
  {
    question: '¿Cómo se realiza el pago del pedido?',
    answer: 'Al enviar tu pedido por la web se abre el chat directo de WhatsApp. Para apartar tu fecha y comenzar a preparar tus delicias requerimos un anticipo del 50% vía transferencia interbancaria (SPEI) o depósito en OXXO. El 50% restante se liquida contra entrega.'
  },
  {
    question: '¿Puedo personalizar el mensaje o dedicatoria de mi pastel?',
    answer: '¡Por supuesto! En el carrito de compra o en el cotizador puedes dejarnos la frase corta, el nombre o la dedicatoria que deseas que lleve tu pastel o la tarjeta de regalo sin costo adicional.'
  },
  {
    question: '¿Tienen opciones para intolerancias o alergias?',
    answer: 'Muchos de nuestros productos contienen lácteos, gluten y frutos secos (nuez, almendra). Si tú o tu festejado tienen alguna alergia en específico, por favor indícalo en las notas de tu pedido para ofrecerte las opciones más adecuadas.'
  }
];
