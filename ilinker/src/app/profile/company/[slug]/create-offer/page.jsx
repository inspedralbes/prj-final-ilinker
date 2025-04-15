"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/communicationManager/communicationManager";
import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import {
  Building2,
  MapPin,
  GraduationCap,
  Banknote,
  Users,
  Globe,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateOffer() {
  // Usa useParams para capturar el slug de la URL
  const params = useParams();
  const slug = params.slug;

  // Estados para los campos editables
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const { userData } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const router = useRouter();

  const handleSave = () => {
    const newJob = {
      title: jobTitle,
      description: jobDescription,
      company: {
        name: companyName,
        short_description: companyDescription,
        address: companyAddress,
      },
      salary,
    };

    console.log("Guardando nueva oferta:", newJob);
  };

  useEffect(() => {
    showLoader();
    if (!userData) {
      router.push("/login");
    }

    apiRequest("company/" + slug)
      .then((response) => {
        if (response.status === "success") {
          setCompanyName(response.company.name);
          setCompanyDescription(response.company.short_description);
          setCompanyAddress(response.company.address);
        }
      })
      .finally(() => {
        hideLoader();
      });
  }, [userData]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="space-y-6 mt-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            <Input
              className="text-2xl font-bold"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Título de la oferta"
            />
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Building2 className="h-4 w-4" />
            <Input
              className="ml-2"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nombre de la empresa"
            />
            <MapPin className="h-4 w-4 ml-2" />
            <Input
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Dirección de la empresa"
            />
          </div>
          <div className="flex gap-4">
            <Button className="flex-1">Aplicar ahora</Button>
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
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <Input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Rango salarial"
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>Bachelor's degree</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Descripción de la oferta</h3>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            placeholder="Descripción de la oferta"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sobre la empresa</h3>
          <Textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            rows={4}
            placeholder="Descripción de la empresa"
          />
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button onClick={handleSave}>Crear oferta</Button>
        </div>
      </div>
    </div>
  );
}
