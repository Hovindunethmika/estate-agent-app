# Estate Agent App

A modern, secure estate agent application built with React and Vite. This application allows users to search, filter, and view property listings with a focus on security and user experience.

## Features

- **Property Search**: Filter properties by location, price range, bedrooms, postcode, and date added
- **Favorites System**: Save and manage favorite properties
- **Property Details**: View detailed information about each property with image galleries
- **Secure Implementation**: Built with security best practices including XSS protection, CSP headers, and input sanitization
- **Responsive Design**: Mobile-friendly interface
- **Client-Side Only**: No server required - runs entirely in the browser

## Tech Stack

- **React 19.2.0**: Modern UI library with hooks
- **Vite 7.2.4**: Fast build tool and dev server
- **React Router DOM**: Client-side routing
- **React Image Gallery**: Image carousel functionality
- **React Tabs**: Tabbed interface components
- **React DnD**: Drag-and-drop functionality
- **ESLint**: Code quality and consistency

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot module replacement:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
estate-agent-app/
├── public/              # Static assets
│   ├── properties.json  # Property data
│   └── images/         # Property images
├── src/
│   ├── components/     # React components
│   │   ├── FavouritesList.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyDetails.jsx
│   │   ├── PropertyList.jsx
│   │   └── SearchForm.jsx
│   ├── utils/          # Utility functions
│   │   ├── searchUtils.js
│   │   └── securityUtils.js
│   ├── test/           # Test files
│   │   └── App.test.jsx
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template with security headers
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## Security Features

This application implements several security best practices:

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Input Sanitization**: All user inputs are validated and sanitized
- **Secure Data Handling**: HTML encoding for all displayed data

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Make your changes
2. Run `npm run lint` to check code quality
3. Test thoroughly
4. Submit your changes

## License

This project is private and not licensed for public use.

## React + Vite

This project uses Vite for fast development and building. The template provides:

- Hot Module Replacement (HMR)
- Fast refresh
- ESLint configuration
- Modern React patterns

For more information about Vite configuration, see the [Vite documentation](https://vite.dev/).
