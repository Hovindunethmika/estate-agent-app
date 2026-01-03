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
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No properties found</h3>
        <p className="text-slate-500">
          Try adjusting your search criteria to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            {sortedProperties.length === properties.length 
              ? 'All Properties' 
              : `Found ${sortedProperties.length} ${sortedProperties.length === 1 ? 'Property' : 'Properties'}`}
          </h2>
          <p className="text-slate-600">
            Showing {sortedProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort-select" className="text-sm font-medium text-slate-700">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            aria-label="Sort properties"
          >
            <option value="default">Most Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="bedrooms">Most Bedrooms</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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