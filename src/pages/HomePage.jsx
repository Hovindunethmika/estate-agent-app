import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import PropertyList from '../components/PropertyList';
import SearchForm from '../components/SearchForm';
import FavouritesList from '../components/FavouritesList';
import RemoveZone from '../components/RemoveZone';

const HomePage = ({
  allProperties,
  favourites,
  onAddToFavourites,
  onRemoveFromFavourites,
  onClearFavourites,
  onDropOnFavourites,
  onDragOutRemoveFromFavourites
}) => {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return allProperties;
    }

    return allProperties.filter(property => {
      // Type filter
      if (filters.type && filters.type !== 'any' && property.type !== filters.type) {
        return false;
      }

      // Price filters
      if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Bedroom filters
      if (filters.minBedrooms && property.bedrooms < parseInt(filters.minBedrooms)) {
        return false;
      }
      if (filters.maxBedrooms && property.bedrooms > parseInt(filters.maxBedrooms)) {
        return false;
      }

      // Date filters
      if (filters.dateFrom || filters.dateTo) {
        const propertyDate = new Date(property.date_added);
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (propertyDate < fromDate) {
            return false;
          }
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (propertyDate > toDate) {
            return false;
          }
        }
      }

      // Postcode filter
      if (filters.postcode && !property.postcode.toUpperCase().startsWith(filters.postcode.toUpperCase())) {
        return false;
      }

      return true;
    });
  }, [allProperties, filters]);

  // Navigate to property details page
  const handleViewPropertyDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Handle drag start from property cards (drag to favorites)
  const handleDragStart = () => {
    // This handler is just a placeholder - the actual drag logic is in PropertyCard
  };

  return (
    <div className="app-container">
      {/* Professional Header with Gradient Background */}
      <header>
        <div className="header-container">
          <div className="header-content">
            <div className="header-icon">
              🏠
            </div>
            <h1>Property Search</h1>
          </div>
          <p className="header-subtitle">Find your perfect home from our exclusive listings</p>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ background: 'linear-gradient(to bottom right, rgba(248,249,251,1) 0%, rgba(240,245,250,1) 100%)' }} className="flex-1">
        {/* Search Form */}
        <SearchForm 
          properties={allProperties}
          onSearch={setFilters}
        />

        <div className="app-main">
          {/* Results Section */}
          <div className="home-layout">
            {/* Main Results Area */}
            <div>
              <div className="home-results-header">
                <h2>{Object.keys(filters).length > 0 ? `${filteredProperties.length} Properties Found` : 'All Properties'}</h2>
                <p>{Object.keys(filters).length > 0 ? 'Showing results matching your criteria' : 'Browse our complete collection'}</p>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="home-results-section">
                  <PropertyList 
                    properties={filteredProperties}
                    onAddToFavourites={onAddToFavourites}
                    onViewDetails={handleViewPropertyDetails}
                    onDragStart={handleDragStart}
                    favourites={favourites}
                    onRemoveFromFavourites={onRemoveFromFavourites}
                  />
                </div>
              ) : (
                <div className="no-results">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h3>No properties found</h3>
                  <p>Try adjusting your search filters</p>
                </div>
              )}
            </div>

            {/* Favorites Sidebar */}
            <aside className="home-sidebar">
              <div className="home-sidebar-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>❤️</span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Saved Favourites
                  </h2>
                </div>
                <FavouritesList 
                  favourites={favourites}
                  onRemove={onRemoveFromFavourites}
                  onClear={onClearFavourites}
                  onDrop={onDropOnFavourites}
                  onViewDetails={handleViewPropertyDetails}
                  onDragOutRemove={onDragOutRemoveFromFavourites}
                />
                <RemoveZone onDrop={onDragOutRemoveFromFavourites} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 Property Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
