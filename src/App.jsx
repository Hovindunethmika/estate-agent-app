import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import './App.css';

// Embedded properties data - 7 properties total
const PROPERTIES_DATA = [
  {
    id: 1,
    type: "house",
    price: 450000,
    bedrooms: 3,
    date_added: "2024-12-15",
    postcode: "BR1",
    title: "123 Oak Avenue, Bromley",
    location: "123 Oak Avenue, Bromley",
    short_description: "Stunning 3-bedroom Victorian house with modern interior.",
    long_description: "Stunning 3-bedroom Victorian house with modern interior. This beautiful property features original period details combined with contemporary living spaces. The spacious garden is perfect for entertaining.",
    images: [
      "/images/house 1/house 1 main.jpg",
      "/images/house 1/alejandra-cifre-gonzalez-5nYLmG1m5lw-unsplash.jpg",
      "/images/house 1/backbone-L4iRkKL5dng-unsplash.jpg",
      "/images/house 1/spacejoy-trG8989WjFA-unsplash.jpg",
      "/images/house 1/spacejoy-umAXneH4GhA-unsplash.jpg",
      "/images/house 1/spacejoy-XM-miHibz64-unsplash.jpg"
    ],
    floor_plan: "/images/house 1/house 1 main.jpg",
    latitude: 51.4084,
    longitude: -0.0193
  },
  {
    id: 2,
    type: "flat",
    price: 275000,
    bedrooms: 2,
    date_added: "2024-12-20",
    postcode: "NW1",
    title: "45 Camden Square, London",
    location: "45 Camden Square, London",
    short_description: "Modern 2-bedroom apartment in prime location.",
    long_description: "Modern 2-bedroom apartment in prime location. Close to shops, restaurants and transport links. Recently renovated with quality finishes throughout.",
    images: [
      "/images/flat 1/flat 1 main.jpg",
      "/images/flat 1/becca-tapert-p6h5U-ns9o0-unsplash.jpg",
      "/images/flat 1/julia-ABohRftG_Os-unsplash.jpg",
      "/images/flat 1/minh-pham-7pCFUybP_P8-unsplash.jpg",
      "/images/flat 1/roxanne-joncas-DxLGT3bEKkE-unsplash.jpg",
      "/images/flat 1/sophie-peng-HaP28Y3ZGSg-unsplash.jpg"
    ],
    floor_plan: "/images/flat 1/flat 1 main.jpg",
    latitude: 51.5339,
    longitude: -0.1370
  },
  {
    id: 3,
    type: "house",
    price: 650000,
    bedrooms: 4,
    date_added: "2024-11-28",
    postcode: "SW3",
    title: "78 Chelsea Gardens, Chelsea",
    location: "78 Chelsea Gardens, Chelsea",
    short_description: "Luxury 4-bedroom family home with garden.",
    long_description: "Luxury 4-bedroom family home with garden. Prestigious Chelsea location with excellent schools nearby. Includes off-street parking and mature landscaping.",
    images: [
      "/images/house 2/house 2 main.jpg",
      "/images/house 2/bailey-alexander-cYeCxtKpTTQ-unsplash.jpg",
      "/images/house 2/lotus-design-n-print-g51F6-WYzyU-unsplash.jpg",
      "/images/house 2/spacejoy-KSfe2Z4REEM-unsplash.jpg",
      "/images/house 2/spacejoy-RUvW1KGD9a4-unsplash.jpg",
      "/images/house 2/spacejoy-YI2YkyaREHk-unsplash.jpg"
    ],
    floor_plan: "/images/house 2/house 2 main.jpg",
    latitude: 51.4869,
    longitude: -0.1719
  },
  {
    id: 4,
    type: "flat",
    price: 195000,
    bedrooms: 1,
    date_added: "2024-12-22",
    postcode: "E14",
    title: "12 Canary Wharf, London",
    location: "12 Canary Wharf, London",
    short_description: "Stylish studio apartment with river views.",
    long_description: "Stylish studio apartment with river views. High-spec modern design with contemporary kitchen and bathroom. Perfect for professionals or investors.",
    images: [
      "/images/flat 2/flat 2 main.jpg",
      "/images/flat 2/adam-winger-t4oVP2xFMJ8-unsplash.jpg",
      "/images/flat 2/grovemade-dS62MvK4CtM-unsplash.jpg",
      "/images/flat 2/johanne-pold-jacobsen-jKO_cXvui_E-unsplash.jpg",
      "/images/flat 2/michal-parzuchowski-UrNjM4qXVts-unsplash.jpg",
      "/images/flat 2/minh-pham-1_B4Zzh7UpQ-unsplash.jpg"
    ],
    floor_plan: "/images/flat 2/flat 2 main.jpg",
    latitude: 51.5041,
    longitude: -0.0215
  },
  {
    id: 5,
    type: "house",
    price: 825000,
    bedrooms: 5,
    date_added: "2024-12-01",
    postcode: "W1",
    title: "34 Mayfair Street, Westminster",
    location: "34 Mayfair Street, Westminster",
    short_description: "Exceptional 5-bedroom townhouse in Mayfair.",
    long_description: "Exceptional 5-bedroom townhouse in Mayfair. Prime central London location with original period features and modern amenities. Ready to occupy.",
    images: [
      "/images/house 3/house 3 main.jpg",
      "/images/house 3/bilal-mansuri-vTj_dmFGB1Y-unsplash.jpg",
      "/images/house 3/pankaj-shah-1ff_i7jO-4g-unsplash.jpg",
      "/images/house 3/spacejoy-1vieZivk1As-unsplash.jpg",
      "/images/house 3/spacejoy-65k2klkcvT8-unsplash.jpg",
      "/images/house 3/spacejoy-XM-miHibz64-unsplash (1).jpg"
    ],
    floor_plan: "/images/house 3/house 3 main.jpg",
    latitude: 51.5074,
    longitude: -0.1477
  },
  {
    id: 6,
    type: "flat",
    price: 320000,
    bedrooms: 2,
    date_added: "2024-12-18",
    postcode: "BR1",
    title: "89 High Street, Bromley",
    location: "89 High Street, Bromley",
    short_description: "Contemporary 2-bed flat with balcony.",
    long_description: "Contemporary 2-bed flat with balcony. Located on a vibrant high street with good amenities. Modern finishes with open plan living.",
    images: [
      "/images/flat 3/flat 3 main.jpg",
      "/images/flat 3/lotus-design-n-print-4-7s995Kv1U-unsplash.jpg",
      "/images/flat 3/lotus-design-n-print-WDUtNbot6Qw-unsplash.jpg",
      "/images/flat 3/mykola-kolya-korzh-8jo4TvHtVKM-unsplash.jpg",
      "/images/flat 3/prydumano-design-khtBWc3U57Q-unsplash.jpg",
      "/images/flat 3/prydumano-design-VZ2z8ozzy10-unsplash.jpg"
    ],
    floor_plan: "/images/flat 3/flat 3 main.jpg",
    latitude: 51.4084,
    longitude: -0.0193
  },
  {
    id: 7,
    type: "house",
    price: 550000,
    bedrooms: 3,
    date_added: "2024-12-10",
    postcode: "NW1",
    title: "156 Regent Park Road, Camden",
    location: "156 Regent Park Road, Camden",
    short_description: "Charming 3-bedroom semi-detached house.",
    long_description: "Charming 3-bedroom semi-detached house. Located in popular residential area with excellent schools and transport. Well-maintained with potential for extension.",
    images: [
      "/images/house 4/house 4 main.jpg",
      "/images/house 4/antoine-gravier-2QxjeVERIPw-unsplash.jpg",
      "/images/house 4/geike-verniers-cf0GUoIOBmc-unsplash.jpg",
      "/images/house 4/jason-briscoe-AQl-J19ocWE-unsplash.jpg",
      "/images/house 4/kara-eads-L7EwHkq1B2s-unsplash.jpg",
      "/images/house 4/spacejoy-MjvGoa_oRts-unsplash.jpg"
    ],
    floor_plan: "/images/house 4/house 4 main.jpg",
    latitude: 51.5339,
    longitude: -0.1370
  }
];

