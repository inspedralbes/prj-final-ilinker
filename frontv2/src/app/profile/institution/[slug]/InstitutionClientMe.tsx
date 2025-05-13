"use client"

import React, { useState, useEffect, useContext } from "react"
import {
  Pencil, MapPin, Building2, Globe, Mail, Phone, Calendar, Plus, Users, MessageCircle, Share2, Camera, Award, Briefcase, Languages, ChevronRight, X, Home, Info, BriefcaseIcon, School,
} from "lucide-react"
import { SimpleEditor } from "@/components/templates/simple/SimpleEditor"
import "@/styles/tiptap-content.scss"
import { EmptyStateCard } from "./EmptyStateCard"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { apiRequest } from "@/services/requests/apiRequest"
import config from "@/types/config"
import { LoaderContext } from "@/contexts/LoaderContext"
import { AuthContext } from "@/contexts/AuthContext"
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

interface InstitutionClientMeProps {
  institution: Institution;
}

export default function InstitutionClientMe({ institution }: InstitutionClientMeProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [availableSkills, setAvailableSkills] = useState<Array<{ id: number, name: string }>>([])
  const [institutionData, setInstitutionData] = useState<Institution>({
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
  const [originalData, setOriginalData] = useState<Institution>({ ...institution })
  const [logoImage, setLogoImage] = useState(institution.logo_url || '')
  const [coverImage, setCoverImage] = useState(institution.cover_url || '')
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const handleImageError = (type: 'logo' | 'cover') => {
    if (type === 'logo') {
      setLogoImage('/images/logo.svg')
    } else {
      setCoverImage('/images/default-cover.jpg')
    }
  }

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await apiRequest('skills/', 'GET')
        console.log('Skills data received:', response);

        if (response.status === 'success' && response.data && Array.isArray(response.data)) {
          // console.log('Setting skills:', response.data);
          setAvailableSkills(response.data)
        } else {
          console.log('Invalid skills data structure:', response);
          setAvailableSkills([])
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
        setAvailableSkills([])
      }
    }
    fetchSkills()
  }, [])

  const handleEdit = (section: string) => {
    setOriginalData({ ...institutionData })
    setIsEditing(section)
    setError(null)
  }

  const handleCancel = () => {
    setInstitutionData({ ...institutionData, ...originalData })
    setIsEditing(null)
    setError(null)
  }

  const normalizeArray = (value: string | string[] | undefined): string[] => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(Boolean)
    }
    return []
  }

  const handleSave = async () => {
    showLoader();
    try {
      setError(null)
      if (isEditing === "specialties") {
        const emptySpecialties = (institutionData.specialties || []).some(specialty => !specialty);
        if (emptySpecialties) {
          setError("Por favor selecciona una especialidad para todos los campos o elimina los campos vacíos");
          return;
        }
      }

      let dataToSend: any = { id: institution.id }

      switch (isEditing) {
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
            website: institutionData.website?.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
            phone: institutionData.phone ? String(institutionData.phone).trim() : '',
            email: institutionData.email?.trim()
          }
          break
        case 'details':
          dataToSend = {
            ...dataToSend,
            type: institutionData.type,
            academic_sector: institutionData.academic_sector,
            size: institutionData.size,
            founded_year: institutionData.founded_year,
            languages: normalizeArray(institutionData.languages)
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
            specialties: normalizeArray(institutionData.specialties)
          }
          break
        default:
          dataToSend = {
            ...dataToSend,
            ...institutionData
          }
      }

      console.log('Sending data:', dataToSend);
      const response = await apiRequest('institution/update', 'POST', dataToSend)

      if (response.status === 'success') {
        setInstitutionData(prev => ({
          ...prev,
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
    } catch (error: any) {
      console.error('Error saving institution:', error)
      setError(error.message || 'Error en guardar datos de la institución, por favor intenta de nuevo.')
    } finally{
      hideLoader();
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    showLoader();
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      const formData = new FormData()
      formData.append('id', String(institution.id))
      formData.append(type, file)
      console.log("cambiando")
      const response = await apiRequest('institution/update', 'POST', formData)

      if (response?.status === 'success' && response.data) {
        const url = response.data[`${type}_url`]

        if (url) {
          if (type === 'logo') {
            setLogoImage(url)
            setInstitutionData(prev => ({
              ...prev,
              logo_url: url,
              logo: response.data.logo
            }))
          } else {
            setCoverImage(url)
            setInstitutionData(prev => ({
              ...prev,
              cover_url: url,
              cover: response.data.cover
            }))
          }
        }

        setOriginalData(prev => ({
          ...prev,
          [`${type}_url`]: url,
          [type]: response.data[type]
        }))
      } else {
        throw new Error(response?.message || 'Failed to upload image')
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Error uploading image. Please try again.')
    } finally {
      hideLoader();
    }
  }

  const updateInstitution = (field: string, value: any) => {
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

  const renderAcercaDe = (showFull = false) => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Acerca de</h2>
        <button onClick={() => handleEdit("about")} className="text-blue-600 hover:text-blue-800">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
      {isEditing === "about" ? (
        <div>
          <SimpleEditor
            content={institutionData.about || ''}
            onChange={(html: string) => updateInstitution("about", html)}
          />
          {renderActionButtons()}
          {renderErrorMessage()}
        </div>
      ) : (
        <div
          className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content"
          dangerouslySetInnerHTML={{ __html: institutionData.about || '' }}
        />
      )}

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
            <Building2 className="h-6 w-6 text-gray-800" />
            Detalles del Instituto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing === "details" ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Tipo de institución</p>
                  <input
                    type="text"
                    value={institutionData.academic_sector}
                    onChange={(e) => updateInstitution("academic_sector", e.target.value)}
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
                <Building2 className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de institución</p>
                  <p className="text-gray-900">{institutionData.academic_sector}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="text-gray-900">{institutionData.size}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Año de fundación</p>
                  <p className="text-gray-900">{institutionData.founded_year}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Languages className="h-5 w-5 text-gray-600 mr-3" />
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
        </CardContent>
      </Card>
    </div>
  )

  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  }

  const renderSpecialties = () => (
    <div className="mt-6 md:mt-0">
      <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-gray-800" />
            Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing === "specialties" ? (
            <div>
              {ensureArray(institutionData.specialties).map((specialty: string, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <select
                    value={specialty}
                    onChange={(e) => {
                      const newSpecialties = [...(institutionData.specialties || [])]
                      newSpecialties[index] = e.target.value
                      updateInstitution("specialties", newSpecialties)
                    }}
                    className="flex-1 border rounded px-2 py-1 mr-2"
                  >
                    <option value=" ">Seleccionar una especialidad</option>
                    {Array.isArray(availableSkills) && availableSkills.map((skill) => (
                      <option key={skill.id} value={skill.name}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const newSpecialties = (institutionData.specialties || []).filter((_, i) => i !== index)
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
                Añadir
              </button>
              {renderActionButtons()}
              {renderErrorMessage()}
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2">
                {ensureArray(institutionData.specialties).map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Award className="h-4 w-4 mr-1.5 text-gray-600" />
                    {specialty}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleEdit("specialties")}
                className="mt-4 text-gray-600 hover:text-gray-800"
              >
                <Pencil className="h-4 w-4 inline mr-1 text-gray-600" />
                Editar especialidades
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative h-40 sm:h-60 md:h-72 lg:h-80 xl:h-96 bg-gray-300">
        <img
          src={config.storageUrl+institutionData.cover}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={() => handleImageError('cover')}
        />
        <label className="absolute bottom-4 right-4 cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} />
          <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
        </label>
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
                      src={config.storageUrl+institutionData.logo}
                      alt={institutionData.name}
                      onError={() => handleImageError('logo')}
                    />
                    <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
                      <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70" />
                    </label>
                  </div>
                  <div className="flex-1 pt-1">
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
                          <MapPin className="h-5 w-5 text-indigo-500" />
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{institutionData.name}</h1>
                        <p className="text-base sm:text-lg text-gray-600">{institutionData.slogan}</p>
                        <p className="text-gray-500 flex items-center mt-2">
                          <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                          {institutionData.location}
                        </p>
                        <button
                          onClick={() => handleEdit("basic")}
                          className="mt-2 flex items-center text-gray-600 hover:text-gray-800"
                        >
                          <Pencil className="h-4 w-4 mr-1 text-gray-600" />
                          Editar información básica
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección de contacto */}
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {isEditing === "contact" ? (
                    <div className="w-full">
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center flex-1">
                          <Globe className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            value={institutionData.website}
                            onChange={(e) => updateInstitution("website", e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                            placeholder="Sitio web"
                          />
                        </div>
                        <div className="flex items-center flex-1">
                          <Phone className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            value={institutionData.phone}
                            onChange={(e) => updateInstitution("phone", e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                            placeholder="Teléfono"
                          />
                        </div>
                        <div className="flex items-center flex-1">
                          <Mail className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            value={institutionData.email}
                            onChange={(e) => updateInstitution("email", e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        {renderActionButtons()}
                        {renderErrorMessage()}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 text-gray-600 mr-2" />
                          <a href={institutionData.website?.startsWith('http') ? institutionData.website : `https://${institutionData.website}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            {institutionData.website}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-gray-600">{institutionData.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-600 mr-2" />
                          <span className="text-gray-600">{institutionData.email}</span>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => handleEdit("contact")}
                          className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 inline mr-2 text-blue-600" />
                          Editar información
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Esta parte es de la sección de tabs */}
              <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4 sm:pt-6">
                <TabsList className="flex justify-center sm:justify-start space-x-1 sm:space-x-4 p-1 rounded-lg bg-gray-50">
                  <TabsTrigger value="inicio" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">
                    <Home className="h-5 w-5 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Inicio</span>
                  </TabsTrigger>
                  <TabsTrigger value="acerca" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">
                    <Info className="h-5 w-5 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Acerca de</span>
                  </TabsTrigger>
                  <TabsTrigger value="publicaciones" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">
                    <Plus className="h-5 w-5 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Publicaciones</span>
                  </TabsTrigger>
                  <TabsTrigger value="empleos" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">
                    <BriefcaseIcon className="h-5 w-5 sm:h-5 sm:w-5 text-gray-500" />
                    <span className="hidden sm:inline ml-2 text-sm sm:text-base">Empleos</span>
                  </TabsTrigger>
                  <TabsTrigger value="instituto" className="flex items-center justify-center p-2 sm:p-3 rounded-md transition-all hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700">
                    <School className="h-5 w-5 sm:h-5 sm:w-5 text-gray-500" />
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
    </div>
  )
}
