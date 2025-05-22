"use client"

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
import { useState } from "react"

export default function InstitutionClientNotMe({ institution }) {
  const [visiblePublications, setVisiblePublications] = useState(3)
  const [isFollowing, setIsFollowing] = useState(false)

  if (!institution) {
    return null;
  }

  const institute = {
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

const publications = [
  {
    id: 1,
    title: "Jornada de Puertas Abiertas 2024",
    date: "2024-02-15",
    author: "Dirección del Centro",
    image: "/images/open-day.jpg",
    excerpt: "Este sábado celebramos nuestra jornada anual de puertas abiertas. Ven a conocer nuestras instalaciones y oferta formativa.",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: "Éxito en el Hackathon de Ciberseguridad",
    date: "2024-02-10",
    author: "Departamento de Informática",
    image: "/images/hackathon.jpg",
    excerpt: "Nuestros estudiantes de ASIX obtuvieron el primer premio en el hackathon regional de ciberseguridad.",
    likes: 72,
    comments: 8
  },
  {
    id: 3,
    title: "Nuevo Laboratorio de Desarrollo Web",
    date: "2024-02-05",
    author: "Coordinación DAW",
    image: "/images/lab.jpg",
    excerpt: "Inauguramos un nuevo espacio dedicado al desarrollo web con equipamiento de última generación.",
    likes: 56,
    comments: 15
  }
];

export default function InstitutPedralbes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [activeTab, setActiveTab] = useState("publications");
  const { institute, educationalOffering } = institutData;

  // Search filter functions
  const filteredPublications = publications.filter(publication => {
    const searchString = searchTerm.toLowerCase();
    return (
      publication.title.toLowerCase().includes(searchString) ||
      publication.author.toLowerCase().includes(searchString) ||
      publication.excerpt.toLowerCase().includes(searchString)
    );
  });

  const filteredCourses = educationalOffering.filter(course => {
    const searchString = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchString) ||
      course.department.toLowerCase().includes(searchString) ||
      course.type.toLowerCase().includes(searchString) ||
      course.description.toLowerCase().includes(searchString) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchString)) ||
      course.modules.some(module => module.toLowerCase().includes(searchString)) ||
      course.jobOpportunities.some(job => job.toLowerCase().includes(searchString))
    );
  });

  const toggleCourse = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1">
          <Card className="p-6">
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

      {/* Certificaciones */}
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

        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeTab === "publications" ? "default" : "outline"}
              onClick={() => handleTabChange("publications")}
              className="flex-1 sm:flex-none"
            >
              Publicaciones
            </Button>
            <Button
              variant={activeTab === "courses" ? "default" : "outline"}
              onClick={() => handleTabChange("courses")}
              className="flex-1 sm:flex-none"
            >
              Ciclos Formativos
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={
                    activeTab === "publications"
                      ? "Buscar por título, autor o contenido..."
                      : "Buscar por nombre, departamento, módulos o tags..."
                  }
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
        {publications.map((pub) => (
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

          {activeTab === "publications" ? (
            // Publications Grid with Search Results
            <>
              {filteredPublications.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No se encontraron publicaciones que coincidan con tu búsqueda.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPublications.map((publication) => (
                    <Card key={publication.id} className="overflow-hidden h-full">
                      <div className="relative h-40 w-full">
                        <img
                          src={publication.image}
                          alt={publication.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{publication.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Por {publication.author} • {formatDate(publication.date)}
                            </p>
                          </div>
                        </div>
                        <p className="mb-4 text-sm">{publication.excerpt}</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {publication.likes}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {publication.comments}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Compartir
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Courses Content with Search Results
            <>
              <Card className="mb-6 p-6">
                <h3 className="text-xl font-semibold mb-4">Sobre el {institute.name}</h3>
                <p className="text-muted-foreground">
                  {institute.description}
                </p>
              </Card>

              {filteredCourses.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No se encontraron ciclos formativos que coincidan con tu búsqueda.</p>
                </Card>
              ) : (
                // ... (previous code remains the same until the courses mapping)

                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:space-x-4">
                        <img
                          src={course.logo}
                          alt={`${course.title} logo`}
                          className="w-16 h-16 rounded mb-4 md:mb-0 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">{course.title}</h3>
                          <p className="text-muted-foreground">{course.department}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              {course.type}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </span>
                          </div>
                          <p className="mt-4">{course.description}</p>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCourse(course.id)}
                            className="mt-4"
                          >
                            {expandedCourses[course.id] ? (
                              <>Ver menos <ChevronUp className="ml-2 h-4 w-4" /></>
                            ) : (
                              <>Ver más <ChevronDown className="ml-2 h-4 w-4" /></>
                            )}
                          </Button>

                          {expandedCourses[course.id] && (
                            <div className="mt-4 space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {course.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Módulos principales:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {course.modules.map((module, index) => (
                                    <li key={index}>{module}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Salidas profesionales:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                  {course.jobOpportunities.map((job, index) => (
                                    <li key={index}>{job}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Me interesa
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Consultar
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Compartir
                                </Button>
                                <Button variant="outline" size="sm">
                                  <BookmarkIcon className="h-4 w-4 mr-2" />
                                  Guardar
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
