"use client" 
 
import React from 'react'; 
import { ArrowRight } from 'lucide-react'; 
import Link from 'next/link'; 
 
const Hero: React.FC = () => {  
  return ( 
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"> 
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div> 
       
      {/* Abstract pattern background */}  
      <div className="absolute inset-0 opacity-5 -z-10"> 
        <div className="absolute top-20 left-10 w-72 h-72 bg-black rounded-full mix-blend-multiply filter blur-3xl"></div> 
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-black rounded-full mix-blend-multiply filter blur-3xl"></div> 
      </div> 
       
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="text-center max-w-4xl mx-auto"> 
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6"> 
            Conectando Estudiantes, Empresas e Instituciones Educativas 
          </h1> 
           
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto"> 
            Una plataforma integral diseñada para optimizar el proceso de búsqueda, gestión y seguimiento de prácticas profesionales. 
          </p> 
           
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16"> 
            <Link href="auth/login" className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center">  
              Comenzar <ArrowRight size={18} className="ml-2" /> 
            </Link> 
            <button className="border border-gray-300 text-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-300"> 
              Saber Más 
            </button> 
          </div>   
        </div>  
      </div> 
    </section> 
  );   
}; 
  
export default Hero; 