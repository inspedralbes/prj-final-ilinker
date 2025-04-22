"use client"

import React from 'react';

const steps = [
  {
    number: "01",
    title: "Registro y Creación de Perfil",
    description: "Estudiantes, empresas e instituciones educativas crean sus perfiles con información y preferencias relevantes.",
    userType: "Todos los Usuarios"
  },
  {
    number: "02",
    title: "Conexión y Descubrimiento",
    description: "Los estudiantes exploran oportunidades, las empresas encuentran candidatos calificados y las instituciones monitorean las plazas disponibles.",
    userType: "Todos los Usuarios"
  },
  {
    number: "03",
    title: "Aplicación y Revisión",
    description: "Los estudiantes aplican a posiciones, las empresas revisan solicitudes y las instituciones aprueban la participación.",
    userType: "Estudiantes y Empresas"
  },
  {
    number: "04",
    title: "Gestión y Monitoreo",
    description: "Seguimiento del progreso de las prácticas, envío de informes, retroalimentación y cumplimiento de requisitos.",
    userType: "Todos los Usuarios"
  }
];

const Process: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Cómo Funciona</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nuestro proceso optimizado facilita la colaboración efectiva entre estudiantes, empresas e instituciones educativas.
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Step number - visible on mobile, hidden on desktop */}
                  <div className="md:hidden bg-black text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    {step.number}
                  </div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="hidden md:flex items-center mb-4 gap-3 text-sm text-gray-500 font-medium">
                        <span className="bg-black text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center">
                          {step.number}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full">
                          {step.userType}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-5 h-5 rounded-full border-4 border-black"></div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;