const App = () => {
  // Shared state for properties and favorites
  const [allProperties, setAllProperties] = useState(PROPERTIES_DATA);
  const [favourites, setFavourites] = useState(() => {
    // Load favorites from localStorage on mount
    try {
      const saved = localStorage.getItem('estateAgentFavourites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('estateAgentFavourites', JSON.stringify(favourites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favourites]);

  // Add to favorites (prevent duplicates)
  const handleAddToFavourites = (property) => {
    setFavourites(prevFavourites => {
      if (prevFavourites.some(fav => fav.id === property.id)) {
        return prevFavourites;
      }
      return [...prevFavourites, property];
    });
  };

  // Remove from favorites
  const handleRemoveFromFavourites = (propertyId) => {
    setFavourites(favourites.filter(fav => fav.id !== propertyId));
  };

  // Clear all favorites
  const handleClearFavourites = () => {
    setFavourites([]);
  };

  // Handle drop event on favorites list
  const handleDropOnFavourites = (propertyId) => {
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
      handleAddToFavourites(property);
    }
  };

  // Handle drag-out removal from favorites
  const handleDragOutRemoveFromFavourites = (propertyId) => {
    handleRemoveFromFavourites(propertyId);
  };

  // Render app with routing
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                allProperties={allProperties}
                favourites={favourites}
                onAddToFavourites={handleAddToFavourites}
                onRemoveFromFavourites={handleRemoveFromFavourites}
                onClearFavourites={handleClearFavourites}
                onDropOnFavourites={handleDropOnFavourites}
                onDragOutRemoveFromFavourites={handleDragOutRemoveFromFavourites}
              />
            }
          />
          <Route 
            path="/property/:id" 
            element={
              <PropertyDetailsPage 
                allProperties={allProperties}
                onAddToFavourites={handleAddToFavourites}
                onRemoveFromFavourites={handleRemoveFromFavourites}
                favourites={favourites}
              />
            }
          />
        </Routes>
      </Router>
    </DndProvider>
  );
};

export default App;
