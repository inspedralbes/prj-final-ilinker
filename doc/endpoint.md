# Endpoints

## /api/auth/register

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

## /api/auth/login

Esta ruta es para loguear a un usuario

el JSON que hay que pasarle es este para que el servidor no de error:

{
"email": "pedro2@gmail.com",
"password": 1234
}

## /api/auth/sendRecoveryCode

Esta ruta sirve para enviar un codigo de 8 digitos para cuando no te acuerda de tu contraseña

el JSON que hay que pasarle es esto 

{
"email": "pedro2@gmail.com" 
}

## /api/auth/verifyCode

Ruta para verificar si el codigo que ha introducido el usuario es valido y correcto con el que hemos enviado.

El JSON que hay que pasarle es este:

{
"email": "pedro2@gmail.com",
"code" : "12345678"
}

## /api/auth/resetPassword

Ruta para cambiar la contraseña y poder hacer el login

El JSON que hay que pasarle es este
{
"email": "pedro2@gmail.com",
"code" : "12345678"
"password" : "NEW PASSSWORD"
}

## /api/auth/google

Ruta para poder hacer login con una cuenta de google.

EL JSON que hay que pasarle es este 

{
"email" : "corre@gmail.com"
}

## /api/users/update

Ruta para cambiar alguna informacion del usuario.

El JSON que hay que pasarle son con estos campos

{
"id": 4,
"name": "Pedro2",
"surname": "Lopez",
"birthday": "2004/06/23",
"email": "pedro2@gmail.com"

}

## /api/users/deactivate 

Ruta para desactivar la cuenta de un usuario para no tener que eliminar por si un futuro la necesita.

El JSON que se necesita es con estos campos:

{
"id": 4
}

EL ID del usuario.


## /api/users/activate

Ruta para poder activar la cuenta, esto significa que estara activo para buscar trabajo o ofrecer trabajo.

EL JSON que se necesita con estos campos son estos:

{
"id": 4
}

El ID del usuario

## /apì/users/info

Ruta que devuelve la informacion de un usuario, incluido si tiene algo relacionado
como por ejemplo al ser estudiante te devolvera si tienes proyecto, estudios, skills y experiencia laboral

El JSON que se necesita son con estos campos:

{
"id" : 1
}

el ID del usuario nada más

## /api/company/update

Ruta para modificar datos de la compañia por si se ha cambiado algun datos o se ha equivocado

El JSON que se necesita son con estos campos:

{
"name": "Empresa Ejemplo",
"email": "empresa@example.com",
"phone": "+34 123 456 789",
"address": "Calle Falsa 123, Madrid, España",
"CIF": "B12345678",
"num_people": 50,
"logo": "https://example.com/logo.png",
"short_description": "Empresa líder en tecnología e innovación.",
"description": "Somos una empresa dedicada a la transformación digital, ofreciendo soluciones innovadoras para nuestros clientes.",
"website": "https://example.com",
"responsible_phone": "+34 987 654 321",
"company_position": "CEO",
"city": "Madrid",
"postal_code": "28001",
"country": "España"
}

## /api/company/delete

Ruta para poder eliminar una empresa de la base de datos.

El JSON que se necesita son con estos campos que es el id de la empresa

{
"id" : 1
}

## /api/institution/update

Ruta para actualizar informacion de un instituto en la base de datos

el JSON que se necesita son con estos campos:

{
"id": 1,
"name": "Institución Ejemplo",
"NIF": "12345678X",
"type": "Universidad",
"academic_sector": "Educación Superior",
"logo": "https://example.com/logo.png",
"phone": "+34 600 123 456",
"email": "info@institucion.com",
"website": "https://www.institucion.com",
"responsible_phone": "+34 600 654 321",
"institution_position": "Director",
"address": "Calle Falsa 123, Madrid",
"city": "Madrid",
"country": "España",
"postal_code": "28001"
}

## /api/institution/delete

Ruta para eliminar un instituto de la base de datos 

El JSON que se necesita son con estos campos:

{
"id" : 1
}

## /api/education/create
Ruta para crear los niveles academicos de un estudiante, esta ruta solo esta para 
los que tengan de rol student.

El JSON que se necesita son con estos campos:

{
"student_id": 1,
"courses_id": "",
"institution_id": "",
"institute": "Universidad Nacional de Tecnología",
"degree": "2n de Ingeniería en Sistemas",
"start_date": "01/09/2024",
"end_date": "30/06/2030"
}

o 

{
"student_id": 1,
"courses_id": 2,
"institution_id": 1,
"institute": "",
"degree": "",
"start_date": "01/09/2025",
"end_date": "30/06/2030"
}

lo que pasa aqui es que en el momento que el estudiante vaya a poner sus niveles academicos
y el instituto esta en nuestra base de datos, pues automaticamente se le añade el nombre y lo mismo con
grado que este haciendo.

## /api/education/update

Ruta para actualizar el nivel de educacion del estudiante por se se ha equivocado.

El JSON que se necesita son con estos campos:

{
"id": 2,
"courses_id": 2,
"institution_id": 1,
"institute": "",
"degree": "",
"start_date": "01/09/2024",
"end_date": "30/06/2030"
}
o

{
"student_id": 1,
"courses_id": "",
"institution_id": "",
"institute": "Universidad Nacional de Tecnología",
"degree": "2n de Ingeniería en Sistemas",
"start_date": "01/09/2024",
"end_date": "30/06/2030"
}


