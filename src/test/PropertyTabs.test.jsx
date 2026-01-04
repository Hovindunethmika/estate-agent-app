import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PropertyTabs from '../components/PropertyTabs';

jest.mock('../utils/securityUtils', () => ({
  encodeHTML: (text) => text,
  isSafeURL: (url) => url && (url.startsWith('http') || url.startsWith('https') || url.startsWith('/')),
}));

describe('PropertyTabs Component - Tab Switching', () => {
  const mockProperty = {
    id: 'prop1',
    title: 'Beautiful Family Home',
    type: 'house',
    price: 750000,
    bedrooms: 4,
    location: 'London, UK',
    postcode: 'SW1A 1AA',
    short_description: 'A stunning family home.',
    long_description: 'A stunning family home with modern amenities and spacious garden. Perfect for families.',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    ],
    floor_plan: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    date_added: '2025-12-15',
    latitude: 51.5074,
    longitude: -0.1477,
    url: 'prop.example.com',
  };

  // Test 1: All tabs render initially
  it('should render all three tab buttons (Description, Floor Plan, Location)', () => {
    render(<PropertyTabs property={mockProperty} />);

    expect(screen.getByRole('tab', { name: /Description/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Floor Plan/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Location/i })).toBeInTheDocument();
  });

  // Test 2: Description tab is active by default and shows content
  it('should display Description tab content by default', () => {
    render(<PropertyTabs property={mockProperty} />);

    expect(screen.getByText('Property Description')).toBeInTheDocument();
    expect(screen.getByText(/A stunning family home with modern amenities/)).toBeInTheDocument();
  });

  // Test 3: Clicking Floor Plan tab shows floor plan content
  it('should reveal Floor Plan content when Floor Plan tab is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    // Initially, Floor Plan heading should not be visible (only tab is visible)
    const allFloorPlanElements = screen.queryAllByText('Floor Plan');
    // Should only have the tab, not the heading
    expect(allFloorPlanElements.length).toBe(1);

    // Click the Floor Plan tab
    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    await user.click(floorPlanTab);

    // Now Floor Plan heading should be visible
    const floorPlanElements = screen.queryAllByText('Floor Plan');
    expect(floorPlanElements.length).toBeGreaterThan(1); // Tab + heading
    
    // Check for floor plan content
    expect(screen.getByText(/bedroom/i)).toBeInTheDocument();
  });

  // Test 4: Clicking Location tab shows location content with Map iframe
  it('should reveal Location tab with Map iframe when Location tab is clicked', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    // Initially, Location heading should not be visible (only tab)
    const allLocationElements = screen.queryAllByText('Location');
    expect(allLocationElements.length).toBe(1); // Only the tab

    // Click the Location tab
    const locationTab = screen.getByRole('tab', { name: /Location/i });
    await user.click(locationTab);

    // Now Location heading should be visible
    const locationElementsAfter = screen.queryAllByText('Location');
    expect(locationElementsAfter.length).toBeGreaterThan(1); // Tab + heading

    // Check for map iframe
    const mapIframe = screen.getByTitle(/Map for London/i);
    expect(mapIframe).toBeInTheDocument();
    expect(mapIframe).toHaveAttribute('src');
    expect(mapIframe.getAttribute('src')).toContain('maps/embed');
    expect(mapIframe.getAttribute('src')).toContain('London');
    expect(mapIframe.getAttribute('src')).toContain('SW1A%201AA');

    // Check for location display
    expect(screen.getByText(/📍 London, UK/i)).toBeInTheDocument();
  });

  // Test 5: Tab switching works - Description → Floor Plan → Location → Description
  it('should allow switching between all tabs in sequence', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    // Start: Description should be visible
    expect(screen.getByText('Property Description')).toBeInTheDocument();

    // Switch to Floor Plan
    await user.click(screen.getByRole('tab', { name: /Floor Plan/i }));
    // Verify Floor Plan heading is now visible (not just the tab)
    const floorPlanHeadings = screen.queryAllByText('Floor Plan');
    expect(floorPlanHeadings.length).toBeGreaterThan(1);
    expect(screen.queryByText('Property Description')).not.toBeInTheDocument();

    // Switch to Location
    await user.click(screen.getByRole('tab', { name: /Location/i }));
    // Verify Location heading is now visible
    const locationHeadings = screen.queryAllByText('Location');
    expect(locationHeadings.length).toBeGreaterThan(1);
    const floorPlanHeadingsAfter = screen.queryAllByText('Floor Plan');
    // Floor Plan should only be in tab, not as heading
    expect(floorPlanHeadingsAfter.length).toBe(1);

    // Switch back to Description
    await user.click(screen.getByRole('tab', { name: /Description/i }));
    expect(screen.getByText('Property Description')).toBeInTheDocument();
    const locationHeadingsAfter = screen.queryAllByText('Location');
    expect(locationHeadingsAfter.length).toBe(1); // Only in tab
  });

  // Test 6: Location tab shows correct postcode
  it('should display correct location and postcode in Location tab', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    const locationTab = screen.getByRole('tab', { name: /Location/i });
    await user.click(locationTab);

    expect(screen.getByText(/SW1A 1AA/)).toBeInTheDocument();
    expect(screen.getByText(/London, UK/)).toBeInTheDocument();
  });

  // Test 7: Floor Plan shows bedroom count
  it('should display bedroom count in Floor Plan tab', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    await user.click(floorPlanTab);

    expect(screen.getByText(/4 bedrooms property/)).toBeInTheDocument();
  });

  // Test 8: Floor Plan shows single bedroom correctly
  it('should display "1 bedroom" (singular) when property has 1 bedroom', async () => {
    const user = userEvent.setup();
    const singleBedroomProperty = {
      ...mockProperty,
      bedrooms: 1,
    };

    render(<PropertyTabs property={singleBedroomProperty} />);

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    await user.click(floorPlanTab);

    expect(screen.getByText(/1 bedroom property/)).toBeInTheDocument();
  });

  // Test 9: Description tab shows property reference if URL exists
  it('should display property reference when URL is provided', () => {
    render(<PropertyTabs property={mockProperty} />);

    expect(screen.getByText(/Property Reference:/)).toBeInTheDocument();
    expect(screen.getByText('prop.example.com')).toBeInTheDocument();
  });

  // Test 10: Map iframe has correct accessibility attributes
  it('should have correct accessibility attributes on map iframe', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    const locationTab = screen.getByRole('tab', { name: /Location/i });
    await user.click(locationTab);

    const mapIframe = screen.getByTitle(/Map for London/i);
    expect(mapIframe).toHaveAttribute('referrerPolicy', 'no-referrer-when-downgrade');
    expect(mapIframe).toHaveAttribute('loading', 'lazy');
    expect(mapIframe).toHaveAttribute('src');
    expect(mapIframe.getAttribute('src')).toContain('maps/embed');
  });

  // Test 11: Tab panels are properly associated with tabs
  it('should have proper ARIA associations between tabs and panels', () => {
    render(<PropertyTabs property={mockProperty} />);

    const descriptionTab = screen.getByRole('tab', { name: /Description/i });
    expect(descriptionTab).toHaveAttribute('aria-selected', 'true');

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    expect(floorPlanTab).toHaveAttribute('aria-selected', 'false');
  });

  // Test 12: Keyboard navigation - Arrow keys work
  it('should support keyboard navigation between tabs', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    const descriptionTab = screen.getByRole('tab', { name: /Description/i });
    descriptionTab.focus();

    // Press Right arrow to move to next tab (Floor Plan)
    await user.keyboard('{ArrowRight}');

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    expect(floorPlanTab).toHaveAttribute('aria-selected', 'true');
  });

  // Test 13: Floor Plan tab displays image when images array has items
  it('should display floor plan image from property.images array', async () => {
    const user = userEvent.setup();
    render(<PropertyTabs property={mockProperty} />);

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    await user.click(floorPlanTab);

    const floorPlanImage = screen.getByAltText('Floor plan');
    expect(floorPlanImage).toBeInTheDocument();
    expect(floorPlanImage.src).toContain('unsplash.com');
  });

  // Test 14: Floor Plan shows "No floor plan available" when no images
  it('should show "No floor plan available" message when images array is empty', async () => {
    const user = userEvent.setup();
    const propertyNoImages = {
      ...mockProperty,
      images: [],
    };

    render(<PropertyTabs property={propertyNoImages} />);

    const floorPlanTab = screen.getByRole('tab', { name: /Floor Plan/i });
    await user.click(floorPlanTab);

    expect(screen.getByText('No floor plan available')).toBeInTheDocument();
  });

  // Test 15: Tab content updates when property prop changes
  it('should update content when property data changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PropertyTabs property={mockProperty} />);

    // Verify initial content
    expect(screen.getByText(/A stunning family home with modern amenities/)).toBeInTheDocument();

    // Change property
    const updatedProperty = {
      ...mockProperty,
      long_description: 'Updated description for the property.',
      location: 'Manchester, UK',
    };

    rerender(<PropertyTabs property={updatedProperty} />);

    // Verify updated description in Description tab
    expect(screen.getByText('Updated description for the property.')).toBeInTheDocument();

    // Verify updated location in Location tab
    const locationTab = screen.getByRole('tab', { name: /Location/i });
    await user.click(locationTab);

    expect(screen.getByText(/Manchester, UK/)).toBeInTheDocument();
  });
});
