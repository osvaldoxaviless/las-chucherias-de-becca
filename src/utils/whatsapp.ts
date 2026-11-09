import { CartItem, DeliveryDetails, CustomCakeQuote } from '../types';

export function createWhatsAppOrderUrl(
  phoneNumber: string,
  items: CartItem[],
  delivery: DeliveryDetails,
  subtotal: number,
  deliveryCost: number,
  total: number
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  let message = `🧁 *¡HOLA, LAS CHUCHERÍAS DE BECCA!* 🧁\n`;
  message += `Quiero realizar un pedido desde la página web:\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🛒 *RESUMEN DE PRODUCTOS:*\n`;
  
  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    message += `\n*${index + 1}. ${item.product.name}* x${item.quantity} — $${itemTotal.toLocaleString('es-MX')} MXN`;
    
    if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
      Object.entries(item.selectedOptions).forEach(([key, val]) => {
        message += `\n   ▫️ ${key}: ${val}`;
      });
    }
    if (item.note) {
      message += `\n   ▫️ Nota/Dedicatoria: "${item.note}"`;
    }
  });

  message += `\n\n━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🧾 *DESGLOSE DE CUENTA:*\n`;
  message += `▪️ *Subtotal postres:* $${subtotal.toLocaleString('es-MX')} MXN\n`;
  
  if (delivery.type === 'delivery') {
    message += `▪️ *Costo de envío (${delivery.zoneName || 'A domicilio'}):* $${deliveryCost.toLocaleString('es-MX')} MXN\n`;
    message += `   _(Envío a domicilio calculado según zona)_\n`;
  } else {
    message += `▪️ *Entrega:* Retiro en Taller (Gratis $0 MXN)\n`;
  }

  message += `\n💰 *TOTAL A PAGAR: $${total.toLocaleString('es-MX')} MXN*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  message += `📦 *DATOS DE ENTREGA:*\n`;
  message += `👤 *Cliente:* ${delivery.customerName || 'No indicado'}\n`;
  message += `📞 *Teléfono:* ${delivery.phone || 'No indicado'}\n`;
  message += `📅 *Fecha requerida:* ${delivery.deliveryDate || 'A coordinar'}\n`;
  message += `⏰ *Hora aproximada:* ${delivery.deliveryTime || 'A coordinar'}\n`;
  message += `📍 *Método:* ${delivery.type === 'delivery' ? `🚗 Envío (${delivery.zoneName || 'Local'})` : '🏪 Retiro en Taller (El Oro 112, Toluca)'}\n`;
  
  if (delivery.type === 'delivery' && delivery.address) {
    message += `🏡 *Dirección de Entrega:* ${delivery.address}`;
    if (delivery.neighborhood) {
      message += `, Col. ${delivery.neighborhood}`;
    }
    message += `\n`;
  }

  if (delivery.notes) {
    message += `📝 *Notas extras:* ${delivery.notes}\n`;
  }

  message += `\n¿Me podrías confirmar disponibilidad y los datos para realizar el anticipo? ¡Muchas gracias! 🦄💜`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppCakeQuoteUrl(
  phoneNumber: string,
  quote: CustomCakeQuote
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  let message = `🎂 *¡HOLA, BECCA! ARMA TU PASTEL / COTIZACIÓN* 🎂\n`;
  message += `Diseñé mi pastel a medida desde tu web:\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🧁 *RECETA DE MI PASTEL:*\n`;
  message += `▫️ *Tamaño / Estructura:* ${quote.tier} (${quote.servings})\n`;
  message += `▫️ *Sabor de Pan (Bizcocho):* ${quote.flavorName}\n`;
  message += `▫️ *Relleno Interior:* ${quote.fillingName}\n`;
  message += `▫️ *Cobertura Exterior:* ${quote.frostingName}\n`;
  
  if (quote.toppings && quote.toppings.length > 0) {
    message += `▫️ *Toppings & Decoración:* ${quote.toppings.join(', ')}\n`;
  }
  
  if (quote.candle) {
    message += `▫️ *Velita de Cumpleaños:* Sí, incluida 🕯️\n`;
  }

  if (quote.dedication) {
    message += `▫️ *Placa / Dedicatoria:* "${quote.dedication}" 🍫\n`;
  }

  message += `\n💰 *Precio Base Estimado:* $${quote.estimatedPrice.toLocaleString('es-MX')} MXN\n`;
  message += `_(Nota: Precio aproximado; el costo final acordado dependerá del diseño, temática y nivel de personalización)._\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (quote.isSpecialArtDesign) {
    message += `🎨 *DISEÑO ARTÍSTICO / ESPECIAL (3D / Personaje / Pinterest):*\n`;
    message += `Quiero cotizar este pastel con decoración especial o figuras modeladas. ¡Tengo imágenes de referencia listas para enviarte por aquí!\n\n`;
  }

  if (quote.customerName) {
    message += `👤 *Nombre:* ${quote.customerName}\n`;
  }
  if (quote.phone) {
    message += `📱 *WhatsApp:* ${quote.phone}\n`;
  }
  if (quote.eventDate) {
    message += `📅 *Fecha del Evento:* ${quote.eventDate}\n`;
  }
  if (quote.details) {
    message += `💭 *Notas o Ideas:* "${quote.details}"\n`;
  }

  message += `\n¿Me podrías confirmar disponibilidad de fecha y afinar los detalles? ¡Gracias! ✨`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppDirectUrl(phoneNumber: string, text: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
