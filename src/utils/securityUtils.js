// Encode HTML special characters to prevent XSS
export const encodeHTML = (text) => {
  if (typeof text !== 'string') return text;
  
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
};

// Encode URI component to prevent injection
export const encodeURI = (text) => {
  if (typeof text !== 'string') return text;
  return encodeURIComponent(text).replace(/'/g, '%27');
};

// Encode attribute value to prevent injection
export const encodeAttribute = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize user input for search queries
export const sanitizeInput = (input) => {
  if (!input) return '';
  
  // Remove potential script tags and dangerous patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, '')
    .trim();
  
  // Limit length to prevent memory-based attacks
  return sanitized.substring(0, 255);
};

// Validate postcode format (UK postcodes)
export const validatePostcode = (postcode) => {
  if (!postcode) return true; // Empty is allowed
  
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d?[A-Z]{0,2}$/i;
  return postcodeRegex.test(postcode.trim());
};

/**
 * Validates price input to prevent injection
 * Ensures only numeric values and currency symbols are allowed
 * @param {string|number} price - Price to validate
 * @returns {boolean} - Whether price is valid
 */
export const validatePrice = (price) => {
  if (price === '' || price === null || price === undefined) return true;
  const priceRegex = /^\d+(\.\d{0,2})?$/;
  return priceRegex.test(String(price));
};

/**
 * Validates bedrooms count
 * @param {number} bedrooms - Number of bedrooms
 * @returns {boolean} - Whether bedrooms value is valid
 */
export const validateBedrooms = (bedrooms) => {
  if (bedrooms === '' || bedrooms === null || bedrooms === undefined) return true;
  const num = parseInt(bedrooms, 10);
  return num >= 0 && num <= 20 && !isNaN(num);
};

/**
 * Creates a safe object copy to prevent prototype pollution
 * @param {object} obj - Object to copy
 * @returns {object} - Safe copy of object
 */
export const safeObjectCopy = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Prevent prototype pollution by avoiding __proto__ and constructor
  const copy = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && 
        key !== '__proto__' && 
        key !== 'constructor' && 
        key !== 'prototype') {
      copy[key] = obj[key];
    }
  }
  return copy;
};

/**
 * Validates that a URL is safe to navigate to
 * Prevents javascript: and data: URLs
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is safe
 */
export const isSafeURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const safeProtocols = ['http://', 'https://', '/'];
  const lowerURL = url.toLowerCase().trim();
  
  return safeProtocols.some(protocol => lowerURL.startsWith(protocol));
};

/**
 * Removes potentially dangerous attributes from HTML strings
 * Used for content that must contain HTML but needs to be safe
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.textContent = html; // Use textContent, not innerHTML
  
  return tempDiv.innerHTML;
};

/**
 * Validates JSON to prevent injection attacks
 * @param {string} jsonString - JSON string to validate
 * @returns {object|null} - Parsed object or null if invalid
 */
export const safeJSONParse = (jsonString) => {
  try {
    // Validate that it looks like JSON
    if (typeof jsonString !== 'string') return null;
    if (!jsonString.trim().startsWith('{') && !jsonString.trim().startsWith('[')) return null;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON provided:', error);
    return null;
  }
};

/**
 * Creates a Content Security Policy nonce (for inline styles/scripts if needed)
 * In production, this should be generated server-side
 * @returns {string} - Random nonce string
 */
export const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Prevents timing attacks by using consistent-time comparison
 * Useful for comparing sensitive data
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - Whether strings match
 */
export const secureStringCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};
