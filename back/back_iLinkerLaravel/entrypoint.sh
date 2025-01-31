#!/bin/bash
# entrypoint.sh: Configura el entorno e inicia el servidor Laravel.

# Dar permisos a la carpeta de almacenamiento y caché
chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Instalar dependencias y migrar la base de datos
composer install
php artisan key:generate
php artisan migrate:fresh

# Iniciar el servidor
php artisan serve --host=0.0.0.0 --port=8000
