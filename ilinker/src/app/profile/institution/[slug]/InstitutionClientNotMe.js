"use client";

import { useState } from 'react';
import { Search, MapPin, Users, Calendar, BookmarkIcon, MessageCircle, Share2, ThumbsUp, GraduationCap, Building2, Clock, BookOpen, ChevronDown, ChevronUp, Briefcase, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Add mock data for job vacancies
const jobVacancies = [
  {
    id: 1,
    company: "TechCorp Solutions",
    position: "Desarrollador Web en Prácticas",
    type: "Prácticas",
    location: "Barcelona",
    modality: "Híbrido",
    schedule: "Media Jornada",
    duration: "3 meses",
    description: "Buscamos estudiantes de último año de DAW para prácticas en desarrollo web con React y Node.js.",
    requirements: [
      "Estudiante de DAW",
      "Conocimientos de React",
      "JavaScript moderno",
      "Git"
    ],
    preferredCourses: ["Desarrollo de Aplicaciones Web"],
    postedDate: "2024-02-10",
    applicationDeadline: "2024-03-10"
  },
  {
    id: 2,
    company: "SystemAdmin Pro",
    position: "Técnico de Sistemas Junior",
    type: "Prácticas",
    location: "Barcelona",
    modality: "Presencial",
    schedule: "Jornada Completa",
    duration: "6 meses",
    description: "Posición para estudiantes de ASIX interesados en administración de sistemas Linux y Windows Server.",
    requirements: [
      "Estudiante de ASIX",
      "Conocimientos de Linux",
      "Windows Server",
      "Redes"
    ],
    preferredCourses: ["Administración de Sistemas Informáticos en Red"],
    postedDate: "2024-02-12",
    applicationDeadline: "2024-03-15"
  }
];

// Mock data for institute
const institutData = {
  institute: {
    name: "Institut Pedralbes",
    description: "Centro público de educación secundaria y formación profesional situado en Barcelona, especializado en tecnología e informática.",
    logo: "/images/logo.svg",
    type: "Centro Público",
    address: "Av. d'Esplugues, 36-42, 08034 Barcelona",
    contact: {
      email: "institutpedralbes@xtec.cat",
      phone: "932 033 332",
      website: "https://www.institutpedralbes.cat"
    },
    levels: ["ESO", "Bachillerato", "Formación Profesional"],
    socialMedia: {
      twitter: "@InsPedralbes",
      instagram: "@inspedralbes"
    }
  },
  educationalOffering: [
    {
      id: "fp-daw",
      title: "Desarrollo de Aplicaciones Web",
      department: "Informática",
      type: "Grado Superior",
      duration: "2 años (2000 horas)",
      schedule: "Mañana / Tarde",
      logo: "/images/daw-logo.svg",
      tags: ["Programación", "Web", "JavaScript", "PHP", "Java"],
      description: "Forma profesionales capaces de desarrollar, implementar y mantener aplicaciones web, con independencia del modelo empleado y utilizando tecnologías específicas.",
      modules: [
        "Programación",
        "Bases de Datos",
        "Lenguajes de Marcas",
        "Desarrollo Web Cliente",
        "Desarrollo Web Servidor"
      ],
      jobOpportunities: [
        "Desarrollador Web",
        "Programador Frontend",
        "Programador Backend",
        "Desarrollador Full Stack"
      ]
    },
    {
      id: "fp-asix",
      title: "Administración de Sistemas Informáticos en Red",
      department: "Informática",
      type: "Grado Superior",
      duration: "2 años (2000 horas)",
      schedule: "Mañana / Tarde",
      logo: "/images/asix-logo.svg",
      tags: ["Redes", "Sistemas", "Linux", "Windows Server", "Virtualización"],
      description: "Forma profesionales capaces de configurar, administrar y mantener sistemas informáticos en red, garantizando la funcionalidad, integridad y servicios del sistema.",
      modules: [
        "Sistemas Operativos",
        "Redes",
        "Servicios de Red",
        "Seguridad",
        "Administración de Sistemas"
      ],
      jobOpportunities: [
        "Administrador de Sistemas",
        "Técnico de Redes",
        "Administrador de Servidores",
        "Responsable de Seguridad"
      ]
    }
  ]
};

// Mock data for students
const students = [
  {
    id: 1,
    name: "Juan Pérez",
    avatar: "/images/user1.jpg",
    course: "Desarrollo de Aplicaciones Web",
  },
  {
    id: 2,
    name: "Ana Gómez",
    avatar: "/images/user2.jpg",
    course: "Administración de Sistemas Informáticos en Red",
  },
  {
    id: 3,
    name: "Carlos López",
    avatar: "/images/user3.jpg",
    course: "Desarrollo de Aplicaciones Web",
  }
];

// Mock data for publications
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
  const [activeTab, setActiveTab] = useState("publications");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCourses, setExpandedCourses] = useState({});
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

  const filteredJobs = jobVacancies.filter(job => {
    const searchString = searchTerm.toLowerCase();
    return (
      job.position.toLowerCase().includes(searchString) ||
      job.company.toLowerCase().includes(searchString) ||
      job.description.toLowerCase().includes(searchString) ||
      job.requirements.some(req => req.toLowerCase().includes(searchString))
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
              <div className="flex flex-col items-center space-y-4">
                <img src={institute.logo} alt={`Logo ${institute.name}`} className="rounded-lg w-32 h-32 object-cover" />
                <div className="text-center">
                  <h2 className="font-semibold text-xl">{institute.name}</h2>
                  <p className="text-muted-foreground">{institute.type}</p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{institute.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{institute.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{institute.levels.join(", ")}</span>
                </div>
              </div>
              <hr className="my-4" />
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Oferta Formativa
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Formación Profesional
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendario Escolar
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contacto
                </Button>
              </nav>
            </div>
          </Card>

          {/* Students Section */}
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Estudiantes del Instituto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm truncate">{student.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{student.course}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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
            <Button
              variant={activeTab === "jobs" ? "default" : "outline"}
              onClick={() => handleTabChange("jobs")}
              className="flex-1 sm:flex-none"
            >
              Empleos
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={
                    activeTab === "jobs"
                      ? "Buscar por empresa, posición o requisitos..."
                      : activeTab === "publications"
                      ? "Buscar por título, autor o contenido..."
                      : "Buscar por nombre, departamento, módulos o tags..."
                  }
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Jobs Content */}
          {activeTab === "jobs" && (
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No se encontraron ofertas de empleo que coincidan con tu búsqueda.</p>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{job.position}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>

                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{job.schedule}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{job.duration}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p>{job.description}</p>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold mb-2">Requisitos:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-muted-foreground">{req}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Preferred Courses */}
                      <div>
                        <h4 className="font-semibold mb-2">Ciclos formativos preferentes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.preferredCourses.map((course, index) => (
                            <Badge key={index} variant="outline">{course}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Publicado: {new Date(job.postedDate).toLocaleDateString()}</span>
                        <span>Fecha límite: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button>
                          <Briefcase className="h-4 w-4 mr-2" />
                          Solicitar práctica
                        </Button>
                        <Button variant="outline">
                          <BookmarkIcon className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartir
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Publications Content */}
          {activeTab === "publications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPublications.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No se encontraron publicaciones que coincidan con tu búsqueda.</p>
                </Card>
              ) : (
                filteredPublications.map((publication) => (
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
                ))
              )}
            </div>
          )}

          {/* Courses Content */}
          {activeTab === "courses" && (
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
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
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
  );
}