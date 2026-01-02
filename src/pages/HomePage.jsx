import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyList from '../components/PropertyList';
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
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const navigate = useNavigate();

  // Update filtered properties when allProperties changes
  useEffect(() => {
    setFilteredProperties(allProperties);
  }, [allProperties]);

  // Navigate to property details page
  const handleViewPropertyDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Handle drag start from property cards (drag to favorites)
  const handleDragStart = () => {
    // This handler is just a placeholder - the actual drag logic is in PropertyCard
  };

  // Render the home page layout
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Estate Agent - Property Search</h1>
        <p className="header-subtitle">Find your perfect property</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          {/* Main Content Area */}
          <div className="results-container">
            <section className="properties-section" aria-labelledby="results-heading">
              <div className="section-header">
                <h2 id="results-heading" className="section-heading">Search Results</h2>
              </div>
              <PropertyList 
                properties={filteredProperties}
                onAddToFavourites={onAddToFavourites}
                onViewDetails={handleViewPropertyDetails}
                onDragStart={handleDragStart}
                favourites={favourites}
                onRemoveFromFavourites={onRemoveFromFavourites}
              />
            </section>
          </div>

          <aside className="favourites-section" aria-labelledby="favourites-heading">
            <h2 id="favourites-heading" className="section-heading">Saved Favourites</h2>
            <FavouritesList 
              favourites={favourites}
              onRemove={onRemoveFromFavourites}
              onClear={onClearFavourites}
              onDrop={onDropOnFavourites}
              onViewDetails={handleViewPropertyDetails}
              onDragOutRemove={onDragOutRemoveFromFavourites}
            />
            <RemoveZone onDrop={onDragOutRemoveFromFavourites} />
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Estate Agent App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
