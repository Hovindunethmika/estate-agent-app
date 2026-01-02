import React, { useState } from 'react';
import { encodeHTML } from '../utils/securityUtils';

const FavouritesList = ({ favourites, onRemove, onClear, onDrop, onViewDetails, onDragOutRemove = null }) => {
  // Track drag state and which item is being dragged
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  
  // Format price as GBP currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle drag over for drop target
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set to false if leaving the favorites-list container entirely
    if (e.target.classList.contains('favourites-list')) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const propertyId = e.dataTransfer.getData('propertyId');
    if (propertyId && onDrop) {
      onDrop(propertyId);
    }
  };

  const handleRemoveDragStart = (e, propertyId) => {
    setDraggedItemId(propertyId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('removePropertyId', propertyId.toString());
    e.dataTransfer.setData('draggingFromFavourites', 'true');
  };

  const handleItemDragEnd = (e) => {
    setDraggedItemId(null);
  };

  return (
    <div 
      className={`favourites-list ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="favourites-header">
        <h2>Favourites ({favourites.length})</h2>
        {favourites.length > 0 && (
          <button onClick={onClear} className="btn-clear">
            Clear All
          </button>
        )}
      </div>
      
      {favourites.length === 0 ? (
        <div className="favourites-empty">
          <p>No favourite properties yet</p>
          <p className="hint">Drag properties here or click the heart button</p>
        </div>
      ) : (
        <>
          <div className="favourites-items">
            {favourites.map(property => (
              <div 
                key={property.id} 
                className={`favourite-item ${draggedItemId === property.id ? 'dragging-out' : ''}`}
                draggable
                onDragStart={(e) => handleRemoveDragStart(e, property.id)}
                onDragEnd={handleItemDragEnd}
                role="listitem"
              >
                <div 
                  onClick={() => onViewDetails(property.id)}
                  className="favourite-thumbnail-container"
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => e.key === 'Enter' && onViewDetails(property.id)}
                >
                  <img 
                    src={property.images[0]} 
                    alt={encodeHTML(property.description)} 
                    className="favourite-thumbnail"
                  />
                </div>
                <div className="favourite-info">
                  <div 
                    onClick={() => onViewDetails(property.id)}
                    className="favourite-details"
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => e.key === 'Enter' && onViewDetails(property.id)}
                  >
                    <h4>{formatPrice(property.price)}</h4>
                    <p>{encodeHTML(property.location)}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(property.id)} 
                    className="btn-remove"
                    aria-label="Remove from favourites"
                    title="Remove from favourites"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="favourites-hint">
            <p>💡 Drag items out to remove them</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FavouritesList;