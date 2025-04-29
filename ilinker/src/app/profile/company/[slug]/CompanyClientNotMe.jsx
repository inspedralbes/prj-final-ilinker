
"use client";

import React, { useState } from 'react';
import {
    Pencil,
    MapPin,
    Building2,
    Globe,
    Mail,
    Phone,
    Calendar,
    Plus,
    Users,
    MessageCircle,
    Share2,
    ThumbsUp,
    BookmarkPlus,
    Camera,
    Award,
    Clock,
    Hash,
    Briefcase,
    GraduationCap,
    Languages,
    History,
    BookOpen,
    Target,
    FileText,
    Link
} from 'lucide-react';

export default function CompanyClientNotMe() {
    const [isEditing, setIsEditing] = useState(null);
    const [logoImage, setLogoImage] = useState("https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80");
    const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80");

    const [institute, setInstitute] = useState({
        basic: {
            name: "Institut Pedralbes",
            customUrl: "institut-pedralbes",
            slogan: "Formando los profesionales del futuro",
            about: "El Institut Pedralbes es un centro público de formación profesional líder en Barcelona, especializado en tecnología e informática. Nuestra misión es proporcionar una educación de calidad que prepare a los estudiantes para los desafíos del mundo laboral moderno.",
            location: "Av. d'Esplugues, 36-42, 08034 Barcelona",
            size: "50-200 empleados",
            type: "Centro Público de Formación Profesional",
            sector: "Educación Secundaria y Formación Profesional",
            foundedYear: "1975",
            website: "www.institutpedralbes.cat",
            phone: "+34 932 033 332",
            email: "secretaria@institutpedralbes.cat",
            languages: ["Catalán", "Castellano", "Inglés"]
        },
        specialties: [
            "Desarrollo de Aplicaciones Web",
            "Administración de Sistemas",
            "Ciberseguridad",
            "Inteligencia Artificial",
            "Desarrollo de Videojuegos"
        ],
        hashtags: ["#FPInformática", "#EducaciónTecnológica", "#InnovacionEducativa"],
        additionalLocations: [
            {
                id: 1,
                address: "Carrer de la Tecnologia, 15",
                city: "Barcelona",
                country: "España"
            }
        ],
        certifications: [
            {
                id: 1,
                name: "Centro Certificado Microsoft Imagine Academy",
                issuedBy: "Microsoft",
                year: "2023"
            },
            {
                id: 2,
                name: "Cisco Networking Academy",
                issuedBy: "Cisco",
                year: "2022"
            }
        ],
        collaborations: [
            {
                id: 1,
                company: "Barcelona Activa",
                type: "Prácticas Profesionales",
                description: "Programa de prácticas para estudiantes de último año"
            },
            {
                id: 2,
                company: "Barcelona Tech City",
                type: "Colaboración Educativa",
                description: "Participación en eventos tecnológicos y mentorías"
            }
        ],
        milestones: [
            {
                id: 1,
                year: "1975",
                title: "Fundación del Instituto",
                description: "Apertura del centro educativo"
            },
            {
                id: 2,
                year: "2000",
                title: "Inicio de Formación Profesional en Informática",
                description: "Implementación de los primeros ciclos formativos de grado superior en informática"
            },
            {
                id: 3,
                year: "2020",
                title: "Centro de Excelencia Digital",
                description: "Reconocimiento como centro de referencia en formación tecnológica"
            }
        ]
    });

    const handleEdit = (section) => {
        setIsEditing(section);
    };

    const handleSave = () => {
        setIsEditing(null);
    };

    const handleImageUpload = (event, type) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') {
                    setLogoImage(reader.result);
                } else {
                    setCoverImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const updateInstitute = (section, value) => {
        setInstitute(prev => ({
            ...prev,
            [section]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Cover Photo */}
            <div className="relative h-80 bg-gray-300">
                <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Section */}
                <div className="relative -mt-32">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="sm:flex sm:space-x-5">
                                <div className="relative flex-shrink-0">
                                    <img
                                        className="mx-auto h-40 w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                                        src={logoImage}
                                        alt={institute.basic.name}
                                    />
                                  
                                </div>
                                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                    {isEditing === 'basic' ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={institute.basic.name}
                                                onChange={(e) => updateInstitute('basic', { ...institute.basic, name: e.target.value })}
                                                className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                                            />
                                            <input
                                                type="text"
                                                value={institute.basic.slogan}
                                                onChange={(e) => updateInstitute('basic', { ...institute.basic, slogan: e.target.value })}
                                                className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={institute.basic.location}
                                                    onChange={(e) => updateInstitute('basic', { ...institute.basic, location: e.target.value })}
                                                    className="text-gray-600 border rounded px-2 py-1 flex-1"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSave}
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{institute.basic.name}</h1>
                                            <p className="text-lg text-gray-600">{institute.basic.slogan}</p>
                                            <p className="text-gray-500 flex items-center mt-2">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                {institute.basic.location}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 flex justify-center sm:mt-0">
                                <div className="flex space-x-2">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                                        Contactar
                                    </button>
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <Users className="h-5 w-5 mr-2 text-gray-400" />
                                        Seguir
                                    </button>
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <Share2 className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                                    <a href={`https://${institute.basic.website}`} className="text-blue-600 hover:underline">
                                        {institute.basic.website}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{institute.basic.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-600">{institute.basic.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
                                
                            </div>
                            {isEditing === 'about' ? (
                                <div>
                  <textarea
                      value={institute.basic.about}
                      onChange={(e) => updateInstitute('basic', { ...institute.basic, about: e.target.value })}
                      className="w-full h-32 p-2 border rounded"
                  />
                                    <button
                                        onClick={handleSave}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-600">{institute.basic.about}</p>
                            )}
                        </div>

                        {/* Institute Details */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Instituto</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Tipo de institución</p>
                                                <p className="text-gray-900">{institute.basic.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Tamaño</p>
                                                <p className="text-gray-900">{institute.basic.size}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Año de fundación</p>
                                                <p className="text-gray-900">{institute.basic.foundedYear}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Languages className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Idiomas</p>
                                                <p className="text-gray-900">{institute.basic.languages.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {institute.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                        {specialty}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Certificaciones y Acreditaciones</h2>
                                <button
                                    onClick={() => handleEdit('certifications')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {institute.certifications.map((cert) => (
                                    <div key={cert.id} className="flex items-start space-x-3">
                                        <Award className="h-6 w-6 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{cert.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Otorgado por {cert.issuedBy} • {cert.year}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collaborations */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Colaboraciones con Empresas</h2>
                                <button
                                    onClick={() => handleEdit('collaborations')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {institute.collaborations.map((collab) => (
                                    <div key={collab.id} className="flex items-start space-x-3">
                                        <Briefcase className="h-6 w-6 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{collab.company}</h3>
                                            <p className="text-sm text-gray-600">{collab.type}</p>
                                            <p className="text-sm text-gray-500">{collab.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History and Milestones */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Historia del Instituto</h2>
                                <button
                                    onClick={() => handleEdit('milestones')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                <div className="space-y-6">
                                    {institute.milestones.map((milestone) => (
                                        <div key={milestone.id} className="relative flex items-start">
                                            <div className="absolute left-0 mt-1 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <History className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="ml-12">
                                                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                                                <p className="text-sm text-gray-500">{milestone.year}</p>
                                                <p className="mt-1 text-gray-600">{milestone.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex flex-wrap gap-2">
                                {institute.hashtags.map((hashtag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                    >
                    <Hash className="h-4 w-4 mr-1" />
                                        {hashtag.replace('#', '')}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
