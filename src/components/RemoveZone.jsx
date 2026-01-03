import React, { useState } from 'react';

const RemoveZone = ({ onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    // Only set to false if we're leaving the zone and not going to a child
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const propertyId = e.dataTransfer.getData('removePropertyId');
    if (propertyId) {
      try {
        const id = JSON.parse(propertyId);
        if (onDrop) {
          onDrop(id);
        }
      } catch (err) {
        // If JSON parse fails, try to convert to number
        const id = parseInt(propertyId, 10);
        if (!isNaN(id) && onDrop) {
          onDrop(id);
        } else if (onDrop) {
          onDrop(propertyId);
        }
      }
    }
  };

  return (
    <div 
      className={`remove-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="Drag items here to remove from favourites"
    >
      <div className="remove-zone-content">
        <span className="remove-zone-icon">🗑️</span>
        <p className="remove-zone-text">Drag here to remove</p>
      </div>
    </div>
  );
};

export default RemoveZone;
