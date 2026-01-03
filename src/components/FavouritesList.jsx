import React, { useState } from 'react';
import { Heart, X, Trash2 } from 'lucide-react';
import { encodeHTML } from '../utils/securityUtils';
import { useNavigate } from 'react-router-dom';

const FavouritesList = ({ favourites, onRemove, onClear, onDrop, onViewDetails, onDragOutRemove = null }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.stopPropagation();
    if (e.target.classList && e.target.classList.contains('favourites-droppable')) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const propertyId = e.dataTransfer.getData('propertyId');
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

  const handleRemoveDragStart = (e, propertyId) => {
    setDraggedItemId(propertyId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('removePropertyId', JSON.stringify(propertyId));
    e.dataTransfer.setData('propertyId', JSON.stringify(propertyId));
    e.dataTransfer.setData('draggingFromFavourites', 'true');
  };

  const handleItemDragEnd = (e) => {
    setDraggedItemId(null);
  };

  const handleNavigateToProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
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
          className="favourites-droppable"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '100px',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            backgroundColor: isDragOver ? '#f0f5fa' : 'transparent',
            border: isDragOver ? '2px dashed #4a90e2' : '2px solid transparent'
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
              {favourites.map((property, index) => (
                <div
                  key={property.id}
                  draggable
                  onDragStart={(e) => handleRemoveDragStart(e, property.id)}
                  onDragEnd={handleItemDragEnd}
                  style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    transform: draggedItemId === property.id ? 'rotate(2deg) scale(1.05)' : 'scale(1)',
                    opacity: draggedItemId === property.id ? 0.7 : 1,
                    cursor: 'grab',
                    display: 'flex',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (draggedItemId !== property.id) {
                      e.currentTarget.style.borderColor = '#e8927c';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (draggedItemId !== property.id) {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/64x64?text=No+Image'}
                    alt={encodeHTML(property.title || property.location)}
                    onClick={() => handleNavigateToProperty(property.id)}
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
                      onClick={() => handleNavigateToProperty(property.id)}
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