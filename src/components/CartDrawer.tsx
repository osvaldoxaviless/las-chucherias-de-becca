import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Send, MapPin } from 'lucide-react';
import { CartItem, DeliveryDetails, StoreConfig, DeliveryZone } from '../types';
import { createWhatsAppOrderUrl } from '../utils/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  config: StoreConfig;
}

const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'toluca', name: 'Toluca Centro & Alrededores', price: 50, description: 'Hasta 6 km del taller' },
  { id: 'metepec', name: 'Metepec / Providencia / San Carlos', price: 70, description: 'Zona residencial y comercial' },
  { id: 'zinacantepec', name: 'Zinacantepec / San Mateo / Lerma', price: 95, description: 'Zona conurbada' },
  { id: 'app', name: 'Uber Flash / Didi (Por Cobrar)', price: 0, description: 'Pagas el viaje directo en tu app' },
];

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  config,
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Tarde (2:00 PM - 6:00 PM)');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryCost = deliveryType === 'delivery' ? selectedZone.price : 0;
  const grandTotal = subtotal + deliveryCost;

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customerName.trim()) {
      alert('Por favor indica tu nombre.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Por favor indica la dirección de entrega.');
      return;
    }

    const deliveryDetails: DeliveryDetails = {
      type: deliveryType,
      zoneId: deliveryType === 'delivery' ? selectedZone.id : undefined,
      zoneName: deliveryType === 'delivery' ? selectedZone.name : undefined,
      deliveryCost,
      customerName: customerName.trim(),
      phone: phone.trim() || 'Por WhatsApp',
      deliveryDate: deliveryDate || 'A coordinar',
      deliveryTime,
      address: address.trim() || undefined,
      neighborhood: neighborhood.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const url = createWhatsAppOrderUrl(
      config.whatsappNumber,
      items,
      deliveryDetails,
      subtotal,
      deliveryCost,
      grandTotal
    );

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-black flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black flex items-center justify-between bg-[#f5f4f0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-recoleta font-bold text-lg text-black">
                Tu Pedido ({items.length})
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Cerrar carrito"
              className="p-2 rounded-btn text-black hover:bg-black/10 border border-black/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <span className="text-4xl block">🧁</span>
                <p className="font-bold text-black text-sm">
                  Tu carrito está vacío
                </p>
                <p className="text-xs text-black/60 max-w-xs mx-auto">
                  Agrega tus postres favoritos o personaliza tu pastel para enviar tu pedido a WhatsApp.
                </p>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={`${item.product.id}-${index}`}
                      className="p-3 rounded-card border border-black flex items-start gap-3 bg-white"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-black/20"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-black truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            aria-label="Eliminar producto"
                            className="text-black/40 hover:text-black p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="text-[10px] text-black/70 mt-0.5 space-y-0.5">
                            {Object.entries(item.selectedOptions).map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="font-semibold text-black">{k}:</span> {v}
                              </div>
                            ))}
                          </div>
                        )}

                        {item.note && (
                          <p className="text-[10px] text-black/80 italic mt-0.5 truncate">
                            "{item.note}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/10">
                          <span className="font-bold text-xs text-black">
                            ${(item.product.price * item.quantity).toLocaleString('es-MX')} MXN
                          </span>

                          <div className="flex items-center gap-1 bg-[#f5f4f0] border border-black rounded-btn px-1 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(index, -1)}
                              aria-label="Disminuir cantidad"
                              className="text-black font-bold text-xs min-w-[32px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px] flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(index, 1)}
                              aria-label="Aumentar cantidad"
                              className="text-black font-bold text-xs min-w-[32px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px] flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-black/50 hover:text-black underline"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {/* Delivery Options Hatch */}
                <div className="pt-3 border-t border-black/10 space-y-3 text-xs">
                  <label className="font-bold text-black block">
                    Método de Entrega:
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-btn border font-bold text-left transition-all ${
                        deliveryType === 'pickup'
                          ? 'border-black bg-[#99ffcc] text-black'
                          : 'border-black/30 bg-white text-black hover:border-black'
                      }`}
                    >
                      <span className="block text-xs">Retiro en Taller</span>
                      <span className="text-[10px] font-normal block opacity-80">El Oro 112, Toluca</span>
                      <span className="text-[10px] font-bold block mt-1 text-black">GRATIS ($0)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-3 rounded-btn border font-bold text-left transition-all ${
                        deliveryType === 'delivery'
                          ? 'border-black bg-[#99ffcc] text-black'
                          : 'border-black/30 bg-white text-black hover:border-black'
                      }`}
                    >
                      <span className="block text-xs">Envío a Domicilio</span>
                      <span className="text-[10px] font-normal block opacity-80">Toluca y Metepec</span>
                      <span className="text-[10px] font-bold block mt-1 text-black">Envío calculado según zona</span>
                    </button>
                  </div>

                  {/* Selector de Zonas */}
                  {deliveryType === 'delivery' && (
                    <div className="space-y-2.5 p-3 bg-[#f5f4f0] rounded-card border border-black">
                      <div className="flex items-center gap-1.5 text-black font-bold text-xs">
                        <MapPin className="w-3.5 h-3.5 text-black" />
                        <span>Zona de Entrega:</span>
                      </div>

                      <div className="space-y-1.5">
                        {DELIVERY_ZONES.map((zone) => (
                          <label
                            key={zone.id}
                            className={`flex items-start justify-between p-2 rounded-btn border cursor-pointer transition-all ${
                              selectedZone.id === zone.id
                                ? 'bg-white border-black font-bold'
                                : 'bg-transparent border-black/20 hover:border-black'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="radio"
                                name="delivery_zone"
                                checked={selectedZone.id === zone.id}
                                onChange={() => setSelectedZone(zone)}
                                className="mt-0.5 text-black focus:ring-0"
                              />
                              <div>
                                <span className="block text-[11px] text-black">{zone.name}</span>
                                <span className="block text-[10px] text-black/60 font-normal">{zone.description}</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-black ml-2 whitespace-nowrap">
                              {zone.price === 0 ? 'Por app' : `+$${zone.price} MXN`}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          required
                          placeholder="Calle, número exterior e interior *"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Colonia y referencias (ej: Col. La Providencia, Metepec)"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Customer details */}
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo (ej: Sofia Gómez) *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                    />

                    <input
                      type="tel"
                      placeholder="Teléfono WhatsApp (ej: 722 123 4567)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        min={tomorrow}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-2 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                      />
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-2 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                      >
                        <option>Tarde (2pm - 6pm)</option>
                        <option>Mañana (10am - 1pm)</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Notas especiales o dedicatoria (ej: es para regalo)..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-white focus:outline-none"
                    />
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Footer Hatch */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-black bg-[#f5f4f0] space-y-3">
              <div className="space-y-1 text-xs text-black">
                <div className="flex items-center justify-between">
                  <span>Subtotal postres:</span>
                  <span className="font-bold">${subtotal.toLocaleString('es-MX')} MXN</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Envío ({deliveryType === 'delivery' ? selectedZone.name : 'Retiro en taller'}):</span>
                  <span className="font-bold">
                    {deliveryCost === 0 
                      ? (deliveryType === 'delivery' ? 'Por cobrar en app' : '$0 MXN')
                      : `+$${deliveryCost.toLocaleString('es-MX')} MXN`}
                  </span>
                </div>

                <div className="pt-2 border-t border-black/20 flex items-center justify-between text-sm">
                  <span className="font-bold text-black">Total a Pagar:</span>
                  <span className="font-extrabold text-xl text-black">
                    ${grandTotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-btn bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-bold text-sm border border-black transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4 text-black" />
                <span>Confirmar y Enviar Pedido a WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
