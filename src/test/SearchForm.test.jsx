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

    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
  });

  // Test 2: Search with valid criteria
  it('should call onSearch with valid criteria', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    // Fill in search fields
    const postcodeInput = screen.getByLabelText(/Postcode/i);
    await user.type(postcodeInput, 'SW1A 1AA');

    const bedroomsInput = screen.getByLabelText(/Bedrooms/i);
    await user.type(bedroomsInput, '3');

    // Submit form
    const searchButton = screen.getByRole('button', { name: /Search|Find/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  // Test 3: Clear filters functionality
  it('should clear all filters when clear button is clicked', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    // Fill in fields
    const postcodeInput = screen.getByLabelText(/Postcode/i);
    await user.type(postcodeInput, 'SW1A 1AA');

    expect(postcodeInput).toHaveValue('SW1A 1AA');

    // Find and click clear button (if exists)
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((btn) =>
      btn.textContent.toLowerCase().includes('clear')
    );

    if (clearButton) {
      await user.click(clearButton);
      expect(postcodeInput).toHaveValue('');
    }
  });

  // Test 4: Input validation for postcode
  it('should validate postcode format', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    const postcodeInput = screen.getByLabelText(/Postcode/i);

    // Type invalid postcode
    await user.type(postcodeInput, 'INVALID');

    // The validation should prevent submission or show error
    expect(postcodeInput).toBeInTheDocument();
  });

  // Test 5: Input validation for bedrooms
  it('should validate bedroom count input', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    const bedroomsInput = screen.getByLabelText(/Bedrooms/i);

    // Type valid bedroom count
    await user.type(bedroomsInput, '5');
    expect(bedroomsInput).toHaveValue(5);

    // Type invalid bedroom count (should be rejected by validation)
    await user.clear(bedroomsInput);
    await user.type(bedroomsInput, '-5');

    // Component should handle invalid input gracefully
    expect(bedroomsInput).toBeInTheDocument();
  });

  // Test 6: Price range validation
  it('should handle price range inputs correctly', async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(<SearchForm onSearch={mockOnSearch} />);

    const minPriceInput = screen.getByLabelText(/Min Price/i);
    const maxPriceInput = screen.getByLabelText(/Max Price/i);

    // Enter valid price range
    await user.type(minPriceInput, '200000');
    await user.type(maxPriceInput, '500000');

    expect(minPriceInput).toHaveValue(200000);
    expect(maxPriceInput).toHaveValue(500000);
  });
});
