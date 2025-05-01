"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Euro,
  Globe,
  X,
  Plus,
  Clock,
  Calendar
} from "lucide-react";
import SkillsInput from "@/components/profile/company/create-offer/SkillsInput";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/requests/apiRequest";
import { useToast } from "@/hooks/use-toast";

interface OfferFormData {
  title: string;
  company: string;
  address: string;
  city: string;
  postal_code: number;
  location_type: "remoto" | "hibrido" | "presencial";
  schedule_type: "full" | "part" | "negociable";
  salary: string;
  description: string;
  skills: string[];
  days_per_week: number;
}

export default function CreateOffer() {
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    company: userData?.company?.name || "",
    address: "Calle Innovación 10",
    city: "",
    postal_code: 0,
    location_type: "hibrido",
    schedule_type: "full",
    salary: "30.000 - 40.000 EUR",
    description: "",
    skills: [],
    days_per_week: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();
    console.log("Form submitted:", formData);
    const response = await apiRequest("offers/create", "POST", formData);
    if (response.status === "success") {
      hideLoader();
      toast({
        title: "¡Oferta publicada con éxito!",
        description: "Tu oferta ya está disponible para los usuarios.",
        variant: "success",
      });
    } else {
      hideLoader();
      console.log(response);
      toast({
        title: "Error al publicar la oferta",
        description: "Hubo un error al publicar la oferta.",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    showLoader();
    if (!userData) {
      router.push("/auth/login");
    }

    setFormData({
      title: "",
      company: userData?.company?.name || "",
      address: userData?.company?.address || "",
      city: userData?.company?.city || "",
      postal_code: userData?.company?.postal_code || 0,
      location_type: "hibrido",
      schedule_type: "full",
      salary: "30.000 - 40.000 EUR",
      description: "",
      skills: [],
      days_per_week: 5,
    });

    hideLoader();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Crear Nueva Oferta de Prácticas
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título de la oferta */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título de la oferta
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Desarrollador Backend PHP"
                  />
                </div>
              </div>

              {/* Empresa (no editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Empresa
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.company}
                    disabled
                    className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tipo de trabajo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modalidad de trabajo
                </label>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  {["remoto", "hibrido", "presencial"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          location_type: type as
                            | "remoto"
                            | "hibrido"
                            | "presencial",
                        })
                      }
                      className={`
                        flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium
                        ${
                          formData.location_type === type
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {type === "remoto"
                        ? "Remoto"
                        : type === "hibrido"
                        ? "Híbrido"
                        : "Presencial"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de jornada */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de jornada
                </label>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  {[
                    { value: "full", label: "Completa" },
                    { value: "part", label: "Media" },
                    { value: "negotiable", label: "Negociable" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          schedule_type: value as "full" | "part" | "negociable",
                        })
                      }
                      className={`
                      flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium
                      ${
                        formData.schedule_type === value
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Días por semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Días por semana
                </label>
                <div className="mt-1 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, days_per_week: days })
                      }
                      className={`
                      flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium
                      ${
                        formData.days_per_week === days
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango salarial */}
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rango salarial
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Euro className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="salary"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Habilidades requeridas
                </label>
                <div className="mt-1">
                  <SkillsInput
                    skills={formData.skills}
                    onChange={(skills) => setFormData({ ...formData, skills })}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción de la oferta
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Crear oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
