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