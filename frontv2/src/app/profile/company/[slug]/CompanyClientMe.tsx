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

  const [institute, setInstitute] = useState({
    basic: {
      name: "Institut Pedralbes",
      customUrl: "institut-pedralbes",
      slogan: "Formando los profesionales del futuro",
      about:
        "El Institut Pedralbes es un centro público de formación profesional líder en Barcelona, especializado en tecnología e informática. Nuestra misión es proporcionar una educación de calidad que prepare a los estudiantes para los desafíos del mundo laboral moderno.",
      location: "Av. d'Esplugues, 36-42, 08034 Barcelona",
      size: "50-200 empleados",
      type: "Centro Público de Formación Profesional",
      sector: "Educación Secundaria y Formación Profesional",
      foundedYear: "1975",
      website: "www.institutpedralbes.cat",
      phone: "+34 932 033 332",
      email: "secretaria@institutpedralbes.cat",
      languages: ["Catalán", "Castellano", "Inglés"],
    },
    specialties: [
      "Desarrollo de Aplicaciones Web",
      "Administración de Sistemas",
      "Ciberseguridad",
      "Inteligencia Artificial",
      "Desarrollo de Videojuegos",
    ],
    hashtags: [
      "#FPInformática",
      "#EducaciónTecnológica",
      "#InnovacionEducativa",
    ],
    additionalLocations: [
      {
        id: 1,
        address: "Carrer de la Tecnologia, 15",
        city: "Barcelona",
        country: "España",
      },
    ],
    certifications: [
      {
        id: 1,
        name: "Centro Certificado Microsoft Imagine Academy",
        issuedBy: "Microsoft",
        year: "2023",
      },
      {
        id: 2,
        name: "Cisco Networking Academy",
        issuedBy: "Cisco",
        year: "2022",
      },
    ],
    collaborations: [
      {
        id: 1,
        company: "Barcelona Activa",
        type: "Prácticas Profesionales",
        description: "Programa de prácticas para estudiantes de último año",
      },
      {
        id: 2,
        company: "Barcelona Tech City",
        type: "Colaboración Educativa",
        description: "Participación en eventos tecnológicos y mentorías",
      },
    ],
    milestones: [
      {
        id: 1,
        year: "1975",
        title: "Fundación del Instituto",
        description: "Apertura del centro educativo",
      },
      {
        id: 2,
        year: "2000",
        title: "Inicio de Formación Profesional en Informática",
        description:
          "Implementación de los primeros ciclos formativos de grado superior en informática",
      },
      {
        id: 3,
        year: "2020",
        title: "Centro de Excelencia Digital",
        description:
          "Reconocimiento como centro de referencia en formación tecnológica",
      },
    ],
  });
  const [modalState, setModalState] = useState(false);
  const { hideLoader, showLoader } = useContext(LoaderContext);

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
          formData.append(key, value);
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

    // Obtener el token de autenticación
    const token = Cookies.get("authToken");

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

  const updateCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="address"
                            value={companyEdited.address}
                            onChange={updateCompany}
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

                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Share2 className="h-5 w-5 text-gray-400" />
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
                      onChange={updateCompany}
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

            <Tabs defaultValue="inicio" className="w-full mt-5">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b bg-white shadow-lg">
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
                  <UserIcon className="h-4 w-4" />
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
                  value="ofertas"
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Ofertas
                </TabsTrigger>
                {/*<TabsTrigger*/}
                {/*    value="empleados"*/}
                {/*    className="flex items-center gap-2 px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent"*/}
                {/*>*/}
                {/*    <UsersIcon className="h-4 w-4"/>*/}
                {/*    Personas empleadas*/}
                {/*</TabsTrigger>*/}
              </TabsList>

              {/* <TabsContent value="inicio" className="mt-6 shadow-lg">
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
                            </TabsContent> */}

              <TabsContent value="acerca" className="mt-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold mb-4">
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
                        <Textarea
                          className="min-h-[150px]"
                          name="description"
                          value={companyEdited.description}
                          onChange={updateCompany}
                          placeholder="Escribe la descripción..."
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="mb-6"
                        dangerouslySetInnerHTML={{
                          __html: companyEdited.description,
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
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            value={companyEdited.sectors}
                            onChange={(selectedOption) => {
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
                              companyEdited.sectors.map((sector) => (
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
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            value={companyEdited.skills}
                            onChange={(selectedOption) => {
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
                              companyEdited.skills.map((skill) => (
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
                    className="bg-blue-600 text-white"
                    onClick={() => handleOpenModalAddOffer()} // Asumiendo que tienes una función para manejar el modal de añadir oferta
                  >
                    Añadir Oferta
                  </Button>
                  {/* <Link href={`/profile/company/${company.slug}/create-offer`}>
                    Añadir oferta
                  </Link> */}
                </div>

                {/* Mapear las ofertas existentes */}
                {companyEdited.offers.map((job, i) => (
                  <Card
                    key={job.id}
                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer `}
                    onClick={() => {
                      showLoader();
                      router.push(`/profile/company/${company.slug}/edit-offer/${job.id}`);
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
                      <span>{job.usersInterested?.length ? job.usersInterested.length : 0} applicants</span>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="empleados" className="mt-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Personas empleadas
                    </h2>
                    <div className="text-sm text-gray-500">1,234 empleados</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((employee) => (
                      <div key={employee} className="flex gap-4 items-center">
                        <Avatar className="h-16 w-16">
                          <img
                            src={`https://images.unsplash.com/photo-${
                              1500000000000 + employee
                            }?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                            alt="Employee"
                            className="aspect-square h-full w-full"
                          />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Juan Pérez</h3>
                          <p className="text-gray-600">Software Engineer</p>
                          <p className="text-sm text-gray-500">
                            Madrid, España
                          </p>
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
      {modalState && (
        <ModalOffer
          handleClose={handleCloseModal}
          isEditMode={modalModeEdit}
          selectedInfoJob={jobData}
        />
      )}
    </>
  );
}
