
# Explicació dels sprints

## Sprint 0: Definició de requisits i MVP
**Objectiu:** Acordar objectius, rols i estructura inicial del projecte.

### Tasques principals:
- Discussió sobre la idea del projecte → Tot l’equip
- Creació del repositori de GitHub → Alumnes backend
- Instal·lació inicial de Docker i Laravel → Backend 
- Configuració de TAIGA i redacció d’epics / user stories → Tot l’equip

## Sprint 1: Autenticació i base de dades (20/01/25 - 31/01/25)
**Objectiu:** Configurar entorn, base de dades i sistema d'autenticació.

### Tasques principals:

**Backend:**
- Configuració completa de Docker 
- Creació de models, factories, controllers, seeders i migracions
- Funcions de login i registre 
- Sistema de canviar contrasenya via codi 
- Test amb Postman per validar el canvi de contrasenya 

**Frontend:**
- Disseny del navbar responsive 
- Form de registre amb steps segons el rol 
- Disseny i primeres pantalles de login 

**Tests d'usuaris:**
- Validació de login i contrasenya amb Postman.
- Prova de registre amb rols diferents.

## Sprint 2: Cerca i filtre de pràctiques (03/02/25 - 14/02/25)
**Objectiu:** Implementar cerca d’empreses, perfils i integració amb login de Google.

### Tasques principals:

**Backend:**
- Endpoints per a perfils i cerca d’empreses 
- Login amb Google (API, backend, auth flow) 

**Frontend:**
- Pàgina de cerca d'empreses amb URL slugs 
- Mockups i disseny del perfil de company 
- Front-end del login amb Google

**Fullstack:**
- Publicació en Clouding i configuració DNS 
- Proxy invers per servir frontend i API 

**Tests d’usuaris:**
- Login amb Google testejat manualment
- Comprovació de cerca i visualització de perfils

## Sprint 3: Perfil d'usuari i institucions (31/03/25 - 06/04/25)
**Objectiu:** Desplegar perfils complets (estudiant, empresa, institució) i millorar experiència usuari.

### Tasques principals:

**Frontend:**
- Responsive del navbar
- Creació del perfil d’estudiant i institució

**Backend:**
- Taules i models per admin i control d’usuaris reportats 
- Inserció de dades d’estudis i experiència d’estudiants 

**Tests d’usuaris:**
- Validació del perfil d’estudiant i institucions (manual)

## Sprint 4: Migració i funcionalitats completes (22/04/25 - 02/05/25)
**Objectiu:** Migració de projecte i finalitzar flux de crear oferta → aplicar → acceptar.

### Tasques principals:

**Backend:**
- Migració completa a nou projecte → Tots
- Creació d’ofertes i aplicacions → Persona 2
- Acceptar / rebutjar alumnes + notificació → Persona 2
- Taules de missatges i publicacions → Persona 4

**Frontend:**
- Disseny mobile del perfil 
- Comunicació i publicacions 

**Tests d’usuaris:**
- Flux complet testejat: oferta → aplicació → acceptació

## Sprint 5: Xarxa social i geolocalització (05/05/25 - 12/05/25)
**Objectiu:** Missatgeria, bookmarks, publicacions i funcionalitats de xarxa.

### Tasques principals:

**Backend:**
- Publicació de contingut, likes, guardar i compartir 
- Sistema de follow entre usuaris 
- Implementació de Mapbox i geolocalització 

**Frontend:**
- Mostrar perfils i publicacions amb estil millorat 
- Autocompletat d’adreces i buscador per coordenades 

**Tests d’usuaris:**
- Test intern de publicacions i geolocalització
- Validació de perfils, imatges i seguiment d’usuaris

## Observacions finals
S’han realitzat múltiples test de validació interna amb Postman, el frontend i comprovacions manuals entre usuaris del grup.

El projecte ha anat evolucionant amb més funcionalitats socials, oferint un ecosistema complet de pràctiques, comunicació i gestió de perfils.
