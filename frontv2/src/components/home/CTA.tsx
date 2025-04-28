"use client"

import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para Transformar tu Experiencia de Prácticas?</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Únete a ilinker hoy y sé parte de un ecosistema colaborativo que conecta estudiantes, empresas e instituciones educativas para prácticas profesionales exitosas.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
              Comenzar <ArrowRight size={18} className="ml-2" />
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-300">
              Solicitar Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;