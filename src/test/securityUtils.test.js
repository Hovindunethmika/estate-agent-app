import {
  encodeHTML,
  sanitizeInput,
  validatePostcode,
  validatePrice,
  validateBedrooms,
  safeObjectCopy,
  isSafeURL,
  safeJSONParse,
} from '../utils/securityUtils';

describe('Security Utils', () => {
  // Test 1: HTML encoding prevents XSS
  it('should encode HTML special characters to prevent XSS', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const encoded = encodeHTML(maliciousInput);

    expect(encoded).not.toContain('<script>');
    expect(encoded).toContain('&lt;');
    expect(encoded).toContain('&gt;');
  });

  // Test 2: Sanitize input removes dangerous patterns
  it('should remove script tags and dangerous patterns from input', () => {
    const maliciousInput =
      '<script>alert("XSS")</script> Normal text javascript:void(0) onclick="alert()"';
    const sanitized = sanitizeInput(maliciousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('onclick');
  });

  // Test 3: Postcode validation for UK format
  it('should validate UK postcode format correctly', () => {
    expect(validatePostcode('SW1A 1AA')).toBe(true);
    expect(validatePostcode('M1 1AA')).toBe(true);
    expect(validatePostcode('B33 8TH')).toBe(true);
    expect(validatePostcode('INVALID<>')).toBe(false);
    expect(validatePostcode('')).toBe(true); // Empty allowed
  });

  // Test 4: Price validation
  it('should validate price input format', () => {
    expect(validatePrice('250000')).toBe(true);
    expect(validatePrice('250000.50')).toBe(true);
    expect(validatePrice('250,000')).toBe(false); // Invalid format
    expect(validatePrice('abc')).toBe(false);
    expect(validatePrice('')).toBe(true); // Empty allowed
  });

  // Test 5: Bedrooms validation
  it('should validate bedroom count range', () => {
    expect(validateBedrooms('0')).toBe(true);
    expect(validateBedrooms('5')).toBe(true);
    expect(validateBedrooms('20')).toBe(true);
    expect(validateBedrooms('-5')).toBe(false); // Negative not allowed
    expect(validateBedrooms('25')).toBe(false); // Over max
    expect(validateBedrooms('abc')).toBe(false);
    expect(validateBedrooms('')).toBe(true); // Empty allowed
  });

  // Test 6: Safe object copy prevents prototype pollution
  it('should prevent prototype pollution in object copy', () => {
    const dangerous = {
      normal: 'value',
      __proto__: { polluted: true },
      constructor: 'fake',
    };

    const safe = safeObjectCopy(dangerous);

    expect(safe.normal).toBe('value');
    expect(safe.__proto__).toBeUndefined();
    expect(safe.constructor).toBeUndefined();
  });

  // Test 7: URL validation for safe navigation
  it('should validate safe URLs and reject unsafe protocols', () => {
    expect(isSafeURL('https://example.com')).toBe(true);
    expect(isSafeURL('http://example.com')).toBe(true);
    expect(isSafeURL('/relative/path')).toBe(true);
    expect(isSafeURL('javascript:alert("XSS")')).toBe(false);
    expect(isSafeURL('data:text/html,<script>alert("XSS")</script>')).toBe(false);
  });

  // Test 8: Safe JSON parsing
  it('should safely parse valid JSON and reject invalid input', () => {
    const validJSON = '{"name":"John","age":30}';
    const parsed = safeJSONParse(validJSON);

    expect(parsed).toEqual({ name: 'John', age: 30 });

    const invalidJSON = '{invalid json}';
    const invalidParsed = safeJSONParse(invalidJSON);

    expect(invalidParsed).toBeNull();

    const dangerousInput = 'alert("XSS")';
    const dangerousParsed = safeJSONParse(dangerousInput);

    expect(dangerousParsed).toBeNull();
  });

  // Test 9: Input length limiting prevents memory attacks
  it('should limit input length to prevent memory exhaustion', () => {
    const longInput = 'a'.repeat(500);
    const sanitized = sanitizeInput(longInput);

    expect(sanitized.length).toBeLessThanOrEqual(255);
  });
});
