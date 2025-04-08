"use client"

import { useState } from "react"
import {
  Pencil, MapPin, Building2, Globe, Mail, Phone, Calendar, Plus, Users, MessageCircle, Share2, Camera, Award, Briefcase, Languages, ChevronRight, X,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { apiRequest } from "@/communicationManager/communicationManager"

export default function InstitutionClientMe({ institution }) {
  const [isEditing, setIsEditing] = useState(null)
  const [institutionData, setInstitutionData] = useState({
    ...institution,
    specialties: institution.specialties || [],
    certifications: institution.certifications || [],
    languages: institution.languages || [],
    about: institution.about || '',
    slogan: institution.slogan || '',
    type: institution.type || '',
    size: institution.size || '',
    founded_year: institution.founded_year || '',
    location: institution.location || '',
    website: institution.website || '',
    phone: institution.phone || '',
    email: institution.email || ''
  })
  const [logoImage, setLogoImage] = useState(institution.logo || "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f")
  const [coverImage, setCoverImage] = useState(institution.cover || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1")

  const handleEdit = (section) => {
    setIsEditing(section)
  }

  const handleSave = async () => {
    try {
      // Call API to save changes
      await apiRequest(`institution/${institution.id}`, 'PUT', institutionData);
      setIsEditing(null)
    } catch (error) {
      console.error('Error saving institution:', error);
    }
  }

  const handleImageUpload = async (event, type) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)

        const response = await apiRequest(`institution/${institution.id}/image`, 'POST', formData)
        
        if (type === "logo") {
          setLogoImage(response.logo_url)
          setInstitutionData(prev => ({ ...prev, logo_url: response.logo_url }))
        } else {
          setCoverImage(response.cover_url)
          setInstitutionData(prev => ({ ...prev, cover_url: response.cover_url }))
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  const updateInstitution = (field, value) => {
    setInstitutionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Secciones renderizadas
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
            value={institutionData.about}
            onChange={(e) => updateInstitution("about", e.target.value)}
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
        <p className="text-gray-600">{institutionData.about}</p>
      )}
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
            {isEditing === "details" ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Tipo de institución</p>
                    <input
                      type="text"
                      value={institutionData.type}
                      onChange={(e) => updateInstitution("type", e.target.value)}
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
                      value={institutionData.size}
                      onChange={(e) => updateInstitution("size", e.target.value)}
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
                      value={institutionData.founded_year}
                      onChange={(e) => updateInstitution("founded_year", e.target.value)}
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
                      value={institutionData.languages.join(", ")}
                      onChange={(e) => updateInstitution("languages", e.target.value.split(", "))}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Guardar
                </button>
              </div>
            ) : (
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
                <button onClick={() => handleEdit("details")} className="text-blue-600 hover:text-blue-800">
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
                {institutionData.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => {
                        const newSpecialties = [...institutionData.specialties]
                        newSpecialties[index] = e.target.value
                        updateInstitution("specialties", newSpecialties)
                      }}
                      className="flex-1 border rounded px-2 py-1 mr-2"
                    />
                    <button
                      onClick={() => {
                        const newSpecialties = institutionData.specialties.filter((_, i) => i !== index)
                        updateInstitution("specialties", newSpecialties)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newSpecialties = [...institutionData.specialties, ""]
                    updateInstitution("specialties", newSpecialties)
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Añadir especialidad
                </button>
                <button
                  onClick={handleSave}
                  className="mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            ) : (
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
                <button
                  onClick={() => handleEdit("specialties")}
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
        <label className="absolute bottom-4 right-4 cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} />
          <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
        </label>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <Tabs defaultValue="inicio">
          {/* Card superior con info del instituto y barra de Tabs */}
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
                          value={institutionData.name}
                          onChange={(e) => updateInstitution("name", e.target.value)}
                          className="text-xl font-bold text-gray-900 border rounded px-2 py-1 w-full"
                        />
                        <input
                          type="text"
                          value={institutionData.slogan}
                          onChange={(e) => updateInstitution("slogan", e.target.value)}
                          className="text-lg text-gray-600 border rounded px-2 py-1 w-full"
                        />
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={institutionData.location}
                            onChange={(e) => updateInstitution("location", e.target.value)}
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
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{institutionData.name}</h1>
                        <p className="text-lg text-gray-600">{institutionData.slogan}</p>
                        <p className="text-gray-500 flex items-center mt-2">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                          {institutionData.location}
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
              </div>

              {/* Información de contacto */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {isEditing === "contact" ? (
                    <>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institutionData.website}
                          onChange={(e) => updateInstitution("website", e.target.value)}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institutionData.phone}
                          onChange={(e) => updateInstitution("phone", e.target.value)}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={institutionData.email}
                          onChange={(e) => updateInstitution("email", e.target.value)}
                          className="flex-1 border rounded px-2 py-1"
                        />
                      </div>
                      <button
                        onClick={handleSave}
                        className="col-span-3 mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
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
