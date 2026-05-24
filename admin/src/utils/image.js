/**
 * Resolves local image URLs to production backend URLs when deployed.
 * Handles:
 * 1. External URLs (Unsplash, etc.) -> keep unchanged.
 * 2. Localhost URLs in production -> replaces http://localhost:5000 with production backend host.
 * 3. Relative paths (/img/...) -> prepends backend host.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If it's a complete URL (external or local host)
  if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Fix: If running on production (not localhost) but the DB image URL points to localhost:5000
    if (imagePath.includes('localhost:5000') && !window.location.hostname.includes('localhost')) {
      return imagePath.replace('http://localhost:5000', 'https://tinh-dau.onrender.com');
    }
    return imagePath;
  }

  // If it's a relative path (e.g., /img/download.jpg)
  const apiUrl = import.meta.env.VITE_API_URL || 'https://tinh-dau.onrender.com/api';
  const baseUrl = apiUrl.replace('/api', ''); // Get backend root URL (remove '/api')

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
