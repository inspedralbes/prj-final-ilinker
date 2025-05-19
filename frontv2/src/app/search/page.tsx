"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  ChevronDown,
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
  CheckCircle,
  BookmarkCheck,
  Loader2,
  Building2,
  CalendarDays,
  Home,
  Calendar,
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
import AddressAutocomplete from "@/components/address/AddressAutocomplete";
import "@/styles/tiptap-content.scss"

export default function SearchClient() {
  const [latestOffers, setLatestOffers] = useState<any | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
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
        console.log(response);
        handleSelectedInfoJob(response.data.data[0]);
        setLatestOffers(response.data.data);
        setNextPageUrl(response.data.next_page_url);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        hideLoader();
      });
  }, [userData, router]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = () => {
    if (!nextPageUrl) return;
    // opcional: desactivar observer temporalmente para evitar dobles calls
    fetch(nextPageUrl)
      .then(async (res: any) => {
        console.log(res);
        const response = await res.json();
        console.log(response);

        setLatestOffers((prev: any) => [...prev, ...response.data.data]);
        setNextPageUrl(response.data.next_page_url);
      })
      .catch(console.error);
  };

  // Observer que dispara loadMore() cuando el sentinel aparece en pantalla
  useEffect(() => {
    if (!sentinelRef.current || !nextPageUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" } // carga un poco antes de llegar al fondo
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef.current, nextPageUrl]);

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

  const skillsArray: string[] = React.useMemo(() => {
    try {
      return JSON.parse(selectedInfoJob.skills);
    } catch {
      return [];
    }
  }, [selectedInfoJob?.skills]);

  const JobDetails = () => {
    return latestOffers?.length === 0 ? (
      <>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <img
            src="https://st4.depositphotos.com/11953928/25117/v/450/depositphotos_251178766-stock-illustration-cartoon-face-emoticon-caricature-character.jpg"
            alt="No data"
            className="w-24 h-24 mb-2"
          />
          <span className="mt-2 text-muted-foreground">
            Vaya… No encontramos ninguna oferta que coincida con tus criterios.
            Prueba cambiando tu búsqueda o recargando la página.
          </span>
        </div>
      </>
    ) : selectedInfoJob !== null ? (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{selectedInfoJob.title}</h2>
            <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {selectedInfoJob.vacancies}{" "}
              {selectedInfoJob.vacancies === 1 ? "vacante" : "vacantes"}
            </span>
          </div>

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
            {/* <Button variant="outline" size="icon">
              <BookmarkPlus className="h-5 w-5" />
            </Button> */}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {/* Location Type */}
          <div className="flex items-center gap-2 text-sm">
            {selectedInfoJob.location_type === "remoto" && (
              <Globe className="h-5 w-5 text-muted-foreground" />
            )}
            {selectedInfoJob.location_type === "presencial" && (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
            {selectedInfoJob.location_type === "hibrido" && (
              <Home className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="capitalize">{selectedInfoJob.location_type}</span>
          </div>

          {/* Schedule Type */}
          <div className="flex items-center gap-2 text-sm">
            {selectedInfoJob.schedule_type === "full" && (
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}
            {selectedInfoJob.schedule_type === "part" && (
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            )}
            {selectedInfoJob.schedule_type === "negociable" && (
              <Calendar className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="capitalize">
              {selectedInfoJob.schedule_type === "full"
                ? "Jornada completa"
                : selectedInfoJob.schedule_type === "part"
                ? "Jornada parcial"
                : "Negociable"}
            </span>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="h-5 w-5 text-muted-foreground" />
            <span>{selectedInfoJob.salary}</span>
          </div>

          {/* Days per Week */}
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span>
              {selectedInfoJob.days_per_week}{" "}
              {selectedInfoJob.days_per_week === 1 ? "día" : "días"} por semana
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div
            className="prose prose-sm sm:prose lg:prose-lg mx-auto tiptap-content mt-o p-0"
            dangerouslySetInnerHTML={{ __html: selectedInfoJob.description || "" }}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Skills necesarias</h3>
          <div className="flex flex-wrap gap-2">
            {skillsArray.map((skill) => (
              <span
                key={skill}
                className="inline-block bg-black text-white text-xs font-medium px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
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
      //verificar primeramente si esta logg in
      if (!userData) {
        setSelectedJob(job);
        if (window.innerWidth < 768) {
          setIsJobDetailOpen(true);
        }
        return;
      }

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

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState<any>({
    address: "",
    lat: 0,
    lng: 0,
  });
  const [scheduleTypeQuery, setScheduleTypeQuery] = useState<string | null>(
    null
  );
  const [locationTypeQuery, setLocationTypeQuery] = useState<string | null>(
    null
  );
  const [dateQuery, setDateQuery] = useState<string | null>(null);
  const [loaderOfferContainer, setLoaderOfferContainer] = useState(false);

  const filterOffers = () => {
    setLoaderOfferContainer(true);
    try {
      apiRequest("page/search-filtered", "POST", {
        searchQuery,
        locationQuery,
        scheduleTypeQuery,
        locationTypeQuery,
        dateQuery,
      })
        .then((response) => {
          console.log(response);
          if (response.status === "success") {
            if (response.data.data.length > 0) {
              handleSelectedInfoJob(response.data.data[0]);
            }
            setLatestOffers(response.data.data);
            setNextPageUrl(response.data.next_page_url);
          } else {
            toast({
              title: "Error",
              description: "Error al buscar ofertas",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoaderOfferContainer(false);
        });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="">
      {/*<SearchHeader />*/}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-2 mt-3 max-w-7xl">
        {/* Search Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
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
            <AddressAutocomplete
              value={locationQuery.address}
              onChange={(newAddress: any) =>
                setLocationQuery({ address: newAddress })
              }
              onSelect={(address: any) => {
                console.log(address);
                setLocationQuery({
                  address: address.place_name,
                  lat: address.lat,
                  lng: address.lng,
                });
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {scheduleTypeQuery
                  ? scheduleTypeQuery === "full"
                    ? "Jornada completa"
                    : scheduleTypeQuery === "part"
                    ? "Jornada parcial"
                    : "Negociable"
                  : "Todos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScheduleTypeQuery("full")}>
                Jornada completa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScheduleTypeQuery("part")}>
                Jornada parcial
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setScheduleTypeQuery("negociable")}
              >
                Nefociable
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScheduleTypeQuery(null)}>
                Todos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {locationTypeQuery
                  ? locationTypeQuery === "hibrido"
                    ? "Híbrido"
                    : locationTypeQuery === "remoto"
                    ? "Remoto"
                    : "Presencial"
                  : "Todos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLocationTypeQuery("hibrido")}>
                Híbrido
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocationTypeQuery("remoto")}>
                Remoto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLocationTypeQuery("presencial")}
              >
                Presencial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocationTypeQuery(null)}>
                Todos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {dateQuery
                  ? dateQuery === "24"
                    ? "Hace 24 horas"
                    : dateQuery === "week"
                    ? "Hace una semana"
                    : dateQuery === "month"
                    ? "Hace un mes"
                    : "Todos"
                  : "Todos"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDateQuery("24")}>
                Hace 24 horas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateQuery("week")}>
                Hace una semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateQuery("month")}>
                Hace un mes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateQuery(null)}>
                Todos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={filterOffers}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Buscar
          </Button>
        </div>

        {loaderOfferContainer && (
          <div className="flex justify-center items-center h-[calc(100vh-170px)]">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="ml-2">Cargando...</span>
          </div>
        )}

        {latestOffers?.length === 0 && !loaderOfferContainer && (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-170px)] max-w-[400px] mx-auto">
            <img
              src="https://st4.depositphotos.com/11953928/25117/v/450/depositphotos_251178766-stock-illustration-cartoon-face-emoticon-caricature-character.jpg"
              alt="No data"
              className="w-24 h-24 mb-2"
            />
            <span className="mt-2 text-muted-foreground text-center">
              Vaya… No encontramos ninguna oferta que coincida con tus
              criterios. Prueba cambiando tu búsqueda o recargando la página.
            </span>
          </div>
        )}

        {/* Split View Layout */}
        {latestOffers?.length > 0 && !loaderOfferContainer && (
          <div className="grid grid-cols-1 md:[grid-template-columns:1fr_1.5fr] gap-6">
            {/* Job Listings */}
            <ScrollArea className="h-[calc(100vh-170px)]">
              <div className="pr-4 relative">
                {latestOffers?.length === 0 && (
                  <div className="flex flex-col justify-center items-center h-full w-full">
                    <img
                      src="https://st4.depositphotos.com/11953928/25117/v/450/depositphotos_251178766-stock-illustration-cartoon-face-emoticon-caricature-character.jpg"
                      alt="No data"
                      className="w-24 h-24 mb-2"
                    />
                    <span className="mt-2 text-muted-foreground">
                      Vaya… No encontramos ninguna oferta que coincida con tus
                      criterios. Prueba cambiando tu búsqueda o recargando la
                      página.
                    </span>
                  </div>
                )}
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
                            <Badge variant="secondary">
                              {job.schedule_type === "full"
                                ? "Jornada completa"
                                : job.schedule_type === "part"
                                ? "Jornada parcial"
                                : "Negociable"}
                            </Badge>
                            <Badge variant="secondary">
                              {job.location_type === "remoto"
                                ? "Remoto"
                                : job.location_type === "presencial"
                                ? "Presencial"
                                : "Híbrido"}
                            </Badge>
                          </div>
                        </div>
                        {/* <Button variant="ghost" size="icon">
                        <BookmarkPlus className="h-5 w-5" />
                      </Button> */}
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Publicado{" "}
                          {formatDistanceToNow(new Date(job.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>
                          {job.users_interested.length === 0
                            ? "No hay aplicantes"
                            : job.users_interested.length + " aplicantes"}
                        </span>
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
                <div className="space-y-4 mt-5">
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
                              <Badge variant="secondary">
                                {" "}
                                {job.schedule_type === "full"
                                  ? "Jornada completa"
                                  : job.schedule_type === "part"
                                  ? "Jornada parcial"
                                  : "Negociable"}
                              </Badge>
                              <Badge variant="secondary">
                                {job.location_type === "remoto"
                                  ? "Remoto"
                                  : job.location_type === "presencial"
                                  ? "Presencial"
                                  : "Híbrido"}
                              </Badge>
                            </div>
                          </div>
                          {/* <Button variant="ghost" size="icon">
                          <BookmarkPlus className="h-5 w-5" />
                        </Button> */}
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
                          <span>
                            {job.users_interested.length === 0
                              ? "No hay aplicantes"
                              : job.users_interested.length +
                                " aplicantes"}{" "}
                          </span>
                        </div>
                      </Card>
                    ))}
                  <div ref={sentinelRef} />

                  {nextPageUrl && (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </div>
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
        )}
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
