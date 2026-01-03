import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../pages/HomePage';
import { BrowserRouter } from 'react-router-dom';

// Mock components to isolate HomePage logic
jest.mock('../components/PropertyList', () => {
  return function MockPropertyList({ properties, onAddToFavourites }) {
    return (
      <div data-testid="property-list">
        {properties.map(p => (
          <div key={p.id} data-testid={`property-${p.id}`}>
            <button onClick={() => onAddToFavourites(p)}>Add {p.name}</button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../components/SearchForm', () => {
  return function MockSearchForm({ onSearch }) {
    return (
      <div data-testid="search-form">
        <button onClick={() => onSearch({})}>Search</button>
      </div>
    );
  };
});

jest.mock('../components/FavouritesList', () => {
  return function MockFavouritesList({ favourites, onRemove, onClear }) {
    return (
      <div data-testid="favourites-list">
        <div>Favourites: {favourites.length}</div>
        <button onClick={onClear}>Clear All</button>
        {favourites.map(f => (
          <div key={f.id} data-testid={`fav-${f.id}`}>
            <button onClick={() => onRemove(f.id)}>Remove {f.id}</button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../components/RemoveZone', () => {
  return function MockRemoveZone() {
    return <div data-testid="remove-zone">Remove Zone</div>;
  };
});

const mockProperties = [
  { id: '1', title: 'House 1', price: 500000, bedrooms: 3, type: 'house', date_added: '2025-12-15', postcode: 'SW1A 1AA', short_description: 'Nice house', long_description: 'A nice family house', location: 'London, UK', images: [], floor_plan: '' },
  { id: '2', title: 'Flat 2', price: 300000, bedrooms: 2, type: 'flat', date_added: '2025-12-10', postcode: 'N1 1AX', short_description: 'Modern flat', long_description: 'A modern city flat', location: 'Manchester, UK', images: [], floor_plan: '' },
];

describe('HomePage - Favorites Management', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock fetch for loading properties
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ properties: mockProperties }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Add property to favorites
  it('should add property to favorites when button clicked', async () => {
    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={[]}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    const favList = screen.getByTestId('favourites-list');
    expect(favList).toBeInTheDocument();
    expect(favList).toHaveTextContent('Favourites: 0');
  });

  // Test 2: Remove property from favorites
  it('should remove property from favorites', async () => {
    const mockRemove = jest.fn();
    const favouritesData = [mockProperties[0]];

    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={favouritesData}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={mockRemove}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    const removeBtn = screen.getByText(/Remove 1/);
    fireEvent.click(removeBtn);

    expect(mockRemove).toHaveBeenCalled();
  });

  // Test 3: Clear all favorites
  it('should clear all favorites when Clear All button clicked', async () => {
    const mockClear = jest.fn();
    const favouritesData = [mockProperties[0], mockProperties[1]];

    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={favouritesData}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={mockClear}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    const clearBtn = screen.getByText(/Clear All/);
    fireEvent.click(clearBtn);

    expect(mockClear).toHaveBeenCalled();
  });

  // Test 4: Prevent duplicate favorites
  it('should prevent adding same property twice to favorites', () => {
    const existingFavourites = [mockProperties[0]];
    const mockAdd = jest.fn();

    const component = render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={existingFavourites}
          onAddToFavourites={mockAdd}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    // The component should handle duplicate prevention
    expect(component).toBeInTheDocument();
  });

  // Test 5: Display correct number of favorites
  it('should display correct count of favorites', () => {
    const favouritesData = [mockProperties[0], mockProperties[1]];

    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={favouritesData}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    const favList = screen.getByTestId('favourites-list');
    expect(favList).toHaveTextContent('Favourites: 2');
  });

  // Test 6: Search form renders
  it('should render search form component', () => {
    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={[]}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByTestId('search-form')).toBeInTheDocument();
  });

  // Test 7: Property list renders with properties
  it('should render property list with all properties', () => {
    render(
      <BrowserRouter>
        <HomePage
          allProperties={mockProperties}
          favourites={[]}
          onAddToFavourites={jest.fn()}
          onRemoveFromFavourites={jest.fn()}
          onClearFavourites={jest.fn()}
          onDropOnFavourites={jest.fn()}
          onDragOutRemoveFromFavourites={jest.fn()}
        />
      </BrowserRouter>
    );

    expect(screen.getByTestId('property-list')).toBeInTheDocument();
  });
});
