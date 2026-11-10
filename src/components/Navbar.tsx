import React, { useState } from 'react';
import { ShoppingBag, Instagram, Menu, X, Lock, Sparkles, MessageCircle } from 'lucide-react';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onScrollToCatalog: () => void;
  onScrollToCustomizer: () => void;
  onScrollToAbout: () => void;
  onScrollToFAQ: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({
  config,
  cartCount,
  cartTotal,
  onOpenCart,
  onScrollToCatalog,
  onScrollToCustomizer,
  onScrollToAbout,
  onScrollToFAQ,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f5f4f0]/95 backdrop-blur-sm border-b border-black/10 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LADO IZQUIERDO: MARCA LIMPIA */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-black bg-white flex-shrink-0">
              <img 
                src="/images/becca-logo.jpg" 
                alt="Logo Las chucherías de Becca" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="font-recoleta font-bold text-sm xs:text-base sm:text-2xl text-black tracking-tight whitespace-nowrap truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
              {config.storeName}
            </span>
          </div>

          {/* LADO DERECHO: MENÚS Y LLAMADAS A LA ACCIÓN (Estilo Hatch) */}
          <div className="flex items-center gap-5 sm:gap-7">
            
            {/* Enlaces de texto editorial */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-black">
              <button
                onClick={onScrollToCatalog}
                className="hover:underline underline-offset-4 transition-colors font-semibold"
              >
                Menú
              </button>
              <button
                onClick={onScrollToCustomizer}
                className="hover:underline underline-offset-4 transition-colors font-semibold flex items-center gap-1"
              >
                <span>Arma tu Pastel</span>
              </button>
              <button
                onClick={onScrollToAbout}
                className="hover:underline underline-offset-4 transition-colors font-semibold"
              >
                Nosotros
              </button>
              <button
                onClick={() => {
                  document.getElementById('referencias')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:underline underline-offset-4 transition-colors font-semibold"
              >
                Referencias
              </button>
              <button
                onClick={onScrollToFAQ}
                className="hover:underline underline-offset-4 transition-colors font-semibold"
              >
                Preguntas
              </button>
            </nav>

            {/* Grupo de Acciones: WhatsApp y Carrito */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* WhatsApp direct pill */}
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola Becca! Vengo de tu página web y me gustaría información de tus postres.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-black bg-white hover:bg-black/5 border border-black transition-all active:scale-95 shadow-xs"
                title="Chat directo con Becca por WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              {/* Botón de Pedido estilo Hatch: En celular solo muestra la bolsita, en desktop muestra 'Pedido' o el total */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2 rounded-full bg-[#99ffcc] hover:bg-[#80ffbf] text-black border border-black font-bold text-xs transition-all active:scale-95 shadow-xs"
                aria-label="Abrir carrito"
                title="Ver carrito de pedido"
              >
                <ShoppingBag className="w-4 h-4 text-black flex-shrink-0" />
                <span className="hidden sm:inline">{cartCount > 0 ? `$${cartTotal.toLocaleString('es-MX')}` : 'Pedido'}</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-black border border-black bg-[#f5f4f0] min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 flex-shrink-0"
                aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-black px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => { onScrollToCatalog(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-xl text-black font-semibold text-sm hover:bg-[#f5f4f0] min-h-[44px] flex items-center"
          >
            Menú de Postres
          </button>
          <button
            onClick={() => { onScrollToCustomizer(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-xl text-black font-bold text-sm bg-[#99ffcc] border border-black min-h-[44px] flex items-center"
          >
            🎂 Arma tu Pastel a Medida
          </button>
          <button
            onClick={() => { onScrollToAbout(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-xl text-black font-semibold text-sm hover:bg-[#f5f4f0] min-h-[44px] flex items-center"
          >
            Nosotros
          </button>
          <button
            onClick={() => { onScrollToFAQ(); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 px-3 rounded-xl text-black font-semibold text-sm hover:bg-[#f5f4f0] min-h-[44px] flex items-center"
          >
            Preguntas Frecuentes
          </button>
          <div className="pt-3 border-t border-black/10 space-y-2.5">
            <a
              href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola Becca! Vengo de tu página web "El paraíso de los postres" y me gustaría información de tus postres.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 border border-black shadow-xs min-h-[44px] active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Contactar directo por WhatsApp</span>
            </a>

            <div className="flex items-center justify-between pt-1">
              <a
                href={`https://instagram.com/${config.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black font-semibold hover:underline flex items-center gap-1.5 min-h-[44px]"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>@{config.instagramHandle}</span>
              </a>
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="text-xs text-black/60 hover:text-black flex items-center gap-1 min-h-[44px] px-2"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
