import React, { useState } from 'react';
import { Search, X, Calendar } from 'lucide-react';

const SearchForm = ({ properties = [], onSearch }) => {
  const [filters, setFilters] = useState({
    type: 'any',
    minPrice: 0,
    maxPrice: 2000000,
    minBedrooms: 0,
    maxBedrooms: 10,
    dateFrom: '',
    dateTo: '',
    postcode: ''
  });

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
      dateFrom: '',
      dateTo: '',
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Property Type */}
            <div>
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
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              >
                <option value="any">Any</option>
                <option value="house">House</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            {/* Postcode Area */}
            <div>
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
              <input
                type="text"
                placeholder="e.g., BR1, NW1"
                value={filters.postcode}
                onChange={(e) => handleFilterChange('postcode', e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {/* Min Bedrooms */}
            <div>
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
              <select
                value={filters.minBedrooms}
                onChange={(e) => handleFilterChange('minBedrooms', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              >
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num === 0 ? 'Any' : num}</option>
                ))}
              </select>
            </div>

            {/* Max Bedrooms */}
            <div>
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
              <select
                value={filters.maxBedrooms}
                onChange={(e) => handleFilterChange('maxBedrooms', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
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
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            {/* Date To */}
            <div>
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
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: 'var(--text-dark)',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          </div>

          {/* Price Range Slider */}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                  Min Price
                </label>
                <input
                  type="number"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    color: 'var(--text-dark)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                  Max Price
                </label>
                <input
                  type="number"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    color: 'var(--text-dark)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
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
              onHover={(e) => {
                e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 95, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
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
