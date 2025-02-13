import {apiRequest} from "@/communicationManager/communicationManager";
import InstituteProfileNotMe from "@/app/profile/institution/InstituteProfileNotMe";
import { InstituteProfileLogin } from '@/app/profile/institution/InstituteProfileLogin';

import RegisterClient from "@/app/register/RegisterClient";


export default async function CompanyProfilePage() {
    // const response =  await apiRequest('page/register');
    
    // if(response.status === 'success')
    // {
    //     console.log("cargado correctamente")
    // }else{
    //     console.log("no cargo bien")
    //     console.log(response)
    // }

    return <InstituteProfileLogin />;
    // return <InstituteProfileNotMe />;
}
