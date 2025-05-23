"use client"

import {
    BriefcaseBusiness,
    BriefcaseIcon, Building, Clock, FolderCode,
    Globe, Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Pencil,
    Phone,
    Share2, Trash,
    UserIcon, UserMinus, UserPlus, Folders,
    Eye,
    Heart,
    ChevronLeft,
    ChevronRight,
    Flag,
    AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Avatar } from "@/components/ui/avatar";
import React, { useState, useRef, useContext } from "react";
import Image from "next/image";
import Link from "next/link"
import config from "@/types/config";
import { format, formatDistanceToNow } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { apiRequest } from "@/services/requests/apiRequest";
import { LoaderContext } from "@/contexts/LoaderContext";
import { toast } from "@/hooks/use-toast";
import { AuthContext } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";
import ShowPublication from "./modals/showPublication";
import { Textarea } from "@/components/ui/textarea";




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
    photo_pic: string | null;
    cover_photo: string | null;
    description: string | null;
    short_description: string | null;
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
    student: Student;
    experience_group: any;
    publications: any;
}

export default function StudentClientNotMe({ student, experience_group, publications }: StudentClientMeProps) {


    const [studentEdit, setStudentEdit] = useState(student);
    const [experienceEdit, setExperienceEdit] = useState(experience_group);
    const [educationEdit, setEducationEdit] = useState(student.education);
    const [projectsEdit, setProjectEdit] = useState(student.projects);
    const [skillsEdit, setSkillsEdit] = useState(student.skills);
    const [userEdit, setUserEdit] = useState(student.user);
    const [publicationsEdit, setPublicationsEdit] = useState(publications);


    const [isEditing, setIsEditing] = useState(null);
    const [coverImage, setCoverImage] = useState("https://img.freepik.com/fotos-premium/fondo-tecnologico-purpura-elementos-codigo-e-iconos-escudo_272306-172.jpg?semt=ais_hybrid&w=740");
    const [logoImage, setLogoImage] = useState("https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png");
    const [carouselStates, setCarouselStates] = useState<{ [key: number]: any }>({});


    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);

    const { showLoader, hideLoader } = useContext(LoaderContext);
    const { userData, login, token } = useContext(AuthContext);

    const [modalPubli, setModalPubli] = useState(false);

    const followersModal = useModal();
    const router = useRouter();

    const reportModal = useModal();
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);

    const handleReportUser = () => {
        if (!reportReason.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa un motivo para el reporte",
                variant: "destructive",
            });
            return;
        }

        setIsReporting(true);
        showLoader();

        apiRequest("report-user", "POST", {
            reported_user_id: studentEdit.user_id,
            reason: reportReason,
        })
            .then((response) => {
                if (response.status === "success") {
                    toast({
                        title: "Reporte enviado",
                        description: "Gracias por reportar este usuario. Revisaremos tu reporte pronto.",
                        variant: "success",
                    });
                    reportModal.closeModal();
                    setReportReason("");
                } else {
                    toast({
                        title: "Error",
                        description: response.message || "Error al enviar el reporte",
                        variant: "destructive",
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Ocurrió un error al enviar el reporte",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsReporting(false);
                hideLoader();
            });
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

    // Referencia para los plugins
    const pluginsRef = useRef<{ [key: number]: ReturnType<typeof Autoplay> }>({});

    // Crear una instancia del plugin Autoplay para cada proyecto
    projectsEdit.forEach((pro) => {
        if (!pluginsRef.current[pro.id]) {
            pluginsRef.current[pro.id] = Autoplay({ delay: 3000, stopOnMouseEnter: true });
        }
    });

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


    const renderLocationType = (locationType: string) => {
        switch (locationType) {
            case 'remoto':
                return (
                    <span className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Remoto
                    </span>
                );
            case 'presencial':
                return (
                    <span className="flex items-center text-sm text-gray-500">
                        <Building className="h-3 w-3 mr-1" />
                        Presencial
                    </span>
                );
            case 'hibrido':
                return (
                    <span className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Híbrido
                    </span>
                );
            default:
                return null;
        }
    }

    const handleUnfollowCompany = (user_id: number) => {
        showLoader();
        setIsFollowingLoading(true);
        try {
            apiRequest(`unfollow/${user_id}`, "DELETE")
                .then((response) => {
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                            duration: 5000,
                        });
                        setStudentEdit((prev: any) => ({
                            ...prev,
                            followers: prev.followers - 1,
                        }));
                        setIsFollowing(false);
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
                    toast({
                        title: "Error",
                        description: "Error al dejar de seguir a la empresa.",
                        variant: "destructive",
                        duration: 5000,
                    });
                })
                .finally(() => {
                    hideLoader();
                    setIsFollowingLoading(false);
                });
        } catch (error) {
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

    const [studentFollowersAll, setStudentFollowersAll] = useState<Follower[]>(
        []
    );
    const [studentFollowers, setStudentFollowers] = useState<Follower[]>([]);
    const [searchFollowerQuery, setSearchFollowerQuery] = useState("");
    const [isLoadingToggleFollwer, setIsLoadingToggleFollwer] = useState(false);

    const handleOpenModalFollowers = () => {
        showLoader();

        apiRequest(`followers`, "POST", {
            user_id: studentEdit.user_id,
            me_id: userData?.id,
        })
            .then((response) => {
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

    const handleFollowCompany = (user_id: number) => {
        showLoader();
        setIsFollowingLoading(true);
        try {
            apiRequest("follow", "POST", {
                user_id,
            })
                .then((response) => {
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                        });
                        setStudentEdit((prev: any) => ({
                            ...prev,
                            followers: prev.followers + 1,
                        }));
                        setIsFollowing(true);
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
                    toast({
                        title: "Error",
                        description: "Error al seguir a la empresa.",
                        variant: "destructive",
                        duration: 5000,
                    });
                })
                .finally(() => {
                    hideLoader();
                    setIsFollowingLoading(false);
                });
        } catch (error) {
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
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                            duration: 5000,
                        });
                        setStudentFollowers((prev) =>
                            prev.map((follower) =>
                                follower.pivot.follower_id === user_id
                                    ? { ...follower, isFollowed: false }
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
                    if (response.status === "success") {
                        toast({
                            title: "Exito",
                            description: response.message,
                            variant: "success",
                        });
                        setStudentFollowers((prev) =>
                            prev.map((follower) =>
                                follower.pivot.follower_id === user_id
                                    ? { ...follower, isFollowed: true }
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
            apiRequest("block", "POST", { user_id })
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
                })
                .catch((error) => {
                    toast({
                        title: "Error",
                        description: "Error al bloquear a la empresa.",
                        variant: "destructive",
                        duration: 5000,
                    });
                })
                .finally(() => {
                    hideLoader();
                });
        } catch (error) {
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

    // Estados para controlar la paginación y la vista
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("list"); // "list" o "gallery"
    const [selectedPost, setSelectedPost] = useState(null);
    const postsPerPage = 5;

    // Calcular índices para la paginación
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    // Publicaciones para la página actual                         //Num PRINCIPIO   //Num Final
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

    const selectPost = (post: any) => {
        setSelectedPost(post);
        setModalPubli(true);
    }

    const UpdatePublication = async () => {
        showLoader();
        const response = await apiRequest('my-publications', 'POST', { id: student?.user_id });
        if (response.status === 'success') {
            setPublicationsEdit(response.data)
            hideLoader();
        } else {
            hideLoader();
        }

    }
    



    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Cover Photo */}
                <div className="relative h-80 bg-gray-300">
                    <img
                        src={studentEdit?.cover_photo ? `${config.storageUrl + studentEdit.cover_photo}` : coverImage}
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
                                            src={studentEdit?.photo_pic ? `${config.storageUrl + studentEdit.photo_pic}` : logoImage}
                                            alt="photo_pic"
                                        />
                                    </div>
                                    <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">

                                        <div>
                                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{studentEdit?.name + " " + studentEdit.surname || "No tenemos este dato"}</h1>
                                            <p className={`text-lg text-gray-600 ${!studentEdit?.name ? 'hidden' : ''}`}>
                                                {studentEdit?.name}
                                            </p>
                                            <p className="text-gray-500 flex items-center mt-2">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                                {studentEdit?.address}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                                <div className="mt-5 flex justify-center sm:mt-0">
                                    <div className="flex space-x-2">
                                        <button
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                                            Contactar
                                        </button>

                                        {/* Botón de Seguir */}
                                        <button
                                            onClick={() =>
                                                isFollowing
                                                    ? handleUnfollowCompany(studentEdit?.user_id)
                                                    : handleFollowCompany(studentEdit?.user_id)
                                            }
                                            disabled={isFollowingLoading}
                                            className={`group inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white ${isFollowingLoading || isFollowing
                                                ? "bg-gray-400 border-gray-400"
                                                : "bg-black border-black hover:bg-gray-800 transition-colors duration-300"
                                                }`}
                                        >
                                            {isFollowingLoading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Cargando...
                                                </>
                                            ) : isFollowing ? (
                                                // Cuando ya sigues, cambiamos texto e icono al hacer hover
                                                <>
                                                    <span className="flex items-center space-x-2">
                                                        <span className="block group-hover:hidden">
                                                            Siguiendo
                                                        </span>
                                                        <span className="hidden group-hover:block">
                                                            Dejar de seguir
                                                        </span>
                                                        <UserPlus className="h-5 w-5 group-hover:hidden ml-2" />
                                                        <UserMinus className="h-5 w-5 hidden group-hover:block ml-2" />
                                                    </span>
                                                </>
                                            ) : (
                                                // Cuando no sigues
                                                <>
                                                    <span className="flex items-center space-x-2">
                                                        <span>Seguir</span>
                                                        <UserPlus className="h-5 w-5 ml-2" />
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        {/* Followers count */}
                                        <div
                                            onClick={() => handleOpenModalFollowers()}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer"
                                        >
                                            {studentEdit?.followers}{" "}
                                            {studentEdit?.followers === 1
                                                ? "seguidor"
                                                : "seguidores"}
                                        </div>
                                        <button
                                            onClick={reportModal.openModal}
                                            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <Flag className="h-5 w-5  text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Información de contacto
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center">
                                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                                        <a
                                            href={studentEdit?.country || ""}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {studentEdit?.country || "No hay website vinculada"}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-gray-600">{studentEdit?.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                        <span
                                            className="text-gray-600">{studentEdit.user.email || "Sin dirección de correo"}</span>
                                    </div>
                                </div>

                            </div>

                            {/* About Section */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
                                </div>

                                <div
                                    className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content"
                                >
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{studentEdit.short_description || ""}</p>

                                </div>
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
                                    <UserIcon className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="md:block">Acerca de</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="studies"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <BriefcaseIcon className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="md:block">Estudios</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="experience"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <BriefcaseBusiness className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="md:block">Experiencia</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="projects"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <FolderCode className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="md:block">Proyectos</span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="publications"
                                    className="flex items-center gap-1 px-3 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent whitespace-nowrap text-sm"
                                >
                                    <Folders className="h-3 w-3 md:h-4 md:w-4" />
                                    <span className="md:block">Publicaciones</span>
                                </TabsTrigger>

                            </TabsList>

                            <TabsContent value="acerca" className="mt-6">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-4">

                                        <h2 className="text-xl font-semibold mb-4">Acerca de {studentEdit.name}</h2>
                                    </div>

                                    <>
                                        <div
                                            className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-o p-0"
                                            dangerouslySetInnerHTML={{ __html: studentEdit.description || '' }}
                                        />

                                    </>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Información General */}
                                        <div className="">
                                            <h3 className="font-semibold mb-2">Información general</h3>

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

                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Especialidades</h3>

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

                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-2">Idiomas</h3>

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

                            <TabsContent value="studies" className="mt-6 space-y-4">
                                <Card className="p-6 mt-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold mb-4">Estudios de {studentEdit.name}</h2>
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
                                                                                        </div>

                                                                                        <div
                                                                                            className="mt-2 flex flex-wrap gap-3">
                                                                                            <span
                                                                                                className="flex items-center text-sm text-gray-500">
                                                                                                <Clock
                                                                                                    className="h-3 w-3 mr-1" />
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
                                                                        onMouseLeave={() => pluginsRef.current[pro.id].play}
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
                                                                                className="h-7 w-7 ml-1 bg-white/80 hover:bg-white shadow-sm" />
                                                                        </div>
                                                                        <div
                                                                            className="absolute inset-y-0 right-0 flex items-center">
                                                                            <CarouselNext
                                                                                className="h-7 w-7 mr-1 bg-white/80 hover:bg-white shadow-sm" />
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
                                                                    </div>

                                                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                                                        {pro.description}
                                                                    </p>
                                                                    <div
                                                                        className="flex items-center mt-2 text-xs text-gray-500">
                                                                        <Clock className="h-3 w-3 mr-1 text-red-500" />
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
                                            </div>
                                        )}
                                </Card>

                            </TabsContent>

                            <TabsContent value="publications" className="mt-6 space-y-4">
                                {/* Selector de vista */}
                                <div className="flex justify-end mb-4">
                                    <div className="inline-flex rounded-md shadow-sm" role="group">
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
                                                }`}
                                            onClick={() => setViewMode("list")}
                                        >
                                            Lista
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${viewMode === "gallery" ? "bg-gray-100 text-gray-900" : "bg-white text-gray-500"
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
                                                    {currentPosts.map((post: any) => (
                                                        <Card key={post.id} className="p-6">
                                                            <div className="flex gap-4">
                                                                <Avatar className="h-12 w-12">
                                                                    <img
                                                                        src={studentEdit?.photo_pic ? `${config.storageUrl}${studentEdit.photo_pic}` : logoImage}
                                                                        alt="Author"
                                                                        className="h-full w-full object-cover rounded-full"
                                                                    />
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h3 className="font-semibold">{post.user_details?.name}</h3>
                                                                        </div>
                                                                        <div
                                                                            className="flex items-center gap-5 text-sm text-gray-500">
                                                                            <span> {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}</span>
                                                                            <button
                                                                                onClick={() => selectPost(post)}
                                                                            >
                                                                                <Eye className="h-5 w-5 text-black" />
                                                                            </button>
                                                                        </div>

                                                                    </div>

                                                                    <p className="mt-2 text-gray-600">{post.content}</p>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Vista de galería */}
                                            {viewMode === "gallery" && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                                                    {galleryImages.map((item: any) => (
                                                        <Card
                                                            key={item.id}
                                                            className="relative aspect-square overflow-hidden cursor-pointer flex items-center justify-center"
                                                            onClick={() => selectPost(item.post)}
                                                        >
                                                            <Image
                                                                src={item.media.file_path}
                                                                alt="Contenido de la publicación"
                                                                width={300}
                                                                height={300}
                                                                layout="responsive"
                                                                objectFit="cover"
                                                                objectPosition="center"
                                                            />

                                                            {/* Overlay al hacer hover con likes y comentarios */}
                                                            <div
                                                                className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                                                <div className="flex gap-6">
                                                                    <div className="flex items-center">
                                                                        <Heart className="h-5 w-5" />
                                                                        <span
                                                                            className="ml-2">{item.post.likes_count || 0}</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <MessageCircle className="h-5 w-5" />
                                                                        <span
                                                                            className="ml-2">{item.post.comments_count || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>
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

                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>

            {
                modalPubli && (
                    <ShowPublication
                        publication={selectedPost}
                        onClose={() => setModalPubli(false)}
                        onSave={() => { UpdatePublication() }}
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
                    <p className="text-gray-600">Lista de seguidores de la empresa</p>
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

                                {follower.pivot.follower_id !== userData?.id && (
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
                                                    <Loader2 className="animate-spin" />
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
                                )}
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

            {/* Modal de reporte */}
            <Modal
                isOpen={reportModal.isOpen}
                onClose={reportModal.closeModal}
                id="report-modal"
                size="md"
                title={`Reportar a ${student.name}`}
                closeOnOutsideClick={true}
            >
                <div className="flex flex-col space-y-4 p-5">
                    <div className="flex items-start space-x-3 bg-yellow-50 p-3 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="text-sm text-yellow-800">
                                Por favor, proporciona detalles sobre el problema que has encontrado con este usuario.
                                Revisaremos tu reporte y tomaremos las medidas necesarias.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Motivo del reporte</label>
                        <Textarea
                            value={reportReason}
                            onChange={(e:any) => setReportReason(e.target.value)}
                            placeholder="Describe el motivo de tu reporte..."
                            rows={5}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={reportModal.closeModal}
                            disabled={isReporting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReportUser}
                            disabled={isReporting || !reportReason.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isReporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar reporte"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>

        </>
    );



}