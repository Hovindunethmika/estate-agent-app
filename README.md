# Estate Agent App

A modern React-based estate agent web application for browsing and managing property listings.

## Features

- **Property Listings**: Browse various properties (flats and houses)
- **Search & Filter**: Search properties by location, price, and amenities
- **Property Details**: View detailed information about each property
- **Gallery**: Interactive image gallery for each property
- **Favorites**: Save your favorite properties to a favorites list
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **React Tabs**: Tabbed interface
- **React DnD**: Drag-and-drop functionality
- **React Image Gallery**: Image carousel component
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── utils/           # Utility functions
├── App.jsx          # Main App component
└── main.jsx         # Entry point
```

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions on every push to the `master` branch.

**Live Demo**: [https://hovindunethmika.github.io/estate-agent-app/](https://hovindunethmika.github.io/estate-agent-app/)

## License

MIT
