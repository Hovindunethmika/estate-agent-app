import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { encodeHTML } from '../utils/securityUtils';

const PropertyDetails = ({ property = null, propertyId = null, onClose = null, onAddToFavourites = null, onRemoveFromFavourites = null, isFavourite = false }) => {
  // State for property data, loading, and error
  const [propertyData, setPropertyData] = useState(property);
  const [loading, setLoading] = useState(property ? false : true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFav, setIsFav] = useState(isFavourite);

  // Fetch property details on mount if propertyId is provided
  useEffect(() => {
    if (property) {
      setPropertyData(property);
      setIsFav(isFavourite);
      return;
    }

    if (!propertyId) return;

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
          setPropertyData(found);
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

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (propertyData && propertyData.images) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyData.images.length);
    }
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (propertyData && propertyData.images) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyData.images.length) % propertyData.images.length);
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
      } else if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (propertyData) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [propertyData, isFullscreen]);

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
              alt={`${encodeHTML(propertyData.location)} - Image ${currentImageIndex + 1} of ${propertyData.images.length}`}
              className="main-property-image"
            />

            {/* Navigation Buttons */}
            {propertyData.images.length > 1 && (
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
            {propertyData.images.length > 1 && (
              <div className="image-counter">
                {currentImageIndex + 1} / {propertyData.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {propertyData.images.length > 1 && (
            <div className="thumbnail-gallery">
              {propertyData.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`View image ${index + 1}`}
                  title={`Image ${index + 1}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}

          {propertyData.images.length > 1 && (
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
            <span className="key-info-label">Tenure</span>
            <span className="key-info-value">{encodeHTML(propertyData.tenure)}</span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="property-tabs-section">
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor Plan</Tab>
            <Tab>Location</Tab>
          </TabList>

          {/* Description Tab */}
          <TabPanel>
            <div className="tab-content">
              <h3>Property Description</h3>
              <p className="description-text">{encodeHTML(propertyData.description)}</p>
              {propertyData.url && (
                <p className="url-text">
                  <strong>Property Reference:</strong> <code>{encodeHTML(propertyData.url)}</code>
                </p>
              )}
            </div>
          </TabPanel>

          {/* Floor Plan Tab */}
          <TabPanel>
            <div className="tab-content">
              <h3>Floor Plan</h3>
              <div className="floor-plan-container">
                {propertyData.images && propertyData.images.length > 0 ? (
                  <>
                    <img 
                      src={propertyData.images[0]} 
                      alt="Floor plan" 
                      className="floor-plan-image"
                    />
                    <p className="floor-plan-note">
                      Property image showing layout and features. Bedrooms: {propertyData.bedrooms}
                    </p>
                  </>
                ) : (
                  <p>No floor plan available</p>
                )}
              </div>
            </div>
          </TabPanel>

          {/* Google Map Tab */}
          <TabPanel>
            <div className="tab-content">
              <h3>Location Map</h3>
              <div className="map-container">
                <iframe
                  className="google-map"
                  title={`Google Map for ${encodeHTML(propertyData.location)}`}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKeyForDemo&q=${encodeURIComponent(propertyData.location + ', ' + propertyData.postcode)}`}
                  style={{
                    border: 0,
                    width: '100%',
                    height: '500px',
                    borderRadius: '8px'
                  }}
                  allowFullScreen=""
                  aria-label="Google Map showing property location"
                ></iframe>
                <p className="map-note">
                  Map showing {encodeHTML(propertyData.location)}, {encodeHTML(propertyData.postcode)}
                </p>
              </div>
            </div>
          </TabPanel>
        </Tabs>
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
      </div>

      {/* Page Body */}
      <div className="property-page-body">
        {renderPropertyContent()}
      </div>
    </div>
  );
};

export default PropertyDetails;
