import {apiRequest} from "@/communicationManager/communicationManager";
import SearchClient from "@/app/search/SearchClient";

export default async function SearchPage() {
    const response =  await apiRequest('page/search');

    if(response.status === 'success')
    {
        console.log("cargado correctamente")
    }else{
        console.log("no cargo bien")
    }

    return <SearchClient latestOffers={response.data} />;
}
