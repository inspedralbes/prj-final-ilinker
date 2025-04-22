"use client";
import { useContext, useState, useEffect } from "react";
import { Building2, MapPin, Globe, Users } from "lucide-react";
import ApplicantCard from "@/components/profile/company/offer/ApplicantCard";

import { useParams } from "next/navigation";
import {useRouter} from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import { apiRequest } from "@/services/requests/apiRequest";

// Mock data - replace with your actual API calls
interface Applicant {
  id: number;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  education: string;
  skills: string[];
  competencies: string[];
}

const mockOffer = {
  id: 1,
  title: "Desarrollador Backend PHP",
  company: "Tech Solutions S.L.",
  address: "Calle Innovación 10",
  locationType: "hybrid",
  salary: "30.000 - 40.000 EUR",
  description:
    "<p>Buscamos un desarrollador backend con experiencia en PHP y Laravel...</p>",
  skills: ["PHP", "Laravel", "MySQL", "API REST"],
  created_at: "2024-04-16T12:55:43Z",
};
const mockApplicants: Applicant[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@email.com",
    status: "pending",
    appliedAt: "2024-04-17T10:30:00Z",
    education: "Grado en Ingeniería Informática",
    skills: ["PHP", "JavaScript", "MySQL", "Git"],
    competencies: [
      "Trabajo en equipo",
      "Resolución de problemas",
      "Comunicación efectiva",
    ],
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    status: "accepted",
    appliedAt: "2024-04-16T15:45:00Z",
    education: "Máster en Desarrollo Web",
    skills: ["PHP", "Laravel", "Vue.js", "Docker"],
    competencies: ["Liderazgo", "Gestión del tiempo", "Pensamiento analítico"],
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura.martinez@email.com",
    status: "rejected",
    appliedAt: "2024-04-16T09:15:00Z",
    education: "Grado en Desarrollo de Software",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    competencies: ["Adaptabilidad", "Aprendizaje continuo", "Trabajo autónomo"],
  },
];

export default function OfferDetail() {
  const { id } = useParams<{ slug: string }>();
  const router = useRouter();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { userData } = useContext(AuthContext);
  const [offer, setOffer] = useState(mockOffer);
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);

  const updateApplicantStatus = (
    applicantId: number,
    newStatus: "accepted" | "rejected"
  ) => {
    setApplicants(
      applicants.map((applicant) =>
        applicant.id === applicantId
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
  };

  useEffect(() => {
      showLoader();
      if (!userData) {
        router.push("/auth/login");
      }

      apiRequest(`offers/${id}`)
      .then((response)=>{
        if(response.status === 'success'){
          console.log(response)
          response.offer.skills = JSON.parse(response.offer.skills);
          setOffer(response.offer);
        }
      }).catch((err) =>{
        console.error(err)
      }).finally(()=>{
        hideLoader();
      })
  
    }, [userData]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => console.log("volver a ofertas")}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
      >
        ← Volver a ofertas
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Users className="w-4 h-4 mr-1" />
              {applicants.length} candidatos
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Building2 className="flex-shrink-0 mr-2 h-5 w-5" />
              {offer.company}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="flex-shrink-0 mr-2 h-5 w-5" />
              {offer.address}
            </div>
            <div className="flex items-center text-gray-600">
              <Globe className="flex-shrink-0 mr-2 h-5 w-5" />
              {offer.locationType === "remoto"
                ? "Remoto"
                : offer.locationType === "hibrido"
                ? "Híbrido"
                : "Presencial"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Habilidades requeridas
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {offer.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
            <div
              className="mt-2 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: offer.description }}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Candidatos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onStatusUpdate={updateApplicantStatus}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
