import React, { useState } from 'react';
import { Gift, Plus, Minus, Trash2, Heart, Sparkles, Send, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoreConfig, CartItem, Product } from '../types';
import { createWhatsAppDirectUrl } from '../utils/whatsapp';

interface Props {
  config: StoreConfig;
  onAddBoxToCart: (item: CartItem) => void;
}

interface BoxTier {
  id: string;
  name: string;
  slots: number;
  basePrice: number;
  desc: string;
}

interface SweetChoice {
  id: string;
  name: string;
  icon: string;
  image: string;
  category: string;
}

const BOX_TIERS: BoxTier[] = [
  { id: 'petite', name: 'Chuche Box Petite', slots: 4, basePrice: 280, desc: 'Detalle íntimo y perfecto' },
  { id: 'deluxe', name: 'Chuche Box Deluxe', slots: 6, basePrice: 410, desc: 'La más pedida para aniversarios' },
  { id: 'grand', name: 'Grand Chuche Luxury', slots: 8, basePrice: 560, desc: 'Experiencia dulce completa' },
];

const BOX_STYLES = [
  { id: 'kraft', name: 'Kraft Rústico & Elegante', bg: '#EAD7BA', border: '#C7B08B' },
  { id: 'pink', name: 'Rosa Pastel Boutique', bg: '#FCE7EC', border: '#F472B6' },
  { id: 'black', name: 'Edición Negra Luxury', bg: '#292524', border: '#44403C' },
];

const RIBBONS = [
  { id: 'oro', name: 'Dorado Champaña', color: '#D4AF37' },
  { id: 'lila', name: 'Lila Chuches', color: '#C084FC' },
  { id: 'rosa', name: 'Fucsia Dulce', color: '#F43F5E' },
  { id: 'vino', name: 'Borgoña Pasión', color: '#881337' },
];

