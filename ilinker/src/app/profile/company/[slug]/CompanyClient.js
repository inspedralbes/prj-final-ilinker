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
    useEffect(() => {
        async function checkCompanyUser (){
            const response = await apiRequest(
                'company/checkCompanyUser',
                'POST',
                {id_user_loged: userData.id, id_company: company.id});

            console.log(response);
            setMyCompany(response.admin);
        }

        if(userData !== null)
        {
            checkCompanyUser();
        }
    }, [userData]);


    useEffect(()=>{
        console.log(myCompany)
    }, [myCompany])
    return (
        <div>
            {myCompany ? (
                <CompanyClientMe company={company}/>
            ) : (
                <CompanyClientNotMe company={company}/>
            )}
        </div>
    );
}