import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyDetails from '../components/PropertyDetails';

const PropertyDetailsPage = ({ 
  allProperties, 
  onAddToFavourites, 
  onRemoveFromFavourites,
  favourites 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  // Find the property by ID
  useEffect(() => {
    const foundProperty = allProperties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    }
  }, [id, allProperties]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/');
  };

  if (!property) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1>Estate Agent - Property Details</h1>
          </div>
          <button onClick={handleBack} className="back-button">← Back to Search</button>
        </header>
        <main className="app-main">
          <div className="app-content">
            <p>Property not found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Estate Agent - Property Details</h1>
        </div>
        <button onClick={handleBack} className="back-button">← Back to Search</button>
      </header>
      
      <main className="app-main">
        <div className="app-content">
          <PropertyDetails
            property={property}
            onAddToFavourites={onAddToFavourites}
            onRemoveFromFavourites={onRemoveFromFavourites}
            isFavourite={favourites.some(fav => fav.id === property.id)}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Estate Agent App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PropertyDetailsPage;
