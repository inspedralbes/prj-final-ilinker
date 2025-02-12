import {apiRequest} from "@/communicationManager/communicationManager";
import RegisterClient from "@/app/register/RegisterClient";
import CompanyProfileMeClient from "@/app/profile/company/CompanyProfileMeClient";
import InstituteProfileNotMe from "@/app/profile/institution/InstituteProfileNotMe";


export default async function CompanyProfilePage() {
    // const response =  await apiRequest('page/register');
    //
    // if(response.status === 'success')
    // {
    //     console.log("cargado correctamente")
    // }else{
    //     console.log("no cargo bien")
    //     console.log(response)
    // }

    return <InstituteProfileNotMe />;
}
