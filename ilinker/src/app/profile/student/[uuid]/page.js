
import StudentClient from '@/app/profile/student/[uuid]/StudentClient';
import {apiRequest} from "@/communicationManager/communicationManager";
import StudentDoesntExist from '@/app/profile/student/[uuid]/StudentDoesntExist';

export default async function StudentPage({params}) {

    const uuid = (await params).uuid;

    const response = await apiRequest(`/student/${uuid}`);

    console.log("PAGE DE STUNDET");
    console.table(response);

    if (response.status === 'success') {
        return <StudentClient uuid={uuid} student={response.student}/>
    } else {
        return <StudentDoesntExist/>
    }
}