import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, Plus } from 'lucide-react';
import { Product, ProductCategory, CartItem, StoreConfig, PortfolioItem } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { DEFAULT_STORE_CONFIG } from './data/config';
import { DEFAULT_PORTFOLIO_ITEMS } from './data/portfolio';
import { BannerAnnouncement } from './components/BannerAnnouncement';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CakeCustomizer } from './components/CakeCustomizer';
import { CartDrawer } from './components/CartDrawer';
import { AboutBecca } from './components/AboutBecca';
import { PortfolioRoll } from './components/PortfolioRoll';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { Toast } from './components/Toast';
import { LiveEditBar } from './components/LiveEditBar';
import { QuickSettingsModal } from './components/QuickSettingsModal';
import { AddProductModal } from './components/AddProductModal';
import { ImageCropModal } from './components/ImageCropModal';
import { CanvasBlockWrapper } from './components/CanvasBlockWrapper';
import { BlocksOrganizerModal } from './components/BlocksOrganizerModal';
import { 
  subscribeToProductsCloud, 
  saveProductsCloud, 
  subscribeToConfigCloud, 
  saveConfigCloud 
} from './services/firebase';

const BLOCK_DEFINITIONS: Record<string, { name: string; icon: string }> = {
  hero: { name: 'Portada Hero', icon: '✨' },
  catalog: { name: 'Catálogo de Postres', icon: '🧁' },
  customizer: { name: 'Arma tu Pastel (Atelier)', icon: '🎂' },
  portfolio: { name: 'Galería de Referencias', icon: '📸' },
  about: { name: 'Sobre Becca (Nosotros)', icon: '👩🏻‍🍳' },
  faq: { name: 'Preguntas Frecuentes', icon: '❓' },
};

