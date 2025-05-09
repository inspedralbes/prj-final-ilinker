"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Video, Globe2, Users, Lock, MapPin, Smile } from 'lucide-react';

interface Media {
  url: string | File;
  type: "image" | "video";
  preview?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: {
    content: string;
    media: Media[];
    visibility: "Cualquiera" | "Solo conexiones" | "Solo yo";
    location: string;
  }) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPublish }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [location, setLocation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleMediaUpload = (files: FileList | null, type: "image" | "video") => {
    if (!files) return;

    const newMedia: Media[] = Array.from(files).map(file => ({
      url: file,
      type,
      preview: URL.createObjectURL(file)
    }));

    setMedia([...media, ...newMedia]);
  };

  const removeMedia = (index: number) => {
    const newMedia = [...media];
    if (newMedia[index].preview) {
      URL.revokeObjectURL(newMedia[index].preview!);
    }
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPublish({ content, media, visibility: "Cualquiera", location });
    setContent("");
    setMedia([]);
    setLocation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Crear publicación</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <textarea
            placeholder="¿Sobre qué quieres hablar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 resize-none border-none focus:ring-0 text-lg"
          />

          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {media.map((item, index) => (
                <div key={index} className="relative">
                  {item.type === 'image' ? (
                    <Image
                      src={item.preview!}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={item.preview}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 border-t pt-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                const type = files?.[0]?.type.startsWith('image/') ? 'image' : 'video';
                handleMediaUpload(files, type);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Añadir foto o video"
            >
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Añadir video"
            >
              <Video className="w-6 h-6 text-blue-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Añadir emoji"
            >
              <Smile className="w-6 h-6 text-blue-600" />
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
