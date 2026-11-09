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
import fs from 'fs';
import path from 'path';

describe('Adversarial Stress Harness: Milestone 2 Cake Customizer ("Arma tu pastel")', () => {
  const mockAddToCartWithOptions = vi.fn();
  const mockOpenCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupCustomizer = () => {
    return render(
      <CakeCustomizer
        config={DEFAULT_STORE_CONFIG}
        onAddToCartWithOptions={mockAddToCartWithOptions}
        onOpenCart={mockOpenCart}
      />
    );
  };

  // Helper pricing oracle function
  const calculateExpectedPrice = (
    tierId: string,
    fillingId: string,
    toppingIds: string[],
    hasCandle: boolean
  ): number => {
    const tier = TIER_OPTIONS.find(t => t.id === tierId);
    const filling = FILLING_OPTIONS.find(f => f.id === fillingId);
    if (!tier || !filling) throw new Error('Invalid tier or filling id');

    const toppingsSum = toppingIds.reduce((acc, tid) => {
      const top = TOPPING_OPTIONS.find(t => t.id === tid);
      return acc + (top ? top.price : 0);
    }, 0);

    const candleSum = hasCandle ? 15 : 0;
    return tier.basePrice + filling.price + toppingsSum + candleSum;
  };

  // =========================================================================
  // 1. EXHAUSTIVE TIER SELECTION & SVG PROPORTIONAL SILHOUETTES
  // =========================================================================
  describe('1. Exhaustive Tier Selection & Structural SVG Verification', () => {
    it('verifies Bento Cake Mini: unique bento craft base, no ceramic pedestal, single tier', () => {
      const { container } = setupCustomizer();

      const bentoBtn = screen.getByRole('button', { name: /Bento Cake Mini/i });
      fireEvent.click(bentoBtn);

      // Verify SVG structural elements
      expect(container.querySelector('#bento-base')).not.toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      // Check bento base geometry
      const bentoPaper = container.querySelector('#bento-base path');
      expect(bentoPaper).not.toBeNull();
      expect(bentoPaper?.getAttribute('fill')).toBe('#FAF7F2');

      // Price calculation with default toppings (strawberries 35 + sprinkles 20) + candle (15)
      // Bento base (260) + berries (0) + 35 + 20 + 15 = 330
      const expected = calculateExpectedPrice('bento', 'berries', ['strawberries', 'sprinkles'], true);
      expect(expected).toBe(330);
      expect(screen.getAllByText(/\$330/)[0]).toBeInTheDocument();
    });

    it('verifies 1 Piso Redondo Clásico: ceramic pedestal, classic proportions, no upper tier', () => {
      const { container } = setupCustomizer();

      const classicBtn = screen.getByRole('button', { name: /1 Piso Redondo/i });
      fireEvent.click(classicBtn);

      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      // Pedestal platter radius for classic is 106
      const platter = container.querySelector('#ceramic-pedestal ellipse[fill="url(#ceramicPlatterGrad)"]');
      expect(platter?.getAttribute('rx')).toBe('106');

      const expected = calculateExpectedPrice('classic', 'berries', ['strawberries', 'sprinkles'], true);
      expect(expected).toBe(520);
      expect(screen.getAllByText(/\$520/)[0]).toBeInTheDocument();
    });

    it('verifies 1 Piso Alto Gourmet: tall silhouetted height, ceramic pedestal, no upper tier', () => {
      const { container } = setupCustomizer();

      const tallBtn = screen.getByRole('button', { name: /1 Piso Alto Gourmet/i });
      fireEvent.click(tallBtn);

      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).toBeNull();

      // Platter radius for tall is 92
      const platter = container.querySelector('#ceramic-pedestal ellipse[fill="url(#ceramicPlatterGrad)"]');
      expect(platter?.getAttribute('rx')).toBe('92');

      const expected = calculateExpectedPrice('tall', 'berries', ['strawberries', 'sprinkles'], true);
      expect(expected).toBe(690);
      expect(screen.getAllByText(/\$690/)[0]).toBeInTheDocument();
    });

    it('verifies 2 Pisos Celebración: stepped 2-tier structure, double piping pearl rings', () => {
      const { container } = setupCustomizer();

      const doubleBtn = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleBtn);

      expect(container.querySelector('#ceramic-pedestal')).not.toBeNull();
      expect(container.querySelector('#bento-base')).toBeNull();
      expect(container.querySelector('#exterior-tier-2')).not.toBeNull();

      // Platter radius for double is 114
      const platter = container.querySelector('#ceramic-pedestal ellipse[fill="url(#ceramicPlatterGrad)"]');
      expect(platter?.getAttribute('rx')).toBe('114');

      // Upper tier has both base-tier2 and top-tier2 piping pearls
      const upperPearls = container.querySelectorAll('#exterior-tier-2 circle[fill="#F472B6"]');
      expect(upperPearls.length).toBeGreaterThan(10);

      const expected = calculateExpectedPrice('double', 'berries', ['strawberries', 'sprinkles'], true);
      expect(expected).toBe(1050);
      expect(screen.getAllByText(/\$1,050/)[0]).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. EXHAUSTIVE COMBINATORIAL TESTING (FLAVORS, FILLINGS, FROSTINGS)
  // =========================================================================
  describe('2. Combinatorial Stress Matrix: Flavors, Fillings, Frostings', () => {
    it('tests all 6 cake flavors and verifies sponge color reflection in SVG', () => {
      const { container } = setupCustomizer();

      // Set to naked frosting to see flavor color in exterior view directly
      const nakedFrostingBtn = screen.getByRole('button', { name: /Estilo Naked Rústico/i });
      fireEvent.click(nakedFrostingBtn);

      for (const flavor of FLAVOR_OPTIONS) {
        const flavorBtn = screen.getByRole('button', { name: new RegExp(flavor.name, 'i') });
        fireEvent.click(flavorBtn);

        // Exterior tier 1 must have path filled with flavor.color
        const tierPath = container.querySelector('#exterior-tier-1 path');
        expect(tierPath?.getAttribute('fill')).toBe(flavor.color);
      }
    });

    it('tests all 5 filling options and validates pricing oracle for premium fillings', () => {
      setupCustomizer();

      for (const filling of FILLING_OPTIONS) {
        const fillingBtn = screen.getByRole('button', { name: new RegExp(filling.name, 'i') });
        fireEvent.click(fillingBtn);

        // Classic (450) + filling.price + 35 (strawberries) + 20 (sprinkles) + 15 (candle)
        const expectedPrice = calculateExpectedPrice('classic', filling.id, ['strawberries', 'sprinkles'], true);
        const formatted = `$${expectedPrice.toLocaleString('es-MX')}`;
        expect(screen.getAllByText(new RegExp(formatted.replace('$', '\\$')))[0]).toBeInTheDocument();
      }
    });

    it('tests all 7 frosting options and verifies exterior color & semi-naked transitions', () => {
      const { container } = setupCustomizer();

      for (const frosting of FROSTING_OPTIONS) {
        const frostingBtn = screen.getByRole('button', { name: new RegExp(frosting.name, 'i') });
        fireEvent.click(frostingBtn);

        if (frosting.isNaked) {
          // Semi-naked rustico applies dasharray scraped ring
          const scrapedRing = Array.from(container.querySelectorAll('#exterior-tier-1 ellipse')).find(
            el => el.getAttribute('stroke-dasharray') === '18 8 26 12' || el.getAttribute('strokeDasharray') === '18 8 26 12'
          );
          expect(scrapedRing).not.toBeUndefined();
        } else {
          // Solid frosting fills the cylinder path with frosting.color
          const frostingPath = container.querySelector('#exterior-tier-1 path[fill="' + frosting.color + '"]');
          expect(frostingPath).not.toBeNull();
        }
      }
    });
  });

  // =========================================================================
  // 3. DUAL VIEW MODE: EXTERIOR VS CUTAWAY ANATOMY
  // =========================================================================
  describe('3. Dual View Mode Toggles & Cutaway Anatomical Rendering', () => {
    it('never paints filling cutting through the exterior frosting in Vista Exterior', () => {
      const { container } = setupCustomizer();

      // In exterior view, there should be NO elements with filling color in the exterior cylinder
      const exteriorTier1 = container.querySelector('#exterior-tier-1');
      expect(exteriorTier1).not.toBeNull();

      // Selected filling is berries (#BE123C). It must not be used as a strip inside exterior tier 1
      const fillingStrips = exteriorTier1?.querySelectorAll('[fill="#BE123C"]');
      expect(fillingStrips?.length).toBe(0);
    });

    it('displays realistic layered cutaway with correct sponge and filling layers in Bento', () => {
      const { container } = setupCustomizer();

      // Switch to Bento
      fireEvent.click(screen.getByRole('button', { name: /Bento Cake Mini/i }));

      // Switch to Cutaway
      fireEvent.click(screen.getByRole('button', { name: /Corte en Capas/i }));

      expect(container.querySelector('#cutaway-view')).not.toBeNull();
      expect(container.querySelector('#exterior-view')).toBeNull();

      // Bento has exactly #bento-layers (2 sponge rects + 1 filling rect)
      const bentoLayers = container.querySelector('#bento-layers');
      expect(bentoLayers).not.toBeNull();
      expect(container.querySelector('#standard-layers')).toBeNull();
    });

    it('displays 3 sponge layers and 2 filling layers for Classic and Tall tiers in Cutaway', () => {
      const { container } = setupCustomizer();

      // Switch to Cutaway
      fireEvent.click(screen.getByRole('button', { name: /Corte en Capas/i }));

      const standardLayers = container.querySelector('#standard-layers');
      expect(standardLayers).not.toBeNull();
      expect(container.querySelector('#bento-layers')).toBeNull();

      // Verify filling rects match selected filling color
      // Default filling: berries (#BE123C)
      const fillingRects = standardLayers?.querySelectorAll('rect[fill="#BE123C"]');
      expect(fillingRects?.length).toBe(2);

      // Verify sponge rects match selected flavor color
      // Default flavor: vanilla (#FCD34D)
      const spongeRects = standardLayers?.querySelectorAll('rect[fill="#FCD34D"]');
      expect(spongeRects?.length).toBe(3);
    });

    it('displays upper cutaway tier (#cutaway-tier2) when 2 Pisos is selected in Cutaway', () => {
      const { container } = setupCustomizer();

      // Switch to 2 Pisos Celebración
      fireEvent.click(screen.getByRole('button', { name: /2 Pisos Celebración/i }));

      // Switch to Cutaway
      fireEvent.click(screen.getByRole('button', { name: /Corte en Capas/i }));

      expect(container.querySelector('#cutaway-tier2')).not.toBeNull();
      expect(container.querySelector('#upper-layers')).not.toBeNull();
    });

    it('survives rapid toggle cycles between Vista Exterior and Corte en Capas without state desync', () => {
      const { container } = setupCustomizer();

      const cutawayBtn = screen.getByRole('button', { name: /Corte en Capas/i });
      const exteriorBtn = screen.getByRole('button', { name: /Vista Exterior/i });

      for (let i = 0; i < 10; i++) {
        fireEvent.click(cutawayBtn);
        expect(container.querySelector('#cutaway-view')).not.toBeNull();
        expect(container.querySelector('#exterior-view')).toBeNull();

        fireEvent.click(exteriorBtn);
        expect(container.querySelector('#exterior-view')).not.toBeNull();
        expect(container.querySelector('#cutaway-view')).toBeNull();
      }
    });
  });

  // =========================================================================
  // 4. TOPPING COMBINATIONS STRESS-TEST & BOUNDARY CONDITIONS
  // =========================================================================
  describe('4. Topping Combinations & Candle Stress Testing', () => {
    it('handles 0 toppings correctly: unchecking all toppings adjusts price and cart payload', () => {
      const { container } = setupCustomizer();

      // Default has strawberries and sprinkles. Uncheck both
      fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));

      // Exterior toppings group should not contain any topping elements
      const toppingsGroup = container.querySelector('#toppings-exterior');
      expect(toppingsGroup?.querySelector('#artisan-strawberries')).toBeNull();
      expect(toppingsGroup?.querySelector('#artisan-sprinkles')).toBeNull();
      expect(toppingsGroup?.querySelector('#artisan-flowers')).toBeNull();
      expect(toppingsGroup?.querySelector('#artisan-cookies')).toBeNull();
      expect(toppingsGroup?.querySelector('#artisan-chocolates')).toBeNull();

      // Price: Classic (450) + candle (15) = 465
      const expected = calculateExpectedPrice('classic', 'berries', [], true);
      expect(expected).toBe(465);
      expect(screen.getAllByText(/\$465/)[0]).toBeInTheDocument();

      // Add to cart with 0 toppings
      fireEvent.click(screen.getByRole('button', { name: /Agregar este Pastel a mi Pedido/i }));
      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [, options] = mockAddToCartWithOptions.mock.calls[0];
      expect(options['Toppings']).toBe('Sin toppings');
    });

    it('renders each single topping individually with exact pricing and SVG group', () => {
      const { container } = setupCustomizer();

      // Uncheck default 2 toppings first
      fireEvent.click(screen.getByRole('button', { name: /Fresas & Moras/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chispas Arcoíris/i }));

      const toppingMap = [
        { id: 'strawberries', name: /Fresas & Moras/i, selector: '#artisan-strawberries', price: 35 },
        { id: 'sprinkles', name: /Chispas Arcoíris/i, selector: '#artisan-sprinkles', price: 20 },
        { id: 'cookies', name: /Galletas & Mini Oreos/i, selector: '#artisan-cookies', price: 30 },
        { id: 'flowers', name: /Flores Comestibles/i, selector: '#artisan-flowers', price: 40 },
        { id: 'chocolates', name: /Chocolates & Chuches/i, selector: '#artisan-chocolates', price: 35 },
      ];

      for (const t of toppingMap) {
        // Toggle on
        const btn = screen.getByRole('button', { name: t.name });
        fireEvent.click(btn);

        // Verify SVG group rendered
        expect(container.querySelector(t.selector)).not.toBeNull();

        // Price: 450 + 15 + t.price
        const expected = 450 + 15 + t.price;
        expect(screen.getAllByText(new RegExp(`\\$${expected}`))[0]).toBeInTheDocument();

        // Toggle off for next iteration
        fireEvent.click(btn);
        expect(container.querySelector(t.selector)).toBeNull();
      }
    });

    it('stress tests all 5 toppings active simultaneously (maximum toppings limit)', () => {
      const { container } = setupCustomizer();

      // Turn on all toppings
      for (const t of TOPPING_OPTIONS) {
        const btn = screen.getByRole('button', { name: new RegExp(t.name, 'i') });
        // If not already active, click to activate
        if (!['strawberries', 'sprinkles'].includes(t.id)) {
          fireEvent.click(btn);
        }
      }

      // Verify all 5 topping SVG groups exist simultaneously
      expect(container.querySelector('#artisan-strawberries')).not.toBeNull();
      expect(container.querySelector('#artisan-sprinkles')).not.toBeNull();
      expect(container.querySelector('#artisan-cookies')).not.toBeNull();
      expect(container.querySelector('#artisan-flowers')).not.toBeNull();
      expect(container.querySelector('#artisan-chocolates')).not.toBeNull();

      // All toppings sum = 35 + 20 + 30 + 40 + 35 = 160
      // Classic 450 + 0 + 160 + candle 15 = 625
      const expected = calculateExpectedPrice('classic', 'berries', TOPPING_OPTIONS.map(t => t.id), true);
      expect(expected).toBe(625);
      expect(screen.getAllByText(/\$625/)[0]).toBeInTheDocument();
    });

    it('toggles candle on and off dynamically updating SVG and price', () => {
      const { container } = setupCustomizer();

      const candleBtn = screen.getByRole('button', { name: /Velita/i });

      // Candle defaults to ON -> turn OFF
      fireEvent.click(candleBtn);
      expect(container.querySelector('#artisan-candle')).toBeNull();
      expect(screen.getAllByText(/\$505/)[0]).toBeInTheDocument();

      // Turn ON
      fireEvent.click(candleBtn);
      expect(container.querySelector('#artisan-candle')).not.toBeNull();
      expect(screen.getAllByText(/\$520/)[0]).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 5. DEDICATION TEXT STRESS-TESTING & TEXT CONTAINMENT
  // =========================================================================
  describe('5. Dedication Text Stress-Testing & Plaque Text Containment', () => {
    it('renders dedication text in chocolate plaque with default message', () => {
      const { container } = setupCustomizer();

      const plaque = container.querySelector('#artisan-plaque');
      expect(plaque).not.toBeNull();
      expect(plaque?.querySelector('text')?.textContent).toBe('¡Feliz Cumple!');
    });

    it('hides the chocolate plaque entirely when dedication text is empty or only whitespace', () => {
      const { container } = setupCustomizer();

      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      // Empty string
      fireEvent.change(input, { target: { value: '' } });
      expect(container.querySelector('#artisan-plaque')).toBeNull();

      // Whitespace only
      fireEvent.change(input, { target: { value: '     ' } });
      expect(container.querySelector('#artisan-plaque')).toBeNull();
    });

    it('truncates strings longer than 22 characters with ellipsis (…) preserving SVG geometry', () => {
      const { container } = setupCustomizer();

      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      // 30 characters string
      const longText = 'Felicidades En Tu Dia Becca 26';
      expect(longText.length).toBe(30);

      fireEvent.change(input, { target: { value: longText } });

      const plaqueText = container.querySelector('#artisan-plaque text');
      expect(plaqueText).not.toBeNull();
      // Must truncate at 21 + '…'
      expect(plaqueText?.textContent).toBe(longText.slice(0, 21) + '…');
      expect(plaqueText?.textContent?.length).toBe(22);

      // Plaque rectangle maintains fixed width and does not distort
      const plaqueRect = container.querySelector('#artisan-plaque rect[stroke="#D4AF37"]');
      expect(plaqueRect?.getAttribute('width')).toBe('120');
      expect(plaqueRect?.getAttribute('height')).toBe('20');
    });

    it('safely handles special characters, emojis, and HTML/XSS strings without escaping issues', () => {
      const { container } = setupCustomizer();

      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);

      // Special characters & emojis
      fireEvent.change(input, { target: { value: '🎂 Te Amo <3 & Becca' } });
      const plaqueText = container.querySelector('#artisan-plaque text');
      expect(plaqueText?.textContent).toBe('🎂 Te Amo <3 & Becca');

      // Potential script tags
      fireEvent.change(input, { target: { value: '<script>alert()</script>' } });
      const plaqueXss = container.querySelector('#artisan-plaque text');
      // Truncated because length is 25 > 22
      expect(plaqueXss?.textContent).toContain('<script>alert()</scri…');
    });
  });

  // =========================================================================
  // 6. ABSENCE OF DUOLINGO / BOUNCY CSS CLASSES DURING STATE CHANGES
  // =========================================================================
  describe('6. Empirical Verification of Zero Duolingo / Bouncy CSS Classes', () => {
    const PROHIBITED_CLASSES = [
      'animate-cake-bounce',
      'animate-tier-drop',
      'animate-flame',
      'animate-sparkle',
    ];

    it('verifies that no element in the DOM contains prohibited bouncy classes during any state change', () => {
      const { container } = setupCustomizer();

      const verifyNoBouncyClasses = () => {
        for (const cls of PROHIBITED_CLASSES) {
          const match = container.querySelector(`.${cls}`);
          expect(match).toBeNull();
        }
      };

      // 1. Initial render
      verifyNoBouncyClasses();

      // 2. Switch all tiers
      for (const tier of TIER_OPTIONS) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(tier.name, 'i') }));
        verifyNoBouncyClasses();
      }

      // 3. Switch flavors
      for (const flav of FLAVOR_OPTIONS) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(flav.name, 'i') }));
        verifyNoBouncyClasses();
      }

      // 4. Switch frostings
      for (const frost of FROSTING_OPTIONS) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(frost.name, 'i') }));
        verifyNoBouncyClasses();
      }

      // 5. Toggle toppings
      for (const top of TOPPING_OPTIONS) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(top.name, 'i') }));
        verifyNoBouncyClasses();
      }

      // 6. Switch viewModes
      fireEvent.click(screen.getByRole('button', { name: /Corte en Capas/i }));
      verifyNoBouncyClasses();
      fireEvent.click(screen.getByRole('button', { name: /Vista Exterior/i }));
      verifyNoBouncyClasses();
    });

    it('verifies src/index.css contains zero references to Duolingo keyframes or bouncy classes', () => {
      const cssPath = path.resolve(__dirname, '../index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      expect(cssContent).not.toContain('duolingoSquash');
      expect(cssContent).not.toContain('dropTier');
      expect(cssContent).not.toContain('animate-cake-bounce');
      expect(cssContent).not.toContain('animate-tier-drop');
      expect(cssContent).not.toContain('animate-sparkle');
    });
  });

  // =========================================================================
  // 7. MOBILE FLOATING ACTION BAR & ACCESSIBILITY TARGETS (>=44px)
  // =========================================================================
  describe('7. Mobile Floating Action Bar & Touch Ergonomics', () => {
    it('renders mobile sticky bar with live price, servings, and 44px touch target', () => {
      setupCustomizer();

      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar).toBeInTheDocument();
      expect(mobileBar.classList.contains('lg:hidden')).toBe(true);
      expect(mobileBar.classList.contains('fixed')).toBe(true);
      expect(mobileBar.classList.contains('bottom-0')).toBe(true);

      const mobileBtn = screen.getByTestId('mobile-add-to-cart');
      expect(mobileBtn).toBeInTheDocument();
      expect(mobileBtn.classList.contains('min-h-[44px]')).toBe(true);
    });

    it('submits exact custom cake specification from mobile add-to-cart button', () => {
      setupCustomizer();

      // Configure a unique cake
      fireEvent.click(screen.getByRole('button', { name: /1 Piso Alto Gourmet/i }));
      fireEvent.click(screen.getByRole('button', { name: /Chocolate Belga/i }));
      fireEvent.click(screen.getByRole('button', { name: /Maracuyá Cítrico/i }));

      const mobileBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileBtn);

      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [product, options, note] = mockAddToCartWithOptions.mock.calls[0];

      // 620 (tall) + 30 (maracuya) + 35 (strawberries) + 20 (sprinkles) + 15 (candle) = 720
      expect(product.price).toBe(720);
      expect(options['Estructura']).toBe('1 Piso Alto Gourmet');
      expect(options['Bizcocho']).toBe('Chocolate Belga');
      expect(options['Relleno']).toBe('Maracuyá Cítrico');
      expect(note).toBe('¡Feliz Cumple!');

      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================================
  // 8. WHATSAPP QUOTE GATEWAY FOR PINTEREST / SPECIAL 3D DESIGNS
  // =========================================================================
  describe('8. Special Art & Pinterest Quote WhatsApp Gateway', () => {
    it('generates fully encoded WhatsApp quote with special characters in dedication', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      setupCustomizer();

      // Set custom dedication
      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);
      fireEvent.change(input, { target: { value: 'Boda Ana & Carlos 2026' } });

      const quoteBtn = screen.getByRole('button', { name: /Cotizar Diseño Especial por WhatsApp/i });
      fireEvent.click(quoteBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const calledUrl = windowOpenSpy.mock.calls[0][0];

      expect(calledUrl).toContain(`https://wa.me/${DEFAULT_STORE_CONFIG.whatsappNumber}`);
      expect(calledUrl).toContain(encodeURIComponent('Boda Ana & Carlos 2026'));
      expect(calledUrl).toContain(encodeURIComponent('DISEÑO ARTÍSTICO / ESPECIAL'));

      windowOpenSpy.mockRestore();
    });
  });
});
