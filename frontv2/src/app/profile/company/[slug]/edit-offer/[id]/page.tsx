"use client";
import { useContext, useState, useEffect } from "react";
import { Building2, MapPin, Globe, Users, Clock } from "lucide-react";
import ApplicantCard from "@/components/profile/company/offer/ApplicantCard";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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


export default function OfferDetail() {
  const { id } = useParams<{ slug: string; id: string }>();
  const router = useRouter();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { userData } = useContext(AuthContext);
  const [offer, setOffer] = useState<any>(null);
  const [applicants, setApplicants] = useState<Applicant[] | null>(null);

  const handleStatusUpdate = (id: number, status: "accept" | "rejected") => {
    console.log(`Applicant ${id} status updated to ${status}`);
    showLoader();
    apiRequest("offers/apply/update/status", "POST", {
      user_id: id,
      offer_id: offer.id,
      status: status,
    })
      .then((response) => {
        console.log(response);
        if (response.status === "success") {
          response.offer.skills = JSON.parse(response.offer.skills);
          setOffer(response.offer);
          setApplicants(response.offer.users_interested);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        hideLoader();
      });
  };

  useEffect(() => {}, [applicants]);

  useEffect(() => {
    showLoader();
    if (!userData) {
      router.push("/auth/login");
    }

    apiRequest(`offers/${id}`)
      .then((response) => {
        if (response.status === "success") {
          console.log(response);
          response.offer.skills = JSON.parse(response.offer.skills);
          setOffer(response.offer);
          setApplicants(response.offer.users_interested);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        hideLoader();
      });
  }, [userData]);

  if (!offer) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Users className="w-4 h-4 mr-1" />
              {applicants?.length} candidatos
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Building2 className="flex-shrink-0 mr-2 h-5 w-5" />
              {offer.company?.name}
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
            <div className="flex items-center text-gray-600">
              <Clock className="flex-shrink-0 mr-2 h-5 w-5" />
              {offer.schedule_type === "full"
                ? "Jornada Completa"
                : offer.schedule_type === "part"
                ? "Jornada Media"
                : "Negociable"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Habilidades requeridas
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {offer.skills.map((skill: any) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-black text-white"
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
              {applicants?.map((applicant: any, index: number) => (
                <ApplicantCard
                  key={index}
                  applicant={applicant}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}

              {applicants?.length === 0 && (
                <p className="text-gray-600">No hay candidatos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
