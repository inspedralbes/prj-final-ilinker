import InstitutionClientMe from "@/app/profile/institution/[slug]/InstitutionClientMe";
import InstitutionClientNotMe from "@/app/profile/institution/[slug]/InstitutionClientNotMe";
import InstituteDoesntExist from "@/app/profile/institution/[slug]/InstituteDoesntExist";
import RegisterClient from "@/app/register/RegisterClient";


export default async function CompanyProfilePage() {
        // const response =  await apiRequest('page/register');

    // Cambia el return según la vista que quieras mostrar
    return <InstitutionClientMe />;

    // return <InstitutionClientNotMe />;
    // return <InstituteDoesntExist />;
}
