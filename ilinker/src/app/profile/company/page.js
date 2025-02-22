"use client"

import {apiRequest} from "@/communicationManager/communicationManager";
import CompanyProfileMeClient from "@/app/profile/company/CompanyProfileMeClient";
import {AuthContext} from "@/contexts/AuthContext";
import {useContext, useEffect, useRef, useState} from "react";
import CompanyProfileNotMeClient from "@/app/profile/company/CompanyProfileNotMe";


export default function CompanyProfilePage() {

    const {loggedIn ,userData, logout} = useContext(AuthContext);

    if (!loggedIn) {
        return <p>Cargando...</p>; // Puedes poner un loader aquí si lo deseas
    }

    return userData.rol === "company" ? <CompanyProfileMeClient /> : <CompanyProfileNotMeClient />;

}
