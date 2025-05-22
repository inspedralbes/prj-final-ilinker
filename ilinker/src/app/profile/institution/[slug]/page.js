import React from "react"
import { cookies } from 'next/headers'
import { apiRequest } from "@/communicationManager/communicationManager"
import InstitutionClient from './InstitueClient'
import InstituteDoesntExist from './InstituteDoesntExist'


async function getInstitution(slug) {
    try {
        const response = await apiRequest(
            'institution/custom/' + slug,
            'GET'
        );
        console.log('Institution data received:', response);
        if (response.status === 'error') {
            console.error('Error from backend:', response.message);
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching institution:', error);
        return null;
    }
}

export default async function InstitutionPage({ params }) {
    const { slug } = params;
    const institution = await getInstitution(slug);
    
    console.log('Rendering institution page for:', slug);

    if (!institution) {
        return <InstituteDoesntExist />;
    }

    return <InstitutionClient slug={slug} institution={institution} />;
}
