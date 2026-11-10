import React from 'react';
import { ArrowDown, Sparkles, Edit3, Settings, Layers } from 'lucide-react';
import { HeroCardConfig, SeasonId, StoreConfig } from '../types';
import { HeroPastryPhotos } from './HeroPastryPhotos';
import { SeasonalAtmosphere } from './SeasonalAtmosphere';
import { getActiveSeasonConfig, SEASONS_LIST } from '../data/seasons';

interface Props {
  config: StoreConfig;
  onExploreCatalog: () => void;
  onScrollToCustomizer: () => void;
  isEditMode?: boolean;
  onUpdateField?: (field: keyof StoreConfig, value: string) => void;
  onTriggerChangeCardImage?: (cardId: 'left' | 'right' | 'bottom') => void;
  onUpdateCardLabel?: (cardId: 'left' | 'right' | 'bottom', label: string) => void;
  onSelectSeason?: (seasonId: SeasonId) => void;
  onOpenSeasonModal?: () => void;
}

export const Hero: React.FC<Props> = ({
  config,
  onExploreCatalog,
  onScrollToCustomizer,
  isEditMode = false,
  onUpdateField,
  onTriggerChangeCardImage,
  onUpdateCardLabel,
  onSelectSeason,
  onOpenSeasonModal,
}) => {
  const seasonData = getActiveSeasonConfig(config);
  const confetti = seasonData.confettiColors || ['#ff99cc', '#7bbbff', '#ffcc99', '#99ffcc', '#d8b4fe'];

  return (
    <section className="relative bg-[#f5f4f0] border-b border-black/10 pt-12 sm:pt-16 pb-20 sm:pb-28 overflow-x-clip">
      
      {/* Capa de Atmósfera de Temporada (Nieve, Corazones, Flores, Murciélagos, Destellos) */}
      <SeasonalAtmosphere
        atmosphere={seasonData.seasonalAtmosphere}
        enabled={config.enableSeasonalAtmosphere ?? true}
      />

      {/* Confetti Dots dinámicos sincronizados con la paleta de la temporada */}
      <div 
        className="absolute top-10 left-10 w-3 h-3 rounded-full pointer-events-none hidden sm:block transition-colors duration-500" 
        style={{ backgroundColor: confetti[0] || '#ff99cc' }}
      />
      <div 
        className="absolute top-20 right-16 w-3.5 h-3.5 rounded-full pointer-events-none hidden sm:block transition-colors duration-500" 
        style={{ backgroundColor: confetti[1] || '#7bbbff' }}
      />
      <div 
        className="absolute bottom-16 left-1/4 w-2.5 h-2.5 rounded-full pointer-events-none hidden sm:block transition-colors duration-500" 
        style={{ backgroundColor: confetti[2] || '#ffcc99' }}
      />
      <div 
        className="absolute top-1/2 right-12 w-3 h-3 rounded-full pointer-events-none hidden sm:block transition-colors duration-500" 
        style={{ backgroundColor: confetti[3] || '#99ffcc' }}
      />
      <div 
        className="absolute top-1/3 left-16 w-2.5 h-2.5 rounded-full pointer-events-none hidden sm:block transition-colors duration-500" 
        style={{ backgroundColor: confetti[4] || '#d8b4fe' }}
      />

      {/* Contenedor Principal Relativo que enmarca los postres y el texto juntos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Fotografías Reales de Postres con Fondo Blanco (enmarcan la portada) */}
        <HeroPastryPhotos
          cards={seasonData.cards}
          isEditMode={isEditMode}
          onTriggerChangeCardImage={onTriggerChangeCardImage}
          onUpdateCardLabel={onUpdateCardLabel}
        />

        <div className="max-w-3xl xl:max-w-4xl mx-auto text-center space-y-6">
        
        {/* Barra de Selección de Capa de Temporada en Modo Edición */}
        {isEditMode && (
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-2 rounded-2xl bg-white border-2 border-dashed border-black/40 shadow-xs mb-2">
            <span className="text-[11px] font-black text-black uppercase tracking-wider px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-black" />
              <span>Temporada:</span>
            </span>
            {SEASONS_LIST.map((season) => {
              const isSelected = (config.activeSeason || 'regular') === season.id;
              return (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => onSelectSeason?.(season.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#160042] text-[#99ffcc] border-black shadow-xs'
                      : 'bg-[#faf9f5] hover:bg-stone-100 text-stone-700 border-black/10'
                  }`}
                  title={`Cambiar a ${season.name}`}
                >
                  <span>{season.icon} {season.name}</span>
                </button>
              );
            })}
            {onOpenSeasonModal && (
              <button
                type="button"
                onClick={onOpenSeasonModal}
                className="px-2.5 py-1 rounded-xl text-xs font-black bg-[#99ffcc] hover:bg-[#80ffbf] text-black border border-black shadow-xs transition-all flex items-center gap-1"
                title="Configurar fotos y capas de personalización para cada temporada"
              >
                <Settings className="w-3 h-3 text-black" />
                <span>Capas</span>
              </button>
            )}
          </div>
        )}

        {/* Chip Lúdico Superior */}
        {isEditMode ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-dashed border-black/60 shadow-xs">
            <span 
              className="w-2.5 h-2.5 rounded-full border border-black" 
              style={{ backgroundColor: seasonData.accentColor || '#99ffcc' }}
            />
            <input
              type="text"
              value={config.heroBadge || ''}
              onChange={(e) => onUpdateField?.('heroBadge', e.target.value)}
              placeholder={seasonData.badge || '🦄 Distintivo o Slogan superior...'}
              className="text-xs font-bold text-black bg-transparent focus:outline-none text-center min-w-[240px]"
            />
            <Edit3 className="w-3 h-3 text-stone-400" />
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black text-xs font-bold text-black shadow-xs">
            <span 
              className="w-2.5 h-2.5 rounded-full border border-black" 
              style={{ backgroundColor: seasonData.accentColor || '#99ffcc' }}
            />
            <span>{config.heroBadge || seasonData.badge || `🦄 El Paraíso de los Postres • ${config.city}`}</span>
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
          📍 Retiro en taller con previa cita ({(config.address && !config.address.includes('El Oro 112')) ? config.address : 'Toluca, Estado de México'}) o entrega a domicilio (envío calculado según zona).
        </p>

      </div>
    </div>
  </section>
  );
};
