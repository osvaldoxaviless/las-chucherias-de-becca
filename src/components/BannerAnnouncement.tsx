import React from 'react';
import { StoreConfig } from '../types';
import { Edit3, Eye, EyeOff } from 'lucide-react';

interface Props {
  config: StoreConfig;
  isEditMode?: boolean;
  onUpdateAnnouncement?: (text: string, visible: boolean) => void;
}

export const BannerAnnouncement: React.FC<Props> = ({
  config,
  isEditMode = false,
  onUpdateAnnouncement,
}) => {
  // If not editing and either hidden or empty, don't show
  if (!isEditMode && (!config.bannerVisible || !config.announcementText)) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="bg-[#160042] text-white text-xs py-2 px-4 border-b-2 border-dashed border-[#99ffcc]/60 relative z-30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#99ffcc] border border-black animate-pulse" />
            <span className="font-bold text-[11px] text-[#99ffcc] uppercase tracking-wider flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              <span>Aviso Superior:</span>
            </span>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <input
              type="text"
              value={config.announcementText || ''}
              onChange={(e) => onUpdateAnnouncement?.(e.target.value, config.bannerVisible)}
              placeholder="Escribe el aviso superior (ej: Toluca y Metepec • Pedidos con anticipación)..."
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-black font-semibold px-3 py-1 rounded-lg border border-white/20 focus:border-black text-xs text-center focus:text-left focus:outline-none transition-all placeholder:text-white/40"
            />
          </div>

          <button
            type="button"
            onClick={() => onUpdateAnnouncement?.(config.announcementText, !config.bannerVisible)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors border ${
              config.bannerVisible
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
            }`}
            title="Activar o desactivar la visibilidad del aviso para los clientes"
          >
            {config.bannerVisible ? (
              <>
                <Eye className="w-3 h-3" />
                <span>Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Oculto</span>
              </>
            )}
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#160042] text-white text-xs py-2 px-4 text-center font-medium border-b border-black">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#99ffcc] border border-black" />
        <span className="tracking-wide">{config.announcementText}</span>
      </div>
    </div>
  );
};
