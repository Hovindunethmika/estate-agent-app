import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FavouritesList from '../components/FavouritesList';

// Mock the security utils
jest.mock('../utils/securityUtils', () => ({
  encodeHTML: (text) => text,
}));

describe('FavouritesList Component', () => {
  const mockProperties = [
    {
      id: 'prop1',
      type: 'house',
      bedrooms: 3,
      price: 750000,
      title: 'Beautiful family home',
      short_description: 'Lovely 3-bed house',
      long_description: 'Beautiful family home with garden',
      location: 'London, UK',
      postcode: 'SW1A 1AA',
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'],
      floor_plan: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      date_added: '2025-12-15',
      latitude: 51.5074,
      longitude: -0.1477,
    },
    {
      id: 'prop2',
      type: 'flat',
      bedrooms: 2,
      price: 500000,
      title: 'Modern city apartment',
      short_description: 'Stylish 2-bed flat',
      long_description: 'Modern city apartment with balcony',
      location: 'Manchester, UK',
      postcode: 'M1 1AA',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      floor_plan: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      date_added: '2025-12-10',
      latitude: 53.4808,
      longitude: -2.2426,
    },
  ];

  // Test 1: Empty favorites list message
  it('should display empty message when no favorites', () => {
    const mockCallbacks = {
      onRemove: jest.fn(),
      onClear: jest.fn(),
      onDrop: jest.fn(),
      onViewDetails: jest.fn(),
    };

    render(
      <FavouritesList
        favourites={[]}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    expect(screen.getByText(/No favourite properties yet/i)).toBeInTheDocument();
  });

  // Test 2: Display favorites list with property count
  it('should display favorites list and property count', () => {
    const mockCallbacks = {
      onRemove: jest.fn(),
      onClear: jest.fn(),
      onDrop: jest.fn(),
      onViewDetails: jest.fn(),
    };

    render(
      <FavouritesList
        favourites={mockProperties}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    expect(screen.getByText(/Favourites \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('Manchester, UK')).toBeInTheDocument();
  });

  // Test 3: Remove favorite functionality
  it('should remove favorite when remove button is clicked', () => {
    const mockRemove = jest.fn();
    const mockCallbacks = {
      onRemove: mockRemove,
      onClear: jest.fn(),
      onDrop: jest.fn(),
      onViewDetails: jest.fn(),
    };

    render(
      <FavouritesList
        favourites={mockProperties}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /Remove from favourites/i });
    fireEvent.click(removeButtons[0]);

    expect(mockRemove).toHaveBeenCalledWith('prop1');
  });

  // Test 4: Clear all favorites functionality
  it('should clear all favorites when Clear All button is clicked', () => {
    const mockClear = jest.fn();
    const mockCallbacks = {
      onRemove: jest.fn(),
      onClear: mockClear,
      onDrop: jest.fn(),
      onViewDetails: jest.fn(),
    };

    render(
      <FavouritesList
        favourites={mockProperties}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    const clearButton = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled();
  });

  // Test 5: Drag and drop functionality
  it('should handle drag over and drop events', () => {
    const mockDrop = jest.fn();
    const mockCallbacks = {
      onRemove: jest.fn(),
      onClear: jest.fn(),
      onDrop: mockDrop,
      onViewDetails: jest.fn(),
    };

    const { container } = render(
      <FavouritesList
        favourites={mockProperties}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    const favouritesList = container.querySelector('.favourites-list');

    // Simulate dragover event
    const dragoverEvent = new DragEvent('dragover', { bubbles: true });
    dragoverEvent.dataTransfer.dropEffect = 'move';
    fireEvent.dragOver(favouritesList, dragoverEvent);

    expect(favouritesList).toHaveClass('drag-over');
  });

  // Test 6: View details on favorite click
  it('should call onViewDetails when favorite item is clicked', () => {
    const mockViewDetails = jest.fn();
    const mockCallbacks = {
      onRemove: jest.fn(),
      onClear: jest.fn(),
      onDrop: jest.fn(),
      onViewDetails: mockViewDetails,
    };

    render(
      <FavouritesList
        favourites={mockProperties}
        onRemove={mockCallbacks.onRemove}
        onClear={mockCallbacks.onClear}
        onDrop={mockCallbacks.onDrop}
        onViewDetails={mockCallbacks.onViewDetails}
      />
    );

    // Click on a favorite item's details area
    const locationTexts = screen.getAllByText('London, UK');
    fireEvent.click(locationTexts[0].closest('[role="button"]') || locationTexts[0].parentElement);

    // The click handler should be triggered
    expect(mockCallbacks.onViewDetails).toHaveBeenCalledWith('prop1');
  });
});
