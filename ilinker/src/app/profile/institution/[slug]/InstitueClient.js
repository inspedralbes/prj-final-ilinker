"use client"

import { useState } from "react"
import {
  MapPin, Building2, Globe, Mail, Phone, Calendar, Users, MessageCircle, Share2, Camera, Award, Briefcase, Languages, ChevronRight,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function InstitutionClient({ institution }) {
  const institutionData = {
    ...institution,
    specialties: institution.specialties || [],
    certifications: institution.certifications || [],
    languages: institution.languages || []
  }

  const [logoImage, setLogoImage] = useState(institutionData.logo || "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f")
  const [coverImage, setCoverImage] = useState(institutionData.cover || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1")

  // Secciones renderizadas
  const renderAcercaDe = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
      </div>
      <p className="text-gray-600">{institutionData.about}</p>
    </div>
  )

  const renderEmpleos = (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg text-[23px] text-gray-900 mb-4">Empleos</h2>
      <p className="text-gray-600">No hay empleos disponibles actualmente.</p>
    </div>
  )

  const renderInicio = (
    <>
      {renderAcercaDe}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Instituto</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de institución</p>
                  <p className="text-gray-900">{institutionData.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="text-gray-900">{institutionData.size}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Año de fundación</p>
                  <p className="text-gray-900">{institutionData.founded_year}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Languages className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Idiomas</p>
                  <p className="text-gray-900">{institutionData.languages.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
            <div>
              <div className="flex flex-wrap gap-2">
                {institutionData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certificaciones */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Certificaciones y Acreditaciones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutionData.certifications.map((cert) => (
              <div key={cert.id} className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-gray-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-500">
                    Otorgado por {cert.issued_by} • {cert.year}
                  </p>
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

  // Render principal
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo */}
      <div className="relative h-60 sm:h-72 md:h-80 lg:h-96 bg-gray-300">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <Tabs defaultValue="inicio">
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:space-x-5 items-center">
                  <div className="relative flex-shrink-0">
                    <img
                      className="mx-auto h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-lg border-4 border-white shadow-lg object-cover"
                      src={logoImage}
                      alt={institutionData.name}
                    />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{institutionData.name}</h1>
                      <p className="text-lg text-gray-600">{institutionData.slogan}</p>
                      <p className="text-gray-500 flex items-center mt-2">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                        {institutionData.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                      Contactar
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Users className="h-5 w-5 mr-2 text-gray-400" />
                      Seguir
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Información de contacto */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <a href={`https://${institutionData.website}`} className="text-blue-600 hover:underline">
                      {institutionData.website}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{institutionData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{institutionData.email}</span>
                  </div>
                </div>
              </div>
              {/* Barra de Tabs */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <TabsList>
                  <TabsTrigger value="inicio">Inicio</TabsTrigger>
                  <TabsTrigger value="acerca">Acerca de</TabsTrigger>
                  <TabsTrigger value="empleos">Empleos</TabsTrigger>
                  <TabsTrigger value="instituto">Vida en el instituto</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* Card inferior con el contenido de cada pestaña */}
          <div className="mt-4 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <TabsContent value="inicio">{renderInicio}</TabsContent>
            <TabsContent value="acerca">{renderAcercaDe}</TabsContent>
            <TabsContent value="empleos">{renderEmpleos}</TabsContent>
            <TabsContent value="instituto">{renderEmpleos}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
