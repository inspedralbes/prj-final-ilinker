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
        const cookieStore = await cookies();
        const token = cookieStore.get('authToken')?.value;
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${apiUrl}/institution/${slug}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error from backend:', errorData.message);
            return null;
        }

        const data = await response.json();
        console.log('Institution data received:', data);
        return data.data;
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
    const slug = await params.slug;
    const institution = await getInstitution(slug);
    
    console.log('Rendering institution page for:', slug);

    if (!institution) {
        return <InstituteDoesntExist />;
    }

    return <InstitutionClient slug={slug} institution={institution} />;
}
