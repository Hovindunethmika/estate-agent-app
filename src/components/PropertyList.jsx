import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onAddToFavourites, onViewDetails, onDragStart, favourites = [], onRemoveFromFavourites = null }) => {
  const [sortBy, setSortBy] = useState('default');

  // Check if property is favorited
  const isFavourited = (propertyId) => {
    return favourites.some(fav => fav.id === propertyId);
  };

  // Get sorted properties based on selected option
  const sortedProperties = useMemo(() => {
    const sorted = [...(properties || [])];
    
    switch(sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'bedrooms':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
      default:
        return sorted;
    }
  }, [properties, sortBy]);

  if (!sortedProperties || sortedProperties.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '48px',
        textAlign: 'center'
      }}>
        <Search size={64} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>No properties found</h3>
        <p style={{ color: '#6b7280' }}>
          Try adjusting your search criteria to see more results
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <label htmlFor="sort-select" style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label="Sort properties"
        >
          <option value="default">Most Relevant</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="bedrooms">Most Bedrooms</option>
          <option value="newest">Recently Added</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {sortedProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onAddToFavourites={onAddToFavourites}
            onViewDetails={onViewDetails}
            onDragStart={onDragStart}
            isDraggable={true}
            isFavourited={isFavourited(property.id)}
            onRemoveFromFavourites={onRemoveFromFavourites}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;