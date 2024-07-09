import React from 'react';
import './CircleImage.css';

const CircleImage = ({ src, alt }) => {
  return (
    <div className="circle-image">
      <img src={src} alt={alt} />
    </div>
  );
};

export default CircleImage;
