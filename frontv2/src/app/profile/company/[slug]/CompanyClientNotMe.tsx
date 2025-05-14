"use client";

import React, { use, useContext, useEffect, useState } from "react";
import {
  BriefcaseIcon,
  Camera,
  Globe,
  HomeIcon,
  Mail,
  MapPin,
  MessageCircle,
  NewspaperIcon,
  Pencil,
  Phone,
  Share2,
  UserIcon,
  UsersIcon,
  Building2,
  Clock,
  BookmarkPlus,
  GraduationCap,
  X,
  Inbox,
  Users,
  CheckCircle,
  FileSignature,
  FileText,
  Calendar,
  BookmarkCheck,
  UserPlus,
  Loader2,
  UserMinus,
  Home,
  CalendarDays,
  Banknote,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import ModalOffer from "@/app/profile/company/[slug]/ModalOffer";
import { LoaderContext } from "@/contexts/LoaderContext";
import Link from "next/link";
import { apiRequest } from "@/services/requests/apiRequest";
import { useRouter } from "next/navigation";
import config from "@/types/config";
import Modal from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/tiptap-content.scss";

interface Follower {
  id: number;
  name: string;
  pivot: {
    follower_id: number;
  };
  isFollowed: boolean;
  [key: string]: any;
}

export default function CompanyClientNotMe({
  company,
  sectors,
  skills,
}: {
  company: any;
  sectors: any;
  skills: any;
}) {
  const scheduleLabels: Record<string, string> = {
    full: "Full-Time",
    part: "Media jornada",
    negociable: "Tipo de Jornada sin definir",
  };

  const locationLabels: Record<string, string> = {
    hibrido: "Híbrido",
    presencial: "Presencial",
    remoto: "Remoto",
  };

  const router = useRouter();
  const [logoImage, setLogoImage] = useState(
    "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  );
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
  );

  const [companyEdited, setCompanyEdited] = useState(company);

  const { hideLoader, showLoader } = useContext(LoaderContext);
  const { loggedIn, userData } = useContext(AuthContext);
  const [infoOfferDataModal, setInfoOfferDataModal] = useState<any | null>(
    null
  );
  const infoOfferModal = useModal();

  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  useEffect(() => {
    showLoader();
    if (userData) {
      apiRequest(`follow/check/${companyEdited.user_id}`)
        .then((response) => {
          console.log(response);
          if (response.status === "success") {
            setIsFollowing(response.follow);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          hideLoader();
        });
    }
  }, [userData]);

  const handleShowOffer = (offer: any) => {
    showLoader();
    try {
      //verificar si ya esta optando a esta oferta
      apiRequest(`offers/apply-check/${offer.id}`)
        .then((response) => {
          console.log(response);
          if (response.status === "success") {
            offer.userHasApplied = response.userHasApplied;
            setInfoOfferDataModal(offer);
            infoOfferModal.openModal();
          } else {
            toast({
              title: "Error",
              description: "Error al mostrar la oferta",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al mostrar la oferta",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  //data for the modal to apply
  const [step, setStep] = useState(1);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    showLoader();
    setError(null);

    try {
      console.log("candidatura hecha");
      showLoader();
      console.log(studentData);

      // 1) Construye el FormData
      const formData = new FormData();
      formData.append("offer_id", studentData.offer_id.toString());
      formData.append("user_id", studentData.user_id.toString());
      formData.append("availability", studentData.availability);

      // Solo añades cv si es un File
      if (studentData.cv_attachment) {
        formData.append("cv_attachment", studentData.cv_attachment);
      }

      // Solo añades cover letter si es un File
      if (studentData.cover_letter_attachment) {
        formData.append(
          "cover_letter_attachment",
          studentData.cover_letter_attachment
        );
      }

      const response = await apiRequest("offers/apply", "POST", formData);
      if (response.status !== "success")
        throw new Error(response.message || "Error al enviar");
      next(); // pasa al paso de confirmación
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoader();
    }
  };

  const handleNextStepApplyOffer = () => {
    if (step === 1) {
      console.log("validar step 1");
    }
    next();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setStudentData((prev: any) => ({
        ...prev,
        cover_letter_attachment: file,
      }));
    }
  };

  const infoApplyModal = useModal();

  const handleApplyOffer = async () => {
    console.log("apply offer");
    showLoader();

    if (!userData) {
      router.push("/login");
      return;
    }

    if (userData.rol === "student") {
      const response = await apiRequest("student/offer/get-data");
      if (response.status === "success") {
        setStep(1);
        response.student.email = userData?.email;
        response.student.cover_letter_attachment = null;
        response.student.cv_attachment = null;
        response.student.availability = "";
        response.student.offer_id = infoOfferDataModal.id;

        setStudentData(response.student);
        infoApplyModal.openModal();
      } else {
        //change for toast for better user experience
        toast({
          title: "Error al obtener los datos del estudiante",
          description: "Error al obtener los datos del estudiante.",
          variant: "error",
        });
      }
      hideLoader();
      return;
    }

    toast({
      title: "Error al optar a la oferta",
      description: "Solo los estudiantes pueden optar a la oferta.",
      variant: "destructive",
    });
    hideLoader();
  };

  const handleRedirectLogin = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    hideLoader();
    console.log(infoOfferDataModal);
  }, [infoOfferDataModal]);

  const followersModal = useModal();

  const handleFollowCompany = (user_id: number) => {
    console.log("follow company");
    showLoader();
    setIsFollowingLoading(true);
    try {
      apiRequest("follow", "POST", {
        user_id,
      })
        .then((response) => {
          console.log(response);
          if (response.status === "success") {
            toast({
              title: "Exito",
              description: response.message,
              variant: "success",
            });
            setCompanyEdited((prev: any) => ({
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
          setIsFollowingLoading(false);
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

  const handleUnfollowCompany = (user_id: number) => {
    showLoader();
    setIsFollowingLoading(true);
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
            setCompanyEdited((prev: any) => ({
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
          setIsFollowingLoading(false);
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

  const [companyFollowersAll, setCompanyFollowersAll] = useState<Follower[]>(
    []
  );
  const [companyFollowers, setCompanyFollowers] = useState<Follower[]>([]);
  const [searchFollowerQuery, setSearchFollowerQuery] = useState("");
  const [isLoadingToggleFollwer, setIsLoadingToggleFollwer] = useState(false);

  const handleOpenModalFollowers = () => {
    showLoader();

    apiRequest(`followers`, "POST", {
      user_id: companyEdited.user_id,
      me_id: userData?.id,
    })
      .then((response) => {
        console.log(response);
        if (response.status === "success") {
          setCompanyFollowersAll(response.followers);
          setCompanyFollowers(response.followers);
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
    const filteredFollowers = companyFollowersAll.filter((follower: any) => {
      return follower.name.toLowerCase().includes(query.toLowerCase());
    });
    setCompanyFollowers(filteredFollowers);
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
            setCompanyFollowers((prev) =>
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
            setCompanyFollowers((prev) =>
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
          console.log(error);
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

  const skillsArray: string[] = React.useMemo(() => {
    try {
      return JSON.parse(infoOfferDataModal.skills);
    } catch {
      return [];
    }
  }, [infoOfferDataModal?.skills]);

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
      reported_user_id: companyEdited.user_id,
      reason: reportReason,
    })
      .then((response) => {
        if (response.status === "success") {
          toast({
            title: "Reporte enviado",
            description:
              "Gracias por reportar este usuario. Revisaremos tu reporte pronto.",
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

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Cover Photo */}
        <div className="relative h-80 bg-gray-300">
          <img
            src={
              companyEdited?.cover_photo
                ? `${config.storageUrl}${companyEdited.cover_photo}`
                : coverImage
            }
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
                      src={
                        companyEdited?.logo
                          ? `${config.storageUrl}${companyEdited.logo}`
                          : logoImage
                      }
                      alt={companyEdited?.logo}
                    />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        {companyEdited?.name || "No tenemos este dato"}
                      </h1>
                      <p className="text-lg text-gray-600">
                        {companyEdited?.slogan}
                      </p>
                      <p className="text-gray-500 flex items-center mt-2">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        {companyEdited?.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center sm:mt-0">
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                      Contactar
                    </button>

                    {/* Botón de Seguir */}
                    <button
                      onClick={() =>
                        isFollowing
                          ? handleUnfollowCompany(companyEdited?.user_id)
                          : handleFollowCompany(companyEdited?.user_id)
                      }
                      disabled={isFollowingLoading}
                      className={`group inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white ${
                        isFollowingLoading || isFollowing
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
                      {companyEdited?.followers}{" "}
                      {companyEdited?.followers === 1
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <a
                      href={companyEdited?.website || ""}
                      className="text-blue-600 hover:underline"
                    >
                      {companyEdited?.website || "No hay website vinculada"}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {companyEdited?.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {companyEdited?.company_email ||
                        "Sin dirección de correo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Acerca de
                  </h2>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: companyEdited.short_description,
                  }}
                />
              </div>
            </div>

            <Tabs defaultValue="acerca" className="w-full mt-5">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg">
                <TabsTrigger
                  value="acerca"
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                >
                  <UserIcon className="h-4 w-4" />
                  Acerca de
                </TabsTrigger>
                <TabsTrigger
                  value="ofertas"
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Ofertas
                </TabsTrigger>
              </TabsList>
              <TabsContent value="acerca" className="mt-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-0">
                    <h2 className="text-xl font-semibold mb-0">
                      Acerca de {companyEdited.name}
                    </h2>
                  </div>

                  <>
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-0 p-0"
                      dangerouslySetInnerHTML={{
                        __html: companyEdited.description || "",
                      }}
                    />
                  </>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Información General */}
                    <div className="">
                      <h3 className="font-semibold mb-2">
                        Información general
                      </h3>

                      <ul className="space-y-2 text-gray-600">
                        <li>
                          <strong>Sitio web:</strong> {companyEdited.website}
                        </li>
                        <li>
                          <strong>Industria:</strong>{" "}
                          {companyEdited.sectors &&
                          companyEdited.sectors.length > 0 ? (
                            companyEdited.sectors.map((sector: any) => (
                              <Badge key={sector.id} className="mr-2">
                                {sector.name} {/* Renderiza solo el nombre */}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No especificado
                            </span>
                          )}
                        </li>
                        <li>
                          <strong>Numero de empleados:</strong>{" "}
                          {companyEdited.num_people}
                        </li>
                        <li>
                          <strong>Fundada:</strong> {companyEdited.founded_year}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Especialidades</h3>

                      <>
                        <div className="flex flex-wrap gap-2 text-gray-600">
                          {companyEdited.skills &&
                          companyEdited.skills.length > 0 ? (
                            companyEdited.skills.map((skill: any) => (
                              <Badge
                                key={skill.id}
                                className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md"
                              >
                                {skill.name}{" "}
                                {/* Renderiza solo el nombre de la habilidad */}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No especificado
                            </span>
                          )}
                        </div>
                      </>
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
                          src={`https://images.unsplash.com/photo-${
                            1500000000000 + post
                          }?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                          alt="Author"
                          className="aspect-square h-full w-full"
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">María García</h3>
                            <p className="text-sm text-gray-500">
                              Directora de Innovación
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">2h</span>
                        </div>
                        <p className="mt-2 text-gray-600">
                          Emocionados de anunciar nuestro nuevo proyecto de
                          innovación en IA. ¡Grandes cosas están por venir!
                          #Innovación #TechCompany
                        </p>
                        <div className="mt-4 bg-gray-100 rounded-lg aspect-video"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ofertas" className="mt-6 space-y-4">
                {/* Botón para añadir una nueva oferta */}
                <div className="flex justify-end"></div>

                {/* Mapear las ofertas existentes */}
                {companyEdited?.offers?.map((job: any, i: any) => (
                  <Card
                    key={job.id}
                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer `}
                    onClick={() => handleShowOffer(job)}
                  >
                    {/* Contenido del card */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{company.name}</span>
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{job.address}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.schedule_type && (
                            <Badge variant="secondary">
                              {scheduleLabels[job.schedule_type]}
                            </Badge>
                          )}
                          {job.location_type && (
                            <Badge variant="secondary">
                              {locationLabels[job.location_type]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <BookmarkPlus className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Posted{" "}
                        {formatDistanceToNow(new Date(job.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>
                        {job.users_interested?.length
                          ? job.users_interested.length
                          : 0}{" "}
                        applicants
                      </span>
                    </div>
                  </Card>
                ))}

                {(!companyEdited?.offers ||
                  companyEdited.offers.length === 0) && (
                  <div className="flex flex-col items-center justify-center mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Inbox className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-semibold text-gray-600 mb-2">
                      No hay ofertas disponibles
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Modal
        isOpen={infoOfferModal.isOpen}
        onClose={infoOfferModal.closeModal}
        id="info-offer-modal"
        size="lg"
        title={`Solicitar prácticas en ${infoOfferDataModal?.company?.name}`}
        closeOnOutsideClick={false}
      >
        <div className="space-y-6 p-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {infoOfferDataModal?.title}
              </h2>
              <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {infoOfferDataModal?.vacancies}{" "}
                {infoOfferDataModal?.vacancies === 1 ? "vacante" : "vacantes"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Building2 className="h-4 w-4" />
              <Link
                href={`/profile/company/${infoOfferDataModal?.company?.slug}`}
                className="ml-2"
              >
                <span>{infoOfferDataModal?.company?.name}</span>
              </Link>
              <MapPin className="h-4 w-4 ml-2" />
              <span>{infoOfferDataModal?.address}</span>
            </div>
            <div className="flex gap-4">
              {infoOfferDataModal?.userHasApplied ? (
                <Button
                  variant="outline"
                  size="icon"
                  disabled
                  className="w-full flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                >
                  <BookmarkCheck className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Ya estás inscrito</span>
                </Button>
              ) : (
                <Button
                  className="w-full flex-1"
                  onClick={loggedIn ? handleApplyOffer : handleRedirectLogin}
                >
                  <BookmarkPlus className="h-5 w-5 mr-2" />
                  <span>Apply Now</span>
                </Button>
              )}
              <Button variant="outline" size="icon">
                <BookmarkPlus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {/* Location Type */}
            <div className="flex items-center gap-2 text-sm">
              {infoOfferDataModal?.location_type === "remoto" && (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              {infoOfferDataModal?.location_type === "presencial" && (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
              {infoOfferDataModal?.location_type === "hibrido" && (
                <Home className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="capitalize">
                {infoOfferDataModal?.location_type}
              </span>
            </div>

            {/* Schedule Type */}
            <div className="flex items-center gap-2 text-sm">
              {infoOfferDataModal?.schedule_type === "full" && (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
              {infoOfferDataModal?.schedule_type === "part" && (
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              )}
              {infoOfferDataModal?.schedule_type === "negociable" && (
                <Calendar className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="capitalize">
                {infoOfferDataModal?.schedule_type === "full"
                  ? "Jornada completa"
                  : infoOfferDataModal?.schedule_type === "part"
                  ? "Jornada parcial"
                  : "Negociable"}
              </span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 text-sm">
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <span>{infoOfferDataModal?.salary}</span>
            </div>

            {/* Days per Week */}
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>
                {infoOfferDataModal?.days_per_week}{" "}
                {infoOfferDataModal?.days_per_week === 1 ? "día" : "días"} por
                semana
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div
              className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-o p-0"
              dangerouslySetInnerHTML={{
                __html: infoOfferDataModal?.description || "",
              }}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Skills necesarias</h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill: any) => (
                <span
                  key={skill}
                  className="inline-block bg-black text-white text-xs font-medium px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              About {infoOfferDataModal?.company?.name}
            </h3>
            <p className="text-muted-foreground">
              {infoOfferDataModal?.company?.short_description}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={infoApplyModal.isOpen}
        onClose={infoApplyModal.closeModal}
        id="info-apply-modal"
        size="lg"
        title={`Solicitar prácticas en ${infoOfferDataModal?.company?.name}`}
        closeOnOutsideClick={false}
      >
        <div className="space-y-4 p-4">
          {/* Paso 1: Revisa tus datos */}
          {step === 1 && (
            <>
              <h2 className="text-sm font-semibold">Información de contacto</h2>
              <div className="flex items-center">
                <div>
                  <img
                    src={
                      studentData?.photo_pic ||
                      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
                    }
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ms-4">
                  <p className="font-bold">
                    {studentData?.name + " " + studentData?.surname}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.education[0]?.institute
                      ? `Estudiante de ${studentData?.education[0]?.institute}`
                      : "Sin datos académicos"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.address || "Sin dirección"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <p className="text-sm mb-0 text-gray-600">Email*</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 absolute left-3 text-gray-500" />
                    <Input
                      type="email"
                      value={studentData?.email}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="relative">
                  <p className="text-sm mb-0 text-gray-600">
                    Numero de telefono*
                  </p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 absolute left-3 text-gray-500" />
                    <Input
                      type="number"
                      value={studentData?.phone}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Numero de telefono..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={infoApplyModal.closeModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleNextStepApplyOffer}
                  disabled={!studentData?.email || !studentData?.phone}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 2: Carta de presentación y disponibilidad */}
          {step === 2 && (
            <>
              <div className="relative">
                <p className="text-sm mb-2 font-bold text-gray-700">
                  Currículum Vitae (CV)*
                </p>
                <label className="relative flex items-center space-x-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    {studentData?.cv_attachment ? (
                      <span className="text-gray-700 truncate">
                        {studentData.cv_attachment.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Arrastra tu CV aquí o haz clic para subir
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        cv_attachment: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Mantén tu CV actualizado para acceder a las oportunidades más
                  relevantes.
                </p>
              </div>

              <div className="relative mt-6">
                <p className="text-sm mb-2 font-bold text-gray-700">
                  Carta de presentación
                </p>
                <label className="relative flex items-center space-x-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 cursor-pointer">
                  <FileSignature className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    {studentData?.cover_letter_attachment ? (
                      <span className="text-gray-700 truncate">
                        {studentData.cover_letter_attachment.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Arrastra tu carta de presentación aquí o haz clic para
                        subir
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Una carta personalizada muestra tu entusiasmo y destaca tus
                  fortalezas.
                </p>
              </div>

              <div className="relative mt-6">
                <h2 className="text-sm font-bold text-gray-700 mb-2">
                  Disponibilidad
                </h2>
                <Input
                  value={studentData?.availability}
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      availability: e.target.value,
                    })
                  }
                  placeholder="Ej: Junio – Septiembre, 20 h/semana"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Especifica tu rango temporal y horas disponibles por semana.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button
                  onClick={handleNextStepApplyOffer}
                  disabled={
                    !studentData?.cv_attachment ||
                    !studentData?.cover_letter_attachment ||
                    !studentData?.availability
                  }
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 3: Revisa y envía */}
          {step === 3 && (
            <>
              <h2 className="text-sm font-semibold">Resumen de solicitud</h2>
              <div className="flex items-center">
                <div>
                  <img
                    src={
                      studentData?.photo_pic ||
                      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
                    }
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ms-4">
                  <p className="font-bold">
                    {studentData?.name + " " + studentData?.surname}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.education[0]?.institute
                      ? `Estudiante de ${studentData?.education[0]?.institute}`
                      : "Sin datos académicos"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.address || "Sin dirección"}
                  </p>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold">
                    Información de contacto
                  </h2>
                  <div className="relative">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.email || "Sin email"}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.phone || "Sin telefono"}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.availability || "Sin disponibilidad"}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {/* Documentos */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-semibold">
                      Documentación subida
                    </h3>
                    <div className="flex ">
                      {/* CV Card */}
                      <a
                        href={
                          studentData.cv_attachment
                            ? URL.createObjectURL(studentData.cv_attachment)
                            : "#"
                        }
                        download={studentData.cv_attachment?.name}
                        className="w-32 flex flex-col items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                          <FileText className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="block w-full text-gray-700 text-sm truncate text-center">
                          {studentData.cv_attachment?.name || "CV no subido"}
                        </span>
                      </a>

                      {/* Carta de presentación Card */}
                      <a
                        href={
                          studentData.cover_letter_attachment
                            ? URL.createObjectURL(
                                studentData.cover_letter_attachment
                              )
                            : "#"
                        }
                        download={studentData.cover_letter_attachment?.name}
                        className="w-32 flex flex-col items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                          <FileSignature className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="block w-full text-gray-700 text-sm truncate text-center">
                          {studentData.cover_letter_attachment?.name ||
                            "Carta no subida"}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit}>Enviar candidatura</Button>
              </div>
            </>
          )}

          {/* Paso 4: Éxito */}
          {step === 4 && (
            <>
              <div className="text-center mx-20 space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  ¡Solicitud enviada con éxito!
                </h2>
                <p className="text-gray-600">
                  Gracias por confiar en nosotros. Tu candidatura ha sido
                  enviada correctamente.
                </p>
                <p className="text-gray-600">
                  Revisa el estado de tu solicitud en tu perfil cuando quieras,
                  y recibirás un email con cualquier novedad. ¡Mucha suerte!
                </p>
              </div>
              <div className="flex justify-center">
                <Button onClick={infoApplyModal.closeModal}>Entendido</Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={followersModal.isOpen}
        onClose={followersModal.closeModal}
        id="followers-modal"
        size="lg"
        title={`Seguidores de ${company.name}`}
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
            {companyFollowers?.map((follower: any) => (
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
            {companyFollowers && companyFollowers.length === 0 && (
              <p className="text-gray-600">No hay seguidores</p>
            )}

            {/* Si quieres cubrir también el caso undefined/null */}
            {!companyFollowers && (
              <p className="text-gray-600">No hay seguidores</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={reportModal.isOpen}
        onClose={reportModal.closeModal}
        id="report-modal"
        size="md"
        title={`Reportar a ${companyEdited.name}`}
        closeOnOutsideClick={true}
      >
        <div className="flex flex-col space-y-4 p-5">
          <div className="flex items-start space-x-3 bg-yellow-50 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                Por favor, proporciona detalles sobre el problema que has
                encontrado con este usuario. Revisaremos tu reporte y tomaremos
                las medidas necesarias.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Motivo del reporte
            </label>
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
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
