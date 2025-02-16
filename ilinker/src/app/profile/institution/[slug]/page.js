import React from "react";
import { cookies } from 'next/headers';
import { apiRequest } from "@/communicationManager/communicationManager";
import InstitutionClientMe from "@/app/profile/institution/[slug]/InstitutionClientMe";
import InstitutionClientNotMe from "@/app/profile/institution/[slug]/InstitutionClientNotMe";
// import InstitutionClient from "@/app/profile/institution/[slug]/InstitutionClient";
// import InstituteDoesntExist from "@/app/profile/institution/[slug]/InstituteDoesntExist";
import RegisterClient from "@/app/register/RegisterClient";
import InstitutionClient from './InstitueClient';
import InstituteDoesntExist from './InstituteDoesntExist';


// export default async function CompanyProfilePage() {
//         // const response =  await apiRequest('page/register');

//     // Cambia el return según la vista que quieras mostrar
//     return <InstitutionClientMe />;

//     // return <InstitutionClientNotMe />;
//     // return <InstituteDoesntExist />;
// }



async function getInstitution(slug) {
    try {
        const response = await apiRequest(
            'institution/' + slug,
            'GET'
        );
        return response;
    } catch (error) {
        console.error('Error fetching institution:', error);
        return null;
    }
}

export default async function InstitutionPage({ params }) {
    const { slug } = params;
    const institution = await getInstitution(slug);
    
    if (!institution) {
        return <InstituteDoesntExist />;
    }

    return <InstitutionClient slug={slug} institution={institution} />;
}