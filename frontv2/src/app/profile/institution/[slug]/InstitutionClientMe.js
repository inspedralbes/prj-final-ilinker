"use client"

import { useState } from "react"
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
  Camera,
  Award,
  Briefcase,
  Languages,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react"

// Importamos los componentes de Tabs y Card de ui.shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function InstituteProfileLogin() {
  const [isEditing, setIsEditing] = useState(null)
  const [logoImage, setLogoImage] = useState(
    "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80",
  )
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
  )

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
    hashtags: ["#FPInformática", "#EducaciónTecnológica", "#InnovacionEducativa"],
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
        description: "Implementación de los primeros ciclos formativos de grado superior en informática",
      },
      {
        id: 3,
        year: "2020",
        title: "Centro de Excelencia Digital",
        description: "Reconocimiento como centro de referencia en formación tecnológica",
      },
    ],
  })

  const [publications, setPublications] = useState([
    { id: 1, title: "Nuevo curso de desarrollo web", image: "https://picsum.photos/300/200?random=1" },
    { id: 2, title: "Jornada de puertas abiertas", image: "https://picsum.photos/300/200?random=2" },
    { id: 3, title: "Colaboración con empresas locales", image: "https://picsum.photos/300/200?random=3" },
    { id: 4, title: "Éxito en la feria de empleo", image: "https://picsum.photos/300/200?random=4" },
    { id: 5, title: "Nuevo laboratorio de IA", image: "https://picsum.photos/300/200?random=5" },
  ])

  // Estado para controlar la cantidad de publicaciones mostradas en Inicio (Publicaciones de Empresa)
  const [visiblePublications, setVisiblePublications] = useState(3)

  const handleEdit = (section) => {
    setIsEditing(section)
  }

  const handleSave = () => {
    setIsEditing(null)
  }

  const handleImageUpload = (event, type) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "logo") {
          setLogoImage(reader.result)
        } else {
          setCoverImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const updateInstitute = (section, value) => {
    setInstitute((prev) => ({
      ...prev,
      [section]: value,
    }))
  }


  // ---------------------- Renderizados de secciones ----------------------

  const renderAcercaDe = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
        <button onClick={() => handleEdit("about")} className="text-blue-600 hover:text-blue-800">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      {isEditing === "about" ? (
        <div>
          <textarea
            value={institute.basic.about}
            onChange={(e) => updateInstitute("basic", { ...institute.basic, about: e.target.value })}
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
  )

  const renderEmpleos = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg text-[23px] text-gray-900 mb-4">Empleos</h2>
      <p className="text-gray-600">No hay empleos disponibles actualmente.</p>
    </div>
  )

  const renderAntiguosAlumnos = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Antiguos alumnos</h2>
      <p className="text-gray-600">No hay información de antiguos alumnos.</p>
    </div>
  )

  const renderInicio = (
    <>
      {/* Sección con Acerca de y Detalles del Instituto */}
      {renderAcercaDe}
      {/* Detalles del Instituto */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Instituto</h3>
            {isEditing === "details" ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Tipo de institución</p>
                    <input
                      type="text"
                      value={institute.basic.type}
                      onChange={(e) => updateInstitute("basic", { ...institute.basic, type: e.target.value })}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Tamaño</p>
                    <input
                      type="text"
                      value={institute.basic.size}
                      onChange={(e) => updateInstitute("basic", { ...institute.basic, size: e.target.value })}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Año de fundación</p>
                    <input
                      type="text"
                      value={institute.basic.foundedYear}
                      onChange={(e) =>
                        updateInstitute("basic", { ...institute.basic, foundedYear: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <Languages className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Idiomas</p>
                    <input
                      type="text"
                      value={institute.basic.languages.join(", ")}
                      onChange={(e) =>
                        updateInstitute("basic", { ...institute.basic, languages: e.target.value.split(", ") })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(null)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            ) : (
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
                <button onClick={() => setIsEditing("details")} className="text-blue-600 hover:text-blue-800">
                  <Pencil className="h-4 w-4 inline mr-1" />
                  Editar detalles
                </button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
            {isEditing === "specialties" ? (
              <div>
                {institute.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => {
                        const newSpecialties = [...institute.specialties]
                        newSpecialties[index] = e.target.value
                        updateInstitute("specialties", newSpecialties)
                      }}
                      className="flex-1 border rounded px-2 py-1 mr-2"
                    />
                    <button
                      onClick={() => {
                        const newSpecialties = institute.specialties.filter((_, i) => i !== index)
                        updateInstitute("specialties", newSpecialties)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSpecialties = [...institute.specialties, ""]
                    updateInstitute("specialties", newSpecialties)
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Añadir especialidad
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2">
                  {institute.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-black-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setIsEditing("specialties")}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-4 w-4 inline mr-1" />
                  Editar especialidades
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Certificaciones */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Certificaciones y Acreditaciones</h2>
            <button onClick={() => handleEdit("certifications")} className="text-blue-600 hover:text-blue-800">
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
        {/* Colaboraciones */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Colaboraciones con Empresas</h2>
            <button onClick={() => handleEdit("collaborations")} className="text-blue-600 hover:text-blue-800">
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
      </div>
      <br />
      <br />
    </>
  )

  // Sección de "Publicaciones de Empresa" en Inicio
  const renderCompanyPublications = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Publicaciones de Empresa</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {publications.slice(0, visiblePublications).map((pub) => (
          <Card key={pub.id}>
            <CardHeader>
              <CardTitle>{pub.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={pub.image || "/placeholder.svg"}
                alt={pub.title}
                className="w-full h-32 object-cover rounded"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {visiblePublications < publications.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisiblePublications(publications.length)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
          >
            Mostrar más publicaciones
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )

  // Sección de "Publicaciones" (pestaña completa)
  const renderPublicaciones = (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Publicaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {publications.map((pub) => (
          <Card key={pub.id}>
            <CardHeader>
              <CardTitle>{pub.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={pub.image || "/placeholder.svg"}
                alt={pub.title}
                className="w-full h-32 object-cover rounded"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // ---------------------- Render principal ----------------------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo */}
      <div className="relative h-80 bg-gray-300">
        <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <label className="absolute bottom-4 right-4 cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} />
          <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
        </label>
      </div>

      <div className="max-w-6xl mx-auto px-9 sm:px-6 lg:px-8">
        {/* Aquí envolvemos todo en un único <Tabs> para poder separar la barra y el contenido en dos cards */}
        <Tabs defaultValue="inicio">
          {/* Card superior con la info del instituto y la barra de Tabs */}
          <div className="relative -mt-32">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  <div className="relative flex-shrink-0">
                    <img
                      className="mx-auto h-40 w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                      src={logoImage || "/placeholder.svg"}
                      alt={institute.basic.name}
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
                          value={institute.basic.name}
                          onChange={(e) => updateInstitute("basic", { ...institute.basic, name: e.target.value })}
                          className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                        />
                        <input
                          type="text"
                          value={institute.basic.slogan}
                          onChange={(e) => updateInstitute("basic", { ...institute.basic, slogan: e.target.value })}
                          className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                        />
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={institute.basic.location}
                            onChange={(e) =>
                              updateInstitute("basic", { ...institute.basic, location: e.target.value })
                            }
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
                      <Users className="h-5 w-5 mr-2 text-gray-400" />
                      Seguir
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Share2 className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Información de contacto */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isEditing === "contact" ? (
                    <>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institute.basic.website}
                          onChange={(e) => updateInstitute("basic", { ...institute.basic, website: e.target.value })}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institute.basic.phone}
                          onChange={(e) => updateInstitute("basic", { ...institute.basic, phone: e.target.value })}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institute.basic.email}
                          onChange={(e) => updateInstitute("basic", { ...institute.basic, email: e.target.value })}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="col-span-3 mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
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
                      <button
                        onClick={() => handleEdit("contact")}
                        className="col-span-3 text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="h-4 w-4 inline mr-1" />
                        Editar información de contacto
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Barra de Tabs en la misma tarjeta superior */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <TabsList>
                  <TabsTrigger value="inicio">Inicio</TabsTrigger>
                  <TabsTrigger value="acerca">Acerca de</TabsTrigger>
                  <TabsTrigger value="publicaciones">Publicaciones</TabsTrigger>
                  <TabsTrigger value="empleos">Empleos</TabsTrigger>
                  <TabsTrigger value="instituto">Vida en el instituto</TabsTrigger>
                  <TabsTrigger value="alumnos">Antiguos alumnos</TabsTrigger>
                </TabsList>
              </div>
            </div>
            
          </div>

          {/* Card inferior donde se muestra el contenido de cada pestaña */}
          <div className="mt-4 bg-white rounded-lg shadow-lg p-6">
            <TabsContent value="inicio">
              {renderInicio}
              {renderCompanyPublications}
            </TabsContent>
            <TabsContent value="acerca">{renderAcercaDe}</TabsContent>
            <TabsContent value="publicaciones">{renderPublicaciones}</TabsContent>
            <TabsContent value="empleos">{renderEmpleos}</TabsContent>
            <TabsContent value="instituto">{renderAntiguosAlumnos}</TabsContent>
            <TabsContent value="alumnos">{renderAntiguosAlumnos}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
