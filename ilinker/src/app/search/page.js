import {apiRequest} from "@/communicationManager/communicationManager";
import SearchClient from "@/app/search/SearchClient";

export default async function SearchPage() {
    const response =  await apiRequest('page/search');

    if(response.status === 'success')
    {
        console.log("cargado correctamente")
        console.log(response)
    }else{
        console.log("no cargo bien")
        console.log(response)
    }

    return <SearchClient latestOffers={response.data} />;
}
