import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Check, Lock, Power, 
  Settings, MessageCircle, AlertCircle, RefreshCw, X,
  Camera, Upload, Sparkles, Layers, Image as ImageIcon
} from 'lucide-react';
import { 
  Product, StoreConfig, ProductCategory, 
  CustomizerFlavor, CustomizerFilling, CustomizerFrosting, CustomizerTopping 
} from '../types';
import { 
  FLAVOR_OPTIONS, FILLING_OPTIONS, FROSTING_OPTIONS, TOPPING_OPTIONS 
} from './CakeCustomizer';
import { ImageCropModal } from './ImageCropModal';

interface Props {
  products: Product[];
  config: StoreConfig;
  onSaveProducts: (products: Product[]) => void;
  onSaveConfig: (config: StoreConfig) => void;
  onClose: () => void;
  onResetDefaults: () => void;
  onEnterLiveEdit?: () => void;
}

export const AdminPanel: React.FC<Props> = ({
  products,
  config,
  onSaveProducts,
  onSaveConfig,
  onClose,
  onResetDefaults,
  onEnterLiveEdit,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active tab: 'products' | 'customizer' | 'store'
  const [tab, setTab] = useState<'products' | 'customizer' | 'store'>('products');

  // Filter in admin
  const [filterCategory, setFilterCategory] = useState<string>('todos');

  // View mode for products: 'mirror' (Visual Store Mirror) vs 'table' (Compact list)
  const [viewStyle, setViewStyle] = useState<'mirror' | 'table'>('mirror');

  // New product modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(150);
  const [newCategory, setNewCategory] = useState<ProductCategory>('chucherias');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
  const [newPrep, setNewPrep] = useState('24 hrs');

  // Customizer editing state
  const [flavors, setFlavors] = useState<CustomizerFlavor[]>(() => {
    return (config.customFlavors && config.customFlavors.length > 0)
      ? config.customFlavors
      : FLAVOR_OPTIONS;
  });

  const [fillings, setFillings] = useState<CustomizerFilling[]>(() => {
    return (config.customFillings && config.customFillings.length > 0)
      ? config.customFillings
      : FILLING_OPTIONS;
  });

  const [frostings, setFrostings] = useState<CustomizerFrosting[]>(() => {
    return (config.customFrostings && config.customFrostings.length > 0)
      ? config.customFrostings
      : FROSTING_OPTIONS;
  });

  const [toppings, setToppings] = useState<CustomizerTopping[]>(() => {
    return (config.customToppings && config.customToppings.length > 0)
      ? config.customToppings
      : TOPPING_OPTIONS;
  });

  // Store settings changes & feedback
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Image Crop & Adjustment Modal state
  const [cropModalData, setCropModalData] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    productId?: string;
    productName?: string;
    isNewProduct?: boolean;
  }>({
    isOpen: false,
    imageSrc: null,
  });

  // PIN login handler with normalization and resilient master fallback
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pinInput.trim();
    const currentPin = String(config?.adminPin || '2026').trim();
    const MASTER_PIN = '2026';

    if (enteredPin === currentPin || enteredPin === MASTER_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Toggle availability (Disponible / Agotado) - like Mudy!
  const handleToggleAvailability = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        const current = p.available !== false;
        return { ...p, available: !current };
      }
      return p;
    });
    onSaveProducts(updated);
  };

  // Quick price change
  const handlePriceChange = (productId: string, price: number) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, price } : p));
    onSaveProducts(updated);
  };

  // In-place name change for visual mirror
  const handleNameChange = (productId: string, name: string) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, name } : p));
    onSaveProducts(updated);
  };

  // In-place description change for visual mirror
  const handleDescChange = (productId: string, description: string) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, description } : p));
    onSaveProducts(updated);
  };

  // File upload for an existing product with visual adjustment modal
  const handleProductImageUpload = (
    productId: string, 
    e: React.ChangeEvent<HTMLInputElement>,
    productName?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCropModalData({
        isOpen: true,
        imageSrc: dataUrl,
        productId,
        productName: productName || 'Postre',
        isNewProduct: false,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // File upload for new product in modal with visual adjustment
  const handleNewProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCropModalData({
        isOpen: true,
        imageSrc: dataUrl,
        productName: newName.trim() || 'Nuevo Postre',
        isNewProduct: true,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save cropped/adjusted image from ImageCropModal
  const handleSaveCroppedImage = (croppedDataUrl: string) => {
    if (cropModalData.isNewProduct) {
      setNewImage(croppedDataUrl);
      setSettingsFeedback('¡Foto lista para tu nuevo postre!');
    } else if (cropModalData.productId) {
      const updated = products.map((p) =>
        p.id === cropModalData.productId ? { ...p, image: croppedDataUrl } : p
      );
      onSaveProducts(updated);
      setSettingsFeedback('¡Foto del postre ajustada y guardada con éxito!');
    }
    setCropModalData({ isOpen: false, imageSrc: null });
    setTimeout(() => setSettingsFeedback(null), 3000);
  };

  // Delete product
  const handleDelete = (productId: string, name: string) => {
    if (confirm(`¿Eliminar "${name}" del menú?`)) {
      onSaveProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Add new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newName.trim(),
      price: newPrice,
      category: newCategory,
      description: newDesc.trim() || 'Elaborado artesanalmente por Las chucherías de Becca.',
      image: newImage.trim(),
      available: true,
      preparationTime: newPrep.trim() || '24 hrs',
    };

    onSaveProducts([newProd, ...products]);
    setIsAddingProduct(false);
    setNewName('');
    setNewDesc('');
  };

  const handleUpdateConfigField = (field: keyof StoreConfig, value: any) => {
    onSaveConfig({ ...config, [field]: value });
  };

  const handlePinChange = (val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(0, 6);
    handleUpdateConfigField('adminPin', sanitized);
  };

  const handleSaveSettings = () => {
    const sanitizedPin = (config?.adminPin && String(config.adminPin).trim()) || '2026';
    onSaveConfig({
      ...config,
      adminPin: sanitizedPin,
    });
    setSettingsFeedback('¡Ajustes guardados correctamente!');
    setTimeout(() => setSettingsFeedback(null), 3000);
  };

  // Save customizer flavors & ingredients
  const handleSaveCustomizer = () => {
    onSaveConfig({
      ...config,
      customFlavors: flavors,
      customFillings: fillings,
      customFrostings: frostings,
      customToppings: toppings,
    });
    setSettingsFeedback('¡Sabores e ingredientes de "Arma tu pastel" guardados con éxito!');
    setTimeout(() => setSettingsFeedback(null), 3000);
  };

  // If not logged in, show clean PIN screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-modal text-center space-y-5 border border-stone-200">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              Panel de Administración
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Ingresa tu PIN de 4 dígitos para gestionar menú y precios
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError(false);
              }}
              placeholder="••••"
              aria-label="PIN de Administrador"
              className={`w-full text-center text-2xl tracking-widest font-mono py-3 rounded-2xl border ${
                pinError ? 'border-rose-500 bg-rose-50' : 'border-stone-200 bg-stone-50'
              } focus:outline-none focus:ring-2 focus:ring-stone-900`}
            />

            {pinError && (
              <p role="alert" className="text-xs text-rose-600 font-medium flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                PIN incorrecto. Intenta de nuevo.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filtered products list
  const filtered = products.filter(
    (p) => filterCategory === 'todos' || p.category === filterCategory
  );

  const availableCount = products.filter((p) => p.available !== false).length;
  const soldOutCount = products.length - availableCount;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF9] overflow-y-auto">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Volver a la tienda"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-stone-900">
                Panel de Becca
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Nube Activa (Sincronizado)</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Gestión rápida de menú, fotos, sabores y textos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEnterLiveEdit && (
            <button
              type="button"
              onClick={onEnterLiveEdit}
              className="px-3 py-1.5 rounded-xl bg-[#99ffcc] text-black font-extrabold text-xs flex items-center gap-1.5 border border-black shadow-xs hover:bg-[#80ffbf] active:scale-95"
              title="Abrir la tienda real y editar directamente sobre los elementos"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modo Edición en Tienda</span>
            </button>
          )}

          {/* Store open toggle */}
          <button
            onClick={() => handleUpdateConfigField('isStoreOpen', !config.isStoreOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
              config.isStoreOpen
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{config.isStoreOpen ? 'Tienda Abierta' : 'Tienda Pausada'}</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'products'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Postres ({products.length})
            </button>
            <button
              onClick={() => setTab('customizer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'customizer'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Arma tu Pastel (Sabores)
            </button>
            <button
              onClick={() => setTab('store')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'store'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              Ajustes de Tienda y Redacción
            </button>
          </div>

          {tab === 'products' && (
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Postre</span>
            </button>
          )}

          {tab === 'customizer' && (
            <button
              onClick={handleSaveCustomizer}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-subtle transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Sabores</span>
            </button>
          )}
        </div>

        {/* Global Feedback Banner */}
        {settingsFeedback && (
          <div
            role="status"
            className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fadeIn"
          >
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{settingsFeedback}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: POSTRES (MODO ESPEJO VISUAL Y EDICIÓN EN TIEMPO REAL)   */}
        {/* ============================================================== */}
        {tab === 'products' && (
          <div className="space-y-6">
            
            {/* Banner de acceso directo a Edición en Tienda Real */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-[#99ffcc]/30 border border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black text-white text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-[#99ffcc]" />
                  <span>Modo Edición en Tienda (Recomendado)</span>
                </div>
                <h3 className="font-recoleta text-lg font-bold text-black">
                  Edita tu tienda visualmente tal como la ven tus clientes
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                  Reordena bloques del canvas, oculta secciones, agrega nuevos postres y cambia fotos reales o precios directamente en la pantalla.
                </p>
              </div>

              {onEnterLiveEdit && (
                <button
                  type="button"
                  onClick={onEnterLiveEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#99ffcc] text-black font-extrabold text-xs hover:bg-[#80ffbf] transition-all active:scale-95 shadow-xs border border-black flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Abrir Canvas de Edición en Tienda</span>
                </button>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-center sm:text-left">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Total en Menú
                </span>
                <span className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                  {products.length}
                </span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-center sm:text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Disponibles Hoy
                </span>
                <span className="font-display font-bold text-xl sm:text-2xl text-emerald-700">
                  {availableCount}
                </span>
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-center sm:text-left">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                  Agotados
                </span>
                <span className="font-display font-bold text-xl sm:text-2xl text-rose-600">
                  {soldOutCount}
                </span>
              </div>
            </div>

            {/* Category Filter Pills (Mismas categorías que la tienda) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'chucherias', label: 'Fresas, Uvas & Manzanas' },
                { id: 'pasteles', label: 'Pasteles' },
                { id: 'cupcakes', label: 'Cupcakes' },
                { id: 'galletas-brownies', label: 'Galletas & Brownies' },
                { id: 'cajas-regalo', label: 'Cajas de Regalo' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterCategory === c.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* ========================================================== */}
            {/* VISTA 1: MODO ESPEJO VISUAL (COMO SE VE EN LA TIENDA REAL) */}
            {/* ========================================================== */}
            {viewStyle === 'mirror' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((prod) => {
                  const isAvailable = prod.available !== false;
                  return (
                    <div
                      key={prod.id}
                      className={`bg-white rounded-2xl border-2 transition-all p-4 space-y-3 flex flex-col justify-between group shadow-sm ${
                        isAvailable
                          ? 'border-black hover:border-black'
                          : 'border-stone-300 bg-stone-50/70 opacity-75'
                      }`}
                    >
                      {/* Top: Foto del postre con botón destacado "Cambiar foto" */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/15 bg-stone-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            !isAvailable ? 'grayscale-40' : 'group-hover:scale-102'
                          }`}
                        />

                        {/* Botón táctil para subir foto directo desde cel o PC */}
                        <label 
                          title="Subir foto desde tu dispositivo o celular" 
                          className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-[#99ffcc] text-black text-xs font-bold px-3 py-1.5 rounded-full border border-black shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <Camera className="w-3.5 h-3.5 text-black" />
                          <span>Cambiar foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleProductImageUpload(prod.id, e, prod.name)}
                          />
                        </label>

                        {/* Categoría pill */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="bg-white/90 backdrop-blur-xs text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-black/20">
                            {prod.category}
                          </span>
                          {!isAvailable && (
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Agotado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Edición directa del nombre y descripción */}
                      <div className="space-y-2 flex-1">
                        <div>
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                            Nombre del Postre
                          </label>
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => handleNameChange(prod.id, e.target.value)}
                            title="Haz clic para editar el nombre del postre"
                            placeholder="Nombre del postre"
                            className="w-full font-bold text-sm text-stone-900 bg-transparent border-b border-dashed border-stone-300 hover:border-black focus:border-black focus:bg-amber-50/50 py-1 transition-colors focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                            Descripción
                          </label>
                          <textarea
                            rows={2}
                            value={prod.description}
                            onChange={(e) => handleDescChange(prod.id, e.target.value)}
                            title="Haz clic para editar la descripción"
                            placeholder="Descripción del postre..."
                            className="w-full text-xs text-stone-600 bg-transparent border-b border-dashed border-stone-200 hover:border-black focus:border-black focus:bg-amber-50/50 py-1 transition-colors focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      {/* Bottom: Precio editable en vivo, switch disponible y botón eliminar */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-stone-500">$</span>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm font-extrabold text-stone-900 bg-[#99ffcc]/30 border border-black rounded-lg text-right focus:bg-white focus:outline-none"
                          />
                          <span className="text-[11px] font-bold text-stone-500">MXN</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(prod.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300'
                            }`}
                            title="Cambiar disponibilidad"
                          >
                            {isAvailable ? '✓ Disponible' : 'Agotado'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar del menú"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Tarjeta para agregar nuevo postre al final del grid espejo */}
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(true)}
                  className="min-h-[280px] rounded-2xl border-2 border-dashed border-black/30 hover:border-black bg-white hover:bg-[#99ffcc]/15 p-6 flex flex-col items-center justify-center text-center transition-all group active:scale-98 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-full bg-[#99ffcc] border border-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                    <Plus className="w-6 h-6 text-black" />
                  </div>
                  <span className="font-bold text-sm text-stone-900 block">
                    + Agregar Nuevo Postre
                  </span>
                  <span className="text-xs text-stone-500 mt-1 max-w-[200px] leading-relaxed">
                    Sube una foto y precio para que aparezca en tu tienda al instante
                  </span>
                </button>
              </div>
            ) : (
              /* ========================================================== */
              /* VISTA 2: MODO LISTA / TABLA COMPACTA                       */
              /* ========================================================== */
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-subtle divide-y divide-stone-100">
                {filtered.map((prod) => {
                  const isAvailable = prod.available !== false;
                  return (
                    <div
                      key={prod.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        isAvailable ? 'hover:bg-stone-50/50' : 'bg-stone-50/70 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative group flex-shrink-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className={`w-16 h-16 rounded-xl object-cover border border-stone-200 ${
                              !isAvailable ? 'grayscale-50' : ''
                            }`}
                          />
                          <label 
                            title="Subir foto desde tu dispositivo" 
                            className="absolute inset-0 bg-black/60 text-white rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                          >
                            <Camera className="w-4 h-4" />
                            <span className="text-[9px] font-bold mt-0.5">Cambiar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleProductImageUpload(prod.id, e, prod.name)}
                            />
                          </label>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-stone-900 truncate">
                              {prod.name}
                            </h4>
                            {!isAvailable && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-600">
                                Agotado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 truncate mt-0.5">
                            {prod.description}
                          </p>
                          
                          <label className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer inline-flex items-center gap-1 mt-1">
                            <Upload className="w-3 h-3" />
                            <span>Subir nueva imagen</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleProductImageUpload(prod.id, e, prod.name)}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-stone-400 font-bold">$</span>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                            className="w-20 px-2 py-1.5 text-sm font-bold text-stone-900 border border-stone-200 rounded-lg text-right focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                          <span className="text-[11px] text-stone-400 font-medium">MXN</span>
                        </div>

                        <button
                          onClick={() => handleToggleAvailability(prod.id)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                          title="Cambiar disponibilidad"
                        >
                          {isAvailable ? '✓ Disponible' : 'Agotado'}
                        </button>

                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar del menú"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ARMA TU PASTEL (SABORES, RELLENOS Y BETUNES EDITABLES)  */}
        {/* ============================================================== */}
        {tab === 'customizer' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Personalización del Atelier de Pasteles</span>
              </p>
              <p className="mt-0.5 text-amber-800">
                Aquí Rebeca puede modificar los sabores de pan, rellenos caseros, betunes y toppings para que correspondan exactamente a los que prepara en su pastelería en Toluca.
              </p>
            </div>

            {/* SECCIÓN 1: Bizcochos / Panes */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <span>🍰 Sabores de Bizcocho / Pan de Pastel</span>
                  <span className="text-xs text-stone-400 font-normal">({flavors.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const id = `flavor-${Date.now()}`;
                    setFlavors([...flavors, { id, name: 'Nuevo Sabor', desc: 'Bizcocho casero artesanal' }]);
                  }}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Pan</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {flavors.map((fl, idx) => (
                  <div key={fl.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <input
                      type="text"
                      value={fl.name}
                      onChange={(e) => {
                        const copy = [...flavors];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setFlavors(copy);
                      }}
                      placeholder="Nombre del sabor (ej: Vainilla Tradicional)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold bg-white"
                    />
                    <input
                      type="text"
                      value={fl.desc || ''}
                      onChange={(e) => {
                        const copy = [...flavors];
                        copy[idx] = { ...copy[idx], desc: e.target.value };
                        setFlavors(copy);
                      }}
                      placeholder="Descripción breve"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-600 hidden sm:block"
                    />
                    <button
                      type="button"
                      onClick={() => setFlavors(flavors.filter((_, i) => i !== idx))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Eliminar sabor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 2: Rellenos Artesanales */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <span>🍯 Rellenos Artesanales</span>
                  <span className="text-xs text-stone-400 font-normal">({fillings.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const id = `filling-${Date.now()}`;
                    setFillings([...fillings, { id, name: 'Nuevo Relleno', price: 0 }]);
                  }}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Relleno</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {fillings.map((fi, idx) => (
                  <div key={fi.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <input
                      type="text"
                      value={fi.name}
                      onChange={(e) => {
                        const copy = [...fillings];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setFillings(copy);
                      }}
                      placeholder="Nombre del relleno (ej: Cajeta Artesanal)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold bg-white"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-stone-400 font-bold">+$</span>
                      <input
                        type="number"
                        value={fi.price}
                        onChange={(e) => {
                          const copy = [...fillings];
                          copy[idx] = { ...copy[idx], price: Number(e.target.value) };
                          setFillings(copy);
                        }}
                        className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-right bg-white"
                      />
                      <span className="text-[10px] text-stone-400 font-medium">MXN</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFillings(fillings.filter((_, i) => i !== idx))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Eliminar relleno"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: Coberturas y Betunes */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <span>✨ Coberturas y Betunes</span>
                  <span className="text-xs text-stone-400 font-normal">({frostings.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const id = `frosting-${Date.now()}`;
                    setFrostings([...frostings, { id, name: 'Nueva Cobertura', desc: 'Acabado suave artesanal' }]);
                  }}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Cobertura</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {frostings.map((fr, idx) => (
                  <div key={fr.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <input
                      type="text"
                      value={fr.name}
                      onChange={(e) => {
                        const copy = [...frostings];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setFrostings(copy);
                      }}
                      placeholder="Nombre de cobertura (ej: Betún de Mantequilla)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold bg-white"
                    />
                    <input
                      type="text"
                      value={fr.desc || ''}
                      onChange={(e) => {
                        const copy = [...frostings];
                        copy[idx] = { ...copy[idx], desc: e.target.value };
                        setFrostings(copy);
                      }}
                      placeholder="Descripción del estilo"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-white text-stone-600 hidden sm:block"
                    />
                    <button
                      type="button"
                      onClick={() => setFrostings(frostings.filter((_, i) => i !== idx))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Eliminar cobertura"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 4: Toppings y Extras */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <span>🍓 Toppings y Decoraciones</span>
                  <span className="text-xs text-stone-400 font-normal">({toppings.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const id = `topping-${Date.now()}`;
                    setToppings([...toppings, { id, name: 'Nuevo Topping', price: 25 }]);
                  }}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Topping</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {toppings.map((to, idx) => (
                  <div key={to.id || idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                    <input
                      type="text"
                      value={to.name}
                      onChange={(e) => {
                        const copy = [...toppings];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        setToppings(copy);
                      }}
                      placeholder="Nombre del topping (ej: Fresas Frescas)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold bg-white"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-stone-400 font-bold">+$</span>
                      <input
                        type="number"
                        value={to.price}
                        onChange={(e) => {
                          const copy = [...toppings];
                          copy[idx] = { ...copy[idx], price: Number(e.target.value) };
                          setToppings(copy);
                        }}
                        className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-right bg-white"
                      />
                      <span className="text-[10px] text-stone-400 font-medium">MXN</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToppings(toppings.filter((_, i) => i !== idx))}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Eliminar topping"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón flotante o fijo de guardar */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveCustomizer}
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-subtle active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Todos los Sabores</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AJUSTES DE TIENDA Y REDACCIÓN EDITABLE DE PÁGINA INICIO  */}
        {/* ============================================================== */}
        {tab === 'store' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
            
            {/* Banner recomendando Modo Edición en la Tienda Real */}
            {onEnterLiveEdit && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-[#99ffcc]/30 border border-black/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-[#99ffcc]" />
                    <span>Modo Edición en Vivo</span>
                  </div>
                  <h4 className="font-bold text-sm text-black">
                    ¿Prefieres editar viendo la tienda real tal como la ven tus clientes?
                  </h4>
                  <p className="text-xs text-stone-600">
                    Puedes hacer clic directamente en los textos, títulos y avisos de la portada para modificarlos sin formularios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onEnterLiveEdit}
                  className="px-4 py-2 rounded-xl bg-[#99ffcc] text-black font-extrabold text-xs flex items-center gap-1.5 border border-black shadow-xs hover:bg-[#80ffbf] whitespace-nowrap active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ir a Editar en la Tienda</span>
                </button>
              </div>
            )}

            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Configuración de Tienda y Contacto
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Actualiza los datos de tu pastelería, canales de WhatsApp y seguridad.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={config.storeName ?? ''}
                  onChange={(e) => handleUpdateConfigField('storeName', e.target.value)}
                  placeholder="Las chucherías de Becca"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Usuario de Instagram
                </label>
                <input
                  type="text"
                  value={config.instagramHandle ?? ''}
                  onChange={(e) => handleUpdateConfigField('instagramHandle', e.target.value.replace(/^@/, ''))}
                  placeholder="laschucheriasdebecca"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Número de WhatsApp Receptor (Lada + Teléfono)
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber ?? ''}
                  onChange={(e) => handleUpdateConfigField('whatsappNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="527225628061"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  A este WhatsApp llegan los pedidos y las cotizaciones.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  PIN de Acceso a este Panel (4 dígitos)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={config.adminPin ?? '2026'}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono tracking-wider"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  PIN numérico para acceder. PIN maestro de respaldo: 2026.
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Dirección del Taller (Retiro en tienda)
                </label>
                <input
                  type="text"
                  value={config.address ?? ''}
                  onChange={(e) => handleUpdateConfigField('address', e.target.value)}
                  placeholder="Toluca, Estado de México"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Ciudad o Zona de Cobertura
                </label>
                <input
                  type="text"
                  value={config.city ?? ''}
                  onChange={(e) => handleUpdateConfigField('city', e.target.value)}
                  placeholder="Toluca y Metepec"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-700">
                    Banner de Aviso Superior
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.bannerVisible}
                      onChange={(e) => handleUpdateConfigField('bannerVisible', e.target.checked)}
                      className="rounded text-stone-900"
                    />
                    <span className="text-[11px] text-stone-500">Mostrar banner</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={config.announcementText ?? ''}
                  onChange={(e) => handleUpdateConfigField('announcementText', e.target.value)}
                  placeholder="Ej: ¡Agenda abierta para el fin de semana!"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* SECCIÓN EDITABLE: REDACCIÓN DE LA PÁGINA PRINCIPAL (ESPAÑOL DE MÉXICO) */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <span>✏️ Redacción de la Página Principal (Español de México)</span>
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Cambia cualquier frase de la portada para adaptarla al estilo natural de Rebeca.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">
                    Titular Principal (Hero)
                  </label>
                  <input
                    type="text"
                    value={config.heroTitle ?? ''}
                    onChange={(e) => handleUpdateConfigField('heroTitle', e.target.value)}
                    placeholder="Repostería artesanal y pasteles únicos para celebrar."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">
                    Subtítulo / Descripción del Hero
                  </label>
                  <textarea
                    rows={2}
                    value={config.heroSubtitle ?? ''}
                    onChange={(e) => handleUpdateConfigField('heroSubtitle', e.target.value)}
                    placeholder="Pasteles personalizados, bento cakes temáticos, fresas con chocolate y bocadillos dulces elaborados al día en Toluca y Metepec (envío calculado según zona)."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Distintivo / Slogan Superior
                  </label>
                  <input
                    type="text"
                    value={config.heroBadge ?? ''}
                    onChange={(e) => handleUpdateConfigField('heroBadge', e.target.value)}
                    placeholder="Toluca y Metepec • Pedidos directos vía WhatsApp"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Título "Sobre Becca"
                  </label>
                  <input
                    type="text"
                    value={config.aboutTitle ?? ''}
                    onChange={(e) => handleUpdateConfigField('aboutTitle', e.target.value)}
                    placeholder="Hola, soy Becca."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">
                    Historia de Becca (Sección Nosotros)
                  </label>
                  <textarea
                    rows={3}
                    value={config.aboutStory ?? ''}
                    onChange={(e) => handleUpdateConfigField('aboutStory', e.target.value)}
                    placeholder="Las chucherías de Becca nació del amor por hornear postres que no solo se vean hermosos, sino que tengan un sabor inolvidable..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Restablecer el menú al catálogo original y configuración inicial?')) {
                    onResetDefaults();
                    setSettingsFeedback('Valores restablecidos a los de fábrica.');
                    setTimeout(() => setSettingsFeedback(null), 3000);
                  }
                }}
                className="text-xs text-stone-400 hover:text-rose-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer productos de fábrica</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-subtle active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Ajustes y Textos</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal: Add New Product with Image File Upload */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-modal space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                Agregar Nuevo Postre al Menú
              </h3>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nombre del Postre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pastel de Tres Leches con Fresas"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Precio (MXN $) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Categoría *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="chucherias">Fresas, Uvas & Manzanas</option>
                    <option value="pasteles">Pasteles</option>
                    <option value="cupcakes">Cupcakes</option>
                    <option value="galletas-brownies">Galletas & Brownies</option>
                    <option value="cajas-regalo">Cajas de Regalo</option>
                  </select>
                </div>
              </div>

              {/* Subida de Imagen por Archivo */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="font-bold text-stone-800 block text-xs">Foto del Postre *</label>
                
                <div className="flex items-center gap-3">
                  {newImage && (
                    <img 
                      src={newImage} 
                      alt="Vista previa" 
                      className="w-16 h-16 rounded-xl object-cover border border-stone-300 flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 space-y-1.5">
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-stone-300 hover:border-black cursor-pointer bg-white hover:bg-stone-100 transition-colors text-xs font-bold text-stone-800">
                      <Upload className="w-4 h-4 text-stone-600" />
                      <span>Subir foto desde tu dispositivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleNewProductImageUpload}
                      />
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-400">o URL:</span>
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe los ingredientes, porciones o detalles especiales..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold"
                >
                  Guardar Postre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Ajuste y Recorte de Foto en 4:3 */}
      <ImageCropModal
        isOpen={cropModalData.isOpen}
        imageSrc={cropModalData.imageSrc}
        productName={cropModalData.productName}
        onSave={handleSaveCroppedImage}
        onCancel={() => setCropModalData({ isOpen: false, imageSrc: null })}
      />

    </div>
  );
};
