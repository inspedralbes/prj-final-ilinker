import React from "react"
import { cookies } from 'next/headers'
import { apiRequest } from "@/services/requests/apiRequest"
import InstitutionClient from './InstitueClient'
import InstituteDoesntExist from './InstituteDoesntExist'

interface Institution {
  id: number;
  name: string;
  slug?: string;
  slogan?: string;
  about?: string;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  type?: string;
  academic_sector?: string;
  size?: string;
  founded_year?: string;
  languages?: string[] | string;
  specialties?: string[];
  certifications?: Array<{
    id: number;
    name: string;
    issuedBy: string;
    year: string;
  }>;
  logo?: string;
  logo_url?: string;
  cover?: string;
  cover_url?: string;
  sector?: string;
}

async function getInstitution(slug: string): Promise<Institution | null> {
    try {
        const response = await apiRequest(
            'institution/' + slug,
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

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function InstitutionPage({ params }: PageProps) {
    const { slug } = params;
    const institution = await getInstitution(slug);
    
    console.log('Rendering institution page for:', slug);

    if (!institution) {
        return <InstituteDoesntExist />;
    }

    return <InstitutionClient slug={slug} institution={institution} />;
}
