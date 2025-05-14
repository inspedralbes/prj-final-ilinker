"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Video, Globe2, Lock, Smile, AlertCircle, User, UserPlus } from 'lucide-react';

interface Media {
  id: string;
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
    visibility: "public" | "private";
    location: string;
  }) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPublish }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleMediaUpload = (files: FileList | null, type: "image" | "video") => {
    if (!files) return;
    
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const MAX_FILES = 10;
    
    if (media.length + files.length > MAX_FILES) {
      setError(`No puedes subir más de ${MAX_FILES} archivos en total.`);
      return;
    }
    
    setError(null);
    
    const newMedia: Media[] = [];
    
    Array.from(files).forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`El archivo "${file.name}" es demasiado grande. El tamaño máximo es 50MB.`);
        return;
      }
      
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        setError(`El archivo "${file.name}" no es una imagen o video válido.`);
        return;
      }
      
      newMedia.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: file,
        type: isImage ? 'image' : 'video',
        preview: URL.createObjectURL(file)
      });
    });

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
    if ((!content.trim() && media.length === 0)) {
      setError("Debes añadir texto o archivos multimedia para publicar.");
      return;
    }
    
    if (media.length > 10) {
      setError("No puedes publicar más de 10 archivos.");
      return;
    }
    
    try {
      onPublish({ 
        content, 
        media, 
        visibility,
        location: ""
      });
      
      // Reset form
      setContent("");
      setMedia([]);
      setVisibility("public");
      setError(null);
      onClose();
    } catch (err) {
      setError("Error al publicar. Intenta de nuevo con archivos más pequeños o menos archivos.");
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all"
      >
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Crear publicación</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <div className="p-6">
          <textarea
            placeholder="¿Sobre qué quieres hablar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-32 resize-none border-none focus:ring-0 text-lg placeholder:text-gray-400"
            autoFocus
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start mt-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {media.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-8 max-w-[600px] mx-auto">
                {media.map((item) => (
                  <div key={item.id} className="relative group aspect-square max-w-[300px]">
                    {item.type === 'image' ? (
                      <Image
                        src={item.preview!}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <video src={item.preview} className="w-full h-full object-cover rounded-lg" controls />
                    )}
                    <button
                      onClick={() => removeMedia(media.findIndex(m => m.id === item.id))}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right">
                <span className={`text-sm ${media.length >= 8 ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>{media.length}/10 archivos</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const type = files[0].type.startsWith('image/') ? 'image' : 'video';
                    handleMediaUpload(files, type);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center p-2 hover:bg-white rounded-full transition-colors"
                title="Añadir foto"
              >
                <ImageIcon className="w-5 h-5 text-black" />
                <span className="ml-1 text-sm hidden sm:inline text-black">Foto</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center p-2 hover:bg-white rounded-full transition-colors"
                title="Añadir video"
              >
                <Video className="w-5 h-5 text-black" />
                <span className="ml-1 text-sm hidden sm:inline text-black">Video</span>
              </button>
              <button
                className="flex items-center justify-center p-2 hover:bg-white rounded-full transition-colors"
                title="Añadir emoji"
              >
                <Smile className="w-5 h-5 text-black" />
                <span className="ml-1 text-sm hidden sm:inline text-black">Emoji</span>
              </button>
            </div>
            
            <div className="flex-1"></div>
            
            <button
              onClick={handleSubmit}
              disabled={(!content.trim() && media.length === 0)}
              className={`
                w-full sm:w-auto
                flex items-center justify-center
                px-8 py-2.5 rounded-full
                font-medium
                transition-all duration-200
                ${(!content.trim() && media.length === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transform hover:scale-105'}
              `}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}