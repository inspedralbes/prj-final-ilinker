'use client'

import {useState} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        email: '',
        rol: 'estudiante',
        // Campos específicos por rol
        // Estudiante
        carrera: '',
        universidad: '',
        semestre: '',
        // Empresa
        nombreEmpresa: '',
        sector: '',
        tamano: '',
        // Instituto
        nombreInstituto: '',
        tipo: '',
        ubicacion: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Datos del formulario:', formData);
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información Personal</h2>
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-darkGray mb-2">
                    Apellidos
                </label>
                <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-darkGray mb-2">
                    Fecha de Nacimiento
                </label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-darkGray mb-2">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-darkGray mb-2">
                    Tipo de Usuario
                </label>
                <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                >
                    <option value="estudiante">Estudiante</option>
                    <option value="empresa">Empresa</option>
                    <option value="instituto">Instituto</option>
                </select>
            </div>
        </div>
    );

    const renderStep2Estudiante = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información Académica</h2>
            <div>
                <label htmlFor="carrera" className="block text-sm font-medium text-darkGray mb-2">
                    Carrera
                </label>
                <input
                    type="text"
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="universidad" className="block text-sm font-medium text-darkGray mb-2">
                    Universidad
                </label>
                <input
                    type="text"
                    id="universidad"
                    name="universidad"
                    value={formData.universidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="semestre" className="block text-sm font-medium text-darkGray mb-2">
                    Semestre Actual
                </label>
                <input
                    type="text"
                    id="semestre"
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
        </div>
    );

    const renderStep2Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información de la Empresa</h2>
            <div>
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre de la Empresa
                </label>
                <input
                    type="text"
                    id="nombreEmpresa"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="sector" className="block text-sm font-medium text-darkGray mb-2">
                    Sector
                </label>
                <input
                    type="text"
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="tamano" className="block text-sm font-medium text-darkGray mb-2">
                    Tamaño de la Empresa
                </label>
                <select
                    id="tamano"
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                >
                    <option value="">Seleccionar tamaño</option>
                    <option value="pequena">Pequeña (1-50 empleados)</option>
                    <option value="mediana">Mediana (51-250 empleados)</option>
                    <option value="grande">Grande (más de 250 empleados)</option>
                </select>
            </div>
        </div>
    );

    const renderStep2Instituto = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información del Instituto</h2>
            <div>
                <label htmlFor="nombreInstituto" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre del Instituto
                </label>
                <input
                    type="text"
                    id="nombreInstituto"
                    name="nombreInstituto"
                    value={formData.nombreInstituto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-darkGray mb-2">
                    Tipo de Instituto
                </label>
                <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                >
                    <option value="">Seleccionar tipo</option>
                    <option value="universidad">Universidad</option>
                    <option value="instituto">Instituto Técnico</option>
                    <option value="escuela">Escuela Profesional</option>
                </select>
            </div>
            <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-darkGray mb-2">
                    Ubicación
                </label>
                <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
        </div>
    );

    const renderStep2 = () => {
        switch (formData.rol) {
            case 'estudiante':
                return renderStep2Estudiante();
            case 'empresa':
                return renderStep2Empresa();
            case 'instituto':
                return renderStep2Instituto();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightGray to-white py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-darkGray">Registro</h1>
                        <div className="text-sm text-darkGray">
                            Paso {step} de 2
                        </div>
                    </div>
                    <div className="w-full bg-lightGray h-2 rounded-full">
                        <div
                            className="bg-darkGray h-2 rounded-full transition-all duration-300"
                            style={{width: `${(step / 2) * 100}%`}}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    <div className="flex justify-between items-center">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center text-sm font-medium text-darkGray"
                            >
                                <ArrowLeft size={18}/>
                                Volver
                            </button>
                        )}
                        <button
                            type={step === 2 ? 'submit' : 'button'}
                            onClick={handleNext}
                            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded-lg"
                        >
                            {step === 2 ? 'Enviar' : 'Siguiente'}
                            {step !== 2 && <ArrowRight size={18}/>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
