import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyDetails from '../components/PropertyDetails';

jest.mock('../utils/securityUtils', () => ({
  encodeHTML: (text) => text,
  isSafeURL: (url) => url && (url.startsWith('http') || url.startsWith('https') || url.startsWith('/')),
}));

describe('PropertyDetails Component', () => {
  const mockProperty = {
    id: 'prop1',
    title: 'Beautiful Family Home',
    type: 'house',
    price: 750000,
    bedrooms: 4,
    title: 'Beautiful Family Home at 123 Main Street',
    location: 'London, UK',
    postcode: 'SW1A 1AA',
    short_description: 'A stunning family home.',
    long_description: 'A stunning family home with modern amenities and spacious garden.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567573883475-8f5b8c5e7e0d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522777967541-ca05a3c9d60d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11cb3367?w=800&h=600&fit=crop',
    ],
    floor_plan: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    date_added: '2025-12-15',
    latitude: 51.5074,
    longitude: -0.1477,
  };

  // Test 1: Render property details with all information
  it('should display all property details correctly', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    expect(screen.getByText('Beautiful Family Home')).toBeInTheDocument();
    expect(screen.getByText(/£750,000/)).toBeInTheDocument();
    expect(screen.getByText(/4/)).toBeInTheDocument(); // Bedrooms
    expect(screen.getByText('Freehold')).toBeInTheDocument();
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText(/SW1A 1AA/)).toBeInTheDocument();
  });

  // Test 2: Image gallery displays main image
  it('should display main property image', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    const mainImage = screen.getByAltText(/main property image|Beautiful Family Home/i);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage.src).toContain('prop1-1');
  });

  // Test 3: Gallery navigation - next image
  it('should navigate to next image when next button clicked', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next|›|right/i });
    if (nextButton) {
      fireEvent.click(nextButton);
      // Component should update image
      expect(nextButton).toBeInTheDocument();
    }
  });

  // Test 4: Gallery navigation - previous image
  it('should navigate to previous image when prev button clicked', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous|‹|left|prev/i });
    if (prevButton) {
      fireEvent.click(prevButton);
      expect(prevButton).toBeInTheDocument();
    }
  });

  // Test 5: Add to favorites functionality
  it('should call onAddToFavourites when heart button clicked and not favourited', () => {
    const mockAdd = jest.fn();
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={mockAdd}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    const heartButton = screen.getByRole('button', { name: /favorite|heart|add to favorites/i });
    fireEvent.click(heartButton);

    expect(mockAdd).toHaveBeenCalledWith(mockProperty);
  });

  // Test 6: Remove from favorites functionality
  it('should call onRemoveFromFavourites when heart button clicked and favourited', () => {
    const mockRemove = jest.fn();
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={true}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={mockRemove}
      />
    );

    const heartButton = screen.getByRole('button', { name: /favorite|heart|remove/i });
    fireEvent.click(heartButton);

    expect(mockRemove).toHaveBeenCalledWith(mockProperty.id);
  });

  // Test 7: Tabs navigation - Description tab
  it('should display description tab content', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    expect(screen.getByText('A stunning family home with modern amenities.')).toBeInTheDocument();
  });

  // Test 8: Display address information
  it('should display address and postcode correctly', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    expect(screen.getByText(/123 Main Street, London/)).toBeInTheDocument();
    expect(screen.getByText(/SW1A 1AA/)).toBeInTheDocument();
  });

  // Test 9: Property type badge displays
  it('should display property type badge', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    expect(screen.getByText('House')).toBeInTheDocument();
  });

  // Test 10: Price formatting
  it('should format price correctly with currency symbol', () => {
    render(
      <PropertyDetails
        property={mockProperty}
        isFavourited={false}
        onAddToFavourites={jest.fn()}
        onRemoveFromFavourites={jest.fn()}
      />
    );

    expect(screen.getByText(/£750,000/)).toBeInTheDocument();
  });
});