const SWEET_ITEMS: SweetChoice[] = [
  { id: 'fresas-choco', name: 'Par de Fresas con Chocolate', icon: '🍓', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80', category: 'Frutas' },
  { id: 'manzana-chamoy', name: 'Manzana con Chamoy & Chile', icon: '🍏', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=300&q=80', category: 'Chuches' },
  { id: 'uvas-frosty', name: 'Mini Domo Uvas Escarchadas', icon: '🍇', image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=300&q=80', category: 'Frutas' },
  { id: 'mini-cookies', name: 'Tercia de Mini Cookies', icon: '🍪', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80', category: 'Horneados' },
  { id: 'cupcake-love', name: 'Cupcake "Pedacito de Amor"', icon: '🧁', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=300&q=80', category: 'Horneados' },
  { id: 'brownie-nuez', name: 'Cuadro de Brownie Melcochoso', icon: '🍫', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80', category: 'Horneados' },
];

export const ChucheBoxBuilder: React.FC<Props> = ({ config, onAddBoxToCart }) => {
  const [tier, setTier] = useState(BOX_TIERS[1]); // Deluxe 6
  const [boxStyle, setBoxStyle] = useState(BOX_STYLES[1]); // Pink
  const [ribbon, setRibbon] = useState(RIBBONS[0]); // Gold
  const [selectedItems, setSelectedItems] = useState<SweetChoice[]>([
    SWEET_ITEMS[0], // fresas
    SWEET_ITEMS[1], // manzana
    SWEET_ITEMS[2], // uvas
    SWEET_ITEMS[3], // cookies
  ]);
  const [dedicationText, setDedicationText] = useState('Para la persona más especial de mi mundo ❤️ Con todo mi amor');
  const [recipientName, setRecipientName] = useState('Mi Persona Favorita');

  const addItemToBox = (item: SweetChoice) => {
    if (selectedItems.length >= tier.slots) {
      alert(`Tu caja "${tier.name}" tiene un límite de ${tier.slots} espacios. Puedes cambiar a una caja más grande si deseas agregar más delicias.`);
      return;
    }
    setSelectedItems([...selectedItems, item]);
  };

  const removeItemFromBox = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      alert('Por favor agrega al menos un dulce a tu caja.');
      return;
    }

    const itemsSummary = selectedItems.map((s) => s.name).join(', ');

    const boxProduct: Product = {
      id: `box-${Date.now()}`,
      name: `${tier.name} Personalizada`,
      price: tier.basePrice,
      category: 'cajas-regalo',
      description: `Caja ${boxStyle.name} con moño ${ribbon.name}. Contiene: ${itemsSummary}`,
      image: selectedItems[0]?.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      badge: 'Caja Personalizada 🎁',
    };

    const cartItem: CartItem = {
      product: boxProduct,
      quantity: 1,
      selectedOptions: {
        'Caja': boxStyle.name,
        'Moño': ribbon.name,
        'Contenido': `${selectedItems.length} delicias seleccionadas`,
      },
      note: `Para: ${recipientName} — "${dedicationText}"`,
    };

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    onAddBoxToCart(cartItem);
  };

  const handleDirectWhatsApp = () => {
    const itemsSummary = selectedItems.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
    const msg = `🎁 *¡HOLA, BECCA! QUIERO ESTA CHUCHE BOX PERSONALIZADA* 🎁\n\n` +
      `📦 *Tamaño:* ${tier.name} ($${tier.basePrice} MXN)\n` +
      `🎨 *Color de Caja:* ${boxStyle.name}\n` +
      `🎀 *Color de Listón:* ${ribbon.name}\n\n` +
      `✨ *Contenido seleccionado:*\n${itemsSummary}\n\n` +
      `💌 *Dedicatoria en Tarjeta:*\n"Para: ${recipientName}\n${dedicationText}"\n\n` +
      `¿Me confirmas disponibilidad para apartar? ¡Muchas gracias! 🦄💜`;

    window.open(createWhatsAppDirectUrl(config.whatsappNumber, msg), '_blank');
  };

  return (
    <section id="box-builder" className="py-20 sm:py-28 bg-[#FFFDF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Gift className="w-3.5 h-3.5 text-rose-600" />
            <span>Creador de Regalos Únicos</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Arma tu Chuche Box 🎁✨
          </h2>
          <p className="font-handwriting text-2xl sm:text-3xl text-rose-600 font-bold -rotate-1">
            "El regalo más dulce y memorable de Toluca, creado por ti"
          </p>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Elige el tamaño de tu caja, el moño, llena cada espacio con los postres favoritos de tu persona especial 
            y escribe una dedicatoria que imprimiremos en una elegante tarjeta postal.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: The Interactive Box Visualizer */}
          <div className="lg:col-span-6 bg-gradient-to-b from-stone-50 to-pink-50/40 rounded-3xl p-6 sm:p-8 border-2 border-dashed border-pink-200 flex flex-col justify-between min-h-[550px] shadow-sm">
            
            {/* Box Header & Ribbon Accent */}
            <div className="flex items-center justify-between pb-4 border-b border-pink-200/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                  Caja en Construcción
                </span>
                <h3 className="font-display font-bold text-xl text-stone-900">
                  {tier.name}
                </h3>
              </div>

              {/* Ribbon pill badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-xs border border-stone-200">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ribbon.color }} />
                <span className="text-xs font-semibold text-stone-700">{ribbon.name}</span>
              </div>
            </div>

            {/* Box Interior / Slots Grid */}
            <div className="my-6 p-6 rounded-3xl border-4 shadow-xl transition-all duration-500 relative"
              style={{
                backgroundColor: boxStyle.bg,
                borderColor: boxStyle.border,
              }}
            >
              {/* Ribbon Graphic crossing the box */}
              <div 
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 opacity-80 pointer-events-none z-0 shadow-md"
                style={{ backgroundColor: ribbon.color }}
              />
              <div 
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 opacity-80 pointer-events-none z-0 shadow-md"
                style={{ backgroundColor: ribbon.color }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full z-10 flex items-center justify-center text-xl shadow-lg border-2 border-white"
                style={{ backgroundColor: ribbon.color }}
              >
                🎀
              </div>

              {/* Slots Container */}
              <div className={`relative z-20 grid gap-3 ${
                tier.slots === 4 ? 'grid-cols-2' : tier.slots === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
              }`}>
                {[...Array(tier.slots)].map((_, index) => {
                  const filledItem = selectedItems[index];

                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-all ${
                        filledItem
                          ? 'bg-white/95 backdrop-blur-xs shadow-md border-2 border-pink-300'
                          : 'bg-white/40 border-2 border-dashed border-stone-400/50 hover:bg-white/70'
                      }`}
                    >
                      {filledItem ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <button
                            onClick={() => removeItemFromBox(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs hover:bg-rose-600 text-[10px]"
                            title="Quitar de la caja"
                          >
                            ×
                          </button>
                          <span className="text-3xl mb-1">{filledItem.icon}</span>
                          <span className="font-bold text-[10px] text-stone-800 line-clamp-2 leading-tight">
                            {filledItem.name}
                          </span>
                        </div>
                      ) : (
                        <div className="text-stone-400 flex flex-col items-center">
                          <Plus className="w-5 h-5 mb-1 opacity-50" />
                          <span className="text-[10px] font-semibold">Espacio {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Capacity meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-600">
                  Capacidad: {selectedItems.length} de {tier.slots} espacios
                </span>
                <span className="text-rose-600">
                  {selectedItems.length === tier.slots ? '¡Caja Completa! ✨' : `Faltan ${tier.slots - selectedItems.length} delicias`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 rounded-full"
                  style={{ width: `${(selectedItems.length / tier.slots) * 100}%` }}
                />
              </div>
            </div>

            {/* Live Handwritten Postcard Preview */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FFFDF7] border border-amber-200/90 shadow-soft washi-tape relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block">
                    Tarjeta Postal de Regalo
                  </span>
                  <p className="font-handwriting text-xl text-stone-800 font-bold mt-1">
                    De parte de Las chucherías de Becca
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center text-[10px] font-bold text-amber-950 font-serif shadow-xs">
                  B
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-amber-100">
                <p className="font-handwriting text-lg text-rose-800 font-semibold leading-relaxed">
                  Para: {recipientName || 'Mi Persona Favorita'}
                </p>
                <p className="font-handwriting text-base text-stone-700 italic leading-snug">
                  "{dedicationText || 'Escribe tu dedicatoria especial...'}"
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Customizer Controls */}
          <div className="lg:col-span-6 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-card">
            
            {/* Step 1: Box Size */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Elige el Tamaño de Caja:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BOX_TIERS.map((t) => {
                  const isSelected = tier.id === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTier(t);
                        if (selectedItems.length > t.slots) {
                          setSelectedItems(selectedItems.slice(0, t.slots));
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 shadow-sm ring-1 ring-rose-400'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span className="font-bold text-xs text-stone-900 block">{t.name}</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">{t.slots} delicias</span>
                      <span className="text-xs font-black text-rose-600 block mt-1.5">
                        ${t.basePrice} MXN
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Box Color & Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  <span>Color del Empaque:</span>
                </label>
                <div className="space-y-1.5">
                  {BOX_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setBoxStyle(st)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        boxStyle.id === st.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: st.bg }} />
                      <span>{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  <span>Color del Moño:</span>
                </label>
                <div className="space-y-1.5">
                  {RIBBONS.map((rb) => (
                    <button
                      key={rb.id}
                      type="button"
                      onClick={() => setRibbon(rb)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                        ribbon.id === rb.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: rb.color }} />
                      <span>{rb.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Add sweets to box */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>Selecciona las Chuches para tu Caja:</span>
                </div>
                <span className="text-[11px] text-stone-400 font-normal">Toca para agregar</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SWEET_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItemToBox(item)}
                    className="p-2.5 rounded-2xl border border-stone-200 hover:border-rose-400 bg-stone-50/60 hover:bg-rose-50/50 text-left transition-all group flex flex-col justify-between h-24"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="w-5 h-5 rounded-full bg-white text-rose-600 font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-rose-500 group-hover:text-white">
                        +
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 line-clamp-2 leading-tight">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Personal Dedication */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                <span>Dedicatoria para la Tarjeta Postal:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-600 block mb-1">¿Para quién es?</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej: Mi Novia Sofía, Mamá..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Mensaje o Dedicatoria</label>
                  <input
                    type="text"
                    value={dedicationText}
                    onChange={(e) => setDedicationText(e.target.value)}
                    maxLength={140}
                    placeholder="Ej: ¡Feliz Aniversario mi amor! Eres lo más dulce..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar Caja al Carrito (${tier.basePrice} MXN)</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                title="Pedir caja directa por WhatsApp"
              >
                <Send className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
