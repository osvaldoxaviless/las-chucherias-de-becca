import React from 'react';
import { Instagram, Lock } from 'lucide-react';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
  onOpenAdmin: () => void;
  onScrollToCatalog: () => void;
  onScrollToAbout: () => void;
  onScrollToFAQ: () => void;
}

export const Footer: React.FC<Props> = ({
  config,
  onOpenAdmin,
  onScrollToCatalog,
  onScrollToAbout,
  onScrollToFAQ,
}) => {
  return (
    <footer className="bg-[#160042] text-[#f5f4f0] py-12 border-t border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/40 bg-white">
              <img src="/images/becca-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-recoleta font-bold text-xl text-white">
                {config.storeName}
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                {config.address} • {config.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs font-semibold text-white/90">
            <button onClick={onScrollToCatalog} className="hover:underline transition-colors">
              Menú
            </button>
            <button onClick={onScrollToAbout} className="hover:underline transition-colors">
              Nosotros
            </button>
            <button onClick={onScrollToFAQ} className="hover:underline transition-colors">
              FAQ
            </button>
            <button 
              onClick={() => document.getElementById('referencias')?.scrollIntoView({ behavior: 'smooth' })} 
              className="hover:underline transition-colors"
            >
              Referencias
            </button>
            <a
              href={`https://instagram.com/${config.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {config.storeName}. Pedidos directos a WhatsApp sin comisiones.</p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-black bg-[#99ffcc] font-bold text-xs px-3 py-1.5 rounded-full border border-black hover:bg-[#80ffbf] transition-all"
            title="Panel de administración de Becca"
          >
            <Lock className="w-3 h-3 text-black" />
            <span>Acceso Becca (Admin)</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
