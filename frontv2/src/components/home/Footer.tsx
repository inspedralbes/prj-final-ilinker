"use client" 
  
import React from 'react'; 
import { Link, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';  
 
const Footer: React.FC = () => {  
  return (  
    <footer className="bg-gray-50 pt-16 pb-8"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"> 
          <div> 
            <div className="flex items-center mb-6"> 
              <Link className="w-6 h-6 mr-2" />  
              <span className="text-xl font-bold text-black">ilinker</span> 
            </div>  
            <p className="text-gray-600 mb-6">  
              Conectando estudiantes, empresas e instituciones educativas para prácticas profesionales significativas. 
            </p> 
            <div className="flex space-x-4"> 
              <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">  
                <Facebook size={20} /> 
              </a>  
              <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">  
                <Twitter size={20} /> 
              </a>  
              <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">  
                <Instagram size={20} /> 
              </a> 
              <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                <Linkedin size={20} />  
              </a>  
            </div> 
          </div> 
           
          <div> 
            <h3 className="text-lg font-bold mb-6">Plataforma</h3>  
            <ul className="space-y-3"> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Para  
                </a> 
              </li> 
              <li>  
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Para Empresas 
                </a> 
              </li> 
              <li>  
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Para Instituciones Educativas 
                </a> 
              </li>  
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Cómo Funciona 
                </a> 
              </li>  
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Precios 
                </a>  
              </li> 
            </ul> 
          </div> 
           
          <div> 
            <h3 className="text-lg font-bold mb-6">Recursos</h3> 
            <ul className="space-y-3"> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Blog  
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Centro de Ayuda 
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Preguntas Frecuentes 
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Casos de Éxito 
                </a> 
              </li>  
              <li>  
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Eventos 
                </a> 
              </li> 
            </ul> 
          </div> 
           
          <div> 
            <h3 className="text-lg font-bold mb-6">Empresa</h3> 
            <ul className="space-y-3">  
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Sobre Nosotros 
                </a>  
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Carreras 
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Política de Privacidad 
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"> 
                  Términos de Servicio 
                </a> 
              </li> 
              <li> 
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">  
                  Contáctanos 
                </a> 
              </li> 
            </ul> 
          </div> 
        </div> 
         
        <div className="border-t border-gray-200 pt-8"> 
          <p className="text-gray-500 text-center"> 
            © {new Date().getFullYear()} ilinker. Todos los derechos reservados. 
          </p> 
        </div> 
      </div> 
    </footer>  
  );  
};  
 
export default Footer; 