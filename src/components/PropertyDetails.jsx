/**
 * PropertyDetails Component
 * 
 * Modal dialog displaying comprehensive property information including:
 * - Full property description and details
 * - Image gallery with navigation controls
 * - Fullscreen image viewing capability
 * - Price information and tenure details
 * - Location and postcode information
 * - Property type and bedroom count
 * 
 * Features:
 * - Image gallery with previous/next navigation (arrow buttons)
 * - Image navigation by keyboard arrows (left/right)
 * - Escape key to close modal
 * - Fullscreen image view for closer inspection
 * - Loading state during data fetch
 * - Error handling for failed property loads
 * - Security: HTML encoding to prevent XSS attacks
 * 
 * Props:
 * - propertyId (string): ID of property to display
 * - onClose (Function): Callback when modal should close (Escape or X button)
 * 
 * Data Flow:
 * - Loads property data from properties.json on component mount
 * - Matches propertyId with properties array
 * - Displays full property details in modal format
 * 
 * Keyboard Controls:
 * - Arrow Left: Previous image
 * - Arrow Right: Next image
 * - Escape: Close modal
 * 
 * @component
 * @example
 * const [selectedId, setSelectedId] = useState(null);
 * <PropertyDetails 
 *   propertyId={selectedId} 
 *   onClose={() => setSelectedId(null)}
 * />
 */

import React, { useState, useEffect } from 'react';
import { encodeHTML } from '../utils/securityUtils';

const PropertyDetails = ({ propertyId, onClose }) => {
  // Property data fetched from properties.json
  const [property, setProperty] = useState(null);
  // Loading state during async fetch
  const [loading, setLoading] = useState(true);
  // Error message if fetch fails
  const [error, setError] = useState(null);
  // Current index in image gallery (0-based)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Track if image is displayed in fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Fetches property data from JSON file when component mounts
   * or when propertyId changes
   * Sets loading state and handles errors appropriately
   */
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch('/properties.json');
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        const found = data.properties.find(p => p.id === propertyId);
        if (found) {
          setProperty(found);
          setCurrentImageIndex(0);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load property details');
        console.error('Error loading property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

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

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (property && property.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') handleNextImage(e);
    if (e.key === 'ArrowLeft') handlePrevImage(e);
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (property) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [property, isFullscreen]);

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

  if (error || !property) {
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

  const currentImage = property.images && property.images.length > 0 ? property.images[currentImageIndex] : null;

  return (
    <div className="property-details-modal" role="dialog" aria-labelledby="property-details-title">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className={`modal-content property-details-content ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Modal Header */}
        <div className="modal-header property-details-header">
          <div>
            <h2 id="property-details-title" className="modal-title">
              {encodeHTML(property.location)}
            </h2>
            <p className="property-postcode">
              <strong>{encodeHTML(property.postcode)}</strong>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="modal-close" 
            aria-label="Close property details"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body property-details-body">
          {/* Large Image Gallery */}
          {currentImage && (
            <section className="property-gallery-section" aria-label="Property images gallery">
              <div className="main-image-container">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="fullscreen-btn"
                  title="Toggle fullscreen"
                  aria-label="Toggle fullscreen view"
                >
                  {isFullscreen ? '⛶' : '⛶'}
                </button>
                
                <img
                  src={currentImage}
                  alt={`${encodeHTML(property.location)} - Image ${currentImageIndex + 1} of ${property.images.length}`}
                  className="main-property-image"
                />

                {/* Navigation Buttons */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="gallery-nav-btn prev"
                      aria-label="Previous image"
                      title="Previous image"
                    >
                      ◀
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="gallery-nav-btn next"
                      aria-label="Next image"
                      title="Next image"
                    >
                      ▶
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {property.images.length > 1 && (
                  <div className="image-counter">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="thumbnail-gallery">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={index === currentImageIndex ? 'true' : 'false'}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Keyboard Hints */}
              {property.images.length > 1 && (
                <p className="gallery-hints">
                  💡 Tip: Use arrow keys (← →) or click thumbnails to navigate
                </p>
              )}
            </section>
          )}

          {/* Key Information Grid */}
          <section className="property-key-info-section">
            <div className="key-info-grid">
              <div className="key-info-item">
                <span className="key-info-label">Price</span>
                <span className="key-info-value">{formatPrice(property.price)}</span>
              </div>
              <div className="key-info-item">
                <span className="key-info-label">Price per Bed</span>
                <span className="key-info-value">{formatPricePerBedroom(property.price, property.bedrooms)}</span>
              </div>
              <div className="key-info-item">
                <span className="key-info-label">Type</span>
                <span className="key-info-value">{encodeHTML(property.type)}</span>
              </div>
              <div className="key-info-item">
                <span className="key-info-label">Bedrooms</span>
                <span className="key-info-value">{property.bedrooms}</span>
              </div>
              <div className="key-info-item">
                <span className="key-info-label">Tenure</span>
                <span className="key-info-value">{encodeHTML(property.tenure)}</span>
              </div>
              <div className="key-info-item">
                <span className="key-info-label">Listed</span>
                <span className="key-info-value">
                  {new Date(property.dateAdded).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </section>

          {/* Location & Postcode Section */}
          <section className="property-location-section">
            <h3>Location Details</h3>
            <p className="location-text">{encodeHTML(property.location)}</p>
            <p className="postcode-text">
              <strong>Postcode:</strong> <span className="postcode-value">{encodeHTML(property.postcode)}</span>
            </p>
          </section>

          {/* Full Description */}
          <section className="property-description-section">
            <h3>Property Description</h3>
            <p className="description-text">{encodeHTML(property.description)}</p>
          </section>

          {/* Property URL */}
          {property.url && (
            <section className="property-url-section">
              <p className="url-text">
                <strong>Property Reference:</strong> <code>{encodeHTML(property.url)}</code>
              </p>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer property-details-footer">
          <button onClick={onClose} className="btn btn-primary">
            Close Details
          </button>
        </div>      </div>
    </div>
  );
};

export default PropertyDetails;