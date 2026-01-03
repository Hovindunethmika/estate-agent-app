import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { encodeHTML } from '../utils/securityUtils';
import PropertyGallery from './PropertyGallery';
import PropertyTabs from './PropertyTabs';

const PropertyDetails = ({ property = null, propertyId = null, onClose = null, onAddToFavourites = null, onRemoveFromFavourites = null, isFavourite = false }) => {
  // State for property data, loading, and error
  const [propertyData, setPropertyData] = useState(property);
  const [loading, setLoading] = useState(property ? false : true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(isFavourite);

  // Fetch property details on mount if propertyId is provided
  useEffect(() => {
    if (property) {
      setPropertyData(property);
      setIsFav(isFavourite);
      return;
    }

    if (!propertyId) return;
  }, [propertyId, property, isFavourite]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatPricePerBedroom = (price, bedrooms) => {
    if (bedrooms === 0) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price / bedrooms);
  };

  const handleAddToFavourites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav && onRemoveFromFavourites) {
      onRemoveFromFavourites(propertyData.id);
      setIsFav(false);
    } else if (!isFav && onAddToFavourites) {
      onAddToFavourites(propertyData);
      setIsFav(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (propertyData) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [propertyData]);

  if (loading) {
    return (
      <div className="property-details-modal" role="dialog" aria-labelledby="property-details-title">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <div className="loading-state">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error || !propertyData) {
    return (
      <div className="property-details-modal" role="dialog" aria-labelledby="property-details-title">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Error</h2>
            <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
          </div>
          <div className="modal-body">
            <p className="error-message">{error || 'Property not found'}</p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-primary">Close</button>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = propertyData.images && propertyData.images.length > 0 ? propertyData.images[currentImageIndex] : null;

  // Content shared between modal and page modes
  const renderPropertyContent = () => (
    <>
      {/* Large Image Gallery */}
      {propertyData.images && propertyData.images.length > 0 && (
        <section className="property-gallery-section" aria-label="Property images gallery">
          <PropertyGallery images={propertyData.images} title={propertyData.location} />
        </section>
      )}

      {/* Key Information Grid */}
      <section className="property-key-info-section">
        <div className="key-info-grid">
          <div className="key-info-item">
            <span className="key-info-label">Price</span>
            <span className="key-info-value">{formatPrice(propertyData.price)}</span>
          </div>
          <div className="key-info-item">
            <span className="key-info-label">Price per Bed</span>
            <span className="key-info-value">{formatPricePerBedroom(propertyData.price, propertyData.bedrooms)}</span>
          </div>
          <div className="key-info-item">
            <span className="key-info-label">Type</span>
            <span className="key-info-value">{encodeHTML(propertyData.type)}</span>
          </div>
          <div className="key-info-item">
            <span className="key-info-label">Bedrooms</span>
            <span className="key-info-value">{propertyData.bedrooms}</span>
          </div>
          <div className="key-info-item">
            <span className="key-info-label">Type</span>
            <span className="key-info-value">{encodeHTML(propertyData.type || 'N/A')}</span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="property-tabs-section">
        <PropertyTabs property={propertyData} />
      </section>
    </>
  );

  // Modal mode - with modal overlay and close button
  if (onClose) {
    return (
      <div className="property-details-modal" role="dialog" aria-labelledby="property-details-title">
        <div className="modal-overlay" onClick={onClose}></div>
        <div className={`modal-content property-details-content ${isFullscreen ? 'fullscreen' : ''}`}>
          {/* Modal Header */}
          <div className="modal-header property-details-header">
            <div>
              <h2 id="property-details-title" className="modal-title">
                {encodeHTML(propertyData.location)}
              </h2>
              <p className="property-postcode">
                <strong>{encodeHTML(propertyData.postcode)}</strong>
              </p>
            </div>
            <div className="header-buttons">
              <button 
                onClick={handleAddToFavourites}
                className="heart-button"
                aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
                title={isFav ? 'Remove from favourites' : 'Add to favourites'}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFav
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-400'
                  }`}
                />
              </button>
              <button 
                onClick={onClose} 
                className="modal-close" 
                aria-label="Close property details"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body property-details-body">
            {renderPropertyContent()}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer property-details-footer">
            <button onClick={onClose} className="btn btn-primary">
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page mode - standalone page without modal overlay
  return (
    <div className="property-details-page-content">
      {/* Page Header */}
      <div className="property-page-header">
        <div>
          <h2 id="property-details-title" className="page-title">
            {encodeHTML(propertyData.location)}
          </h2>
          <p className="property-postcode">
            <strong>{encodeHTML(propertyData.postcode)}</strong>
          </p>
        </div>
        <button 
          onClick={handleAddToFavourites}
          className="heart-button-page"
          aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          title={isFav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            className={`w-6 h-6 ${
              isFav
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Page Body */}
      <div className="property-page-body">
        {renderPropertyContent()}
      </div>
    </div>
  );
};

export default PropertyDetails;
