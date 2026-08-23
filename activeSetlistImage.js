import { useState, useEffect } from 'react';

let currentImage = '/setlist/setlist-1-1.jpg';
const listeners = new Set();

export function setActiveSetlistImage(url) {
  if (currentImage !== url) {
    currentImage = url;
    listeners.forEach((listener) => listener(currentImage));
  }
}

export function getActiveSetlistImage() {
  return currentImage;
}

export function subscribeActiveSetlistImage(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useActiveSetlistImage() {
  const [image, setImage] = useState(currentImage);
  useEffect(() => {
    return subscribeActiveSetlistImage(setImage);
  }, []);
  return image;
}
