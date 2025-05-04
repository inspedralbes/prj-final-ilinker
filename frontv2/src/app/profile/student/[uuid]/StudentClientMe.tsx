"use client"

import {
    BriefcaseIcon,
    Camera,
    Globe,
    Mail,
    MapPin,
    MessageCircle,
    Pencil,
    Phone,
    Share2,
    UserIcon,
    Trash,
    CheckCircle,
    AlertTriangle,
    TriangleAlert,
    Plus,
    BriefcaseBusiness,
    Clock,
    Building,
    FolderGit2,
    CalendarIcon
} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import Select from "react-select";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Avatar} from "@/components/ui/avatar";
import React, {useEffect, useState, useCallback, useContext} from "react";
import Image from "next/image";
import Link from "next/link"
import ModalAddStudies from "@/app/profile/student/[uuid]/modals/ModalAddStudies";
import ModalAddExperience from "@/app/profile/student/[uuid]/modals/ModalAddExperience";
import ModalAddProjects from "@/app/profile/student/[uuid]/modals/ModalAddProjects";
import {apiRequest} from "@/services/requests/apiRequest";
import {toast} from "@/hooks/use-toast";
import ConfirmDialog from "@/components/dialog/confirmDialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {useRef} from "react";
import {LoaderContext} from "@/contexts/LoaderContext";
import makeAnimated from "react-select/animated";
import {Calendar} from "@/components/ui/calendar"
import {cn} from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {addDays, format} from "date-fns"


export interface User {
    id: number;
    name: string;
    surname: string;
    photo_pic: string | null;
    birthday: string;
    email: string;
    active: number;
    email_verified_at: string;
    rol: string;
    provider_id: string | null;
    provider: string | null;
    created_at: string;
    updated_at: string;
}

export interface Education {
    id: number;
    student_id: number;
    courses_id: number | null;
    institution_id: number | null;
    institute: string;
    degree: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    institution: Institution | null;
}

export interface Institution {
    id: number;
    user_id: number;
    name: string;
    slug: string | null;
    custom_url: string | null;
    slogan: string | null;
    about: string | null;
    NIF: string;
    type: string;
    academic_sector: string;
    location: string | null;
    size: string | null;
    sector: string | null;
    founded_year: number | null;
    languages: string | null;
    logo: string;
    cover: string | null;
    website: string;
    phone: number;
    email: string;
    responsible_name: string;
    responsible_phone: number;
    responsible_email: string;
    institution_position: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    created_at: string;
    updated_at: string;
}

export interface Experience {
    id: number;
    student_id: number;
    company_id: number;
    company_name: string;
    department: string;
    employee_type: string;
    company_address: string | null;
    location_type: 'remoto' | 'presencial' | 'hibrido';
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    student_id: number;
    name: string;
    description: string;
    link: string | null;
    pictures: string; // JSON string, puedes parsearlo a string[] si quieres
    end_project: string;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    pivot: {
        student_id: number;
        skill_id: number;
    };
}

export interface Student {
    id: number;
    user_id: number;
    uuid: string;
    name: string;
    surname: string;
    type_document: string;
    id_document: string;
    nationality: string;
    photo_pic: string | null;
    cover_photo: string | null;
    desctiption: string | null;
    birthday: string;
    gender: string;
    phone: number;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    languages: string; // Este es un JSON string. Puedes parsearlo si necesitas tipado más profundo.
    created_at: string;
    updated_at: string;
    user: User;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skill[];
}

interface StudentClientMeProps {
    uuid: String;
    student: Student;
    experience_group: object;
}

