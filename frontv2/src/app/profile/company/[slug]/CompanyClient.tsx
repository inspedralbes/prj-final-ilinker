"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/services/requests/apiRequest";
import CompanyClientMe from "@/app/profile/company/[slug]/CompanyClientMe";
import CompanyClientNotMe from "@/app/profile/company/[slug]/CompanyClientNotMe";
import { LoaderContext } from "@/contexts/LoaderContext";

export default function CompanyClient({ slug, company }: { slug: string; company: any }) {
  const { userData } = useContext(AuthContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // Estados locales
  const [myCompany, setMyCompany] = useState<boolean>(false);
  const [sectors, setSectors] = useState<any[] | null>(null);
  const [skills, setSkills] = useState<any[] | null>(null);
  const [newCompany, setNewCompany] = useState<any>(company);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mostrar loader global
    console.log("segunda")

    showLoader();

    // Función que hace ambos fetches en paralelo
    async function fetchData() {
      try {
        // Esperamos ambas promesas
        const [respCheck, respPage] = await Promise.all([
          apiRequest("company/checkCompanyUser", "POST", {
            id_user_loged: userData?.id,
            id_company: company.id,
          }),
          apiRequest("page/profile/company"),
        ]);

        // Procesamos respuesta de checkCompanyUser
        if (respCheck) {
          console.log(respCheck)
          setNewCompany(respCheck.company);
          setMyCompany(respCheck.admin);
        }

        // Procesamos respuesta de sectores y skills
        if (respPage?.status === "success") {
          setSectors(respPage.sectors);
          setSkills(respPage.skills);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        // Ocultar loader global y local
        hideLoader();
        setIsLoading(false);
      }
    }

    // Solo ejecutamos si userData e company están definidos
    if (company?.id) {
      fetchData();
    }
  }, [userData, company]);

  // Si sigue cargando, no renderizamos nada o podemos mostrar un placeholder
  if (isLoading) {
    return null;
  }

  return (
    <div>
      {myCompany ? (
        <CompanyClientMe
          company={newCompany}
          sectors={sectors}
          skills={skills}
        />
      ) : (
        <CompanyClientNotMe
          company={newCompany}
          sectors={sectors}
          skills={skills}
        />
      )}
    </div>
  );
}
