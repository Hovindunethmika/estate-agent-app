/**
 * PropertyList Component
 * 
 * Displays properties matching search criteria in a grid or list view.
 * Manages both the display of filtered results and the sorting functionality.
 * 
 * Features:
 * - Grid view (default) or list view toggle
 * - Multiple sort options:
 *   * Default (original order)
 *   * Price ascending (lowest first)
 *   * Price descending (highest first)
 *   * Date newest (most recent first)
 *   * Date oldest (oldest first)
 * - Shows total count of properties displayed
 * - Displays individual PropertyCard components for each property
 * - Maintains favorites state across all properties
 * - Responsive design for mobile, tablet, and desktop
 * 
 * Props:
 * - properties (Array): Array of property objects to display
 * - onAddToFavourites (Function): Callback when favorite button clicked
 * - onViewDetails (Function): Callback when view details button clicked
 * - favourites (Array): Array of properties currently favorited (default: [])
 * - onRemoveFromFavourites (Function): Callback to remove from favorites
 * 
 * @component
 * @example
 * <PropertyList 
 *   properties={filtered}
 *   onAddToFavourites={handleAddFav}
 *   onViewDetails={handleViewDetails}
 *   favourites={favorites}
 * />
 */

import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onAddToFavourites, onViewDetails, favourites = [], onRemoveFromFavourites = null }) => {
  // Track current view mode (grid or list) for display toggle
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  /**
   * Checks if a property is currently in the favorites list
   * Used to display the correct heart icon state (filled or empty)
   * @param {string} propertyId - The property ID to check
   * @returns {boolean} - True if property is favorited, false otherwise
   */
  const isFavourited = (propertyId) => {
    return favourites.some(fav => fav.id === propertyId);
  };

  /**
   * Sorts properties based on selected sort criterion
   * Maintains original array, returns new sorted copy
   * Supports: price ascending, price descending, date newest, date oldest
   * @returns {Array} - Sorted array of properties
   */
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
            onDragStart={() => {}}
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