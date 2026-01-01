/**
 * Main Entry Point for Estate Agent Application
 * 
 * This file initializes the React application by rendering the root App component
 * into the DOM. It runs entirely client-side with no server dependencies.
 * 
 * Technologies:
 * - React 18+ with StrictMode for development warnings
 * - ReactDOM for rendering to the root element
 * - CSS styling via App.css and index.css
 * 
 * @author Estate Agent App Team
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';

// Initialize React root and render the main App component
// The root element is defined in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
