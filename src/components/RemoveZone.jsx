import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';

const RemoveZone = ({ onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Setup drop zone for removing items
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'FAVOURITE_ITEM_REMOVAL',
      drop: (item) => {
        if (onDrop) {
          onDrop(item.propertyId);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  // Update visual state when dragging over
  useEffect(() => {
    setIsDragOver(isOver);
  }, [isOver]);

  return (
    <div 
      ref={dropRef}
      className={`remove-zone ${isDragOver ? 'drag-over' : ''}`}
      style={{
        pointerEvents: 'auto',
      }}
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
