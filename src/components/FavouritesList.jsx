import React, { useState, useEffect } from 'react';
import { Heart, X, Trash2 } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { encodeHTML } from '../utils/securityUtils';
import { useNavigate } from 'react-router-dom';

const FavouritesList = ({ favourites, onRemove, onClear, onDrop, onDragOutRemove = null }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const navigate = useNavigate();

  // Setup drop zone with react-dnd
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'PROPERTY',
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

  const handleNavigateToProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Draggable item component
  const DraggableFavouriteItem = ({ property, onRemove, onNavigate }) => {
    const [{ isDragging: isItemDragging }, dragItemRef] = useDrag(
      () => ({
        type: 'FAVOURITE_ITEM_REMOVAL',
        item: { propertyId: property.id, property },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }),
      [property]
    );

    return (
      <div
        ref={dragItemRef}
        style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          padding: '12px',
          border: '2px solid #e0e0e0',
          transition: 'all 0.3s ease',
          transform: isItemDragging ? 'rotate(2deg) scale(1.05)' : 'scale(1)',
          opacity: isItemDragging ? 0.7 : 1,
          cursor: 'grab',
          display: 'flex',
          gap: '12px'
        }}
        onMouseEnter={(e) => {
          if (!isItemDragging) {
            e.currentTarget.style.borderColor = '#e8927c';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isItemDragging) {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {/* Thumbnail */}
        <img
          src={property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/64x64?text=No+Image'}
          alt={encodeHTML(property.title || property.location)}
          onClick={() => onNavigate(property.id)}
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'cover',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        />

        {/* Info */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h4
            onClick={() => onNavigate(property.id)}
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 4px 0',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e8927c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#333';
            }}
          >
            {encodeHTML(property.title || property.location)}
          </h4>
          <p style={{
            color: '#1e3a5f',
            fontWeight: '700',
            fontSize: '13px',
            margin: 0
          }}>
            £{property.price.toLocaleString()}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(property.id)}
          style={{
            width: '32px',
            height: '32px',
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            color: '#999',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffe0d6';
            e.currentTarget.style.color = '#e8927c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#999';
          }}
          aria-label="Remove from favourites"
          title="Remove from favourites"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'sticky',
      top: '120px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e3a5f',
        color: 'white',
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Heart size={20} strokeWidth={2.5} style={{ fill: 'white', color: 'white', stroke: 'white' }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            margin: 0
          }}>Favourites</h3>
        </div>
        <div style={{
          backgroundColor: 'white',
          color: '#1e3a5f',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '700'
        }}>
          {favourites.length}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Always show droppable area */}
        <div
          ref={dropRef}
          className="favourites-droppable"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '100px',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            backgroundColor: isDragOver ? '#f0f5fa' : 'transparent',
            border: isDragOver ? '2px dashed #4a90e2' : '2px solid transparent',
            pointerEvents: 'auto',
          }}
        >
          {favourites.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '32px',
              paddingBottom: '32px'
            }}>
              <Heart size={48} strokeWidth={2} style={{
                margin: '0 auto 12px',
                color: '#ddd',
                stroke: '#ddd'
              }} />
              <p style={{
                color: '#999',
                fontSize: '14px',
                margin: '0 0 4px 0'
              }}>No favourites yet</p>
              <p style={{
                color: '#aaa',
                fontSize: '12px',
                margin: 0
              }}>Drag properties here or click the heart icon</p>
            </div>
          ) : (
            <>
              {favourites.map((property) => (
                <DraggableFavouriteItem
                  key={property.id}
                  property={property}
                  onRemove={onRemove}
                  onNavigate={handleNavigateToProperty}
                />
              ))}
            </>
          )}
        </div>

        {/* Clear All Button - only show when there are favorites */}
        {favourites.length > 0 && (
          <button
            onClick={onClear}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              border: '2px solid #ffe0d6',
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#e8927c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff5f0';
              e.currentTarget.style.borderColor = '#e8927c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#ffe0d6';
            }}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default FavouritesList;