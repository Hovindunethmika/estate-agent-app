import React, { useState, useEffect } from 'react';
import { Heart, Bed, MapPin } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { encodeHTML } from '../utils/securityUtils';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, onAddToFavourites, isDraggable = true, isFavourited = false, onRemoveFromFavourites = null }) => {
  const [isDraggingState, setIsDraggingState] = useState(false);
  const navigate = useNavigate();

  // Setup drag with react-dnd
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'PROPERTY',
      item: { propertyId: property.id, property },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: isDraggable,
    }),
    [property, isDraggable]
  );

  // Update visual state when dragging
  useEffect(() => {
    setIsDraggingState(isDragging);
  }, [isDragging]);

  const handleAddToFavourites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavourited && onRemoveFromFavourites) {
      onRemoveFromFavourites(property.id);
    } else if (!isFavourited && onAddToFavourites) {
      onAddToFavourites(property);
    }
  };

  const getImageSource = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return 'https://via.placeholder.com/800x600?text=No+Image';
  };

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div 
      ref={drag}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
        cursor: isDraggable ? 'grab' : 'pointer',
        opacity: isDraggingState ? 0.7 : 1,
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => {
        if (isDraggable) {
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (isDraggable) {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      role="article"
      aria-label={`${property.type} at ${property.title || property.location}`}
    >
      {/* Image Section */}
      <div style={{
        position: 'relative',
        height: '256px',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
      }}>
        <img 
          src={getImageSource()}
          alt={`${property.type} property at ${property.title || property.location}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#1e3a5f',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          zIndex: 2
        }}>
          {property.type === 'house' ? 'House' : 'Flat'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleAddToFavourites}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isFavourited ? '#e8927c' : 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease',
            zIndex: 3
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isFavourited ? '#d67b65' : '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isFavourited ? '#e8927c' : 'white';
          }}
          aria-label={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
          title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={20}
            strokeWidth={2}
            style={{
              fill: isFavourited ? '#FF6B6B' : 'none',
              color: '#FF6B6B',
              stroke: '#FF6B6B',
              transition: 'all 0.3s ease'
            }}
          />
        </button>
      </div>

      {/* Content Section */}
      <div style={{ padding: '20px' }}>
        {/* Price & Bedrooms Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e3a5f',
            margin: 0
          }}>
            £{property.price.toLocaleString()}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#666',
            fontSize: '14px'
          }}>
            <Bed size={16} />
            <span style={{ fontWeight: '600' }}>{property.bedrooms}</span>
          </div>
        </div>

        {/* Title */}
        <h4 
          onClick={handleViewDetails}
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e3a5f',
            margin: '0 0 8px 0',
            cursor: 'pointer',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#e8927c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#1e3a5f';
          }}
        >
          {encodeHTML(property.title || property.location)}
        </h4>

        {/* Location */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          color: '#666',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <MapPin size={16} style={{ marginTop: '4px', flexShrink: 0 }} />
          <span>{encodeHTML(property.location)}</span>
        </div>

        {/* Description */}
        <p style={{
          color: '#666',
          fontSize: '14px',
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {encodeHTML(property.short_description)}
        </p>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e8927c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d67b65';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e8927c';
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;