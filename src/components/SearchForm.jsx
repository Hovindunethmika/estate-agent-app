/**
 * SearchForm Component
 * 
 * Main search interface for filtering properties by multiple criteria:
 * - Property type (House, Flat, or Any)
 * - Price range (minimum and maximum price)
 * - Bedroom count range (minimum and maximum)
 * - Postcode area (e.g., BR5, SW1, etc.)
 * - Date added filters (optional date range)
 * 
 * Features:
 * - Custom widget components for consistent UI (SelectWidget, TextInputWidget, DateWidget)
 * - Real-time search updates with form submission
 * - Input validation and sanitization for security
 * - Postcode validation using regex pattern
 * - Reset button to clear all search criteria
 * - Responsive design that works on all screen sizes
 * 
 * Architecture:
 * - Each search criterion is independent but combined with AND logic in filterProperties()
 * - Input validation prevents invalid searches (e.g., minPrice > maxPrice)
 * - All user inputs are sanitized to prevent XSS attacks
 * - Postcode validation ensures proper UK postcode format
 * 
 * Props:
 * - onSearch (Function): Callback with search criteria when form is submitted
 * 
 * @component
 * @example
 * const handleSearch = (criteria) => {
 *   console.log('Searching with:', criteria);
 *   filterAndDisplay(criteria);
 * };
 * <SearchForm onSearch={handleSearch} />
 */

import React, { useState, useRef } from 'react';
import { sanitizeInput, validatePostcode } from '../utils/securityUtils';

/**
 * SelectWidget Component
 * 
 * Custom dropdown select component with consistent styling and behavior.
 * Used for property type selection (House, Flat, Any).
 * 
 * Props:
 * - id (string): HTML id attribute for accessibility
 * - label (string): Display label for the field
 * - value (string): Current selected value
 * - onChange (Function): Callback when selection changes
 * - options (Array): Array of option objects with value and label
 * - disabled (Boolean): Whether field is disabled (default: false)
 * - hint (string): Optional helper text below the field
 */
