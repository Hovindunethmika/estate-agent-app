import React, { useState } from 'react';

const ImageGallery = ({ images, propertyName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="gallery-empty" role="img" aria-label="No images available">
        <p>No images available</p>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <div 
      className={`image-gallery ${isFullscreen ? 'fullscreen' : ''}`}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`Image gallery for ${propertyName}`}
    >
      {/* Main Image Display */}
      <div className="gallery-main">
        <img 
          src={images[currentImageIndex]} 
          alt={`${propertyName} - Image ${currentImageIndex + 1} of ${images.length}`}
          className="main-image"
        />

        {/* Gallery Controls */}
        {images.length > 1 && (
          <div className="gallery-controls">
            <button
              onClick={handlePrevImage}
              className="gallery-btn gallery-btn-prev"
              aria-label="Previous image"
              title="Previous"
            >
              ❮
            </button>
            <button
              onClick={handleNextImage}
              className="gallery-btn gallery-btn-next"
              aria-label="Next image"
              title="Next"
            >
              ❯
            </button>
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreenToggle}
          className="gallery-fullscreen-btn"
          aria-label="Toggle fullscreen"
          title="Fullscreen"
        >
          ⛶
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="gallery-counter" aria-live="polite">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="gallery-thumbnails" role="tablist" aria-label="Image thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              aria-selected={index === currentImageIndex}
              aria-label={`Image ${index + 1}`}
              role="tab"
              tabIndex={index === currentImageIndex ? 0 : -1}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
