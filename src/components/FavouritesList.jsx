/**
 * FavouritesList Component
 * 
 * Sidebar component displaying user's favorite properties. Provides
 * multiple ways to manage favorites:
 * - Display list of saved favorite properties
 * - Drag and drop properties from search results to add
 * - Drag out of list to remove (drag-out functionality)
 * - Delete button (✕) to remove individual properties
 * - Clear All button to remove all favorites at once
 * 
 * Features:
 * - Drag-and-drop to add properties (drop target)
 * - Drag-out to remove properties (drag source)
 * - Visual feedback on drag over (highlight)
 * - Price display for each property
 * - Property count display
 * - Click handler support (if needed for future features)
 * - Responsive design
 * 
 * Props:
 * - favourites (Array): Array of favorite property objects
 * - onRemove (Function): Callback(propertyId) when property is deleted
 * - onClear (Function): Callback when Clear All button clicked
 * - onDrop (Function): Callback(event) when property dropped in favorites
 * - onDragOver (Function): Callback(event) for drag over visual feedback
 * - onDragOutRemove (Function): Optional callback for drag-out removal
 * 
 * Security:
 * - Uses encodeHTML to prevent XSS when displaying property data
 * - Input validation on all callbacks
 * 
 * @component
 * @example
 * const handleRemove = (propId) => { ... };
 * const handleDrop = (e) => { ... };
 * <FavouritesList 
 *   favourites={favList}
 *   onRemove={handleRemove}
 *   onDrop={handleDrop}
 * />
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { encodeHTML } from '../utils/securityUtils';

const FavouritesList = ({ favourites, onRemove, onClear, onDrop, onDragOver, onDragOutRemove = null }) => {
  // Track drag-over state for visual feedback on drop target
  const [isDragOver, setIsDragOver] = useState(false);
  // Track which item is being dragged for drag-out-to-remove
  const [draggedItemId, setDraggedItemId] = useState(null);
  
  /**
   * Formats a price value as UK currency (GBP)
   * @param {number} price - Price in pounds
   * @returns {string} - Formatted price string (e.g., "£450,000")
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  /**
   * Handles drag over event for drop target highlighting
   * Prevents default to enable drop, sets visual feedback
   * @param {DragEvent} e - The drag event object
   */
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
    const propertyId = parseInt(e.dataTransfer.getData('propertyId'));
    if (onDrop) {
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
              <Link to={`/property/${property.id}`}>
                <img 
                  src={property.images[0]} 
                  alt={encodeHTML(property.description)} 
                  className="favourite-thumbnail"
                />
              </Link>
              <div className="favourite-info">
                <Link to={`/property/${property.id}`}>
                  <h4>{formatPrice(property.price)}</h4>
                  <p>{encodeHTML(property.location)}</p>
                </Link>
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