es lo mismo que con el create, automaticamente si esta en nuestra base de datos 
lo pilla el nombre y los inserta.

## /api/education/delete

Ruta para poder eliminar un nivel academico por si el estudiante se ha equivocado.

El JSON que se necesita son con estos campos:

{
"id" : 2
}

EL ID del nivel academico

## /api/experience/create

Ruta para poder insertar la experienca laboral de un estudiante, esto tambien solo es para los
que tiene de rol estudiante.

El JSON que se necesita son con estos campos:

{
"student_id" : 1,
"company_id" : "",
"company_name" : "Life Informatica",
"department" : "Motanje",
"employee_type" : "Montaje de equipos y reparaciones",
"company_address" : "Calle Sepulveda 23",
"location_type" : "presencial"
}

o 

{
"student_id" : 1,
"company_id" : 1,
"company_name" : "",
"department" : "Dessarollo",
"employee_type" : "Programador Web",
"company_address" : "",
"location_type" : "presencial"
}

Esto es por si en la empresa que haz trabajado y la encuentras en nuestra app
pues esta lo pilla automaticamente el nombre y lo ingresa en el campo de company_name.

## /api/experience/update

Ruta para actualizar los datos de alguna experiencia que quieras modificar.

El JSON que se necesita son con los campos:

{
"id" : 1,
"company_id" : "",
"company_name" : "Life",
"department" : "Montaje",
"employee_type" : "Montaje de equipos",
"company_address" : "Calle Sepulveda",
"location_type" : "presencial"
}
o
{
"student_id" : 1,
"company_id" : 1,
"company_name" : "",
"department" : "Dessarollo",
"employee_type" : "Programador Web",
"company_address" : "",
"location_type" : "presencial"
}

Aqui pasa lo mismo si esta automaticamente pilla el nombre sino pues el nombre de la empresa que 
ponga el estudiante se agregara al campo de company_name.

## /api/experience/delete

Ruta para eliminar alguna experiencia que el estudiante quiera eliminar.

El JSON que se necesita son con estos campos:

{
"id" : 2
}

El ID de la experiencia.

## /api/projects/create

Ruta para agregar algun proyecto del estudiante para mostrar a aquellas empresas
de lo que es capaz.

EL JSON que se necesita son con estos campos:

{
"user_id": 1,
"name": "Pinturillo2",
"description": "Juego Multijugador de adivinar el dibujo",
"link": "pinturillo22.com",
"pictures": [
"logo.png",
"logo2.png"
],
"end_project": "21/05/2025"
}

## /api/projects/update

Ruta para actualizar la informacion de alguno proyecto que alla puesto 
mal alguna fecha o nombre.

El JSON que se necesita son con estos campos:

{
"id": 2,
"name": "Pinturillo 2",
"description": "Juego Multijugador de adivinar el dibujo incluyendo minijuegos",
"link": "pinturillo2.com",
"pictures": [
"Logo2.png",
"Logo4.png"
],
"end_project": "10/05/2025"
}


## /api/projects/delete

Ruta para eliminar algun proyecto de un estudiante que se alla equivocado.

El JSON que se necesita son con estos campos:

{
"id": 2
}

El ID del proyecto.

## /api/skill/create

Ruta para crear una nueva skill que no este en nuestra base de datos.

El JSON que se necesita son con estos campos:

{
"name": "Montaje de equipos"
}

## /api/skill/assignment

Ruta para asignar skills a un estudiante.

EL JSON que se necesita con estos campos:

{
"student_id": 1,
"skills_id": [
185,
187,
151,
164,
142,
103,
100
]
}

## /api/skill/delete

Ruta para quitar una skill de un estudiante.

El JSON que se necesita son con estos campos:

{
"id": 197
}

EL ID de la skill

## /api/offers/create

Ruta para poder crear ofertas para que los estudiantes o institutos los vean.

EL JSON que se necesita son con estos campos:

{
"company_id": 1,
"title": "Desarrollador Full Stack",
"description": "Buscamos un desarrollador Full Stack con experiencia en Node.js y React.",
"address": "Calle Principal 456",
"city": "Barcelona",
"postal_code": "08001",
"salary": "35000€ - 45000€ anuales"
}

## api/offers/update

Ruta para actualizar alguna oferta por si ha habido algun dato erroneo.

El JSON que se neceista son con estos campos:

{
"company_id": 1,
"title": "Desarrollador Full Stack",
"description": "Buscamos un desarrollador Full Stack con experiencia en Node.js y React.",
"address": "Calle Principal 456",
"city": "Barcelona",
"postal_code": "08001",
"salary": "35000€ - 45000€ anuales"
}

## api/offers/delete

Ruta para eliminar un oferta que ya no este buscando gente de practicas.

EL JSON que se necesita con estos campos:

{
"id" : 1
}

## /api/skills/

Ruta para devolver todas las skills que hay en la base de datos.

No se necesita un JSON ya que es un GET.

## /api/page/register

Ruta para devolver informacion de paises y skills a la hora de poner a registrarse en el front.

No se necesita un JSON ya que es un GET.

## /api/page/search

Ruta para devolver aquellas ofertas que filtras por el fron.

No se necesita un JSON ya que es un GET.


