import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function PropertyGallery({ images, title }) {
  const [mainImage, setMainImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setMainImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Main Image */}
        <div style={{
          position: 'relative',
          group: true,
          marginBottom: '0'
        }}
        onMouseEnter={(e) => {
          const buttons = e.currentTarget.querySelectorAll('.nav-button');
          buttons.forEach(btn => {
            btn.style.opacity = '1';
          });
        }}
        onMouseLeave={(e) => {
          const buttons = e.currentTarget.querySelectorAll('.nav-button');
          buttons.forEach(btn => {
            btn.style.opacity = '0';
          });
        }}>
          <div style={{
            position: 'relative',
            height: '500px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0'
          }}>
            <img 
              src={images[mainImage]} 
              alt={`${title} - Image ${mainImage + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Navigation Arrows */}
            <button
              className="nav-button"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 10
              }}
              onClick={prevImage}
              aria-label="Previous image"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronLeft className="h-6 w-6" style={{ color: '#333' }} />
            </button>
            <button
              className="nav-button"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                zIndex: 10
              }}
              onClick={nextImage}
              aria-label="Next image"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronRight className="h-6 w-6" style={{ color: '#333' }} />
            </button>

            {/* Expand Button */}
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 10,
                transition: 'background-color 0.3s ease'
              }}
              onClick={() => setLightboxOpen(true)}
              aria-label="Expand to fullscreen"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <Maximize2 className="h-5 w-5" style={{ color: '#333' }} />
            </button>

            {/* Image Counter */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              zIndex: 9
            }}>
              {mainImage + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '8px'
        }}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(index)}
              style={{
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: mainImage === index ? '#e8927c' : '#ddd',
                backgroundColor: 'white',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
                boxShadow: mainImage === index ? `0 0 0 2px white, 0 0 0 4px #e8927c` : 'none'
              }}
              onMouseEnter={(e) => {
                if (mainImage !== index) {
                  e.currentTarget.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                if (mainImage !== index) {
                  e.currentTarget.style.borderColor = '#ddd';
                }
              }}
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={images[mainImage]} 
              alt={`${title} - Image ${mainImage + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
            
            <button
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'background-color 0.3s ease',
                zIndex: 10
              }}
              onClick={prevImage}
              aria-label="Previous image"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronLeft className="h-6 w-6" style={{ color: '#333' }} />
            </button>
            <button
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'background-color 0.3s ease',
                zIndex: 10
              }}
              onClick={nextImage}
              aria-label="Next image"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <ChevronRight className="h-6 w-6" style={{ color: '#333' }} />
            </button>

            <button
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                border: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'background-color 0.3s ease',
                zIndex: 10
              }}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <X className="h-6 w-6" style={{ color: '#333' }} />
            </button>

            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              zIndex: 9
            }}>
              {mainImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
