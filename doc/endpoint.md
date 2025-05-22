# Endpoints

## /auth/register

Esta ruta se encarga de registrar a los usuarios que se vayan a dar de alta en el front.

El JSON que hay que pasarle es este:

{
"name": "Jheremy",
"surname": "Pinto",
"birthday": "23/04/2005",
"email": "jheremy@company.com",
"password": 1234,
"rol": "company",
//Instituttion
"institutions": {
"name": "Instituto Tecnológico de Innovación",
"NIF": "A12345678",
"type": "Universidad",
"academic_sector": "Ingeniería y Tecnología",
"logo": "https://example.com/logo.png",
"phone": 123456789,
"email": "contacto@iti.edu",
"website": "https://www.iti.edu",
"responsible_phone": 987654321,
"institution_position": "Grados DAM",
"position": "Director",
"address": "Avenida de la Innovación, 123",
"city": "Madrid",
"country": "España",
"postal_code": "28001"
},
//Empresa
"company": {
"name": "Tech Innovations S.A.",
"CIF": "A12345678",
"num_people": 250,
"logo": "https://example.com/logo_tech_innovations.png",
"short_description": "Empresa líder en tecnología e innovación.",
"description": "Tech Innovations S.A. se dedica a la investigación, desarrollo y        comercialización de productos tecnológicos innovadores.",
"email": "contacto@techinnovations.com",
"phone": 987654321,
"website": "https://www.techinnovations.com",
"responsible_phone": 654321987,
"company_position": "CEO",
"address": "Calle de la Innovación, 123",
"city": "Madrid",
"postal_code": 28010,
"country": "España"
},
"student": {
"type_document": "DNI",
"id_document": "12345678A",
"nationality": "Española",
"photo_pic": "https://example.com/photos/juan.jpg",
"birthday": "2000-05-15",
"gender": "Masculino",
"phone": 678901234,
"address": "Calle Falsa 123",
"city": "Madrid",
"country": "España",
"postal_code": "28001",
"languages": [
{
"language": "Español",
"level": "Nativo"
},
{
"language": "Inglés",
"level": "Avanzado"
},
{
"language": "Francés",
"level": "Intermedio"
}
]
}

Luego esta ruta se encargara de ver el rol que se le ponga y con los datos que le habras pasadp por el json se hara tambien la creacion de la empresa, instituto o de estudiante dependiendo del rol



