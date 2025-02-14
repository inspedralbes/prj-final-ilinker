"use client";

import React, {useState} from 'react';
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
    Link,
    HomeIcon, UserIcon, NewspaperIcon, BriefcaseIcon, UsersIcon
} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Avatar} from "@/components/ui/avatar";
import {Card} from "@/components/ui/card";

export default function CompanyClientMe({company}) {
    const [isEditing, setIsEditing] = useState(null);
    const [logoImage, setLogoImage] = useState("https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80");
    const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80");

    const [companyEdited, setCompanyEdited] = useState(company);

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
                    src={company?.cover_photo || coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <label className="absolute bottom-4 right-4 cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover')}
                    />
                    <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70"/>
                </label>
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
                                        src={company?.logo || logoImage}
                                        alt={company?.logo}
                                    />
                                    <label className="absolute bottom-2 right-2 cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'logo')}
                                        />
                                        <Camera
                                            className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70"/>
                                    </label>
                                </div>
                                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                                    {isEditing === 'basic' ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={institute.basic.name}
                                                onChange={(e) => updateInstitute('basic', {
                                                    ...institute.basic,
                                                    name: e.target.value
                                                })}
                                                className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                                            />
                                            <input
                                                type="text"
                                                value={institute.basic.slogan}
                                                onChange={(e) => updateInstitute('basic', {
                                                    ...institute.basic,
                                                    slogan: e.target.value
                                                })}
                                                className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                                            />
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-5 w-5 text-gray-400"/>
                                                <input
                                                    type="text"
                                                    value={institute.basic.location}
                                                    onChange={(e) => updateInstitute('basic', {
                                                        ...institute.basic,
                                                        location: e.target.value
                                                    })}
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
                                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{company?.name || "No tenemos este dato"}</h1>
                                            <p className={`text-lg text-gray-600 ${!company?.slogan ? 'hidden' : ''}`}>
                                                {company?.slogan}
                                            </p>
                                            <p className="text-gray-500 flex items-center mt-2">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-2"/>
                                                {company?.address}
                                            </p>
                                            <button
                                                onClick={() => handleEdit('basic')}
                                                className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil className="h-4 w-4 mr-1"/>
                                                Editar información básica
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-5 flex justify-center sm:mt-0">
                                <div className="flex space-x-2">
                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <MessageCircle className="h-5 w-5 mr-2 text-gray-400"/>
                                        Contactar
                                    </button>

                                    <button
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                        <Share2 className="h-5 w-5 text-gray-400"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center">
                                    <Globe className="h-5 w-5 text-gray-400 mr-2"/>
                                    <a href={company?.website || ""} className="text-blue-600 hover:underline">
                                        {company?.website || "No hay website vinculada"}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-2"/>
                                    <span className="text-gray-600">{company?.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-400 mr-2"/>
                                    <span
                                        className="text-gray-600">{company?.company_email || "Sin dirección de correo"}</span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
                                <button
                                    onClick={() => handleEdit('about')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil className="h-4 w-4"/>
                                </button>
                            </div>
                            {isEditing === 'about' ? (
                                <div>
                                    <textarea
                                        value={institute.basic.about}
                                        onChange={(e) => updateInstitute('basic', {
                                            ...institute.basic,
                                            about: e.target.value
                                        })}
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
                                <div dangerouslySetInnerHTML={{__html: company.description}}/>
                            )}
                        </div>
                    </div>

                    <Tabs defaultValue="inicio" className="w-full mt-5">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg">
                            <TabsTrigger
                                value="inicio"
                                className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                            >
                                <HomeIcon className="h-4 w-4"/>
                                Inicio
                            </TabsTrigger>
                            <TabsTrigger
                                value="acerca"
                                className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                            >
                                <UserIcon className="h-4 w-4"/>
                                Acerca de
                            </TabsTrigger>
                            <TabsTrigger
                                value="publicaciones"
                                className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                            >
                                <NewspaperIcon className="h-4 w-4"/>
                                Publicaciones
                            </TabsTrigger>
                            <TabsTrigger
                                value="ofertas"
                                className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                            >
                                <BriefcaseIcon className="h-4 w-4"/>
                                Ofertas
                            </TabsTrigger>
                            <TabsTrigger
                                value="empleados"
                                className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                            >
                                <UsersIcon className="h-4 w-4"/>
                                Personas empleadas
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="inicio" className="mt-6 shadow-lg">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Página principal</h2>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-800">Destacados</h3>
                                        <p className="text-blue-600 mt-2">
                                            Tech Company ha sido reconocida como una de las mejores empresas para
                                            trabajar en 2024
                                        </p>
                                    </div>
                                    <div className="border-t pt-4">
                                        <h3 className="font-semibold mb-2">Actividad reciente</h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div
                                                        className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"/>
                                                    <div>
                                                        <p className="font-medium">Nuevo logro alcanzado</p>
                                                        <p className="text-sm text-gray-500">Hace {i} días</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="acerca" className="mt-6">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Acerca de Tech Company</h2>
                                <p className="text-gray-600 mb-6">
                                    Somos una empresa líder en tecnología dedicada a transformar la manera en que
                                    las personas
                                    interactúan con la tecnología. Con más de 15 años de experiencia, nos
                                    especializamos en
                                    desarrollo de software, inteligencia artificial y soluciones cloud.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Información general</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li>Sitio web: www.techcompany.com</li>
                                            <li>Industria: Tecnología</li>
                                            <li>Tamaño: 1000-5000 empleados</li>
                                            <li>Fundada: 2008</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Especialidades</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li>Desarrollo de Software</li>
                                            <li>Inteligencia Artificial</li>
                                            <li>Cloud Computing</li>
                                            <li>Consultoría IT</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="publicaciones" className="mt-6 space-y-4">
                            {[1, 2, 3].map((post) => (
                                <Card key={post} className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12">
                                            <img
                                                src={`https://images.unsplash.com/photo-${1500000000000 + post}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                                alt="Author"
                                                className="aspect-square h-full w-full"
                                            />
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">María García</h3>
                                                    <p className="text-sm text-gray-500">Directora de Innovación</p>
                                                </div>
                                                <span className="text-sm text-gray-500">2h</span>
                                            </div>
                                            <p className="mt-2 text-gray-600">
                                                Emocionados de anunciar nuestro nuevo proyecto de innovación en IA.
                                                ¡Grandes cosas están por venir! #Innovación #TechCompany
                                            </p>
                                            <div className="mt-4 bg-gray-100 rounded-lg aspect-video"></div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="ofertas" className="mt-6 space-y-4">
                            {[
                                {
                                    title: "Senior Frontend Developer",
                                    location: "Madrid",
                                    type: "Tiempo completo",
                                    posted: "2 días"
                                },
                                {
                                    title: "DevOps Engineer",
                                    location: "Barcelona",
                                    type: "Tiempo completo",
                                    posted: "1 semana"
                                },
                                {
                                    title: "Product Manager",
                                    location: "Remoto",
                                    type: "Tiempo completo",
                                    posted: "3 días"
                                }
                            ].map((job, i) => (
                                <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <div className="mt-2 space-y-1">
                                                <p className="text-gray-600">{job.location}</p>
                                                <p className="text-gray-600">{job.type}</p>
                                                <p className="text-sm text-gray-500">Publicado hace {job.posted}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                            Aplicar
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="empleados" className="mt-6">
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Personas empleadas</h2>
                                    <div className="text-sm text-gray-500">1,234 empleados</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((employee) => (
                                        <div key={employee} className="flex gap-4 items-center">
                                            <Avatar className="h-16 w-16">
                                                <img
                                                    src={`https://images.unsplash.com/photo-${1500000000000 + employee}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                                    alt="Employee"
                                                    className="aspect-square h-full w-full"
                                                />
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold">Juan Pérez</h3>
                                                <p className="text-gray-600">Software Engineer</p>
                                                <p className="text-sm text-gray-500">Madrid, España</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
