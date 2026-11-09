import React from 'react';
import { Save, Plus, Settings, X, Sparkles, LayoutList } from 'lucide-react';

interface Props {
  onSaveAndExit: () => void;
  onCancelAndExit: () => void;
  onAddNewProduct: () => void;
  onOpenQuickSettings: () => void;
  onOpenClassicPanel: () => void;
  hasUnsavedChanges?: boolean;
}

export const LiveEditBar: React.FC<Props> = ({
  onSaveAndExit,
  onCancelAndExit,
  onAddNewProduct,
  onOpenQuickSettings,
  onOpenClassicPanel,
  hasUnsavedChanges = false,
}) => {
  return (
    <aside
      aria-label="Barra de Modo Edición"
      className="fixed top-0 inset-x-0 z-50 bg-[#160042] text-white border-b-2 border-[#99ffcc] shadow-xl px-3 sm:px-6 py-2.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left: Mode indicator & explanation */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#99ffcc] text-black text-xs font-black tracking-wide uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#160042] animate-pulse" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modo Edición en Vivo</span>
          </div>

          <div className="hidden lg:block text-xs text-white/80">
            <span>Estás viendo y editando la tienda <strong className="text-white">exactamente como la ve el cliente</strong>.</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          
          {/* Add Product Button */}
          <button
            type="button"
            onClick={onAddNewProduct}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 active:scale-95"
            title="Agregar un nuevo postre al menú"
          >
            <Plus className="w-3.5 h-3.5 text-[#99ffcc]" />
            <span>+ Postre</span>
          </button>

          {/* Quick Settings (PIN, WhatsApp, Location) */}
          <button
            type="button"
            onClick={onOpenQuickSettings}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 active:scale-95"
            title="Ajustes de PIN, WhatsApp y dirección del taller"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ajustes & PIN</span>
            <span className="sm:hidden">Ajustes</span>
          </button>

          {/* Classic Admin Panel toggle */}
          <button
            type="button"
            onClick={onOpenClassicPanel}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 active:scale-95"
            title="Abrir panel administrativo tradicional (tablas y métricas)"
          >
            <LayoutList className="w-3.5 h-3.5 text-sky-300" />
            <span className="hidden md:inline">Panel Clásico</span>
          </button>

          {/* Save & Exit Button (Primary) */}
          <button
            type="button"
            onClick={onSaveAndExit}
            className="px-4 py-1.5 rounded-lg bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-extrabold text-xs flex items-center gap-1.5 border border-black shadow-xs active:scale-95 transition-all"
            title="Guardar todos los cambios y salir del modo edición"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar y Terminar</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping ml-0.5" />
            )}
          </button>

          {/* Cancel & Exit Button */}
          <button
            type="button"
            onClick={onCancelAndExit}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Salir sin guardar cambios"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </aside>
  );
};
