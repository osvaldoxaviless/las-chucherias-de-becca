import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { CakeCustomizer, TIER_OPTIONS, FILLING_OPTIONS, TOPPING_OPTIONS } from '../components/CakeCustomizer';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { INITIAL_PRODUCTS } from '../data/products';

describe('Milestone 4: End-to-End Integrity & Adversarial Coverage Hardening', () => {
  let windowOpenSpy: any;

  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  // =========================================================================
  // 1. INSTAGRAM MOBILE SHOPPER JOURNEY (COMPLETE E2E)
  // =========================================================================
  describe('1. Instagram Mobile Shopper Journey (Complete E2E)', () => {
    it('executes full mobile flow: 2-column catalog navigation -> product modal -> cake customizer -> mobile sticky bar -> cart drawer -> WhatsApp order URL', () => {
      const { container } = render(<App />);

      // Step A: Mobile Catalog Navigation in 2 columns
      const catalogSection = container.querySelector('#catalog-section');
      expect(catalogSection).not.toBeNull();
      const productGrid = catalogSection?.querySelector('.grid');
      expect(productGrid?.className).toContain('grid-cols-2');
      expect(productGrid?.className).toContain('sm:gap-5');

      // Step B: Category Filtering
      const giftBoxesTab = within(catalogSection as HTMLElement).getByRole('button', { name: /cajas de regalo/i });
      fireEvent.click(giftBoxesTab);
      // Verify category filter switches
      expect(giftBoxesTab.className).toContain('bg-stone-900');

      // Switch back to 'todos'
      const allTab = within(catalogSection as HTMLElement).getByRole('button', { name: /todos/i });
      fireEvent.click(allTab);

      // Step C: Open Product Modal and add to order with options
      const firstCard = container.querySelector('#catalog-section .grid > div') as HTMLElement;
      expect(firstCard).not.toBeNull();
      // Click card image to trigger modal
      const cardImage = firstCard.querySelector('img');
      expect(cardImage).not.toBeNull();
      fireEvent.click(cardImage!);

      // Verify product detail modal opened
      const modalAddButton = screen.getByRole('button', { name: /agregar al pedido —/i });
      expect(modalAddButton).toBeInTheDocument();

      // Add dedication note in modal
      const dedicationInput = screen.getByPlaceholderText(/Ej: Feliz Cumpleaños Sofi/i);
      fireEvent.change(dedicationInput, { target: { value: 'Para Becca con cariño' } });

      // Click add to order in modal
      fireEvent.click(modalAddButton);

      // Step D: Configure Cake Customizer ("Arma tu pastel")
      const customizerSection = container.querySelector('#arma-tu-pastel') as HTMLElement;
      expect(customizerSection).not.toBeNull();

      // Select tier: 2 Pisos Celebración (base $980)
      const doubleTierBtn = within(customizerSection).getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleTierBtn);

      // Select filling: Maracuyá Cítrico (+$30)
      const maracuyaBtn = within(customizerSection).getByRole('button', { name: /Maracuyá Cítrico/i });
      fireEvent.click(maracuyaBtn);

      // Select frosting: Ganache Chocolate
      const ganacheBtn = within(customizerSection).getByRole('button', { name: /Ganache Chocolate/i });
      fireEvent.click(ganacheBtn);

      // Set custom dedication text in customizer
      const cakePlaqueInput = within(customizerSection).getByDisplayValue('¡Feliz Cumple!');
      fireEvent.change(cakePlaqueInput, { target: { value: 'Boda Becca & Alex' } });

      // Toggle dual view mode (Vista Exterior <-> Corte en Capas)
      const cutawayBtn = within(customizerSection).getByRole('button', { name: /corte en capas/i });
      fireEvent.click(cutawayBtn);
      // Cutaway tier 2 should be present for double tier
      expect(container.querySelector('#cutaway-tier2')).not.toBeNull();

      const exteriorBtn = within(customizerSection).getByRole('button', { name: /vista exterior/i });
      fireEvent.click(exteriorBtn);
      expect(container.querySelector('#exterior-tier-2')).not.toBeNull();

      // Step E: Mobile Sticky Action Bar verification & trigger
      const stickyBar = screen.getByTestId('mobile-sticky-bar');
      expect(stickyBar).toBeInTheDocument();
      // Price calculation: 2 Pisos ($980) + Maracuyá ($30) + default toppings (Fresas $35 + Sprinkles $20 = $55) + candle ($15) = $1,080
      expect(stickyBar.textContent).toContain('2 Pisos Celebración');
      expect(stickyBar.textContent).toContain('$1,080');

      // Click mobile sticky action bar trigger
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      // Step F: Cart Drawer opens with 2 items (catalog item + custom cake)
      expect(screen.getByText(/Tu Pedido \(2\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Pastel Personalizado \(2 Pisos Celebración\)/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/Boda Becca & Alex/i).length).toBeGreaterThanOrEqual(1);

      // Step G: Complete Delivery & Checkout Form in Cart Drawer
      const deliveryBtn = screen.getByRole('button', { name: /Envío a Domicilio/i });
      fireEvent.click(deliveryBtn);

      // Select zone (Metepec +$70)
      const metepecRadio = screen.getByLabelText(/Metepec \/ Providencia \/ San Carlos/i);
      fireEvent.click(metepecRadio);

      // Fill customer contact and address
      const nameField = screen.getByPlaceholderText(/Ej: Sofia Gómez/i);
      fireEvent.change(nameField, { target: { value: 'Mariana Valdés' } });

      const phoneField = screen.getByPlaceholderText(/Ej: 722 123 4567/i);
      fireEvent.change(phoneField, { target: { value: '7223334455' } });

      const addressField = screen.getByPlaceholderText(/Calle, número exterior e interior/i);
      fireEvent.change(addressField, { target: { value: 'Av. Tecnológico 1500' } });

      const neighborhoodField = screen.getByPlaceholderText(/Ej: Col\. La Providencia/i);
      fireEvent.change(neighborhoodField, { target: { value: 'La Providencia' } });

      const notesField = screen.getByPlaceholderText(/Ej: Es para regalo/i);
      fireEvent.change(notesField, { target: { value: 'Entregar antes de las 4 PM' } });

      // Step H: Submit Order via WhatsApp Link
      const sendWhatsAppBtn = screen.getByRole('button', { name: /Confirmar y Enviar Pedido a WhatsApp/i });
      fireEvent.click(sendWhatsAppBtn);

      // Verify window.open was called with valid WhatsApp URL
      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const generatedUrl = windowOpenSpy.mock.calls[0][0];
      expect(generatedUrl).toMatch(new RegExp(`^https://wa\\.me/${DEFAULT_STORE_CONFIG.whatsappNumber}\\?text=`));

      const decodedText = decodeURIComponent(generatedUrl);
      expect(decodedText).toContain('¡HOLA, LAS CHUCHERÍAS DE BECCA!');
      expect(decodedText).toContain('Mariana Valdés');
      expect(decodedText).toContain('7223334455');
      expect(decodedText).toContain('Av. Tecnológico 1500');
      expect(decodedText).toContain('La Providencia');
      expect(decodedText).toContain('Entregar antes de las 4 PM');
      expect(decodedText).toContain('2 Pisos Celebración');
      expect(decodedText).toContain('*Costo de envío (Metepec / Providencia / San Carlos):* $70 MXN');
      expect(decodedText).toContain('TOTAL A PAGAR: $1,235 MXN');
    });
  });

  // =========================================================================
  // 2. ADMIN SHOP OWNER WORKFLOW (AUTHENTICATION, CACHE RESILIENCE & SYNC)
  // =========================================================================
  describe('2. Admin Shop Owner Workflow', () => {
    it('handles clean cache and unlocks immediately with PIN 2026', () => {
      localStorage.clear();
      render(<App />);

      // Open admin via footer trigger
      const adminTrigger = screen.getByRole('button', { name: /Acceso Becca \(Admin\)/i });
      fireEvent.click(adminTrigger);

      // Screen is locked
      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();

      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Authenticated successfully
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('handles legacy corrupted cache ({ adminPin: undefined }) and unlocks with 2026', () => {
      localStorage.setItem('chuches_config', JSON.stringify({
        storeName: 'Legacy Becca',
        adminPin: undefined,
      }));

      render(<App />);

      const adminTrigger = screen.getByRole('button', { name: /Acceso Becca \(Admin\)/i });
      fireEvent.click(adminTrigger);

      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('handles whitespace PIN input ("   2026   ") and logs in cleanly', () => {
      render(<App />);

      const adminTrigger = screen.getByRole('button', { name: /Acceso Becca \(Admin\)/i });
      fireEvent.click(adminTrigger);

      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '   2026   ' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('updates store business info (name, phone, address, city) and propagates to cart and customizer', () => {
      const { container } = render(<App />);

      // Step A: Log into Admin
      const adminTrigger = screen.getByRole('button', { name: /Acceso Becca \(Admin\)/i });
      fireEvent.click(adminTrigger);

      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Step B: Navigate to Settings tab
      const settingsTab = screen.getByRole('button', { name: /ajustes de tienda/i });
      fireEvent.click(settingsTab);

      // Step C: Update fields
      const storeNameInput = screen.getByDisplayValue('Las chucherías de Becca');
      fireEvent.change(storeNameInput, { target: { value: 'Las chucherías de Becca Atelier' } });

      const whatsappInput = screen.getByDisplayValue(DEFAULT_STORE_CONFIG.whatsappNumber);
      fireEvent.change(whatsappInput, { target: { value: '527229998888' } });

      const addressInput = screen.getByDisplayValue('El Oro 112, Toluca, Estado de México');
      fireEvent.change(addressInput, { target: { value: 'Av. Colón 450, Toluca' } });

      // Save settings
      const saveBtn = screen.getByRole('button', { name: /guardar ajustes/i });
      fireEvent.click(saveBtn);

      // Verify inline feedback
      expect(screen.getByText(/¡Ajustes guardados correctamente!/i)).toBeInTheDocument();

      // Close admin panel
      const closeAdminBtn = screen.getByTitle('Volver a la tienda');
      fireEvent.click(closeAdminBtn);

      // Step D: Verify propagation to CakeCustomizer Special Quote WhatsApp link
      const specialQuoteBtn = screen.getByRole('button', { name: /cotizar diseño especial por whatsapp/i });
      fireEvent.click(specialQuoteBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const customizerWhatsAppUrl = windowOpenSpy.mock.calls[0][0];
      // Clean phone number should match new whatsapp number 527229998888
      expect(customizerWhatsAppUrl).toContain('wa.me/527229998888');

      // Step E: Verify propagation to CartDrawer Checkout
      // Add a product to cart
      const addFirstProduct = container.querySelector('#catalog-section .grid > div button') as HTMLButtonElement;
      fireEvent.click(addFirstProduct);

      // Open Cart
      const cartIconBtn = screen.getByRole('button', { name: /abrir carrito/i });
      fireEvent.click(cartIconBtn);

      // Fill name and checkout
      const customerNameInput = screen.getByPlaceholderText(/Ej: Sofia Gómez/i);
      fireEvent.change(customerNameInput, { target: { value: 'Carlos Mendoza' } });

      const cartCheckoutBtn = screen.getByRole('button', { name: /Confirmar y Enviar Pedido a WhatsApp/i });
      fireEvent.click(cartCheckoutBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(2);
      const cartWhatsAppUrl = windowOpenSpy.mock.calls[1][0];
      expect(cartWhatsAppUrl).toContain('wa.me/527229998888');
    });
  });

  // =========================================================================
  // 3. EXHAUSTIVE BOUNDARY & EDGE CASE VERIFICATIONS
  // =========================================================================
  describe('3. Exhaustive Boundary & Edge Case Verifications', () => {
    it('verifies boundary prices for custom cake: minimum ($260) and maximum ($1,185)', () => {
      const mockAddToCart = vi.fn();
      render(
        <CakeCustomizer
          config={DEFAULT_STORE_CONFIG}
          onAddToCartWithOptions={mockAddToCart}
          onOpenCart={vi.fn()}
        />
      );

      // 1. Configure absolute minimum:
      // Bento ($260) + $0 filling (Nutella) + 0 toppings + no candle
      const bentoTier = screen.getByRole('button', { name: /Bento Cake Mini/i });
      fireEvent.click(bentoTier);

      const nutellaFilling = screen.getByRole('button', { name: /Nutella & Avellanas/i });
      fireEvent.click(nutellaFilling);

      // Uncheck initial toppings (strawberries & sprinkles)
      const strawberriesBtn = screen.getByRole('button', { name: /Fresas & Moras/i });
      fireEvent.click(strawberriesBtn);
      const sprinklesBtn = screen.getByRole('button', { name: /Chispas Arcoíris/i });
      fireEvent.click(sprinklesBtn);

      // Uncheck candle
      const candleBtn = screen.getByRole('button', { name: /Velita/i });
      fireEvent.click(candleBtn);

      // Check mobile sticky bar price
      const stickyBar = screen.getByTestId('mobile-sticky-bar');
      expect(stickyBar.textContent).toContain('$260');

      // Click Add to Cart and verify payload price
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      expect(mockAddToCart).toHaveBeenLastCalledWith(
        expect.objectContaining({ price: 260 }),
        expect.anything(),
        expect.anything()
      );

      // 2. Configure absolute maximum:
      // 2 Pisos ($980) + Maracuyá ($30) + all 5 toppings ($160) + candle ($15) = $1,185
      const doubleTier = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleTier);

      const maracuyaFilling = screen.getByRole('button', { name: /Maracuyá Cítrico/i });
      fireEvent.click(maracuyaFilling);

      // Turn on all 5 toppings
      TOPPING_OPTIONS.forEach((t) => {
        const topBtn = screen.getByRole('button', { name: new RegExp(t.name, 'i') });
        if (!topBtn.className.includes('border-rose-500')) {
          fireEvent.click(topBtn);
        }
      });

      // Turn on candle (currently off)
      fireEvent.click(candleBtn);

      expect(stickyBar.textContent).toContain('$1,185');

      fireEvent.click(mobileAddBtn);
      expect(mockAddToCart).toHaveBeenLastCalledWith(
        expect.objectContaining({ price: 1185 }),
        expect.anything(),
        expect.anything()
      );
    });

    it('verifies all 6 category filters function without errors and preserve empty state handling', () => {
      const { container } = render(<App />);
      const catalogSection = container.querySelector('#catalog-section') as HTMLElement;
      expect(catalogSection).not.toBeNull();

      const categories = [
        { label: /Todos/i, expectedMin: 1 },
        { label: /Fresas, Uvas & Manzanas/i, expectedMin: 1 },
        { label: /Pasteles & Bento Cakes/i, expectedMin: 1 },
        { label: /Cupcakes/i, expectedMin: 1 },
        { label: /Galletas & Brownies/i, expectedMin: 1 },
        { label: /Cajas de Regalo/i, expectedMin: 1 },
      ];

      categories.forEach(({ label, expectedMin }) => {
        const filterBtn = within(catalogSection).getByRole('button', { name: label });
        fireEvent.click(filterBtn);
        expect(filterBtn.className).toContain('bg-stone-900');

        const displayedCards = container.querySelectorAll('#catalog-section .grid > div');
        expect(displayedCards.length).toBeGreaterThanOrEqual(expectedMin);
      });

      // Search with non-matching query triggers resilient empty state
      const searchInput = screen.getByPlaceholderText(/buscar en el menú/i);
      fireEvent.change(searchInput, { target: { value: 'producto_inexistente_xyz_123' } });

      expect(screen.getByText(/No encontramos postres con "producto_inexistente_xyz_123"/i)).toBeInTheDocument();
      const resetSearchBtn = screen.getByRole('button', { name: /ver todo el menú/i });
      expect(resetSearchBtn).toBeInTheDocument();

      fireEvent.click(resetSearchBtn);
      expect(searchInput).toHaveValue('');
    });

    it('verifies absence of horizontal overflows and enforces touch target ergonomics (>=44px)', () => {
      const { container } = render(<App />);

      // Verify no prohibited layout overflow classes on root container
      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv.className).not.toContain('overflow-x-scroll');
      expect(rootDiv.className).not.toContain('overflow-x-auto');

      // Verify mobile inputs use text-base on mobile to avoid iOS WebKit auto-zoom
      const inputs = container.querySelectorAll('input[type="text"], input[type="password"]');
      inputs.forEach((input) => {
        const cls = input.className;
        if (cls.includes('sm:text-xs') || cls.includes('sm:text-sm')) {
          expect(cls).toContain('text-base');
        }
      });

      // Verify interactive action buttons have at least 44px min-height or padding ergonomics
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      expect(mobileAddBtn.className).toMatch(/min-h-\[44px\]|py-2\.5|py-3/);
    });
  });

});
