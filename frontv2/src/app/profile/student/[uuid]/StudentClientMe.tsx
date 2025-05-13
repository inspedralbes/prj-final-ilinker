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
    FolderCode,
    FolderTree,
    CalendarIcon,
    AlertCircle,
    Eye,
    RefreshCw,
    FileText,
    X,
    CreditCard,
    Briefcase, Loader2,
    Folders, ChevronLeft, ChevronRight
} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Avatar} from "@/components/ui/avatar";
import React, {useEffect, useState, useCallback, useContext, useMemo} from "react";
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
import config from "@/types/config";
import {AuthContext} from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import {Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import OfferModal from '@/app/profile/student/[uuid]/modals/showOfferModal'
import {SimpleEditor} from "@/components/templates/simple/SimpleEditor"
import "@/styles/tiptap-content.scss"
import {useModal} from "@/hooks/use-modal";
import Modal from "@/components/ui/modal";
import {useRouter} from "next/navigation";

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
    followers: number;
    surname: string;
    type_document: string;
    id_document: string;
    nationality: string;
    photo_pic: File | null;
    cover_photo: File | null;
    description: string | null;
    short_description: string | null;
    birthday: Date | undefined;
    gender: string;
    phone: string;
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

interface Follower {
    id: number;
    name: string;
    pivot: {
        follower_id: number;
    };
    isFollowed: boolean;

    [key: string]: any;
}

interface StudentClientMeProps {
    uuid: String;
    student: Student;
    experience_group: any;
    skills: any;
    offerUser: any;
    publications: any;
}

export default function StudentClientMe({
                                            uuid,
                                            student,
                                            experience_group,
                                            skills,
                                            offerUser,
                                            publications
                                        }: StudentClientMeProps) {

    const [studentEdit, setStudentEdit] = useState(student);
    const [experienceEdit, setExperienceEdit] = useState(experience_group);
    const [educationEdit, setEducationEdit] = useState(student.education);
    const [projectsEdit, setProjectEdit] = useState(student.projects);
    const [skillsEdit, setSkillsEdit] = useState(student.skills);
    const [userEdit, setUserEdit] = useState(student.user);
    const [offersEdit, setOfferEdit] = useState(offerUser);
    const [publicationsEdit, setPublicationsEdit] = useState(publications);

    const [allSkills, setAllSkills] = useState(skills);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isEditingModal, setIsEditingModal] = useState<boolean | undefined>(false);
    const [coverImage, setCoverImage] = useState("https://img.freepik.com/fotos-premium/fondo-tecnologico-purpura-elementos-codigo-e-iconos-escudo_272306-172.jpg?semt=ais_hybrid&w=740");
    const [logoImage, setLogoImage] = useState("https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png");
    const {userData, login, token} = useContext(AuthContext);

    const [modalState, setModalState] = useState(false);
    const [modalExperience, setModalExperience] = useState(false);
    const [modalProjects, setModalProjects] = useState(false);
    const [modalModeEdit, setModalModeEdit] = useState(false);
    const [modalOffer, setModalOffer] = useState(false);

    const [currentStudy, setCurrentStudy] = useState(null);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [currentProject, setCurrentProject] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);

    const [educationSelect, setEducationSelect] = useState<Education | null>(null);
    const [experinceSelect, setExperienceSelect] = useState<Experience | null>(null);
    const [projectsSelect, setProjectSelect] = useState<Project | null>(null);
    const [offerSelect, setOfferSelect] = useState(null);

    const [isExperience, setIsExperience] = useState(false);
    const [carouselStates, setCarouselStates] = useState<{ [key: number]: any }>({});
    const {showLoader, hideLoader} = useContext(LoaderContext);
    const animatedComponents = makeAnimated();
    const [openEndDate, setOpenEndDate] = useState<boolean>(false);
    const [nameLanguage, setNameLanguage] = useState("");
    const [error, setError] = useState("");
    const level = [
        {id: 1, name: 'Básico'},
        {id: 2, name: 'Intermedio'},
        {id: 3, name: 'Avanzado'},
        {id: 4, name: 'Nativo'}
    ];
    const [optionLevel, setOptionLevel] = useState<string[]>([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [imageChangeCount, setImageChangeCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState("all");
    const [isFiltering, setIsFiltering] = useState(false);
    const router = useRouter();

    const followersModal = useModal();

    const [studentFollowersAll, setStudentFollowersAll] = useState<Follower[]>([]);
    const [studentFollowers, setStudentFollowers] = useState<Follower[]>([]);
    const [isLoadingToggleFollwer, setIsLoadingToggleFollwer] = useState(false);
    const [searchFollowerQuery, setSearchFollowerQuery] = useState("");


    // Función para manejar el cambio de filtro
    const handleStatusFilterChange = (value: string) => {
        // Activar el loader
        setIsFiltering(true);

        // Actualizar el valor del filtro
        setStatusFilter(value);

        // Simular un tiempo de carga para el filtrado (puedes remover esto si tus datos se filtran instantáneamente)
        setTimeout(() => {
            // Desactivar el loader después del filtrado
            setIsFiltering(false);
        }, 800); // Simulación de tiempo de carga - ajustar según necesidades

    };

    const filteredOffers = useMemo(() => {
        if (!offersEdit) return [];
        if (statusFilter === "all") return offersEdit;

        return offersEdit.filter((application: any) => application.status === statusFilter);
    }, [offersEdit, statusFilter]);

    const handleOpenModalAddStudies = () => {
        setModalState(!modalState)
        setModalModeEdit(false)
        /*setIsEditing(false);*/
    }

    const openModalExperience = (experience: Experience | null) => {
        console.log(experience);
        setModalExperience(!modalExperience);
        setModalModeEdit(false);
        setIsEditingModal(false);
    }
    const openModalProjects = (project: Project | null) => {
        console.log(project);
        setModalProjects(!modalProjects);
        setModalModeEdit(false);
        setIsEditingModal(false);
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
        showLoader();
        const response = await apiRequest(`student/` + uuid);
        if (response.status === 'success') {
            setStudentEdit(response.student)
            setEducationEdit(response.student.education);
            setExperienceEdit(response.experience_grouped);
            setProjectEdit(response.student.projects);
            setUserEdit(response.student.user);
            setOfferEdit(response.offerUser);
            hideLoader();
        } else {
            hideLoader();
        }

    }

    const EditInfo = (section: string, education: any) => {

        setIsEditingModal(true);
        setCurrentStudy(education);

        setModalState(!modalState);
        setModalModeEdit(false);
    }

    const EditInfoExp = (section: string, exp: any) => {
        setIsEditingModal(true);
        setCurrentExperience(exp);

        setModalExperience(!modalExperience);
        setModalModeEdit(false);
    }

    const editInfoPro = (section: string, pro: any) => {
        setIsEditingModal(true);
        setCurrentProject(pro);

        setModalProjects(!modalProjects);
        setModalModeEdit(false);
    }

    const removeSection = (education: Education | null, experience: Experience | null, projects: Project | null) => {
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
            //const idSection = educationSelect ? educationSelect?.id : projectsSelect ? projectsSelect?.id : experinceSelect?.id;
            const idSection = educationSelect?.id ?? projectsSelect?.id ?? experinceSelect?.id;
            const response = await apiRequest(endpoint, 'DELETE', {id: idSection})

            if (response.status === 'success') {
                toast({
                    title: educationSelect ? "Estudio eliminado"
                        : projectsSelect ? "Proyecto eliminado"
                            : "Experiencia eliminada",
                    description:
                        educationSelect ? "Estudio eliminado correctamente"
                            : projectsSelect ? "Proyecto eliminado correctamente"
                                : "Experiencia eliminada correctamente",

                    variant: "default",
                    duration: 2000
                })
                hideLoader();
                await UpdateChange();
                login(token, userEdit, []);
                setOpenDialog(false);
                setIsExperience(false);
                educationSelect ? setEducationSelect(null) : projectsSelect ? setProjectSelect(null) : setExperienceSelect(null);
            } else {
                toast({
                    title: "Error al Eliminar",
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
    const pluginsRef = useRef<{ [key: number]: ReturnType<typeof Autoplay> }>({});

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

    const handleImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (type !== "photo_pic" && type !== "cover_photo") {
            console.error("Tipo incorrecto:", type);
            return;
        }

        console.log("Actualizando:", type, file);

        setStudentEdit((prev: any) => ({
            ...prev,
            [type]: file,
        }));

        setImageChangeCount((prev) => prev + 1); // Forzar cambio
    };


    const handleSave = async () => {
        showLoader();

        const formattedData = {
            ...studentEdit,
            birthday: studentEdit.birthday
                ? format(studentEdit.birthday, "dd/MM/yyyy")
                : null,
        };

        const formData = new FormData();

        formData.append('student', JSON.stringify(formattedData));
        formData.append('skills', JSON.stringify(skillsEdit));
        formData.append('user', JSON.stringify(userEdit));

        // Asegurarse de que los archivos se agreguen correctamente
        if (studentEdit?.photo_pic instanceof File) {
            formData.append("photo_pic", studentEdit.photo_pic);
        }

        if (studentEdit?.cover_photo instanceof File) {
            formData.append("cover_photo", studentEdit.cover_photo);
        }

        console.log("JSON A ENVIAR");
        console.table(Array.from(formData.entries()))

        try {

            const response = await apiRequest("student/update", "POST", formData);

            if (await response.status === 'success') {
                console.log(response);

                setIsEditing(null)
                await UpdateChange();
            } else {
                console.log("MAL")
            }
            hideLoader();
        } catch (e) {
            console.log(e)
            hideLoader();
        }

    }

    const handleCancelEdit = () => {
        setIsEditing(null)
    }

    // Función para comprobar si un idioma ya existe
    const languageExists = (languageName: string, excludeIndex = -1) => {
        const normalizedName = slugify(languageName);
        return parsedLanguages.some((language, index) => {
            // Saltamos la comprobación para el idioma que estamos editando
            if (index === excludeIndex) return false;

            // Comparamos con los nombres normalizados
            return slugify(language.language) === normalizedName;
        });
    };

    const addLanguage = () => {
        if (!nameLanguage.trim()) return;

        // Verificamos si el idioma ya existe (excepto si estamos editando el mismo)
        if (languageExists(nameLanguage, editingIndex)) {
            setError("Este idioma ya existe en la lista. Por favor, introduce un idioma diferente.");
            return;
        }

        if (optionLevel.length > 1) {
            setError("Solo se puede eligir un nivel")
            return;
        }

        setError("");

        const json = {
            "language": nameLanguage.trim(),
            "level": optionLevel[0]
        }

        if (editingIndex >= 0) {
            // Modo edición: actualizamos el idioma existente
            const updatedLanguages = [...parsedLanguages];
            updatedLanguages[editingIndex] = json;
            setStudentEdit({
                ...studentEdit,
                languages: JSON.stringify(updatedLanguages),
            });
            setEditingIndex(-1); // Salir del modo edición
        } else {
            parsedLanguages = [...parsedLanguages, json];
            // Modo añadir: agregamos un nuevo idioma
            setStudentEdit({
                ...studentEdit,
                languages: JSON.stringify(parsedLanguages),
            });
        }

        setNameLanguage("");
        setOptionLevel([])
    }

    // Función para eliminar un idioma
    const deleteLanguage = (index: number) => {
        const updatedLanguages = parsedLanguages.filter((_, idx) => idx !== index);
        setStudentEdit({
            ...studentEdit,
            languages: JSON.stringify(updatedLanguages),
        });

        // Si estábamos editando este idioma, salimos del modo edición
        if (editingIndex === index) {
            setEditingIndex(-1);
            setNameLanguage('');
            setOptionLevel([]);
        }
    };

    // Función para iniciar la edición de un idioma
    const startEditingLanguage = (index: number) => {
        const languageToEdit = parsedLanguages[index];
        setNameLanguage(languageToEdit.language);
        setOptionLevel([languageToEdit.level]);
        setEditingIndex(index);
    };

    // Función para cancelar la edición
    const cancelEditingLanguage = () => {
        setEditingIndex(-1);
        setNameLanguage('');
        setOptionLevel([]);
    };

    const showOffer = (offer: any) => {
        setOfferSelect(offer)
        setModalOffer(!modalOffer)
    }

    // Componente Loader simple
    const CardLoader = () => (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-black/80">
                <Loader2 className="w-6 h-6 animate-spin"/>
                <span className="text-sm">Cargando...</span>
            </div>
        </div>
    );

    const handleOpenModalFollowers = () => {
        showLoader();
        apiRequest(`followers`, 'POST', {
            user_id: studentEdit.user_id,
            me_id: userData?.id
        })
            .then((response) => {
                console.log(response);
                if (response.status === "success") {
                    setStudentFollowersAll(response.followers);
                    setStudentFollowers(response.followers);
                    followersModal.openModal();
                } else {
                    toast({
                        title: "Error",
                        description: "Error al obtener los seguidores.",
                        variant: "destructive",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Error al obtener los seguidores.",
                    variant: "destructive",
                });
            })
            .finally(() => {
                hideLoader();
            });
    };

    const handleSearchFollower = (query: string) => {
        setSearchFollowerQuery(query);
        const filteredFollowers = studentFollowersAll.filter((follower: any) => {
            return follower.name.toLowerCase().includes(query.toLowerCase());
        });
        setStudentFollowers(filteredFollowers);
    };

    const handleRedirectToFollowerProfile = (follower: any) => {
        showLoader();
        switch (follower.rol) {
            case "student":
                router.push(`/profile/student/${follower.student.uuid}`);
                break;
            case "company":
                router.push(`/profile/company/${follower.company.slug}`);
                break;
            case "institutions":
                router.push(`/profile/institution/${follower.institutions.slug}`);
                break;
        }
    };

    const handleUnfollow = (user_id: number) => {
        showLoader();
        setIsLoadingToggleFollwer(true);
        try {
            apiRequest(`unfollow/${user_id}`, "DELETE")
                .then((response) => {
                    console.log(response);
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                            duration: 5000,
                        });
                        setStudentFollowers(prev =>
                            prev.map(follower =>
                                follower.pivot.follower_id === user_id
                                    ? {...follower, isFollowed: false}
                                    : follower
                            )
                        );
                    } else {
                        toast({
                            title: "Error",
                            description: response.message,
                            variant: "destructive",
                            duration: 5000,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        title: "Error",
                        description: "Error al dejar de seguir a la empresa.",
                        variant: "destructive",
                        duration: 5000,
                    });
                })
                .finally(() => {
                    hideLoader();
                    setIsLoadingToggleFollwer(false);
                });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Error al dejar de seguir a la empresa.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            hideLoader();
        }
    };

    const handleFollow = (user_id: number) => {
        setIsLoadingToggleFollwer(true);
        showLoader();
        try {
            apiRequest("follow", "POST", {
                user_id: user_id,
            })
                .then((response) => {
                    console.log(response);
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                        });
                        setStudentFollowers(prev =>
                            prev.map(follower =>
                                follower.pivot.follower_id === user_id
                                    ? {...follower, isFollowed: true}
                                    : follower
                            )
                        );
                    } else if (response.status === "warning") {
                        toast({
                            title: "Advertencia",
                            description: response.message,
                            variant: "default",
                            duration: 5000,
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: response.message,
                            variant: "destructive",
                            duration: 5000,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast({
                        title: "Error",
                        description: "Error al seguir a la empresa.",
                        variant: "destructive",
                        duration: 5000,
                    });
                })
                .finally(() => {
                    hideLoader();
                    setIsLoadingToggleFollwer(false);
                });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Error al seguir a la empresa.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            hideLoader();
        }
    };

    const handleBlock = (user_id: number) => {
        showLoader();
        try {
            apiRequest('block', 'POST', {user_id})
                .then((response) => {
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                            duration: 5000,
                        });
                    } else if (response.status === "warning") {
                        toast({
                            title: "Advertencia",
                            description: response.message,
                            variant: "default",
                            duration: 5000,
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: response.message,
                            variant: "destructive",
                            duration: 5000,
                        });
                    }
                }).catch((error) => {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Error al bloquear a la empresa.",
                    variant: "destructive",
                    duration: 5000,
                });
            }).finally(() => {
                hideLoader();
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Error al bloquear a la empresa.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            hideLoader();
        }
    };


    useEffect(() => {
        handleSave();
    }, [imageChangeCount]);


    const updateDesStudent = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setStudentEdit((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Estados para controlar la paginación y la vista
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("list"); // "list" o "gallery"
    const [selectedPost, setSelectedPost] = useState(null);
    const postsPerPage = 5;

    // Calcular índices para la paginación
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    // Publicaciones para la página actual
    const currentPosts = publicationsEdit ? publicationsEdit.slice(indexOfFirstPost, indexOfLastPost) : [];

    // Calcular número total de páginas
    const totalPages = publicationsEdit ? Math.ceil(publicationsEdit.length / postsPerPage) : 0;

    // Extraer todas las imágenes para la vista de galería
    const galleryImages = publicationsEdit ? publicationsEdit.flatMap((post: any) =>
        post.media?.map((media: any) => ({
            id: `${post.id}-${media.id || Math.random()}`,
            postId: post.id,
            media: media,
            post: post
        })) || []
    ) : [];

    // Cambiar de página
    const goToPage = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    // Obtener números de página para la paginación
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Mostrar todos los números si hay pocas páginas
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Lógica para mostrar un subconjunto de números con elipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push("...");
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    // Formatear fecha relativa (2h, 5m, etc.)
    const getRelativeTime = (timestamp: any) => {
        // Implementar lógica real aquí
        return "2h";
    };


    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Cover Photo */}
                <div className="relative h-80 bg-gray-300">
                    <img
                        src={studentEdit?.cover_photo ? `${config.storageUrl + `students/covers/${studentEdit.uuid}/` + studentEdit.cover_photo}` : coverImage}
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
                                            src={studentEdit?.photo_pic ? `${config.storageUrl + `students/photos/${studentEdit.uuid}/` + studentEdit.photo_pic}` : logoImage}
                                            alt="photo_pic"
                                        />
                                        <label className="absolute bottom-2 right-2 cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'photo_pic')}
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
                                                    value={studentEdit.name}
                                                    onChange={(e) => setStudentEdit({
                                                        ...studentEdit,
                                                        name: e.target.value
                                                    })}
                                                    className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                                                />
                                                <input
                                                    type="text"
                                                    value={studentEdit.surname}
                                                    onChange={(e) => setStudentEdit({
                                                        ...studentEdit,
                                                        surname: e.target.value
                                                    })}
                                                    className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-5 w-5 text-gray-400"/>
                                                    <Input
                                                        type="text"
                                                        value={studentEdit.address}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            address: e.target.value
                                                        })}
                                                        className="text-gray-600 border rounded px-2 py-1 flex-1"
                                                    />
                                                </div>

                                                <div className="flex justify-content-start gap-4 mt-4">
                                                    <Button className="bg-gray-200 text-black hover:bg-gray-300"
                                                            onClick={handleCancelEdit}>Cancelar</Button>
                                                    <Button onClick={handleSave}>Guardar</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{studentEdit?.name || "No tenemos este dato"}</h1>
                                                <p className={`text-lg text-gray-600 ${!studentEdit?.surname ? 'hidden' : ''}`}>
                                                    {studentEdit?.surname}
                                                </p>
                                                <p className="text-gray-500 flex items-center mt-2">
                                                    <MapPin className="h-5 w-5 text-gray-400 mr-2"/>
                                                    {studentEdit?.address}
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

                                        <div
                                            onClick={() => handleOpenModalFollowers()}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                            {studentEdit?.followers}{" "}
                                            {studentEdit?.followers === 1
                                                ? "seguidor"
                                                : "seguidores"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Información de contacto
                                    </h2>
                                    <button
                                        onClick={() => handleEdit("basic-2")}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>
                                </div>
                                {isEditing === "basic-2" ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <Globe className="h-5 w-5 text-gray-400 mr-2"/>
                                                <Input
                                                    type="text"
                                                    name="website"
                                                    placeholder="Website de la compañia"
                                                    value={studentEdit.country}
                                                    onChange={(e) =>
                                                        setStudentEdit({
                                                            ...studentEdit,
                                                            country: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="h-5 w-5 text-gray-400 mr-2"/>
                                                <Input
                                                    type="text"
                                                    name="phone"
                                                    placeholder="Numero de la compañia"
                                                    value={studentEdit.phone}
                                                    onChange={(e) =>
                                                        setStudentEdit({
                                                            ...studentEdit,
                                                            phone: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <Mail className="h-5 w-5 text-gray-400 mr-2"/>
                                                <Input
                                                    type="email"
                                                    name="company_email"
                                                    placeholder="Email de la compañia"
                                                    value={userEdit.email || ""}
                                                    onChange={(e) =>
                                                        setUserEdit({
                                                            ...userEdit,
                                                            email: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-content-start gap-4 mt-4">
                                            <Button className="bg-gray-200 text-black hover:bg-gray-300"
                                                    onClick={handleCancelEdit}>Cancelar</Button>
                                            <Button onClick={handleSave}>Guardar</Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <Globe className="h-5 w-5 text-gray-400 mr-2"/>
                                            <a
                                                href={studentEdit?.country || ""}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {studentEdit?.country || "No hay website vinculada"}
                                            </a>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="h-5 w-5 text-gray-400 mr-2"/>
                                            <span className="text-gray-600">{studentEdit?.phone}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-gray-400 mr-2"/>
                                            <span
                                                className="text-gray-600">{studentEdit.user.email || "Sin dirección de correo"}</span>
                                        </div>
                                    </div>
                                )}
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
                                        <Textarea
                                            className="min-h-[150px]"
                                            value={studentEdit.short_description || ""}
                                            onChange={(e) =>
                                                updateDesStudent(
                                                    e as React.ChangeEvent<HTMLTextAreaElement>
                                                )
                                            }
                                            placeholder="Escribe la descripción..."
                                        />
                                        <div className="flex justify-content-start gap-4 mt-4">
                                            <Button className="bg-gray-200 text-black hover:bg-gray-300"
                                                    onClick={handleCancelEdit}>Cancelar</Button>
                                            <Button onClick={handleSave}>Guardar</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content"
                                    >
                                        <p style={{whiteSpace: 'pre-wrap'}}>{studentEdit.short_description || ""}</p>

                                    </div>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="acerca" className="w-full mt-5">
                            <TabsList
                                className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg flex flex-wrap overflow-x-auto"
                            >
                                <TabsTrigger
                                    value="acerca"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <UserIcon className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Acerca de</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="studies"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <BriefcaseIcon className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Mis Estudios</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="experience"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <BriefcaseBusiness className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Mi Experiencia</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="projects"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <FolderCode className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Mis Proyectos</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="offer"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <FolderTree className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Mis Ofertas</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="publications"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <Folders className="h-3 w-3 md:h-4 md:w-4"/>
                                    <span className="md:block">Mis Publicaciones</span>
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

                                                <SimpleEditor content={studentEdit.description || ""}
                                                              onChange={(html: string) => {
                                                                  if (studentEdit.description !== html) {
                                                                      setStudentEdit(prev => ({
                                                                          ...prev,
                                                                          description: html
                                                                      }));
                                                                  }
                                                              }}
                                                />
                                            </div>
                                        </>
                                    ) : (<>
                                        <div
                                            className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-o p-0"
                                            dangerouslySetInnerHTML={{__html: studentEdit.description || ''}}
                                        />

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
                                                            country: e.target.value
                                                        })}
                                                        placeholder="País"
                                                    />

                                                    <Input
                                                        value={studentEdit.city}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            city: e.target.value
                                                        })}
                                                        placeholder="Ciudad"
                                                    />

                                                    <Input
                                                        value={studentEdit.nationality}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            nationality: e.target.value
                                                        })}
                                                        placeholder="Nacionalidad"
                                                    />

                                                    <Input
                                                        value={studentEdit.address}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            address: e.target.value
                                                        })}
                                                        placeholder="Dirección"
                                                    />

                                                    <Input
                                                        value={studentEdit.postal_code}
                                                        onChange={(e) => setStudentEdit({
                                                            ...studentEdit,
                                                            postal_code: e.target.value
                                                        })}
                                                        placeholder="Codigo Postal"
                                                    />

                                                    <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
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
                                                                onSelect={(date) => {
                                                                    setStudentEdit({
                                                                        ...studentEdit,
                                                                        birthday: date
                                                                    });
                                                                    setOpenEndDate(false);
                                                                }}
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
                                                    <li><strong>Año de
                                                        nacimiento:</strong> {studentEdit.birthday ? format(studentEdit.birthday, "dd/MM/yyyy") : ""}
                                                    </li>
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
                                                        options={allSkills}
                                                        isSearchable
                                                        isMulti
                                                        value={skillsEdit}
                                                        placeholder="busca y selecciona..."
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id.toString()}
                                                        onChange={(selectedOption) => {
                                                            console.log(selectedOption);
                                                            setSkillsEdit([...selectedOption]);
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
                                                    <div>
                                                        {parsedLanguages.length > 0 ? (
                                                            <div className="flex flex-col gap-2 mb-4">
                                                                {parsedLanguages.map((lan, idx) => (
                                                                    <div key={idx}
                                                                         className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                                                                        <Badge
                                                                            className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md">
                                                                            {lan.language}
                                                                        </Badge>
                                                                        <span
                                                                            className="text-sm text-gray-600">{lan.level}</span>
                                                                        <div className="ml-auto flex gap-10">
                                                                            <button

                                                                                onClick={() => startEditingLanguage(idx)}
                                                                                className="text-blue-600 hover:text-blue-800"
                                                                            >
                                                                                <Pencil className="h-4 w-4"/>
                                                                            </button>
                                                                            <button

                                                                                onClick={() => deleteLanguage(idx)}
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <Trash className="h-4 w-4"/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span
                                                                className="text-gray-500 block mb-4">No especificado</span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-4 p-4 border rounded-lg">
                                                        <h3 className="font-medium">
                                                            {editingIndex >= 0 ? 'Editar idioma' : 'Añadir nuevo idioma'}
                                                        </h3>

                                                        {error && (
                                                            <div
                                                                className="flex items-center p-2 mb-2 bg-red-50 text-red-700 rounded border border-red-200">
                                                                <AlertCircle size={16} className="mr-2"/>
                                                                <span className="text-sm">{error}</span>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <Input
                                                                value={nameLanguage}
                                                                onChange={(e) => {
                                                                    setNameLanguage(e.target.value);
                                                                    setError(""); // Limpiar el error cuando el usuario empieza a escribir
                                                                }}
                                                                placeholder="Idioma"
                                                                className="w-full"
                                                            />

                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                components={animatedComponents}
                                                                options={level}
                                                                isSearchable
                                                                isMulti
                                                                placeholder="Nivel"
                                                                getOptionLabel={(option) => option.name}
                                                                getOptionValue={(option) => option.id.toString()}
                                                                value={level.filter(opt => optionLevel.includes(opt.name))}
                                                                onChange={(selectedOption) => {
                                                                    setOptionLevel(selectedOption.map((sel) => sel.name));
                                                                }}
                                                                className="w-full"
                                                            />
                                                        </div>

                                                        <div className="flex justify-end gap-2 mt-2">
                                                            {editingIndex >= 0 && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={cancelEditingLanguage}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                            )}
                                                            <Button
                                                                onClick={addLanguage}
                                                            >
                                                                {editingIndex >= 0 ? 'Actualizar' : 'Añadir'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (<>
                                                <div className="flex flex-wrap gap-2 text-gray-600">
                                                    {parsedLanguages.length > 0 ? (
                                                        <div className="flex flex-col gap-2 mb-4">
                                                            {parsedLanguages.map((lan, idx) => (
                                                                <div key={idx}
                                                                     className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                                                                    <Badge
                                                                        className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md">
                                                                        {lan.language}
                                                                    </Badge>
                                                                    <span
                                                                        className="text-sm text-gray-600">{lan.level}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className="text-gray-500 block mb-4">No especificado</span>
                                                    )}
                                                </div>
                                            </>)
                                            }
                                        </div>

                                    </div>
                                    {/* Botón Guardar */}
                                    {isEditing && (
                                        <>
                                            <div className="flex justify-end gap-4 mt-4">
                                                <Button className="bg-gray-200 text-black hover:bg-gray-300"
                                                        onClick={handleCancelEdit}>Cancelar</Button>
                                                <Button onClick={handleSave}>Guardar</Button>
                                            </div>
                                        </>
                                    )}
                                </Card>
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
                                                                                    href={`/profile/institution/${studies.institution?.slug}`}
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
                                                onClick={() => openModalExperience(null)}
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
                                                            onClick={() => openModalExperience(null)}
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
                                                onClick={() => openModalProjects(null)}
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
                                                                        onMouseLeave={() => pluginsRef?.current[pro.id].play}
                                                                        setApi={(api) => {
                                                                            updateCarouselState(pro.id, api);
                                                                        }}
                                                                    >
                                                                        <CarouselContent>
                                                                            {JSON.parse(pro.pictures).map((img: any, index: number) => (
                                                                                <CarouselItem key={index}>
                                                                                    <div className="p-1">
                                                                                        <Card
                                                                                            className="border-0 shadow-none">
                                                                                            <CardContent
                                                                                                className="flex aspect-square items-center justify-center p-4">
                                                                                                <img
                                                                                                    key={index}
                                                                                                    src={config.storageUrl + "projects/" + slugify(pro.name) + "/" + img}
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
                                                    onClick={() => openModalProjects(null)}
                                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    + Añadir proyecto
                                                </button>
                                            </div>
                                        )}


                                </Card>

                            </TabsContent>

                            <TabsContent value="offer" className="mt-6">
                                {/* Card contenedora con menos padding para aprovechar espacio */}
                                <Card className="p-6 mt-6 mb-6 relative">
                                    {/* Mostrar el loader en todas las cards cuando se está filtrando */}
                                    {isFiltering && <CardLoader/>}

                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold mb-4">Mis Solicitudes</h2>

                                        {/* Filtro de estado (opcional) */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Filtrar por:</span>
                                            <UISelect defaultValue="all"
                                                      onValueChange={handleStatusFilterChange}
                                                      value={statusFilter}>
                                                <SelectTrigger className="w-[150px] h-8 text-sm">
                                                    <SelectValue placeholder="Estado"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    <SelectItem value="pending">Pendiente</SelectItem>
                                                    <SelectItem value="accept">Aceptada</SelectItem>
                                                    <SelectItem value="rejected">Rechazada</SelectItem>
                                                </SelectContent>
                                            </UISelect>
                                        </div>
                                    </div>

                                    {filteredOffers ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredOffers.map((application: any) => {
                                                // Definir colores según el estado
                                                let statusColor = "";
                                                let statusBgColor = "";
                                                let statusText = "";

                                                switch (application.status) {
                                                    case "pending":
                                                        statusColor = "text-yellow-700";
                                                        statusBgColor = "bg-yellow-100";
                                                        statusText = "Pendiente";
                                                        break;
                                                    case "interview":
                                                        statusColor = "text-blue-700";
                                                        statusBgColor = "bg-blue-100";
                                                        statusText = "Entrevista";
                                                        break;
                                                    case "accept":
                                                        statusColor = "text-green-700";
                                                        statusBgColor = "bg-green-100";
                                                        statusText = "Aceptada";
                                                        break;
                                                    case "rejected":
                                                        statusColor = "text-red-700";
                                                        statusBgColor = "bg-red-100";
                                                        statusText = "Rechazada";
                                                        break;
                                                    default:
                                                        statusColor = "text-gray-700";
                                                        statusBgColor = "bg-gray-100";
                                                        statusText = "Desconocido";
                                                }

                                                return (

                                                    <Card key={application.id}
                                                          className="overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow relative">

                                                        {/* Barra de estado en la parte superior */}
                                                        <div
                                                            className={`${statusBgColor} p-2 flex justify-between items-center`}>
                                                            <span
                                                                className={`font-medium ${statusColor} text-sm`}>{statusText}</span>
                                                            <span
                                                                className="text-xs text-gray-600">{application.created_at ? format(application.created_at, "dd/MM/yyyy") : "Sin fecha"}</span>

                                                        </div>

                                                        <div className="p-4">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-semibold text-base">{application.offer.title}</h3>
                                                                </div>

                                                                <div className="flex space-x-1">
                                                                    <Button variant="ghost" size="icon"
                                                                            className="h-7 w-7"
                                                                            onClick={() => showOffer(application)}>
                                                                        <Eye className="h-4 w-4"/>
                                                                    </Button>

                                                                    <Button variant="ghost" size="icon"
                                                                            className="h-7 w-7"
                                                                            onClick={() => UpdateChange()}>
                                                                        <RefreshCw className="h-4 w-4"/>
                                                                    </Button>

                                                                </div>
                                                            </div>

                                                            <div className="mt-3 space-y-2">
                                                                <div
                                                                    className="flex items-center text-xs text-gray-600">
                                                                    <MapPin className="h-3.5 w-3.5 mr-1.5"/>
                                                                    <span>{application.offer.city}, {application.offer.postal_code}</span>
                                                                </div>

                                                                <div
                                                                    className="flex items-center text-xs text-gray-600">
                                                                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5"/>
                                                                    <span>Aplicada: {application.created_at ? format(application.created_at, "dd/MM/yyyy") : "Sin fecha"}</span>
                                                                </div>

                                                                {application.updated_at && (
                                                                    <div
                                                                        className="flex items-center text-xs text-gray-600">
                                                                        <Clock className="h-3.5 w-3.5 mr-1.5"/>
                                                                        <span>Última actualización: {application.updated_at ? format(application.updated_at, "dd/MM/yyyy") : "Sin fecha"}</span>
                                                                    </div>
                                                                )}

                                                                {application.availability ? (
                                                                        <div
                                                                            className="flex items-center text-xs text-gray-600">
                                                                            <Clock className="h-3.5 w-3.5 mr-1.5"/>
                                                                            <span>Disponibilidad: {application.availability}</span>
                                                                        </div>
                                                                    ) :
                                                                    (
                                                                        <div
                                                                            className="flex items-center text-xs text-gray-600">
                                                                            <Clock className="h-3.5 w-3.5 mr-1.5"/>
                                                                            <span>Disponibilidad: Sin información</span>
                                                                        </div>
                                                                    )}
                                                            </div>

                                                            {/* Indicadores de documentos adjuntos */}
                                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(application.cv_attachment || application.cover_letter_attachment) ? (
                                                                        <>
                                                                            {application.cv_attachment && (
                                                                                <a
                                                                                    href={
                                                                                        application.cv_attachment
                                                                                            ? config.storageUrl + application.cv_attachment
                                                                                            : "#"
                                                                                    }
                                                                                    target="_blank"
                                                                                    download={config.storageUrl + application.cv_attachment}
                                                                                >
                                                                                    <span
                                                                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center mr-1 hover:shadow-md transition-shadow">
                                                                                        <FileText
                                                                                            className="h-3 w-3 mr-1"/>
                                                                                        CV
                                                                                    </span>
                                                                                </a>
                                                                            )}
                                                                            {application.cover_letter_attachment && (
                                                                                <a
                                                                                    href={
                                                                                        application.cover_letter_attachment
                                                                                            ? config.storageUrl + application.cover_letter_attachment
                                                                                            : "#"
                                                                                    }
                                                                                    target="_blank"
                                                                                    download={config.storageUrl + application.cover_letter_attachment}
                                                                                >
                                                                                    <span
                                                                                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs flex items-center mr-1 hover:shadow-md transition-shadow">
                                                                                        <FileText
                                                                                            className="h-3 w-3 mr-1"/>
                                                                                        Carta
                                                                                    </span>
                                                                                </a>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span
                                                                            className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs flex items-center">
                                                                            Sin adjuntos
                                                                        </span>
                                                                    )}

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div
                                            className="py-8 text-center border border-dashed border-black rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                            <p className="text-black">No te has inscrito a ninguna oferta todavía</p>
                                            <Link href="/search"
                                                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Ver ofertas disponibles
                                            </Link>
                                        </div>
                                    )}

                                    {/*/!* Paginación (opcional) *!/*/}
                                    {/*{offerUser && offerUser.length > 0 && (*/}
                                    {/*    <div className="flex justify-center mt-6">*/}
                                    {/*        <div className="flex items-center space-x-2">*/}
                                    {/*            <Button variant="outline" size="sm" disabled={currentPage === 1}>*/}
                                    {/*                <ChevronLeft className="h-4 w-4" />*/}
                                    {/*            </Button>*/}
                                    {/*            <span className="text-sm">Página {currentPage} de {totalPages}</span>*/}
                                    {/*            <Button variant="outline" size="sm" disabled={currentPage === totalPages}>*/}
                                    {/*                <ChevronRight className="h-4 w-4" />*/}
                                    {/*            </Button>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*)}*/}
                                </Card>

                            </TabsContent>

                            <TabsContent value="publications" className="mt-6 space-y-4">
                                {/* Selector de vista */}
                                <div className="flex justify-end mb-4">
                                    <div className="inline-flex rounded-md shadow-sm" role="group">
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${
                                                viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
                                            }`}
                                            onClick={() => setViewMode("list")}
                                        >
                                            Lista
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${
                                                viewMode === "gallery" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
                                            }`}
                                            onClick={() => setViewMode("gallery")}
                                        >
                                            Galería
                                        </button>
                                    </div>
                                </div>

                                <Card className="p-6 mt-2 mb-6 relative">
                                    {publicationsEdit && publicationsEdit.length > 0 ? (
                                        <>
                                            {/* Vista de lista */}
                                            {viewMode === "list" && (
                                                <div className="space-y-4">
                                                    {currentPosts.map((post) => (
                                                        <Card key={post.id} className="p-6">
                                                            <div className="flex gap-4">
                                                                <Avatar className="h-12 w-12">
                                                                    <img
                                                                        src={studentEdit?.photo_pic ? `${config.storageUrl}students/photos/${studentEdit.uuid}/${studentEdit.photo_pic}` : logoImage}
                                                                        alt="Author"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h3 className="font-semibold">{post.user_details?.name}</h3>
                                                                        </div>
                                                                        <span className="text-sm text-gray-500">{getRelativeTime(post.created_at)}</span>
                                                                    </div>
                                                                    <p className="mt-2 text-gray-600">
                                                                        {post.content}
                                                                    </p>

                                                                    {post.media && post.media.length > 0 ? (
                                                                        <div className="mt-4 bg-gray-100 rounded-lg overflow-hidden">
                                                                            {post.media.length === 1 ? (
                                                                                // Una sola imagen
                                                                                <div className="aspect-video relative">
                                                                                    <Image
                                                                                        src={post.media[0].file_path}
                                                                                        alt={post.media[0].media_type}
                                                                                        width={640}
                                                                                        height={360}
                                                                                        layout="responsive"
                                                                                        objectFit="cover"
                                                                                        className="rounded-lg"
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                // Múltiples imágenes
                                                                                <div className="grid grid-cols-2 gap-1">
                                                                                    {post.media.slice(0, 4).map((picture, index) => (
                                                                                        <div key={picture.id} className={`aspect-square relative ${post.media.length === 3 && index === 0 ? "col-span-2" : ""}`}>
                                                                                            <Image
                                                                                                src={picture.file_path}
                                                                                                alt={picture.media_type}
                                                                                                width={300}
                                                                                                height={300}
                                                                                                layout="responsive"
                                                                                                objectFit="cover"
                                                                                                className="rounded-lg"
                                                                                            />
                                                                                            {/* Indicador de más imágenes */}
                                                                                            {index === 3 && post.media.length > 4 && (
                                                                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-lg">
                                                                                                    <span className="text-xl font-bold">+{post.media.length - 4}</span>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Vista de galería */}
                                            {viewMode === "gallery" && (
                                                <div className="grid grid-cols-3 gap-1">
                                                    {galleryImages.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="relative aspect-square overflow-hidden cursor-pointer"
                                                            onClick={() => setSelectedPost(item.post)}
                                                        >
                                                            <Image
                                                                src={item.media.file_path}
                                                                alt="Contenido de la publicación"
                                                                width={300}
                                                                height={300}
                                                                layout="responsive"
                                                                objectFit="cover"
                                                            />

                                                            {/* Overlay al hacer hover con likes y comentarios */}
                                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                                                <div className="flex gap-6">
                                                                    <div className="flex items-center">
                                                                        <span className="text-xl">❤️</span>
                                                                        <span className="ml-2">{item.post.likes_count || 78}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <span className="text-xl">💬</span>
                                                                        <span className="ml-2">{item.post.comments_count || 29}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Paginación */}
                                            {totalPages > 1 && viewMode === "list" && (
                                                <div className="mt-6 flex justify-center items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => goToPage(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                        size="sm"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>

                                                    {getPageNumbers().map((pageNumber, index) => (
                                                        <React.Fragment key={index}>
                                                            {pageNumber === "..." ? (
                                                                <span className="px-2">...</span>
                                                            ) : (
                                                                <Button
                                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                                    onClick={() => goToPage(pageNumber)}
                                                                    size="sm"
                                                                >
                                                                    {pageNumber}
                                                                </Button>
                                                            )}
                                                        </React.Fragment>
                                                    ))}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                                                        disabled={currentPage === totalPages}
                                                        size="sm"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            No hay publicaciones disponibles
                                        </div>
                                    )}
                                </Card>

                                {/* Modal para ver publicación detallada */}
                                {selectedPost && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                                        onClick={() => setSelectedPost(null)}
                                    >
                                        <div
                                            className="bg-white max-w-4xl w-full flex h-3/4 rounded-md overflow-hidden"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {/* Lado izquierdo - Imagen */}
                                            <div className="w-7/12 bg-black flex items-center justify-center">
                                                {selectedPost?.media && selectedPost?.media.length > 0 && (
                                                    <img
                                                        src={selectedPost?.media[0].file_path}
                                                        alt="Contenido de la publicación"
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                )}
                                            </div>

                                            {/* Lado derecho - Comentarios */}
                                            <div className="w-5/12 flex flex-col h-full">
                                                {/* Cabecera */}
                                                <div className="flex items-center p-4 border-b">
                                                    <Avatar className="h-8 w-8">
                                                        <img
                                                            src={studentEdit?.photo_pic
                                                                ? `${config.storageUrl}students/photos/${studentEdit.uuid}/${studentEdit.photo_pic}`
                                                                : logoImage}
                                                            alt="Author"
                                                            className="h-full w-full object-cover rounded-full"
                                                        />
                                                    </Avatar>
                                                    <div className="ml-3 font-semibold">{selectedPost.user_details?.name}</div>
                                                </div>

                                                {/* Área de comentarios */}
                                                <div className="flex-1 overflow-y-auto p-4">
                                                    <div className="flex mb-4">
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <img
                                                                src={studentEdit?.photo_pic
                                                                    ? `${config.storageUrl}students/photos/${studentEdit.uuid}/${studentEdit.photo_pic}`
                                                                    : logoImage}
                                                                alt="Author"
                                                                className="h-full w-full object-cover rounded-full"
                                                            />
                                                        </Avatar>
                                                        <div className="ml-3">
                                                            <span className="font-semibold mr-2">{selectedPost.user_details?.name}</span>
                                                            <span>{selectedPost.content}</span>
                                                        </div>
                                                    </div>

                                                    {/* Comentarios de ejemplo */}
                                                    {selectedPost.comments && selectedPost.comments.length > 0 ? (
                                                        selectedPost.comments.map(comment => (
                                                            <div key={comment.id} className="flex mb-4">
                                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                                    <img
                                                                        src={comment.user?.photo_pic
                                                                            ? `${config.storageUrl}users/photos/${comment.user.uuid}/${comment.user.photo_pic}`
                                                                            : logoImage}
                                                                        alt="Commenter"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="ml-3">
                                                                    <span className="font-semibold mr-2">{comment.user?.name}</span>
                                                                    <span>{comment.content}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="flex mb-4">
                                                            <div className="text-gray-500 text-sm">Todavía no hay comentarios</div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Barra de likes */}
                                                <div className="p-4 border-t">
                                                    <div className="flex mb-2">
                                                        <button className="text-2xl mr-4">❤️</button>
                                                        <button className="text-2xl mr-4">💬</button>
                                                        <button className="text-2xl">📤</button>
                                                    </div>
                                                    <div className="font-semibold">{selectedPost.likes_count || 0} likes</div>
                                                    <div className="text-xs text-gray-500 mt-1">{getRelativeTime(selectedPost.created_at)}</div>
                                                </div>

                                                {/* Input de comentario */}
                                                <div className="p-4 border-t">
                                                    <input
                                                        type="text"
                                                        placeholder="Agrega un comentario..."
                                                        className="w-full outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                    isEditing={isEditingModal}
                />
            }
            ,
            {
                modalProjects && <ModalAddProjects
                    handleClose={handleCloseProject}
                    onSave={UpdateChange}
                    studentId={student.id}
                    initialData={currentProject}
                    isEditing={isEditingModal}
                />
            }
            ,
            {
                modalExperience && <ModalAddExperience
                    handleClose={handleCloseExperience}
                    onSave={UpdateChange}
                    studentId={student.id}
                    initialData={currentExperience}
                    isEditing={isEditingModal}
                />
            }
            {
                modalOffer && (
                    <OfferModal
                        application={offerSelect}
                        onClose={() => setModalOffer(false)}
                    />
                )
            }

            <Modal
                isOpen={followersModal.isOpen}
                onClose={followersModal.closeModal}
                id="followers-modal"
                size="lg"
                title={`Seguidores de ${studentEdit.name}`}
                closeOnOutsideClick={false}
            >
                <div className="flex flex-col space-y-4 p-5">
                    <p className="text-gray-600">Lista de seguidores de la
                        empresa</p>
                    <Input
                        placeholder="Buscar seguidores..."
                        value={searchFollowerQuery}
                        onChange={(e) => handleSearchFollower(e.target.value)}
                    />
                    <div className="flex flex-col space-y-4">
                        {studentFollowers?.map((follower: any) => (
                            <div
                                key={follower.id}
                                className="flex items-center justify-between space-x-2 cursor-pointer"
                                onClick={() => handleRedirectToFollowerProfile(follower)}
                            >
                                <div className="flex items-center space-x-2">
                                    <img
                                        className="w-12 h-12 rounded-full"
                                        src={
                                            follower.student
                                                ? follower.student.profile_pic
                                                : follower.company
                                                    ? follower.company.logo
                                                    : follower.institutions?.logo
                                        }
                                        alt={
                                            follower.student
                                                ? follower.student.name
                                                : follower.company
                                                    ? follower.company.name
                                                    : follower.institutions?.name
                                        }
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {follower.student
                                                ? follower.student.name
                                                : follower.company
                                                    ? follower.company.name
                                                    : follower.institutions?.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {follower.student
                                                ? follower.email
                                                : follower.company
                                                    ? follower.company.email
                                                    : follower.institutions?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Follow/Unfollow toggle */}
                                    <Button
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            follower.isFollowed
                                                ? handleUnfollow(follower.pivot.follower_id)
                                                : handleFollow(follower.pivot.follower_id);
                                        }}
                                        className="flex items-center space-x-2"
                                    >
                                        {isLoadingToggleFollwer ? (
                                            <>
                                                <Loader2 className="animate-spin"/>
                                                <span>Cargando...</span>
                                            </>
                                        ) : follower.isFollowed ? (
                                            <>
                                                <span>Dejar de seguir</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Seguir tambien</span>
                                            </>
                                        )}
                                    </Button>

                                    {/* Block button */}
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBlock(follower.pivot.follower_id);
                                        }}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                                    >
                                        <span>Bloquear</span>
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Sólo si companyFollowers existe y length === 0 */}
                        {studentFollowers && studentFollowers.length === 0 && (
                            <p className="text-gray-600">No hay seguidores</p>
                        )}

                        {/* Si quieres cubrir también el caso undefined/null */}
                        {!studentFollowers && (
                            <p className="text-gray-600">No hay seguidores</p>
                        )}
                    </div>
                </div>
            </Modal>
        </>

    )
        ;

}