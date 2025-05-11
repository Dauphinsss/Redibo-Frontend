'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadButtonProps {
  onUploadComplete: (url: string) => void;
  existingImage?: string;
}

export default function ImageUploadButton({
  onUploadComplete,
  existingImage
}: ImageUploadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsLoading(true);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'TU_UPLOAD_PRESET');

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/dzoeeaovz/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    onUploadComplete(data.secure_url);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${
          existingImage ? 'bg-blue-600' : 'bg-green-600'
        } text-white hover:opacity-90 disabled:opacity-70 transition-colors`}
      >
        {isLoading ? (
          <>
            <Spinner />
            Subiendo...
          </>
        ) : (
          existingImage ? 'Cambiar imagen' : 'Subir imagen'
        )}
      </button>

      {existingImage && (
        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200">
          <Image
            src={existingImage}
            alt="Miniatura"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}