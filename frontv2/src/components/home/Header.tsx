"use client"

import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoaderContext } from '@/contexts/LoaderContext';

const Header: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {showLoader, hideLoader} = useContext(LoaderContext);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.svg" className="w-6 h-6 mr-2" />
            <span className="text-xl font-bold tracking-tight text-black">
              iLinker
            </span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-800 hover:text-black transition-colors duration-300">
              Características
            </a>
            <a href="#how-it-works" className="text-gray-800 hover:text-black transition-colors duration-300">
              Cómo Funciona
            </a>
            <a href="#users" className="text-gray-800 hover:text-black transition-colors duration-300">
              Para Usuarios
            </a>
          </div>
          
          <div className="hidden md:block">
            <button onClick={()=>{
              showLoader();
              router.push('/auth/login')
            }} className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
              Comenzar
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-black transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Características
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Cómo Funciona
            </a>
            <a
              href="#users"
              className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Para Usuarios
            </a>
            <div className="mt-4 px-3">
              <button className="w-full bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                Comenzar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;