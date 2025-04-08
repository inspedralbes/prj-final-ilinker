import {apiRequest} from "@/communicationManager/communicationManager";
import RegisterClient from "@/app/register/RegisterClient";

export default async function RegisterPage() {
    const response =  await apiRequest('page/register');

    if(response.status === 'success')
    {
        console.log("cargado correctamente")
    }else{
        console.log("no cargo bien")
        console.log(response)
    }

    return <RegisterClient countries={response.countries} sectors={response.sectors} />;
}
