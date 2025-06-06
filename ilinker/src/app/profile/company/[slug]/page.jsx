import CompanyClient from "@/app/profile/company/[slug]/CompanyClient";
import {apiRequest} from "@/communicationManager/communicationManager";
import CompanyDoesntExist from "@/app/profile/company/[slug]/CompanyDoesntExist";

export default async function CompanyPage({ params }) {
    const slug = (await params).slug

    const response = await apiRequest('company/'+slug)


    if(response.status === 'success'){
        return <CompanyClient slug={slug} company={response.company}/>
    }else{
        return <CompanyDoesntExist />
    }

}