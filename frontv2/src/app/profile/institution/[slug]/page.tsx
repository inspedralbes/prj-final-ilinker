"use client";
import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "@/services/requests/apiRequest";
import InstitutionClient from "./InstitueClient";
import InstituteDoesntExist from "./InstituteDoesntExist";
import { LoaderContext } from "@/contexts/LoaderContext";
import { useParams } from "next/navigation";

interface Institution {
  id: number;
  name: string;
  slug?: string;
  slogan?: string;
  about?: string;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  type?: string;
  academic_sector?: string;
  size?: string;
  founded_year?: string;
  languages?: string[] | string;
  specialties?: string[];
  certifications?: Array<{
    id: number;
    name: string;
    issuedBy: string;
    year: string;
  }>;
  logo?: string;
  logo_url?: string;
  cover?: string;
  cover_url?: string;
  sector?: string;
}

export default function InstitutionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { hideLoader, showLoader } = useContext(LoaderContext);
  const [institution, setInstitution] = useState<Institution | null>(null);
  useEffect(() => {
    showLoader();
    apiRequest(`institution/${slug}`)
      .then((response) => {
        setInstitution(response.data);
        console.log(response.data)
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        hideLoader();
      });
  }, []);

  console.log("Rendering institution page for:", slug);

  if (!institution) {
    return <InstituteDoesntExist />;
  }

  return <InstitutionClient slug={slug} institution={institution} />;
}
