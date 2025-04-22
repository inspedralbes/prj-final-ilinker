"use client"

import React from 'react';
import { Briefcase, GraduationCap, School } from 'lucide-react';

const UserBenefits: React.FC = () => {
  return (
    <section id="users" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Diseñado para Cada Usuario</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ilinker proporciona una experiencia personalizada con beneficios específicos para cada tipo de usuario.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estudiantes */}
          <div className="bg-gray-50 rounded-lg p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 text-white">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Para Estudiantes</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Descubre oportunidades de prácticas relevantes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Crea un perfil profesional para mostrar tus habilidades</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Aplica con solicitudes optimizadas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Seguimiento en tiempo real del estado de las solicitudes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Envía informes y documentación requerida</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Obtén valiosa experiencia en la industria</span>
              </li>
            </ul>
          </div>
          
          {/* Empresas */}
          <div className="bg-gray-50 rounded-lg p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 text-white">
              <Briefcase size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Para Empresas</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Publica oportunidades de prácticas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Encuentra candidatos calificados eficientemente</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Optimiza el proceso de selección</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Gestiona programas de prácticas en un solo lugar</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Proporciona retroalimentación y evaluaciones</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Construye relaciones con instituciones educativas</span>
              </li>
            </ul>
          </div>
          
          {/* Instituciones Educativas */}
          <div className="bg-gray-50 rounded-lg p-8 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 text-white">
              <School size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Para Instituciones Educativas</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Monitorea la participación de estudiantes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Asegura el cumplimiento de requisitos académicos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Realiza seguimiento del progreso y desempeño</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Aprueba oportunidades de prácticas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Genera informes y análisis</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fortalece alianzas con la industria</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserBenefits;