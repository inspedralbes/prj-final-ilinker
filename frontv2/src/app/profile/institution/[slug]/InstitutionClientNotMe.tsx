"use client"

import { useState } from "react"
import {
  MapPin,
  Building2,
  Globe,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageCircle,
  Share2,
  Award,
  Briefcase,
  Languages,
  ChevronRight,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


interface Institution {
  name: string;
  slogan: string;
  about: string;
  location: string;
  size: string;
  type: string;
  sector: string;
  founded_year: string;
  website: string;
  phone: string;
  email: string;
  languages: string[];
  logo_url: string;
  cover_url: string;
  specialties: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuedBy: string;
    year: string;
  }>;
}

interface Collaboration {
  id: number;
  company: string;
  type: string;
  description: string;
}

interface Publication {
  id: number;
  title: string;
  image: string;
}

interface InstitutionClientNotMeProps {
  institution: Institution;
}

interface InstituteBasic {
  name: string;
  slogan: string;
  about: string;
  location: string;
  size: string;
  type: string;
  sector: string;
  foundedYear: string;
  website: string;
  phone: string;
  email: string;
  languages: string[];
  logo: string;
  cover: string;
}

interface Institute {
  basic: InstituteBasic;
  specialties: string[];
  certifications: Array<{
    id: number;
    name: string;
    issuedBy: string;
    year: string;
  }>;
  collaborations: Collaboration[];
}

export default function InstitutionClientNotMe({ institution }: InstitutionClientNotMeProps) {
  const [visiblePublications, setVisiblePublications] = useState(3)
  const [isFollowing, setIsFollowing] = useState(false)

  if (!institution) {
    return null;
  }

  const institute: Institute = {
    basic: {
      name: institution.name || "",
      slogan: institution.slogan || "",
      about: institution.about || "",
      location: institution.location || "",
      size: institution.size || "",
      type: institution.type || "",
      sector: institution.sector || "",
      foundedYear: institution.founded_year || "",
      website: institution.website || "",
      phone: institution.phone || "",
      email: institution.email || "",
      languages: institution.languages || [],
      logo: institution.logo_url || "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f",
      cover: institution.cover_url || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
    },
    specialties: institution.specialties || [],
    certifications: institution.certifications || [],
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
  }

  const publications: Publication[] = [
    { id: 1, title: "Nuevo curso de desarrollo web", image: "https://picsum.photos/300/200?random=1" },
    { id: 2, title: "Jornada de puertas abiertas", image: "https://picsum.photos/300/200?random=2" },
    { id: 3, title: "Colaboración con empresas locales", image: "https://picsum.photos/300/200?random=3" },
    { id: 4, title: "Éxito en la feria de empleo", image: "https://picsum.photos/300/200?random=4" },
    { id: 5, title: "Nuevo laboratorio de IA", image: "https://picsum.photos/300/200?random=5" },
  ]

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleContact = () => {
    // Aquí iría la lógica para contactar al instituto
  }

  const handleShare = () => {
    // Aquí iría la lógica para compartir el perfil
  }

  const renderAcercaDe = (
    <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Acerca de</h2>
      <p className="text-gray-600 text-sm sm:text-base">{institute.basic.about}</p>
    </div>
  )

  const renderInicio = (
    <>
      <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Instituto</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de institución</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institute.basic.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institute.basic.size}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Año de fundación</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institute.basic.foundedYear}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Languages className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Idiomas</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institute.basic.languages.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6 lg:mt-0">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {institute.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Certificaciones y Acreditaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institute.certifications.map((cert) => (
            <div key={cert.id} className="flex items-start space-x-3">
              <Award className="h-6 w-6 text-gray-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{cert.name}</h3>
                <p className="text-sm text-gray-500">
                  Otorgado por {cert.issuedBy} • {cert.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Colaboraciones con Empresas</h2>
        <div className="space-y-4">
          {institute.collaborations.map((collab) => (
            <div key={collab.id} className="flex items-start space-x-3">
              <Briefcase className="h-6 w-6 text-gray-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{collab.company}</h3>
                <p className="text-sm text-gray-600">{collab.type}</p>
                <p className="text-sm text-gray-500">{collab.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderPublicaciones = (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Publicaciones</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publications.slice(0, visiblePublications).map((pub) => (
          <Card key={pub.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">{pub.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={pub.image}
                alt={pub.title}
                className="w-full h-32 sm:h-40 object-cover rounded"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {visiblePublications < publications.length && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => setVisiblePublications(publications.length)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Mostrar más publicaciones
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-48 sm:h-64 md:h-80 bg-gray-300">
        <img src={institute.basic.cover} alt="Cover" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="inicio" className="w-full">
          <div className="relative -mt-16 sm:-mt-24 md:-mt-32">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:space-x-5">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      className="h-32 w-32 sm:h-40 sm:w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                      src={institute.basic.logo}
                      alt={institute.basic.name}
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{institute.basic.name}</h1>
                    <p className="text-base sm:text-lg text-gray-600">{institute.basic.slogan}</p>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start mt-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm sm:text-base">{institute.basic.location}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0 flex justify-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={handleContact} className="text-sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleFollow}
                      className={`text-sm ${isFollowing ? "bg-blue-50" : ""}`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </Button>
                    <Button variant="outline" onClick={handleShare} className="text-sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-center sm:justify-start">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <a href={`https://${institute.basic.website}`} className="text-blue-600 hover:underline text-sm sm:text-base">
                      {institute.basic.website}
                    </a>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 text-sm sm:text-base">{institute.basic.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 text-sm sm:text-base">{institute.basic.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6 overflow-x-auto">
                <TabsList className="w-full flex justify-start sm:justify-center">
                  <TabsTrigger value="inicio" className="text-sm sm:text-base">Inicio</TabsTrigger>
                  <TabsTrigger value="acerca" className="text-sm sm:text-base">Acerca de</TabsTrigger>
                  <TabsTrigger value="publicaciones" className="text-sm sm:text-base">Publicaciones</TabsTrigger>
                  <TabsTrigger value="empleos" className="text-sm sm:text-base">Empleos</TabsTrigger>
                  <TabsTrigger value="instituto" className="text-sm sm:text-base">Vida en el instituto</TabsTrigger>
                  <TabsTrigger value="alumnos" className="text-sm sm:text-base">Antiguos alumnos</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <TabsContent value="inicio">
              {renderInicio}
              {renderPublicaciones}
            </TabsContent>
            <TabsContent value="acerca">{renderAcercaDe}</TabsContent>
            <TabsContent value="publicaciones">{renderPublicaciones}</TabsContent>
            <TabsContent value="empleos">
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-[23px] text-gray-900 mb-4">Empleos</h2>
                <p className="text-gray-600 text-sm sm:text-base">No hay empleos disponibles actualmente.</p>
              </div>
            </TabsContent>
            <TabsContent value="instituto">
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Vida en el instituto</h2>
                <p className="text-gray-600 text-sm sm:text-base">No hay información disponible.</p>
              </div>
            </TabsContent>
            <TabsContent value="alumnos">
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Antiguos alumnos</h2>
                <p className="text-gray-600 text-sm sm:text-base">No hay información de antiguos alumnos.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
