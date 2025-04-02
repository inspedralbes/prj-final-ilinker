// src/app/profile/institution/[uuid]/InstitueClient.js
'use client'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/communicationManager/communicationManager";
import InstitutionClientMe from "./InstitutionClientMe";
import InstitutionClientNotMe from "./InstitutionClientNotMe";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InstitutionClient({ slug, institution }) {
    const { userData } = useContext(AuthContext);
    const [myInstitution, setMyInstitution] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkInstitutionUser() {
            try {
                if (!userData) {
                    setMyInstitution(false);
                    setIsLoading(false);
                    return;
                }
                
                const response = await apiRequest(
                    'institution/checkInstitutionUser',
                    'POST',
                    { 
                        id_user_loged: userData.id, 
                        id_institution: institution.id 
                    }
                );
                
                setMyInstitution(response.admin);
                setIsLoading(false);
            } catch (error) {
                console.error('Error checking institution user:', error);
                setMyInstitution(false);
                setIsLoading(false);
            }
        }
        checkInstitutionUser();
    }, [userData, institution.id]);

    if (isLoading) {
        return (
            <Card className="w-full max-w-4xl mx-auto mt-6">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-[250px]" />
                        <Skeleton className="h-4 w-[300px]" />
                    </div>
                    <div className="mt-8 space-y-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[90%]" />
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div>
            {myInstitution ? (
                <InstitutionClientMe institution={institution} />
            ) : (
                <InstitutionClientNotMe institution={institution} />
            )}
        </div>
    );
}