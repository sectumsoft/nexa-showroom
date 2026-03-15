'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  carId: number;
  onUploaded: (url: string) => void;
}

export default function ImageUploader({ carId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    setPreview(data.secure_url);
    onUploaded(data.secure_url);
    setUploading(false);
  };

  return (
    <div>
      <label className="font-body text.xs tracking-widest uppercase text-gray-400 block mb-2">
        Car Image
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        id="car-image-upload"
        disabled={uploading}
      />
      <label
        htmlFor="car-image-upload"
        className="border-2 border-dashed border-gray-200 p-6 text-center hover:border-[#c8a96e] transition-colors cursor-pointer block"
      >
        {preview ? (
          <div className="relative inline-block">
            <Image src={preview} alt="Preview" width={200} height={120} className="mx-auto object-cover" />
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setPreview(null); }}
              className="absolute top-0 right-0 bg-red-500 text-white p-1"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div>
            {uploading ? (
              <Loader2 size={24} className="animate-spin mx-auto text-[#c8a96e]" />
            ) : (
              <>
                <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="font-body text-xs text-gray-400">Click to upload image</p>
              </>
            )}
          </div>
        )}
      </label>
    </div>
  );
}