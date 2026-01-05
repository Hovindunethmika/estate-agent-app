// Encode HTML special characters to prevent XSS
export const encodeHTML = (text) => {
  if (typeof text !== 'string') return text;
  
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
};
