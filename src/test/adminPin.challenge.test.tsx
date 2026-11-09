import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminPanel } from '../components/AdminPanel';
import { App } from '../App';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { StoreConfig } from '../types';

describe('Adversarial Stress Harness: Milestone 1 Admin PIN & Settings Sync', () => {
  const dummyProducts = [
    {
      id: 'stress-prod-1',
      name: 'Pastel de Chocolate',
      price: 320,
      category: 'pasteles' as const,
      description: 'Test stress description',
      image: 'https://example.com/test.jpg',
      available: true,
      preparationTime: '24 hrs',
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();
  });

  // =========================================================================
  // 1. WHITESPACE INJECTIONS
  // =========================================================================
  describe('1. Whitespace Injections', () => {
    it('accepts leading and trailing tabs (\\t2026\\t)', () => {
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
      fireEvent.change(pinInput, { target: { value: '\t2026\t' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('accepts leading and trailing newlines (\\n2026\\n and \\r\\n2026\\r\\n)', () => {
      const { unmount } = render(
        <AdminPanel
          config={DEFAULT_STORE_CONFIG}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      // \n
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '\n2026\n' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      unmount();

      // \r\n
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
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '\r\n2026\r\n' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('accepts mixed whitespace combinations ("  \\t\\n 2026 \\t\\n  ")', () => {
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

      // Note: maxLength is 10 on the input, so length of string should fit in 10 or test truncation
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: ' \t2026\n ' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('accepts non-breaking space (\\u00A02026\\u00A0)', () => {
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

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '\u00A02026\u00A0' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('rejects internal whitespace ("20 26") without unlocking', () => {
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

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '20 26' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
    });

    it('rejects whitespace-only inputs ("    ", "\\t\\n")', () => {
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

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '    ' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. TYPE EDGE CASES & SPECIAL CHARACTERS
  // =========================================================================
  describe('2. Type Edge Cases & Special Characters', () => {
    it('rejects hexadecimal, scientific notation, and sign prefixes (0x7EA, 2e3, +2026)', () => {
      const candidates = ['0x7EA', '2e3', '+2026', '-2026', '2026.0'];

      for (const candidate of candidates) {
        const { unmount } = render(
          <AdminPanel
            config={DEFAULT_STORE_CONFIG}
            products={dummyProducts}
            onSaveConfig={vi.fn()}
            onSaveProducts={vi.fn()}
            onClose={vi.fn()}
            onResetDefaults={vi.fn()}
          />
        );

        fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: candidate } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
        unmount();
      }
    });

    it('rejects SQL injection / XSS payloads without error or crash', () => {
      const malicious = ["' OR 1=1", '<script>', 'admin" --', '${7*7}'];

      for (const payload of malicious) {
        const { unmount } = render(
          <AdminPanel
            config={DEFAULT_STORE_CONFIG}
            products={dummyProducts}
            onSaveConfig={vi.fn()}
            onSaveProducts={vi.fn()}
            onClose={vi.fn()}
            onResetDefaults={vi.fn()}
          />
        );

        fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: payload } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
        unmount();
      }
    });

    it('supports custom PINs with leading zeros ("0042") while keeping master fallback "2026"', () => {
      const leadingZeroConfig: StoreConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: '0042',
      };

      // Test logging in with '0042'
      const { unmount } = render(
        <AdminPanel
          config={leadingZeroConfig}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '0042' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      unmount();

      // Test logging in with master fallback '2026'
      render(
        <AdminPanel
          config={leadingZeroConfig}
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

    it('safely handles numeric type in config.adminPin ({ adminPin: 9999 as any })', () => {
      const numericConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: 9999 as any,
      };

      render(
        <AdminPanel
          config={numericConfig}
          products={dummyProducts}
          onSaveConfig={vi.fn()}
          onSaveProducts={vi.fn()}
          onClose={vi.fn()}
          onResetDefaults={vi.fn()}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '9999' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('safely handles non-string/corrupted adminPin in config ({ adminPin: {} as any }) and unlocks via 2026', () => {
      const corruptedConfig = {
        ...DEFAULT_STORE_CONFIG,
        adminPin: {} as any,
      };

      render(
        <AdminPanel
          config={corruptedConfig}
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
  });

  // =========================================================================
  // 3. CACHE CORRUPTION & MALFORMED LOCALSTORAGE IN APP
  // =========================================================================
  describe('3. Cache Corruption & Malformed LocalStorage', () => {
    const malformedEntries = [
      { name: 'null primitive string', raw: 'null' },
      { name: 'number primitive string', raw: '12345' },
      { name: 'boolean primitive string', raw: 'true' },
      { name: 'plain string primitive', raw: '"plain_string"' },
      { name: 'empty object', raw: '{}' },
      { name: 'empty array', raw: '[]' },
      { name: 'array with elements', raw: '[1, 2, 3]' },
      { name: 'unclosed JSON', raw: '{"adminPin": 2026' },
      { name: 'HTML/XML junk', raw: '<xml><config>bad</config></xml>' },
      { name: 'object with null values', raw: '{"adminPin": null, "storeName": null}' },
      { name: 'object with undefined as string', raw: '{"adminPin": "undefined"}' },
      { name: 'object with whitespace only adminPin', raw: '{"adminPin": "   "}' },
      { name: 'object with zero as number', raw: '{"adminPin": 0}' },
    ];

    malformedEntries.forEach(({ name, raw }) => {
      it(`gracefully recovers from ${name} and unlocks with 2026`, () => {
        localStorage.setItem('chuches_config', raw);
        window.location.hash = '#admin';

        render(<App />);

        expect(screen.getByText('Panel de Administración')).toBeInTheDocument();

        const pinInput = screen.getByPlaceholderText('••••');
        fireEvent.change(pinInput, { target: { value: '2026' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // 4. DOUBLE SUBMISSIONS, RAPID INTERACTIONS & EVENT MODES
  // =========================================================================
  describe('4. Double Submissions & Rapid Interactions', () => {
    it('handles rapid double submission of valid PIN without error or inconsistent state', () => {
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
      const form = pinInput.closest('form')!;

      fireEvent.change(pinInput, { target: { value: '2026' } });
      // Fire two submits synchronously
      fireEvent.submit(form);
      fireEvent.submit(form);

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('handles typing invalid PIN, seeing error, then immediately submitting valid PIN 2026', () => {
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

      // Step 1: wrong PIN
      fireEvent.change(pinInput, { target: { value: '0000' } });
      fireEvent.click(submitBtn);

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Step 2: enter correct PIN
      fireEvent.change(pinInput, { target: { value: '2026' } });
      // alert should have cleared on change
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      fireEvent.click(submitBtn);
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });

    it('submitting empty PIN immediately shows error without crash', () => {
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
      const form = pinInput.closest('form')!;

      fireEvent.change(pinInput, { target: { value: '' } });
      fireEvent.submit(form);

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Panel de Becca')).not.toBeInTheDocument();
    });

    it('rapid typing and deleting keeps state consistent', () => {
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

      fireEvent.change(pinInput, { target: { value: '9' } });
      fireEvent.change(pinInput, { target: { value: '99' } });
      fireEvent.change(pinInput, { target: { value: '' } });
      fireEvent.change(pinInput, { target: { value: '2' } });
      fireEvent.change(pinInput, { target: { value: '20' } });
      fireEvent.change(pinInput, { target: { value: '202' } });
      fireEvent.change(pinInput, { target: { value: '2026' } });

      fireEvent.submit(pinInput.closest('form')!);

      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 5. SETTINGS TAB ADVERSARIAL SANITIZATION & ROUNDTRIP SYNC
  // =========================================================================
  describe('5. Settings Tab Adversarial Inputs & Roundtrip Sync', () => {
    it('sanitizes alphabetic, symbols, spaces, and trims to max 6 digits', () => {
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

      // Go to settings tab
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      const pinField = screen.getByDisplayValue('2026');

      // Inject adversarial letters and symbols
      fireEvent.change(pinField, { target: { value: 'abc@#$5678def' } });
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '5678' })
      );

      // Inject more than 6 digits
      fireEvent.change(pinField, { target: { value: '1234567890' } });
      expect(onSaveConfig).toHaveBeenLastCalledWith(
        expect.objectContaining({ adminPin: '123456' })
      );
    });

    it('roundtrip persistence: changes in settings update localStorage and allow login on next load', async () => {
      window.location.hash = '#admin';
      const { unmount } = render(<App />);

      // Login initially with master 2026
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Switch to settings
      fireEvent.click(screen.getByRole('button', { name: /ajustes de tienda/i }));

      // Set new PIN to 7788
      const pinField = screen.getByDisplayValue('2026');
      fireEvent.change(pinField, { target: { value: '7788' } });

      // Click save
      fireEvent.click(screen.getByRole('button', { name: /guardar ajustes/i }));

      await waitFor(() => {
        const saved = JSON.parse(localStorage.getItem('chuches_config')!);
        expect(saved.adminPin).toBe('7788');
      });

      unmount();

      // Now reload App: verify 7788 unlocks
      const app2 = render(<App />);
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '7788' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
      app2.unmount();

      // Also verify master fallback 2026 STILL unlocks
      render(<App />);
      fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
      expect(screen.getByText('Panel de Becca')).toBeInTheDocument();
    });
  });
});
