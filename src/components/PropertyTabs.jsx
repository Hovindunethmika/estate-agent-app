import React, { useState } from 'react';
import { FileText, Home, Map } from 'lucide-react';
import { encodeHTML } from '../utils/securityUtils';

export default function PropertyTabs({ property }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'floorplan', label: 'Floor Plan', icon: Home },
    { id: 'map', label: 'Location', icon: Map }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Tabs List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px 8px 0 0',
        padding: '8px',
        gap: '4px',
        marginBottom: 0
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#1e3a5f' : '#666',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 58, 95, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={16} />
              <span style={{
                display: 'inline'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Description Tab */}
        {activeTab === 'description' && (
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
        )}

        {/* Floor Plan Tab */}
        {activeTab === 'floorplan' && (
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
        )}

        {/* Location Tab */}
        {activeTab === 'map' && (
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
                title={`Map for ${encodeHTML(property.location)}`}
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
        )}
      </div>
    </div>
  );
}
