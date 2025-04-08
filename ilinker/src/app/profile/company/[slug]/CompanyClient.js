'use client'

import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/contexts/AuthContext";
import {apiRequest} from "@/communicationManager/communicationManager";
import CompanyClientMe from "@/app/profile/company/[slug]/CompanyClientMe";
import CompanyClientNotMe from "@/app/profile/company/[slug]/CompanyClientNotMe";
export default function CompanyClient({slug, company})
{
    const {userData} = useContext(AuthContext);
    const [myCompany, setMyCompany] = useState(false);
    const [sectors, setSectors] = useState(null);
    const [skills, setSkills] = useState(null);
    const [newCompany, setNewCompany] = useState(company)


    useEffect(() => {
        async function checkCompanyUser (){
            const response = await apiRequest(
                'company/checkCompanyUser',
                'POST',
                {id_user_loged: userData.id, id_company: company.id});

            setMyCompany(response.admin);
            setNewCompany(response.company)
        }

        if(userData !== null)
        {
            checkCompanyUser();
        }

        async function getSectorsSkills (){
            const response = await apiRequest(
                "page/profile/company",
            )

            if(response.status === 'success')
            {
                setSectors(response.sectors)
                setSkills(response.skills)
            }
        }

        getSectorsSkills()
    }, [userData]);



    return (
        <div>
            {myCompany ? (
                <CompanyClientMe company={newCompany} sectors={sectors} skills={skills}/>
            ) : (
                <CompanyClientNotMe company={newCompany}/>
            )}
        </div>
    );
}