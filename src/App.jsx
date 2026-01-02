import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import PropertyList from './components/PropertyList';
import FavouritesList from './components/FavouritesList';
import PropertyDetails from './components/PropertyDetails';
import { filterProperties, sortProperties } from './utils/searchUtils';
import './App.css';

const App = () => {
  // Application state
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Load properties on mount
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

  // Handle search with filters and sorting
  const handleSearch = (searchCriteria) => {
    try {
      let filtered = filterProperties(allProperties, searchCriteria);
      
      if (sortBy) {
        filtered = sortProperties(filtered, sortBy);
      }
      
      setFilteredProperties(filtered);
    } catch (err) {
      console.error('Error filtering properties:', err);
      setError('An error occurred while filtering properties.');
    }
  };

  // Handle sort change
  const handleSort = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    
    let sorted = filteredProperties;
    if (sort) {
      sorted = sortProperties(sorted, sort);
    }
    setFilteredProperties(sorted);
  };

  // Add to favorites (prevent duplicates)
  const handleAddToFavourites = (property) => {
    setFavourites(prevFavourites => {
      if (prevFavourites.some(fav => fav.id === property.id)) {
        return prevFavourites;
      }
      return [...prevFavourites, property];
    });
  };

  // Remove from favorites
  const handleRemoveFromFavourites = (propertyId) => {
    setFavourites(favourites.filter(fav => fav.id !== propertyId));
  };

  // Clear all favorites
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

  // Open property details modal
  const handleViewPropertyDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  // Close property details modal
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
            <>
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
              </div>

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
            </>
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
