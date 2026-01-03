import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567573883475-8f5b8c5e7e0d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522777967541-ca05a3c9d60d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11cb3367?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502707291154-c309e1fae4c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9b274b0b0cb1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522156573992-46earth9c89a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502131143081-8b376e0dbbab?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615899291744-a91733e01d8d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613489261073-6f13ee77a4be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507652313519-d4dc28516e98?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574909114555-8d4f4c1f3d4e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502707291154-c309e1fae4c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522156573992-46earth9c89a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565183938294-7563f2a60dba?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608873528504-d26e4c404cee?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11cb3367?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507652313519-d4dc28516e98?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1502672260066-6bc35f0af07e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578321272176-eea3f9df55f5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9b274b0b0cb1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615899291744-a91733e01d8d?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1502672260066-6bc35f0af07e?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78991c7aeb1b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564399579545-f5371407e961?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502707291154-c309e1fae4c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop"
    ],
    floor_plan: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
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
  );
};

export default App;
