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

  const { isOpen, openModal, closeModal } = useModal();
  const loginModal = useModal();
  const signupModal = useModal();
  const alertModal = useModal();
  const infoApplyModal = useModal();

  const handleApplyOffer = () => {
    console.log("apply offer");
    if (!userData) {
      router.push("/login");
      return;
    }

    if (userData.rol === "student") {
      showLoader();
    //   const response = await apiRequest('student/data/' + userData.id);
      infoApplyModal.openModal();
      hideLoader();
      return;
    }

    alert("solo los estudiantes pueden optar a solicitar");
  };
  const handleRedirectLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    showLoader();
    if (!userData) {
      router.push("/auth/login");
    }

    apiRequest("page/search")
      .then((response) => {
        setSelectedJob(response.data[0]);
        setLatestOffers(response.data);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        hideLoader();
      });
  }, [userData, router]);

  //data for the modal to apply
  const [step, setStep] = useState(1);
  const [coverLetter, setCoverLetter] = useState("");
  const [availability, setAvailability] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    showLoader();
    setError(null);

    try {
      const form = new FormData();
      form.append("offer_id", offerId.toString());
      form.append("user_id", userData.id.toString());
      form.append("cover_letter", coverLetter);
      form.append("availability", availability);
      if (resumeFile) form.append("resume", resumeFile);

      //   const res = await apiRequest("application/create", "POST", form);
      // suponemos { status: 'success' }
      //   if (res.status !== "success")
      //     throw new Error(res.message || "Error al enviar");
      next(); // pasa al paso de confirmación
    } catch (err: any) {
      setError(err.message);
    } finally {
      hideLoader();
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
            <Button
              className="flex-1"
              onClick={loggedIn ? handleApplyOffer : handleRedirectLogin}
            >
              Apply now
            </Button>
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
    ) : null;
  };

  useEffect(() => {
    setSelectedInfoJob(selectedJob);
  }, [selectedJob]);

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
                    onClick={() => {
                      setSelectedJob(job);
                      if (window.innerWidth < 768) {
                        setIsJobDetailOpen(true);
                      }
                    }}
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
                    onClick={() => {
                      setSelectedJob(job);
                      if (window.innerWidth < 768) {
                        setIsJobDetailOpen(true);
                      }
                    }}
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
                      userData?.photo_pic ||
                      "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
                    }
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="ms-4">
                  <p className="font-bold">{userData?.name}</p>
                  <p className="text-gray-700 text-sm">
                    {userData?.student?.university
                      ? `Estudiante de ${userData?.student?.university}`
                      : "Sin datos académicos"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {userData?.student?.address || "Sin dirección"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={infoApplyModal.closeModal}>
                  Cancelar
                </Button>
                <Button onClick={next}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Paso 2: Carta de presentación y disponibilidad */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold">2. Carta de presentación</h2>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Escribe aquí tu carta de presentación..."
                rows={5}
              />
              <h2 className="text-xl font-bold mt-4">Disponibilidad</h2>
              <Input
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Ej: Junio–Septiembre, 20h/semana"
              />
              <div className="flex justify-between mt-4">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button onClick={next} disabled={!coverLetter || !availability}>
                  Siguiente
                </Button>
              </div>
            </>
          )}

          {/* Paso 3: Adjunta tu CV (opcional) */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold">3. Adjunta tu CV</h2>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-gray-500">
                Recomendado: PDF con un máximo de 2 MB.
              </p>
              <div className="flex justify-between mt-4">
                <Button variant="secondary" onClick={back}>
                  Atrás
                </Button>
                <Button onClick={next}>Siguiente</Button>
              </div>
            </>
          )}

          {/* Paso 4: Revisa y envía */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-bold">4. Confirmar candidatura</h2>
              <p>Por favor, revisa toda la información antes de enviar:</p>
              <ul className="space-y-2 mt-2">
                <li>
                  <strong>Carta:</strong> {coverLetter.substring(0, 50)}…
                </li>
                <li>
                  <strong>Disponibilidad:</strong> {availability}
                </li>
                <li>
                  <strong>CV:</strong> {resumeFile?.name || "No adjuntado"}
                </li>
              </ul>
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

          {/* Paso 5: Éxito */}
          {step === 5 && (
            <>
              <h2 className="text-xl font-bold text-green-600">
                ¡Candidatura enviada!
              </h2>
              <p>
                Gracias por tu interés. La empresa recibirá tu solicitud y te
                contactará.
              </p>
              <div className="flex justify-end">
                <Button onClick={infoApplyModal.closeModal}>Cerrar</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
