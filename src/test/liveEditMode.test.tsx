import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';
import { DEFAULT_STORE_CONFIG } from '../data/config';
import { INITIAL_PRODUCTS } from '../data/products';

describe('Live In-Place Edit Mode ("Modo Edición en Tienda Real")', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    vi.clearAllMocks();
  });

  it('renders LiveEditBar when admin enters live edit mode', async () => {
    render(<App />);

    // Click footer admin lock button
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock') || b.textContent?.includes('Panel de Becca'));
    expect(adminLockBtn).toBeDefined();
    fireEvent.click(adminLockBtn!);

    // Enter PIN 2026
    const pinInput = screen.getByPlaceholderText('••••');
    fireEvent.change(pinInput, { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Now inside AdminPanel: click "Modo Edición en Tienda"
    const liveEditButton = screen.getByRole('button', { name: 'Modo Edición en Tienda' });
    fireEvent.click(liveEditButton);

    // LiveEditBar should now be in the document
    expect(screen.getByText('Modo Edición en Vivo')).toBeInTheDocument();
    expect(screen.getByText(/exactamente como la ve el cliente/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar y Terminar/i })).toBeInTheDocument();
  });

  it('allows editing Hero texts directly in-place and saves them', async () => {
    render(<App />);

    // Open admin and activate live edit
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock'));
    fireEvent.click(adminLockBtn!);

    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Modo Edición en Tienda/i }));

    // Find the in-place editable hero title
    const heroTitleTextarea = screen.getByPlaceholderText(/Escribe el titular principal de la portada/i);
    expect(heroTitleTextarea).toBeInTheDocument();

    // Change hero title
    fireEvent.change(heroTitleTextarea, {
      target: { value: '¡Pasteles Mágicos para Momentos Inolvidables!' },
    });

    // Save and terminate session
    const saveButton = screen.getByRole('button', { name: /Guardar y Terminar/i });
    fireEvent.click(saveButton);

    // Edit bar should be gone (session ended)
    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // Client view should now reflect the updated headline!
    expect(screen.getByText('¡Pasteles Mágicos para Momentos Inolvidables!')).toBeInTheDocument();

    // LocalStorage should be updated
    const savedConfig = JSON.parse(localStorage.getItem('chuches_config') || '{}');
    expect(savedConfig.heroTitle).toBe('¡Pasteles Mágicos para Momentos Inolvidables!');
  });

  it('allows in-place editing of product price and availability toggle', async () => {
    render(<App />);

    // Open admin and activate live edit
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock'));
    fireEvent.click(adminLockBtn!);

    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Modo Edición en Tienda/i }));

    // Availability toggle on first product
    const availableBtns = screen.getAllByTitle(/Toca para cambiar entre Disponible o Agotado/i);
    expect(availableBtns.length).toBeGreaterThan(0);
    fireEvent.click(availableBtns[0]); // Toggle to Agotado

    // Price input on first product
    const priceInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(priceInputs[0], { target: { value: '380' } });

    // Save and terminate
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // Check localStorage
    const savedProducts = JSON.parse(localStorage.getItem('chuches_products') || '[]');
    expect(savedProducts[0].price).toBe(380);
    expect(savedProducts[0].available).toBe(false);
  });

  it('provides "+ Agregar Nuevo Postre" card inside catalog in live edit mode', async () => {
    render(<App />);

    // Open admin and activate live edit
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock'));
    fireEvent.click(adminLockBtn!);

    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    fireEvent.click(screen.getByRole('button', { name: /Modo Edición en Tienda/i }));

    // The add product card should be visible
    expect(screen.getByText('+ Agregar Nuevo Postre')).toBeInTheDocument();

    // Click it to open AddProductModal
    fireEvent.click(screen.getByText('+ Agregar Nuevo Postre'));
    expect(screen.getByText('Agregar Nuevo Postre al Menú')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Ej: Fresas con Chocolate Belga/i), {
      target: { value: 'Cupcake Arcoíris Gigante' },
    });
    fireEvent.change(screen.getByPlaceholderText('180'), {
      target: { value: '95' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Añadir al Menú/i }));

    // Product should appear in menu
    expect(screen.getByDisplayValue('Cupcake Arcoíris Gigante')).toBeInTheDocument();

    // Save and end session
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // In normal client view, product is visible
    expect(screen.getByText('Cupcake Arcoíris Gigante')).toBeInTheDocument();
  });

  it('allows editing the top announcement banner text in live edit mode', async () => {
    render(<App />);

    // Open admin and activate live edit
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock'));
    fireEvent.click(adminLockBtn!);

    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Modo Edición en Tienda' }));

    // Find banner input
    const bannerInput = screen.getByPlaceholderText(/Escribe el aviso superior/i);
    expect(bannerInput).toBeInTheDocument();

    fireEvent.change(bannerInput, {
      target: { value: '¡Horneando pedidos especiales para Navidad!' },
    });

    // Save and terminate
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    // Check banner in customer view
    expect(screen.getByText('¡Horneando pedidos especiales para Navidad!')).toBeInTheDocument();
  });

  it('allows opening QuickSettingsModal to update store contact info and PIN', async () => {
    render(<App />);

    // Open admin and activate live edit
    const adminButtons = screen.getAllByRole('button');
    const adminLockBtn = adminButtons.find((b) => b.querySelector('svg.lucide-lock'));
    fireEvent.click(adminLockBtn!);

    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '2026' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Modo Edición en Tienda' }));

    // Click Ajustes & PIN button in LiveEditBar
    const settingsBtn = screen.getByRole('button', { name: /Ajustes & PIN|Ajustes/i });
    fireEvent.click(settingsBtn);

    // Modal should be open
    expect(screen.getByText('Ajustes de Tienda & PIN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('527225628061')).toBeInTheDocument();

    // Change WhatsApp and address
    fireEvent.change(screen.getByPlaceholderText('527225628061'), {
      target: { value: '527229998877' },
    });
    fireEvent.change(screen.getByPlaceholderText('Toluca, Estado de México'), {
      target: { value: 'Metepec Centro 45' },
    });

    // Apply
    fireEvent.click(screen.getByRole('button', { name: /Aplicar/i }));

    // Modal closed
    expect(screen.queryByText('Ajustes de Tienda & PIN')).not.toBeInTheDocument();

    // Save & exit live edit
    fireEvent.click(screen.getByRole('button', { name: /Guardar y Terminar/i }));

    await waitFor(() => {
      expect(screen.queryByText('Modo Edición en Vivo')).not.toBeInTheDocument();
    });

    const savedConfig = JSON.parse(localStorage.getItem('chuches_config') || '{}');
    expect(savedConfig.whatsappNumber).toBe('527229998877');
    expect(savedConfig.address).toBe('Metepec Centro 45');
  });
});
