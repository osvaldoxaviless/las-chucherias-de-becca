import React from 'react';
import { ArrowDown, Sparkles, Edit3 } from 'lucide-react';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
  onExploreCatalog: () => void;
  onScrollToCustomizer: () => void;
  isEditMode?: boolean;
  onUpdateField?: (field: keyof StoreConfig, value: string) => void;
}

export const Hero: React.FC<Props> = ({
  config,
  onExploreCatalog,
  onScrollToCustomizer,
  isEditMode = false,
  onUpdateField,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#f5f4f0] border-b border-black/10 py-16 sm:py-24">
      
      {/* Hatch Confetti Dots decorativos con temática pastel unicornio (DESIGN.md) */}
      <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-[#ff99cc] pointer-events-none hidden sm:block" />
      <div className="absolute top-20 right-16 w-3.5 h-3.5 rounded-full bg-[#7bbbff] pointer-events-none hidden sm:block" />
      <div className="absolute bottom-16 left-1/4 w-2.5 h-2.5 rounded-full bg-[#ffcc99] pointer-events-none hidden sm:block" />
      <div className="absolute top-1/2 right-12 w-3 h-3 rounded-full bg-[#99ffcc] pointer-events-none hidden sm:block" />
      <div className="absolute top-1/3 left-16 w-2.5 h-2.5 rounded-full bg-[#d8b4fe] pointer-events-none hidden sm:block" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        
        {/* Chip Lúdico Superior */}
        {isEditMode ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-dashed border-black/60 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#99ffcc] border border-black" />
            <input
              type="text"
              value={config.heroBadge || ''}
              onChange={(e) => onUpdateField?.('heroBadge', e.target.value)}
              placeholder="🦄 Distintivo o Slogan superior..."
              className="text-xs font-bold text-black bg-transparent focus:outline-none text-center min-w-[240px]"
            />
            <Edit3 className="w-3 h-3 text-stone-400" />
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black text-xs font-bold text-black shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#99ffcc] border border-black" />
            <span>{config.heroBadge || `🦄 El Paraíso de los Postres • ${config.city}`}</span>
          </div>
        )}

        {/* Titular Recoleta Grande Centrado */}
        {isEditMode ? (
          <div className="space-y-1 relative">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              <Edit3 className="w-3.5 h-3.5 text-black" />
              <span>Titular Principal (Edición en Vivo)</span>
            </div>
            <textarea
              rows={2}
              value={config.heroTitle || 'El Paraíso de los Postres. Repostería Artesanal & Pasteles Únicos.'}
              onChange={(e) => onUpdateField?.('heroTitle', e.target.value)}
              placeholder="Escribe el titular principal de la portada..."
              className="font-recoleta text-3xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.08] text-center w-full bg-white/70 hover:bg-white focus:bg-white p-3 rounded-2xl border-2 border-dashed border-black/40 focus:border-black focus:outline-none shadow-xs transition-all"
            />
          </div>
        ) : (
          <h1 className="font-recoleta text-4xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.08]">
            {config.heroTitle ? (
              <span>{config.heroTitle}</span>
            ) : (
              <>
                El Paraíso de los Postres.
                <span className="block mt-2">
                  Repostería Artesanal &{' '}
                  <span className="relative inline-block px-3.5 py-0.5 bg-[#99ffcc] border border-black rounded-xl text-black">
                    Pasteles Únicos.
                  </span>
                </span>
              </>
            )}
          </h1>
        )}

        {/* Subtítulo Limpio y Centrado */}
        {isEditMode ? (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              <Edit3 className="w-3.5 h-3.5 text-black" />
              <span>Subtítulo de la Portada</span>
            </div>
            <textarea
              rows={3}
              value={config.heroSubtitle || ''}
              onChange={(e) => onUpdateField?.('heroSubtitle', e.target.value)}
              placeholder="Escribe la descripción o subtítulo que ven tus clientes..."
              className="text-base sm:text-xl text-[#222222] max-w-2xl mx-auto leading-relaxed font-normal text-center w-full bg-white/70 hover:bg-white focus:bg-white p-3 rounded-2xl border-2 border-dashed border-black/40 focus:border-black focus:outline-none shadow-xs transition-all"
            />
          </div>
        ) : (
          <p className="text-base sm:text-xl text-[#222222] max-w-2xl mx-auto leading-relaxed font-normal">
            {config.heroSubtitle || (
              <>Pasteles personalizados, repostería temática y antojitos horneados al día con mantequilla pura y fruta fresca en Toluca y Metepec (envío calculado según zona).</>
            )}
          </p>
        )}

        {/* Grupo de Botones Hatch */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {isEditMode ? (
            <div className="w-full sm:w-auto px-4 py-2.5 rounded-btn bg-[#99ffcc] border border-black flex items-center justify-center gap-2 shadow-xs">
              <input
                type="text"
                value={config.heroButtonPrimary || 'Ver Menú de Postres'}
                onChange={(e) => onUpdateField?.('heroButtonPrimary', e.target.value)}
                placeholder="Texto Botón 1"
                className="bg-transparent font-bold text-sm text-black text-center focus:outline-none border-b border-dashed border-black"
              />
              <ArrowDown className="w-4 h-4 text-black flex-shrink-0" />
            </div>
          ) : (
            <button
              onClick={onExploreCatalog}
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-bold text-sm border border-black transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{config.heroButtonPrimary || 'Ver Menú de Postres'}</span>
              <ArrowDown className="w-4 h-4 text-black" />
            </button>
          )}

          {isEditMode ? (
            <div className="w-full sm:w-auto px-4 py-2.5 rounded-btn bg-white border border-black flex items-center justify-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-black flex-shrink-0" />
              <input
                type="text"
                value={config.heroButtonSecondary || 'Atelier: Arma tu Pastel'}
                onChange={(e) => onUpdateField?.('heroButtonSecondary', e.target.value)}
                placeholder="Texto Botón 2"
                className="bg-transparent font-bold text-sm text-black text-center focus:outline-none border-b border-dashed border-black"
              />
            </div>
          ) : (
            <button
              onClick={onScrollToCustomizer}
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-white hover:bg-[#faf9f5] text-black font-bold text-sm border border-black transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{config.heroButtonSecondary || 'Atelier: Arma tu Pastel'}</span>
            </button>
          )}
        </div>

        {/* Nota de envío natural */}
        <p className="text-xs text-black/50 pt-2">
          📍 Retiro en taller ({config.address || 'El Oro 112, Toluca'}) o entrega a domicilio (envío calculado según zona).
        </p>

      </div>
    </section>
  );
};
