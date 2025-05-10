'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadPopupProps {
  onSave: (imageUrl: string) => void;
  onClose: () => void;
}

export default function ImageUploadPopup({ onSave, onClose }: ImageUploadPopupProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tu_upload_preset');
    
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dzoeeaovz/image/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Error al subir la imagen');
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = () => {
    if (imageUrl) {
      onSave(imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Validación de imagen</h3>
          
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`w-full p-8 border-2 border-dashed rounded-md flex flex-col items-center justify-center ${
                isLoading ? 'bg-gray-100 border-gray-300' : 
                imageUrl ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <span>Subiendo imagen...</span>
                </div>
              ) : imageUrl ? (
                <>
                  <div className="relative w-full h-40 mb-2">
                    <Image
                      src={imageUrl}
                      alt="Previsualización"
                      fill
                      className="object-contain"
                      unoptimized={true} // Necesario para imágenes de Cloudinary
                    />
                  </div>
                  <span className="text-green-600">Imagen subida ✓</span>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">Haz clic para seleccionar una imagen</span>
                  <span className="text-sm text-gray-400 mt-1">Formatos: JPG, PNG, GIF</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!imageUrl || isLoading}
              className={`px-4 py-2 rounded-md text-sm text-white ${
                !imageUrl ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } disabled:opacity-50`}
            >
              Validar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}