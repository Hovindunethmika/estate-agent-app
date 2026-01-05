import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { FileText, Home, Map, Heart } from 'lucide-react';
import { encodeHTML } from '../utils/securityUtils';
import 'react-tabs/style/react-tabs.css';

export default function PropertyTabs({ property, isFavourite = false, onToggleFavourite = null }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <Tabs className="property-tabs-container" style={{ flex: 1 }}>
          <TabList className="property-tabs-list">
            <Tab className="property-tab">
              <FileText size={16} />
              <span>Description</span>
            </Tab>
            <Tab className="property-tab">
              <Home size={16} />
              <span>Floor Plan</span>
            </Tab>
            <Tab className="property-tab">
              <Map size={16} />
              <span>Location</span>
            </Tab>
            </TabList>

        {/* Description Tab */}
        <TabPanel className="property-tab-panel">
          <div style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e3a5f',
              marginBottom: '16px'
            }}>Property Description</h3>
            <p style={{
              color: '#555',
              lineHeight: '1.6',
              fontSize: '15px',
              whiteSpace: 'pre-line'
            }}>
              {encodeHTML(property.long_description)}
            </p>
            {property.url && (
              <p style={{
                marginTop: '16px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>Property Reference:</strong> <code style={{
                  backgroundColor: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>{encodeHTML(property.url)}</code>
              </p>
            )}
          </div>
        </TabPanel>

        {/* Floor Plan Tab */}
        <TabPanel className="property-tab-panel">
          <div style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e3a5f',
              marginBottom: '16px'
            }}>Floor Plan</h3>
            <div style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              overflow: 'hidden',
              textAlign: 'center'
            }}>
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={property.images[0]}
                    alt="Floor plan"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                  <p style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    color: '#666',
                    margin: 0,
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} property
                  </p>
                </>
              ) : (
                <p style={{
                  padding: '32px 16px',
                  color: '#999',
                  fontSize: '14px'
                }}>No floor plan available</p>
              )}
            </div>
          </div>
        </TabPanel>

        {/* Location Tab */}
        <TabPanel className="property-tab-panel">
          <div style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e3a5f',
              marginBottom: '16px'
            }}>Location</h3>
            <div style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '16 / 10'
            }}>
              <iframe
                title={`Map for ${property.location}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px'
                }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKeyForDemo&q=${encodeURIComponent(property.location + ', ' + (property.postcode || ''))}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p style={{
              marginTop: '12px',
              fontSize: '14px',
              color: '#666',
              textAlign: 'center'
            }}>
              📍 {encodeHTML(property.location)}, {encodeHTML(property.postcode || 'UK')}
            </p>
          </div>
        </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
