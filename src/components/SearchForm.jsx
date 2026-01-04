import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { DropdownList, NumberPicker, DatePicker, Combobox } from 'react-widgets';
import 'react-widgets/styles.css';

const SearchForm = ({ properties = [], onSearch }) => {
  const [filters, setFilters] = useState({
    type: 'any',
    minPrice: 0,
    maxPrice: 2000000,
    minBedrooms: 0,
    maxBedrooms: 10,
    dateFrom: null,
    dateTo: null,
    postcode: ''
  });

  const propertyTypes = ['any', 'house', 'flat'];
  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const maxBedroomOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  // Clear all filters
  const handleReset = () => {
    const resetFilters = {
      type: 'any',
      minPrice: 0,
      maxPrice: 2000000,
      minBedrooms: 0,
      maxBedrooms: 10,
      dateFrom: null,
      dateTo: null,
      postcode: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div style={{ background: 'white', padding: '2rem 1.5rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <form onSubmit={handleSearch}>
          {/* Form Title */}
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: 'var(--primary)', 
            marginBottom: '1.5rem',
            margin: '0 0 1.5rem 0'
          }}>
            Find Your Dream Property
          </h2>

          {/* Grid Layout */}
          <div className="search-form-grid">
            {/* Property Type */}
            <div data-testid="property-type-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Property Type
              </label>
              <div style={{ width: '100%' }}>
                <DropdownList
                  data={propertyTypes}
                  value={filters.type}
                  onChange={(value) => handleFilterChange('type', value)}
                />
              </div>
            </div>

            {/* Postcode Area */}
            <div data-testid="postcode-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Postcode Area
              </label>
              <div style={{ width: '100%' }}>
                <Combobox
                  data={['BR1', 'NW1', 'SW1', 'E1', 'N1', 'W1', 'EC1', 'SE1', 'N7', 'W2']}
                  value={filters.postcode}
                  onChange={(value) => handleFilterChange('postcode', (value || '').toUpperCase())}
                  placeholder="e.g., BR1, NW1"
                  filter="contains"
                  caseSensitive={false}
                  allowCreate="onFilter"
                />
              </div>
            </div>

            {/* Min Bedrooms */}
            <div data-testid="min-bedrooms-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Min Bedrooms
              </label>
              <div style={{ width: '100%' }}>
                <DropdownList
                  data={bedroomOptions}
                  value={filters.minBedrooms}
                  onChange={(value) => handleFilterChange('minBedrooms', value)}
                />
              </div>
            </div>

            {/* Max Bedrooms */}
            <div data-testid="max-bedrooms-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Max Bedrooms
              </label>
              <div style={{ width: '100%' }}>
                <DropdownList
                  data={maxBedroomOptions}
                  value={filters.maxBedrooms}
                  onChange={(value) => handleFilterChange('maxBedrooms', value)}
                />
              </div>
            </div>

            {/* Date From */}
            <div data-testid="date-from-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Added After
              </label>
              <div style={{ width: '100%' }}>
                <DatePicker
                  value={filters.dateFrom}
                  onChange={(value) => handleFilterChange('dateFrom', value)}
                />
              </div>
            </div>

            {/* Date To */}
            <div data-testid="date-to-field">
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Added Before
              </label>
              <div style={{ width: '100%' }}>
                <DatePicker
                  value={filters.dateTo}
                  onChange={(value) => handleFilterChange('dateTo', value)}
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: 'var(--text-dark)', 
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              Price Range: £{filters.minPrice.toLocaleString()} - £{filters.maxPrice.toLocaleString()}
            </label>
            <div className="price-range-grid">
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                  Min Price
                </label>
                <div style={{ width: '100%' }}>
                  <NumberPicker
                    value={filters.minPrice}
                    onChange={(value) => handleFilterChange('minPrice', value || 0)}
                    min={0}
                    max={2000000}
                    step={50000}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                  Max Price
                </label>
                <div style={{ width: '100%' }}>
                  <NumberPicker
                    value={filters.maxPrice}
                    onChange={(value) => handleFilterChange('maxPrice', value || 2000000)}
                    min={0}
                    max={2000000}
                    step={50000}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              type="submit"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(30, 58, 95, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 95, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.3)';
                e.target.style.transform = 'none';
              }}
            >
              <Search size={20} />
              Search Properties
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: 'var(--text-dark)',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.color = 'var(--text-dark)';
              }}
            >
              <X size={20} />
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
