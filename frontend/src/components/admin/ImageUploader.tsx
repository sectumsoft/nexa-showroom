'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Star } from 'lucide-react';

interface UploadedImage {
  url: string;
  isPrimary: boolean;
}

interface Props {
  carId: number;
  onUploaded: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ carId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const uploaded: UploadedImage[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      uploaded.push({ url: data.secure_url, isPrimary: false });
    }

    const updated = [...images, ...uploaded];

    // Set first image as primary if none set
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }

    setImages(updated);
    onUploaded(updated);
    setUploading(false);

    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
    onUploaded(updated);
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    setImages(updated);
    onUploaded(updated);
  };

  return (
    <div>
      <label className="font-body text-xs tracking-widest uppercase text-gray-400 block mb-2">
        Car Images
      </label>

      {/* Uploaded images preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-20 border border-gray-200">
              <Image src={img.url} alt={`Car image ${i + 1}`} fill className="object-cover" />
              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#c8a96e] text-white text-center text-[9px] py-0.5">
                  Primary
                </div>
              )}
              {/* Actions */}
              <div className="absolute top-0 right-0 flex">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    title="Set as primary"
                    className="bg-yellow-400 text-white p-0.5"
                  >
                    <Star size={10} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="bg-red-500 text-white p-0.5"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFile}
        className="hidden"
        id="car-image-upload"
        disabled={uploading}
      />
      <label
        htmlFor="car-image-upload"
        className="border-2 border-dashed border-gray-200 p-4 text-center hover:border-[#c8a96e] transition-colors cursor-pointer block"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin text-[#c8a96e]" />
            <span className="font-body text-xs text-gray-400">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Upload size={18} className="text-gray-300" />
            <span className="font-body text-xs text-gray-400">
              Click to upload images (multiple allowed)
            </span>
          </div>
        )}
      </label>
      <p className="font-body text-xs text-gray-300 mt-1">
        Click ⭐ on an image to set it as primary
      </p>
    </div>
  );
}