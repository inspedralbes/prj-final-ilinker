"use client"

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import InstitutionClientMe from "./InstitutionClientMe"
import InstitutionClientNotMe from "./InstitutionClientNotMe"

export default function InstitutionClient({ institution, slug }) {
  const { loggedIn } = useContext(AuthContext)

  if (loggedIn) {
    return <InstitutionClientMe institution={institution} />
  }

  return <InstitutionClientNotMe institution={institution} />
}
