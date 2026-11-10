import React from 'react';
import { Camera, Edit3 } from 'lucide-react';
import { HeroCardConfig } from '../types';
import { DEFAULT_SEASONS } from '../data/seasons';

interface Props {
  cards?: {
    left: HeroCardConfig;
    right: HeroCardConfig;
    bottom: HeroCardConfig;
  };
  isEditMode?: boolean;
  onTriggerChangeCardImage?: (cardId: 'left' | 'right' | 'bottom') => void;
  onUpdateCardLabel?: (cardId: 'left' | 'right' | 'bottom', newLabel: string) => void;
}

export const HeroPastryPhotos: React.FC<Props> = ({
  cards = DEFAULT_SEASONS.regular.cards,
  isEditMode = false,
  onTriggerChangeCardImage,
  onUpdateCardLabel,
}) => {
  const leftCard = cards.left || DEFAULT_SEASONS.regular.cards.left;
  const rightCard = cards.right || DEFAULT_SEASONS.regular.cards.right;
  const bottomCard = cards.bottom || DEFAULT_SEASONS.regular.cards.bottom;

  return (
    <>
      {/* ==================================================================== */}
      {/* FOTO 1 (IZQUIERDA): PASTEL REAL / DESTACADO TEMPORAL                  */}
      {/* ==================================================================== */}
      <div 
        className="hidden lg:flex absolute left-0 xl:left-2 2xl:left-4 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-slow group"
        title={leftCard.alt || leftCard.label}
      >
        <div className={`w-32 h-32 xl:w-40 xl:h-40 rounded-3xl bg-white border-2 border-black p-2 shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 relative ${
          isEditMode ? 'ring-2 ring-[#99ffcc] ring-offset-2 border-dashed' : ''
        }`}>
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center relative shadow-inner">
            <img 
              src={leftCard.image} 
              alt={leftCard.alt || leftCard.label} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            {isEditMode && (
              <button
                type="button"
                onClick={() => onTriggerChangeCardImage?.('left')}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl p-2 text-center"
                title="Cambiar fotografía del postre izquierdo"
              >
                <Camera className="w-5 h-5 text-[#99ffcc]" />
                <span className="text-xs font-bold">Cambiar Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* Etiqueta / Tag inferior con ancho flexible sin cortes */}
        {isEditMode ? (
          <div className="px-3 py-1 rounded-full bg-white border border-black shadow-xs -mt-3 z-20 flex items-center gap-1.5 max-w-[210px]">
            <input
              type="text"
              value={leftCard.label}
              onChange={(e) => onUpdateCardLabel?.('left', e.target.value)}
              className="text-xs font-black text-black bg-transparent w-full text-center focus:outline-none min-w-[120px]"
              placeholder="Etiqueta..."
            />
            <Edit3 className="w-3 h-3 text-stone-500 flex-shrink-0" />
          </div>
        ) : (
          <div 
            className="px-3.5 py-1 rounded-full bg-white border border-black text-xs font-black text-black shadow-xs -mt-3 z-20 whitespace-nowrap transition-transform group-hover:scale-105 max-w-[220px] text-center"
          >
            <span>{leftCard.label}</span>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* FOTO 2 (DERECHA): REPOSTERÍA / DESTACADO TEMPORAL                    */}
      {/* ==================================================================== */}
      <div 
        className="hidden lg:flex absolute right-0 xl:right-2 2xl:right-4 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-delayed group"
        title={rightCard.alt || rightCard.label}
      >
        <div className={`w-32 h-32 xl:w-40 xl:h-40 rounded-3xl bg-white border-2 border-black p-2 shadow-xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300 relative ${
          isEditMode ? 'ring-2 ring-[#ffcc99] ring-offset-2 border-dashed' : ''
        }`}>
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center relative shadow-inner">
            <img 
              src={rightCard.image} 
              alt={rightCard.alt || rightCard.label} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            {isEditMode && (
              <button
                type="button"
                onClick={() => onTriggerChangeCardImage?.('right')}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl p-2 text-center"
                title="Cambiar fotografía del postre derecho"
              >
                <Camera className="w-5 h-5 text-[#ffcc99]" />
                <span className="text-xs font-bold">Cambiar Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* Etiqueta / Tag inferior con ancho flexible sin cortes */}
        {isEditMode ? (
          <div className="px-3 py-1 rounded-full bg-white border border-black shadow-xs -mt-3 z-20 flex items-center gap-1.5 max-w-[210px]">
            <input
              type="text"
              value={rightCard.label}
              onChange={(e) => onUpdateCardLabel?.('right', e.target.value)}
              className="text-xs font-black text-black bg-transparent w-full text-center focus:outline-none min-w-[120px]"
              placeholder="Etiqueta..."
            />
            <Edit3 className="w-3 h-3 text-stone-500 flex-shrink-0" />
          </div>
        ) : (
          <div className="px-3.5 py-1 rounded-full bg-white border border-black text-xs font-black text-black shadow-xs -mt-3 z-20 whitespace-nowrap transition-transform group-hover:scale-105 max-w-[220px] text-center">
            <span>{rightCard.label}</span>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* FOTO 3 (ACENTO INFERIOR): ANTOJITO O CUPCAKE HORNEADO AL DÍA         */}
      {/* ==================================================================== */}
      <div 
        className="hidden xl:flex absolute left-2 2xl:left-6 -bottom-3 z-10 flex-col items-center select-none pointer-events-auto animate-float-gentle group"
        title={bottomCard.alt || bottomCard.label}
      >
        <div className={`w-28 h-28 xl:w-32 xl:h-32 rounded-2xl bg-white border-2 border-black p-2 shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative ${
          isEditMode ? 'ring-2 ring-[#7bbbff] ring-offset-2 border-dashed' : ''
        }`}>
          <div className="w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center relative shadow-inner">
            <img 
              src={bottomCard.image} 
              alt={bottomCard.alt || bottomCard.label} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {isEditMode && (
              <button
                type="button"
                onClick={() => onTriggerChangeCardImage?.('bottom')}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity rounded-xl p-1.5 text-center"
                title="Cambiar fotografía del postre inferior"
              >
                <Camera className="w-4 h-4 text-[#7bbbff]" />
                <span className="text-[10px] font-bold">Cambiar Foto</span>
              </button>
            )}
          </div>
        </div>

        {/* Etiqueta / Tag inferior */}
        {isEditMode ? (
          <div className="px-2.5 py-1 rounded-full bg-white border border-black shadow-xs -mt-2.5 z-20 flex items-center gap-1 max-w-[190px]">
            <input
              type="text"
              value={bottomCard.label}
              onChange={(e) => onUpdateCardLabel?.('bottom', e.target.value)}
              className="text-[11px] font-black text-black bg-transparent w-full text-center focus:outline-none min-w-[110px]"
              placeholder="Etiqueta..."
            />
            <Edit3 className="w-2.5 h-2.5 text-stone-500 flex-shrink-0" />
          </div>
        ) : (
          <div className="px-3 py-0.5 rounded-full bg-white border border-black text-[11px] font-black text-black shadow-xs -mt-2.5 z-20 whitespace-nowrap transition-transform group-hover:scale-105 max-w-[200px] text-center">
            <span>{bottomCard.label}</span>
          </div>
        )}
      </div>
    </>
  );
};
