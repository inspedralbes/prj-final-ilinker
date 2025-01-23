'use client'

import {useState, useEffect} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {useTranslation} from "@/hooks/useTranslation";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {useDropzone} from 'react-dropzone';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export default function Register() {
    const {t} = useTranslation();
    const animatedComponents = makeAnimated();
    const [totalSteps, setTotalSteps] = useState(2);
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
        company:{
            name: '',
            phone: '',
            cif_nif: '',
            short_description: '',
            logo: '',
            address: '',
            sectors: [],
        },
        // Instituto
        nombreInstituto: '',
        tipo: '',
        ubicacion: '',
    });
    const sectores = [
        {id: 1, nombre: 'Tecnología'},
        {id: 2, nombre: 'Salud'},
        {id: 3, nombre: 'Educación'},
        {id: 4, nombre: 'Marketing'},
        {id: 5, nombre: 'Cultura'}
    ];

    useEffect(() => {
        switch (formData.rol) {
            case 'estudiante':
                setTotalSteps(2); // Información personal + académica
                break;
            case 'empresa':
                setTotalSteps(3); // Información personal + empresa (2 pasos) + opcional
                break;
            case 'instituto':
                setTotalSteps(2); // Información personal + instituto
                break;
            default:
                setTotalSteps(2); // Valor por defecto
        }
    }, [formData.rol]);

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                const imageUrl = URL.createObjectURL(acceptedFiles[0]);
                setFormData((prevData) => ({
                    ...prevData,
                    company: {
                        ...prevData.company,
                        logo: imageUrl
                    },
                }));
            }
        },
    });

    const handleRemoveImage = () => {
        setFormData((prevData) => ({
            ...prevData,
            company: {
                ...prevData.company,
                logo: imageUrl
            },
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('company_')) {
            setFormData((prevData) => ({
                ...prevData,
                company: {
                    ...prevData.company,
                    [name.replace('company_', '')]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <label htmlFor="company_name" className="block text-sm font-medium text-darkGray mb-2">
                    Nombre de la Empresa
                </label>
                <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    required
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="company_phone" className="block text-sm font-medium text-darkGray mb-2">
                        Telefono de contacto
                    </label>
                    <input
                        type="text"
                        id="company_phone"
                        name="company_phone"
                        value={formData.company.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="company_cif_nif" className="block text-sm font-medium text-darkGray mb-2">
                        Identificació fiscal (C.I.F o N.I.F)
                    </label>
                    <input
                        type="text"
                        id="company_cif_nif"
                        name="company_cif_nif"
                        value={formData.company.cif_nif}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="company_address" className="block text-sm font-medium text-darkGray mb-2">
                    Dirección de la empresa
                </label>
                <input
                    id="company_address"
                    name="company_address"
                    type="text"
                    value={formData.company.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    placeholder="Ingresa la dirección de la empresa"
                    required
                />
            </div>

        </div>
    );

    const renderStep3Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información extra opcional</h2>
            <div>
                <label htmlFor="company_logo" className="block text-sm font-medium text-darkGray mb-2">
                    Logo
                </label>
                <div className="relative">
                    {/* Mostrar el área de Drag and Drop solo si no hay una imagen cargada */}
                    {!formData.company.logo && (
                        <div {...getRootProps()}
                             className="w-full h-[128px] px-4 py-2 rounded-lg border border-gray-200 mt-2 text-center cursor-pointer">
                            <input {...getInputProps()} id="company_logo" name="company_logo" accept="image/*"
                                   required/>
                            <p className="text-sm text-gray-500">Drag & drop an image here, or click to select</p>
                        </div>
                    )}

                    {formData.company.logo && (
                        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                            <img
                                src={formData.company.logo}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                            />
                            {/* Botón para eliminar la imagen */}
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white px-1.5 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label htmlFor="sectores" className="block text-sm font-medium text-darkGray mb-2">
                    Selecciona Sectores
                </label>
                <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={[sectores[2], sectores[1]]}
                    isMulti
                    options={sectores}
                    isSearchable
                    placeholder="Busca y selecciona..."
                    getOptionLabel={(option) => option.nombre}
                    getOptionValue={(option) => option.id}
                />
            </div>
            <div>
                <label htmlFor="company_short_description" className="block text-sm font-medium text-darkGray mb-2">
                    Descripció corta
                </label>
                <textarea
                    id="company_short_description"
                    name="company_short_description"
                    value={formData.company.short_description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-darkGray"
                    rows="3"
                    placeholder="Escribe una breve descripción de la empresa"
                    required
                ></textarea>
            </div>
        </div>
    );

    const renderStep4Empresa = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkGray mb-8">Información extra opcional</h2>
            <label htmlFor="sectores" className="block text-sm font-medium text-darkGray mb-2">
                Selecciona Sectores
            </label>
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={[sectores[2], sectores[1]]}
                isMulti
                options={sectores}
                isSearchable
                placeholder="Busca y selecciona..."
                getOptionLabel={(option) => option.nombre}
                getOptionValue={(option) => option.id}
            />
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
                setTotalSteps(4);
                if (step === 2) return renderStep2Empresa();
                if (step === 3) return renderStep3Empresa();
                if (step === 4) return renderStep4Empresa();
            case 'instituto':
                return renderStep2Instituto();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-lightGray to-white py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                {/*<LanguageSwitcher/>*/}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-darkGray">{t('register')}</h1>
                        <div className="text-sm text-darkGray">
                            Paso {step} de {totalSteps}
                        </div>
                    </div>
                    <div className="w-full bg-lightGray h-2 rounded-full">
                        <div
                            className="bg-darkGray h-2 rounded-full transition-all duration-300"
                            style={{width: `${(step / totalSteps) * 100}%`}}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && renderStep1()}
                    {step === 2 && formData.rol === 'estudiante' && renderStep2Estudiante()}
                    {step === 2 && formData.rol === 'empresa' && renderStep2Empresa()}
                    {step === 3 && formData.rol === 'empresa' && renderStep3Empresa()}
                    {step === 2 && formData.rol === 'instituto' && renderStep2Instituto()}

                    <div className="flex justify-between mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex items-center text-sm font-medium text-darkGray"
                            >
                                <ArrowLeft className="inline-block mr-2"/> Atrás
                            </button>
                        )}
                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded-lg"
                            >
                                Siguiente <ArrowRight className="inline-block ml-2"/>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-black rounded-lg"
                            >
                                Enviar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
