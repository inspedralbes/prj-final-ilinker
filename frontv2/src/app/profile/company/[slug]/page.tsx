"use client";

import { useContext, useEffect, useState } from "react";
import CompanyClient from "@/app/profile/company/[slug]/CompanyClient";
import CompanyDoesntExist from "@/app/profile/company/[slug]/CompanyDoesntExist";
import { apiRequest } from "@/services/requests/apiRequest";
import { LoaderContext } from "@/contexts/LoaderContext";
import { useParams } from "next/navigation";

type Props = {
  params: { slug: string };
};

type CompanyResponse = {
  status: "success" | string;
  company?: any;
};

export default function CompanyPage() {
    const { slug } = useParams<{ slug: string }>();

  const [companyData, setCompanyData] = useState<CompanyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {showLoader, hideLoader} = useContext(LoaderContext);

  useEffect(() => {
    showLoader();
    async function fetchCompany() {
      try {
        console.log("inicio")
        const response = await apiRequest(`company/${slug}`);
        console.log(response)
        setCompanyData(response);
      } catch (err: any) {
        console.error("Error fetching company:", err);
        setError(err.message || "Error desconocido");
      } finally {
        hideLoader();
      }
    }

    fetchCompany();

    
  }, [slug]);

 

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (companyData?.status === "success" && companyData.company) {
    return <CompanyClient slug={slug} company={companyData.company} />;
  }

  return <CompanyDoesntExist />;
}