export default function StudentClientMe({uuid, student, experience_group}: StudentClientMeProps) {


    const [studentEdit, setStudentEdit] = useState(student);
    const [experienceEdit, setExperienceEdit] = useState(experience_group);
    const [educationEdit, setEducationEdit] = useState(student.education);
    const [projectsEdit, setProjectEdit] = useState(student.projects);
    const [skillsEdit, setSkillsEdit] = useState(student.skills);
    const [userEdit, setUserEdit] = useState(student.user);
    const [isEditing, setIsEditing] = useState(null);
    const [coverImage, setCoverImage] = useState("https://img.freepik.com/fotos-premium/fondo-tecnologico-purpura-elementos-codigo-e-iconos-escudo_272306-172.jpg?semt=ais_hybrid&w=740");
    const [logoImage, setLogoImage] = useState("https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png");
    const [modalState, setModalState] = useState(false);
    const [modalExperience, setModalExperience] = useState(false);
    const [modalProjects, setModalProjects] = useState(false);
    const [modalModeEdit, setModalModeEdit] = useState(false);
    const [currentStudy, setCurrentStudy] = useState(null);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [educationSelect, setEducationSelect] = useState(null);
    const [experinceSelect, setExperienceSelect] = useState(null);
    const [projectsSelect, setProjectSelect] = useState(null);
    const [isExperience, setIsExperience] = useState(false);
    const [carouselStates, setCarouselStates] = useState({});
    const {showLoader, hideLoader} = useContext(LoaderContext);
    const animatedComponents = makeAnimated();
    const [date, setDate] = React.useState<Date>()

    const API_PATH_IMG = "http://localhost:8000/storage/projects/";


    const handleOpenModalAddStudies = () => {
        setModalState(!modalState)
        setModalModeEdit(false)
        setIsEditing(false);
    }

    const openModalExperience = (experience: object) => {
        console.log(experience);
        setModalExperience(!modalExperience);
        setModalModeEdit(false);
        setIsEditing(false);
    }
    const openModalProjects = (project: object) => {
        console.log(project);
        setModalProjects(!modalProjects);
        setModalModeEdit(false);
        setIsEditing(false);
    }

    const handleCloseModal = () => {
        setModalState(false)
        setModalModeEdit(false)
    }

    const handleCloseExperience = () => {
        setModalExperience(false);
        setModalModeEdit(false);
    }

    const handleCloseProject = () => {
        setModalProjects(false);
        setModalModeEdit(false);
    }

    const UpdateChange = async () => {
        const response = await apiRequest(`student/` + uuid)
        setEducationEdit(response.student.education);
        setExperienceEdit(response.experience_grouped);
        setProjectEdit(response.student.projects);
    }

    const EditInfo = (section: string, education: object) => {

        setIsEditing(section);
        setCurrentStudy(education);

        setModalState(!modalState);
        setModalModeEdit(false);
    }

    const EditInfoExp = (section: string, exp: object) => {
        setIsEditing(section);
        setCurrentExperience(exp);

        setModalExperience(!modalExperience);
        setModalModeEdit(false);
    }

    const editInfoPro = (section: string, pro: object) => {
        setIsEditing(section);
        setCurrentProject(pro);

        setModalProjects(!modalProjects);
        setModalModeEdit(false);
    }

    const removeSection = (education = null, experience = null, projects = null) => {
        setOpenDialog(true);
        setIsExperience(!!experience);
        setEducationSelect(education);
        setExperienceSelect(experience);
        setProjectSelect(projects);
    }


    const handleConfirm = async () => {
        showLoader();

        try {
            const endpoint = educationSelect ? 'education/delete' : projectsSelect ? 'projects/delete' : 'experience/delete'
            const idSection = educationSelect ? educationSelect.id : projectsSelect ? projectsSelect.id : experinceSelect.id;
            const response = await apiRequest(endpoint, 'DELETE', {id: idSection})

            if (response.status === 'success') {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500"/>
                            {educationSelect ? (
                                <span>Estudio Eliminado</span>
                            ) : (
                                <span>Experiencia Eliminada</span>
                            )}
                        </div>
                    ),
                    description:
                        educationSelect ? "Estudio eliminado correctamente"
                            : projectsSelect ? "Proyecto eliminado correctamente"
                                : "Experiencia eliminada correctamente",

                    variant: "default",
                    duration: 2000
                })
                hideLoader();
                UpdateChange();
                setOpenDialog(false);
                setIsExperience(false);
                educationSelect ? setEducationSelect(null) : projectsSelect ? setProjectSelect(null) : setExperienceSelect(null);
            } else {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-green-500"/>
                            <span>Error al eliminar</span>
                        </div>
                    ),
                    description:
                        educationSelect ? "Ha ocurrido un error al intentar eliminar el estudio"
                            : projectsSelect ? "Ha ocurrido un error al intentar eliminar el proyecto"
                                : "Ha ocurrido un error al intentar eliminar la experiencia",
                    variant: "destructive",
                    duration: 2000
                });
                hideLoader();
                setOpenDialog(false);
                setIsExperience(false);
                educationSelect ? setEducationSelect(null) : projectsSelect ? setProjectSelect(null) : setExperienceSelect(null);
            }

        } catch (e) {
            hideLoader();
            console.log(e)
            setOpenDialog(false);
            setIsExperience(false);
            educationSelect ? setEducationSelect(null) : projectsSelect ? setProjectSelect(null) : setExperienceSelect(null);
        }
    };

    const handleCancel = () => {
        setOpenDialog(false);
        setIsExperience(false);
        setEducationSelect(null);
        setExperienceSelect(null);
    }

    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")                     // separa letras y acentos
            .replace(/[\u0300-\u036f]/g, "")     // elimina los acentos
            .replace(/\s+/g, "-")                // reemplaza espacios por guiones
            .replace(/[^\w\-]+/g, "")            // elimina caracteres especiales
            .replace(/\-\-+/g, "-")              // reemplaza múltiples guiones por uno
            .replace(/^-+|-+$/g, "");            // elimina guiones al inicio/final
    };

    // Función para mostrar el tipo de ubicación con un icono apropiado
    const renderLocationType = (locationType: string) => {
        switch (locationType) {
            case 'remoto':
                return (
                    <span className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1"/>
            Remoto
          </span>
                );
            case 'presencial':
                return (
                    <span className="flex items-center text-sm text-gray-500">
            <Building className="h-3 w-3 mr-1"/>
            Presencial
          </span>
                );
            case 'hibrido':
                return (
                    <span className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1"/>
            Híbrido
          </span>
                );
            default:
                return null;
        }
    }


    // Referencia para los plugins
    const pluginsRef = useRef({});

    // Crear una instancia del plugin Autoplay para cada proyecto
    projectsEdit.forEach((pro) => {
        if (!pluginsRef.current[pro.id]) {
            pluginsRef.current[pro.id] = Autoplay({delay: 3000, stopOnMouseEnter: true});
        }
    });


    // Función para actualizar el estado de un carrusel específico
    const updateCarouselState = (projectId: number, api: any) => {
        if (!api) return;

        api.on("select", () => {
            setCarouselStates(prev => ({
                ...prev,
                [projectId]: {
                    current: api.selectedScrollSnap() + 1,
                    count: api.scrollSnapList().length
                }
            }));
        });

    };

    const handleEdit = (section: string) => {
        setIsEditing(section);
    };

    // Asegúrate que esto está dentro de tu componente:
    let parsedLanguages: { language: string; level: string }[] = [];

    try {
        parsedLanguages = studentEdit?.languages
            ? JSON.parse(studentEdit.languages)
            : [];
    } catch (error) {
        console.error("Error al parsear languages:", error);
    }


    const handleSave = () => {
        const formattedData = {
            ...studentEdit,
            birthday: studentEdit.birthday
                ? format(studentEdit.birthday, "dd/MM/yyyy")
                : null,
        };

        console.log("PERFIL");
        console.table(formattedData)

    }


    useEffect(() => {
        UpdateChange();
    }, []);


    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Cover Photo */}
                <div className="relative h-80 bg-gray-300">
                    <img
                        src={studentEdit?.cover_photo ? `http://localhost:8000/storage/${studentEdit.cover_photo}` : coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <label className="absolute bottom-4 right-4 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'cover_photo')}
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
                                            src={studentEdit?.photo_pic ? `http://localhost:8000/storage/${studentEdit.photo_pic}` : logoImage}
                                            alt={studentEdit?.photo_pic}
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
                                                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{student?.name + " " + student.surname || "No tenemos este dato"}</h1>
                                                <p className={`text-lg text-gray-600 ${!student?.name ? 'hidden' : ''}`}>
                                                    {student?.name} SOY YO
                                                </p>
                                                <p className="text-gray-500 flex items-center mt-2">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2"/>
                                                    {student?.address}
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
                                        <a href={student?.country || ""} className="text-blue-600 hover:underline">
                                            {student?.country || "No hay website vinculada"}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-gray-400 mr-2"/>
                                        <span className="text-gray-600">{student?.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-400 mr-2"/>
                                        <span
                                            className="text-gray-600">{userEdit?.email || "Sin dirección de correo"}</span>
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
                                    <div dangerouslySetInnerHTML={{__html: studentEdit.description}}/>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="acerca" className="w-full mt-5">
                            <TabsList
                                className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg">
                                {/*<TabsTrigger*/}
                                {/*    value="inicio"*/}
                                {/*    className="  flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <HomeIcon className="h-4 w-4"/>*/}
                                {/*    Inicio*/}
                                {/*</TabsTrigger>*/}
                                <TabsTrigger
                                    value="acerca"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <UserIcon className="h-4 w-4"/>
                                    Acerca de
                                </TabsTrigger>
                                {/*<TabsTrigger*/}
                                {/*    value="publicaciones"*/}
                                {/*    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <NewspaperIcon className="h-4 w-4"/>*/}
                                {/*    Publicaciones*/}
                                {/*</TabsTrigger>*/}
                                <TabsTrigger
                                    value="studies"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <BriefcaseIcon className="h-4 w-4"/>
                                    Mis Estudios
                                </TabsTrigger>
                                {/*<TabsTrigger*/}
                                {/*    value="empleados"*/}
                                {/*    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                                {/*>*/}
                                {/*    <UsersIcon className="h-4 w-4"/>*/}
                                {/*    Personas empleadas*/}
                                {/*</TabsTrigger>*/}
                                <TabsTrigger
                                    value="experience"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <BriefcaseBusiness className="h-4 w-4"/>
                                    Mi Experiencia
                                </TabsTrigger>
                                <TabsTrigger
                                    value="projects"
                                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                                >
                                    <FolderGit2 className="h-4 w-4"/>
                                    Mis Proyectos
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
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Acerca de {studentEdit.name}</h2>
                                        <button
                                            onClick={() => handleEdit('description')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil className="h-4 w-4"/>
                                        </button>
                                    </div>

                                    {isEditing === "description" ? (
                                        <>
                                            <div className="mb-6">
                                                <Textarea
                                                    className="min-h-[150px]"
                                                    value={studentEdit.description}
                                                    onChange={(e) =>
                                                        setStudentEdit({
                                                            ...studentEdit,
                                                            description: e.target.value
                                                        })
                                                    }
                                                    placeholder="Escribe la descripción..."
                                                />
                                            </div>
                                        </>
                                    ) : (<>
                                        <div className="mb-6"
                                             dangerouslySetInnerHTML={{__html: studentEdit.description}}/>
                                    </>)}

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            <h3 className="font-semibold mb-2">Información general</h3>

                                            {isEditing === "description" ? (
                                                <div className="space-y-3">
                                                    <Input
                                                        value={studentEdit.country}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            website: e.target.value
                                                        })}
                                                        placeholder="Sitio web"
                                                    />

                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={skillsEdit}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({
                                                                ...studentEdit,
                                                                sectors: selectedOption
                                                            })
                                                        }}
                                                    />
                                                    <Input
                                                        value={studentEdit.postal_code}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            postal_code: e.target.value
                                                        })}
                                                        placeholder="Tamaño"
                                                    />

                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[240px] justify-start text-left font-normal",
                                                                    !studentEdit.birthday && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon/>
                                                                {studentEdit.birthday ? format(studentEdit.birthday, "dd/MM/yyyy") :
                                                                    <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={studentEdit.birthday}
                                                                onSelect={(date) => setStudentEdit({
                                                                    ...studentEdit,
                                                                    birthday: date
                                                                })}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                            ) : (
                                                <ul className="space-y-2 text-gray-600">
                                                    <li><strong>País:</strong> {studentEdit.country}</li>
                                                    <li><strong>Ciudad:</strong> {studentEdit.city}</li>
                                                    <li><strong>Nacionalidad:</strong> {studentEdit.nationality}</li>
                                                    <li><strong>Dirección:</strong> {studentEdit.address}</li>
                                                    <li><strong>Codigo Postal:</strong> {studentEdit.postal_code}</li>
                                                    <li><strong>Año de nacimiento:</strong> {studentEdit.birthday}</li>
                                                </ul>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Especialidades</h3>
                                            {isEditing === "description" ? (
                                                <>
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={skillsEdit}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({...studentEdit, skills: selectedOption})
                                                        }}
                                                    />
                                                </>
                                            ) : (<>
                                                <div className="flex flex-wrap gap-2 text-gray-600">
                                                    {skillsEdit && skillsEdit.length > 0 ? (
                                                        skillsEdit.map((skill) => (
                                                            <Badge key={skill.id}
                                                                   className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md">
                                                                {skill.name} {/* Renderiza solo el nombre de la habilidad */}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500">No especificado</span>
                                                    )}
                                                </div>
                                            </>)
                                            }
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-2">Idiomas</h3>
                                            {isEditing === "description" ? (
                                                <>
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={skillsEdit}
                                                        isSearchable
                                                        isMulti
                                                        placeholder="Busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setStudentEdit({...studentEdit, skills: selectedOption})
                                                        }}
                                                    />
                                                </>
                                            ) : (<>
                                                <div className="flex flex-wrap gap-2 text-gray-600">
                                                    {parsedLanguages.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {parsedLanguages.map((lan, idx) => (
                                                                <Badge
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md"
                                                                >
                                                                    {lan.language}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">No especificado</span>
                                                    )}

                                                </div>
                                            </>)
                                            }
                                        </div>

                                    </div>
                                    {/* Botón Guardar */}
                                    {isEditing && (
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={() => handleSave()}>Guardar</Button>
                                        </div>
                                    )}
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

                            <TabsContent value="studies" className="mt-6 space-y-4">
                                <Card className="p-6 mt-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Estudios de {studentEdit.name}</h2>

                                        {/* Botón para añadir una nueva oferta */}
                                        <div className="flex justify-end">
                                            <Button
                                                variant="default"
                                                className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-md transition-colors"
                                                onClick={() => handleOpenModalAddStudies()}
                                            >
                                                <Plus className="h-5 w-5"/>
                                            </Button>
                                        </div>

                                    </div>

                                    <div className="gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            <div className="space-y-4">
                                                {educationEdit && educationEdit.length > 0 ? (
                                                    educationEdit.map((studies) => (
                                                        <Card
                                                            className="overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md"
                                                            key={studies.id || studies.institute}>

                                                            <div className="p-5">
                                                                <div className="flex items-start gap-4">
                                                                    {/* Imagen a la izquierda */}
                                                                    <div className="flex-shrink-0">
                                                                        <Image
                                                                            src={
                                                                                studies.institution && studies.institution.logo
                                                                                    ? studies.institution.logo
                                                                                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiI8bK0w9ZqoX3JybXl_26MloLwBwjdsWLIw&s'
                                                                            }
                                                                            alt="Logo del instituto"
                                                                            className="object-cover rounded"
                                                                            width={80}
                                                                            height={80}
                                                                        />
                                                                    </div>

                                                                    {/* Contenido a la derecha de la imagen */}
                                                                    <div className="flex-grow">
                                                                        <div
                                                                            className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                                                            {studies.institution_id ? (
                                                                                <Link
                                                                                    href={`/profile/institution/${studies.institution.slug}`}
                                                                                    passHref>
                                                                                        <span
                                                                                            className="font-semibold text-lg text-blue-600 hover:underline cursor-pointer">
                                                                                            {studies.institute}
                                                                                        </span>
                                                                                </Link>
                                                                            ) : (
                                                                                <h3 className="font-semibold text-lg text-gray-900">{studies.institute}</h3>
                                                                            )}

                                                                            <div
                                                                                className="flex items-center gap-5">
                                                                                {/* Fechas */}
                                                                                <span
                                                                                    className="text-sm text-gray-500">
                                                                                        {studies.start_date} - {studies.end_date || "Cursando"}
                                                                                    </span>

                                                                                {/* Botón de editar */}
                                                                                <button
                                                                                    onClick={() => EditInfo("study", studies)} // asegúrate de tener esta función
                                                                                    className="text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    <Pencil className="h-4 w-4"/>
                                                                                </button>

                                                                                {/* Botón de eliminar */}
                                                                                <button
                                                                                    onClick={() => removeSection(studies, null, null)} // asegúrate de tener esta función
                                                                                    className="text-red-600 hover:text-red-800"
                                                                                >
                                                                                    <Trash className="h-4 w-4"/>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm inline-block font-medium mt-1">
                                                                            {studies.degree}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>

                                                    ))
                                                ) : (
                                                    <div
                                                        className="py-8 text-center border border-dashed border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                                        <p className="text-black">No hay estudios
                                                            especificados</p>
                                                        <button
                                                            onClick={() => handleOpenModalAddStudies()}
                                                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                            + Añadir educación
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            </TabsContent>

                            <TabsContent value="experience" className="mt-6 space-y-4">
                                <Card className="p-6 mt-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Experiencia
                                            de {studentEdit.name}</h2>

                                        {/* Botón para añadir una nueva oferta */}
                                        <div className="flex justify-end">
                                            <Button
                                                variant="default"
                                                className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-md transition-colors"
                                                onClick={() => openModalExperience()}
                                            >
                                                <Plus className="h-5 w-5"/>
                                            </Button>
                                        </div>

                                    </div>

                                    <div className="gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            {experienceEdit &&
                                            Object.keys(experienceEdit).length > 0 &&
                                            Object.keys(experienceEdit).some(key =>
                                                Array.isArray(experienceEdit[key]) &&
                                                experienceEdit[key].length > 0) ?
                                                (
                                                    <div className="space-y-8">
                                                        {Object.keys(experienceEdit).map((expId) => {
                                                            const experiences = experienceEdit[expId];
                                                            const moreExperience = Array.isArray(experiences) && experiences.length > 1;

                                                            // Si no es un array o está vacío, saltamos
                                                            if (!Array.isArray(experiences) || experiences.length === 0) {
                                                                return null;
                                                            }

                                                            const companyName = experiences[0].company_name;

                                                            return (
                                                                <div key={expId}
                                                                     className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                                                                    <div
                                                                        className="flex items-center justify-between w-full mb-4">
                                                                        <div
                                                                            className="text-lg font-semibold">{companyName}</div>

                                                                    </div>
                                                                    {moreExperience ? (
                                                                            // Línea de tiempo para múltiples experiencias
                                                                            <div className="relative pl-6">
                                                                                {/* Línea vertical */}
                                                                                <div
                                                                                    className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-300"></div>

                                                                                {/* Experiencias */}
                                                                                <div className="space-y-6">
                                                                                    {experiences.map((exp) => (
                                                                                        <div key={exp.id}
                                                                                             className="relative">
                                                                                            {/* Punto en la línea de tiempo */}
                                                                                            <div
                                                                                                className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white transform -translate-x-2"></div>

                                                                                            {/* Contenido de la experiencia */}
                                                                                            <div
                                                                                                className="bg-blue-50 rounded-lg p-4 ml-4 border border-blue-100">
                                                                                                <div
                                                                                                    className="flex justify-between items-start">
                                                                                                    <div>
                                                                                                        <div
                                                                                                            className="font-medium text-blue-800">{exp.department}
                                                                                                        </div>

                                                                                                        <div
                                                                                                            className="font-medium text-gray-600">
                                                                                                            {exp.start_date} - {exp.end_date}
                                                                                                        </div>

                                                                                                        <div
                                                                                                            className="text-sm text-gray-700">{exp.employee_type}
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div
                                                                                                        className="flex space-x-2">
                                                                                                        <button
                                                                                                            onClick={() => EditInfoExp("experience", exp)}
                                                                                                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                                                                                                        >
                                                                                                            <Pencil
                                                                                                                className="h-4 w-4"/>
                                                                                                        </button>
                                                                                                        <button
                                                                                                            onClick={() => removeSection(null, exp, null)}
                                                                                                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                                                                                        >
                                                                                                            <Trash
                                                                                                                className="h-4 w-4"/>
                                                                                                        </button>

                                                                                                    </div>
                                                                                                </div>

                                                                                                <div
                                                                                                    className="mt-2 flex items-center space-x-3">
                                                                                                    {renderLocationType(exp.location_type)}
                                                                                                    {exp.company_address && (
                                                                                                        <span
                                                                                                            className="text-sm text-gray-600">
                                                                                                        {exp.company_address}
                                                                                                    </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                        ) :
                                                                        (
                                                                            // Tarjeta única para una sola experiencia
                                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                                {experiences.map((exp) => (
                                                                                    <div key={exp.id}>
                                                                                        <div
                                                                                            className="flex justify-between items-start">
                                                                                            <div>
                                                                                                <div
                                                                                                    className="font-medium text-gray-800">{exp.department}</div>
                                                                                                <div
                                                                                                    className="text-sm text-gray-700">{exp.employee_type}</div>
                                                                                            </div>

                                                                                            <div
                                                                                                className="flex space-x-2">
                                                                                                <button
                                                                                                    onClick={() => EditInfoExp("experience", exp)}
                                                                                                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                                                                                                >
                                                                                                    <Pencil
                                                                                                        className="h-4 w-4"/>
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => removeSection(null, exp, null)}
                                                                                                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                                                                                >
                                                                                                    <Trash
                                                                                                        className="h-4 w-4"/>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div
                                                                                            className="mt-2 flex flex-wrap gap-3">
                                                                                        <span
                                                                                            className="flex items-center text-sm text-gray-500">
                                                                                            <Clock
                                                                                                className="h-3 w-3 mr-1"/>
                                                                                            {exp.employee_type}
                                                                                        </span>
                                                                                            {renderLocationType(exp.location_type)}
                                                                                            {exp.company_address && (
                                                                                                <span
                                                                                                    className="text-sm text-gray-600">
                                                                                                {exp.company_address}
                                                                                            </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) :
                                                (
                                                    <div
                                                        className="py-8 text-center border border-dashed border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                                        <p className="text-black">No hay experiencia especificada</p>
                                                        <button
                                                            onClick={() => openModalExperience()}
                                                            className="mt-2 text-blue-400 hover:text-blue-600 text-sm font-medium">
                                                            + Añadir experiencia
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                </Card>
                            </TabsContent>

                            <TabsContent value="projects" className="mt-6">


                                {/* Card contenedora con menos padding para aprovechar espacio */}
                                <Card className="p-6 mt-6 mb-6">

                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Proyectos
                                            de {studentEdit.name}</h2>

                                        {/* Botón para añadir una nueva oferta */}
                                        <div className="flex justify-end">
                                            <Button
                                                variant="default"
                                                className="bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-md transition-colors"
                                                onClick={() => openModalProjects()}
                                            >
                                                <Plus className="h-5 w-5"/>
                                            </Button>
                                        </div>

                                    </div>

                                    {projectsEdit && projectsEdit.length > 0 ?
                                        (
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {projectsEdit.map((pro) => (
                                                    <div key={pro.id}>
                                                        <Card
                                                            className="relative overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="relative">
                                                                {pro.pictures ? (
                                                                    <Carousel
                                                                        plugins={[pluginsRef.current[pro.id]]}
                                                                        className="w-full"
                                                                        onMouseLeave={pluginsRef.current[pro.id].play}
                                                                        setApi={(api) => {
                                                                            updateCarouselState(pro.id, api);
                                                                        }}
                                                                    >
                                                                        <CarouselContent>
                                                                            {JSON.parse(pro.pictures).map((img, index) => (
                                                                                <CarouselItem key={index}>
                                                                                    <div className="p-1">
                                                                                        <Card
                                                                                            className="border-0 shadow-none">
                                                                                            <CardContent
                                                                                                className="flex aspect-square items-center justify-center p-4">
                                                                                                <img
                                                                                                    key={index}
                                                                                                    src={API_PATH_IMG + slugify(pro.name) + "/" + img}
                                                                                                    alt={`Imagen ${index}`}
                                                                                                    className="w-full h-auto object-cover"
                                                                                                />
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    </div>
                                                                                </CarouselItem>

                                                                            ))}
                                                                        </CarouselContent>


                                                                        <div
                                                                            className="py-2 text-center text-sm text-muted-foreground">
                                                                            <span>Slide {carouselStates[pro.id]?.current || 1} of {JSON.parse(pro.pictures).length}</span>
                                                                        </div>

                                                                        {/* Flechas de navegación más pequeñas y discretas */}
                                                                        <div
                                                                            className="absolute inset-y-0 left-0 flex items-center">
                                                                            <CarouselPrevious
                                                                                className="h-7 w-7 ml-1 bg-white/80 hover:bg-white shadow-sm"/>
                                                                        </div>
                                                                        <div
                                                                            className="absolute inset-y-0 right-0 flex items-center">
                                                                            <CarouselNext
                                                                                className="h-7 w-7 mr-1 bg-white/80 hover:bg-white shadow-sm"/>
                                                                        </div>
                                                                    </Carousel>
                                                                ) : (
                                                                    <div>
                                                                        <div
                                                                            className="flex items-center justify-center aspect-square p-6 text-center text-gray-500 text-sm">
                                                                            No hay imágenes disponibles.
                                                                        </div>

                                                                        <div
                                                                            className="py-2 text-center text-sm text-muted-foreground">
                                                                            <span>No hay imagenes</span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Información del proyecto con espaciado optimizado */}
                                                                <div className="p-3">
                                                                    <div
                                                                        className="flex items-center">

                                                                        {pro.link ? (
                                                                                <a
                                                                                    href={pro.link}
                                                                                    target={"_blank"}
                                                                                >
                                                                                    <h3 className="font-semibold text-blue-500 text-base">{pro.name}</h3>
                                                                                </a>

                                                                            ) :
                                                                            (
                                                                                <h3 className="font-semibold text-base">{pro.name}</h3>
                                                                            )
                                                                        }
                                                                        <div className="flex space-x-2 ml-auto">
                                                                            <button
                                                                                onClick={() => editInfoPro("projects", pro)}
                                                                                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                                                                            >
                                                                                <Pencil
                                                                                    className="h-4 w-4"/>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => removeSection(null, null, pro)}
                                                                                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                                                                            >
                                                                                <Trash
                                                                                    className="h-4 w-4"/>
                                                                            </button>
                                                                        </div>

                                                                    </div>

                                                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                                        {pro.description}
                                                                    </p>
                                                                    <div
                                                                        className="flex items-center mt-2 text-xs text-gray-500">
                                                                        <Clock className="h-3 w-3 mr-1 text-red-500"/>
                                                                        <span>Finalizado: {pro.end_project ? pro.end_project : "En progreso"}</span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </Card>
                                                    </div>
                                                ))}
                                            </div>
                                        ) :
                                        (
                                            <div
                                                className="py-8 text-center border border-dashed border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                                <p className="text-black">No hay proyectos
                                                    especificados</p>
                                                <button
                                                    onClick={() => openModalProjects()}
                                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    + Añadir proyecto
                                                </button>
                                            </div>
                                        )}


                                </Card>

                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>
            {/* Place the ConfirmDialog here, outside of any tabs */
            }
            <ConfirmDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                title="¿Estás seguro?"
                description={
                    isExperience
                        ? "Esta acción eliminará la experiencia permanentemente."
                        : projectsSelect
                            ? "Esta acción eliminará el proyecto permanentemente."
                            : "Esta acción eliminará el estudio permanentemente."
                }
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                confirmText="Continuar"
                cancelText="Cancelar"
                icon={<TriangleAlert className="text-yellow-500"/>}
            />
            {
                modalState && <ModalAddStudies
                    handleClose={handleCloseModal}
                    onSave={UpdateChange}
                    studentId={student.id}
                    initialData={currentStudy}
                    isEditing={isEditing}
                />
            },
            {
                modalProjects && <ModalAddProjects
                    handleClose={handleCloseProject}
                    onSave={UpdateChange}
                    studentId={student.id}
                    initialData={currentProject}
                    isEditing={isEditing}
                />
            },
            {
                modalExperience && <ModalAddExperience
                    handleClose={handleCloseExperience}
                    onSave={UpdateChange}
                    studentId={student.id}
                    initialData={currentExperience}
                    isEditing={isEditing}
                />
            }
        </>
    )
        ;

}