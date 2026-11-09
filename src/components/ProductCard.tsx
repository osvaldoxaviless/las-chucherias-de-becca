import React, { useState } from 'react';
import { Plus, Minus, Trash2, Camera, Check, X, Clock } from 'lucide-react';
import { Product } from '../types';

interface Props {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, delta: number) => void;
  onOpenDetails: (product: Product) => void;
  isEditMode?: boolean;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onToggleAvailability?: (productId: string) => void;
  onTriggerChangeImage?: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails,
  isEditMode = false,
  onUpdateProduct,
  onDeleteProduct,
  onToggleAvailability,
  onTriggerChangeImage,
}) => {
  const isAvailable = product.available !== false;
  const [isPromptingImageUrl, setIsPromptingImageUrl] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(product.image);

  // Rotación de pasteles para chips decorativos Hatch
  const getBadgeColor = (badge?: string) => {
    if (!badge) return 'bg-[#99ffcc] text-black';
    if (badge.toLowerCase().includes('regalo') || badge.toLowerCase().includes('antojo')) return 'bg-[#ff99cc] text-black';
    if (badge.toLowerCase().includes('bestseller') || badge.toLowerCase().includes('exclusivo')) return 'bg-[#99ffcc] text-black';
    if (badge.toLowerCase().includes('popular')) return 'bg-[#ffcc99] text-black';
    return 'bg-[#7bbbff] text-black';
  };

  if (isEditMode) {
    return (
      <div className="bg-white rounded-card rounded-2xl overflow-hidden border-2 border-black flex flex-col h-full shadow-sm hover:shadow-md transition-shadow relative">
        
        {/* Top Floating Control Bar in Edit Mode */}
        <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-auto">
          {/* Availability Toggle */}
          <button
            type="button"
            onClick={() => onToggleAvailability?.(product.id)}
            className={`px-2 py-1 rounded-full text-[10px] font-bold border border-black shadow-xs flex items-center gap-1 transition-transform active:scale-95 ${
              isAvailable
                ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                : 'bg-black text-white hover:bg-stone-800'
            }`}
            title="Toca para cambiar entre Disponible o Agotado"
          >
            {isAvailable ? (
              <>
                <Check className="w-3 h-3" />
                <span>Disponible</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3 text-rose-400" />
                <span>Agotado</span>
              </>
            )}
          </button>

          {/* Delete Product Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Eliminar "${product.name}" del catálogo?`)) {
                onDeleteProduct?.(product.id);
              }
            }}
            className="p-1.5 rounded-full bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-black shadow-xs transition-colors"
            title="Eliminar este postre"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Image with Change Button */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#eae8e1] border-b border-black/10 group">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-75' : ''}`}
          />

          {/* Photo Change Trigger */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              type="button"
              onClick={() => {
                if (onTriggerChangeImage) {
                  onTriggerChangeImage(product);
                } else {
                  setIsPromptingImageUrl(!isPromptingImageUrl);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cambiar Foto</span>
            </button>
          </div>

          {/* Quick URL prompt overlay */}
          {isPromptingImageUrl && (
            <div className="absolute inset-0 bg-white/95 p-3 flex flex-col justify-center gap-2 z-30">
              <span className="text-[11px] font-bold text-stone-800">Pega la URL de la imagen:</span>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-1.5 border border-stone-300 rounded-lg bg-white"
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPromptingImageUrl(false)}
                  className="px-2 py-1 text-[11px] text-stone-500 rounded font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      onUpdateProduct?.({ ...product, image: customImageUrl.trim() });
                    }
                    setIsPromptingImageUrl(false);
                  }}
                  className="px-2.5 py-1 text-[11px] bg-black text-white rounded font-bold"
                >
                  Listo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Info - In-place Editable Fields */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1.5">
            {/* Name Input */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Nombre
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => onUpdateProduct?.({ ...product, name: e.target.value })}
                className="w-full font-bold text-xs sm:text-sm text-black border-b border-dashed border-black/50 focus:border-black focus:outline-none bg-transparent py-0.5"
                placeholder="Nombre del postre..."
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Descripción
              </label>
              <textarea
                rows={2}
                value={product.description}
                onChange={(e) => onUpdateProduct?.({ ...product, description: e.target.value })}
                className="w-full text-[11px] text-stone-700 border-b border-dashed border-black/40 focus:border-black focus:outline-none bg-transparent resize-none leading-tight py-0.5"
                placeholder="Descripción..."
              />
            </div>
          </div>

          {/* Price & Prep Time In-place */}
          <div className="pt-2 border-t border-black/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-black">$</span>
              <input
                type="number"
                value={product.price}
                onChange={(e) => onUpdateProduct?.({ ...product, price: Number(e.target.value) || 0 })}
                className="w-16 font-extrabold text-sm sm:text-base text-black border-b border-dashed border-black focus:border-black focus:outline-none bg-transparent text-center"
              />
              <span className="text-[10px] text-black/60 font-semibold">MXN</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3 text-stone-400" />
              <input
                type="text"
                value={product.preparationTime || '24 hrs'}
                onChange={(e) => onUpdateProduct?.({ ...product, preparationTime: e.target.value })}
                className="w-14 text-[10px] bg-transparent focus:outline-none text-right font-medium"
                placeholder="24 hrs"
              />
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Normal customer view (identical to original)
  return (
    <div className={`bg-white rounded-card rounded-2xl overflow-hidden border border-black flex flex-col h-full transition-transform hover:-translate-y-0.5 ${
      !isAvailable ? 'opacity-65' : ''
    }`}>
      
      {/* Product Image */}
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-[#eae8e1] border-b border-black/10"
        onClick={() => isAvailable && onOpenDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            !isAvailable ? 'grayscale' : ''
          }`}
          loading="lazy"
        />

        {/* Status Badge */}
        {!isAvailable ? (
          <div className="absolute top-2.5 left-2.5 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-black">
            Agotado por hoy
          </div>
        ) : product.badge ? (
          <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-black ${getBadgeColor(product.badge)}`}>
            {product.badge}
          </div>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          <h3 
            onClick={() => isAvailable && onOpenDetails(product)}
            className="font-bold text-xs sm:text-base text-black cursor-pointer line-clamp-1 hover:underline transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-[#222222] mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add Button en estilo Hatch */}
        <div className="pt-2 sm:pt-3 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="font-extrabold text-sm sm:text-base text-black">
              ${product.price.toLocaleString('es-MX')}
            </span>
            <span className="text-[10px] text-black/60 font-semibold ml-1">MXN</span>
          </div>

          {!isAvailable ? (
            <span className="text-[11px] text-black/40 font-medium py-1">No disponible</span>
          ) : quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-btn bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-bold text-xs border border-black transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <span>+ Agregar</span>
            </button>
          ) : (
            <div className="flex items-center justify-between sm:justify-center bg-white border border-black rounded-btn min-h-[44px] px-1">
              <button
                onClick={() => onUpdateQuantity(product, -1)}
                aria-label="Disminuir cantidad"
                className="min-w-[44px] min-h-[44px] text-black hover:bg-[#f5f4f0] font-bold flex items-center justify-center active:scale-90 transition-transform rounded-md"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-xs sm:text-sm text-black px-2 min-w-[20px] text-center select-none">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product, 1)}
                aria-label="Aumentar cantidad"
                className="min-w-[44px] min-h-[44px] text-black hover:bg-[#f5f4f0] font-bold flex items-center justify-center active:scale-90 transition-transform rounded-md"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
