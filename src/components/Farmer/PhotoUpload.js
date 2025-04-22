import React, { useState } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function PhotoUpload({ onImageUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (jpg, png, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setUploading(true);

    try {
      const phoneNumber = localStorage.getItem('farmerPhone');
      if (!phoneNumber) {
        throw new Error('Please login to upload images');
      }

      const timestamp = Date.now();
      const storageRef = ref(storage, `farmers/${phoneNumber}/products/${timestamp}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Uploaded file:', snapshot.ref.fullPath);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      
      // Pass the URL back to the parent component
      onImageUpload(downloadURL);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading image. Please try again.');
      setPreviewUrl(null);
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block">
          <span className="sr-only">Choose photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>
      </div>

      {uploading && (
        <div className="text-green-600 text-sm">Uploading image...</div>
      )}

      {previewUrl && !uploading && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs rounded-lg shadow-md"
          />
          <div className="text-green-600 text-sm mt-2">Image uploaded successfully!</div>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </div>
  );
}

export default PhotoUpload; 