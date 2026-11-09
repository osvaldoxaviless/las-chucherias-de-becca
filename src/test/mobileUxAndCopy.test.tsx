import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('Milestone 3: Mobile-First UX, Touch Ergonomics & Copywriting Synthesis', () => {

  // =========================================================================
  // F8: 2-Column Responsive Mobile Catalog Grid
  // =========================================================================
  describe('F8: 2-Column Responsive Mobile Catalog Grid', () => {
    it('configures App catalog grid with 2 columns on mobile and responsive scaling', () => {
      const { container } = render(<App />);
      // Locate the product catalog grid container
      const grid = container.querySelector('.grid.grid-cols-2');
      expect(grid).not.toBeNull();
      expect(grid?.className).toContain('grid-cols-2');
      expect(grid?.className).toContain('gap-3');
      expect(grid?.className).toContain('sm:gap-5');
      expect(grid?.className).toContain('lg:grid-cols-3');
      expect(grid?.className).toContain('xl:grid-cols-4');
      // Must NOT have single column on mobile
      expect(grid?.className).not.toContain('grid-cols-1 sm:grid-cols-2');
    });

    it('renders ProductCard with compact mobile padding and responsive typography', () => {
      const sampleProduct = INITIAL_PRODUCTS[0];
      const { container } = render(
        <ProductCard
          product={sampleProduct}
          quantityInCart={0}
          onAddToCart={vi.fn()}
          onUpdateQuantity={vi.fn()}
          onOpenDetails={vi.fn()}
        />
      );

      const infoSection = container.querySelector('.p-3.sm\\:p-4');
      expect(infoSection).not.toBeNull();

      // Card title has responsive text sizing
      const title = screen.getByText(sampleProduct.name);
      expect(title.className).toContain('text-xs');
      expect(title.className).toContain('sm:text-base');
    });
  });

  // =========================================================================
  // F9: Mobile Touch Target Accessibility (>=44x44px minimum hit area)
  // =========================================================================
  describe('F9: Mobile Touch Target Accessibility (>=44x44px hit-areas)', () => {
    const sampleProduct = INITIAL_PRODUCTS[0];

    it('ProductCard: "+ Agregar" button has >=44px height (min-h-[44px]) when quantity is 0', () => {
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

    it('ProductCard: quantity "+" and "-" stepper buttons have >=44x44px hit areas when quantity > 0', () => {
      render(
        <ProductCard
          product={sampleProduct}
          quantityInCart={2}
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

    it('CartDrawer: close button (X), delete button, and quantity buttons meet >=44x44px requirement', () => {
      const mockItems: CartItem[] = [
        { product: sampleProduct, quantity: 1 }
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

      // Close button
      const closeBtn = screen.getByRole('button', { name: /cerrar carrito/i });
      expect(closeBtn.className).toContain('min-w-[44px]');
      expect(closeBtn.className).toContain('min-h-[44px]');

      // Delete item button
      const deleteBtn = screen.getByRole('button', { name: /eliminar producto/i });
      expect(deleteBtn.className).toContain('min-w-[44px]');
      expect(deleteBtn.className).toContain('min-h-[44px]');

      // Cart quantity stepper buttons
      const decBtn = screen.getByRole('button', { name: /disminuir cantidad/i });
      const incBtn = screen.getByRole('button', { name: /aumentar cantidad/i });
      expect(decBtn.className).toContain('min-w-[44px]');
      expect(decBtn.className).toContain('min-h-[44px]');
      expect(incBtn.className).toContain('min-w-[44px]');
      expect(incBtn.className).toContain('min-h-[44px]');
    });

    it('Navbar: mobile menu toggle button meets >=44x44px hit area', () => {
      render(
        <Navbar
          config={DEFAULT_STORE_CONFIG}
          cartCount={0}
          cartTotal={0}
          onOpenCart={vi.fn()}
          onScrollToCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          onScrollToAbout={vi.fn()}
          onScrollToFAQ={vi.fn()}
          onOpenAdmin={vi.fn()}
        />
      );

      const menuToggle = screen.getByRole('button', { name: /abrir menú/i });
      expect(menuToggle.className).toContain('min-w-[44px]');
      expect(menuToggle.className).toContain('min-h-[44px]');
    });

    it('ProductDetailModal: close button (X) is >=44x44px and add-to-cart button is sticky with min-h-[44px]', () => {
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

      const addBtn = screen.getByRole('button', { name: /agregar al pedido/i });
      expect(addBtn.className).toContain('min-h-[44px]');

      // Sticky wrapper
      const stickyWrapper = addBtn.parentElement;
      expect(stickyWrapper?.className).toContain('sticky');
      expect(stickyWrapper?.className).toContain('bottom-0');
    });
  });

  // =========================================================================
  // F10: Non-Colliding Toast & Sticky Layouts
  // =========================================================================
  describe('F10: Non-Colliding Toast Notification', () => {
    it('relocates Toast to top to eliminate collision with mobile floating bottom cart bar', () => {
      const { container } = render(
        <Toast
          message="Producto agregado"
          isVisible={true}
          onClose={vi.fn()}
          onOpenCart={vi.fn()}
        />
      );

      const toastRoot = container.firstChild as HTMLElement;
      expect(toastRoot).not.toBeNull();
      expect(toastRoot.className).toContain('top-4');
      expect(toastRoot.className).toContain('inset-x-4');
      expect(toastRoot.className).toContain('sm:top-6');
      expect(toastRoot.className).toContain('sm:right-6');
      // Must NOT be pinned to bottom
      expect(toastRoot.className).not.toContain('bottom-6 right-6');
    });
  });

  // =========================================================================
  // F11: iOS Mobile Auto-Zoom Prevention
  // =========================================================================
  describe('F11: iOS Mobile Auto-Zoom Prevention (16px text-base font size on mobile)', () => {
    it('applies text-base sm:text-xs to all checkout form fields in CartDrawer', () => {
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

      // Switch to delivery mode to reveal address fields
      const deliveryTab = screen.getByRole('button', { name: /envío a domicilio/i });
      fireEvent.click(deliveryTab);

      const addressInput = screen.getByPlaceholderText(/calle, número exterior/i);
      const neighborhoodInput = screen.getByPlaceholderText(/col\. la providencia/i);
      const nameInput = screen.getByPlaceholderText(/sofia gómez/i);
      const phoneInput = screen.getByPlaceholderText(/722 123 4567/i);
      const notesInput = screen.getByPlaceholderText(/es para regalo/i);

      expect(addressInput.className).toContain('text-base');
      expect(neighborhoodInput.className).toContain('text-base');
      expect(nameInput.className).toContain('text-base');
      expect(phoneInput.className).toContain('text-base');
      expect(notesInput.className).toContain('text-base');
    });

    it('applies text-base sm:text-xs to dedication note field in ProductDetailModal', () => {
      render(
        <ProductDetailModal
          product={INITIAL_PRODUCTS[0]}
          onClose={vi.fn()}
          onAddToCartWithOptions={vi.fn()}
        />
      );

      const noteInput = screen.getByPlaceholderText(/feliz cumpleaños sofi/i);
      expect(noteInput.className).toContain('text-base');
    });
  });

  // =========================================================================
  // F12: Complete Category Filter
  // =========================================================================
  describe('F12: Complete Category Filter', () => {
    it('includes "Cajas de Regalo" (cajas-regalo) tab and dispatches on select', () => {
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
      expect(giftBoxBtn.className).toContain('min-h-[44px]');

      fireEvent.click(giftBoxBtn);
      expect(mockSelect).toHaveBeenCalledWith('cajas-regalo');
    });
  });

  // =========================================================================
  // F13: Copywriting Depuration & Redundancy Removal
  // =========================================================================
  describe('F13: Copywriting Depuration & Redundancy Removal', () => {
    it('Hero.tsx: contains natural shipping copy and no defensive warning phrases', () => {
      const { container } = render(
        <Hero
          config={DEFAULT_STORE_CONFIG}
          onExploreCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
        />
      );

      const text = container.textContent || '';
      expect(text).not.toContain('envío cubierto por el cliente');
      expect(text).not.toContain('cuenta del cliente');
      expect(text).toContain('envío calculado según zona');
    });

    it('CartDrawer.tsx: removes defensive warnings and uses transparent breakdown', () => {
      const mockItems: CartItem[] = [
        { product: INITIAL_PRODUCTS[0], quantity: 1 }
      ];

      const { container } = render(
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

      const text = container.textContent || '';
      expect(text).not.toContain('Envío por cuenta del cliente');
      expect(text).not.toContain('cubierto íntegramente por el cliente');
      expect(text).not.toContain('Envío cubierto por el cliente');
      expect(text).toContain('Envío calculado según zona');
    });

    it('Navbar.tsx: replaces technical jargon "Interactivo" with appetizing boutique copy', () => {
      render(
        <Navbar
          config={DEFAULT_STORE_CONFIG}
          cartCount={0}
          cartTotal={0}
          onOpenCart={vi.fn()}
          onScrollToCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          onScrollToAbout={vi.fn()}
          onScrollToFAQ={vi.fn()}
          onOpenAdmin={vi.fn()}
        />
      );

      // Open mobile menu to view mobile links
      const menuToggle = screen.getByRole('button', { name: /abrir menú/i });
      fireEvent.click(menuToggle);

      expect(screen.queryByText(/Arma tu Pastel Interactivo/i)).toBeNull();
      expect(screen.getByText(/Arma tu Pastel a Medida/i)).toBeInTheDocument();
    });

    it('whatsapp.ts: WhatsApp order and quote generators have zero defensive warnings and zero technical jargon', () => {
      const mockItems: CartItem[] = [
        { product: INITIAL_PRODUCTS[0], quantity: 1 }
      ];
      const delivery = {
        type: 'delivery' as const,
        zoneName: 'Toluca Centro',
        deliveryCost: 50,
        customerName: 'Sofi',
        phone: '7221234567',
        deliveryDate: '2026-12-01',
        deliveryTime: 'Tarde',
        address: 'Calle Hidalgo 123',
      };

      const orderUrl = createWhatsAppOrderUrl(
        '7221234567',
        mockItems,
        delivery,
        300,
        50,
        350
      );
      const decodedOrder = decodeURIComponent(orderUrl);
      expect(decodedOrder).not.toContain('cuenta del cliente');
      expect(decodedOrder).not.toContain('cubierto');
      expect(decodedOrder).toContain('calculado según zona');

      const quoteUrl = createWhatsAppCakeQuoteUrl('7221234567', {
        eventType: 'Cumpleaños',
        tier: '1 Piso',
        servings: '10',
        flavor: 'vainilla',
        flavorName: 'Vainilla',
        filling: 'fresa',
        fillingName: 'Fresa',
        frosting: 'crema',
        frostingName: 'Crema',
        toppings: [],
        candle: false,
        estimatedPrice: 400,
        isSpecialArtDesign: false,
      });
      const decodedQuote = decodeURIComponent(quoteUrl);
      expect(decodedQuote).not.toContain('herramienta interactiva');
      expect(decodedQuote).not.toContain('animación interactiva');
      expect(decodedQuote).toContain('Diseñé mi pastel a medida desde tu web:');
    });
  });

});
