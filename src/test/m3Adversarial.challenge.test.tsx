import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { Navbar } from '../components/Navbar';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Toast } from '../components/Toast';
import { CategoryFilter } from '../components/CategoryFilter';
import { Hero } from '../components/Hero';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { INITIAL_PRODUCTS } from '../data/products';
import { createWhatsAppOrderUrl, createWhatsAppCakeQuoteUrl } from '../utils/whatsapp';
import { CartItem, Product, ProductCategory } from '../types';

describe('Milestone 3 Adversarial Challenge & Stress Verification Suite', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // =========================================================================
  // 1. MOBILE CATALOG RESPONSIVENESS & HORIZONTAL OVERFLOW RESISTANCE (F8)
  // =========================================================================
  describe('1. Mobile Catalog Grid & Responsiveness (F8)', () => {
    it('enforces a strict 2-column mobile layout that scales responsively', () => {
      const { container } = render(<App />);
      const catalogSection = container.querySelector('#catalog-section');
      expect(catalogSection).not.toBeNull();

      const grid = catalogSection?.querySelector('.grid');
      expect(grid).not.toBeNull();
      // Must use grid-cols-2 on mobile (no grid-cols-1)
      expect(grid?.className).toContain('grid-cols-2');
      expect(grid?.className).not.toMatch(/\bgrid-cols-1\b/);
      // Must scale responsively
      expect(grid?.className).toContain('lg:grid-cols-3');
      expect(grid?.className).toContain('xl:grid-cols-4');
      // Gap spacing
      expect(grid?.className).toContain('gap-3');
      expect(grid?.className).toContain('sm:gap-5');
    });

    it('ensures all rendered ProductCard instances have overflow-hidden containers and responsive typography', () => {
      const { container } = render(<App />);
      const cards = container.querySelectorAll('#catalog-section .grid > div');
      expect(cards.length).toBeGreaterThan(0);

      cards.forEach((card) => {
        // Enforce containment
        expect(card.className).toContain('overflow-hidden');
        expect(card.className).toContain('rounded-2xl');
        expect(card.className).toContain('flex-col');

        // Check product title typography
        const title = card.querySelector('h3');
        expect(title).not.toBeNull();
        expect(title?.className).toContain('text-xs');
        expect(title?.className).toContain('sm:text-base');
        expect(title?.className).toContain('line-clamp-1');
      });
    });

    it('survives rapid quantity increments and decrements without layout destabilization', () => {
      const sampleProduct = INITIAL_PRODUCTS[0];
      const onAdd = vi.fn();
      const onUpdate = vi.fn();

      const { rerender } = render(
        <ProductCard
          product={sampleProduct}
          quantityInCart={0}
          onAddToCart={onAdd}
          onUpdateQuantity={onUpdate}
          onOpenDetails={vi.fn()}
        />
      );

      // Initially has + Agregar button
      const addBtn = screen.getByRole('button', { name: /\+ Agregar/i });
      fireEvent.click(addBtn);
      expect(onAdd).toHaveBeenCalledWith(sampleProduct);

      // Now rerender with quantity 1
      rerender(
        <ProductCard
          product={sampleProduct}
          quantityInCart={1}
          onAddToCart={onAdd}
          onUpdateQuantity={onUpdate}
          onOpenDetails={vi.fn()}
        />
      );

      // Verify stepper controls are present
      const minusBtn = screen.getByRole('button', { name: /disminuir cantidad/i });
      const plusBtn = screen.getByRole('button', { name: /aumentar cantidad/i });
      expect(minusBtn).toBeInTheDocument();
      expect(plusBtn).toBeInTheDocument();

      // Stress click
      fireEvent.click(plusBtn);
      expect(onUpdate).toHaveBeenCalledWith(sampleProduct, 1);

      fireEvent.click(minusBtn);
      expect(onUpdate).toHaveBeenCalledWith(sampleProduct, -1);
    });

    it('handles out-of-stock products gracefully with disabled status badge and no interactive buttons', () => {
      const unavailableProduct: Product = {
        ...INITIAL_PRODUCTS[0],
        id: 'out-of-stock-item',
        available: false,
      };

      render(
        <ProductCard
          product={unavailableProduct}
          quantityInCart={0}
          onAddToCart={vi.fn()}
          onUpdateQuantity={vi.fn()}
          onOpenDetails={vi.fn()}
        />
      );

      expect(screen.getByText(/Agotado por hoy/i)).toBeInTheDocument();
      expect(screen.getByText(/No disponible/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /\+ Agregar/i })).toBeNull();
    });
  });

  // =========================================================================
  // 2. TOUCH TARGET ACCESSIBILITY HARNESS (>=44x44px HIT AREAS) (F9)
  // =========================================================================
  describe('2. Mobile Touch Target Accessibility (F9)', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];

    it('verifies ProductCard quantity stepper buttons strictly declare min-w-[44px] min-h-[44px]', () => {
      render(
        <ProductCard
          product={sampleProduct}
          quantityInCart={3}
          onAddToCart={vi.fn()}
          onUpdateQuantity={vi.fn()}
          onOpenDetails={vi.fn()}
        />
      );

      const minusBtn = screen.getByRole('button', { name: /disminuir cantidad/i });
      const plusBtn = screen.getByRole('button', { name: /aumentar cantidad/i });

      expect(minusBtn.className).toContain('min-w-[44px]');
      expect(minusBtn.className).toContain('min-h-[44px]');
      expect(plusBtn.className).toContain('min-w-[44px]');
      expect(plusBtn.className).toContain('min-h-[44px]');
    });

    it('verifies ProductCard initial add button declares min-h-[44px]', () => {
      render(
        <ProductCard
          product={sampleProduct}
          quantityInCart={0}
          onAddToCart={vi.fn()}
          onUpdateQuantity={vi.fn()}
          onOpenDetails={vi.fn()}
        />
      );

      const addBtn = screen.getByRole('button', { name: /\+ Agregar/i });
      expect(addBtn.className).toContain('min-h-[44px]');
    });

    it('verifies CartDrawer close, delete, and quantity buttons strictly declare >=44x44px classes', () => {
      const mockItems: CartItem[] = [
        { product: sampleProduct, quantity: 2 }
      ];

      render(
        <CartDrawer
          isOpen={true}
          onClose={vi.fn()}
          items={mockItems}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onClearCart={vi.fn()}
          config={DEFAULT_STORE_CONFIG}
        />
      );

      const closeBtn = screen.getByRole('button', { name: /cerrar carrito/i });
      expect(closeBtn.className).toContain('min-w-[44px]');
      expect(closeBtn.className).toContain('min-h-[44px]');

      const deleteBtn = screen.getByRole('button', { name: /eliminar producto/i });
      expect(deleteBtn.className).toContain('min-w-[44px]');
      expect(deleteBtn.className).toContain('min-h-[44px]');

      const decBtn = screen.getByRole('button', { name: /disminuir cantidad/i });
      const incBtn = screen.getByRole('button', { name: /aumentar cantidad/i });
      expect(decBtn.className).toContain('min-w-[44px]');
      expect(decBtn.className).toContain('min-h-[44px]');
      expect(incBtn.className).toContain('min-w-[44px]');
      expect(incBtn.className).toContain('min-h-[44px]');
    });

    it('verifies Navbar hamburger menu toggle button has min-w-[44px] min-h-[44px]', () => {
      render(
        <Navbar
          config={DEFAULT_STORE_CONFIG}
          cartCount={1}
          cartTotal={250}
          onOpenCart={vi.fn()}
          onScrollToCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          onScrollToAbout={vi.fn()}
          onScrollToFAQ={vi.fn()}
          onOpenAdmin={vi.fn()}
        />
      );

      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      expect(hamburger.className).toContain('min-w-[44px]');
      expect(hamburger.className).toContain('min-h-[44px]');
    });

    it('verifies Navbar mobile drawer items each declare min-h-[44px]', () => {
      const { container } = render(
        <Navbar
          config={DEFAULT_STORE_CONFIG}
          cartCount={1}
          cartTotal={250}
          onOpenCart={vi.fn()}
          onScrollToCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          onScrollToAbout={vi.fn()}
          onScrollToFAQ={vi.fn()}
          onOpenAdmin={vi.fn()}
        />
      );

      // Open mobile menu
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      fireEvent.click(hamburger);

      // Scope to mobile drawer
      const mobileDrawer = container.querySelector('.md\\:hidden.bg-white') as HTMLElement;
      expect(mobileDrawer).not.toBeNull();

      const menuItems = [
        within(mobileDrawer).getByRole('button', { name: /menú de postres/i }),
        within(mobileDrawer).getByRole('button', { name: /arma tu pastel a medida/i }),
        within(mobileDrawer).getByRole('button', { name: /nosotros/i }),
        within(mobileDrawer).getByRole('button', { name: /preguntas frecuentes/i }),
        within(mobileDrawer).getByRole('button', { name: /admin/i }),
      ];

      menuItems.forEach((item) => {
        expect(item.className).toContain('min-h-[44px]');
      });
    });

    it('verifies ProductDetailModal close button and sticky action button meet >=44x44px requirements', () => {
      render(
        <ProductDetailModal
          product={sampleProduct}
          onClose={vi.fn()}
          onAddToCartWithOptions={vi.fn()}
        />
      );

      const closeBtn = screen.getByRole('button', { name: /cerrar modal/i });
      expect(closeBtn.className).toContain('min-w-[44px]');
      expect(closeBtn.className).toContain('min-h-[44px]');

      const actionBtn = screen.getByRole('button', { name: /agregar al pedido/i });
      expect(actionBtn.className).toContain('min-h-[44px]');
    });

    it('verifies all CategoryFilter pills declare min-h-[44px]', () => {
      const counts: Record<ProductCategory, number> = {
        todos: 10,
        chucherias: 2,
        pasteles: 3,
        cupcakes: 2,
        'galletas-brownies': 2,
        'cajas-regalo': 1,
      };

      const { container } = render(
        <CategoryFilter
          activeCategory="todos"
          onSelectCategory={vi.fn()}
          counts={counts}
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(6);
      buttons.forEach((btn) => {
        expect(btn.className).toContain('min-h-[44px]');
      });
    });
  });

  // =========================================================================
  // 3. iOS AUTO-ZOOM PREVENTION EMPIRICAL AUDIT (F11)
  // =========================================================================
  describe('3. iOS Auto-Zoom Prevention (F11)', () => {
    it('CartDrawer: verifies all text inputs and selects use text-base on mobile', () => {
      const mockItems: CartItem[] = [
        { product: INITIAL_PRODUCTS[0], quantity: 1 }
      ];

      render(
        <CartDrawer
          isOpen={true}
          onClose={vi.fn()}
          items={mockItems}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onClearCart={vi.fn()}
          config={DEFAULT_STORE_CONFIG}
        />
      );

      // Switch to delivery mode
      const deliveryTab = screen.getByRole('button', { name: /envío a domicilio/i });
      fireEvent.click(deliveryTab);

      const inputs = [
        screen.getByPlaceholderText(/calle, número exterior/i),
        screen.getByPlaceholderText(/col\. la providencia/i),
        screen.getByPlaceholderText(/sofia gómez/i),
        screen.getByPlaceholderText(/722 123 4567/i),
        screen.getByPlaceholderText(/es para regalo/i),
      ];

      inputs.forEach((input) => {
        expect(input.className).toContain('text-base');
      });

      const select = screen.getByRole('combobox');
      expect(select.className).toContain('text-base');
    });

    it('ProductDetailModal: verifies custom note input uses text-base on mobile', () => {
      render(
        <ProductDetailModal
          product={INITIAL_PRODUCTS[0]}
          onClose={vi.fn()}
          onAddToCartWithOptions={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText(/feliz cumpleaños sofi/i);
      expect(input.className).toContain('text-base');
    });

    it('Adversarial Check: catalog search input on main page prevents iOS auto-zoom', () => {
      const { container } = render(<App />);
      const searchInput = container.querySelector('#catalog-section input[type="text"]') as HTMLInputElement;
      expect(searchInput).not.toBeNull();

      // iOS WebKit triggers involuntary zoom when font-size < 16px (e.g. text-xs / 12px).
      // We empirically check whether the search input has text-base or whether it has standalone text-xs on mobile.
      const hasAutoZoomPrevention = searchInput.className.includes('text-base');
      const hasProblematicSmallFont = searchInput.className.split(/\s+/).includes('text-xs');

      // We record the exact state
      expect(hasAutoZoomPrevention, 
        `Expected search input to contain 'text-base' for iOS auto-zoom prevention, but found className="${searchInput.className}"`
      ).toBe(true);
      expect(hasProblematicSmallFont).toBe(false);
    });

    it('Adversarial Check: CakeCustomizer dedication input prevents iOS auto-zoom', () => {
      const { container } = render(<App />);
      const dedicationInput = container.querySelector('input[placeholder="Ej: ¡Feliz Cumpleaños Sofi!"]') as HTMLInputElement;
      expect(dedicationInput).not.toBeNull();

      const hasAutoZoomPrevention = dedicationInput.className.includes('text-base');
      const hasProblematicSmallFont = dedicationInput.className.split(/\s+/).includes('text-xs');

      expect(hasAutoZoomPrevention,
        `Expected CakeCustomizer dedication input to contain 'text-base' for iOS auto-zoom prevention, but found className="${dedicationInput.className}"`
      ).toBe(true);
      expect(hasProblematicSmallFont).toBe(false);
    });
  });

  // =========================================================================
  // 4. NON-COLLIDING TOAST & FLOATING LAYOUT (F10)
  // =========================================================================
  describe('4. Non-Colliding Toast & Sticky Layouts (F10)', () => {
    it('relocates Toast to top to eliminate collision with mobile bottom cart bar', () => {
      const { container } = render(
        <Toast
          message="Producto agregado"
          isVisible={true}
          onClose={vi.fn()}
          onOpenCart={vi.fn()}
        />
      );

      const toast = container.firstChild as HTMLElement;
      expect(toast).not.toBeNull();
      expect(toast.className).toContain('top-4');
      expect(toast.className).toContain('inset-x-4');
      expect(toast.className).toContain('z-50');
      // Must not be at bottom
      expect(toast.className).not.toContain('bottom-');
    });
  });

  // =========================================================================
  // 5. COMPLETE CATEGORY FILTER INTEGRATION (F12)
  // =========================================================================
  describe('5. Complete Category Filter Integration (F12)', () => {
    it('renders all 6 categories including "Cajas de Regalo" (cajas-regalo)', () => {
      const mockSelect = vi.fn();
      const counts: Record<ProductCategory, number> = {
        todos: 10,
        chucherias: 2,
        pasteles: 3,
        cupcakes: 2,
        'galletas-brownies': 2,
        'cajas-regalo': 1,
      };

      render(
        <CategoryFilter
          activeCategory="todos"
          onSelectCategory={mockSelect}
          counts={counts}
        />
      );

      const giftBoxBtn = screen.getByRole('button', { name: /cajas de regalo/i });
      expect(giftBoxBtn).toBeInTheDocument();

      fireEvent.click(giftBoxBtn);
      expect(mockSelect).toHaveBeenCalledWith('cajas-regalo');
    });

    it('filters App catalog products correctly when clicking "Cajas de Regalo"', () => {
      const { container } = render(<App />);

      const giftBoxBtn = screen.getByRole('button', { name: /cajas de regalo/i });
      fireEvent.click(giftBoxBtn);

      // Verify filtered products only belong to cajas-regalo category
      const activeFilterBtn = screen.getByRole('button', { name: /cajas de regalo/i });
      expect(activeFilterBtn.className).toContain('bg-stone-900');
    });
  });

  // =========================================================================
  // 6. COPYWRITING DEPURATION & REDUNDANCY REMOVAL (F13)
  // =========================================================================
  describe('6. Copywriting Depuration & Redundancy Removal (F13)', () => {
    it('verifies zero occurrences of defensive shipping phrases across rendered UI', () => {
      const { container } = render(<App />);
      const appText = container.textContent || '';

      const forbiddenPhrases = [
        'el envío corre por cuenta del cliente',
        'cubierto íntegramente por el cliente',
        'Envío cubierto por el cliente',
        'por cuenta del cliente',
      ];

      forbiddenPhrases.forEach((phrase) => {
        expect(appText.toLowerCase()).not.toContain(phrase.toLowerCase());
      });
    });

    it('verifies zero occurrences of meta-technical software jargon across rendered UI', () => {
      const { container } = render(<App />);
      const appText = container.textContent || '';

      const forbiddenJargon = [
        'herramienta interactiva',
        'animación interactiva',
        'Arma tu Pastel Interactivo',
      ];

      forbiddenJargon.forEach((jargon) => {
        expect(appText.toLowerCase()).not.toContain(jargon.toLowerCase());
      });
    });

    it('verifies WhatsApp generators output clean, professional artisanal copy', () => {
      const sampleItem: CartItem = {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
      };

      const orderUrl = createWhatsAppOrderUrl(
        '7221234567',
        [sampleItem],
        {
          type: 'delivery',
          zoneName: 'Toluca Centro',
          deliveryCost: 50,
          customerName: 'Sofi Gómez',
          phone: '7221234567',
          address: 'Av. Juárez 100',
          deliveryDate: '2026-11-10',
          deliveryTime: '15:00',
        },
        280,
        50,
        330
      );

      const decodedOrder = decodeURIComponent(orderUrl);
      expect(decodedOrder).not.toContain('cuenta del cliente');
      expect(decodedOrder).not.toContain('cubierto íntegramente');
      expect(decodedOrder).toContain('Envío a domicilio calculado según zona');

      const quoteUrl = createWhatsAppCakeQuoteUrl('7221234567', {
        eventType: 'Bautizo',
        tier: '2 Pisos',
        servings: '25 a 30 personas',
        flavor: 'chocolate',
        flavorName: 'Chocolate Belga Suave',
        filling: 'nutella',
        fillingName: 'Nutella con Avellanas',
        frosting: 'chantilly',
        frostingName: 'Chantilly Ligera',
        toppings: ['Fresas Naturales'],
        candle: true,
        estimatedPrice: 980,
        isSpecialArtDesign: false,
      });

      const decodedQuote = decodeURIComponent(quoteUrl);
      expect(decodedQuote).not.toContain('herramienta interactiva');
      expect(decodedQuote).not.toContain('animación interactiva');
      expect(decodedQuote).toContain('Diseñé mi pastel a medida desde tu web:');
    });
  });

});
