// Filter properties based on multiple search criteria
export const filterProperties = (properties, criteria) => {
  return properties.filter(property => {
    // Filter by property type
    if (criteria.type && criteria.type !== 'any' && property.type !== criteria.type) {
      return false;
    }

    // Filter by minimum price
    if (criteria.minPrice && property.price < parseFloat(criteria.minPrice)) {
      return false;
    }

    // Filter by maximum price
    if (criteria.maxPrice && property.price > parseFloat(criteria.maxPrice)) {
      return false;
    }

    // Filter by minimum bedrooms
    if (criteria.minBedrooms && property.bedrooms < parseInt(criteria.minBedrooms)) {
      return false;
    }

    // Filter by maximum bedrooms
    if (criteria.maxBedrooms && property.bedrooms > parseInt(criteria.maxBedrooms)) {
      return false;
    }

    // Filter by postcode area
    if (criteria.postcode) {
      const searchPostcode = criteria.postcode.toUpperCase().trim();
      if (!property.postcode.toUpperCase().startsWith(searchPostcode)) {
        return false;
      }
    }

    // Filter by date added (after specified date)
    if (criteria.dateAddedAfter) {
      const propertyDate = new Date(property.dateAdded);
      const searchDate = new Date(criteria.dateAddedAfter);
      if (propertyDate < searchDate) {
        return false;
      }
    }

    // Filter by date range (between two dates, inclusive)
    if (criteria.dateAddedFrom && criteria.dateAddedTo) {
      const propertyDate = new Date(property.dateAdded);
      const dateFrom = new Date(criteria.dateAddedFrom);
      const dateTo = new Date(criteria.dateAddedTo);
      if (propertyDate < dateFrom || propertyDate > dateTo) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sorts an array of properties by specified criteria
 * 
 * Supported sort orders:
 * - 'price-asc': Ascending price (cheapest first)
 * - 'price-desc': Descending price (most expensive first)
 * - 'date-newest': Newest listings first
 * - 'date-oldest': Oldest listings first
 * - Any other value: Returns unsorted (original order)
 * 
 * Implementation:
 * - Creates a new array to avoid mutating original
 * - Uses numeric comparison for prices
 * - Uses date comparison for date sorting
 * 
 * @param {Array<Object>} properties - Array of properties to sort
 * @param {string} sortBy - Sort order (price-asc, price-desc, date-newest, date-oldest)
 * @returns {Array<Object>} - New sorted array of properties
 * 
 * @example
 * const sorted = sortProperties(results, 'price-asc');
 */
export const sortProperties = (properties, sortBy) => {
  // Create a copy to avoid mutating the original array
  const sorted = [...properties];
  
  switch(sortBy) {
    case 'price-asc':
      // Sort by price ascending (cheapest first)
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      // Sort by price descending (most expensive first)
      return sorted.sort((a, b) => b.price - a.price);
    case 'date-newest':
      // Sort by date descending (newest first)
      return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case 'date-oldest':
      // Sort by date ascending (oldest first)
      return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    default:
      // Return unsorted (original order)
      return sorted;
  }
};