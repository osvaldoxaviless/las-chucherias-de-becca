import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../App';
import { Hero } from '../components/Hero';
import { HeroPastryPhotos } from '../components/HeroPastryPhotos';
import { SeasonSelectorModal } from '../components/SeasonSelectorModal';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { DEFAULT_SEASONS, getActiveSeasonConfig } from '../data/seasons';
import { StoreConfig } from '../types';

describe('Seasonal Customization Layers & Editable Hero Pastry Photos', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. HeroPastryPhotos Component', () => {
    it('renders default classic season cards with images and labels', () => {
      render(
        <HeroPastryPhotos
          cards={DEFAULT_SEASONS.regular.cards}
          isEditMode={false}
        />
      );

      // Verify labels are displayed
      expect(screen.getByText('🎂 Pasteles de Diseño')).toBeDefined();
      expect(screen.getByText('🍪 Repostería Artesanal')).toBeDefined();
      expect(screen.getByText('🧁 Horneado al Día')).toBeDefined();

      // Verify images are rendered
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThanOrEqual(3);
      expect(images[0].getAttribute('src')).toBe('/images/cake-monkey.jpg');
    });

    it('renders edit buttons and editable inputs when isEditMode is true', () => {
      const mockChangeImage = vi.fn();
      const mockUpdateLabel = vi.fn();

      render(
        <HeroPastryPhotos
          cards={DEFAULT_SEASONS.regular.cards}
          isEditMode={true}
          onTriggerChangeCardImage={mockChangeImage}
          onUpdateCardLabel={mockUpdateLabel}
        />
      );

      // Buttons to change photo
      const changeButtons = screen.getAllByRole('button', { name: /cambiar foto/i });
      expect(changeButtons.length).toBe(3);

      fireEvent.click(changeButtons[0]);
      expect(mockChangeImage).toHaveBeenCalledWith('left');

      // Inputs to edit label
      const leftInput = screen.getByDisplayValue('🎂 Pasteles de Diseño');
      fireEvent.change(leftInput, { target: { value: '🎂 Pasteles Gourmet' } });
      expect(mockUpdateLabel).toHaveBeenCalledWith('left', '🎂 Pasteles Gourmet');
    });
  });

  describe('2. Seasonal Switching & Atmospheric Layers', () => {
    it('adapts hero cards, badge, and confetti when switching between seasons', () => {
      const configNavidad: StoreConfig = {
        ...DEFAULT_STORE_CONFIG,
        activeSeason: 'navidad',
      };

      const { container } = render(
        <Hero
          config={configNavidad}
          onExploreCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          isEditMode={false}
        />
      );

      // In Navidad, cards should have Christmas copy and images
      expect(screen.getByText('🎄 Pasteles Navideños')).toBeDefined();
      expect(screen.getByText('🏠 Casitas de Jengibre')).toBeDefined();
      expect(screen.getByText('🧁 Cupcakes Navideños')).toBeDefined();

      // Christmas snowflakes atmospheric particles
      expect(container.textContent).toContain('❄');
    });

    it('renders Season selector bar in Hero when isEditMode is true', () => {
      const mockSelectSeason = vi.fn();
      const mockOpenModal = vi.fn();

      render(
        <Hero
          config={DEFAULT_STORE_CONFIG}
          onExploreCatalog={vi.fn()}
          onScrollToCustomizer={vi.fn()}
          isEditMode={true}
          onSelectSeason={mockSelectSeason}
          onOpenSeasonModal={mockOpenModal}
        />
      );

      // Season buttons in Hero
      const navidadBtn = screen.getByRole('button', { name: /Navidad & Fin de Año/i });
      expect(navidadBtn).toBeDefined();

      fireEvent.click(navidadBtn);
      expect(mockSelectSeason).toHaveBeenCalledWith('navidad');

      const capasBtn = screen.getByRole('button', { name: /Capas/i });
      fireEvent.click(capasBtn);
      expect(mockOpenModal).toHaveBeenCalled();
    });
  });

  describe('3. SeasonSelectorModal Management Dialog', () => {
    it('allows previewing seasons, toggling atmosphere, and activating a season', () => {
      const mockSelectSeason = vi.fn();
      const mockToggleAtmosphere = vi.fn();
      const mockResetDefaults = vi.fn();
      const mockClose = vi.fn();

      render(
        <SeasonSelectorModal
          isOpen={true}
          config={DEFAULT_STORE_CONFIG}
          onSelectSeason={mockSelectSeason}
          onTriggerChangeCardImage={vi.fn()}
          onUpdateCardLabel={vi.fn()}
          onToggleAtmosphere={mockToggleAtmosphere}
          onResetSeasonDefaults={mockResetDefaults}
          onClose={mockClose}
        />
      );

      expect(screen.getByText('Capas de Personalización por Temporada')).toBeDefined();

      // Select San Valentín tab
      const valentinTab = screen.getByRole('button', { name: /San Valentín & Amor/i });
      fireEvent.click(valentinTab);

      // Click "Activar en Tienda Ahora"
      const activateBtn = screen.getByRole('button', { name: /Activar en Tienda Ahora/i });
      fireEvent.click(activateBtn);
      expect(mockSelectSeason).toHaveBeenCalledWith('san-valentin');

      // Toggle atmosphere
      const atmosphereToggle = screen.getByRole('button', { name: /Activado ✨/i });
      fireEvent.click(atmosphereToggle);
      expect(mockToggleAtmosphere).toHaveBeenCalledWith(false);

      // Close modal
      const closeBtn = screen.getByRole('button', { name: /Listo \/ Cerrar/i });
      fireEvent.click(closeBtn);
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('4. End-to-End Live Edit Integration in App', () => {
    it('unlocks live edit with PIN 2026 and allows switching active season', async () => {
      render(<App />);

      // Open admin modal via footer lock button
      const adminButtons = screen.getAllByRole('button');
      const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock') || b.textContent?.includes('Panel de Becca'));
      expect(adminLockBtn).toBeDefined();
      fireEvent.click(adminLockBtn!);

      // Enter PIN 2026
      const pinInput = screen.getByPlaceholderText('••••');
      fireEvent.change(pinInput, { target: { value: '2026' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      // Click "Modo Edición en Tienda"
      const liveEditBtn = screen.getByRole('button', { name: /Modo Edición en Tienda/i });
      fireEvent.click(liveEditBtn);

      // Live edit bar should be present
      expect(screen.getByText('Modo Edición en Vivo')).toBeDefined();

      // Click "Temporada" in the top LiveEditBar
      const seasonBarBtn = screen.getByRole('button', { name: /temporada/i });
      fireEvent.click(seasonBarBtn);

      // SeasonSelectorModal opens
      expect(screen.getByText('Capas de Personalización por Temporada')).toBeDefined();

      // Switch to Halloween & Día de Muertos inside modal
      const halloweenTabs = screen.getAllByRole('button', { name: /Halloween & Día de Muertos/i });
      fireEvent.click(halloweenTabs[halloweenTabs.length - 1]);

      const activateBtn = screen.getByRole('button', { name: /Activar en Tienda Ahora/i });
      fireEvent.click(activateBtn);

      // Close modal
      const closeBtn = screen.getByRole('button', { name: /Listo \/ Cerrar/i });
      fireEvent.click(closeBtn);

      // Verify Halloween cards are now displayed in the store (as editable input value or image alt)
      await waitFor(() => {
        expect(screen.getByDisplayValue('👻 Pasteles Espeluznantes')).toBeDefined();
      });
    });
  });
});
