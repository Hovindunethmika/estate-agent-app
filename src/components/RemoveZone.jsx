import React, { useState } from 'react';

const RemoveZone = ({ onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set to false if we're leaving the zone and not going to a child
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const propertyId = e.dataTransfer.getData('removePropertyId');
    if (propertyId && onDrop) {
      onDrop(propertyId);
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
