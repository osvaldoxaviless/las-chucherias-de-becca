import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { 
  CakeCustomizer, 
  TIER_OPTIONS, 
  FLAVOR_OPTIONS, 
  FILLING_OPTIONS, 
  FROSTING_OPTIONS, 
  TOPPING_OPTIONS 
} from '../components/CakeCustomizer';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { App } from '../App';
import { createWhatsAppCakeQuoteUrl } from '../utils/whatsapp';
import { CustomCakeQuote } from '../types';

describe('Milestone 2 Adversarial Stress Test & Verification Suite', () => {
  const mockAddToCartWithOptions = vi.fn();
  const mockOpenCart = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderCustomizer = (overrideConfig = DEFAULT_STORE_CONFIG) => {
    return render(
      <CakeCustomizer
        config={overrideConfig}
        onAddToCartWithOptions={mockAddToCartWithOptions}
        onOpenCart={mockOpenCart}
      />
    );
  };

  // =========================================================================
  // 1. MOBILE STICKY ACTION BAR TESTS (F7)
  // =========================================================================
  describe('1. Mobile Sticky Action Bar (data-testid="mobile-sticky-bar")', () => {
    it('is rendered in the DOM with required mobile CSS classes', () => {
      renderCustomizer();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar).toBeInTheDocument();
      expect(mobileBar.className).toContain('fixed');
      expect(mobileBar.className).toContain('bottom-0');
      expect(mobileBar.className).toContain('lg:hidden');
      expect(mobileBar.className).toContain('z-40');
    });

    it('displays default tier name, servings, and live price accurately', () => {
      renderCustomizer();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');

      // Default: 1 Piso Redondo (450) + Frutos Rojos (0) + Fresas (35) + Chispas (20) + Velita (15) = $520
      expect(mobileBar).toHaveTextContent('1 Piso Redondo');
      expect(mobileBar).toHaveTextContent('8 a 12 personas');
      expect(mobileBar).toHaveTextContent('$520');
      expect(mobileBar).toHaveTextContent('MXN');
    });

    it('dynamically updates tier, servings, and price across all 4 tier options', () => {
      renderCustomizer();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');

      // 1. Switch to Bento Cake Mini
      const bentoBtn = screen.getByRole('button', { name: /Bento Cake Mini/i });
      fireEvent.click(bentoBtn);
      expect(mobileBar).toHaveTextContent('Bento Cake Mini');
      expect(mobileBar).toHaveTextContent('2 a 4 personas');
      // 260 + 0 + 55 + 15 = $330
      expect(mobileBar).toHaveTextContent('$330');

      // 2. Switch to 1 Piso Alto Gourmet
      const tallBtn = screen.getByRole('button', { name: /1 Piso Alto Gourmet/i });
      fireEvent.click(tallBtn);
      expect(mobileBar).toHaveTextContent('1 Piso Alto Gourmet');
      expect(mobileBar).toHaveTextContent('15 a 20 personas');
      // 620 + 0 + 55 + 15 = $690
      expect(mobileBar).toHaveTextContent('$690');

      // 3. Switch to 2 Pisos Celebración
      const doubleBtn = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleBtn);
      expect(mobileBar).toHaveTextContent('2 Pisos Celebración');
      expect(mobileBar).toHaveTextContent('25 a 35 personas');
      // 980 + 0 + 55 + 15 = $1,050
      expect(mobileBar).toHaveTextContent('$1,050');

      // 4. Switch back to 1 Piso Redondo
      const classicBtn = screen.getByRole('button', { name: /1 Piso Redondo/i });
      fireEvent.click(classicBtn);
      expect(mobileBar).toHaveTextContent('1 Piso Redondo');
      expect(mobileBar).toHaveTextContent('8 a 12 personas');
      expect(mobileBar).toHaveTextContent('$520');
    });

    it('reflects ingredient price changes in real time in the mobile sticky bar', () => {
      renderCustomizer();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');

      // Default: $520
      expect(mobileBar).toHaveTextContent('$520');

      // Add premium filling: Maracuyá Cítrico (+$30) -> $550
      const passionBtn = screen.getByRole('button', { name: /Maracuyá Cítrico/i });
      fireEvent.click(passionBtn);
      expect(mobileBar).toHaveTextContent('$550');

      // Remove Fresas & Moras (-$35) -> $515
      const strawberryBtn = screen.getByRole('button', { name: /Fresas & Moras/i });
      fireEvent.click(strawberryBtn);
      expect(mobileBar).toHaveTextContent('$515');

      // Remove Chispas Arcoíris (-$20) -> $495
      const sprinklesBtn = screen.getByRole('button', { name: /Chispas Arcoíris/i });
      fireEvent.click(sprinklesBtn);
      expect(mobileBar).toHaveTextContent('$495');

      // Turn off candle (-$15) -> $480
      const candleBtn = screen.getByRole('button', { name: /Velita/i });
      fireEvent.click(candleBtn);
      expect(mobileBar).toHaveTextContent('$480');
    });

    it('mobile add-to-cart button complies with >=44px touch ergonomics', () => {
      renderCustomizer();
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      expect(mobileAddBtn.className).toContain('min-h-[44px]');
    });
  });

  // =========================================================================
  // 2. CHECKOUT WORKFLOWS: MOBILE STICKY BAR VS DESKTOP BUTTON PARITY
  // =========================================================================
  describe('2. Checkout Workflows & Parity (Mobile vs Desktop "Agregar al Pedido")', () => {
    it('mobile button triggers onAddToCartWithOptions with complete CustomCakeQuote-equivalent payload', () => {
      renderCustomizer();
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [product, options, note] = mockAddToCartWithOptions.mock.calls[0];

      // Product integrity
      expect(product.id).toMatch(/^custom-cake-\d+$/);
      expect(product.name).toBe('Pastel Personalizado (1 Piso Redondo)');
      expect(product.price).toBe(520);
      expect(product.category).toBe('pasteles');
      expect(product.servings).toBe('8 a 12 personas');
      expect(product.available).toBe(true);

      // Options integrity
      expect(options).toEqual({
        'Estructura': '1 Piso Redondo',
        'Porciones': '8 a 12 personas',
        'Bizcocho': 'Vainilla Dorada',
        'Relleno': 'Frutos Rojos / Frambuesa',
        'Cobertura': 'Rosa Pastel',
        'Toppings': 'Fresas & Moras, Chispas Arcoíris',
        'Velita': 'Sí (Encendida 🕯️)',
      });

      // Note integrity
      expect(note).toBe('¡Feliz Cumple!');

      // Open cart drawer trigger
      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });

    it('desktop button triggers onAddToCartWithOptions with identical arguments and opens cart', () => {
      renderCustomizer();
      const desktopAddBtn = screen.getByRole('button', { name: /Agregar este Pastel a mi Pedido/i });
      fireEvent.click(desktopAddBtn);

      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [product, options, note] = mockAddToCartWithOptions.mock.calls[0];

      expect(product.id).toMatch(/^custom-cake-\d+$/);
      expect(product.name).toBe('Pastel Personalizado (1 Piso Redondo)');
      expect(product.price).toBe(520);
      expect(options['Estructura']).toBe('1 Piso Redondo');
      expect(note).toBe('¡Feliz Cumple!');

      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });

    it('handles custom modifications correctly in payload for both buttons', () => {
      renderCustomizer();

      // Customize: Bento + Chocolate Belga + Maracuyá Cítrico + Blanco Nieve + Flores + Sin Velita + Dedicatoria personalizada
      fireEvent.click(screen.getByRole('button', { name: /Bento Cake Mini/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chocolate Belga/i }));
      fireEvent.click(screen.getByRole('button', { name: /Maracuyá Cítrico/i }));
      fireEvent.click(screen.getByRole('button', { name: /Blanco Nieve/i }));
      
      // Uncheck defaults
      fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));
      // Check Flores Comestibles
      fireEvent.click(screen.getByRole('button', { name: /Flores Comestibles/i }));
      // Turn off candle
      fireEvent.click(screen.getByRole('button', { name: /Velita/i }));

      // Custom dedication
      const dedInput = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);
      fireEvent.change(dedInput, { target: { value: 'Amor Eterno 2026' } });

      // Expected price: Bento 260 + Maracuyá 30 + Flores 40 = $330
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      const [product, options, note] = mockAddToCartWithOptions.mock.calls[0];
      expect(product.name).toBe('Pastel Personalizado (Bento Cake Mini)');
      expect(product.price).toBe(330);
      expect(options['Bizcocho']).toBe('Chocolate Belga');
      expect(options['Relleno']).toBe('Maracuyá Cítrico');
      expect(options['Cobertura']).toBe('Blanco Nieve');
      expect(options['Toppings']).toBe('Flores Comestibles');
      expect(options['Velita']).toBe('No');
      expect(note).toBe('Amor Eterno 2026');
    });

    it('trims whitespace and sets note to undefined when dedication is empty or whitespace-only', () => {
      renderCustomizer();

      const dedInput = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);
      fireEvent.change(dedInput, { target: { value: '    ' } });

      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      const [, , note] = mockAddToCartWithOptions.mock.calls[0];
      expect(note).toBeUndefined();
    });

    it('formats "Sin toppings" in options when all toppings are deselected', () => {
      renderCustomizer();

      // Deselect default toppings
      fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));

      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      const [, options] = mockAddToCartWithOptions.mock.calls[0];
      expect(options['Toppings']).toBe('Sin toppings');
    });
  });

  // =========================================================================
  // 3. PRICING BOUNDARIES & MATH INTEGRITY
  // =========================================================================
  describe('3. Pricing Boundaries & Math Integrity', () => {
    it('calculates absolute minimum possible price (Bento, $0 filling, 0 toppings, no candle = $260)', () => {
      renderCustomizer();

      fireEvent.click(screen.getByRole('button', { name: /Bento Cake Mini/i }));
      // Filling default is berries ($0)
      // Deselect strawberries and sprinkles
      fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));
      // Deselect candle
      fireEvent.click(screen.getByRole('button', { name: /Velita/i }));

      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar).toHaveTextContent('$260');

      // Click add to cart and verify payload price
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      const [product] = mockAddToCartWithOptions.mock.calls[0];
      expect(product.price).toBe(260);
    });

    it('calculates absolute maximum possible price (2 Pisos $980 + Maracuyá $30 + all 5 toppings $160 + candle $15 = $1,185)', () => {
      renderCustomizer();

      // Select 2 Pisos Celebración ($980)
      fireEvent.click(screen.getByRole('button', { name: /2 Pisos Celebración/i }));

      // Select premium filling: Maracuyá Cítrico ($30)
      fireEvent.click(screen.getByRole('button', { name: /Maracuyá Cítrico/i }));

      // Default already has strawberries ($35) and sprinkles ($20)
      // Add cookies ($30), flowers ($40), chocolates ($35)
      fireEvent.click(screen.getByRole('button', { name: /Galletas & Mini Oreos/i }));
      fireEvent.click(screen.getByRole('button', { name: /Flores Comestibles/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chocolates & Chuches/i }));

      // Candle is on by default ($15)

      // Total: 980 + 30 + (35 + 20 + 30 + 40 + 35) + 15 = 1185
      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar).toHaveTextContent('$1,185');

      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      const [product] = mockAddToCartWithOptions.mock.calls[0];
      expect(product.price).toBe(1185);
    });

    it('verifies mathematical consistency across various combinatorial configurations', () => {
      renderCustomizer();

      const testCases = [
        {
          name: 'Classic tier base with no extras',
          action: () => {
            // Deselect default toppings and candle
            fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
            fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));
            fireEvent.click(screen.getByRole('button', { name: /Velita/i }));
          },
          expected: 450,
          expectedStr: '$450',
        },
        {
          name: 'Tall tier ($620) + Cajeta ($0) + Galletas ($30)',
          action: () => {
            fireEvent.click(screen.getByRole('button', { name: /1 Piso Alto Gourmet/i }));
            fireEvent.click(screen.getByRole('button', { name: /Dulce de Leche \/ Cajeta/i }));
            fireEvent.click(screen.getByRole('button', { name: /Galletas & Mini Oreos/i }));
          },
          expected: 650, // 620 + 30
          expectedStr: '$650',
        },
        {
          name: 'Tall tier + Maracuyá ($30) + Velita ($15)',
          action: () => {
            fireEvent.click(screen.getByRole('button', { name: /Maracuyá Cítrico/i }));
            fireEvent.click(screen.getByRole('button', { name: /Velita/i }));
          },
          expected: 695, // 620 + 30 + 30 + 15
          expectedStr: '$695',
        },
      ];

      for (const tc of testCases) {
        tc.action();
        const mobileBar = screen.getByTestId('mobile-sticky-bar');
        expect(mobileBar).toHaveTextContent(tc.expectedStr);
      }
    });

    it('guarantees idempotency on rapid toggling of toppings', () => {
      renderCustomizer();
      const mobileBar = screen.getByTestId('mobile-sticky-bar');

      const cookieBtn = screen.getByRole('button', { name: /Galletas & Mini Oreos/i });
      // Initially: $520
      expect(mobileBar).toHaveTextContent('$520');

      // Toggle 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(cookieBtn);
      }

      // Even number of clicks returns to initial state
      expect(mobileBar).toHaveTextContent('$520');
    });
  });

  // =========================================================================
  // 4. WHATSAPP SPECIAL QUOTE GENERATION (createWhatsAppCakeQuoteUrl)
  // =========================================================================
  describe('4. WhatsApp Special Quote URL Generation & Gateway', () => {
    it('cleans phone number removing formatting, dashes, spaces and parentheses', () => {
      const quote: CustomCakeQuote = {
        eventType: 'Cumpleaños',
        servings: '8 a 12 personas',
        tier: '1 Piso Redondo',
        flavor: 'vanilla',
        flavorName: 'Vainilla Dorada',
        filling: 'berries',
        fillingName: 'Frutos Rojos',
        frosting: 'pink',
        frostingName: 'Rosa Pastel',
        toppings: ['Fresas & Moras'],
        candle: true,
        estimatedPrice: 520,
        isSpecialArtDesign: true,
      };

      const url = createWhatsAppCakeQuoteUrl('+52 (722) 123-4567', quote);
      expect(url.startsWith('https://wa.me/527221234567?text=')).toBe(true);
    });

    it('contains all selected attributes correctly encoded in the text parameter', () => {
      const quote: CustomCakeQuote = {
        eventType: 'Pastel de Diseño Especial / Personalizado',
        servings: '25 a 35 personas',
        tier: '2 Pisos Celebración',
        flavor: 'chocolate',
        flavorName: 'Chocolate Belga',
        filling: 'passion',
        fillingName: 'Maracuyá Cítrico',
        frosting: 'white',
        frostingName: 'Blanco Nieve',
        toppings: ['Flores Comestibles', 'Chocolates & Chuches'],
        candle: true,
        dedication: '¡Felicidades Ana & Carlos!',
        estimatedPrice: 1090,
        isSpecialArtDesign: true,
        customerName: 'Ana Gomez',
        phone: '7229876543',
        eventDate: '2026-12-15',
        details: 'Temática estilo boda rústica con detalles dorados.',
      };

      const url = createWhatsAppCakeQuoteUrl('7221234567', quote);
      const urlObj = new URL(url);
      const text = urlObj.searchParams.get('text') || '';

      // Verification of all attributes in decoded message
      expect(text).toContain('2 Pisos Celebración (25 a 35 personas)');
      expect(text).toContain('Chocolate Belga');
      expect(text).toContain('Maracuyá Cítrico');
      expect(text).toContain('Blanco Nieve');
      expect(text).toContain('Flores Comestibles, Chocolates & Chuches');
      expect(text).toContain('*Velita de Cumpleaños:* Sí, incluida');
      expect(text).toContain('*Placa / Dedicatoria:* "¡Felicidades Ana & Carlos!" 🍫');
      expect(text).toContain('$1,090 MXN');
      expect(text).toContain('DISEÑO ARTÍSTICO / ESPECIAL (3D / Personaje / Pinterest)');
      expect(text).toContain('Ana Gomez');
      expect(text).toContain('7229876543');
      expect(text).toContain('2026-12-15');
      expect(text).toContain('Temática estilo boda rústica con detalles dorados.');
    });

    it('omits optional fields when they are false or empty', () => {
      const minimalQuote: CustomCakeQuote = {
        eventType: 'Pastel Simple',
        servings: '2 a 4 personas',
        tier: 'Bento Cake Mini',
        flavor: 'vanilla',
        flavorName: 'Vainilla Dorada',
        filling: 'berries',
        fillingName: 'Frutos Rojos',
        frosting: 'pink',
        frostingName: 'Rosa Pastel',
        toppings: [],
        candle: false,
        estimatedPrice: 260,
        isSpecialArtDesign: false,
      };

      const url = createWhatsAppCakeQuoteUrl('7221234567', minimalQuote);
      const text = new URL(url).searchParams.get('text') || '';

      expect(text).not.toContain('Toppings & Decoración');
      expect(text).not.toContain('Velita de Cumpleaños');
      expect(text).not.toContain('Placa / Dedicatoria');
      expect(text).not.toContain('DISEÑO ARTÍSTICO');
    });

    it('safely handles adversarial special characters in dedication without URL breaking', () => {
      const complexQuote: CustomCakeQuote = {
        eventType: 'Pastel',
        servings: '8 a 12',
        tier: '1 Piso Redondo',
        flavor: 'vanilla',
        flavorName: 'Vainilla',
        filling: 'berries',
        fillingName: 'Frutos',
        frosting: 'pink',
        frostingName: 'Rosa',
        toppings: [],
        candle: true,
        dedication: 'Sofi & Alex = <3 ? 100% #1 "Best Friends"',
        estimatedPrice: 500,
        isSpecialArtDesign: true,
      };

      const url = createWhatsAppCakeQuoteUrl('7221234567', complexQuote);
      // Valid URL parser must not throw
      expect(() => new URL(url)).not.toThrow();

      const text = new URL(url).searchParams.get('text') || '';
      expect(text).toContain('Sofi & Alex = <3 ? 100% #1 "Best Friends"');
    });

    it('UI button "Cotizar Diseño Especial por WhatsApp" executes window.open with current customizer state', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderCustomizer();

      // Change flavor to Red Velvet
      fireEvent.click(screen.getByRole('button', { name: /Red Velvet Rubí/i }));

      // Click WhatsApp special quote button
      const waBtn = screen.getByRole('button', { name: /Cotizar Diseño Especial por WhatsApp/i });
      fireEvent.click(waBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const [url, target] = windowOpenSpy.mock.calls[0];
      expect(target).toBe('_blank');

      const text = new URL(url as string).searchParams.get('text') || '';
      expect(text).toContain('Red Velvet Rubí');
      expect(text).toContain('1 Piso Redondo');
      expect(text).toContain('DISEÑO ARTÍSTICO / ESPECIAL');

      windowOpenSpy.mockRestore();
    });
  });

  // =========================================================================
  // 5. FULL END-TO-END APPLICATION INTEGRATION (App.tsx)
  // =========================================================================
  describe('5. Full App Integration: Customizer to CartDrawer Workflow', () => {
    it('adding customized cake updates navbar badge, opens CartDrawer, and displays options breakdown', async () => {
      render(<App />);

      // Find mobile add to cart button in the sticky bar
      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      // Cart Drawer should now be visible with the custom cake item
      const cartHeading = screen.getByText(/Tu Pedido \(1\)/i);
      expect(cartHeading).toBeInTheDocument();
      const cartDrawer = cartHeading.closest('.w-screen') as HTMLElement;
      expect(cartDrawer).not.toBeNull();

      expect(within(cartDrawer).getByText('Pastel Personalizado (1 Piso Redondo)')).toBeInTheDocument();

      // Verify options are displayed inside cart drawer
      expect(within(cartDrawer).getByText(/Bizcocho:/i)).toBeInTheDocument();
      expect(within(cartDrawer).getByText('Vainilla Dorada')).toBeInTheDocument();
      expect(within(cartDrawer).getByText(/Relleno:/i)).toBeInTheDocument();
      expect(within(cartDrawer).getByText('Frutos Rojos / Frambuesa')).toBeInTheDocument();
      expect(within(cartDrawer).getByText(/Velita:/i)).toBeInTheDocument();
      expect(within(cartDrawer).getByText('Sí (Encendida 🕯️)')).toBeInTheDocument();

      // Verify dedication note inside cart drawer
      expect(within(cartDrawer).getByText('"¡Feliz Cumple!"')).toBeInTheDocument();

      // Verify item price in cart drawer
      expect(within(cartDrawer).getAllByText(/\$520 MXN/).length).toBeGreaterThan(0);
    });
  });
});
