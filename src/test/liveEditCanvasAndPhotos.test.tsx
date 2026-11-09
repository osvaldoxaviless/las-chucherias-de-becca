import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { App } from '../App';

describe('Canvas Block Editor & Live Photo Customization', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();
  });

  const enterLiveEditMode = () => {
    // Find footer admin button
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock') || b.textContent?.includes('Panel de Becca'));
    expect(adminLockBtn).toBeDefined();
    fireEvent.click(adminLockBtn!);

    // PIN 2026
    const pinInput = screen.getByPlaceholderText('••••');
    fireEvent.change(pinInput, { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Click "Modo Edición en Tienda"
    const liveEditButton = screen.getByRole('button', { name: 'Modo Edición en Tienda' });
    fireEvent.click(liveEditButton);
  };

  it('renders block badges and canvas move/hide controls for each section in live edit mode', () => {
    render(<App />);
    enterLiveEditMode();

    // Canvas Block wrappers should display section names
    expect(screen.getByText('Portada Hero')).toBeInTheDocument();
    expect(screen.getByText('Catálogo de Postres')).toBeInTheDocument();
    expect(screen.getByText('Arma tu Pastel (Atelier)')).toBeInTheDocument();
    expect(screen.getAllByText('Galería de Referencias').length).toBeGreaterThan(0);
    expect(screen.getByText('Sobre Becca (Nosotros)')).toBeInTheDocument();
    expect(screen.getByText('Preguntas Frecuentes')).toBeInTheDocument();
  });

  it('allows opening BlocksOrganizerModal to reorder and hide blocks', async () => {
    render(<App />);
    enterLiveEditMode();

    // Click [🧩 Bloques] in the LiveEditBar
    const blocksBtn = screen.getByRole('button', { name: /Bloques/i });
    fireEvent.click(blocksBtn);

    // Modal opens
    const modalHeading = screen.getByText('Canvas: Organizar Bloques');
    expect(modalHeading).toBeInTheDocument();
    const modalContainer = modalHeading.closest('.fixed')!;

    // Find all hide buttons inside the modal
    const hideButtons = within(modalContainer as HTMLElement).getAllByTitle('Ocultar');
    expect(hideButtons.length).toBeGreaterThan(0);

    // Click to hide the last block (FAQ)
    fireEvent.click(hideButtons[hideButtons.length - 1]);

    // Close modal via "Listo" button
    const closeBtn = within(modalContainer as HTMLElement).getByRole('button', { name: /Listo/i });
    fireEvent.click(closeBtn);

    // Save and terminate
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // In customer view, the hidden FAQ block should not be rendered
    expect(screen.queryByText('Dudas Frecuentes')).not.toBeInTheDocument();

    // LocalStorage config should reflect hiddenBlocks
    const savedConfig = JSON.parse(localStorage.getItem('chuches_config') || '{}');
    expect(savedConfig.hiddenBlocks).toContain('faq');
  });

  it('displays photo replacement triggers in CakeCustomizer in live edit mode', () => {
    render(<App />);
    enterLiveEditMode();

    // In edit mode, tier options show "Cambiar foto real" buttons
    const changeTierPhotoBtns = screen.getAllByText('Cambiar foto real');
    expect(changeTierPhotoBtns.length).toBeGreaterThan(0);

    // Active tier exterior preview also shows "Cambiar Foto"
    expect(screen.getByText(/Cambiar Foto \(1 Piso Redondo\)/i)).toBeInTheDocument();
  });

  it('allows adding and editing portfolio references directly in live edit mode', async () => {
    render(<App />);
    enterLiveEditMode();

    // Portfolio section has "+ Agregar Referencia" buttons (header button & card)
    const addRefButtons = screen.getAllByText('+ Agregar Referencia');
    expect(addRefButtons.length).toBeGreaterThan(0);

    // Click "+ Agregar Referencia"
    fireEvent.click(addRefButtons[0]);

    // A new reference item is added with editable title
    const refInputs = screen.getAllByPlaceholderText('Título del pastel...');
    expect(refInputs.length).toBeGreaterThan(0);

    // Edit title of the last reference
    const lastInput = refInputs[refInputs.length - 1];
    fireEvent.change(lastInput, { target: { value: 'Pastel Unicornio Edición Especial' } });

    // Save and exit edit mode
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // In normal customer view, the new reference title should be rendered
    expect(screen.getByText('Pastel Unicornio Edición Especial')).toBeInTheDocument();

    // LocalStorage should persist the updated portfolio
    const savedConfig = JSON.parse(localStorage.getItem('chuches_config') || '{}');
    expect(savedConfig.portfolioItems.some((item: any) => item.title === 'Pastel Unicornio Edición Especial')).toBe(true);
  });
});
