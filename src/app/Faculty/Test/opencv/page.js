"use client"

import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam'; // Import the Webcam component
import axios from 'axios';

const ImageInput = () => {
  const [image, setImage] = useState(null);
  const [retrievedImages, setRetrievedImages] = useState([]);
  const webcamRef = React.createRef(); 
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    uploadImage(selectedImage);
  };

  const captureWebcamImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const blob = dataURItoBlob(imageSrc);
      uploadImage(blob);
    }
  };

  const toggleCamera = () => {
    // Toggle the camera state (enable/disable)
    setCameraEnabled(!cameraEnabled);
  };

  const uploadImage = async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);

    try {
      await axios.post('http://localhost:3002/post-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After posting, trigger the getImage function for all images
      getImages();
    } catch (error) {
      console.error('Error posting image:', error);
    }
  };

  const getImages = async () => {
    try {
      const images = [];
      for (let i = 0; i < 4; i++) {
        const response = await axios.get(`http://localhost:3002/get-image?index=${i}`, {
          responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        images.push(imageUrl);
      }
      setRetrievedImages(images);
    } catch (error) {
      console.error('Error getting images:', error);
    }
  };

  useEffect(() => {
    if (image) {
      postImage();
    }
  }, [image]);

  return (
    <div>
      {cameraEnabled ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      ) : (
        <p>Camera is disabled</p>
      )}
      <button onClick={toggleCamera}>
        {cameraEnabled ? 'Disable Camera' : 'Enable Camera'}
      </button>
      {cameraEnabled && (
        <button onClick={captureWebcamImage}>Capture Webcam Image</button>
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      {retrievedImages.map((imageUrl, index) => (
        <div key={index}>
          <img
            src={imageUrl}
            alt={`Retrieved Image ${index}`}
            style={{ maxWidth: '100%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageInput;

// Utility function to convert data URI to Blob
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
