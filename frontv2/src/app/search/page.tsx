"use client";

import { useContext, useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  ChevronDown,
  Building2,
  Clock,
  BookmarkPlus,
  Globe,
  Users,
  Banknote,
  GraduationCap,
  X,
  LogIn,
  UserPlus,
  AlertCircle,
  Mail,
  Phone,
  File,
  FileSignature,
  FileText,
  Calendar,
  CheckCircle,
  BookmarkCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";
import Modal from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function SearchClient() {
  const [latestOffers, setLatestOffers] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isJobDetailOpen, setIsJobDetailOpen] = useState(false);
  const [selectedInfoJob, setSelectedInfoJob] = useState<any | null>(null);
  const { loggedIn, userData } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();
  const { toast } = useToast();

  const infoApplyModal = useModal();

  const handleApplyOffer = async () => {
    console.log("apply offer");
    showLoader();

    if (!userData) {
      router.push("/login");
      return;
    }

    if (userData.rol === "student") {
      const response = await apiRequest("student/offer/get-data");
      if (response.status === "success") {
        setStep(1);
        response.student.email = userData?.email;
        response.student.cover_letter_attachment = null;
        response.student.cv_attachment = null;
        response.student.availability = "";
        response.student.offer_id = selectedInfoJob.id;

        setStudentData(response.student);
        infoApplyModal.openModal();
      } else {
        //change for toast for better user experience
        toast({
          title: "Error al obtener los datos del estudiante",
          description: "Error al obtener los datos del estudiante.",
          variant: "error",
        });
      }
      hideLoader();
      return;
    }

    toast({
      title: "Error al optar a la oferta",
      description: "Solo los estudiantes pueden optar a la oferta.",
      variant: "destructive",
    });
    hideLoader();
  };
  const handleRedirectLogin = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    showLoader();
    if (!userData) {
      // router.push("/auth/login");
      console.log("no logged");
    }

    apiRequest("page/search")
      .then((response) => {
        handleSelectedInfoJob(response.data[0]);
        setLatestOffers(response.data);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        hideLoader();
      });
  }, [userData, router]);

  //data for the modal to apply
  const [step, setStep] = useState(1);
  const [studentData, setStudentData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    showLoader();
    setError(null);

    try {
      console.log("candidatura hecha");
      showLoader();
      console.log(studentData);

      // 1) Construye el FormData
      const formData = new FormData();
      formData.append("offer_id", studentData.offer_id.toString());
      formData.append("user_id", studentData.user_id.toString());
      formData.append("availability", studentData.availability);

      // Solo añades cv si es un File
      if (studentData.cv_attachment) {
        formData.append("cv_attachment", studentData.cv_attachment);
      }

      // Solo añades cover letter si es un File
      if (studentData.cover_letter_attachment) {
        formData.append(
          "cover_letter_attachment",
          studentData.cover_letter_attachment
        );
      }

      const response = await apiRequest("offers/apply", "POST", formData);
      if (response.status !== "success")
        throw new Error(response.message || "Error al enviar");
      next(); // pasa al paso de confirmación
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoader();
    }
  };

  const handleNextStepApplyOffer = () => {
    if (step === 1) {
      console.log("validar step 1");
    }
    next();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setStudentData((prev: any) => ({
        ...prev,
        cover_letter_attachment: file,
      }));
    }
  };

  const JobDetails = () => {
    return selectedInfoJob !== null ? (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{selectedInfoJob.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Building2 className="h-4 w-4" />
            <Link
              href={`/profile/company/${selectedInfoJob?.company?.slug}`}
              className="ml-2"
            >
              <span>{selectedInfoJob.company.name}</span>
            </Link>
            <MapPin className="h-4 w-4 ml-2" />
            <span>{selectedInfoJob.address}</span>
          </div>
          <div className="flex gap-4">
            {selectedInfoJob?.userHasApplied ? (
              <Button
                variant="outline"
                size="icon"
                disabled
                className="w-full flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
              >
                <BookmarkCheck className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Ya estás inscrito</span>
              </Button>
            ) : (
              <Button
                className="w-full flex-1"
                onClick={loggedIn ? handleApplyOffer : handleRedirectLogin}
              >
                <BookmarkPlus className="h-5 w-5 mr-2" />
                <span>Apply Now</span>
              </Button>
            )}
            <Button variant="outline" size="icon">
              <BookmarkPlus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>Remote available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>501-1,000 employees</span>
          </div>
          {/*<div className="flex items-center gap-2 text-sm">*/}
          {/*    <Banknote className="h-4 w-4 text-muted-foreground"/>*/}
          {/*    <span>$130K - $180K</span>*/}
          {/*</div>*/}
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Bachelor's degree</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div
            dangerouslySetInnerHTML={{ __html: selectedInfoJob.description }}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            About {selectedInfoJob.company.name}
          </h3>
          <p className="text-muted-foreground">
            {selectedInfoJob.company.short_description}
          </p>
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center h-full w-full">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="mt-2 text-muted-foreground">Cargando...</span>
      </div>
    );
  };

  useEffect(() => {
    setSelectedInfoJob(selectedJob);
  }, [selectedJob]);

  const handleSelectedInfoJob = (job: any) => {
    console.log("seleccionado");
    setSelectedJob(null);
    try {
      //verificar si ya esta optando a esta oferta
      apiRequest(`offers/apply-check/${job.id}`)
        .then((response) => {
          if (response.status === "success") {
            job.userHasApplied = response.userHasApplied;
            setSelectedJob(job);
            if (window.innerWidth < 768) {
              setIsJobDetailOpen(true);
            }
          } else {
            toast({
              title: "Error",
              description: "Error al mostrar la oferta",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {});
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al mostrar la oferta",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="">
      {/*<SearchHeader />*/}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-2 mt-8 max-w-7xl">
        {/* Search Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8 hidden">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, keywords, companies"
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="City, state, or zip code"
              className="pl-9 w-full"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Date Posted
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Past 24 hours</DropdownMenuItem>
              <DropdownMenuItem>Past week</DropdownMenuItem>
              <DropdownMenuItem>Past month</DropdownMenuItem>
              <DropdownMenuItem>Any time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience Level
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Internship</DropdownMenuItem>
              <DropdownMenuItem>Entry level</DropdownMenuItem>
              <DropdownMenuItem>Mid-Senior level</DropdownMenuItem>
              <DropdownMenuItem>Director</DropdownMenuItem>
              <DropdownMenuItem>Executive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Search
          </Button>
        </div>

        {/* Split View Layout */}
        <div className="grid grid-cols-1 md:[grid-template-columns:1fr_1.5fr] gap-6">
          {/* Job Listings */}
          <ScrollArea className="h-[calc(100vh-170px)]">
            <div className="pr-4 relative">
              {/* Siempre mostramos los 3 primeros */}
              <div className="space-y-4">
                {latestOffers?.slice(0, 3).map((job: any) => (
                  <Card
                    key={job.id}
                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer ${
                      selectedJob === job ? "border-primary" : ""
                    }`}
                    onClick={() => handleSelectedInfoJob(job)}
                  >
                    {/* Contenido del card */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company.name}</span>
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{job.address}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Full-time</Badge>
                          <Badge variant="secondary">Remote</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <BookmarkPlus className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Posted{" "}
                        {formatDistanceToNow(new Date(job.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>84 applicants</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Si NO está logeado y hay más de 3 ofertas, agregamos el overlay */}
              {!loggedIn && latestOffers?.length > 3 && (
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none flex justify-center items-center">
                  <span className="text-white font-medium">
                    Inicia sesión para ver más
                  </span>
                </div>
              )}

              {/* Si el usuario está logeado, mostramos el resto de las ofertas */}
              {loggedIn &&
                latestOffers?.slice(3).map((job: any) => (
                  <Card
                    key={job.id}
                    className={`p-6 hover:border-primary/50 transition-colors cursor-pointer ${
                      selectedJob === job ? "border-primary" : ""
                    }`}
                    onClick={() => handleSelectedInfoJob(job)}
                  >
                    {/* Contenido del card */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company.name}</span>
                            <MapPin className="h-4 w-4 ml-2" />
                            <span>{job.address}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Full-time</Badge>
                          <Badge variant="secondary">Remote</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <BookmarkPlus className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Posted{" "}
                        {formatDistanceToNow(new Date(job.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>84 applicants</span>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>

          {/* Job Details - Desktop */}
          <div className="hidden md:block">
            <Card className="">
              <ScrollArea className="h-[calc(100vh-170px)] p-8">
                <JobDetails />
              </ScrollArea>
            </Card>
          </div>

          {/* Job Details - Mobile */}
          <Sheet open={isJobDetailOpen} onOpenChange={setIsJobDetailOpen}>
            <SheetContent side="bottom" className="h-[100vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex justify-between items-center">
                  Job Details
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsJobDetailOpen(false)}
                  >
                    {/*<X className="h-4 w-4"/>*/}
                  </Button>
                </SheetTitle>
              </SheetHeader>
              <JobDetails />
            </SheetContent>
          </Sheet>
        </div>
      </main>

      <Modal
        isOpen={infoApplyModal.isOpen}
        onClose={infoApplyModal.closeModal}
        id="info-apply-modal"
        size="lg"
        title={`Solicitar prácticas en ${selectedJob?.company.name}`}
        closeOnOutsideClick={false}
      >
        <div className="space-y-4 p-4">
          {/* Paso 1: Revisa tus datos */}
          {step === 1 && (
            <>
              <h2 className="text-sm font-semibold">Información de contacto</h2>
              <div className="flex items-center">
                <div>
                  <img
                    src={
                      studentData?.photo_pic ||
                      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
                    }
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ms-4">
                  <p className="font-bold">
                    {studentData?.name + " " + studentData?.surname}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.education[0]?.institute
                      ? `Estudiante de ${studentData?.education[0]?.institute}`
                      : "Sin datos académicos"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.address || "Sin dirección"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <p className="text-sm mb-0 text-gray-600">Email*</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 absolute left-3 text-gray-500" />
                    <Input
                      type="email"
                      value={studentData?.email}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email..."
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="relative">
                  <p className="text-sm mb-0 text-gray-600">
                    Numero de telefono*
                  </p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 absolute left-3 text-gray-500" />
                    <Input
                      type="number"
                      value={studentData?.phone}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Numero de telefono..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={infoApplyModal.closeModal}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleNextStepApplyOffer}
                  disabled={!studentData?.email || !studentData?.phone}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 2: Carta de presentación y disponibilidad */}
          {step === 2 && (
            <>
              <div className="relative">
                <p className="text-sm mb-2 font-bold text-gray-700">
                  Currículum Vitae (CV)*
                </p>
                <label className="relative flex items-center space-x-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 cursor-pointer">
                  <FileText className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    {studentData?.cv_attachment ? (
                      <span className="text-gray-700 truncate">
                        {studentData.cv_attachment.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Arrastra tu CV aquí o haz clic para subir
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        cv_attachment: e.target.files?.[0] || null,
                      })
                    }
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Mantén tu CV actualizado para acceder a las oportunidades más
                  relevantes.
                </p>
              </div>

              <div className="relative mt-6">
                <p className="text-sm mb-2 font-bold text-gray-700">
                  Carta de presentación
                </p>
                <label className="relative flex items-center space-x-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100 cursor-pointer">
                  <FileSignature className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    {studentData?.cover_letter_attachment ? (
                      <span className="text-gray-700 truncate">
                        {studentData.cover_letter_attachment.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Arrastra tu carta de presentación aquí o haz clic para
                        subir
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Una carta personalizada muestra tu entusiasmo y destaca tus
                  fortalezas.
                </p>
              </div>

              <div className="relative mt-6">
                <h2 className="text-sm font-bold text-gray-700 mb-2">
                  Disponibilidad
                </h2>
                <Input
                  value={studentData?.availability}
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      availability: e.target.value,
                    })
                  }
                  placeholder="Ej: Junio – Septiembre, 20 h/semana"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Especifica tu rango temporal y horas disponibles por semana.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button
                  onClick={handleNextStepApplyOffer}
                  disabled={
                    !studentData?.cv_attachment ||
                    !studentData?.cover_letter_attachment ||
                    !studentData?.availability
                  }
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 3: Revisa y envía */}
          {step === 3 && (
            <>
              <h2 className="text-sm font-semibold">Resumen de solicitud</h2>
              <div className="flex items-center">
                <div>
                  <img
                    src={
                      studentData?.photo_pic ||
                      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
                    }
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ms-4">
                  <p className="font-bold">
                    {studentData?.name + " " + studentData?.surname}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.education[0]?.institute
                      ? `Estudiante de ${studentData?.education[0]?.institute}`
                      : "Sin datos académicos"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {studentData?.address || "Sin dirección"}
                  </p>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="grid grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold">
                    Información de contacto
                  </h2>
                  <div className="relative">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.email || "Sin email"}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.phone || "Sin telefono"}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 absolute left-0 text-gray-500" />
                      <div className="pl-6 pr-4 py-2 rounded-sm text-sm">
                        {studentData?.availability || "Sin disponibilidad"}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {/* Documentos */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-semibold">
                      Documentación subida
                    </h3>
                    <div className="flex ">
                      {/* CV Card */}
                      <a
                        href={
                          studentData.cv_attachment
                            ? URL.createObjectURL(studentData.cv_attachment)
                            : "#"
                        }
                        download={studentData.cv_attachment?.name}
                        className="w-32 flex flex-col items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                          <FileText className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="block w-full text-gray-700 text-sm truncate text-center">
                          {studentData.cv_attachment?.name || "CV no subido"}
                        </span>
                      </a>

                      {/* Carta de presentación Card */}
                      <a
                        href={
                          studentData.cover_letter_attachment
                            ? URL.createObjectURL(
                                studentData.cover_letter_attachment
                              )
                            : "#"
                        }
                        download={studentData.cover_letter_attachment?.name}
                        className="w-32 flex flex-col items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                          <FileSignature className="h-6 w-6 text-gray-500" />
                        </div>
                        <span className="block w-full text-gray-700 text-sm truncate text-center">
                          {studentData.cover_letter_attachment?.name ||
                            "Carta no subida"}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <div className="p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <div className="flex justify-between mt-4">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit}>Enviar candidatura</Button>
              </div>
            </>
          )}

          {/* Paso 4: Éxito */}
          {step === 4 && (
            <>
              <div className="text-center mx-20 space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  ¡Solicitud enviada con éxito!
                </h2>
                <p className="text-gray-600">
                  Gracias por confiar en nosotros. Tu candidatura ha sido
                  enviada correctamente.
                </p>
                <p className="text-gray-600">
                  Revisa el estado de tu solicitud en tu perfil cuando quieras,
                  y recibirás un email con cualquier novedad. ¡Mucha suerte!
                </p>
              </div>
              <div className="flex justify-center">
                <Button onClick={infoApplyModal.closeModal}>Entendido</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
