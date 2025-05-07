'use client'

import StundentClientMe from './StudentClientMe';
import StundentClientNotMe from './StudentClientNotMe';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from "@/contexts/AuthContext";
import {apiRequest} from "@/services/requests/apiRequest";
import {LoaderContext} from "@/contexts/LoaderContext";

interface StudentClientProps {
    uuid: string;
    student: object;
    experience_group: object;
    offerUser: object
}

export default function StudentClient({uuid, student, experience_group, offerUser}: StudentClientProps) {
    const [myStudent, setMyStudent] = useState<boolean>(false);
    const {userData} = useContext(AuthContext);
    const [allSkills, setAllSkills] = useState(null);
    const {showLoader, hideLoader} = useContext(LoaderContext);


    useEffect(() => {

        async function getAllSkills() {
            showLoader();

            if (userData?.id === student.user.id) {
                setMyStudent(true);
            } else {
                setMyStudent(false);
            }


            try {
                const response = await apiRequest("skills");
                if (response.status === "success") {
                    setAllSkills(response.data);
                }
            } catch (error) {
                console.error("Error al obtener las skills:", error);
            } finally {
                hideLoader();
            }
        }

        getAllSkills();

    }, [userData]);

    if (!allSkills) {
        // no renderices nada hasta que skills esté listo (el loader ya está activo)
        return null;
    }

    return (
        <div>
            {myStudent ? (
                <StundentClientMe uuid={uuid} student={student} experience_group={experience_group} skills={allSkills}
                                  offerUser={offerUser}/>
            ) : (
                <StundentClientNotMe student={student} experience_group={experience_group}/>
            )}
        </div>
    );
}