const SelectWidget = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options, 
  disabled = false,
  hint = ''
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="widget-select-wrapper">
      <label htmlFor={id} className="widget-label">
        {label}
      </label>
      <div className="widget-select-container">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`widget-select ${focused ? 'focused' : ''}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={hint ? `${id}-hint` : undefined}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="widget-select-arrow">▼</span>
      </div>
      {hint && (
        <span id={`${id}-hint`} className="widget-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

/**
 * Custom Number Input Component - Enhanced number widget
 */
const NumberInputWidget = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = '',
  min = 0,
  error = '',
  hint = ''
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="widget-input-wrapper">
      <label htmlFor={id} className="widget-label">
        {label}
      </label>
      <div className={`widget-input-container ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <input
          type="number"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          className="widget-input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="widget-error" role="alert">
          ✕ {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="widget-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

/**
 * Custom Text Input Component - Enhanced text widget
 */
const TextInputWidget = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = '',
  maxLength = 255,
  error = '',
  hint = ''
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="widget-input-wrapper">
      <label htmlFor={id} className="widget-label">
        {label}
      </label>
      <div className={`widget-input-container ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="widget-input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
        />
        <span className="widget-char-count">
          {value.length}/{maxLength}
        </span>
      </div>
      {error && (
        <span id={`${id}-error`} className="widget-error" role="alert">
          ✕ {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="widget-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

/**
 * Custom Date Input Component - Enhanced date widget
 */
const DateInputWidget = ({ 
  id, 
  label, 
  value, 
  onChange, 
  error = '',
  hint = ''
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="widget-input-wrapper">
      <label htmlFor={id} className="widget-label">
        {label}
      </label>
      <div className={`widget-input-container ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <input
          type="date"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className="widget-input widget-date-input"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={!!error}
        />
        <span className="widget-date-icon">📅</span>
      </div>
      {error && (
        <span id={`${id}-error`} className="widget-error" role="alert">
          ✕ {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${id}-hint`} className="widget-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

/**
 * Custom Checkbox Component - Enhanced toggle widget
 */
const CheckboxWidget = ({ 
  id, 
  label, 
  checked, 
  onChange, 
  hint = ''
}) => {
  return (
    <div className="widget-checkbox-wrapper">
      <div className="widget-checkbox-container">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={onChange}
          className="widget-checkbox"
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <label htmlFor={id} className="widget-checkbox-label">
          {label}
        </label>
      </div>
      {hint && (
        <span id={`${id}-hint`} className="widget-hint">
          {hint}
        </span>
      )}
    </div>
  );
};

/**
 * Custom Button Component - Enhanced action widget
 */
const ButtonWidget = ({ 
  type = 'button', 
  variant = 'primary', 
  onClick, 
  children,
  disabled = false,
  icon = null,
  title = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`widget-button widget-button-${variant}`}
      title={title}
    >
      {icon && <span className="widget-button-icon">{icon}</span>}
      <span className="widget-button-text">{children}</span>
    </button>
  );
};

/**
 * Main SearchForm Component using Widgets
 */
const SearchForm = ({ onSearch }) => {
  const formRef = useRef(null);
  const [searchCriteria, setSearchCriteria] = useState({
    type: 'any',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    postcode: '',
    dateAddedAfter: '',
    dateAddedFrom: '',
    dateAddedTo: '',
    dateRangeEnabled: false
  });

  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let sanitizedValue = value;
    if (type === 'text') {
      sanitizedValue = sanitizeInput(value);
    }

    setSearchCriteria(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizedValue
    }));

    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
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
      if (parseFloat(searchCriteria.minPrice) > parseFloat(searchCriteria.maxPrice)) {
        newErrors.maxPrice = 'Max price must be greater than min price';
      }
    }

    // Validate bedroom range
    if (searchCriteria.minBedrooms && searchCriteria.maxBedrooms) {
      if (parseInt(searchCriteria.minBedrooms) > parseInt(searchCriteria.maxBedrooms)) {
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
      onSearch(searchCriteria);
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
        formRef.current.focus();
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setSearchCriteria({
      type: 'any',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      maxBedrooms: '',
      postcode: '',
      dateAddedAfter: '',
      dateAddedFrom: '',
      dateAddedTo: '',
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
        <p className="subtitle">Advanced search with filters</p>
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
        {/* Property Type Widget */}
        <div className="widget-form-row">
          <SelectWidget
            id="type"
            label="Property Type"
            value={searchCriteria.type}
            onChange={handleChange}
            options={[
              { value: 'any', label: 'Any Type' },
              { value: 'house', label: '🏠 House' },
              { value: 'flat', label: '🏢 Flat' }
            ]}
            hint="Select the property type you're looking for"
          />
        </div>

        {/* Price Range Section */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">💷 Price Range</legend>
          <div className="widget-form-row">
            <NumberInputWidget
              id="minPrice"
              label="Min Price (£)"
              value={searchCriteria.minPrice}
              onChange={handleChange}
              placeholder="No minimum"
              min={0}
              error={errors.minPrice}
              hint="Minimum property price"
            />
            <NumberInputWidget
              id="maxPrice"
              label="Max Price (£)"
              value={searchCriteria.maxPrice}
              onChange={handleChange}
              placeholder="No maximum"
              min={0}
              error={errors.maxPrice}
              hint="Maximum property price"
            />
          </div>
        </fieldset>

        {/* Bedrooms Section */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">🛏️ Bedrooms</legend>
          <div className="widget-form-row">
            <NumberInputWidget
              id="minBedrooms"
              label="Min Bedrooms"
              value={searchCriteria.minBedrooms}
              onChange={handleChange}
              placeholder="No minimum"
              min={0}
              error={errors.minBedrooms}
              hint="Minimum number of bedrooms"
            />
            <NumberInputWidget
              id="maxBedrooms"
              label="Max Bedrooms"
              value={searchCriteria.maxBedrooms}
              onChange={handleChange}
              placeholder="No maximum"
              min={0}
              error={errors.maxBedrooms}
              hint="Maximum number of bedrooms"
            />
          </div>
        </fieldset>

        {/* Postcode Widget */}
        <TextInputWidget
          id="postcode"
          label="📍 Postcode Area"
          value={searchCriteria.postcode}
          onChange={handleChange}
          placeholder="e.g., BR1 or NW1"
          maxLength={4}
          error={errors.postcode}
          hint="First part of UK postcode (e.g., BR1, NW1, SE3)"
        />

        {/* Date Range Toggle */}
        <fieldset className="widget-fieldset">
          <legend className="widget-legend">📅 Date Added</legend>
          <CheckboxWidget
            id="dateRangeEnabled"
            label="Search by date range"
            checked={searchCriteria.dateRangeEnabled}
            onChange={handleChange}
            hint="Check to search between two dates instead of after a single date"
          />
        </fieldset>

        {/* Date Input Widgets */}
        {!searchCriteria.dateRangeEnabled ? (
          <DateInputWidget
            id="dateAddedAfter"
            label="Added After"
            value={searchCriteria.dateAddedAfter}
            onChange={handleChange}
            hint="Find properties added on or after this date"
          />
        ) : (
          <div className="widget-form-row">
            <DateInputWidget
              id="dateAddedFrom"
              label="From Date"
              value={searchCriteria.dateAddedFrom}
              onChange={handleChange}
              hint="Start of date range"
            />
            <DateInputWidget
              id="dateAddedTo"
              label="To Date"
              value={searchCriteria.dateAddedTo}
              onChange={handleChange}
              error={errors.dateAddedTo}
              hint="End of date range"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="widget-form-actions">
          <ButtonWidget
            type="submit"
            variant="primary"
            icon="🔍"
            title="Search for properties matching your criteria"
          >
            Search Properties
          </ButtonWidget>
          <ButtonWidget
            type="button"
            variant="secondary"
            onClick={handleReset}
            icon="✕"
            title="Clear all search filters"
          >
            Clear Filters
          </ButtonWidget>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
