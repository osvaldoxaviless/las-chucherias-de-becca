import React, { useState } from 'react';
import { StoreConfig } from '../types';
import { X, Check, KeyRound, MessageCircle, MapPin, Store, Instagram, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  config: StoreConfig;
  onSave: (updatedConfig: StoreConfig) => void;
  onClose: () => void;
  onResetDefaults?: () => void;
}

export const QuickSettingsModal: React.FC<Props> = ({
  isOpen,
  config,
  onSave,
  onClose,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const [formConfig, setFormConfig] = useState<StoreConfig>({ ...config });
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  const handleFieldChange = (field: keyof StoreConfig, value: any) => {
    setFormConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePinChange = (val: string) => {
    // Only numeric up to 6 digits
    const sanitized = val.replace(/\D/g, '').slice(0, 6);
    handleFieldChange('adminPin', sanitized);
    if (sanitized.length < 4) {
      setPinFeedback('El PIN debe tener al menos 4 números');
    } else {
      setPinFeedback(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPin = formConfig.adminPin ? String(formConfig.adminPin).trim() : '2026';
    onSave({
      ...formConfig,
      adminPin: finalPin || '2026',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-black shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 flex items-center justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-black/15 text-amber-900">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-recoleta font-bold text-lg text-black">
                Ajustes de Tienda & PIN
              </h3>
              <p className="text-xs text-stone-500">
                Seguridad, canal de WhatsApp y datos de contacto
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-xs">
          
          {/* PIN Input */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <label className="font-bold text-stone-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>PIN de Administrador (para entrar a editar)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={formConfig.adminPin || '2026'}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="2026"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono tracking-widest text-center text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            {pinFeedback ? (
              <p className="text-[11px] text-rose-600 font-semibold">{pinFeedback}</p>
            ) : (
              <p className="text-[11px] text-stone-500">
                PIN numérico de 4 dígitos. PIN maestro de respaldo: <strong>2026</strong>.
              </p>
            )}
          </div>

          {/* WhatsApp & Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Receptor</span>
              </label>
              <input
                type="text"
                value={formConfig.whatsappNumber || ''}
                onChange={(e) => handleFieldChange('whatsappNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="527225628061"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
              <span className="text-[10px] text-stone-400">Incluye lada (ej: 52...)</span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram (sin @)</span>
              </label>
              <input
                type="text"
                value={formConfig.instagramHandle || ''}
                onChange={(e) => handleFieldChange('instagramHandle', e.target.value.replace(/^@/, ''))}
                placeholder="laschucheriasdebecca"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Ubicación o Zona de Retiro</span>
              </label>
              <input
                type="text"
                value={formConfig.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="Toluca, Estado de México"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                🔒 Por tu privacidad, te sugerimos indicar tu municipio o zona (sin tu calle o número privado).
              </span>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Ciudad o Zona de Cobertura
              </label>
              <input
                type="text"
                value={formConfig.city || ''}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder="Toluca y alrededores"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>
          </div>

          {/* Store status switch */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-stone-700" />
              <div>
                <span className="font-bold text-stone-800 block text-xs">Estado de la Tienda</span>
                <span className="text-[11px] text-stone-500">
                  {formConfig.isStoreOpen ? 'Abierta para recibir pedidos' : 'Pausada temporalmente'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFieldChange('isStoreOpen', !formConfig.isStoreOpen)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                formConfig.isStoreOpen
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {formConfig.isStoreOpen ? 'Abierta' : 'Pausada'}
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
            {onResetDefaults ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Restablecer configuración de fábrica?')) {
                    onResetDefaults();
                    onClose();
                  }
                }}
                className="text-stone-400 hover:text-rose-600 text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-bold hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#99ffcc] text-black border border-black font-extrabold flex items-center gap-1.5 shadow-xs hover:bg-[#80ffbf] transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Aplicar</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
