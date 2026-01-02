import React, { useState, useRef } from 'react';
import { DropdownList, NumberPicker, DatePicker } from 'react-widgets';
import 'react-widgets/styles.css';
import { sanitizeInput, validatePostcode } from '../utils/securityUtils';

/**
 * Main SearchForm Component using React Widgets
 */
const SearchForm = ({ onSearch }) => {
  const formRef = useRef(null);
  const [searchCriteria, setSearchCriteria] = useState({
    type: 'any',
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    maxBedrooms: null,
    postcode: '',
    dateAddedAfter: null,
    dateAddedFrom: null,
    dateAddedTo: null,
    dateRangeEnabled: false
  });

  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  // Property type options for dropdown
  const propertyTypes = ['any', 'house', 'flat'];

  // Update search criteria with proper handling
  const updateCriteria = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
    setFormMessage(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate postcode format
    if (searchCriteria.postcode && !validatePostcode(searchCriteria.postcode)) {
      newErrors.postcode = 'Invalid postcode format. Use format like BR1 or NW1';
    }

    // Validate price range
    if (searchCriteria.minPrice && searchCriteria.maxPrice) {
      if (searchCriteria.minPrice > searchCriteria.maxPrice) {
        newErrors.maxPrice = 'Max price must be greater than min price';
      }
    }

    // Validate bedroom range
    if (searchCriteria.minBedrooms && searchCriteria.maxBedrooms) {
      if (searchCriteria.minBedrooms > searchCriteria.maxBedrooms) {
        newErrors.maxBedrooms = 'Max bedrooms must be greater than min bedrooms';
      }
    }

    // Validate date range
    if (searchCriteria.dateRangeEnabled && searchCriteria.dateAddedFrom && searchCriteria.dateAddedTo) {
      if (new Date(searchCriteria.dateAddedFrom) > new Date(searchCriteria.dateAddedTo)) {
        newErrors.dateAddedTo = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormMessage(null);
    
    if (validateForm()) {
      // Convert criteria for search (handle null values)
      const searchParams = {
        type: searchCriteria.type,
        minPrice: searchCriteria.minPrice || '',
        maxPrice: searchCriteria.maxPrice || '',
        minBedrooms: searchCriteria.minBedrooms || '',
        maxBedrooms: searchCriteria.maxBedrooms || '',
        postcode: searchCriteria.postcode,
        dateAddedAfter: searchCriteria.dateAddedAfter || '',
        dateAddedFrom: searchCriteria.dateAddedFrom || '',
        dateAddedTo: searchCriteria.dateAddedTo || '',
        dateRangeEnabled: searchCriteria.dateRangeEnabled
      };

      onSearch(searchParams);
      
      setFormMessage({
        type: 'success',
        text: '✓ Search completed successfully'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setFormMessage(null), 3000);
    } else {
      setFormMessage({
        type: 'error',
        text: '⚠ Please fix the errors below before searching'
      });
      
      // Focus on form for accessibility
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setSearchCriteria({
      type: 'any',
      minPrice: null,
      maxPrice: null,
      minBedrooms: null,
      maxBedrooms: null,
      postcode: '',
      dateAddedAfter: null,
      dateAddedFrom: null,
      dateAddedTo: null,
      dateRangeEnabled: false
    });
    setErrors({});
    setFormMessage(null);
    onSearch({});
  };

  return (
    <div className="search-form-container">
      <div className="search-form-header">
        <h1>🏠 Find Your Dream Property</h1>
        <p className="subtitle">Advanced search with powerful filters</p>
      </div>
      
      {formMessage && (
        <div 
          className={`widget-form-message widget-form-message-${formMessage.type}`}
          role="alert"
          aria-live="polite"
        >
          {formMessage.text}
        </div>
      )}

      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="search-form"
        noValidate
      >
        {/* WIDGET 1: Property Type - DropdownList */}
        <div className="widget-input-wrapper">
          <label htmlFor="type" className="widget-label">🏘️ Property Type</label>
          <DropdownList
            id="type"
            data={propertyTypes}
            value={searchCriteria.type}
            onChange={(value) => updateCriteria('type', value)}
            placeholder="Select property type"
            valueField="value"
            textField={(item) => {
              if (item === 'any') return 'Any Type';
              if (item === 'house') return '🏠 House';
              if (item === 'flat') return '🏢 Flat';
              return item;
            }}
          />
          <span className="widget-hint">Choose the type of property</span>
        </div>

        {/* WIDGET 2-3: Price Range - NumberPicker */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">💷 Price Range</legend>
          <div className="widget-form-row">
            <div className="widget-input-wrapper">
              <label htmlFor="minPrice" className="widget-label">Min Price (£)</label>
              <NumberPicker
                id="minPrice"
                value={searchCriteria.minPrice}
                onChange={(value) => updateCriteria('minPrice', value)}
                min={0}
                max={10000000}
                step={10000}
                placeholder="No minimum"
                format={{ style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }}
              />
              <span className="widget-hint">Leave blank for no minimum</span>
            </div>
            
            <div className="widget-input-wrapper">
              <label htmlFor="maxPrice" className="widget-label">Max Price (£)</label>
              <NumberPicker
                id="maxPrice"
                value={searchCriteria.maxPrice}
                onChange={(value) => updateCriteria('maxPrice', value)}
                min={0}
                max={10000000}
                step={10000}
                placeholder="No maximum"
                format={{ style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }}
              />
              {errors.maxPrice && <span className="widget-error">⚠️ {errors.maxPrice}</span>}
              <span className="widget-hint">Leave blank for no maximum</span>
            </div>
          </div>
        </fieldset>

        {/* WIDGET 4-5: Bedrooms - NumberPicker */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">🛏️ Bedrooms</legend>
          <div className="widget-form-row">
            <div className="widget-input-wrapper">
              <label htmlFor="minBedrooms" className="widget-label">Min Bedrooms</label>
              <NumberPicker
                id="minBedrooms"
                value={searchCriteria.minBedrooms}
                onChange={(value) => updateCriteria('minBedrooms', value)}
                min={0}
                max={20}
                step={1}
                placeholder="No minimum"
              />
              <span className="widget-hint">Minimum number of bedrooms</span>
            </div>
            
            <div className="widget-input-wrapper">
              <label htmlFor="maxBedrooms" className="widget-label">Max Bedrooms</label>
              <NumberPicker
                id="maxBedrooms"
                value={searchCriteria.maxBedrooms}
                onChange={(value) => updateCriteria('maxBedrooms', value)}
                min={0}
                max={20}
                step={1}
                placeholder="No maximum"
              />
              {errors.maxBedrooms && <span className="widget-error">⚠️ {errors.maxBedrooms}</span>}
              <span className="widget-hint">Maximum number of bedrooms</span>
            </div>
          </div>
        </fieldset>

        {/* WIDGET 6: Postcode - Text Input with validation */}
        <div className="widget-input-wrapper">
          <label htmlFor="postcode" className="widget-label">📍 Postcode Area</label>
          <div className={`widget-input-container ${errors.postcode ? 'error' : ''}`}>
            <span className="widget-date-icon">📍</span>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={searchCriteria.postcode}
              onChange={(e) => updateCriteria('postcode', sanitizeInput(e.target.value.toUpperCase()))}
              placeholder="e.g., BR1, NW1, SW1"
              className="widget-input"
              maxLength="4"
            />
            <span className="widget-char-count">{searchCriteria.postcode.length}/4</span>
          </div>
          {errors.postcode && <span className="widget-error">⚠️ {errors.postcode}</span>}
          <span className="widget-hint">First part of UK postcode (e.g., BR1, NW1)</span>
        </div>

        {/* WIDGET 7: Date Range Toggle - Checkbox */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">📅 Date Added</legend>
          <div className="widget-checkbox-wrapper">
            <div className="widget-checkbox-container">
              <input
                type="checkbox"
                id="dateRangeEnabled"
                checked={searchCriteria.dateRangeEnabled}
                onChange={(e) => updateCriteria('dateRangeEnabled', e.target.checked)}
                className="widget-checkbox"
              />
              <label htmlFor="dateRangeEnabled" className="widget-checkbox-label">
                Search by date range instead of single date
              </label>
            </div>
          </div>

          {/* WIDGET 8-10: Date Pickers */}
          {!searchCriteria.dateRangeEnabled ? (
            <div className="widget-input-wrapper" style={{ marginTop: 'var(--spacing-md)' }}>
              <label htmlFor="dateAddedAfter" className="widget-label">Added After Date</label>
              <DatePicker
                id="dateAddedAfter"
                value={searchCriteria.dateAddedAfter}
                onChange={(value) => updateCriteria('dateAddedAfter', value)}
                placeholder="Select a date"
                max={new Date()}
                valueFormat={{ dateStyle: 'medium' }}
              />
              <span className="widget-hint">Show properties added on or after this date</span>
            </div>
          ) : (
            <div className="widget-form-row" style={{ marginTop: 'var(--spacing-md)' }}>
              <div className="widget-input-wrapper">
                <label htmlFor="dateAddedFrom" className="widget-label">From Date</label>
                <DatePicker
                  id="dateAddedFrom"
                  value={searchCriteria.dateAddedFrom}
                  onChange={(value) => updateCriteria('dateAddedFrom', value)}
                  placeholder="Start date"
                  max={searchCriteria.dateAddedTo || new Date()}
                  valueFormat={{ dateStyle: 'medium' }}
                />
                <span className="widget-hint">Start of date range</span>
              </div>
              
              <div className="widget-input-wrapper">
                <label htmlFor="dateAddedTo" className="widget-label">To Date</label>
                <DatePicker
                  id="dateAddedTo"
                  value={searchCriteria.dateAddedTo}
                  onChange={(value) => updateCriteria('dateAddedTo', value)}
                  placeholder="End date"
                  min={searchCriteria.dateAddedFrom}
                  max={new Date()}
                  valueFormat={{ dateStyle: 'medium' }}
                />
                {errors.dateAddedTo && <span className="widget-error">⚠️ {errors.dateAddedTo}</span>}
                <span className="widget-hint">End of date range</span>
              </div>
            </div>
          )}
        </fieldset>

        {/* WIDGET 11-12: Action Buttons */}
        <div className="widget-form-actions">
          <button
            type="submit"
            className="widget-button widget-button-primary"
            title="Search for properties matching your criteria"
          >
            <span className="widget-button-icon">🔍</span>
            <span className="widget-button-text">Search Properties</span>
          </button>
          
          <button
            type="button"
            className="widget-button widget-button-secondary"
            onClick={handleReset}
            title="Clear all search filters"
          >
            <span className="widget-button-icon">🔄</span>
            <span className="widget-button-text">Clear Filters</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
