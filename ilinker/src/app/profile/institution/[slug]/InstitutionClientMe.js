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
  const [error, setError] = useState(null)
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
  const [originalData, setOriginalData] = useState({...institution})

  const [logoImage, setLogoImage] = useState(institution.logo_url || "https://images.unsplash.com/photo-1494537176433-7a3c4ef2046f")
  const [coverImage, setCoverImage] = useState(institution.cover_url || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1")

  const handleEdit = (section) => {
    // Store the current state before editing
    setOriginalData({...institutionData})
    setIsEditing(section)
    setError(null)
  }

  const handleCancel = () => {
    // Restore original data for the section being edited
    setInstitutionData({...institutionData, ...originalData})
    setIsEditing(null)
    setError(null)
  }

  const cleanArrayFields = (data) => {
    if (typeof data.languages === 'string') {
      data.languages = data.languages.split(',').map(item => item.trim()).filter(Boolean)
    }
    if (typeof data.specialties === 'string') {
      data.specialties = data.specialties.split(',').map(item => item.trim()).filter(Boolean)
    }
    return data
  }

  const handleSave = async () => {
    try {
      setError(null)
      let dataToSend = { id: institution.id }

      switch(isEditing) {
        case 'basic':
          dataToSend = {
            ...dataToSend,
            name: institutionData.name,
            slogan: institutionData.slogan,
            location: institutionData.location
          }
          break
        case 'contact':
          dataToSend = {
            ...dataToSend,
            website: institutionData.website,
            phone: institutionData.phone,
            email: institutionData.email
          }
          break
        case 'details':
          dataToSend = {
            ...dataToSend,
            type: institutionData.type,
            size: institutionData.size,
            founded_year: institutionData.founded_year,
            languages: Array.isArray(institutionData.languages) ? institutionData.languages : institutionData.languages.split(',').map(l => l.trim())
          }
          break
        case 'about':
          dataToSend = {
            ...dataToSend,
            about: institutionData.about
          }
          break
        case 'specialties':
          dataToSend = {
            ...dataToSend,
            specialties: Array.isArray(institutionData.specialties) ? institutionData.specialties : institutionData.specialties.split(',').map(s => s.trim())
          }
          break
        default:
          dataToSend = {
            ...dataToSend,
            ...institutionData
          }
      }
      
      dataToSend = cleanArrayFields(dataToSend)
      const response = await apiRequest('institution/update', 'POST', dataToSend)
      
      if (response.status === 'success') {
        setInstitutionData(prevState => ({
          ...prevState,
          ...response.data
        }))

        if (response.data.logo_url) {
          setLogoImage(response.data.logo_url)
        }
        if (response.data.cover_url) {
          setCoverImage(response.data.cover_url)
        }
        
        setIsEditing(null)
      } else {
        throw new Error(response.message || 'Failed to update institution')
      }
    } catch (error) {
      console.error('Error saving institution:', error)
      setError(error.message || 'Failed to save changes. Please try again.')
      
      if (error.response?.status === 422 && error.response.data?.errors) {
        const errorMessage = Object.values(error.response.data.errors).flat().join('\n')
        setError(errorMessage)
      }
    }
  }

  const handleImageUpload = async (event, type) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      try {
        setError(null)
        const formData = new FormData()
        formData.append(type, file)
        formData.append('id', institution.id)

        const response = await apiRequest('institution/update', 'POST', formData, true)
        
        if (response?.data) {
          const imageUrl = response.data[`${type}_url`] || 
            (response.data[type] ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${response.data[type]}` : null)

          if (imageUrl) {
            if (type === 'logo') {
              setLogoImage(imageUrl)
              setInstitutionData(prev => ({
                ...prev,
                logo: response.data.logo,
                logo_url: imageUrl
              }))
            } else {
              setCoverImage(imageUrl)
              setInstitutionData(prev => ({
                ...prev,
                cover: response.data.cover,
                cover_url: imageUrl
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setError('Failed to upload image. Please try again.')
      }
    }
  }

  const updateInstitution = (field, value) => {
    setInstitutionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderErrorMessage = () => {
    if (!error) return null
    return (
      <div className="mt-2 text-red-600 text-sm">
        {error}
      </div>
    )
  }

  const renderActionButtons = () => (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Guardar
      </button>
      <button
        onClick={handleCancel}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      >
        Cancelar
      </button>
    </div>
  )

  // la parte dpnde muestra informacion sobre instituto 
  const renderAcercaDe = () => (
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
          {renderActionButtons()}
          {renderErrorMessage()}
        </div>
      ) : (
        <p className="text-gray-600">{institutionData.about}</p>
      )}
    </div>
  )

  const renderEmpleos = () => (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg text-[23px] text-gray-900 mb-4">Empleos</h2>
      <p className="text-gray-600">No hay empleos disponibles actualmente.</p>
    </div>
  )

  const renderDetails = () => (
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
                value={institutionData.academic_sector}
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
              <p className="text-sm text-gray-500">Idiomas (separados por coma)</p>
              <input
                type="text"
                value={Array.isArray(institutionData.languages) ? institutionData.languages.join(", ") : institutionData.languages}
                onChange={(e) => updateInstitution("languages", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
          {renderActionButtons()}
          {renderErrorMessage()}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Tipo de institución</p>
              <p className="text-gray-900">{institutionData.academic_sector}</p>
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
              <p className="text-gray-900">{Array.isArray(institutionData.languages) ? institutionData.languages.join(", ") : institutionData.languages}</p>
            </div>
          </div>
          <button onClick={() => handleEdit("details")} className="text-blue-600 hover:text-blue-800">
            <Pencil className="h-4 w-4 inline mr-1" />
            Editar detalles
          </button>
        </div>
      )}
    </div>
  )

  const renderSpecialties = () => (
    <div className="mt-6 md:mt-0">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
      {isEditing === "specialties" ? (
        <div>
          {(institutionData.specialties || []).map((specialty, index) => (
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
              updateInstitution("specialties", [...(institutionData.specialties || []), ""])
            }}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Añadir especialidad
          </button>
          {renderActionButtons()}
          {renderErrorMessage()}
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2">
            {(institutionData.specialties || []).map((specialty, index) => (
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
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-60 sm:h-72 md:h-80 lg:h-96 bg-gray-300">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        <label className="absolute bottom-4 right-4 cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} />
          <Camera className="h-8 w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
        </label>
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
                    <label className="absolute bottom-2 right-2 cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
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
                        {renderActionButtons()}
                        {renderErrorMessage()}
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
                      <div className="col-span-3">
                        {renderActionButtons()}
                        {renderErrorMessage()}
                      </div>
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

          <div className="mt-4 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <TabsContent value="inicio">
              <div className="mt-6 border-t border-gray-200 pt-6">
                {renderAcercaDe()}
                <div className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDetails()}
                    {renderSpecialties()}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="acerca">{renderAcercaDe()}</TabsContent>
            <TabsContent value="empleos">{renderEmpleos()}</TabsContent>
            <TabsContent value="instituto">{renderEmpleos()}</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}