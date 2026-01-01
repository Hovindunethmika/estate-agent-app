/**
 * Estate Agent Application - Main Component
 * 
 * This is the root component that manages the entire estate agent application.
 * It handles:
 * - Loading property data from JSON file (client-side only)
 * - Managing search criteria and filtered results
 * - Maintaining favorites list
 * - Handling sorting of properties
 * - Displaying property details in modal
 * 
 * State Management:
 * - allProperties: Complete list of properties loaded from properties.json
 * - filteredProperties: Results matching current search criteria
 * - favourites: User's saved favorite properties
 * - sortBy: Current sorting method
 * - isLoading: Loading state indicator
 * - error: Error messages
 * - selectedPropertyId: Currently viewed property in modal
 * 
 * Architecture:
 * - Client-side only (no server required)
 * - React hooks for state management
 * - Composition pattern with child components
 * - Secure data handling with encoding utilities
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 */

import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import PropertyList from './components/PropertyList';
import FavouritesList from './components/FavouritesList';
import PropertyDetails from './components/PropertyDetails';
import { filterProperties, sortProperties } from './utils/searchUtils';
import './App.css';

const App = () => {
  // State for managing application data
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  /**
   * Load all properties from the local properties.json file on component mount.
   * This runs entirely client-side with no server interaction required.
   * 
   * Error handling:
   * - Validates HTTP response status
   * - Provides user-friendly error messages
   * - Logs detailed errors to console
   */
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/properties.json');
        if (!response.ok) {
          throw new Error('Failed to load properties');
        }
        const data = await response.json();
        setAllProperties(data.properties || []);
        setFilteredProperties(data.properties || []);
        setError(null);
      } catch (err) {
        setError('Failed to load properties. Please try again later.');
        console.error('Error loading properties:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  /**
   * Handle search form submission by filtering properties
   * 
   * Process:
   * 1. Apply search criteria filters (location, price, bedrooms, postcode, date)
   * 2. Apply current sort order if selected
   * 3. Update filtered results
   * 
   * @param {Object} searchCriteria - Search criteria object with properties:
   *   - location: Location search string
   *   - minPrice: Minimum price filter
   *   - maxPrice: Maximum price filter
   *   - bedrooms: Bedroom count filter
   *   - postcode: Postcode filter
   *   - dateAdded: Date listing filter
   */
  const handleSearch = (searchCriteria) => {
    try {
      let filtered = filterProperties(allProperties, searchCriteria);
      
      // Apply sorting if selected
      if (sortBy) {
        filtered = sortProperties(filtered, sortBy);
      }
      
      setFilteredProperties(filtered);
    } catch (err) {
      console.error('Error filtering properties:', err);
      setError('An error occurred while filtering properties.');
    }
  };

  /**
   * Handle sort dropdown change
   * 
   * Updates the sort order and re-sorts the filtered results
   * 
   * @param {Event} e - The change event from the sort select element
   */
  const handleSort = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    
    let sorted = filteredProperties;
    if (sort) {
      sorted = sortProperties(sorted, sort);
    }
    setFilteredProperties(sorted);
  };

  /**
   * Add a property to the favorites list
   * Prevents duplicate entries using property ID comparison
   * 
   * @param {Object} property - The property object to add to favorites
   */
  const handleAddToFavourites = (property) => {
    setFavourites(prevFavourites => {
      // Check if property already exists
      if (prevFavourites.some(fav => fav.id === property.id)) {
        return prevFavourites; // No change if already exists
      }
      return [...prevFavourites, property];
    });
  };

  /**
   * Remove a property from the favorites list
   * 
   * @param {string} propertyId - The ID of the property to remove
   */
  const handleRemoveFromFavourites = (propertyId) => {
    setFavourites(favourites.filter(fav => fav.id !== propertyId));
  };

  /**
   * Clear all properties from the favorites list
   */
  const handleClearFavourites = () => {
    setFavourites([]);
  };

  /**
   * Handle drop event on favorites list
   * Adds the dropped property to favorites
   * 
   * @param {string} propertyId - The ID of the property being dropped
   */
  const handleDropOnFavourites = (propertyId) => {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
      handleAddToFavourites(property);
    }
  };

  /**
   * Handle drag-out removal from favorites
   * 
   * @param {string} propertyId - The ID of the property being dragged out
   */
  const handleDragOutRemoveFromFavourites = (propertyId) => {
    handleRemoveFromFavourites(propertyId);
  };

  /**
   * Open property details modal
   * 
   * @param {string} propertyId - The ID of the property to view
   */
  const handleViewPropertyDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  /**
   * Close property details modal
   */
  const handleClosePropertyDetails = () => {
    setSelectedPropertyId(null);
  };

  // Render the main application layout
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Estate Agent - Property Search</h1>
        <p className="header-subtitle">Find your perfect property</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          {/* Search Section */}
          <section className="search-section" aria-labelledby="search-heading">
            <h2 id="search-heading" className="section-heading">Search Criteria</h2>
            <SearchForm onSearch={handleSearch} />
          </section>

          {/* Error Message */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <p>Loading properties...</p>
            </div>
          )}

          {/* Main Content Area */}
          {!isLoading && (
            <div className="results-container">
              <section className="properties-section" aria-labelledby="results-heading">
                <div className="section-header">
                  <h2 id="results-heading" className="section-heading">Search Results</h2>
                  {filteredProperties.length > 0 && (
                    <div className="sort-controls">
                      <label htmlFor="sort-select">Sort by:</label>
                      <select 
                        id="sort-select"
                        value={sortBy} 
                        onChange={handleSort}
                        className="sort-select"
                      >
                        <option value="">Default</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="date-newest">Newest First</option>
                        <option value="date-oldest">Oldest First</option>
                      </select>
                    </div>
                  )}
                </div>
                <PropertyList 
                  properties={filteredProperties}
                  onAddToFavourites={handleAddToFavourites}
                  onViewDetails={handleViewPropertyDetails}
                  favourites={favourites}
                  onRemoveFromFavourites={handleRemoveFromFavourites}
                />
              </section>

              <aside className="favourites-section" aria-labelledby="favourites-heading">
                <h2 id="favourites-heading" className="section-heading">Saved Favourites</h2>
                <FavouritesList 
                  favourites={favourites}
                  onRemove={handleRemoveFromFavourites}
                  onClear={handleClearFavourites}
                  onDrop={handleDropOnFavourites}
                  onDragOutRemove={handleDragOutRemoveFromFavourites}
                />
              </aside>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Estate Agent App. All rights reserved.</p>
      </footer>

      {/* Property Details Modal */}
      {selectedPropertyId && (
        <PropertyDetails 
          propertyId={selectedPropertyId}
          onClose={handleClosePropertyDetails}
        />
      )}
    </div>
  );
};

export default App;
