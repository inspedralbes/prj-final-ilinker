"use client"

import React, { useState } from "react"
import {
  MapPin, Building2, Globe, Mail, Phone, Calendar, Plus, Users, MessageCircle, Share2, Award, Briefcase, Languages, Home, Info, BriefcaseIcon, School, Flag, AlertTriangle,
} from "lucide-react"
import "@/styles/tiptap-content.scss"
import { EmptyStateCard } from "./EmptyStateCard"
import { Textarea } from "@/components/ui/textarea"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useModal } from "@/hooks/use-modal"
import { apiRequest } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { showLoader, hideLoader } from "@/lib/loader"

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
  const [institutionData] = useState<Institution>({
    ...institution,
    specialties: Array.isArray(institution.specialties) ? institution.specialties : [],
    certifications: Array.isArray(institution.certifications) ? institution.certifications : [],
    languages: Array.isArray(institution.languages) ? institution.languages : [],
    about: institution.about || '',
    slogan: institution.slogan || '',
    academic_sector: institution.academic_sector || '',
    size: institution.size || '',
    founded_year: institution.founded_year || '',
    location: institution.location || '',
    website: institution.website || '',
    phone: institution.phone || '',
    email: institution.email || ''
  })
  const [logoImage, setLogoImage] = useState(institution.logo_url || '')
  const [coverImage, setCoverImage] = useState(institution.cover_url || '')
  const reportModal = useModal();
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const handleImageError = (type: 'logo' | 'cover') => {
    if (type === 'logo') {
      setLogoImage('/images/logo.svg')
    } else {
      setCoverImage('/images/default-cover.jpg')
    }
  }

  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  }

  const renderAcercaDe = (showFull = false) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
      </div>
      <div
        className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content"
        dangerouslySetInnerHTML={{ __html: institutionData.about || '' }}
      />

      {showFull && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderDetails()}
            {renderSpecialties()}
          </div>
        </div>
      )}
    </div>
  )

  const renderEmpleos = () => (
    <div className="mt-6">
      <EmptyStateCard
        icon={<Briefcase className="h-12 w-12 text-yellow-400 mx-auto" />}
        title="No hay empleos ahora mismo."
        subtitle="Crea una alerta de empleo y te avisaremos cuando se publiquen empleos relevantes."
      />
    </div>
  )

  const renderInstituto = () => (
    <div className="mt-6">
      <EmptyStateCard
        icon={<Users className="h-12 w-12 text-blue-400 mx-auto" />}
        title="No hay información de vida en el instituto."
        subtitle="Pronto podrás ver actividades, eventos y más sobre la vida en el instituto."
      />
    </div>
  )

  const renderPublicaciones = () => (
    <div className="mt-6">
      <EmptyStateCard
        icon={<Plus className="h-12 w-12 text-green-400 mx-auto" />}
        title="No hay publicaciones aún."
        subtitle="Cuando se publiquen novedades o noticias, aparecerán aquí."
      />
    </div>
  )

  const renderDetails = () => (
    <div className="transform transition-all duration-300 hover:scale-[1.02]">
      <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Detalles del Instituto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tipo de institución</p>
                <p className="text-gray-900">{institutionData.academic_sector}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tamaño</p>
                <p className="text-gray-900">{institutionData.size}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Año de fundación</p>
                <p className="text-gray-900">{institutionData.founded_year}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Languages className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Idiomas</p>
                <p className="text-gray-900">{Array.isArray(institutionData.languages) ? institutionData.languages.join(", ") : institutionData.languages}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSpecialties = () => (
    <div className="mt-6 md:mt-0">
      <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-wrap gap-2">
              {ensureArray(institutionData.specialties).map((specialty: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200"
                >
                  <Award className="h-4 w-4 mr-1.5" />
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
      reported_user_id: institution.id,
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-40 sm:h-60 md:h-72 lg:h-80 xl:h-96 bg-gray-300">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={() => handleImageError('cover')}
        />
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 -mt-16 sm:-mt-20">
        <Tabs defaultValue="inicio">
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
              {/* Reorganizado para móvil: foto a la izquierda e información a la derecha */}
              <div className="flex flex-row sm:items-center sm:justify-between">
                <div className="flex flex-row space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                      src={logoImage}
                      alt={institutionData.name}
                      onError={() => handleImageError('logo')}
                    />
                  </div>
                  <div className="flex-1 pt-1">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{institutionData.name}</h1>
                      <p className="text-base sm:text-lg text-gray-600">{institutionData.slogan}</p>
                      <p className="text-gray-500 flex items-center mt-2">
                        <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                        {institutionData.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de contacto */}
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <div className="w-full">
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className="flex items-center px-3 py-2 rounded-md">
                        <Globe className="h-5 w-5 text-indigo-500 mr-2" />
                        <a href={institutionData.website?.startsWith('http') ? institutionData.website : `https://${institutionData.website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {institutionData.website}
                        </a>
                      </div>
                      <div className="flex items-center px-3 py-2 rounded-md">
                        <Phone className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-600">{institutionData.phone}</span>
                      </div>
                      <div className="flex items-center px-3 py-2 rounded-md">
                        <Mail className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-600">{institutionData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Esta parte es de la sección de tabs */}
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
                    <Plus className="h-5 w-5 sm:h-5 sm:w-5 text-indigo-500" />
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

          <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <TabsContent value="inicio">
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                {renderAcercaDe()}
                <div className="mt-6 sm:mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {renderDetails()}
                    {renderSpecialties()}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="acerca">{renderAcercaDe(true)}</TabsContent>
            <TabsContent value="empleos">{renderEmpleos()}</TabsContent>
            <TabsContent value="instituto">{renderInstituto()}</TabsContent>
            <TabsContent value="publicaciones">{renderPublicaciones()}</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Botón para reportar */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 mt-4">
        <div className="flex justify-center">
          <button
            onClick={reportModal.openModal}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Flag className="h-5 w-5 mr-2 text-gray-400" />
            Reportar
          </button>
        </div>
      </div>

      {/* Modal de reporte */}
      <Modal
        isOpen={reportModal.isOpen}
        onClose={reportModal.closeModal}
        id="report-modal"
        size="md"
        title={`Reportar a ${institution.name}`}
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
    </div>
  )
}