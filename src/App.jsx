import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import './App.css';

const App = () => {
  // Shared state for properties and favorites
  const [allProperties, setAllProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await fetch('/properties.json');
        if (!response.ok) {
          throw new Error('Failed to load properties');
        }
        const data = await response.json();
        setAllProperties(data.properties || []);
      } catch (err) {
        console.error('Error loading properties:', err);
      }
    };

    loadProperties();
  }, []);

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

  // Handle drop event on favorites list
  const handleDropOnFavourites = (propertyId) => {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
      handleAddToFavourites(property);
    }
  };

  // Handle drag-out removal from favorites
  const handleDragOutRemoveFromFavourites = (propertyId) => {
    handleRemoveFromFavourites(propertyId);
  };

  // Render app with routing
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              allProperties={allProperties}
              favourites={favourites}
              onAddToFavourites={handleAddToFavourites}
              onRemoveFromFavourites={handleRemoveFromFavourites}
              onClearFavourites={handleClearFavourites}
              onDropOnFavourites={handleDropOnFavourites}
              onDragOutRemoveFromFavourites={handleDragOutRemoveFromFavourites}
            />
          }
        />
        <Route 
          path="/property/:id" 
          element={
            <PropertyDetailsPage 
              allProperties={allProperties}
              onAddToFavourites={handleAddToFavourites}
              onRemoveFromFavourites={handleRemoveFromFavourites}
              favourites={favourites}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
