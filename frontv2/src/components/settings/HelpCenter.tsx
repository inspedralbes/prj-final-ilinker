import React, { useState, useContext } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, FileText, Mail, Loader2 } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/requests/apiRequest';
import { toast } from '@/hooks/use-toast';

const HelpCenter: React.FC = () => {
  // FAQ state
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);
  const {userData} = useContext(AuthContext);
  const [formDataHelp, setFormDataHelp] = useState({
    subject: '',
    message: '',
  });
  const [sendHelpLoaderContainer, setSendHelpLoaderContainer] = useState(false);

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

  const handleSend = ()=>{
    setSendHelpLoaderContainer(true);
    apiRequest('help/send-help', 
      "POST", 
      formDataHelp).then((response) =>{
        console.log(response);
        if(response.status === 'success'){
          toast({
            title: 'Insidencia enviada',
            description: 'Tu insidencia ha sido enviada correctamente, te llegara un correo cuando se haya resuelto',
            variant: 'success',
          })
        }else{
          toast({
            title: 'Error',
            description: 'Ocurrio un error al enviar tu insidencia',
            variant: 'destructive',
          })
        }
      }).catch((error) =>{
        console.log(error);
        toast({
          title: 'Error',
          description: 'Ocurrio un error al enviar tu insidencia',
          variant: 'destructive',
        })
      }).finally(()=>{
        setFormDataHelp({
          subject: '',
          message: ''
        })
        setSendHelpLoaderContainer(false);
      })
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Centro de Ayuda</h2>
      
      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:border-black hover:bg-black/10 transition-colors cursor-pointer">
          <div className="bg-black p-3 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Live Chat Support</h3>
          <p className="text-sm text-gray-600 mb-4">Get real-time assistance from our support team</p>
          <button className="text-black font-medium text-sm hover:text-black/80">Start a Chat</button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col items-center text-center hover:border-black hover:bg-black/10 transition-colors cursor-pointer">
          <div className="bg-black p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Base</h3>
          <p className="text-sm text-gray-600 mb-4">Explore our comprehensive documentation</p>
          <button className="text-black font-medium text-sm hover:text-black/80">Browse Articles</button>
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
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">¿Todavia necesitas ayuda?</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-5 w-5 text-black" />
          <h4 className="font-medium text-gray-900">Contacto de soporte</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <select
              id="subject"
              name="subject"
              value={formDataHelp.subject}
              onChange={(e) => setFormDataHelp({ ...formDataHelp, subject: e.target.value })}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
            >
              <option value="">Por favor, selecciona un tema</option>
              <option value="account">Problemas de cuenta</option>
              <option value="bug">Reportar un error</option>
              <option value="feature">Solicitud de característica</option>
              <option value="other">Otro</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formDataHelp.message}
              onChange={(e) => setFormDataHelp({ ...formDataHelp, message: e.target.value })}
              rows={4}
              placeholder="Describe your issue in detail"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 text-gray-700"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSend}  
              disabled={sendHelpLoaderContainer}
              className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors ${sendHelpLoaderContainer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {sendHelpLoaderContainer ? <div className="flex items-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Cargando...
                </div>: 'Enviar mensaje'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;