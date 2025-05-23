# Manual d'Instal·lació i Execució Local – iLinker

Aquest document serveix com a guia per a desenvolupadors que vulguin posar en marxa el projecte **iLinker** en un entorn local.

---

## Requisits previs

Abans de començar, assegura't de tenir instal·lats els següents programes:

- Docker i Docker Compose
- Git
- Node.js (versió 16 o superior)
- Composer
- Laravel Echo Server (només si vols sockets actius en local)

---

## Estructura del projecte

```
/ilink
├── backend        → Laravel (API REST + Websockets)
├── frontend       → React (interfície d'usuari)
├── docker         → Configuració dels contenidors
```

---

## Posar en marxa el Backend (Laravel)

1. Clona el repositori:

```bash
git clone https://github.com/usuari/ilinker.git
cd ilink/backend
```

2. Còpia del fitxer d'entorn i configuració:

```bash
cp .env.example .env
```

3. Torna a la carpeta principal i aixeca els contenidors:

```bash
cd ..
docker-compose up -d --build
```

4. Entra al contenidor del backend i prepara l'entorn Laravel:

```bash
docker exec -it backend-app bash
composer install
php artisan key:generate
php artisan migrate --seed
```

5. Per activar els sockets, cal tenir Redis i Laravel Echo configurats:

```bash
npm install -g laravel-echo-server
laravel-echo-server start
```

*Recorda comprovar que `.env` té configurat `BROADCAST_DRIVER=redis` i `QUEUE_CONNECTION=redis`.*

---

## Posar en marxa el Frontend (React)

1. Ves a la carpeta del frontend:

```bash
cd frontend
```

2. Còpia del fitxer d'entorn:

```bash
cp .env.example .env
```

3. Instal·la les dependències:

```bash
npm install
```

4. Executa l'entorn de desenvolupament:

```bash
npm run dev
```

La interfície estarà disponible a `http://localhost:3000`.

---

## Verificacions i proves

- L'API Laravel respon a `http://localhost:8000/api`
- El frontend funciona correctament amb connexió a l'API
- Els sockets han de transmetre notificacions en temps real
- Pots fer proves amb Postman per validar rutes protegides, autenticació, etc.

---

## Parar l'entorn

```bash
docker-compose down
```

---

## Notes finals

- Per funcionalitats com Mapbox (geolocalització), cal incloure la teva clau API al `.env` del frontend.
- Si fas servir Google OAuth, recorda afegir les claus `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` al backend i frontend.

---

Qualsevol dubte o incidència, posa’t en contacte amb un membre de l’equip tècnic o consulta el repositori del projecte.
