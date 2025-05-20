"use client" 

import { useContext, useEffect, useState } from "react" 
import { AuthContext } from "@/contexts/AuthContext" 
import InstitutionClientMe from "./InstitutionClientMe" 
import InstitutionClientNotMe from "./InstitutionClientNotMe" 
import { apiRequest } from "@/services/requests/apiRequest" 
import { LoaderContext } from "@/contexts/LoaderContext" 

interface InstitutionClientProps { 
  institution:  any; 
  slug:  string; 
} 

export default function InstitutionClient({ institution, slug }: InstitutionClientProps) {
  const { loggedIn, userData } = useContext(AuthContext)
  const [isOwner, setIsOwner] = useState(false)
  const { showLoader, hideLoader } = useContext(LoaderContext)
  const [publications, setPublications] = useState<any[] | null>(null);

  useEffect(() => {
    if (loggedIn && userData) {
      showLoader()
      async function checkInstitutionOwner() {
        try {
          const response = await apiRequest("institution/checkOwner", "POST", {
            user_id: userData?.id,
            institution_id: institution.id
          })
          setIsOwner(response.isOwner)

          const response2 = await apiRequest("my-publications", "POST", {
            id: institution.user_id
          })
          setPublications(response2.data)

        } catch (error) {
          console.error("Error checking institution ownership:", error)
          setIsOwner(false)
        } finally {
          hideLoader()
        }
      }
      checkInstitutionOwner()

    }
  }, [loggedIn, userData, institution.id])

  if (!publications) {
    return null
  }

  if (loggedIn && isOwner) {
    return <InstitutionClientMe institution={institution} publications={publications} />
  }

  return <InstitutionClientNotMe institution={institution} publications={publications} />
}
