"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import InstitutionClientMe from "./InstitutionClientMe"
import InstitutionClientNotMe from "./InstitutionClientNotMe"

import { Institution } from "'types/institution'"

interface InstitutionClientProps {
  institution: Institution;
  slug: string;
}


export default function InstitutionClient({ institution, slug }: InstitutionClientProps) {
  const { loggedIn } = useContext(AuthContext)

  if (loggedIn) {
    return <InstitutionClientMe institution={institution} />
  }

  return <InstitutionClientNotMe institution={institution} />
}
