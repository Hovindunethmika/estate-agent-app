describe('localStorage Integration Tests', () => {
  const STORAGE_KEY = 'estateAgentFavourites';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1: Save favorites to localStorage
  it('should save favorites to localStorage', () => {
    const favorites = [
      { id: '1', name: 'House 1', price: 500000 },
      { id: '2', name: 'Flat 2', price: 300000 },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    const stored = localStorage.getItem(STORAGE_KEY);

    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(favorites);
  });

  // Test 2: Retrieve favorites from localStorage
  it('should retrieve favorites from localStorage', () => {
    const favorites = [
      { id: '1', name: 'House 1', price: 500000 },
      { id: '2', name: 'Flat 2', price: 300000 },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].id).toBe('1');
    expect(retrieved[1].id).toBe('2');
  });

  // Test 3: Update existing favorites in localStorage
  it('should update favorites in localStorage', () => {
    const initialFavorites = [{ id: '1', name: 'House 1', price: 500000 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFavorites));

    const updated = [...initialFavorites, { id: '2', name: 'Flat 2', price: 300000 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(2);
  });

  // Test 4: Remove favorite from localStorage
  it('should remove favorite from localStorage', () => {
    const favorites = [
      { id: '1', name: 'House 1', price: 500000 },
      { id: '2', name: 'Flat 2', price: 300000 },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    const removed = favorites.filter(f => f.id !== '1');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(removed));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('2');
  });

  // Test 5: Clear all favorites from localStorage
  it('should clear all favorites from localStorage', () => {
    const favorites = [
      { id: '1', name: 'House 1', price: 500000 },
      { id: '2', name: 'Flat 2', price: 300000 },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    localStorage.removeItem(STORAGE_KEY);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });

  // Test 6: Handle corrupted JSON in localStorage gracefully
  it('should handle corrupted JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'corrupted{json[data');

    let parsed = null;
    try {
      parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      parsed = null;
    }

    expect(parsed).toBeNull();
  });

  // Test 7: Handle empty localStorage
  it('should return null when localStorage is empty', () => {
    const retrieved = localStorage.getItem(STORAGE_KEY);

    expect(retrieved).toBeNull();
  });

  // Test 8: Persist multiple items in localStorage
  it('should maintain data across multiple set operations', () => {
    const initial = [{ id: '1', name: 'House 1', price: 500000 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

    let stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);

    const added = [...stored, { id: '2', name: 'Flat 2', price: 300000 }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added));

    stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(2);
  });

  // Test 9: Handle special characters in favorite data
  it('should handle special characters in favorites data', () => {
    const favorites = [
      {
        id: '1',
        name: "O'Reilly's House",
        price: 500000,
        description: 'Beautiful "home" with & special chars',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved[0].name).toBe("O'Reilly's House");
    expect(retrieved[0].description).toContain('&');
  });

  // Test 10: Verify localStorage quota is not exceeded with normal data
  it('should store reasonable amount of favorites without quota issues', () => {
    const favorites = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Property ${i + 1}`,
      price: 200000 + i * 10000,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved).toHaveLength(50);
    expect(() => JSON.stringify(favorites)).not.toThrow();
  });
});
