import { filterProperties } from '../utils/searchUtils';

describe('Search Utils - filterProperties', () => {
  const mockProperties = [
    {
      id: 1,
      type: 'House',
      price: 500000,
      bedrooms: 3,
      dateAdded: '2025-12-15',
      postcode: 'SW1A 1AA',
    },
    {
      id: 2,
      type: 'Flat',
      price: 300000,
      bedrooms: 2,
      dateAdded: '2025-12-10',
      postcode: 'N1 1AX',
    },
    {
      id: 3,
      type: 'House',
      price: 750000,
      bedrooms: 5,
      dateAdded: '2025-12-20',
      postcode: 'SW1A 2AA',
    },
    {
      id: 4,
      type: 'Bungalow',
      price: 250000,
      bedrooms: 2,
      dateAdded: '2025-12-01',
      postcode: 'M1 1AA',
    },
  ];

  // Test 1: Filter by property type
  it('should filter properties by type correctly', () => {
    const criteria = { type: 'House' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    expect(result.every(p => p.type === 'House')).toBe(true);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });

  // Test 2: Filter by price range
  it('should filter properties by price range', () => {
    const criteria = { minPrice: '300000', maxPrice: '600000' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    expect(result.every(p => p.price >= 300000 && p.price <= 600000)).toBe(true);
  });

  // Test 3: Filter by bedroom range
  it('should filter properties by bedroom count', () => {
    const criteria = { minBedrooms: '3', maxBedrooms: '5' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    expect(result.every(p => p.bedrooms >= 3 && p.bedrooms <= 5)).toBe(true);
  });

  // Test 4: Filter by postcode prefix
  it('should filter properties by postcode prefix', () => {
    const criteria = { postcode: 'SW1A' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    expect(result.every(p => p.postcode.startsWith('SW1A'))).toBe(true);
  });

  // Test 5: Combine multiple filter criteria
  it('should apply multiple filter criteria with AND logic', () => {
    const criteria = {
      type: 'House',
      minPrice: '400000',
      maxPrice: '800000',
      minBedrooms: '3',
    };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    result.forEach(p => {
      expect(p.type).toBe('House');
      expect(p.price).toBeGreaterThanOrEqual(400000);
      expect(p.price).toBeLessThanOrEqual(800000);
      expect(p.bedrooms).toBeGreaterThanOrEqual(3);
    });
  });

  // Test 6: Empty criteria returns all properties
  it('should return all properties when no criteria provided', () => {
    const result = filterProperties(mockProperties, {});

    expect(result).toHaveLength(4);
    expect(result).toEqual(mockProperties);
  });

  // Test 7: Filter with no matching results
  it('should return empty array when no properties match criteria', () => {
    const criteria = { type: 'Villa' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  // Test 8: Case-insensitive postcode matching
  it('should match postcode case-insensitively', () => {
    const criteria = { postcode: 'sw1a' };
    const result = filterProperties(mockProperties, criteria);

    expect(result).toHaveLength(2);
    expect(result.every(p => p.postcode.toUpperCase().startsWith('SW1A'))).toBe(true);
  });
});