export function App() {
  // Store config with localStorage persistence & resilient default hydration
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('chuches_config');
      if (!saved) return DEFAULT_STORE_CONFIG;
      const parsed = JSON.parse(saved);
      if (parsed.announcementText === 'Envíos en Toluca & Metepec o retiro en taller. Pedidos con anticipación.') {
        parsed.announcementText = DEFAULT_STORE_CONFIG.announcementText;
      }
      if (parsed.city === 'Toluca y Metepec') {
        parsed.city = DEFAULT_STORE_CONFIG.city;
      }
      if (parsed.heroBadge === 'Toluca y Metepec • Pedidos directos vía WhatsApp' || parsed.heroBadge === 'Toluca y alrededores • Pedidos directos vía WhatsApp') {
        parsed.heroBadge = DEFAULT_STORE_CONFIG.heroBadge;
      }
      if (parsed.heroTitle === 'Repostería artesanal y pasteles únicos para celebrar.') {
        parsed.heroTitle = DEFAULT_STORE_CONFIG.heroTitle;
      }
      if (parsed.address && parsed.address.includes('El Oro 112')) {
        parsed.address = 'Toluca, Estado de México';
      }
      return {
        ...DEFAULT_STORE_CONFIG,
        ...parsed,
        address: (parsed.address && !parsed.address.includes('El Oro 112')) ? parsed.address : 'Toluca, Estado de México',
        adminPin: (parsed.adminPin && String(parsed.adminPin).trim()) || DEFAULT_STORE_CONFIG.adminPin || '2026',
      };
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  });

  // Products with localStorage persistence & version auto-refresh
  const [products, setProducts] = useState<Product[]>(() => {
    const CATALOG_VERSION = 'v4_navidad_and_single_custom_cake';
    const currentVer = localStorage.getItem('chuches_catalog_version');
    if (currentVer !== CATALOG_VERSION) {
      localStorage.setItem('chuches_catalog_version', CATALOG_VERSION);
      localStorage.setItem('chuches_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const saved = localStorage.getItem('chuches_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('chuches_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.pathname.includes('admin') || window.location.hash.includes('admin');
  });
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Store In-Place Edit Mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isBlocksOrganizerOpen, setIsBlocksOrganizerOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSnapshot, setOriginalSnapshot] = useState<{ config: StoreConfig; products: Product[] } | null>(null);

  // Image Cropping for in-place photo adjustments (products, cake tiers, portfolio references)
  const [cropModalData, setCropModalData] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    productId?: string;
    tierId?: string;
    portfolioId?: string;
    productName?: string;
  }>({
    isOpen: false,
    imageSrc: null,
  });

  // Real-time Cloud Synchronization across Phone, PC & all clients (Firebase Firestore)
  useEffect(() => {
    const unsubProducts = subscribeToProductsCloud((cloudProducts) => {
      setProducts(cloudProducts);
    });

    const unsubConfig = subscribeToConfigCloud((cloudConfig) => {
      setConfig((prev) => {
        let safeAddress = cloudConfig.address || prev.address;
        if (safeAddress && safeAddress.includes('El Oro 112')) {
          safeAddress = 'Toluca, Estado de México';
        }
        return {
          ...prev,
          ...cloudConfig,
          address: safeAddress,
          adminPin: (cloudConfig.adminPin && String(cloudConfig.adminPin).trim()) || prev.adminPin || '2026',
        };
      });
    });

    return () => {
      unsubProducts();
      unsubConfig();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('chuches_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('chuches_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('chuches_cart', JSON.stringify(cart));
  }, [cart]);

  // Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      todos: products.length,
      pasteles: 0,
      chucherias: 0,
      cupcakes: 0,
      'galletas-brownies': 0,
      'cajas-regalo': 0,
    };

    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'todos' || p.category === activeCategory;
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && !item.selectedOptions && !item.note
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });

    setToastMessage(`"${product.name}" agregado al carrito`);
  };

  const handleAddToCartWithOptions = (
    product: Product,
    selectedOptions: Record<string, string>,
    note?: string
  ) => {
    setCart((prev) => [...prev, { product, quantity: 1, selectedOptions, note }]);
    setToastMessage(`"${product.name}" agregado al pedido`);
  };

  const handleUpdateProductQuantity = (product: Product, delta: number) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index === -1) return prev;

      const updated = [...prev];
      const newQty = updated[index].quantity + delta;

      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }

      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleUpdateCartItemQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    if (confirm('¿Vaciar los productos del carrito?')) {
      setCart([]);
    }
  };

  // Admin saves with instant Cloud Firestore sync
  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProductsCloud(newProducts);
  };

  const handleSaveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    saveConfigCloud(newConfig);
  };

  const handleResetDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setConfig(DEFAULT_STORE_CONFIG);
    localStorage.removeItem('chuches_products');
    localStorage.removeItem('chuches_config');
    localStorage.removeItem('chuches_catalog_version');
  };

  // Live Store In-Place Edit Mode Handlers
  const handleEnterLiveEdit = () => {
    setOriginalSnapshot({
      config: { ...config },
      products: JSON.parse(JSON.stringify(products)),
    });
    setIsEditMode(true);
    setIsAdminOpen(false);
    setToastMessage('✨ Modo Edición activado: modifica cualquier texto o postre directamente sobre la tienda.');
  };

  const handleSaveAndExitEditMode = () => {
    handleSaveConfig(config);
    handleSaveProducts(products);
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    setOriginalSnapshot(null);
    setToastMessage('✨ ¡Tienda actualizada y guardada con éxito! La sesión de edición ha finalizado.');
  };

  const handleCancelAndExitEditMode = () => {
    if (hasUnsavedChanges) {
      if (!confirm('¿Deseas salir del modo edición sin guardar los cambios realizados?')) {
        return;
      }
    }
    if (originalSnapshot) {
      setConfig(originalSnapshot.config);
      setProducts(originalSnapshot.products);
    }
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    setOriginalSnapshot(null);
    setToastMessage('Modo edición cancelado.');
  };

  const handleUpdateConfigField = (field: keyof StoreConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateAnnouncement = (text: string, visible: boolean) => {
    setConfig((prev) => ({
      ...prev,
      announcementText: text,
      bannerVisible: visible,
    }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateProductInLiveEdit = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    setHasUnsavedChanges(true);
  };

  const handleDeleteProductInLiveEdit = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setHasUnsavedChanges(true);
    setToastMessage('Postre eliminado del menú.');
  };

  const handleToggleAvailabilityInLiveEdit = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const current = p.available !== false;
          return { ...p, available: !current };
        }
        return p;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleAddProductInLiveEdit = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
    setHasUnsavedChanges(true);
    setToastMessage(`"${newProduct.name}" añadido al menú.`);
  };

  const currentBlockOrder = (config.blockOrder && config.blockOrder.length > 0)
    ? config.blockOrder
    : ['hero', 'catalog', 'customizer', 'portfolio', 'about', 'faq'];

  const currentHiddenBlocks = config.hiddenBlocks || [];

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentBlockOrder.length) return;

    const newOrder = [...currentBlockOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setConfig((prev) => ({
      ...prev,
      blockOrder: newOrder,
    }));
    setHasUnsavedChanges(true);
    setToastMessage(`Sección "${BLOCK_DEFINITIONS[moved]?.name || moved}" movida ${direction === 'up' ? 'arriba' : 'abajo'}.`);
  };

  const handleToggleHideBlock = (blockId: string) => {
    setConfig((prev) => {
      const hidden = prev.hiddenBlocks || [];
      const updatedHidden = hidden.includes(blockId)
        ? hidden.filter((id) => id !== blockId)
        : [...hidden, blockId];
      return {
        ...prev,
        hiddenBlocks: updatedHidden,
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleTriggerChangeImageInLiveEdit = (product: Product) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCropModalData({
          isOpen: true,
          imageSrc: dataUrl,
          productId: product.id,
          productName: product.name,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleTriggerChangeTierImage = (tierId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCropModalData({
          isOpen: true,
          imageSrc: dataUrl,
          tierId,
          productName: `Pastel ${tierId}`,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleTriggerChangePortfolioImage = (item: PortfolioItem) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCropModalData({
          isOpen: true,
          imageSrc: dataUrl,
          portfolioId: item.id,
          productName: item.title,
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleUpdatePortfolioItem = (updated: PortfolioItem) => {
    setConfig((prev) => {
      const items = (prev.portfolioItems && prev.portfolioItems.length > 0)
        ? prev.portfolioItems
        : DEFAULT_PORTFOLIO_ITEMS;
      return {
        ...prev,
        portfolioItems: items.map((i) => (i.id === updated.id ? updated : i)),
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleDeletePortfolioItem = (id: string) => {
    setConfig((prev) => {
      const items = (prev.portfolioItems && prev.portfolioItems.length > 0)
        ? prev.portfolioItems
        : DEFAULT_PORTFOLIO_ITEMS;
      return {
        ...prev,
        portfolioItems: items.filter((i) => i.id !== id),
      };
    });
    setHasUnsavedChanges(true);
    setToastMessage('Foto de referencia eliminada.');
  };

  const handleAddPortfolioItem = (newItem: PortfolioItem) => {
    setConfig((prev) => {
      const items = (prev.portfolioItems && prev.portfolioItems.length > 0)
        ? prev.portfolioItems
        : DEFAULT_PORTFOLIO_ITEMS;
      return {
        ...prev,
        portfolioItems: [...items, newItem],
      };
    });
    setHasUnsavedChanges(true);
    setToastMessage(`"${newItem.title}" añadida a la galería de referencias.`);
  };

  const handleSaveCroppedImageInLiveEdit = (croppedDataUrl: string) => {
    if (cropModalData.productId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === cropModalData.productId ? { ...p, image: croppedDataUrl } : p))
      );
      setHasUnsavedChanges(true);
      setToastMessage('Foto del postre actualizada con éxito.');
    } else if (cropModalData.tierId) {
      setConfig((prev) => ({
        ...prev,
        customTierImages: {
          ...(prev.customTierImages || {}),
          [cropModalData.tierId!]: croppedDataUrl,
        },
      }));
      setHasUnsavedChanges(true);
      setToastMessage('Foto del tamaño de pastel actualizada con éxito.');
    } else if (cropModalData.portfolioId) {
      setConfig((prev) => {
        const items = (prev.portfolioItems && prev.portfolioItems.length > 0)
          ? prev.portfolioItems
          : DEFAULT_PORTFOLIO_ITEMS;
        return {
          ...prev,
          portfolioItems: items.map((i) =>
            i.id === cropModalData.portfolioId ? { ...i, image: croppedDataUrl } : i
          ),
        };
      });
      setHasUnsavedChanges(true);
      setToastMessage('Foto de referencia actualizada con éxito.');
    }
    setCropModalData({ isOpen: false, imageSrc: null });
  };

  // Scroll helpers
  const scrollToCatalog = () => {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCustomizer = () => {
    document.getElementById('arma-tu-pastel')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFAQ = () => {
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#f5f4f0] flex flex-col font-sans text-black pb-20 md:pb-0 ${isEditMode ? 'pt-16 sm:pt-14' : ''}`}>
      
      {/* Top Floating Live Edit Toolbar */}
      {isEditMode && (
        <LiveEditBar
          onSaveAndExit={handleSaveAndExitEditMode}
          onCancelAndExit={handleCancelAndExitEditMode}
          onAddNewProduct={() => setIsAddProductOpen(true)}
          onOpenQuickSettings={() => setIsQuickSettingsOpen(true)}
          onOpenBlocksOrganizer={() => setIsBlocksOrganizerOpen(true)}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}

      {/* Top Banner Announcement */}
      <BannerAnnouncement
        config={config}
        isEditMode={isEditMode}
        onUpdateAnnouncement={handleUpdateAnnouncement}
      />

      {/* Main Navbar */}
      <Navbar
        config={config}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onScrollToCustomizer={scrollToCustomizer}
        onScrollToAbout={scrollToAbout}
        onScrollToFAQ={scrollToFAQ}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {currentBlockOrder.map((blockId, index) => {
          const isHidden = currentHiddenBlocks.includes(blockId);
          const blockDef = BLOCK_DEFINITIONS[blockId] || { name: blockId, icon: '📦' };
          const isFirst = index === 0;
          const isLast = index === currentBlockOrder.length - 1;

          let blockContent: React.ReactNode = null;

          if (blockId === 'hero') {
            blockContent = (
              <Hero
                config={config}
                onExploreCatalog={scrollToCatalog}
                onScrollToCustomizer={scrollToCustomizer}
                isEditMode={isEditMode}
                onUpdateField={handleUpdateConfigField}
              />
            );
          } else if (blockId === 'catalog') {
            blockContent = (
              <section id="catalog-section" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black text-xs font-bold text-black mb-2">
                      <span>Catálogo Artesanal</span>
                    </div>
                    <h2 className="font-recoleta text-2xl sm:text-4xl font-bold text-black tracking-tight">
                      Menú de Postres & Antojos
                    </h2>
                    <p className="text-xs sm:text-sm text-[#222222] mt-0.5">
                      {products.length} especialidades horneadas al día en Toluca
                    </p>
                  </div>

                  {/* Clean Search Input */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar en el menú o sabor..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-btn border border-black text-base sm:text-xs focus:outline-none bg-white placeholder:text-black/50"
                    />
                    <Search className="w-4 h-4 text-black absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Sticky Categories Bar */}
                <div className="sticky top-16 sm:top-20 z-30 bg-[#f5f4f0]/95 backdrop-blur-xs py-2 mb-6 border-b border-black/10">
                  <CategoryFilter
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    counts={categoryCounts}
                  />
                </div>

                {/* Product Grid - 2 columns on mobile */}
                {filteredProducts.length === 0 && !isEditMode ? (
                  <div className="text-center py-16 bg-white rounded-card border border-black p-8 space-y-3">
                    <p className="font-bold text-sm text-black">
                      No encontramos postres con "{searchQuery}"
                    </p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
                      className="px-4 py-2 rounded-btn bg-[#99ffcc] text-black font-bold text-xs border border-black"
                    >
                      Ver todo el menú
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => {
                      const cartQty = cart
                        .filter((item) => item.product.id === product.id)
                        .reduce((sum, item) => sum + item.quantity, 0);

                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          quantityInCart={cartQty}
                          onAddToCart={handleAddToCart}
                          onUpdateQuantity={handleUpdateProductQuantity}
                          onOpenDetails={(p) => setSelectedProductForModal(p)}
                          isEditMode={isEditMode}
                          onUpdateProduct={handleUpdateProductInLiveEdit}
                          onDeleteProduct={handleDeleteProductInLiveEdit}
                          onToggleAvailability={handleToggleAvailabilityInLiveEdit}
                          onTriggerChangeImage={handleTriggerChangeImageInLiveEdit}
                        />
                      );
                    })}

                    {/* Add New Product Card in Live Edit Mode */}
                    {isEditMode && (
                      <div
                        onClick={() => setIsAddProductOpen(true)}
                        className="border-2 border-dashed border-black/40 hover:border-black rounded-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] cursor-pointer bg-white/60 hover:bg-[#99ffcc]/20 transition-all text-center group active:scale-98"
                      >
                        <div className="w-12 h-12 rounded-full bg-white border border-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                          <Plus className="w-6 h-6 text-black" />
                        </div>
                        <span className="font-bold text-sm text-black">
                          + Agregar Nuevo Postre
                        </span>
                        <span className="text-[11px] text-stone-500 mt-1 max-w-[180px]">
                          Toca aquí para añadir un nuevo postre directamente al menú
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          } else if (blockId === 'customizer') {
            blockContent = (
              <CakeCustomizer
                config={config}
                onAddToCartWithOptions={handleAddToCartWithOptions}
                onOpenCart={() => setIsCartOpen(true)}
                isEditMode={isEditMode}
                onTriggerChangeTierImage={handleTriggerChangeTierImage}
              />
            );
          } else if (blockId === 'portfolio') {
            blockContent = (
              <PortfolioRoll
                config={config}
                isEditMode={isEditMode}
                onUpdatePortfolioItem={handleUpdatePortfolioItem}
                onDeletePortfolioItem={handleDeletePortfolioItem}
                onAddPortfolioItem={handleAddPortfolioItem}
                onTriggerChangeImage={handleTriggerChangePortfolioImage}
              />
            );
          } else if (blockId === 'about') {
            blockContent = (
              <AboutBecca
                config={config}
                isEditMode={isEditMode}
                onUpdateField={handleUpdateConfigField}
              />
            );
          } else if (blockId === 'faq') {
            blockContent = <FAQSection config={config} />;
          }

          if (!blockContent) return null;

          return (
            <CanvasBlockWrapper
              key={blockId}
              blockId={blockId}
              blockName={blockDef.name}
              icon={<span>{blockDef.icon}</span>}
              isEditMode={isEditMode}
              isHidden={isHidden}
              isFirst={isFirst}
              isLast={isLast}
              onMoveUp={() => handleMoveBlock(index, 'up')}
              onMoveDown={() => handleMoveBlock(index, 'down')}
              onToggleHide={() => handleToggleHideBlock(blockId)}
            >
              {blockContent}
            </CanvasBlockWrapper>
          );
        })}
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onScrollToAbout={scrollToAbout}
        onScrollToFAQ={scrollToFAQ}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCartWithOptions={handleAddToCartWithOptions}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        config={config}
      />

      {/* The Admin Panel for Becca */}
      {isAdminOpen && (
        <AdminPanel
          products={products}
          config={config}
          onSaveProducts={handleSaveProducts}
          onSaveConfig={handleSaveConfig}
          onClose={() => setIsAdminOpen(false)}
          onResetDefaults={handleResetDefaults}
          onEnterLiveEdit={handleEnterLiveEdit}
        />
      )}

      {/* Quick Settings Modal in Live Edit */}
      <QuickSettingsModal
        isOpen={isQuickSettingsOpen}
        config={config}
        onSave={(newCfg) => {
          setConfig(newCfg);
          setHasUnsavedChanges(true);
        }}
        onClose={() => setIsQuickSettingsOpen(false)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Add Product Modal in Live Edit */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProductInLiveEdit}
      />

      {/* Blocks Organizer Modal in Live Edit */}
      <BlocksOrganizerModal
        isOpen={isBlocksOrganizerOpen}
        blockOrder={currentBlockOrder}
        hiddenBlocks={currentHiddenBlocks}
        blockDefinitions={BLOCK_DEFINITIONS}
        onMoveBlock={handleMoveBlock}
        onToggleHideBlock={handleToggleHideBlock}
        onClose={() => setIsBlocksOrganizerOpen(false)}
      />

      {/* Image Crop Modal in Live Edit */}
      <ImageCropModal
        isOpen={cropModalData.isOpen}
        imageSrc={cropModalData.imageSrc}
        productName={cropModalData.productName}
        onSave={handleSaveCroppedImageInLiveEdit}
        onCancel={() => setCropModalData({ isOpen: false, imageSrc: null })}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hatch Floating Mobile Cart Bar */}
      {cartCount > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-4 inset-x-4 z-40 animate-fadeIn">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[#99ffcc] text-black border border-black py-3.5 px-5 rounded-btn flex items-center justify-between font-bold text-sm active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                {cartCount}
              </div>
              <span>Ver Pedido</span>
            </div>

            <div className="flex items-center gap-1 text-black font-extrabold">
              <span>${cartTotal.toLocaleString('es-MX')} MXN</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
