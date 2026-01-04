import React from 'react';
import ImageGallery from 'react-image-gallery';
import { encodeHTML } from '../utils/securityUtils';
import 'react-image-gallery/styles/css/image-gallery.css';

export default function PropertyGallery({ images, title }) {
  // Return null if no images provided
  if (!images || images.length === 0) {
    return (
      <div className="property-gallery-wrapper">
        <div style={{
          width: '100%',
          height: '300px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          color: '#999',
          fontSize: '14px'
        }}>
          No images available
        </div>
      </div>
    );
  }

  // Transform image array into react-image-gallery format
  const galleryItems = images.map((image, index) => ({
    original: image,
    thumbnail: image,
    originalAlt: `${encodeHTML(title)} - Image ${index + 1}`,
    thumbnailAlt: `${encodeHTML(title)} - Thumbnail ${index + 1}`,
    description: undefined
  }));

  return (
    <div className="property-gallery-wrapper">
      <ImageGallery
        items={galleryItems}
        showThumbnails={true}
        showFullscreenButton={true}
        showPlayButton={false}
        autoPlay={false}
        lazyLoad={true}
        showNav={true}
        isRTL={false}
        slideDuration={450}
        slideInterval={3000}
      />
    </div>
  );
}
