

import {apiRequest} from "@/services/requests/apiRequest";
import StudentDoesntExist from "@/app/profile/student/[uuid]/StudentDoesntExist";
import StudentClient from '@/app/profile/student/[uuid]/StudentClient';
import { useParams } from "next/navigation";

export default async function StudentPage() {
    // const uuid = (await params).uuid
    const { uuid } = useParams<{ uuid: string }>();

    const response = await apiRequest('student/'+uuid);
    console.log(response)

    if(response.status === 'success'){
        return <StudentClient uuid={uuid} student={response.student} experience_group={response.experience_grouped}/>
    }else{
        return <StudentDoesntExist />
    }

}