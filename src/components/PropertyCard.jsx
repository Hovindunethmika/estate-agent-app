import React, { useState } from 'react';
import { encodeHTML } from '../utils/securityUtils';

const PropertyCard = ({ property, onAddToFavourites, onViewDetails, onDragStart, isDraggable = true, isFavourited = false, onRemoveFromFavourites = null }) => {
  // Track expanded description and drag state
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Format price as GBP currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate price per bedroom
  const formatPricePerBedroom = (price, bedrooms) => {
    if (bedrooms === 0) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price / bedrooms);
  };

  // Handle drag start for favorites
  const handleDragStart = (e) => {
    setIsDragging(true);
    if (onDragStart) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('propertyId', property.id.toString());
    }
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
  };

  const handleAddToFavourites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavourited && onRemoveFromFavourites) {
      onRemoveFromFavourites(property.id);
    } else if (!isFavourited && onAddToFavourites) {
      onAddToFavourites(property);
    }
  };

  const getDaysListed = () => {
    const today = new Date();
    const added = new Date(property.dateAdded);
    const days = Math.floor((today - added) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}m ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  const truncateDescription = (text, maxLength = 85) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div 
      className={`property-card-enhanced ${isDragging ? 'dragging' : ''}`}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      role="article"
      aria-label={`${property.type} at ${property.location}`}
    >
      {/* Image Section */}
      <div className="property-card-image-wrapper">
        <img 
          src={property.images[0]} 
          alt={`${property.type} property at ${property.location}`}
          className="property-card-image"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="property-card-overlay">
          {/* Type Badge */}
          <div className="property-card-badge property-type-badge">
            {property.type === 'house' ? '🏠' : '🏢'} {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </div>

          {/* Date Badge */}
          <div className="property-card-badge property-date-badge">
            {getDaysListed()}
          </div>

          {/* Tenure Badge */}
          {property.tenure && (
            <div className="property-card-badge property-tenure-badge">
              {property.tenure}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleAddToFavourites}
          className={`property-card-favourite-btn ${isFavourited ? 'favoured' : ''}`}
          aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          disabled={false}
        >
          {isFavourited ? '❤️' : '🤍'}
        </button>
        {isFavourited && <div className="favourite-badge" title="Added to favourites">✓</div>}
      </div>

      {/* Content Section */}
      <div className="property-card-content">
        {/* Price Section */}
        <div className="property-card-price-section">
          <h2 className="property-card-price">
            {formatPrice(property.price)}
          </h2>
          {property.bedrooms > 0 && (
            <p className="property-card-price-per-bed">
              £{formatPricePerBedroom(property.price, property.bedrooms).replace('£', '').trim()}/bed
            </p>
          )}
        </div>

        {/* Location */}
        <div className="property-card-location">
          <span className="location-icon">📍</span>
          <div className="location-details">
            <p className="location-text">{encodeHTML(property.location)}</p>
            {property.postcode && (
              <p className="postcode-text">{encodeHTML(property.postcode)}</p>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div className="property-card-features">
          <div className="feature">
            <span className="feature-icon">🛏️</span>
            <span className="feature-value">{property.bedrooms}</span>
            <span className="feature-label">Bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          {property.tenure && (
            <div className="feature">
              <span className="feature-icon">📋</span>
              <span className="feature-value">{property.tenure}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="property-card-description">
          <p className="description-text">
            {showFullDescription 
              ? encodeHTML(property.description)
              : encodeHTML(truncateDescription(property.description, 85))
            }
          </p>
          {property.description.length > 85 && (
            <button
              className="property-card-read-more"
              onClick={() => setShowFullDescription(!showFullDescription)}
              aria-expanded={showFullDescription}
            >
              {showFullDescription ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="property-card-footer">
          <p className="property-card-meta">
            Listed {getDaysListed()}
          </p>
          <button 
            onClick={() => onViewDetails && onViewDetails(property.id)}
            className="property-card-link-btn"
            aria-label={`View full details for property at ${property.location}`}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;