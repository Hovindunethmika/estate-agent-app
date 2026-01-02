import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onAddToFavourites, onViewDetails, onDragStart, favourites = [], onRemoveFromFavourites = null }) => {
  // Track view mode and sort option
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  // Check if property is favorited
  const isFavourited = (propertyId) => {
    return favourites.some(fav => fav.id === propertyId);
  };

  // Get sorted properties based on selected option
  const getSortedProperties = () => {
    const sorted = [...(properties || [])];
    
    switch(sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'bedrooms':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      default:
        return sorted;
    }
  };

  const sortedProperties = getSortedProperties();

  if (!sortedProperties || sortedProperties.length === 0) {
    return (
      <div className="no-results-container">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No properties found</h3>
          <p>We couldn't find any properties matching your search criteria.</p>
          <p className="no-results-hint">Try adjusting your filters for better results:</p>
          <ul className="no-results-suggestions">
            <li>Increase your price range</li>
            <li>Reduce the number of bedrooms</li>
            <li>Try a different postcode area</li>
            <li>Adjust the date range</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="property-list-container">
      {/* Results Header */}
      <div className="property-list-header">
        <div className="property-list-title">
          <h2>
            <span className="results-count-badge">{sortedProperties.length}</span>
            Properties Found
          </h2>
          <p className="results-subtitle">
            {sortedProperties.length === 1 
              ? 'One property matches your criteria' 
              : `${sortedProperties.length} properties match your criteria`}
          </p>
        </div>

        {/* Controls */}
        <div className="property-list-controls">
          {/* Sort Dropdown */}
          <div className="sort-control-wrapper">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select-enhanced"
              aria-label="Sort properties"
            >
              <option value="default">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bedrooms">Most Bedrooms</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="view-toggle-wrapper">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              ⊞ Grid
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              ≡ List
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className={`properties-display ${viewMode}`}>
        {sortedProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onAddToFavourites={onAddToFavourites}
            onViewDetails={onViewDetails}
            onDragStart={onDragStart}
            isDraggable={true}
            isFavourited={isFavourited(property.id)}
            onRemoveFromFavourites={onRemoveFromFavourites}
          />
        ))}
      </div>

      {/* Results Footer */}
      <div className="property-list-footer">
        <p className="results-footer-text">
          Showing {sortedProperties.length} of {sortedProperties.length} properties
        </p>
      </div>
    </div>
  );
};

export default PropertyList;