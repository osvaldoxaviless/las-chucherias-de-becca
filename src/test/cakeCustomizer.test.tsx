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

describe('Milestone 2: Cake Builder ("Arma tu pastel") Visual & UX Redesign', () => {
  const mockAddToCartWithOptions = vi.fn();
  const mockOpenCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCustomizer = () => {
    return render(
      <CakeCustomizer
        config={DEFAULT_STORE_CONFIG}
        onAddToCartWithOptions={mockAddToCartWithOptions}
        onOpenCart={mockOpenCart}
      />
    );
  };

  describe('F4: Elimination of Duolingo-style tacky bounce animations', () => {
    it('renders the customizer without Duolingo bounce classes', () => {
      const { container } = renderCustomizer();

      expect(container.querySelector('.animate-cake-bounce')).toBeNull();
      expect(container.querySelector('.animate-tier-drop')).toBeNull();
      expect(container.querySelector('.animate-flame')).toBeNull();
      expect(container.querySelector('.animate-sparkle')).toBeNull();
    });

    it('uses subtle micro-interaction classes instead of bouncy squash', () => {
      const { container } = renderCustomizer();

      // Exterior view uses subtle scale/fade
      const exteriorView = container.querySelector('#exterior-view');
      expect(exteriorView).not.toBeNull();
      expect(exteriorView?.classList.contains('animate-subtle-scale')).toBe(true);

      // Candle flame uses gentle candle glow
      const candleGlow = container.querySelector('.animate-candle-glow');
      expect(candleGlow).not.toBeNull();
    });
  });

  describe('F5: Proportional Silhouettes and Tier Selection', () => {
    it('initializes with 1 Piso Redondo and its base price ($450)', () => {
      renderCustomizer();

      expect(screen.getByText('1 Piso Redondo')).toBeInTheDocument();
      // Default: base 450 + berries 0 + strawberries 35 + sprinkles 20 + candle 15 = $520
      expect(screen.getAllByText(/\$520/)[0]).toBeInTheDocument();
    });

    it('selecting Bento Cake Mini updates proportions, base price, and bento base', () => {
      const { container } = renderCustomizer();

      const bentoButton = screen.getByRole('button', { name: /Bento Cake Mini/i });
      fireEvent.click(bentoButton);

      // Bento: 260 + berries 0 + strawberries 35 + sprinkles 20 + candle 15 = $330
      expect(screen.getAllByText(/\$330/)[0]).toBeInTheDocument();

      // Bento base element is rendered
      expect(container.querySelector('#bento-base')).not.toBeNull();
      expect(container.querySelector('#ceramic-pedestal')).toBeNull();
    });

    it('selecting 1 Piso Alto Gourmet updates tall proportions and price', () => {
      renderCustomizer();

      const tallButton = screen.getByRole('button', { name: /1 Piso Alto Gourmet/i });
      fireEvent.click(tallButton);

      // Tall: 620 + 0 + 35 + 20 + 15 = $690
      expect(screen.getAllByText(/\$690/)[0]).toBeInTheDocument();
    });

    it('selecting 2 Pisos Celebración renders stepped upper tier', () => {
      const { container } = renderCustomizer();

      const doubleButton = screen.getByRole('button', { name: /2 Pisos Celebración/i });
      fireEvent.click(doubleButton);

      // Double: 980 + 0 + 35 + 20 + 15 = $1,050
      expect(screen.getAllByText(/\$1,050/)[0]).toBeInTheDocument();

      // Upper tier element is rendered
      expect(container.querySelector('#exterior-tier-2')).not.toBeNull();
    });
  });

  describe('State and Dynamic Pricing Calculations (Flavor, Filling, Toppings)', () => {
    it('updates sponge flavor state and reflects in summary', () => {
      renderCustomizer();

      const chocolateBtn = screen.getByRole('button', { name: /Chocolate Belga/i });
      fireEvent.click(chocolateBtn);

      const summaries = screen.getAllByText(/Chocolate Belga/i);
      expect(summaries.length).toBeGreaterThan(0);
    });

    it('calculates extra filling price correctly (e.g. Maracuyá Cítrico +$30)', () => {
      renderCustomizer();

      const passionBtn = screen.getByRole('button', { name: /Maracuyá Cítrico/i });
      fireEvent.click(passionBtn);

      // 450 + 30 + 35 + 20 + 15 = $550
      expect(screen.getAllByText(/\$550/)[0]).toBeInTheDocument();
    });

    it('toggles toppings and adjusts price accordingly', () => {
      renderCustomizer();

      // Uncheck strawberries (-$35): 520 - 35 = 485
      const strawberryBtn = screen.getByRole('button', { name: /Fresas & Moras/i });
      fireEvent.click(strawberryBtn);
      expect(screen.getAllByText(/\$485/)[0]).toBeInTheDocument();

      // Add flowers (+$40): 485 + 40 = 525
      const flowersBtn = screen.getByRole('button', { name: /Flores Comestibles/i });
      fireEvent.click(flowersBtn);
      expect(screen.getAllByText(/\$525/)[0]).toBeInTheDocument();
    });

    it('toggles candle on/off adjusting price by $15', () => {
      renderCustomizer();

      const candleBtn = screen.getByRole('button', { name: /Velita/i });
      // Turn candle off: 520 - 15 = 505
      fireEvent.click(candleBtn);
      expect(screen.getAllByText(/\$505/)[0]).toBeInTheDocument();

      // Turn candle back on: 505 + 15 = 520
      fireEvent.click(candleBtn);
      expect(screen.getAllByText(/\$520/)[0]).toBeInTheDocument();
    });

    it('selecting Naked Rustic frosting applies authentic semi-naked styling', () => {
      renderCustomizer();

      const nakedBtn = screen.getByRole('button', { name: /Estilo Naked Rústico/i });
      fireEvent.click(nakedBtn);

      const summaries = screen.getAllByText(/Estilo Naked Rústico/i);
      expect(summaries.length).toBeGreaterThan(0);
    });

    it('updates dedication text on the chocolate plaque', () => {
      renderCustomizer();

      const input = screen.getByPlaceholderText(/Ej: ¡Feliz Cumpleaños Sofi!/i);
      fireEvent.change(input, { target: { value: '¡Te Amo Valentina!' } });

      expect(screen.getByText('¡Te Amo Valentina!')).toBeInTheDocument();
    });
  });

  describe('F6: Dual Visual Mode (Vista Exterior vs Corte en Capas)', () => {
    it('defaults to Vista Exterior and toggles cleanly to Corte en Capas', () => {
      const { container } = renderCustomizer();

      // Default: exterior view visible, cutaway not rendered
      expect(container.querySelector('#exterior-view')).not.toBeNull();
      expect(container.querySelector('#cutaway-view')).toBeNull();

      // Click "Corte en Capas"
      const cutawayToggle = screen.getByRole('button', { name: /Corte en Capas/i });
      fireEvent.click(cutawayToggle);

      // Now cutaway is visible, exterior is hidden
      expect(container.querySelector('#cutaway-view')).not.toBeNull();
      expect(container.querySelector('#exterior-view')).toBeNull();
      expect(screen.getByText(/Corte artesanal:/i)).toBeInTheDocument();

      // Click "Vista Exterior" to toggle back
      const exteriorToggle = screen.getByRole('button', { name: /Vista Exterior/i });
      fireEvent.click(exteriorToggle);

      expect(container.querySelector('#exterior-view')).not.toBeNull();
      expect(container.querySelector('#cutaway-view')).toBeNull();
    });

    it('displays anatomical pastry annotations in cutaway mode', () => {
      const { container } = renderCustomizer();

      const cutawayToggle = screen.getByRole('button', { name: /Corte en Capas/i });
      fireEvent.click(cutawayToggle);

      expect(container.querySelector('#cutaway-annotations')).not.toBeNull();
      expect(screen.getByText('Pan esponjoso')).toBeInTheDocument();
      expect(screen.getByText('Relleno abundante')).toBeInTheDocument();
      expect(screen.getByText('Cobertura exterior')).toBeInTheDocument();
    });
  });

  describe('F7: Mobile-First Sticky Action Bar & Cart Submission', () => {
    it('renders mobile sticky floating action bar with live price and tier name', () => {
      renderCustomizer();

      const mobileBar = screen.getByTestId('mobile-sticky-bar');
      expect(mobileBar).toBeInTheDocument();

      // Verify it shows current tier and total price
      expect(mobileBar).toHaveTextContent('1 Piso Redondo');
      expect(mobileBar).toHaveTextContent('$520');
    });

    it('clicking mobile action bar button adds custom cake to cart and opens cart', () => {
      renderCustomizer();

      const mobileAddBtn = screen.getByTestId('mobile-add-to-cart');
      fireEvent.click(mobileAddBtn);

      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      const [product, options, note] = mockAddToCartWithOptions.mock.calls[0];

      expect(product.name).toContain('Pastel Personalizado');
      expect(product.price).toBe(520);
      expect(options['Estructura']).toBe('1 Piso Redondo');
      expect(options['Bizcocho']).toBe('Vainilla Dorada');
      expect(options['Relleno']).toBe('Frutos Rojos / Frambuesa');
      expect(options['Cobertura']).toBe('Rosa Pastel');
      expect(note).toBe('¡Feliz Cumple!');

      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });

    it('clicking desktop "Agregar este Pastel a mi Pedido" adds to cart and opens cart', () => {
      renderCustomizer();

      const desktopAddBtn = screen.getByRole('button', { name: /Agregar este Pastel a mi Pedido/i });
      fireEvent.click(desktopAddBtn);

      expect(mockAddToCartWithOptions).toHaveBeenCalledTimes(1);
      expect(mockOpenCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Special Art & Pinterest Quote WhatsApp Gateway', () => {
    it('renders boutique Pinterest / special design card in luxury champagne tones', () => {
      renderCustomizer();

      expect(screen.getByText(/L'Atelier de Becca • Diseños Pinterest/i)).toBeInTheDocument();
      expect(screen.getByText(/¿Buscas un diseño temático, 3D o de Pinterest\?/i)).toBeInTheDocument();
    });

    it('clicking special design button opens WhatsApp with encoded quote URL', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderCustomizer();

      const quoteBtn = screen.getByRole('button', { name: /Cotizar Diseño Especial por WhatsApp/i });
      fireEvent.click(quoteBtn);

      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      const calledUrl = windowOpenSpy.mock.calls[0][0];
      expect(calledUrl).toContain('https://wa.me/');
      expect(calledUrl).toContain(encodeURIComponent('1 Piso Redondo'));
      expect(calledUrl).toContain(encodeURIComponent('Vainilla Dorada'));

      windowOpenSpy.mockRestore();
    });
  });
});
