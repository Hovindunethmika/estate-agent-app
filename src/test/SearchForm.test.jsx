import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SearchForm from '../components/SearchForm';

// Mock the security utils
jest.mock('../utils/securityUtils', () => ({
  sanitizeInput: (input) => input,
  validatePostcode: (postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d?[A-Z]{0,2}$/i;
    return !postcode || postcodeRegex.test(postcode.trim());
  },
}));

describe('SearchForm Component', () => {
  // Test 1: Component renders with all input fields
  it('should render all search input fields', () => {
    const mockOnSearch = jest.fn();

    render(<SearchForm onSearch={mockOnSearch} />);

    // React Widgets render differently, so use data-testid for reliable targeting
    expect(screen.getByTestId('property-type-field')).toBeInTheDocument();
    expect(screen.getByTestId('postcode-field')).toBeInTheDocument();
    expect(screen.getByTestId('min-bedrooms-field')).toBeInTheDocument();
    expect(screen.getByTestId('max-bedrooms-field')).toBeInTheDocument();
    expect(screen.getByTestId('date-from-field')).toBeInTheDocument();
    expect(screen.getByTestId('date-to-field')).toBeInTheDocument();
  });

  // Test 2: Search with valid criteria
  it('should call onSearch with valid criteria', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    // Submit form by clicking search button
    const searchButton = screen.getByRole('button', { name: /Search|Find/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  // Test 3: Clear filters functionality
  it('should clear all filters when clear button is clicked', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    // Find and click reset button
    const resetButton = screen.getByRole('button', { name: /Reset|Clear/i });
    await user.click(resetButton);

    // After reset, onSearch should be called with default filters
    expect(mockOnSearch).toHaveBeenCalled();
    const callArgs = mockOnSearch.mock.calls[mockOnSearch.mock.calls.length - 1][0];
    expect(callArgs.type).toBe('any');
    expect(callArgs.minPrice).toBe(0);
    expect(callArgs.maxPrice).toBe(2000000);
  });

  // Test 4: Search form renders form title
  it('should render form title', () => {
    const mockOnSearch = jest.fn();

    render(<SearchForm onSearch={mockOnSearch} />);

    expect(screen.getByText('Find Your Dream Property')).toBeInTheDocument();
  });

  // Test 5: Search form has price range label
  it('should render price range label', () => {
    const mockOnSearch = jest.fn();

    render(<SearchForm onSearch={mockOnSearch} />);

    expect(screen.getByText(/Price Range:/i)).toBeInTheDocument();
  });

  // Test 6: Form submission works
  it('should handle form submission', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    // Click search button
    const searchButton = screen.getByRole('button', { name: /Search/i });
    await user.click(searchButton);

    // onSearch should be called with current filter state
    expect(mockOnSearch).toHaveBeenCalled();
    expect(mockOnSearch.mock.calls[0][0]).toEqual({
      type: 'any',
      minPrice: 0,
      maxPrice: 2000000,
      minBedrooms: 0,
      maxBedrooms: 10,
      dateFrom: null,
      dateTo: null,
      postcode: ''
    });
  });
});
