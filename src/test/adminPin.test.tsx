import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminPanel } from '../components/AdminPanel';
import { App } from '../App';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { StoreConfig } from '../types';

describe('Admin PIN Authentication and Settings Sync (Milestone 1)', () => {
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

  describe('AdminPanel Unit Tests', () => {
    it('PIN 2026 unlocks the panel without error', () => {
      const onSaveConfig = vi.fn();
      const onSaveProducts = vi.fn();
      const onClose = vi.fn();
      const onResetDefaults = vi.fn();

      render(
        <AdminPanel
          config={DEFAULT_STORE_CONFIG}
          products={dummyProducts}
          onSaveConfig={onSaveConfig}
          onSaveProducts={onSaveProducts}
          onClose={onClose}
          onResetDefaults={onResetDefaults}
        />
      );

      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      const pinInput = screen.getByPlaceholderText('••••');
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(submitButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      expect(screen.getByText(/Postres/)).toBeInTheDocument();
    });

    it('Whitespace around PIN (e.g. " 2026 ") is accepted and trimmed', () => {
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
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      fireEvent.change(pinInput, { target: { value: ' 2026 ' } });
      fireEvent.click(submitButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Invalid PINs are rejected and show error state', () => {
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
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      fireEvent.change(pinInput, { target: { value: '9999' } });
      fireEvent.click(submitButton);

      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent(/PIN incorrecto/i);
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
    });

    it('Custom PIN allows both the custom PIN and master fallback 2026', () => {
      const customConfig: StoreConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: '4321',
      };

      // Test with custom PIN
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

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '4321' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      unmount();

      // Test with master fallback PIN 2026
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

    it('Settings tab renders all business fields and sanitizes numeric PIN', async () => {
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

      // Unlock panel
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Switch to settings tab
      const settingsTabButton = screen.getByRole('button', { name: /ajustes de tienda/i });
      fireEvent.click(settingsTabButton);

      // Verify business fields exist
      expect(screen.getByText('Nombre de la Tienda')).toBeInTheDocument();
      expect(screen.getByText('Usuario de Instagram')).toBeInTheDocument();
      expect(screen.getByText('Dirección del Taller (Retiro en tienda)')).toBeInTheDocument();
      expect(screen.getByText('Ciudad o Zona de Cobertura')).toBeInTheDocument();

      // Test PIN input sanitization (letters stripped out)
      const pinSettingInput = screen.getByDisplayValue('2026');
      fireEvent.change(pinSettingInput, { target: { value: 'abc987xyz' } });

      expect(onSaveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          adminPin: '987',
        })
      );

      // Test modern inline feedback upon clicking Guardar Ajustes (no alert)
      const saveButton = screen.getByRole('button', { name: /guardar ajustes/i });
      fireEvent.click(saveButton);

      expect(await screen.findByRole('status')).toHaveTextContent(/¡Ajustes guardados correctamente!/i);
    });
  });

  describe('App Integration & LocalStorage Hydration', () => {
    it('Legacy/missing localStorage without adminPin gracefully falls back to 2026 and unlocks', async () => {
      // Simulate older cached state without adminPin field
      const legacyState = {
        storeName: 'Antigua Pastelería',
        whatsappNumber: '527221112233',
        // adminPin is omitted
      };
      localStorage.setItem('chuches_config', JSON.stringify(legacyState));

      // Open admin modal via URL hash
      window.location.hash = '#admin';

      render(<App />);

      // Verify PIN login is shown
      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();

      // Enter master default PIN 2026
      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Panel must unlock cleanly
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Corrupted JSON in localStorage gracefully recovers and unlocks with 2026', () => {
      localStorage.setItem('chuches_config', 'NOT_VALID_JSON_{}');
      window.location.hash = '#admin';

      render(<App />);

      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Settings updates persist to localStorage correctly', async () => {
      window.location.hash = '#admin';
      render(<App />);

      // Unlock
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Switch to settings
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      // Change store name
      const storeNameInput = screen.getByPlaceholderText('Las chucherías de Becca');
      fireEvent.change(storeNameInput, { target: { value: 'Becca Boutique & Bakery' } });

      // Change whatsapp number
      const whatsappInput = screen.getByPlaceholderText('527225628061');
      fireEvent.change(whatsappInput, { target: { value: '527229998877' } });

      // Save settings
      fireEvent.click(screen.getByRole('button', { name: /guardar ajustes/i }));

      await waitFor(() => {
        const stored = localStorage.getItem('chuches_config');
        expect(stored).not.toBeNull();
        const parsed = JSON.parse(stored!);
        expect(parsed.storeName).toBe('Becca Boutique & Bakery');
        expect(parsed.whatsappNumber).toBe('527229998877');
        expect(parsed.adminPin).toBe('2026');
      });
    });

    it('Numeric stored PIN in localStorage ({ adminPin: 2026 }) is safely coerced to string and unlocks', () => {
      localStorage.setItem('chuches_config', JSON.stringify({ adminPin: 2026 }));
      window.location.hash = '#admin';

      render(<App />);

      expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Empty string stored PIN in localStorage falls back to master 2026', () => {
      localStorage.setItem('chuches_config', JSON.stringify({ adminPin: '' }));
      window.location.hash = '#admin';

      render(<App />);

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Form submission via Enter key inside PIN input unlocks panel', () => {
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
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.submit(pinInput.closest('form')!);

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('Typing after an invalid PIN error clears the error alert', () => {
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
      fireEvent.change(pinInput, { target: { value: '0000' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Typing new character should clear the error alert
      fireEvent.change(pinInput, { target: { value: '2' } });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

