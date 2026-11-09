import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  CakeCustomizer, 
  TIER_OPTIONS, 
  FLAVOR_OPTIONS, 
  FILLING_OPTIONS, 
  FROSTING_OPTIONS, 
  TOPPING_OPTIONS 
} from '../components/CakeCustomizer';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { createWhatsAppCakeQuoteUrl } from '../utils/whatsapp';

describe('Milestone 2 Adversarial Stress Suite: CakeCustomizer Architecture & Resilience', () => {
  const mockAddToCartWithOptions = vi.fn();
  const mockOpenCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <CakeCustomizer
        config={DEFAULT_STORE_CONFIG}
        onAddToCartWithOptions={mockAddToCartWithOptions}
        onOpenCart={mockOpenCart}
      />
    );
  };

  describe('Adversarial Challenge 1: Extreme Rapid Structural Switching & DOM Stability', () => {
    it('survives rapid successive tier switches through all 4 structural models without DOM desync', () => {
      const { container } = renderComponent();

      // Cycle rapidly: Classic -> Bento -> Tall -> Double -> Bento -> Double -> Classic
      const bentoBtn = screen.getByRole('button', { name: /Bento Cake Mini/i });
      const tallBtn = screen.getByRole('button', { name: /1 Piso Alto Gourmet/i });
      const doubleBtn = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      const classicBtn = screen.getByRole('button', { name: /1 Piso Redondo/i });

      fireEvent.click(bentoBtn);
      expect(container.querySelector('#bento-base')).not.toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      fireEvent.click(tallBtn);
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      fireEvent.click(doubleBtn);
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#exterior-tier-2')).not.toBeNull();

      fireEvent.click(bentoBtn);
      expect(container.querySelector('#bento-base')).not.toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      fireEvent.click(classicBtn);
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();
    });

    it('correctly adapts Cutaway Layer Architecture across single, bento, and stepped two tiers', () => {
      const { container } = renderComponent();

      // Switch to cutaway view
      const cutawayBtn = screen.getByRole('button', { name: /Corte en Capas/i });
      fireEvent.click(cutawayBtn);

      // Default (Classic): standard 3-layer sponge + 2 fillings
      expect(container.querySelector('#standard-layers')).not.toBeNull();
      expect(container.querySelector('#bento-layers')).toBeNull();
      expect(container.querySelector('#cutaway-tier2')).toBeNull();

      // Switch to Bento: 2-layer sponge + 1 filling
      const bentoBtn = screen.getByRole('button', { name: /Bento Cake Mini/i });
      fireEvent.click(bentoBtn);
      expect(container.querySelector('#bento-layers')).not.toBeNull();
      expect(container.querySelector('#standard-layers')).toBeNull();
      expect(container.querySelector('#cutaway-tier2')).toBeNull();

      // Switch to Double: standard layers + upper tier2 cutaway
      const doubleBtn = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleBtn);
      expect(container.querySelector('#standard-layers')).not.toBeNull();
      expect(container.querySelector('#cutaway-tier2')).not.toBeNull();
      expect(container.querySelector('#upper-layers')).not.toBeNull();
    });
  });

  describe('Adversarial Challenge 2: Dedication Input Stress & Edge Cases', () => {
    it('handles empty or whitespace-only dedication text gracefully without rendering orphan plaque', () => {
      const { container } = renderComponent();
      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      // Empty string
      fireEvent.change(input, { target: { value: '' } });
      expect(container.querySelector('#artisan-plaque')).toBeNull();

      // Whitespace only
      fireEvent.change(input, { target: { value: '     ' } });
      expect(container.querySelector('#artisan-plaque')).toBeNull();

      // Note passed to cart handler should be undefined when blank
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);
      const [, , note] = mockAddToCartWithOptions.mock.calls[0];
      expect(note).toBeUndefined();
    });

    it('safely handles long text, emojis, and special characters on the chocolate plaque', () => {
      const { container } = renderComponent();
      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      // 30-char text (max length)
      const maxText = '¡Felicidades Mamá en tu día! ✨';
      fireEvent.change(input, { target: { value: maxText } });

      const plaque = container.querySelector('#artisan-plaque');
      expect(plaque).not.toBeNull();
      // Should truncate gracefully with ellipsis if > 22 characters
      const plaqueText = plaque?.querySelector('text');
      expect(plaqueText?.textContent).toContain('…');
    });

    it('safely handles XSS/HTML injection attempts in dedication text without execution', () => {
      renderComponent();
      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      const maliciousText = '<script>alert("hack")</script>';
      fireEvent.change(input, { target: { value: maliciousText } });

      // Verifies text is safely rendered as string content and not executable HTML
      expect(screen.getByText(/<script>alert/i)).toBeInTheDocument();
    });
  });

  describe('Adversarial Challenge 3: Toppings Combinatorial Stress & Price Mathematical Invariants', () => {
    it('maintains pricing invariant across all toppings enabled and disabled', () => {
      renderComponent();

      // Start: Classic 450 + berries 0 + strawberries 35 + sprinkles 20 + candle 15 = 520
      expect(screen.getAllByText(/\$520/)[0]).toBeInTheDocument();

      // Enable ALL remaining toppings:
      // Cookies +30, Flowers +40, Chocolates +35 => +105 => Total 625
      const cookiesBtn = screen.getByRole('button', { name: /Galletas & Mini Oreos/i });
      const flowersBtn = screen.getByRole('button', { name: /Flores Comestibles/i });
      const chocolatesBtn = screen.getByRole('button', { name: /Chocolates & Chuches/i });

      fireEvent.click(cookiesBtn);
      fireEvent.click(flowersBtn);
      fireEvent.click(chocolatesBtn);
      expect(screen.getAllByText(/\$625/)[0]).toBeInTheDocument();

      // Unselect ALL toppings
      const strawberriesBtn = screen.getByRole('button', { name: /Fresas & Moras/i });
      const sprinklesBtn = screen.getByRole('button', { name: /Chispas Arcoíris/i });
      fireEvent.click(strawberriesBtn);
      fireEvent.click(sprinklesBtn);
      fireEvent.click(cookiesBtn);
      fireEvent.click(flowersBtn);
      fireEvent.click(chocolatesBtn);

      // Now 0 toppings: 450 + 15 = 465
      expect(screen.getAllByText(/\$465/)[0]).toBeInTheDocument();

      // Check cart options when 0 toppings: should show 'Sin toppings'
      const addBtn = screen.getByRole('button', { name: /Agregar este Pastel a mi Pedido/i });
      fireEvent.click(addBtn);
      const [, options] = mockAddToCartWithOptions.mock.calls[0];
      expect(options['Toppings']).toBe('Sin toppings');
    });

    it('correctly aggregates premium fillings with premium structures and candle states', () => {
      renderComponent();

      // Switch to Double (980) + Passion Fruit (+30) + all toppings (+160) + candle (+15)
      // Total: 980 + 30 + 160 + 15 = 1,185
      const doubleBtn = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleBtn);

      const passionBtn = screen.getByRole('button', { name: /Maracuyá Cítrico/i });
      fireEvent.click(passionBtn);

      const cookiesBtn = screen.getByRole('button', { name: /Galletas & Mini Oreos/i });
      const flowersBtn = screen.getByRole('button', { name: /Flores Comestibles/i });
      const chocolatesBtn = screen.getByRole('button', { name: /Chocolates & Chuches/i });
      fireEvent.click(cookiesBtn);
      fireEvent.click(flowersBtn);
      fireEvent.click(chocolatesBtn);

      expect(screen.getAllByText(/\$1,185/)[0]).toBeInTheDocument();

      // Turn off candle (-15) => 1,170
      const candleBtn = screen.getByRole('button', { name: /Velita/i });
      fireEvent.click(candleBtn);
      expect(screen.getAllByText(/\$1,170/)[0]).toBeInTheDocument();
    });
  });

  describe('Adversarial Challenge 4: Mobile Sticky Action Bar vs Desktop Parity', () => {
    it('produces identical cart dispatch payload from both mobile and desktop buttons', () => {
      renderComponent();

      // Click desktop button
      const desktopAddBtn = screen.getByRole('button', { name: /Agregar este Pastel a mi Pedido/i });
      fireEvent.click(desktopAddBtn);
      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [desktopProduct, desktopOptions, desktopNote] = mockAddToCartWithOptions.mock.calls[0];

      mockAddToCartWithOptions.mockClear();

      // Click mobile sticky button
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);
      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [mobileProduct, mobileOptions, mobileNote] = mockAddToCartWithOptions.mock.calls[0];

      // Verifies exact structural equivalence
      expect(mobileProduct.name).toEqual(desktopProduct.name);
      expect(mobileProduct.price).toEqual(desktopProduct.price);
      expect(mobileOptions).toEqual(desktopOptions);
      expect(mobileNote).toEqual(desktopNote);
    });

    it('ensures mobile sticky bar has high z-index (z-40) and responsive constraints', () => {
      renderComponent();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar.className).toContain('fixed');
      expect(mobileBar.className).toContain('bottom-0');
      expect(mobileBar.className).toContain('z-40');
      expect(mobileBar.className).toContain('lg:hidden');
    });
  });

  describe('Adversarial Challenge 5: WhatsApp Special Art Quote Link Generation', () => {
    it('creates resilient URL containing all customized options and special art flags', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderComponent();

      // Select Tall gourmet + Matcha + Cajeta + Ganache
      fireEvent.click(screen.getByRole('button', { name: /1 Piso Alto Gourmet/i }));
      fireEvent.click(screen.getByRole('button', { name: /Matcha Latte/i }));
      fireEvent.click(screen.getByRole('button', { name: /Dulce de Leche \/ Cajeta/i }));
      fireEvent.click(screen.getByRole('button', { name: /Ganache Chocolate/i }));

      const quoteBtn = screen.getByRole('button', { name: /Cotizar Diseño Especial por WhatsApp/i });
      fireEvent.click(quoteBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const calledUrl = windowOpenSpy.mock.calls[0][0];

      expect(calledUrl).toContain(`https://wa.me/${DEFAULT_STORE_CONFIG.whatsappNumber.replace(/\D/g, '')}`);
      expect(calledUrl).toContain(encodeURIComponent('1 Piso Alto Gourmet'));
      expect(calledUrl).toContain(encodeURIComponent('Matcha Latte'));
      expect(calledUrl).toContain(encodeURIComponent('Dulce de Leche / Cajeta'));
      expect(calledUrl).toContain(encodeURIComponent('Ganache Chocolate'));
      expect(calledUrl).toContain(encodeURIComponent('DISEÑO ARTÍSTICO / ESPECIAL'));

      windowOpenSpy.mockRestore();
    });
  });
});
