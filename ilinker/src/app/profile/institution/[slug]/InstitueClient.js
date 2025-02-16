'use client'

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/communicationManager/communicationManager";
import InstitutionClientMe from "@/app/profile/institution/[slug]/InstitutionClientMe";
import InstitutionClientNotMe from "@/app/profile/institution/[slug]/InstitutionClientNotMe";
import { set } from "react-hook-form";

export default function InstitutionClient({ slug, institution }) {
    const { userData } = useContext(AuthContext);
    const [myInstitution, setMyInstitution] = useState(false);
    useEffect(()=> {
        async function checkInstitutionUser() {
            const response = await apiRequest(
                'company/checkInstitutionUser',
                'POST',
                { id_user_loged: userData.id, id_institution: institution.id });

            console.log(response);
            setMyInstitution(response.admin);
        }

        if (userData !== null) {
            checkInstitutionUser();
        }
    }, [userData]);

    useEffect(() => {
        console.log(myInstitution);
    }, [myInstitution])
    return(
        <div>
            {myInstitution ? (
                <InstitutionClientMe institution={institution}/>
            ) : (
                <InstitutionClientNotMe institution={institution}/>
            )}
        </div>
    )    
}