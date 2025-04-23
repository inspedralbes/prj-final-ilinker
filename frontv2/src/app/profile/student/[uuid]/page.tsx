

import {apiRequest} from "@/services/requests/apiRequest";
import StudentDoesntExist from "@/app/profile/student/[uuid]/StudentDoesntExist";
import StudentClient from '@/app/profile/student/[uuid]/StudentClient';
export default async function StudentPage({ params }: { params: { uuid: string } }) {
    const uuid = (await params).uuid

    const response = await apiRequest('student/'+uuid);
    console.log(response)

    if(response.status === 'success'){
        return <StudentClient uuid={uuid} student={response.student}/>
    }else{
        return <StudentDoesntExist />
    }

}