import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, FileText, Mail } from 'lucide-react';

const HelpCenter: React.FC = () => {
  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  
  const faqs = [
    {
      id: 1,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Vaya a la configuración de perfil, desplazarse hasta la sección de Contraseña. Siga los pasos para establecer una nueva contraseña, debera poner la contraseña actual y la nueva contraseña.'
    },
    {
      id: 2,
      question: '¿Cómo puedo deshabilitar mi cuenta?',
      answer: 'La deshabilitación de la cuenta se puede hacer a través de la configuración de perfil en la sección de "Cuenta". Puede deshabilitar su cuenta en cualquier momento, pero no podrá acceder a su cuenta una vez deshabilitada. '
    },
    {
      id: 3,
      question: '¿Cómo puedo reportar un error?',
      answer: 'Si encuentra un error, por favor, use el formulario de "Contactar Soporte" y seleccione "Reportar un Error" desde el menú desplegable. Incluya lo más posible para ayudarnos a solucionar el problema.'
    },
    {
      id: 4,
      question: '¿Mis datos estan protegidos?',
      answer: 'Tomanos la seguridad de los datos muy en serio. Todo los datos estan encriptados en el tránsito y en reposo. Mantenemos controles de acceso estrictos y audiamos regularmente nuestros sistemas para garantizar que su información permanezca protegida.'
    }
  ];

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Centro de Ayuda</h2>
      
      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Live Chat Support</h3>
          <p className="text-sm text-gray-600 mb-4">Get real-time assistance from our support team</p>
          <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700">Start a Chat</button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Base</h3>
          <p className="text-sm text-gray-600 mb-4">Explore our comprehensive documentation</p>
          <button className="text-indigo-600 font-medium text-sm hover:text-indigo-700">Browse Articles</button>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">Preguntas Frecuentes</h3>
      
      <div className="mb-8 space-y-3">
        {faqs.map(faq => (
          <div 
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFaq(faq.id)}
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              {openFaqId === faq.id ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openFaqId === faq.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">Still Need Help?</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h4 className="font-medium text-gray-900">Contact Support</h4>
        </div>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
            >
              <option value="">Please select a topic</option>
              <option value="account">Account Issues</option>
              <option value="billing">Billing Questions</option>
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Describe your issue in detail"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpCenter;