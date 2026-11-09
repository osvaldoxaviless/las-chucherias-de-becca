import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminPanel } from '../components/AdminPanel';
import { App } from '../App';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { StoreConfig } from '../types';
import { createWhatsAppOrderUrl, createWhatsAppCakeQuoteUrl } from '../utils/whatsapp';

describe('Milestone 1 Adversarial Challenge & Stress Suite', () => {
  const dummyProducts = [
    {
      id: 'test-1',
      name: 'Torta de Fresa',
      price: 250,
      category: 'pasteles' as const,
      description: 'Deliciosa torta',
      image: 'https://example.com/torta.jpg',
      available: true,
      preparationTime: '24 hrs',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();
  });

  describe('Challenge 1: Settings PIN Input Sanitization & Empty PIN handling', () => {
    it('Strips non-numeric characters in real-time when changing PIN in settings', () => {
      let currentConfig: StoreConfig = { ...DEFAULT_STORE_CONFIG };
      const onSaveConfig = vi.fn((newCfg: StoreConfig) => {
        currentConfig = newCfg;
      });

      const { rerender } = render(
        <AdminPanel
          config={currentConfig}
          products={dummyProducts}
          onSaveConfig={onSaveConfig}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Authenticate with default 2026
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Switch to settings
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      const pinField = screen.getByDisplayValue('2026');

      // Attempt non-numeric input: "abcd"
      fireEvent.change(pinField, { target: { value: 'abcd' } });
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '' })
      );

      // Rerender with updated config having empty string
      rerender(
        <AdminPanel
          config={currentConfig}
          products={dummyProducts}
          onSaveConfig={onSaveConfig}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Attempt mixed input: "1a2b3c" -> should be sanitized to "123"
      fireEvent.change(pinField, { target: { value: '1a2b3c' } });
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '123' })
      );

      // Attempt input exceeding 6 digits: "123456789" -> should slice to 6
      fireEvent.change(pinField, { target: { value: '123456789' } });
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '123456' })
      );
    });

    it('Falls back to default "2026" when an empty string PIN is saved', () => {
      let currentConfig: StoreConfig = { ...DEFAULT_STORE_CONFIG, adminPin: '' };
      const onSaveConfig = vi.fn((newCfg: StoreConfig) => {
        currentConfig = newCfg;
      });

      render(
        <AdminPanel
          config={currentConfig}
          products={dummyProducts}
          onSaveConfig={onSaveConfig}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Unlock with master PIN 2026
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Go to settings and click save while adminPin is empty
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));
      fireEvent.click(screen.getByRole('button', { name: /guardar ajustes/i }));

      // Expect fallback to 2026
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '2026' })
      );
      expect(currentConfig.adminPin).toBe('2026');
    });

    it('Rejects empty string and whitespace-only PIN submissions during login', () => {
      render(
        <AdminPanel
          config={DEFAULT_STORE_CONFIG}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      const pinInput = screen.getByPlaceholderText('••••');
      const submitBtn = screen.getByRole('button', { name: /entrar/i });

      // Test 1: empty string
      fireEvent.change(pinInput, { target: { value: '' } });
      fireEvent.click(submitBtn);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();

      // Test 2: multiple spaces
      fireEvent.change(pinInput, { target: { value: '    ' } });
      fireEvent.click(submitBtn);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();

      // Test 3: tabs and newlines
      fireEvent.change(pinInput, { target: { value: '\t\n' } });
      fireEvent.click(submitBtn);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
    });
  });

  describe('Challenge 2: WhatsApp Phone Sanitization with Hyphens, Spaces, and Special Characters', () => {
    it('Sanitizes WhatsApp phone input in settings by stripping spaces, hyphens, and +', () => {
      const onSaveConfig = vi.fn();

      render(
        <AdminPanel
          config={DEFAULT_STORE_CONFIG}
          products={dummyProducts}
          onSaveConfig={onSaveConfig}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Login
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Settings tab
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      const phoneInput = screen.getByPlaceholderText('527225628061');

      // User types "+52 (722) 562-8061"
      fireEvent.change(phoneInput, { target: { value: '+52 (722) 562-8061' } });

      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({
          whatsappNumber: '527225628061',
        })
      );
    });

    it('createWhatsAppOrderUrl and createWhatsAppCakeQuoteUrl sanitize phone numbers with hyphens and spaces', () => {
      const dirtyPhone = '+52 722-562-8061';

      // 1. Order URL test
      const orderUrl = createWhatsAppOrderUrl(
        dirtyPhone,
        [],
        {
          type: 'pickup',
          deliveryCost: 0,
          customerName: 'Ana Gomez',
          phone: '7221234567',
          deliveryDate: '2026-12-01',
          deliveryTime: '14:00',
        },
        500,
        0,
        500
      );
      const targetPhone = orderUrl.split('?')[0];
      expect(targetPhone).toBe('https://wa.me/527225628061');
      expect(targetPhone).not.toContain('+');
      expect(targetPhone).not.toContain('-');

      // 2. Custom cake quote URL test
      const quoteUrl = createWhatsAppCakeQuoteUrl(dirtyPhone, {
        eventType: 'cumpleanos',
        tier: '1 Piso Clásico',
        servings: '12-15 porciones',
        flavor: 'vainilla',
        flavorName: 'Vainilla Francesa',
        filling: 'fresa',
        fillingName: 'Fresas Naturales',
        frosting: 'mantequilla',
        frostingName: 'Crema de Mantequilla',
        toppings: ['Fresas frescas'],
        candle: true,
        dedication: '¡Feliz Cumple!',
        estimatedPrice: 650,
        isSpecialArtDesign: false,
      });
      const quoteTargetPhone = quoteUrl.split('?')[0];
      expect(quoteTargetPhone).toBe('https://wa.me/527225628061');
      expect(quoteTargetPhone).not.toContain('+');
      expect(quoteTargetPhone).not.toContain('-');
    });
  });

  describe('Challenge 3: Master Fallback "2026" Dual Authentication Verification', () => {
    it('Allows login with master fallback 2026 when custom PIN "9876" is active', () => {
      const customConfig: StoreConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: '9876',
      };

      const { unmount } = render(
        <AdminPanel
          config={customConfig}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Verify custom PIN works
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '9876' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      unmount();

      // Verify master fallback 2026 works
      render(
        <AdminPanel
          config={customConfig}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Allows master fallback 2026 even when custom PIN is "0000"', () => {
      const zeroPinConfig: StoreConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: '0000',
      };

      render(
        <AdminPanel
          config={zeroPinConfig}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // Master PIN 2026 must still unlock
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });
  });

  describe('Challenge 4: Session Survival & Page Reload Across Full Unmounts', () => {
    it('Preserves storeName, instagramHandle, address, city, and phone across full component reloads', async () => {
      window.location.hash = '#admin';

      // First session: User edits all business fields in Admin Settings
      const { unmount } = render(<App />);

      // Login
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Switch to settings
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      // Edit storeName
      fireEvent.change(screen.getByPlaceholderText('Las chucherías de Becca'), {
        target: { value: 'Chucherías Gourmet Becca' },
      });

      // Edit instagramHandle
      fireEvent.change(screen.getByPlaceholderText('laschucheriasdebecca'), {
        target: { value: '@beccagourmet' }, // @ should be stripped
      });

      // Edit whatsappNumber
      fireEvent.change(screen.getByPlaceholderText('527225628061'), {
        target: { value: '+52 (722) 888-9900' },
      });

      // Edit address
      fireEvent.change(screen.getByPlaceholderText('Toluca, Estado de México'), {
        target: { value: 'Calle Real 450, Centro' },
      });

      // Edit city
      fireEvent.change(screen.getByPlaceholderText('Toluca y Metepec'), {
        target: { value: 'Toluca Bella' },
      });

      // Edit PIN
      fireEvent.change(screen.getByDisplayValue('2026'), {
        target: { value: '5566' },
      });

      // Click Guardar Ajustes
      fireEvent.click(screen.getByRole('button', { name: /guardar ajustes/i }));

      // Verify localStorage is updated
      await waitFor(() => {
        const raw = localStorage.getItem('chuches_config');
        expect(raw).not.toBeNull();
        const cfg = JSON.parse(raw!);
        expect(cfg.storeName).toBe('Chucherías Gourmet Becca');
        expect(cfg.instagramHandle).toBe('beccagourmet');
        expect(cfg.whatsappNumber).toBe('527228889900');
        expect(cfg.address).toBe('Calle Real 450, Centro');
        expect(cfg.city).toBe('Toluca Bella');
        expect(cfg.adminPin).toBe('5566');
      });

      // Simulating FULL PAGE UNLOAD: unmount entire app
      unmount();

      // Simulating FULL PAGE RELOAD: mount fresh App from localStorage
      window.location.hash = '#admin';
      render(<App />);

      // Verify login is shown
      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();

      // Test unlocking with new custom PIN '5566'
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '5566' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();

      // Go to settings tab and verify all saved values persisted!
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      expect(screen.getByDisplayValue('Chucherías Gourmet Becca')).toBeInTheDocument();
      expect(screen.getByDisplayValue('beccagourmet')).toBeInTheDocument();
      expect(screen.getByDisplayValue('527228889900')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Calle Real 450, Centro')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Toluca Bella')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5566')).toBeInTheDocument();
    });

    it('Resiliently recovers when localStorage has partial/corrupted fields without losing defaults', () => {
      // Partial state where some fields are missing
      const partialState = {
        storeName: 'Mi Tienda Custom',
        // address, city, adminPin are missing
      };
      localStorage.setItem('chuches_config', JSON.stringify(partialState));
      window.location.hash = '#admin';

      render(<App />);

      // PIN 2026 must still work
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();

      // Settings should show merged custom storeName and default address/city
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));
      expect(screen.getByDisplayValue('Mi Tienda Custom')).toBeInTheDocument();
      expect(screen.getByDisplayValue(DEFAULT_STORE_CONFIG.address)).toBeInTheDocument();
      expect(screen.getByDisplayValue(DEFAULT_STORE_CONFIG.city)).toBeInTheDocument();
    });
  });
});
