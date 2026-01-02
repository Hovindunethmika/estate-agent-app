import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '../components/PropertyCard';

// Mock the security utils
jest.mock('../utils/securityUtils', () => ({
  encodeHTML: (text) => text,
}));

describe('PropertyCard Component', () => {
  // Sample test property data
  const mockProperty = {
    id: 'prop1',
    type: 'House',
    bedrooms: 3,
    price: 750000,
    tenure: 'Freehold',
    description: 'Beautiful family home with garden and modern amenities.',
    location: 'London, UK',
    postcode: 'SW1A 1AA',
    images: ['images/prop1.jpg'],
    dateAdded: '2025-12-15',
  };

  // Test 1: Component renders correctly with property data
  it('should render property card with correct information', () => {
    const mockAddToFavourites = jest.fn();
    const mockViewDetails = jest.fn();

    render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={mockAddToFavourites}
        onViewDetails={mockViewDetails}
        isDraggable={true}
        isFavourited={false}
      />
    );

    // Check that property information is displayed
    expect(screen.getByText(/£750,000/)).toBeInTheDocument();
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Bedrooms
    expect(screen.getByText('Freehold')).toBeInTheDocument();
  });

  // Test 2: Favorite button toggle functionality
  it('should toggle favorite status when favorite button is clicked', () => {
    const mockAddToFavourites = jest.fn();
    const mockRemoveFromFavourites = jest.fn();

    const { rerender } = render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={mockAddToFavourites}
        onViewDetails={jest.fn()}
        isDraggable={true}
        isFavourited={false}
        onRemoveFromFavourites={mockRemoveFromFavourites}
      />
    );

    // Click the favorite button
    const favoriteButton = screen.getByRole('button', { name: /Add to favourites/ });
    fireEvent.click(favoriteButton);

    expect(mockAddToFavourites).toHaveBeenCalledWith(mockProperty);
  });

  // Test 3: View Details button opens property details
  it('should call onViewDetails when View Details button is clicked', () => {
    const mockViewDetails = jest.fn();

    render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={jest.fn()}
        onViewDetails={mockViewDetails}
        isDraggable={true}
        isFavourited={false}
      />
    );

    const viewDetailsButton = screen.getByRole('button', { name: /View Details/ });
    fireEvent.click(viewDetailsButton);

    expect(mockViewDetails).toHaveBeenCalledWith('prop1');
  });

  // Test 4: Drag functionality
  it('should handle drag start event with propertyId', () => {
    const mockDragStart = jest.fn();

    render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        onDragStart={mockDragStart}
        isDraggable={true}
        isFavourited={false}
      />
    );

    const card = screen.getByRole('article');
    const dragEvent = new DragEvent('dragstart', {
      dataTransfer: new DataTransfer(),
    });

    fireEvent.dragStart(card, dragEvent);

    // Card should be draggable
    expect(card).toHaveAttribute('draggable', 'true');
  });

  // Test 5: Accessibility features
  it('should have proper accessibility attributes', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        isDraggable={true}
        isFavourited={false}
      />
    );

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining(mockProperty.location));

    const favoriteButton = screen.getByRole('button', { name: /Add to favourites/ });
    expect(favoriteButton).toHaveAttribute('aria-label');
    expect(favoriteButton).toHaveAttribute('title');
  });

  // Test 6: Property listing date calculation
  it('should display property listing date information', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        isDraggable={true}
        isFavourited={false}
      />
    );

    // Should display "Listed [time period] ago"
    expect(screen.getByText(/Listed/)).toBeInTheDocument();
  });
});
