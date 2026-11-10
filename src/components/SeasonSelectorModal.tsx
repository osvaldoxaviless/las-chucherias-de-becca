import React, { useState } from 'react';
import { Sparkles, Check, X, Camera, RefreshCw, Layers, Sliders } from 'lucide-react';
import { SeasonConfig, SeasonId, StoreConfig } from '../types';
import { DEFAULT_SEASONS, SEASONS_LIST } from '../data/seasons';

interface Props {
  isOpen: boolean;
  config: StoreConfig;
  onSelectSeason: (seasonId: SeasonId) => void;
  onTriggerChangeCardImage: (cardId: 'left' | 'right' | 'bottom', seasonId?: SeasonId) => void;
  onUpdateCardLabel: (cardId: 'left' | 'right' | 'bottom', label: string, seasonId?: SeasonId) => void;
  onToggleAtmosphere: (enabled: boolean) => void;
  onResetSeasonDefaults: (seasonId: SeasonId) => void;
  onClose: () => void;
}

export const SeasonSelectorModal: React.FC<Props> = ({
  isOpen,
  config,
  onSelectSeason,
  onTriggerChangeCardImage,
  onUpdateCardLabel,
  onToggleAtmosphere,
  onResetSeasonDefaults,
  onClose,
}) => {
  const activeSeasonId = config.activeSeason || 'regular';
  const [selectedTabSeason, setSelectedTabSeason] = useState<SeasonId>(activeSeasonId);

  if (!isOpen) return null;

  // Resolve current season config with custom overrides
  const currentSeasonData: SeasonConfig = {
    ...DEFAULT_SEASONS[selectedTabSeason],
    ...(config.seasons?.[selectedTabSeason] || {}),
    cards: {
      left: { ...DEFAULT_SEASONS[selectedTabSeason].cards.left, ...(config.seasons?.[selectedTabSeason]?.cards?.left || {}) },
      right: { ...DEFAULT_SEASONS[selectedTabSeason].cards.right, ...(config.seasons?.[selectedTabSeason]?.cards?.right || {}) },
      bottom: { ...DEFAULT_SEASONS[selectedTabSeason].cards.bottom, ...(config.seasons?.[selectedTabSeason]?.cards?.bottom || {}) },
    },
  };

  const isCurrentActive = activeSeasonId === selectedTabSeason;
  const isAtmosphereEnabled = config.enableSeasonalAtmosphere ?? true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="season-modal-title"
        className="bg-white rounded-3xl border-2 border-black max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#faf9f5] border-b border-black/15 px-5 sm:px-7 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#99ffcc] border border-black flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 id="season-modal-title" className="font-recoleta text-lg sm:text-xl font-bold text-black">
                Capas de Personalización por Temporada
              </h2>
              <p className="text-xs text-[#222222]">
                Adapta las fotos del inicio, atmósfera y colores según la época del año.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-black transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Season Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
              1. Selecciona una Temporada para Configurar o Activar:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SEASONS_LIST.map((season) => {
                const isActive = activeSeasonId === season.id;
                const isSelected = selectedTabSeason === season.id;

                return (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => setSelectedTabSeason(season.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-2 border-black bg-[#99ffcc]/20 shadow-sm'
                        : 'border-black/15 hover:border-black/40 bg-[#faf9f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{season.icon}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#160042] text-[#99ffcc] text-[9px] font-black uppercase tracking-wider">
                          Activa
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-black truncate mt-1">
                      {season.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Season Banner & Actions */}
          <div className="p-4 rounded-2xl bg-[#faf9f5] border border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentSeasonData.icon}</span>
                <span className="font-bold text-sm text-black">{currentSeasonData.name}</span>
                {isCurrentActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    <Check className="w-3 h-3" /> Aplicada en la tienda
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-500 font-medium">
                    (Previsualizando cambios)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600">
                Distintivo: <strong className="text-black">{currentSeasonData.badge}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isCurrentActive ? (
                <button
                  type="button"
                  onClick={() => onSelectSeason(selectedTabSeason)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#160042] text-[#99ffcc] hover:bg-[#26153f] font-bold text-xs flex items-center justify-center gap-1.5 border border-black shadow-xs active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Activar en Tienda Ahora</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-[#99ffcc]/30 border border-black/20 text-xs font-bold text-black flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>Capa Activa</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => onResetSeasonDefaults(selectedTabSeason)}
                className="p-2 rounded-xl border border-black/20 hover:bg-black/5 text-stone-600 transition-colors"
                title="Restaurar fotos predeterminadas de esta temporada"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Season Cards Customizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Las 3 Fotografías y Etiquetas de Portada para "{currentSeasonData.name}":
              </label>
              <span className="text-[11px] text-stone-500">Haz clic en una foto para cambiarla</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Left Card */}
              <div className="p-3 rounded-2xl bg-white border border-black/20 space-y-2.5 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Foto Izquierda</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold">Principal</span>
                </div>

                <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-black/20 group">
                  <img
                    src={currentSeasonData.cards.left.image}
                    alt={currentSeasonData.cards.left.label}
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => onTriggerChangeCardImage('left', selectedTabSeason)}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center"
                    title="Cambiar foto de este postre"
                  >
                    <Camera className="w-5 h-5 text-[#99ffcc]" />
                    <span className="text-xs font-bold">Subir / Cambiar</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500">Etiqueta del Postre:</label>
                  <input
                    type="text"
                    value={currentSeasonData.cards.left.label}
                    onChange={(e) => onUpdateCardLabel('left', e.target.value, selectedTabSeason)}
                    placeholder="🎂 Pasteles de Diseño"
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg border border-black/20 bg-[#faf9f5] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Right Card */}
              <div className="p-3 rounded-2xl bg-white border border-black/20 space-y-2.5 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Foto Derecha</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold">Repostería</span>
                </div>

                <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-black/20 group">
                  <img
                    src={currentSeasonData.cards.right.image}
                    alt={currentSeasonData.cards.right.label}
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => onTriggerChangeCardImage('right', selectedTabSeason)}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center"
                    title="Cambiar foto de este postre"
                  >
                    <Camera className="w-5 h-5 text-[#ffcc99]" />
                    <span className="text-xs font-bold">Subir / Cambiar</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500">Etiqueta del Postre:</label>
                  <input
                    type="text"
                    value={currentSeasonData.cards.right.label}
                    onChange={(e) => onUpdateCardLabel('right', e.target.value, selectedTabSeason)}
                    placeholder="🍪 Repostería Artesanal"
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg border border-black/20 bg-[#faf9f5] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Bottom Card */}
              <div className="p-3 rounded-2xl bg-white border border-black/20 space-y-2.5 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Foto Inferior</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold">Horneado al Día</span>
                </div>

                <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-black/20 group">
                  <img
                    src={currentSeasonData.cards.bottom.image}
                    alt={currentSeasonData.cards.bottom.label}
                    className="w-full h-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => onTriggerChangeCardImage('bottom', selectedTabSeason)}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center"
                    title="Cambiar foto de este postre"
                  >
                    <Camera className="w-5 h-5 text-[#7bbbff]" />
                    <span className="text-xs font-bold">Subir / Cambiar</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500">Etiqueta del Postre:</label>
                  <input
                    type="text"
                    value={currentSeasonData.cards.bottom.label}
                    onChange={(e) => onUpdateCardLabel('bottom', e.target.value, selectedTabSeason)}
                    placeholder="🧁 Horneado al Día"
                    className="w-full text-xs font-bold px-2 py-1.5 rounded-lg border border-black/20 bg-[#faf9f5] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Atmospheric Layer Toggle */}
          <div className="p-4 rounded-2xl bg-[#faf9f5] border border-black/15 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                <span>Atmósfera y Partículas Flotantes</span>
              </div>
              <p className="text-xs text-stone-600">
                Muestra sutiles efectos animados en la portada (copos de nieve en Navidad, corazones en San Valentín, etc.).
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleAtmosphere(!isAtmosphereEnabled)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                isAtmosphereEnabled
                  ? 'bg-[#99ffcc] border-black text-black shadow-xs'
                  : 'bg-white border-black/20 text-stone-400'
              }`}
            >
              {isAtmosphereEnabled ? 'Activado ✨' : 'Desactivado'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#faf9f5] border-t border-black/15 px-5 sm:px-7 py-3 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-bold text-xs border border-black shadow-xs transition-colors"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
