import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoaderComponent: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg z-50">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl transform scale-100"></div>
            <div className="relative p-0 rounded-full">
              <img className="w-20 h-19 text-white" src='/images/logo.svg' alt="iLinker Logo" />
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-black text-3xl font-bold mb-1">iLinker</h1>
            <div className="flex items-center gap-2 text-black/80">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Cargando...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
