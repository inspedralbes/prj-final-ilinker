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
  Home,
  Info,
  BriefcaseIcon,
  School,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmptyStateCard } from "./EmptyStateCard"

interface Institution {
  id: string | number;
  name: string;
  slogan?: string;
  about?: string;
  location?: string;
  type?: string;
  academic_sector?: string;
  size?: string;
  founded_year?: string;
  website?: string;
  phone?: string;
  email?: string;
  logo?: string;
  logo_url?: string;
  cover?: string;
  cover_url?: string;
  specialties?: string[];
  certifications?: string[];
  languages?: string[];
}

interface InstitutionClientNotMeProps {
  institution: Institution;
}

export default function InstitutionClientNotMe({ institution }: InstitutionClientNotMeProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [logoImage, setLogoImage] = useState(institution.logo_url || '/images/logo.svg')
  const [coverImage, setCoverImage] = useState(institution.cover_url || '/images/default-cover.jpg')

  const handleImageError = (type: 'logo' | 'cover') => {
    if (type === 'logo') {
      setLogoImage('/images/logo.svg')
    } else {
      setCoverImage('/images/default-cover.jpg')
    }
  }

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
      <div
        className="text-gray-600 text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: institution.about || '' }}
      />
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
                  <p className="text-gray-900 text-sm sm:text-base">{institution.type || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institution.size || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Año de fundación</p>
                  <p className="text-gray-900 text-sm sm:text-base">{institution.founded_year || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Languages className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Idiomas</p>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {institution.languages?.join(", ") || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6 lg:mt-0">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {institution.specialties?.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                >
                  {specialty}
                </span>
              )) || <p className="text-gray-500">No hay especialidades especificadas</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Certificaciones y Acreditaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institution.certifications?.map((cert, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Award className="h-6 w-6 text-gray-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{cert}</h3>
              </div>
            </div>
          )) || <p className="text-gray-500">No hay certificaciones especificadas</p>}
        </div>
      </div>
    </>
  )

  const renderEmpleos = (
    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6">
      <h2 className="text-lg sm:text-[23px] text-gray-900 mb-4">Empleos</h2>
      <EmptyStateCard
        icon={<BriefcaseIcon className="h-8 w-8 text-gray-400" />}
        title="No hay empleos disponibles"
        subtitle="Actualmente no hay ofertas de empleo publicadas."
      />
    </div>
  )

  const renderInstituto = (
    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6">
      <h2 className="text-lg sm:text-[23px] text-gray-900 mb-4">Vida en el instituto</h2>
      <EmptyStateCard
        icon={<School className="h-8 w-8 text-gray-400" />}
        title="No hay información disponible"
        subtitle="No hay contenido sobre la vida en el instituto."
      />
    </div>
  )

  const renderPublicaciones = (
    <div className="mt-4 sm:mt-6">
      <h2 className="text-lg sm:text-[23px] text-gray-900 mb-4">Publicaciones</h2>
      <EmptyStateCard
        icon={<MessageCircle className="h-8 w-8 text-gray-400" />}
        title="No hay publicaciones"
        subtitle="No hay publicaciones disponibles en este momento."
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-48 sm:h-64 md:h-80 bg-gray-300">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={() => handleImageError('cover')}
        />
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
                      src={logoImage}
                      alt={institution.name}
                      onError={() => handleImageError('logo')}
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{institution.name}</h1>
                    <p className="text-base sm:text-lg text-gray-600">{institution.slogan || ''}</p>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start mt-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm sm:text-base">{institution.location || 'Ubicación no especificada'}</span>
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
                    <a href={`https://${institution.website}`} className="text-blue-600 hover:underline text-sm sm:text-base">
                      {institution.website || 'Sitio web no especificado'}
                    </a>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 text-sm sm:text-base">{institution.phone || 'Teléfono no especificado'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 text-sm sm:text-base">{institution.email || 'Email no especificado'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                <TabsList className="flex justify-center sm:justify-start space-x-1 sm:space-x-4 p-1 rounded-lg bg-gray-50">
                  <TabsTrigger value="inicio" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-blue-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                    <Home className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Inicio</span>
                  </TabsTrigger>
                  <TabsTrigger value="acerca" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-blue-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                    <Info className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Acerca de</span>
                  </TabsTrigger>
                  <TabsTrigger value="publicaciones" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-blue-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                    <MessageCircle className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Publicaciones</span>
                  </TabsTrigger>
                  <TabsTrigger value="empleos" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-blue-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                    <BriefcaseIcon className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Empleos</span>
                  </TabsTrigger>
                  <TabsTrigger value="instituto" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-blue-50 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">
                    <School className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Vida en el instituto</span>
                  </TabsTrigger>
                </TabsList>
              </div>

            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <TabsContent value="inicio">
              {renderInicio}
            </TabsContent>
            <TabsContent value="acerca">{renderAcercaDe}</TabsContent>
            <TabsContent value="publicaciones">{renderPublicaciones}</TabsContent>
            <TabsContent value="empleos">{renderEmpleos}</TabsContent>
            <TabsContent value="instituto">{renderInstituto}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
