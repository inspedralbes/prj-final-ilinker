import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  children: ReactNode;
  title?: string;
  closeOnOutsideClick?: boolean;
  size?: ModalSize;
}

const Modal = ({ 
  isOpen, 
  onClose, 
  id = 'modal', 
  children, 
  title,
  closeOnOutsideClick = true,
  size = 'md'
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle mounting on client-side only
  useEffect(() => {
    setIsMounted(true);
    
    return () => setIsMounted(false);
  }, []);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnOutsideClick]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Get size class based on size prop
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full mx-4 sm:mx-6';
      default:
        return 'max-w-md';
    }
  };
  
  // Don't render anything on the server
  if (!isMounted) return null;
  
  // Don't render if modal is closed
  if (!isOpen) return null;
  
  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        id={id}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${getSizeClass()} w-full max-h-[90vh] overflow-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 id={`${id}-title`} className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;