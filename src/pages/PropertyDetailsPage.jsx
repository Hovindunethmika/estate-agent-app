import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, MapPin, Calendar, Heart, Home } from 'lucide-react';
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
  const [isFavourite, setIsFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Find the property by ID
  useEffect(() => {
    // Small delay to ensure all props are initialized
    const timer = setTimeout(() => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      if (!allProperties || allProperties.length === 0) {
        setIsLoading(false);
        return;
      }

      const numericId = parseInt(id, 10);
      const foundProperty = allProperties.find(p => p.id == numericId || String(p.id) === id);
      
      if (foundProperty) {
        setProperty(foundProperty);
        setIsFavourite(favourites.some(fav => fav.id === foundProperty.id));
        window.scrollTo(0, 0);
      } else {
        setProperty(null);
      }
      
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [id, allProperties, favourites]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/');
  };

  // Handle favorite toggle
  const handleToggleFavourite = () => {
    if (property) {
      if (isFavourite) {
        onRemoveFromFavourites(property.id);
      } else {
        onAddToFavourites(property);
      }
      setIsFavourite(!isFavourite);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <header>
          <div className="header-container">
            <button 
              onClick={handleBack}
              className="back-button"
              style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}
            >
              ← Back to Search
            </button>
          </div>
        </header>
        <main className="app-main">
          <div className="no-results">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h3>Loading property details...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="app-container">
        {/* Header */}
        <header>
          <div className="header-container">
            <button 
              onClick={handleBack}
              className="back-button"
              style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}
            >
              ← Back to Search
            </button>
          </div>
        </header>

        <main className="app-main">
          <div className="no-results">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
            <h3>Property not found</h3>
            <p>The property you're looking for doesn't exist.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
              Property ID: {id} | Available: {allProperties?.length || 0} properties
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header>
        <div className="header-container">
          <button 
            onClick={handleBack}
            className="back-button"
            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', background: 'rgba(255, 255, 255, 0.2)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}
          >
            ← Back to Search
          </button>
        </div>
      </header>

      <main className="app-main" style={{ background: 'linear-gradient(to bottom right, rgba(248,249,251,1) 0%, rgba(240,245,250,1) 100%)' }}>
        <div className="property-details-container">
          {/* Property Header Card */}
          <div className="property-header-card">
            <div className="property-header-left">
              <div className="property-header-badges">
                <span className="property-type-badge">
                  {property.type === 'house' ? '🏡 House' : '🏢 Flat'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Bed size={18} />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Calendar size={18} />
                  <span>Added {formatDate(property.date_added)}</span>
                </div>
              </div>

              <h1 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                {property.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-light)', fontSize: '1rem' }}>
                <MapPin size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="property-header-right">
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Price</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  £{property.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleToggleFavourite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: isFavourite ? 'none' : '2px solid #e8927c',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  background: isFavourite ? '#e8927c' : 'white',
                  color: isFavourite ? 'white' : '#e8927c',
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart 
                  size={20} 
                  fill={isFavourite ? 'white' : 'none'}
                />
                {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
              </button>
            </div>
          </div>

          {/* Property Details Component */}
          <PropertyDetails
            property={property}
            onAddToFavourites={onAddToFavourites}
            onRemoveFromFavourites={onRemoveFromFavourites}
            isFavourite={isFavourite}
          />
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Property Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PropertyDetailsPage;
