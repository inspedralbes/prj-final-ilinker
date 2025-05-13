"use client";

import React, { useContext, useEffect, useState } from "react";
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
  UserPlus,
  Inbox,
  UserMinus,
  UserX,
  Loader2,
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
import AddressAutocomplete from "@/components/address/AddressAutocomplete";
import { SimpleEditor } from "@/components/templates/simple/SimpleEditor";
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

export default function CompanyClientMe({
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

  const animatedComponents = makeAnimated();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState(
    "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80"
  );
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
  );

  const [companyEdited, setCompanyEdited] = useState(company);

  const [modalState, setModalState] = useState(false);
  const { userData } = useContext(AuthContext);
  const { hideLoader, showLoader } = useContext(LoaderContext);
  const { toast } = useToast();

  const handleEdit = (section: string) => {
    setIsEditing(section);
  };

  const handleSave = async () => {
    showLoader();
    setIsEditing(null);

    const formData = new FormData();
    // Asegurarse de que los datos no sean nulos
    Object.entries(companyEdited).forEach(([key, value]) => {
      if (key !== "logo" && key !== "cover_photo" && Array.isArray(value)) {
        // Solo agregar valores no nulos y asegurarse de que sean arrays de objetos
        if (value.length > 0) {
          formData.append(key, JSON.stringify(value));
        }
      } else if (key !== "logo" && key !== "cover_photo") {
        // Solo agregar valores no nulos
        if (value !== null && value !== undefined) {
          formData.append(key, value as any);
        }
      }
    });

    // Asegurarse de que los archivos se agreguen correctamente
    if (companyEdited.logo instanceof File) {
      formData.append("logo", companyEdited.logo);
    }

    if (companyEdited.cover_photo instanceof File) {
      formData.append("cover_photo", companyEdited.cover_photo);
    }

    try {
      const response = await apiRequest("company/update", "POST", formData);
      console.log(response);
      setCompanyEdited(response.company);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      hideLoader();
    }
  };

  const [imageChangeCount, setImageChangeCount] = useState(0);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (type !== "logo" && type !== "cover_photo") {
      console.error("Tipo incorrecto:", type);
      return;
    }

    console.log("Actualizando:", type, file);

    setCompanyEdited((prev: any) => ({
      ...prev,
      [type]: file,
    }));

    setImageChangeCount((prev) => prev + 1); // Forzar cambio
  };

  useEffect(() => {
    hideLoader();
  }, []);

  useEffect(() => {
    handleSave();
  }, [imageChangeCount]); // Se ejecuta solo cuando cambia la imagen

  const updateCompany = (e: any) => {
    const { name, value } = e.target;
    setCompanyEdited((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModalAddOffer = () => {
    showLoader();
    router.push(`/profile/company/${company.slug}/create-offer`);
    // setModalState(!modalState);
    // setModalModeEdit(false);
    // setJobData(null);
  };
  const [jobData, setJobData] = useState(null);
  const [modalModeEdit, setModalModeEdit] = useState(false);
  const handleOpenModalEditOffer = (job: any) => {
    setModalState(!modalState);
    setJobData(job);
    setModalModeEdit(true);
  };

  const handleCloseModal = () => {
    setModalState(false);
    setModalModeEdit(false);
    setJobData(null);
  };

  const followersModal = useModal();

  const [companyFollowersAll, setCompanyFollowersAll] = useState<Follower[]>(
    []
  );
  const [companyFollowers, setCompanyFollowers] = useState<Follower[]>([]);
  const [isLoadingToggleFollwer, setIsLoadingToggleFollwer] = useState(false);
  const [searchFollowerQuery, setSearchFollowerQuery] = useState("");
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
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover_photo")}
            />
            <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
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
                      src={
                        companyEdited?.logo
                          ? `${config.storageUrl}${companyEdited.logo}`
                          : logoImage
                      }
                      alt={companyEdited?.logo}
                    />
                    <label className="absolute bottom-2 right-2 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                      />
                      <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
                    </label>
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    {isEditing === "basic" ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          value={companyEdited.name}
                          onChange={updateCompany}
                          className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                        />
                        <input
                          type="text"
                          name="slogan"
                          value={companyEdited.slogan}
                          onChange={updateCompany}
                          className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                        />
                        <div className="flex items-center space-x-2">
                          <AddressAutocomplete
                            value={companyEdited.address}
                            onChange={(val: any) =>
                              setCompanyEdited((prev: any) => ({
                                ...prev,
                                address: val,
                              }))
                            }
                            onSelect={(val: any) => {
                              setCompanyEdited((prev: any) => ({
                                ...prev,
                                address: val.place_name,
                                lat: val.lat,
                                lng: val.lng,
                              }));
                            }}
                          />
                        </div>
                        <button
                          onClick={handleSave}
                          className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-black/80"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
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
                        <button
                          onClick={() => handleEdit("basic")}
                          className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar información básica
                        </button>
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
                  <button
                    onClick={() => handleEdit("basic-2")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                {isEditing === "basic-2" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                        <Input
                          type="text"
                          name="website"
                          placeholder="Website de la compañia"
                          value={companyEdited.website}
                          onChange={updateCompany}
                        />
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <Input
                          type="text"
                          name="phone"
                          placeholder="Numero de la compañia"
                          value={companyEdited.phone}
                          onChange={updateCompany}
                        />
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <Input
                          type="email"
                          name="company_email"
                          placeholder="Email de la compañia"
                          value={companyEdited.company_email || ""}
                          onChange={updateCompany}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
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
                )}
              </div>

              {/* About Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Acerca de
                  </h2>
                  <button
                    onClick={() => handleEdit("about")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                {isEditing === "about" ? (
                  <div>
                    <textarea
                      name="short_description"
                      value={companyEdited.short_description}
                      onChange={(e) =>
                        updateCompany(
                          e as React.ChangeEvent<HTMLTextAreaElement>
                        )
                      }
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: companyEdited.short_description,
                    }}
                  />
                )}
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
                    <button
                      onClick={() => handleEdit("description")}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>

                  {isEditing === "description" ? (
                    <>
                      <div className="mb-6">
                        <SimpleEditor
                          content={companyEdited.description || ""}
                          onChange={(html: string) => {
                            if (companyEdited.description !== html) {
                              setCompanyEdited((prev: any) => ({
                                ...prev,
                                description: html,
                              }));
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-0 p-0"
                        dangerouslySetInnerHTML={{
                          __html: companyEdited.description || "",
                        }}
                      />
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {/* Información General */}
                    <div className="">
                      <h3 className="font-semibold mb-2">
                        Información general
                      </h3>

                      {isEditing === "description" ? (
                        <div className="space-y-3">
                          <Input
                            value={companyEdited.website}
                            onChange={updateCompany}
                            placeholder="Sitio web"
                          />

                          <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={sectors}
                            isSearchable
                            isMulti
                            placeholder="Busca y selecciona..."
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            value={companyEdited.sectors}
                            onChange={(selectedOption: any) => {
                              console.log(selectedOption);
                              setCompanyEdited({
                                ...companyEdited,
                                sectors: selectedOption,
                              });
                            }}
                          />
                          <Input
                            value={companyEdited.num_people}
                            onChange={(e) =>
                              setCompanyEdited({
                                ...companyEdited,
                                num_people: e.target.value,
                              })
                            }
                            placeholder="Tamaño"
                          />
                          <Input
                            value={companyEdited.founded_year}
                            onChange={(e) =>
                              setCompanyEdited({
                                ...companyEdited,
                                founded_year: e.target.value,
                              })
                            }
                            placeholder="Año de fundación"
                          />
                        </div>
                      ) : (
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
                            <strong>Fundada:</strong>{" "}
                            {companyEdited.founded_year}
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
                            options={skills}
                            isSearchable
                            isMulti
                            placeholder="Busca y selecciona..."
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            value={companyEdited.skills}
                            onChange={(selectedOption: any) => {
                              console.log(selectedOption);
                              setCompanyEdited({
                                ...companyEdited,
                                skills: selectedOption,
                              });
                            }}
                          />
                        </>
                      ) : (
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
                      )}
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
                <div className="flex justify-end">
                  <Button
                    className="bg-black text-white"
                    onClick={() => handleOpenModalAddOffer()} // Asumiendo que tienes una función para manejar el modal de añadir oferta
                  >
                    Añadir Oferta
                  </Button>
                  {/* <Link href={`/profile/company/${company.slug}/create-offer`}>
                    Añadir oferta
                  </Link> */}
                </div>

                {/* Mapear las ofertas existentes */}
                {companyEdited?.offers?.map((job: any, i: any) => (
                  <Card
                    key={job.id}
                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer `}
                    onClick={() => {
                      showLoader();
                      router.push(
                        `/profile/company/${company.slug}/edit-offer/${job.id}`
                      );
                    }}
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
                        {job.usersInterested?.length
                          ? job.usersInterested.length
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
      {modalState && (
        <ModalOffer
          handleClose={handleCloseModal}
          isEditMode={modalModeEdit}
          selectedInfoJob={jobData}
        />
      )}

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
    </>
  );
}
