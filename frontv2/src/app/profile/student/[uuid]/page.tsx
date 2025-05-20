"use client"; 
 
import {apiRequest} from "@/services/requests/apiRequest"; 
import StudentDoesntExist from "@/app/profile/student/[uuid]/StudentDoesntExist"; 
import StudentClient from '@/app/profile/student/[uuid]/StudentClient'; 
import { useParams } from "next/navigation"; 
import { useEffect, useState } from "react"; 
import { useContext } from "react"; 
import { LoaderContext } from "@/contexts/LoaderContext"; 
 
export default function StudentPage() {  
    // const uuid = (await params).uuid 
    const { uuid } = useParams<{ uuid: string }>(); 
    const { showLoader, hideLoader } = useContext(LoaderContext); 
    const [response, setResponse] = useState<any>(null);  
 
    useEffect(()=>{ 
        showLoader(); 
        apiRequest('student/'+uuid) 
            .then((response) => { 
                setResponse(response) 
            }) 
            .catch((e) => { 
                console.error(e); 
            }) 
            .finally(() => { 
                hideLoader(); 
            }); 
    },[]); 
 
    if(response){ 
        return <StudentClient uuid={uuid} student={response.student}  experience_group={response.experience_grouped} offerUser={response.offerUser}/>
    }else{ 
        return <StudentDoesntExist /> 
    } 
 
} 
