"use client" 
 
import React from 'react'; 
import { Search, Building, GraduationCap, Users, BarChart4, Clock } from 'lucide-react'; 
  
const features = [ 
  {  
    icon: <Search className="w-6 h-6" />, 
    title: "Emparejamiento Inteligente", 
    description: "Algoritmos avanzados para conectar estudiantes con las oportunidades de prácticas más relevantes según sus habilidades e intereses." 
  }, 
  { 
    icon: <Building className="w-6 h-6" />,  
    title: "Portal Empresarial", 
    description: "Las empresas pueden publicar oportunidades, revisar solicitudes y gestionar todo el proceso de prácticas en un solo lugar." 
  }, 
  { 
    icon: <GraduationCap className="w-6 h-6" />, 
    title: "Supervisión Educativa",    
    description: "Las instituciones educativas pueden monitorear la participación de los estudiantes y asegurar el cumplimiento de los requisitos académicos." 
  }, 
  {  
    icon: <Users className="w-6 h-6" />, 
    title: "Plataforma Colaborativa", 
    description: "Un ecosistema compartido donde todos los participantes pueden comunicarse, coordinar y colaborar eficazmente." 
  }, 
  { 
    icon: <BarChart4 className="w-6 h-6" />, 
    title: "Seguimiento de Progreso", 
    description: "Monitoreo en tiempo real del progreso de las prácticas, con mecanismos de retroalimentación para la mejora continua." 
  }, 
  { 
    icon: <Clock className="w-6 h-6" />, 
    title: "Gestión Eficiente", 
    description: "Flujos de trabajo optimizados que ahorran tiempo y reducen la carga administrativa para todos los usuarios." 
  }, 
]; 
 
const Features: React.FC = () => { 
  return ( 
    <section id="features" className="py-20 bg-white"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="text-center mb-16"> 
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Características Principales</h2>  
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">  
            Nuestra plataforma integral ofrece herramientas potentes para cada tipo de usuario, creando un ecosistema integrado para prácticas profesionales. 
          </p> 
        </div> 
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
          {features.map((feature, index) => ( 
            <div  
              key={index}  
              className="bg-gray-50 p-6 rounded-lg transition-transform duration-300 hover:-translate-y-2" 
            > 
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 text-white">  
                {feature.icon} 
              </div> 
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>   
              <p className="text-gray-600">{feature.description}</p>  
            </div> 
          ))}   
        </div> 
      </div> 
    </section> 
  );  
}; 
 
export default Features;  