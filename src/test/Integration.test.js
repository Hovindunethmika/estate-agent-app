import { filterProperties } from '../utils/searchUtils';

describe('Integration Tests - Search and Filter', () => {
  const testProperties = [
    {
      id: 1,
      title: '123 Oak Avenue, Bromley',
      type: 'house',
      price: 450000,
      bedrooms: 3,
      postcode: 'BR1',
    },
    {
      id: 2,
      title: '45 Camden Square',
      type: 'flat',
      price: 275000,
      bedrooms: 2,
      postcode: 'NW1',
    },
    {
      id: 3,
      title: '78 Chelsea Gardens',
      type: 'house',
      price: 650000,
      bedrooms: 4,
      postcode: 'SW3',
    },
  ];

  it('should filter properties by price range', () => {
    const result = filterProperties(testProperties, {
      minPrice: 300000,
      maxPrice: 700000,
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((p) => p.price >= 300000 && p.price <= 700000)).toBe(true);
  });

  it('should filter properties by bedroom count', () => {
    const result = filterProperties(testProperties, {
      minBedrooms: 3,
      maxBedrooms: 4,
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((p) => p.bedrooms >= 3)).toBe(true);
  });

  it('should filter properties by property type', () => {
    const result = filterProperties(testProperties, {
      propertyType: 'house',
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((p) => p.type === 'house')).toBe(true);
  });

  it('should filter properties by postcode', () => {
    const result = filterProperties(testProperties, {
      postcode: 'BR',
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('should combine multiple filter criteria', () => {
    const result = filterProperties(testProperties, {
      propertyType: 'house',
      minBedrooms: 3,
      maxPrice: 600000,
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });
});
