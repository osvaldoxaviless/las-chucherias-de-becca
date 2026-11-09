import React, { useState } from 'react';
import { X, ShoppingBag, Clock } from 'lucide-react';
import { Product } from '../types';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAddToCartWithOptions: (
    product: Product,
    selectedOptions: Record<string, string>,
    note?: string
  ) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onAddToCartWithOptions,
}) => {
  if (!product) return null;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.choices.length > 0) {
        initial[opt.name] = opt.choices[0];
      }
    });
    return initial;
  });

  const [customNote, setCustomNote] = useState('');

  const handleOptionChange = (optionName: string, choice: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choice,
    }));
  };

  const handleAdd = () => {
    onAddToCartWithOptions(product, selectedOptions, customNote.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-card max-w-lg w-full overflow-hidden border border-black z-10 max-h-[90vh] flex flex-col">
        
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 z-20 min-w-[44px] min-h-[44px] rounded-full bg-white text-black border border-black flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1">
          {/* Photo */}
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#eae8e1] border border-black/20">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-recoleta font-bold text-xl sm:text-2xl text-black">
                {product.name}
              </h2>
              <span className="font-extrabold text-lg text-black whitespace-nowrap bg-[#99ffcc] px-3 py-0.5 rounded-full border border-black">
                ${product.price.toLocaleString('es-MX')} MXN
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#222222] mt-2 leading-relaxed">
              {product.description}
            </p>

            {product.preparationTime && (
              <span className="inline-flex items-center gap-1 text-[11px] text-black/60 font-medium mt-2">
                <Clock className="w-3 h-3 text-black" />
                <span>Anticipación recomendada: {product.preparationTime}</span>
              </span>
            )}
          </div>

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-black/10">
              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-1.5">
                  <label className="text-xs font-bold text-black block">
                    {opt.name}:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opt.choices.map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleOptionChange(opt.name, choice)}
                        className={`p-2.5 rounded-btn text-xs font-semibold text-left border transition-all ${
                          selectedOptions[opt.name] === choice
                            ? 'bg-[#99ffcc] text-black border-black font-bold'
                            : 'bg-white text-black border-black/30 hover:border-black'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom dedication */}
          <div className="pt-2 border-t border-black/10">
            <label className="text-xs font-bold text-black block mb-1">
              Dedicatoria o especificación (Opcional):
            </label>
            <input
              type="text"
              placeholder="Ej: Feliz Cumpleaños Sofi (incluir velita)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3 py-2 rounded-btn border border-black text-base sm:text-xs bg-[#f5f4f0] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 sm:p-5 border-t border-black bg-[#f5f4f0] flex items-center justify-between gap-3">
          <button
            onClick={handleAdd}
            className="w-full py-3.5 min-h-[44px] rounded-btn bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-bold text-xs sm:text-sm border border-black transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
            <span>Agregar al Pedido — ${product.price.toLocaleString('es-MX')} MXN</span>
          </button>
        </div>

      </div>
    </div>
  );
};
