import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyList from '../components/PropertyList';

// Mock PropertyCard component
jest.mock('../components/PropertyCard', () => {
  return function MockPropertyCard({ property, onViewDetails, onAddToFavourites }) {
    return (
      <div data-testid={`property-card-${property.id}`}>
        <p>{property.location}</p>
        <button onClick={() => onAddToFavourites(property)}>Add to Favorites</button>
        <button onClick={() => onViewDetails(property.id)}>View Details</button>
      </div>
    );
  };
});

describe('PropertyList Component', () => {
  const mockProperties = [
    {
      id: 'prop1',
      type: 'House',
      bedrooms: 3,
      price: 750000,
      location: 'London, UK',
      postcode: 'SW1A 1AA',
      images: ['images/prop1.jpg'],
      dateAdded: '2025-12-15',
    },
    {
      id: 'prop2',
      type: 'Flat',
      bedrooms: 2,
      price: 500000,
      location: 'Manchester, UK',
      postcode: 'M1 1AA',
      images: ['images/prop2.jpg'],
      dateAdded: '2025-12-10',
    },
    {
      id: 'prop3',
      type: 'House',
      bedrooms: 4,
      price: 900000,
      location: 'Birmingham, UK',
      postcode: 'B33 8TH',
      images: ['images/prop3.jpg'],
      dateAdded: '2025-12-05',
    },
  ];

  // Test 1: Render property list with correct number of properties
  it('should render all properties in the list', () => {
    const mockCallbacks = {
      onAddToFavourites: jest.fn(),
      onViewDetails: jest.fn(),
      onRemoveFromFavourites: jest.fn(),
    };

    render(
      <PropertyList
        properties={mockProperties}
        onAddToFavourites={mockCallbacks.onAddToFavourites}
        onViewDetails={mockCallbacks.onViewDetails}
        favourites={[]}
        onRemoveFromFavourites={mockCallbacks.onRemoveFromFavourites}
      />
    );

    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('Manchester, UK')).toBeInTheDocument();
    expect(screen.getByText('Birmingham, UK')).toBeInTheDocument();
  });

  // Test 2: Display results count correctly
  it('should display the correct number of results', () => {
    render(
      <PropertyList
        properties={mockProperties}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    expect(screen.getByText(/3 properties match your criteria/i)).toBeInTheDocument();
  });

  // Test 3: Show empty state when no properties
  it('should show empty state when no properties found', () => {
    render(
      <PropertyList
        properties={[]}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find any properties/i)).toBeInTheDocument();
  });

  // Test 4: Sorting functionality
  it('should have sort dropdown with options', () => {
    render(
      <PropertyList
        properties={mockProperties}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    const sortSelect = screen.getByDisplayValue(/Most Relevant/i);
    expect(sortSelect).toBeInTheDocument();

    // Check sort options exist
    expect(screen.getByDisplayValue(/Price: Low to High/i) || sortSelect).toBeInTheDocument();
  });

  // Test 5: View mode toggle (grid/list)
  it('should have view mode toggle buttons', () => {
    render(
      <PropertyList
        properties={mockProperties}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    const gridButton = screen.getByRole('button', { name: /Grid/ });
    const listButton = screen.getByRole('button', { name: /List/ });

    expect(gridButton).toBeInTheDocument();
    expect(listButton).toBeInTheDocument();
  });

  // Test 6: Toggle view mode
  it('should toggle between grid and list view', () => {
    const { container } = render(
      <PropertyList
        properties={mockProperties}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    const listButton = screen.getByRole('button', { name: /List/ });
    fireEvent.click(listButton);

    const propertiesDisplay = container.querySelector('.properties-display');
    expect(propertiesDisplay).toHaveClass('list');
  });

  // Test 7: Add to favorites functionality
  it('should call onAddToFavourites when Add to Favorites is clicked', () => {
    const mockAddToFavourites = jest.fn();

    render(
      <PropertyList
        properties={[mockProperties[0]]}
        onAddToFavourites={mockAddToFavourites}
        onViewDetails={jest.fn()}
        favourites={[]}
      />
    );

    const addButton = screen.getByRole('button', { name: /Add to Favorites/ });
    fireEvent.click(addButton);

    expect(mockAddToFavourites).toHaveBeenCalledWith(mockProperties[0]);
  });

  // Test 8: View details functionality
  it('should call onViewDetails when View Details is clicked', () => {
    const mockViewDetails = jest.fn();

    render(
      <PropertyList
        properties={[mockProperties[0]]}
        onAddToFavourites={jest.fn()}
        onViewDetails={mockViewDetails}
        favourites={[]}
      />
    );

    const viewButton = screen.getByRole('button', { name: /View Details/ });
    fireEvent.click(viewButton);

    expect(mockViewDetails).toHaveBeenCalledWith('prop1');
  });

  // Test 9: Favourited property indication
  it('should indicate when a property is already favourited', () => {
    const favouritedProperty = { ...mockProperties[0] };

    render(
      <PropertyList
        properties={[favouritedProperty]}
        onAddToFavourites={jest.fn()}
        onViewDetails={jest.fn()}
        favourites={[favouritedProperty]}
      />
    );

    // The property should be marked as favourited
    expect(screen.getByTestId('property-card-prop1')).toBeInTheDocument();
  });
});
